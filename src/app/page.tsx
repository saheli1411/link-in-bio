import Link from "next/link";
import { ArrowRight, Link2, Sparkles, BarChart3, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Navbar */}
      <header className="border-b border-slate-800/80 px-6 py-4 flex items-center justify-between max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-2 font-bold text-lg text-emerald-400">
          <Link2 className="w-5 h-5" />
          <span>BioLink</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/u/johndoe"
            className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            Live Demo
          </Link>
          <Link
            href="/dashboard"
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-16 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" /> All-in-one Link in Bio Builder
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-2xl leading-tight">
          One simple link for all your content.
        </h1>

        <p className="mt-4 text-slate-400 text-base sm:text-lg max-w-xl">
          Claim your custom handle, customize themes, schedule time-sensitive links on the server, and track live analytics.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/u/johndoe"
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span>View Demo Profile (@johndoe)</span>
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 text-left w-full">
          <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="font-semibold text-sm text-slate-200">Server-Side Scheduling</h3>
            <p className="text-xs text-slate-400 mt-1">
              Links show and hide automatically based on server time validation.
            </p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl">
            <Link2 className="w-6 h-6 text-blue-400 mb-3" />
            <h3 className="font-semibold text-sm text-slate-200">Drag & Drop Ordering</h3>
            <p className="text-xs text-slate-400 mt-1">
              Reorder your links effortlessly with instant database persistence.
            </p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl">
            <BarChart3 className="w-6 h-6 text-purple-400 mb-3" />
            <h3 className="font-semibold text-sm text-slate-200">30-Day Analytics</h3>
            <p className="text-xs text-slate-400 mt-1">
              Real-time tracking of unique page views and individual link clicks.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        Link-in-Bio Platform &bull; Built with Next.js, Prisma & Tailwind CSS
      </footer>
    </div>
  );
}