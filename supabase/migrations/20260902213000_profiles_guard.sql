-- Tranca as colunas sensíveis de public.profiles contra auto-edição.
--
-- A policy "own profile update" precisa existir para a pessoa completar nome,
-- empresa e área — mas RLS não restringe COLUNA. Sem esta trava, alguém
-- desativado por um admin poderia simplesmente gravar is_active = true de
-- volta, e também trocar o próprio e-mail ou a origem do cadastro.
-- Reexecutável.

create or replace function public.profiles_guard_self_update()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  -- service_role (funções de servidor) e postgres (migrations) passam direto;
  -- admin logado também.
  if current_user in ('service_role', 'postgres', 'supabase_admin')
     or public.has_role(auth.uid(), 'admin') then
    return new;
  end if;

  new.email        := old.email;
  new.email_domain := old.email_domain;
  new.origin       := old.origin;
  new.is_active    := old.is_active;
  new.created_at   := old.created_at;
  new.last_seen_at := old.last_seen_at;

  -- o aceite dos termos é registrado uma vez e não se apaga (LGPD)
  if old.terms_accepted_at is not null then
    new.terms_accepted_at := old.terms_accepted_at;
  end if;

  return new;
end;
$$;

revoke execute on function public.profiles_guard_self_update() from public;

drop trigger if exists profiles_guard on public.profiles;
create trigger profiles_guard
  before update on public.profiles
  for each row execute function public.profiles_guard_self_update();
