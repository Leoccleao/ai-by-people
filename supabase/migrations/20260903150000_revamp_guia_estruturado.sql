-- Revamp da plataforma: guia estruturado, cores por área e progresso por etapa.
--
-- Até aqui o guia do workshop era um markdown único (`lobs.body_md`) renderizado
-- como texto corrido. O revamp quebra isso em partes que a interface trata como
-- objetos: conceitos, demos com etapas, prompts copiáveis, checklist e recursos.
-- Guardar como jsonb mantém uma linha por área e deixa o admin editar tudo sem
-- migration nova a cada workshop.
-- Reexecutável.

-- ---------------------------------------------------------------- conteúdo

-- Cores da área: `accent` é o ponto na navegação; as duas juntas formam o
-- gradiente das capas. Ficam no banco para uma área nova não precisar de deploy.
alter table public.lobs add column if not exists accent   text;
alter table public.lobs add column if not exists accent_2 text;

-- Guia estruturado. Formato em src/platform/guide-schema.ts — resumindo:
--   { lead, concepts[], demos[{ label, title, prerequisites[], steps[] }],
--     checklist[], resources[], howToStart }
-- `body_md` continua existindo como fonte original e fallback de exibição.
alter table public.lobs add column if not exists guide jsonb;

-- Rótulos do material follow along, como o design mostra nos cards:
-- "Demo 1 · definições de KPI" abaixo do nome do arquivo.
alter table public.assets add column if not exists demo_label text;
alter table public.assets add column if not exists hint       text;

-- ---------------------------------------------------------------- progresso

-- O progresso deixa de ser "assistiu / não assistiu" e passa a ser por etapa.
-- Arrays de ids em vez de tabela nova: são poucos itens por área, sempre lidos
-- e gravados em bloco pelo mesmo usuário, e a policy de lob_progress já cobre.
alter table public.lob_progress add column if not exists steps_done     text[] not null default '{}';
alter table public.lob_progress add column if not exists checklist_done text[] not null default '{}';

-- ---------------------------------------------------------------- cores das áreas

update public.lobs set accent = '#7C6BD0', accent_2 = '#4EA8E8' where slug = 'marketing'            and accent is null;
update public.lobs set accent = '#3B82F6', accent_2 = '#21C7B8' where slug = 'vendas'               and accent is null;
update public.lobs set accent = '#22A06B', accent_2 = '#C9C221' where slug = 'financas'             and accent is null;
update public.lobs set accent = '#D9822B', accent_2 = '#E86A6A' where slug = 'estrategia-operacoes' and accent is null;
update public.lobs set accent = '#14B8C4', accent_2 = '#35B87A' where slug = 'dados'                and accent is null;
update public.lobs set accent = '#E5484D', accent_2 = '#C86ADB' where slug = 'juridico'             and accent is null;
