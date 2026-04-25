import { Link } from "wouter";
import { ArrowRight, type LucideIcon } from "lucide-react";

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  href?: string;
  hrefLabel?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  href,
  hrefLabel = "View all",
}: Props) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        {eyebrow && (
          <div className="text-[11px] uppercase tracking-[0.18em] text-primary font-bold mb-2 flex items-center gap-2">
            {Icon && <Icon size={12} strokeWidth={2.5} />}
            {eyebrow}
          </div>
        )}
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-muted mt-1 max-w-xl">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href}>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer whitespace-nowrap">
            {hrefLabel}
            <ArrowRight size={12} />
          </span>
        </Link>
      )}
    </div>
  );
}
