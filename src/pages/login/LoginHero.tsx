const HERO_IMAGE =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80";

export default function LoginHero() {
  return (
    <div className="relative hidden overflow-hidden lg:col-span-3 lg:block">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-900/70 to-indigo-900/85" />

      <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/15 text-xl font-bold backdrop-blur-md">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-wide">
              Admin Panel
            </span>
            <span className="text-xs text-white/60">İdarəetmə sistemi</span>
          </div>
        </div>

        <div className="max-w-lg space-y-6">
          <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
            Komandanı bir yerdə idarə edin
          </h1>
          <p className="text-lg leading-relaxed text-white/80">
            İdarəetmə sistemi ilə komandanı effektiv şəkildə idarə edin.
          </p>
        </div>
      </div>
    </div>
  );
}
