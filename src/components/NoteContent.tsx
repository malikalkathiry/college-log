import type { ReactNode } from "react";

/**
 * Renderer Markdown sederhana.
 *
 * Mendukung: heading, bold, italic, kode inline, bullet list,
 * numbered list, link, dan code block.
 *
 * Sengaja tanpa dependency eksternal.
 */

function toReact(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-b${i}`} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={`${keyPrefix}-i${i}`} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={`${keyPrefix}-c${i}`}
          className="rounded bg-surface-hover px-1 py-0.5 font-mono text-[13px] text-foreground"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function isLinkAman(url: string): boolean {
  return /^(https?:\/\/|mailto:|\/|#)/i.test(url);
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const pola = /\[([^\]]+)\]\(([^)]+)\)/g;
  const hasil: ReactNode[] = [];
  let posisi = 0;
  let cocok: RegExpExecArray | null;
  let i = 0;

  while ((cocok = pola.exec(text)) !== null) {
    if (cocok.index > posisi) {
      hasil.push(...toReact(text.slice(posisi, cocok.index), `${keyPrefix}-t${i++}`));
    }

    const [, teks, url] = cocok;

    if (isLinkAman(url)) {
      hasil.push(
        <a
          key={`${keyPrefix}-a${i++}`}
          href={url}
          className="break-all text-accent underline hover:text-accent-hover"
          target="_blank"
          rel="noopener noreferrer"
        >
          {teks}
        </a>
      );
    } else {
      hasil.push(
        <span key={`${keyPrefix}-a${i++}`} className="text-foreground-muted">
          {teks}
        </span>
      );
    }

    posisi = cocok.index + cocok[0].length;
  }

  if (posisi < text.length) {
    hasil.push(...toReact(text.slice(posisi), `${keyPrefix}-t${i}`));
  }

  return hasil;
}

const gayaHeading: Record<number, string> = {
  1: "mt-6 mb-2 text-lg font-semibold text-foreground first:mt-0",
  2: "mt-5 mb-2 text-base font-semibold text-foreground first:mt-0",
  3: "mt-4 mb-1.5 text-sm font-semibold text-foreground first:mt-0",
};

export function renderMarkdown(markdown: string): ReactNode[] {
  const baris = (markdown ?? "").split("\n");
  const blok: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < baris.length) {
    const barisSekarang = baris[i];
    const teks = barisSekarang.trim();

    // Baris kosong
    if (teks === "") {
      i++;
      continue;
    }

    // Code block
    if (teks.startsWith("```")) {
      const isi: string[] = [];
      i++;
      while (i < baris.length && !baris[i].trim().startsWith("```")) {
        isi.push(baris[i]);
        i++;
      }
      i++; // Lewati baris penutup ```
      blok.push(
        <pre
          key={`code-${key++}`}
          className="mt-3 overflow-x-auto rounded border border-border bg-surface px-3 py-2.5"
        >
          <code className="font-mono text-[13px] leading-relaxed text-foreground">
            {isi.join("\n")}
          </code>
        </pre>
      );
      continue;
    }

    // Heading
    const heading = /^(#{1,3})\s+(.*)$/.exec(teks);
    if (heading) {
      const level = heading[1].length;
      const isi = heading[2].trim();
      const Tag = `h${level}` as "h1" | "h2" | "h3";
      blok.push(
        <Tag key={`h-${key++}`} className={gayaHeading[level]}>
          {renderInline(isi, `h${key}`)}
        </Tag>
      );
      i++;
      continue;
    }

    // Bullet list
    if (/^[-*+]\s+/.test(teks)) {
      const item: string[] = [];
      while (i < baris.length && /^[-*+]\s+/.test(baris[i].trim())) {
        item.push(baris[i].trim().replace(/^[-*+]\s+/, ""));
        i++;
      }
      blok.push(
        <ul key={`ul-${key++}`} className="my-2 list-disc space-y-1 pl-5 text-sm text-foreground">
          {item.map((isi, idx) => (
            <li key={idx}>{renderInline(isi, `ul${key}-${idx}`)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (/^\d+\.\s+/.test(teks)) {
      const item: string[] = [];
      while (i < baris.length && /^\d+\.\s+/.test(baris[i].trim())) {
        item.push(baris[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      blok.push(
        <ol key={`ol-${key++}`} className="my-2 list-decimal space-y-1 pl-5 text-sm text-foreground">
          {item.map((isi, idx) => (
            <li key={idx}>{renderInline(isi, `ol${key}-${idx}`)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Paragraf: kumpulkan sampai baris kosong atau blok baru mulai
    const paragraf: string[] = [];
    while (i < baris.length && baris[i].trim() !== "" && !/^(#{1,3}\s|[-*+]\s|\d+\.\s|```)/.test(baris[i].trim())) {
      paragraf.push(baris[i].trim());
      i++;
    }
    blok.push(
      <p key={`p-${key++}`} className="my-2 text-sm leading-relaxed text-foreground">
        {renderInline(paragraf.join(" "), `p${key}`)}
      </p>
    );
  }

  return blok;
}

export default function NoteContent({ content }: { content: string }) {
  return <div className="space-y-1">{renderMarkdown(content)}</div>;
}
