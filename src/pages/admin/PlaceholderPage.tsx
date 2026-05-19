type PlaceholderPageProps = {
  title: string;
  description: string;
};

export default function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <p className="m-0 text-xs font-semibold uppercase tracking-wide text-blue-600">
        Admin Panel
      </p>
      <h2 className="m-0 mt-2 text-2xl font-semibold text-slate-950">
        {title}
      </h2>
      <p className="m-0 mt-2 max-w-2xl text-sm leading-6 text-slate-500">
        {description}
      </p>
    </section>
  );
}
