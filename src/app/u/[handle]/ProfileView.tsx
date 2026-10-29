"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, ExternalLink } from "lucide-react";

interface PublicLink {
  id: string;
  title: string;
  url: string;
}

interface ProfileData {
  handle: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  theme: string;
  links: PublicLink[];
}

export default function ProfileView({ handle }: { handle: string }) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    fetch(`/api/u/${handle}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans text-slate-400">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans text-slate-400">
        User not found
      </div>
    );
  }

  const handleLinkClick = async (linkId: string, targetUrl: string) => {
    try {
      fetch(`/api/links/${linkId}/click`, { method: "POST" });
    } catch {}
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  const themeStyles: Record<
    string,
    { bg: string; card: string; text: string; button: string }
  > = {
    "classic-light": {
      bg: "bg-slate-50",
      card: "bg-white border-slate-200 text-slate-800 hover:border-slate-400 shadow-sm",
      text: "text-slate-900",
      button: "bg-slate-900 text-white",
    },
    "dark-neon": {
      bg: "bg-neutral-950",
      card: "bg-neutral-900 border-emerald-500/30 text-emerald-300 hover:border-emerald-400 shadow-emerald-950/50 shadow-lg",
      text: "text-white",
      button: "bg-emerald-500 text-neutral-950 font-bold",
    },
    "minimal-warm": {
      bg: "bg-[#faf6f0]",
      card: "bg-[#fffdf9] border-stone-200 text-stone-800 hover:border-amber-700 shadow-sm",
      text: "text-stone-900",
      button: "bg-amber-900 text-white",
    },
  };

  const currentTheme =
    themeStyles[profile.theme] || themeStyles["classic-light"];

  return (
    <main
      className={`min-h-screen flex flex-col items-center py-12 px-4 transition-colors ${currentTheme.bg}`}
    >
      <div className="w-full max-w-md flex flex-col items-center">
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.displayName || profile.handle}
            className="w-24 h-24 rounded-full object-cover shadow-md mb-4 border-2 border-white/20"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold mb-4">
            {profile.handle.slice(0, 2).toUpperCase()}
          </div>
        )}

        <h1 className={`text-xl font-bold ${currentTheme.text}`}>
          {profile.displayName || `@${profile.handle}`}
        </h1>
        <p className="text-sm text-gray-500 mt-1 mb-6 text-center">
          {profile.bio}
        </p>

        <button
          onClick={() => setShowQR(!showQR)}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 mb-6 transition-colors"
        >
          <QrCode className="w-4 h-4" />{" "}
          {showQR ? "Hide QR Code" : "Share via QR Code"}
        </button>

        {showQR && (
          <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 mb-6">
            <QRCodeSVG
              value={typeof window !== "undefined" ? window.location.href : ""}
              size={160}
            />
          </div>
        )}

        <div className="w-full space-y-3">
          {profile.links.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id, link.url)}
              className={`w-full p-4 rounded-xl border text-center font-medium transition-all transform active:scale-95 flex items-center justify-between ${currentTheme.card}`}
            >
              <span className="w-4" />
              <span>{link.title}</span>
              <ExternalLink className="w-4 h-4 opacity-50" />
            </button>
          ))}
          {profile.links.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-8">
              No links are currently active.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}