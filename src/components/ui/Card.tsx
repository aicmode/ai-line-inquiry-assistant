import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

/** ダッシュボード内で共通利用するカード */
export function Card({ children, className = "" }: CardProps) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </section>
  );
}

interface CardHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function CardHeader({
  title,
  description,
  action,
  icon,
}: CardHeaderProps) {
  return (
    <div className="flex flex-col gap-2 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-3 sm:px-5">
      <div className="flex items-start gap-2.5">
        {icon ? <span className="mt-0.5 text-emerald-600">{icon}</span> : null}
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          {description ? (
            <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {action}
    </div>
  );
}
