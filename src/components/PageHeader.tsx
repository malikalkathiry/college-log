import Link from "next/link";

type PageHeaderProps = {
  title: string;
  backHref?: string;
  backLabel?: string;
  action?: React.ReactNode;
};

export default function PageHeader({
  title,
  backHref,
  backLabel = "Kembali",
  action,
}: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {backHref ? (
            <Link
              href={backHref}
              className="-ml-2 shrink-0 px-2 py-1 text-sm text-foreground-muted hover:text-foreground"
            >
              &larr; <span className="sr-only sm:not-sr-only">{backLabel}</span>
            </Link>
          ) : null}
          <h1 className="truncate text-lg font-semibold">{title}</h1>
        </div>
        {action}
      </div>
    </header>
  );
}
