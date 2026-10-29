"use client";

import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import {
  GripVertical,
  Plus,
  Trash2,
  ExternalLink,
  Calendar,
  Eye,
  MousePointerClick,
  Palette,
  CheckCircle2
} from "lucide-react";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  position: number;
  isActive: boolean;
  startDate?: string | null;
  endDate?: string | null;
  clicksCount: number;
}

export default function DashboardPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [theme, setTheme] = useState("dark-neon");
  const [analytics, setAnalytics] = useState({ totalViews30d: 0, totalClicks30d: 0 });
  const [loading, setLoading] = useState(true);

  // Form states for creating a new link
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");

const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/dashboard");
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Dashboard API error:", res.status, errorText);
        return;
      }
      const data = await res.json();
      setLinks(data.links || []);
      if (data.user?.theme) setTheme(data.user.theme);
      if (data.analytics) setAnalytics(data.analytics);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const reordered = Array.from(links);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    const updated = reordered.map((item, index) => ({
      ...item,
      position: index
    }));

    setLinks(updated);

    await fetch("/api/dashboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "reorder_links",
        items: updated.map((l) => ({ id: l.id, position: l.position }))
      })
    });
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    const res = await fetch("/api/dashboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_link",
        title: newTitle,
        url: newUrl,
        startDate: newStartDate || null,
        endDate: newEndDate || null
      })
    });

    if (res.ok) {
      setNewTitle("");
      setNewUrl("");
      setNewStartDate("");
      setNewEndDate("");
      setIsAdding(false);
      fetchDashboardData();
    }
  };

  const handleDeleteLink = async (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
    await fetch("/api/dashboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete_link", id })
    });
  };

  const handleToggleActive = async (link: LinkItem) => {
    const updated = !link.isActive;
    setLinks(links.map((l) => (l.id === link.id ? { ...l, isActive: updated } : l)));

    await fetch("/api/dashboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_link",
        id: link.id,
        title: link.title,
        url: link.url,
        isActive: updated,
        startDate: link.startDate,
        endDate: link.endDate
      })
    });
  };

  const handleChangeTheme = async (newTheme: string) => {
    setTheme(newTheme);
    await fetch("/api/dashboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update_theme", theme: newTheme })
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Bar */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Profile Dashboard</h1>
            <p className="text-sm text-slate-400">Manage links, scheduling, and profile themes</p>
          </div>
          <a
            href="/u/johndoe"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <span>View Live Page</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </header>

        {/* 30-Day Analytics Cards */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">30-Day Views</p>
              <p className="text-2xl font-bold">{analytics.totalViews30d}</p>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <MousePointerClick className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">30-Day Clicks</p>
              <p className="text-2xl font-bold">{analytics.totalClicks30d}</p>
            </div>
          </div>
        </section>

        {/* Theme Picker */}
        <section className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
            <Palette className="w-4 h-4 text-emerald-400" />
            <span>Select Active Theme</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "classic-light", label: "Classic Light" },
              { id: "dark-neon", label: "Dark Neon" },
              { id: "minimal-warm", label: "Minimal Warm" }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => handleChangeTheme(t.id)}
                className={`py-3 px-4 rounded-lg border text-xs sm:text-sm font-medium transition-all text-center flex items-center justify-center gap-2 ${
                  theme === t.id
                    ? "border-emerald-500 bg-emerald-950/30 text-emerald-300"
                    : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700"
                }`}
              >
                {theme === t.id && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* Add Link Form */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Links ({links.length})</h2>
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-medium px-3.5 py-1.5 rounded-lg border border-slate-700 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Link
              </button>
            )}
          </div>

          {isAdding && (
            <form onSubmit={handleCreateLink} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. My Portfolio"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Destination URL</label>
                  <input
                    type="url"
                    required
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Start Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> End Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Save Link
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Drag and Drop Link List */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="links-droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                {links.map((link, index) => (
                  <Draggable key={link.id} draggableId={link.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm"
                      >
                        {/* Drag Handle & Info */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300 p-1"
                          >
                            <GripVertical className="w-5 h-5" />
                          </div>
                          <div className="truncate">
                            <h3 className="font-semibold text-sm text-slate-200 truncate">{link.title}</h3>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-slate-500 hover:text-slate-400 truncate block max-w-xs"
                            >
                              {link.url}
                            </a>
                            {(link.startDate || link.endDate) && (
                              <p className="text-[11px] text-amber-400/90 flex items-center gap-1 mt-1">
                                <Calendar className="w-3 h-3" /> Scheduled Link
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Actions & Analytics */}
                        <div className="flex items-center gap-3">
                          <span className="text-xs bg-slate-800 px-2.5 py-1 rounded-full text-slate-300 font-mono">
                            {link.clicksCount} clicks
                          </span>
                          <button
                            onClick={() => handleToggleActive(link)}
                            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                              link.isActive
                                ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                                : "bg-slate-800 text-slate-500 border border-slate-700"
                            }`}
                          >
                            {link.isActive ? "Active" : "Hidden"}
                          </button>
                          <button
                            onClick={() => handleDeleteLink(link.id)}
                            className="text-slate-500 hover:text-rose-400 p-1.5 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}