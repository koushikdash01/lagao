import { ArrowRight, Sparkles, Sprout } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2.0 seconds splash duration
    const intervalTime = 30;
    const increment = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            navigate("/catalog", { replace: true });
          }, 100);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleSkip = () => {
    navigate("/catalog", { replace: true });
  };

  return (
    <main className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden bg-stone-950 text-white flex flex-col justify-between p-6 sm:p-10">
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1800&auto=format&fit=crop"
          alt="Plant filled home"
          className="h-full w-full object-cover filter brightness-75 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/75 to-stone-950/60 backdrop-blur-[1px]" />
      </div>

      {/* Top Bar: Skip Button */}
      <div className="relative z-10 flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 backdrop-blur-md border border-white/15">
          <Sprout className="h-4 w-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
            Lagao
          </span>
        </div>

        <button
          type="button"
          onClick={handleSkip}
          className="flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-xs font-extrabold text-white backdrop-blur-md border border-white/20 hover:bg-white/25 active:scale-95 transition"
        >
          <span>Skip</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Minimal Center Intro Card */}
      <div className="relative z-10 max-w-xl mx-auto text-center my-auto px-4">
        {/* Offer Tag */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-4 py-1.5 text-xs font-extrabold text-emerald-300 backdrop-blur-md mb-4 shadow-lg">
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          <span>Monsoon Special: Up to 25% OFF Selected Greens</span>
        </div>

        {/* Intro Headline */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-md">
          Bring nature home, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-200 to-emerald-400">
            one calm corner at a time.
          </span>
        </h1>

        {/* Minimal Progress Bar */}
        <div className="mt-8 max-w-xs mx-auto">
          <div className="flex items-center justify-between text-xs font-bold text-stone-300 mb-2">
            <span>Loading Catalog...</span>
            <span className="font-mono text-emerald-300">{Math.round(progress)}%</span>
          </div>

          <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/15 border border-white/10 p-0.5 backdrop-blur-md">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400 shadow-[0_0_10px_#34d399] transition-all duration-75 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Empty Spacer Bottom */}
      <div className="relative z-10" />
    </main>
  );
}
