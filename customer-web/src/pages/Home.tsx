import { ArrowRight, CheckCircle2, Leaf, Sparkles, Sprout } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2200; // 2.2 seconds splash duration
    const intervalTime = 30;
    const increment = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            navigate("/catalog", { replace: true });
          }, 150);
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
    <main className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden bg-stone-950 text-white flex flex-col justify-between p-6 sm:p-10 select-none">
      {/* Hero Background Image with subtle Ken-Burns Zoom */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1800&auto=format&fit=crop"
          alt="Plant filled home"
          className="h-full w-full object-cover filter brightness-[0.65] contrast-[1.05] animate-subtle-zoom transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/50 backdrop-blur-[1px]" />
      </div>

      {/* Floating Animated Ambient Particles & Leaves */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        <div className="absolute left-[12%] bottom-10 animate-float-sway text-emerald-400/40" style={{ animationDelay: "0s", animationDuration: "8s" }}>
          <Leaf className="h-6 w-6 transform -rotate-45" />
        </div>
        <div className="absolute left-[28%] bottom-16 animate-float-sway text-green-300/30" style={{ animationDelay: "2.5s", animationDuration: "9.5s" }}>
          <Leaf className="h-4 w-4 transform rotate-12" />
        </div>
        <div className="absolute right-[20%] bottom-8 animate-float-sway text-emerald-300/35" style={{ animationDelay: "1.2s", animationDuration: "7.5s" }}>
          <Leaf className="h-5 w-5 transform rotate-90" />
        </div>
        <div className="absolute right-[35%] bottom-20 animate-float-sway text-emerald-500/25" style={{ animationDelay: "4s", animationDuration: "10s" }}>
          <Sprout className="h-7 w-7" />
        </div>
        {/* Soft glowing ambient light blur circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-green-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDuration: "6s" }} />
      </div>

      {/* Top Bar: Brand Badge & Skip Button */}
      <div className="relative z-20 flex items-center justify-between max-w-5xl mx-auto w-full animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <div className="group flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-md border border-white/20 shadow-lg hover:border-emerald-400/40 transition-all duration-300">
          <Sprout className="h-4 w-4 text-emerald-400 animate-bounce" style={{ animationDuration: "2s" }} />
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
            Lagao
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>

        <button
          type="button"
          onClick={handleSkip}
          className="group flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-extrabold text-white backdrop-blur-md border border-white/20 hover:bg-white/25 hover:border-emerald-400/40 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md"
        >
          <span>Skip to Store</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300 text-emerald-300" />
        </button>
      </div>

      {/* Center Intro Card with Staggered Entrance Animations */}
      <div className="relative z-20 max-w-xl mx-auto text-center my-auto px-4">
        {/* Offer Tag */}
        <div
          className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-4.5 py-1.5 text-xs font-extrabold text-emerald-300 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)] animate-fade-in-up hover:scale-105 transition-transform duration-300"
          style={{ animationDelay: "200ms" }}
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-spin" style={{ animationDuration: "8s" }} />
          <span>Monsoon Special: Up to 25% OFF Selected Greens</span>
        </div>

        {/* Intro Headline */}
        <h1
          className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-lg animate-fade-in-up"
          style={{ animationDelay: "350ms" }}
        >
          Bring nature home, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-200 to-emerald-400 animate-gradient-text">
            one calm corner at a time.
          </span>
        </h1>

        {/* Subtitle / Intro Feature Pills */}
        <div
          className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-stone-300 font-medium animate-fade-in-up"
          style={{ animationDelay: "500ms" }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm border border-white/10">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Air-Purifying
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm border border-white/10">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Low Maintenance
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm border border-white/10">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Safe Delivery
          </span>
        </div>

        {/* Enhanced Dynamic Progress Bar */}
        <div
          className="mt-8 max-w-xs mx-auto animate-fade-in-up"
          style={{ animationDelay: "650ms" }}
        >
          <div className="flex items-center justify-between text-xs font-bold text-stone-300 mb-2.5">
            <span className="flex items-center gap-1.5">
              <Sprout className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              {progress >= 100 ? "Ready! Entering store..." : "Curating catalog..."}
            </span>
            <span className="font-mono text-emerald-300 font-extrabold">{Math.round(progress)}%</span>
          </div>

          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-stone-900/80 border border-white/15 p-0.5 backdrop-blur-md shadow-inner">
            <div
              className="relative h-full rounded-full bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-300 shadow-[0_0_12px_#34d399] transition-all duration-75 ease-out overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect inside progress bar */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-bar-shimmer" />
            </div>
          </div>
        </div>
      </div>

      {/* Empty Spacer Bottom */}
      <div className="relative z-20" />
    </main>
  );
}

