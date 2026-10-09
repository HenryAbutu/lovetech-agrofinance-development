import { Fragment } from "react";
import { Link } from "@tanstack/react-router";

function InlineText({ text }: { text: string }) {
  return text.split(/(\*\*[^*]+\*\*|https:\/\/lovetechgroup\.com\.ng|info@lovetechgroup\.com\.ng)/g).map((part, index) => {
    if (part.startsWith("**")) return <strong key={index} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    if (part.startsWith("https://")) return <a key={index} href={part} className="break-words text-primary underline underline-offset-4">{part}</a>;
    if (part === "info@lovetechgroup.com.ng") return <a key={index} href={`mailto:${part}`} className="break-words text-primary underline underline-offset-4">{part}</a>;
    return <Fragment key={index}>{part}</Fragment>;
  });
}

export function LegalDocument({ title, content }: { title: string; content: string }) {
  const blocks = content.trim().split(/\n\s*\n/).filter((block) => !block.startsWith("# "));
  return (
    <main className="bg-background px-6 py-12 sm:py-16 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <header className="mb-8 border-b border-border pb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">LoveTech Group</p>
          <h1 className="break-words font-display text-4xl leading-tight tracking-normal text-primary sm:text-5xl">{title}</h1>
        </header>
        <div className="text-base leading-8 text-foreground/80">
          {blocks.map((block, index) => {
            if (block.startsWith("### ")) return <h3 key={index} className="mb-3 mt-7 font-display text-lg font-semibold tracking-normal text-primary">{block.slice(4)}</h3>;
            if (block.startsWith("## ")) return <h2 key={index} className="mb-4 mt-10 font-display text-2xl font-semibold leading-snug tracking-normal text-primary">{block.slice(3)}</h2>;
            if (block.startsWith("- ")) return <ul key={index} className="mb-5 list-disc space-y-2 pl-6 marker:text-muted-foreground">{block.split("\n").map((line, item) => <li key={item} className="pl-1"><InlineText text={line.slice(2)} /></li>)}</ul>;
            return <p key={index} className="mb-5 break-words">{block.split("\n").map((line, lineIndex) => <Fragment key={lineIndex}>{lineIndex > 0 && <br />}<InlineText text={line.trim()} /></Fragment>)}</p>;
          })}
        </div>
        <nav aria-label="Legal documents" className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-6 text-sm font-medium text-primary">
          <Link to="/privacy-policy" className="underline underline-offset-4">Privacy Policy</Link>
          <Link to="/terms-of-service" className="underline underline-offset-4">Terms of Service</Link>
        </nav>
      </article>
    </main>
  );
}