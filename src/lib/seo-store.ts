// Lightweight cross-page state via localStorage + an event bus.
import { useEffect, useState } from "react";
import { DEFAULT_INPUT, type BlogInput } from "./mock-seo";

const KEY = "seo_app_state_v1";

export interface AppStats {
  blogs: number;
  keywords: number;
  clusters: number;
  localPacks: number;
  generations: { id: string; type: string; title: string; date: string }[];
}

export interface AppState {
  input: BlogInput;
  stats: AppStats;
}

const initial: AppState = {
  input: DEFAULT_INPUT,
  stats: { blogs: 3, keywords: 30, clusters: 2, localPacks: 1, generations: [
    { id: "g1", type: "Blog", title: "The Complete Guide to AI-Powered SEO in Mumbai", date: new Date().toISOString() },
    { id: "g2", type: "Cluster", title: "AI-Powered SEO Pillar Guide", date: new Date(Date.now() - 86400000).toISOString() },
    { id: "g3", type: "Local SEO", title: "Best SEO Services in Mumbai", date: new Date(Date.now() - 2 * 86400000).toISOString() },
  ] },
};

function read(): AppState {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    return { ...initial, ...JSON.parse(raw) };
  } catch {
    return initial;
  }
}

function write(s: AppState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new CustomEvent("seo-state"));
}

export function useAppState() {
  const [state, setState] = useState<AppState>(initial);
  useEffect(() => {
    setState(read());
    const h = () => setState(read());
    window.addEventListener("seo-state", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("seo-state", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return state;
}

export function updateInput(input: BlogInput) {
  const s = read();
  write({ ...s, input });
}

export function trackGeneration(type: string, title: string, deltas: Partial<AppStats> = {}) {
  const s = read();
  const stats = { ...s.stats };
  stats.blogs += deltas.blogs ?? 0;
  stats.keywords += deltas.keywords ?? 0;
  stats.clusters += deltas.clusters ?? 0;
  stats.localPacks += deltas.localPacks ?? 0;
  stats.generations = [
    { id: `g${Date.now()}`, type, title, date: new Date().toISOString() },
    ...stats.generations,
  ].slice(0, 12);
  write({ ...s, stats });
}
