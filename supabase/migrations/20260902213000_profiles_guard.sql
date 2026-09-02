-- Tranca as colunas sensíveis de public.profiles contra auto-edição.
--
-- A policy "own profile update" precisa existir para a pessoa completar nome,
-- empresa e área — mas RLS não restringe COLUNA. Sem esta trava, alguém
-- desativado por um admin poderia simplesmente gravar is_active = true de
-- volta, e também trocar o próprio e-mail ou a origem do cadastro.
--
-- ATENÇÃO: esta função é SECURITY INVOKER de propósito. Com SECURITY DEFINER,
-- current_user passa a ser o dono da função (postgres) em toda chamada, o
-- guard nunca vale para o usuário logado e a trava fica inerte — foi assim que
-- ela nasceu e o teste de escalada passou direto.
-- Reexecutável.

create or replace function public.profiles_guard_self_update()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  -- service_role (funções de servidor) e postgres (migrations) passam direto;
  -- admin logado também. has_role é SECURITY DEFINER, então lê user_roles.
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

drop trigger if exists profiles_guard on public.profiles;
create trigger profiles_guard
  before update on public.profiles
  for each row execute function public.profiles_guard_self_update();
