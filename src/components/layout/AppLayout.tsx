import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  FileText,
  Search,
  Network,
  Link2,
  MapPin,
  CalendarDays,
  Package,
  Moon,
  Sun,
  Sparkles,
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/blog", label: "Blog Generator", icon: FileText },
  { to: "/keywords", label: "Keyword Mapping", icon: Search },
  { to: "/clusters", label: "Content Clusters", icon: Network },
  { to: "/linking", label: "Internal Linking", icon: Link2 },
  { to: "/local", label: "Local SEO", icon: MapPin },
  { to: "/analysis", label: "SEO Analysis", icon: Search },
  { to: "/strategy", label: "Content Strategy", icon: CalendarDays },
  { to: "/pack", label: "SEO Blog Pack", icon: Package },
];

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };
  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

export function AppLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  const router = useRouterState();
  const pathname = router.location.pathname;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-right" richColors />
      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r bg-sidebar text-sidebar-foreground md:flex">
          <div className="flex h-16 items-center gap-2 border-b px-5">
            <div className="grid h-9 w-9 place-items-center rounded-lg gradient-primary shadow-elegant">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">RankForge AI</p>
              <p className="text-xs text-muted-foreground leading-tight">SEO Content Studio</p>
            </div>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {nav.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-card"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className={cn("h-4 w-4", active && "text-primary")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="border-t p-4">
            <div className="rounded-lg gradient-subtle p-3 text-xs text-muted-foreground">
              <p className="mb-1 font-medium text-foreground">Pro tip</p>
              Generate a full Blog Pack from the Pack page to export everything at once.
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 md:pl-64">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
              {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="default" size="sm" className="gap-2 gradient-primary text-primary-foreground hover:opacity-90">
                <Sparkles className="h-4 w-4" /> Upgrade
              </Button>
            </div>
          </header>
          <main className="px-6 py-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t bg-background/95 p-2 backdrop-blur md:hidden">
        {nav.slice(0, 5).map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link key={item.to} to={item.to} className={cn("flex flex-col items-center gap-0.5 rounded-md px-2 py-1 text-[10px]", active ? "text-primary" : "text-muted-foreground")}>
              <Icon className="h-4 w-4" />
              {item.label.split(" ")[0]}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
