import type { ReactNode } from "react";

type SummaryCardProps = {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  helper?: ReactNode;
  tone?: "blue" | "green" | "amber" | "red" | "slate";
};

const toneClasses = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
  slate: "bg-slate-100 text-slate-700",
};

export default function SummaryCard({
  icon,
  label,
  value,
  helper,
  tone = "blue",
}: SummaryCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md sm:p-3">
      <div
        className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${toneClasses[tone]}`}
      >
        {icon}
      </div>
      <p className="m-0 text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="m-0 mt-1 truncate text-sm font-semibold text-slate-950">
        {value}
      </p>
      {helper ? (
        <p className="m-0 mt-1 truncate text-xs text-slate-500">{helper}</p>
      ) : null}
    </div>
  );
}
