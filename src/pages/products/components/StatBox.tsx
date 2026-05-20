type StatBoxProps = {
  green?: boolean;
  label: string;
  value: number;
};

export function StatBox({ green, label, value }: StatBoxProps) {
  const wrapperClass = green
    ? "rounded-lg bg-emerald-50 p-3"
    : "rounded-lg bg-slate-50 p-3";
  const labelClass = green
    ? "m-0 text-xs text-emerald-600"
    : "m-0 text-xs text-slate-400";
  const valueClass = green
    ? "m-0 mt-1 text-lg font-semibold text-emerald-700"
    : "m-0 mt-1 text-lg font-semibold text-slate-950";

  return (
    <div className={wrapperClass}>
      <p className={labelClass}>{label}</p>
      <p className={valueClass}>{value}</p>
    </div>
  );
}
