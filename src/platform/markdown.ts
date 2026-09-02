import { Marked } from "marked";

/**
 * Guia do workshop: markdown → HTML com âncora em cada título, para a navegação
 * lateral por seção. O corpo é escrito só por admins (RLS em `lobs`), então não
 * há entrada de usuário anônimo aqui.
 */

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

const marked = new Marked({ gfm: true, breaks: false });

marked.use({
  renderer: {
    heading(token) {
      const text = this.parser.parseInline(token.tokens);
      const id = slugify(this.parser.parseInline(token.tokens).replace(/<[^>]+>/g, ""));
      return `<h${token.depth} id="${id}">${text}</h${token.depth}>\n`;
    },
    link(token) {
      const text = this.parser.parseInline(token.tokens);
      const href = token.href ?? "";
      const external = /^https?:\/\//.test(href);
      const rel = external ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a href="${href}"${token.title ? ` title="${token.title}"` : ""}${rel}>${text}</a>`;
    },
  },
});

export function renderMarkdown(md: string | null | undefined): string {
  if (!md) return "";
  return marked.parse(md, { async: false });
}

export type TocEntry = { id: string; text: string; depth: number };

/** Índice do guia — só h2 e h3, que é o que cabe na coluna lateral. */
export function buildToc(md: string | null | undefined): TocEntry[] {
  if (!md) return [];
  const out: TocEntry[] = [];
  for (const token of marked.lexer(md)) {
    if (token.type === "heading" && (token.depth === 2 || token.depth === 3)) {
      const text = token.text.replace(/[*_`]/g, "").trim();
      out.push({ id: slugify(text), text, depth: token.depth });
    }
  }
  return out;
}
