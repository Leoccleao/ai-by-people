-- Plataforma VOD do Roadshow de IA — MVP (PRD v1.0)
-- Reexecutável de ponta a ponta: rodar de novo não quebra nem duplica nada.
-- Conteúdo por LOB (webinar + follow along), acesso por convite e por domínio,
-- office hours, webinar sob demanda, histórias de sucesso e engajamento.

-- ---------------------------------------------------------------- enums

do $$ begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('participant', 'admin');
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_type where typname = 'user_origin') then
    create type public.user_origin as enum ('invite', 'self_signup');
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_type where typname = 'content_status') then
    create type public.content_status as enum ('published', 'coming_soon');
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_type where typname = 'engagement_type') then
    create type public.engagement_type as enum ('page_view', 'video_play', 'video_complete', 'download', 'oh_signup');
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_type where typname = 'request_status') then
    create type public.request_status as enum ('novo', 'em_contato', 'agendado', 'recusado');
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_type where typname = 'story_status') then
    create type public.story_status as enum ('nova', 'em_avaliacao', 'selecionada', 'arquivada');
  end if;
end $$;

-- ---------------------------------------------------------------- perfis e papéis

create table if not exists public.profiles (
  id                uuid primary key references auth.users (id) on delete cascade,
  email             text not null,
  email_domain      text not null,
  name              text,
  company           text,
  role_lob          text,
  origin            public.user_origin not null default 'invite',
  is_active         boolean not null default true,
  terms_accepted_at timestamptz,
  created_at        timestamptz not null default now(),
  last_seen_at      timestamptz
);
create unique index if not exists profiles_email_lower_idx on public.profiles (lower(email));
create index if not exists profiles_domain_idx on public.profiles (email_domain);

-- Papéis ficam FORA de profiles de propósito: se o usuário pudesse editar a
-- própria linha de perfil, poderia se promover a admin.
create table if not exists public.user_roles (
  user_id    uuid not null references auth.users (id) on delete cascade,
  role       public.app_role not null,
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles where user_id = _user_id and role = _role
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.has_role(auth.uid(), 'admin');
$$;

-- ---------------------------------------------------------------- controle de acesso

create table if not exists public.invited_emails (
  email      text primary key,
  invited_by uuid references auth.users (id) on delete set null,
  note       text,
  created_at timestamptz not null default now(),
  claimed_at timestamptz
);

-- Derivado dos convidados: libera o auto-cadastro dos colegas de mesmo domínio.
create table if not exists public.allowed_domains (
  domain     text primary key,
  created_at timestamptz not null default now()
);

create table if not exists public.blocked_domains (
  domain text primary key
);

insert into public.blocked_domains (domain) values
  ('gmail.com'), ('googlemail.com'), ('outlook.com'), ('outlook.com.br'),
  ('hotmail.com'), ('hotmail.com.br'), ('live.com'), ('msn.com'),
  ('yahoo.com'), ('yahoo.com.br'), ('ymail.com'), ('icloud.com'), ('me.com'),
  ('aol.com'), ('proton.me'), ('protonmail.com'), ('gmx.com'), ('mail.com'),
  ('yandex.com'), ('tutanota.com'), ('zoho.com'), ('bol.com.br'),
  ('uol.com.br'), ('terra.com.br'), ('ig.com.br'), ('globo.com'), ('r7.com')
on conflict do nothing;

-- Primeiros admins: quem estiver aqui vira admin ao ativar a conta.
create table if not exists public.bootstrap_admins (
  email text primary key
);

create or replace function public.email_may_access(_email text)
returns boolean
language plpgsql stable security definer set search_path = public
as $$
declare
  e text := lower(trim(_email));
  d text;
begin
  if e !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    return false;
  end if;
  d := split_part(e, '@', 2);

  -- já tem conta ativa
  if exists (select 1 from public.profiles p where lower(p.email) = e and p.is_active) then
    return true;
  end if;
  -- convite explícito do admin vale mesmo em domínio pessoal
  if exists (select 1 from public.invited_emails i where i.email = e) then
    return true;
  end if;
  if exists (select 1 from public.bootstrap_admins b where b.email = e) then
    return true;
  end if;
  -- auto-cadastro: nunca em domínio pessoal
  if exists (select 1 from public.blocked_domains b where b.domain = d) then
    return false;
  end if;
  return exists (select 1 from public.allowed_domains a where a.domain = d);
end;
$$;

-- Só o servidor (service role) decide se manda o magic link: sem isso, qualquer
-- pessoa poderia sondar por RPC quais domínios estão liberados.
revoke execute on function public.email_may_access(text) from public;
grant  execute on function public.email_may_access(text) to service_role;

create or replace function public.grant_domain_from_email(_email text)
returns void
language plpgsql security definer set search_path = public
as $$
declare d text := split_part(lower(trim(_email)), '@', 2);
begin
  if d <> '' and not exists (select 1 from public.blocked_domains where domain = d) then
    insert into public.allowed_domains (domain) values (d) on conflict do nothing;
  end if;
end;
$$;

create or replace function public.invited_email_grants_domain()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  new.email := lower(trim(new.email));
  perform public.grant_domain_from_email(new.email);
  return new;
end;
$$;

drop trigger if exists invited_emails_grant_domain on public.invited_emails;
create trigger invited_emails_grant_domain
  before insert on public.invited_emails
  for each row execute function public.invited_email_grants_domain();

revoke execute on function public.grant_domain_from_email(text)   from public;
revoke execute on function public.invited_email_grants_domain()   from public;

-- ---------------------------------------------------------------- signup

create or replace function public.handle_new_platform_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  e text := lower(trim(new.email));
  d text := split_part(lower(trim(new.email)), '@', 2);
  o public.user_origin;
begin
  -- Defesa em profundidade: a checagem principal é no servidor, antes do envio
  -- do magic link. Aqui é a rede que impede a conta de existir de qualquer jeito.
  if not public.email_may_access(e) then
    raise exception 'signup_not_allowed' using errcode = '42501';
  end if;

  o := case
         when exists (select 1 from public.invited_emails where email = e) then 'invite'
         else 'self_signup'
       end::public.user_origin;

  insert into public.profiles (id, email, email_domain, name, company, role_lob, origin, terms_accepted_at)
  values (
    new.id, e, d,
    nullif(new.raw_user_meta_data ->> 'name', ''),
    nullif(new.raw_user_meta_data ->> 'company', ''),
    nullif(new.raw_user_meta_data ->> 'role_lob', ''),
    o,
    case when (new.raw_user_meta_data ->> 'terms_accepted') = 'true' then now() end
  )
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role) values (new.id, 'participant')
  on conflict do nothing;

  if exists (select 1 from public.bootstrap_admins where email = e) then
    insert into public.user_roles (user_id, role) values (new.id, 'admin')
    on conflict do nothing;
  end if;

  update public.invited_emails set claimed_at = now() where email = e and claimed_at is null;

  -- quem entra libera o próximo colega do mesmo domínio corporativo
  perform public.grant_domain_from_email(e);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_platform on auth.users;
create trigger on_auth_user_created_platform
  after insert on auth.users
  for each row execute function public.handle_new_platform_user();

revoke execute on function public.handle_new_platform_user() from public;

-- ---------------------------------------------------------------- conteúdo

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public
as $$ begin new.updated_at := now(); return new; end; $$;

create table if not exists public.lobs (
  id                  uuid primary key default gen_random_uuid(),
  slug                text not null unique,
  title               text not null,
  subtitle            text,
  status              public.content_status not null default 'coming_soon',
  instructor          text,
  instructor_title    text,
  instructor_photo_url text,
  video_url           text,
  body_md             text,
  event_date          date,
  duration_min        integer,
  tags                text[] not null default '{}',
  sort_order          integer not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
drop trigger if exists lobs_touch on public.lobs;
create trigger lobs_touch before update on public.lobs
  for each row execute function public.touch_updated_at();

create table if not exists public.assets (
  id           uuid primary key default gen_random_uuid(),
  lob_id       uuid not null references public.lobs (id) on delete cascade,
  filename     text not null,
  content_type text,
  size_bytes   bigint,
  storage_key  text not null,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);
create index if not exists assets_lob_idx on public.assets (lob_id, sort_order);

-- ---------------------------------------------------------------- engajamento

create table if not exists public.engagement_events (
  id           bigint generated always as identity primary key,
  user_id      uuid not null references auth.users (id) on delete cascade,
  lob_id       uuid references public.lobs (id) on delete set null,
  asset_id     uuid references public.assets (id) on delete set null,
  type         public.engagement_type not null,
  email_domain text,
  created_at   timestamptz not null default now()
);
create index if not exists engagement_domain_idx on public.engagement_events (email_domain, created_at desc);
create index if not exists engagement_user_idx on public.engagement_events (user_id, created_at desc);

-- O domínio é desnormalizado no evento para o dashboard agregar sem join pesado.
create or replace function public.stamp_engagement_domain()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if new.email_domain is null then
    select email_domain into new.email_domain from public.profiles where id = new.user_id;
  end if;
  update public.profiles set last_seen_at = now() where id = new.user_id;
  return new;
end;
$$;

drop trigger if exists engagement_stamp_domain on public.engagement_events;
create trigger engagement_stamp_domain before insert on public.engagement_events
  for each row execute function public.stamp_engagement_domain();

create table if not exists public.lob_progress (
  user_id    uuid not null references auth.users (id) on delete cascade,
  lob_id     uuid not null references public.lobs (id) on delete cascade,
  watched_at timestamptz,
  primary key (user_id, lob_id)
);

-- ---------------------------------------------------------------- office hours

create table if not exists public.office_hours (
  id            uuid primary key default gen_random_uuid(),
  lob_id        uuid references public.lobs (id) on delete set null,
  title         text not null,
  description   text,
  instructor    text,
  starts_at     timestamptz not null,
  duration_min  integer not null default 60,
  meeting_url   text,
  recording_url text,
  capacity      integer,
  created_at    timestamptz not null default now()
);
create index if not exists office_hours_start_idx on public.office_hours (starts_at);

create table if not exists public.office_hours_signups (
  id             uuid primary key default gen_random_uuid(),
  office_hour_id uuid not null references public.office_hours (id) on delete cascade,
  user_id        uuid not null references auth.users (id) on delete cascade,
  created_at     timestamptz not null default now(),
  unique (office_hour_id, user_id)
);

-- ---------------------------------------------------------------- demanda e cases

create table if not exists public.company_webinar_requests (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references auth.users (id) on delete set null,
  name              text not null,
  email             text not null,
  company           text,
  lob_slugs         text[] not null default '{}',
  audience_size     text,
  preferred_windows text,
  notes             text,
  status            public.request_status not null default 'novo',
  created_at        timestamptz not null default now()
);

create table if not exists public.success_stories (
  id                        uuid primary key default gen_random_uuid(),
  user_id                   uuid references auth.users (id) on delete set null,
  name                      text not null,
  email                     text not null,
  company                   text,
  lob_id                    uuid references public.lobs (id) on delete set null,
  title                     text not null,
  description               text not null,
  video_url                 text not null,
  consent_contact_at        timestamptz not null,
  consent_no_publish_ack_at timestamptz not null,
  status                    public.story_status not null default 'nova',
  created_at                timestamptz not null default now()
);

-- ---------------------------------------------------------------- RLS

alter table public.profiles                 enable row level security;
alter table public.user_roles               enable row level security;
alter table public.invited_emails           enable row level security;
alter table public.allowed_domains          enable row level security;
alter table public.blocked_domains          enable row level security;
alter table public.bootstrap_admins         enable row level security;
alter table public.lobs                     enable row level security;
alter table public.assets                   enable row level security;
alter table public.engagement_events        enable row level security;
alter table public.lob_progress             enable row level security;
alter table public.office_hours             enable row level security;
alter table public.office_hours_signups     enable row level security;
alter table public.company_webinar_requests enable row level security;
alter table public.success_stories          enable row level security;

-- perfis
drop policy if exists "own profile read" on public.profiles;
create policy "own profile read" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists "admin profiles" on public.profiles;
create policy "admin profiles" on public.profiles for all    to authenticated using (public.is_admin()) with check (public.is_admin());

-- papéis: leitura do próprio, escrita só admin
drop policy if exists "own roles read" on public.user_roles;
create policy "own roles read" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.is_admin());
drop policy if exists "admin roles" on public.user_roles;
create policy "admin roles" on public.user_roles for all    to authenticated using (public.is_admin()) with check (public.is_admin());

-- listas de acesso: só admin (o servidor usa service role)
drop policy if exists "admin invited" on public.invited_emails;
create policy "admin invited" on public.invited_emails   for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin allowed" on public.allowed_domains;
create policy "admin allowed" on public.allowed_domains  for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin blocked" on public.blocked_domains;
create policy "admin blocked" on public.blocked_domains  for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin bootstrap" on public.bootstrap_admins;
create policy "admin bootstrap" on public.bootstrap_admins for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- conteúdo: todo participante logado lê; só admin escreve
drop policy if exists "auth read lobs" on public.lobs;
create policy "auth read lobs" on public.lobs   for select to authenticated using (true);
drop policy if exists "admin write lobs" on public.lobs;
create policy "admin write lobs" on public.lobs   for all    to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "auth read assets" on public.assets;
create policy "auth read assets" on public.assets for select to authenticated using (true);
drop policy if exists "admin write assets" on public.assets;
create policy "admin write assets" on public.assets for all    to authenticated using (public.is_admin()) with check (public.is_admin());

-- engajamento: o usuário só registra evento dele; leitura é do admin
drop policy if exists "insert own events" on public.engagement_events;
create policy "insert own events" on public.engagement_events for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "admin read events" on public.engagement_events;
create policy "admin read events" on public.engagement_events for select to authenticated using (public.is_admin());

drop policy if exists "own progress" on public.lob_progress;
create policy "own progress" on public.lob_progress for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "admin read progress" on public.lob_progress;
create policy "admin read progress" on public.lob_progress for select to authenticated using (public.is_admin());

-- office hours
drop policy if exists "auth read oh" on public.office_hours;
create policy "auth read oh" on public.office_hours for select to authenticated using (true);
drop policy if exists "admin write oh" on public.office_hours;
create policy "admin write oh" on public.office_hours for all    to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "own signups" on public.office_hours_signups;
create policy "own signups" on public.office_hours_signups for all    to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "admin read signups" on public.office_hours_signups;
create policy "admin read signups" on public.office_hours_signups for select to authenticated using (public.is_admin());

-- filas do admin
drop policy if exists "insert own request" on public.company_webinar_requests;
create policy "insert own request" on public.company_webinar_requests for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "read own request" on public.company_webinar_requests;
create policy "read own request" on public.company_webinar_requests for select to authenticated using (user_id = auth.uid() or public.is_admin());
drop policy if exists "admin requests" on public.company_webinar_requests;
create policy "admin requests" on public.company_webinar_requests for all    to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "insert own story" on public.success_stories;
create policy "insert own story" on public.success_stories for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "read own story" on public.success_stories;
create policy "read own story" on public.success_stories for select to authenticated using (user_id = auth.uid() or public.is_admin());
drop policy if exists "admin stories" on public.success_stories;
create policy "admin stories" on public.success_stories for all    to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------- storage

insert into storage.buckets (id, name, public) values ('follow-along', 'follow-along', false)
on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('platform-public', 'platform-public', true)
on conflict (id) do nothing;

drop policy if exists "auth read follow along" on storage.objects;
create policy "auth read follow along" on storage.objects for select to authenticated
  using (bucket_id = 'follow-along');
drop policy if exists "admin write follow along" on storage.objects;
create policy "admin write follow along" on storage.objects for all to authenticated
  using (bucket_id = 'follow-along' and public.is_admin())
  with check (bucket_id = 'follow-along' and public.is_admin());

drop policy if exists "public read platform assets" on storage.objects;
create policy "public read platform assets" on storage.objects for select to public
  using (bucket_id = 'platform-public');
drop policy if exists "admin write platform assets" on storage.objects;
create policy "admin write platform assets" on storage.objects for all to authenticated
  using (bucket_id = 'platform-public' and public.is_admin())
  with check (bucket_id = 'platform-public' and public.is_admin());

-- ---------------------------------------------------------------- visões do admin

-- security_invoker: a RLS de profiles/engagement_events continua valendo, então
-- só quem é admin enxerga o agregado da base inteira.
drop view if exists public.admin_domain_stats;
create view public.admin_domain_stats with (security_invoker = true) as
with per_user as (
  select
    p.id,
    p.email_domain,
    p.last_seen_at,
    (select count(*) from public.engagement_events e where e.user_id = p.id and e.type = 'video_play') as video_plays,
    (select count(*) from public.engagement_events e where e.user_id = p.id and e.type = 'download')   as downloads,
    (select count(*) from public.engagement_events e where e.user_id = p.id and e.type = 'oh_signup')  as oh_signups
  from public.profiles p
)
select
  email_domain                                                              as domain,
  count(*)::int                                                             as users,
  count(*) filter (where last_seen_at > now() - interval '30 days')::int     as active_30d,
  coalesce(sum(video_plays), 0)::int                                        as video_plays,
  coalesce(sum(downloads), 0)::int                                          as downloads,
  coalesce(sum(oh_signups), 0)::int                                         as oh_signups,
  max(last_seen_at)                                                         as last_seen_at
from per_user
group by email_domain;

-- ---------------------------------------------------------------- seed

insert into public.bootstrap_admins (email) values ('leo@generativecrm.com')
on conflict do nothing;
insert into public.invited_emails (email, note) values ('leo@generativecrm.com', 'bootstrap')
on conflict do nothing;

insert into public.lobs (slug, title, subtitle, status, sort_order, tags) values
  ('marketing',             'ChatGPT Work para Equipes de Marketing',              'Da pesquisa de público ao copy que vai ao ar.',                    'coming_soon', 1, '{Marketing}'),
  ('vendas',                'ChatGPT Work para Equipes de Vendas',                 'Pesquisa de conta, preparação de reunião, proposta e follow-up.',  'coming_soon', 2, '{Vendas}'),
  ('financas',              'ChatGPT Work para Finanças',                          'Fechamento, reconciliação e análise de variação.',                 'coming_soon', 3, '{Finanças}'),
  ('estrategia-operacoes',  'ChatGPT Work para Estratégia & Operações',            'Diagnóstico, priorização e desenho de processo.',                  'coming_soon', 4, '{Estratégia,Operações}'),
  ('dados',                 'ChatGPT Work para Análise de Dados',                  'Da pergunta de negócio à consulta, do resultado à narrativa.',     'coming_soon', 5, '{Dados}'),
  ('juridico',              'ChatGPT Work para Jurídico',                          'Revisão de contrato, pesquisa e minuta com checagem.',             'coming_soon', 6, '{Jurídico}')
on conflict (slug) do nothing;
