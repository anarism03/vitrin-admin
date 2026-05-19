import type { ReactNode } from "react";

type InfoRowProps = {
  label: string;
  value?: ReactNode;
};

export default function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="grid gap-1 py-2 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="min-w-0 break-words text-sm font-medium text-slate-950 sm:text-right">
        {value || "—"}
      </span>
    </div>
  );
}
