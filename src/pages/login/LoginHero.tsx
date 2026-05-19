const HERO_IMAGE =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80";

export default function LoginHero() {
  return (
    <div className="hidden lg:block lg:col-span-3 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-900/70 to-indigo-900/85" />

      <div className="relative z-10 h-full flex flex-col justify-between p-12 text-white">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-xl font-bold border border-white/20">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-wide">
              Admin Panel
            </span>
            <span className="text-xs text-white/60">İdarəetmə sistemi</span>
          </div>
        </div>

        {/* Mərkəz mətn */}
        <div className="max-w-lg space-y-6">
          <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
            Komandanı bir yerdə idarə edin
          </h1>
          <p className="text-white/80 text-lg leading-relaxed">
            İdarəetmə sistemi ilə komandanızı effektiv şəkildə idarə edin.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4"></div>
        </div>
      </div>
    </div>
  );
}
