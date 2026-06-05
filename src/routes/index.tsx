import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Search, Network, MapPin, ArrowRight, TrendingUp, Sparkles, CalendarDays, Link2 } from "lucide-react";
import { useAppState } from "@/lib/seo-store";
import { motion } from "framer-motion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RankForge AI — SEO Blog & Content Cluster Generator" },
      { name: "description", content: "AI-powered SEO blogs, keyword intent mapping, content clusters, internal linking, and local SEO for business websites." },
      { property: "og:title", content: "RankForge AI — SEO Content Studio" },
      { property: "og:description", content: "Generate a complete AI-driven SEO Blog Pack for your business in minutes." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { stats } = useAppState();

  const tiles = [
    { label: "Blogs Generated", value: stats.blogs, icon: FileText, accent: "text-primary" },
    { label: "Keywords Mapped", value: stats.keywords, icon: Search, accent: "text-accent" },
    { label: "Clusters Created", value: stats.clusters, icon: Network, accent: "text-success" },
    { label: "Local SEO Packs", value: stats.localPacks, icon: MapPin, accent: "text-warning" },
  ];

  const features = [
    { to: "/blog", icon: FileText, title: "Blog Generator", desc: "Outlines + long-form 1.5K–3K word articles." },
    { to: "/keywords", icon: Search, title: "Keyword Mapping", desc: "Primary, secondary, long-tail with intent." },
    { to: "/clusters", icon: Network, title: "Content Clusters", desc: "1 pillar + 10 supporting articles." },
    { to: "/linking", icon: Link2, title: "Internal Linking", desc: "Anchor text + linking reasons." },
    { to: "/local", icon: MapPin, title: "Local SEO", desc: "City + service landing copy & FAQs." },
    { to: "/strategy", icon: CalendarDays, title: "Content Strategy", desc: "30-day prioritized calendar." },
  ];

  return (
    <AppLayout title="Dashboard" subtitle="Your AI-powered SEO content command center">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative mb-8 overflow-hidden rounded-2xl gradient-primary p-8 text-primary-foreground shadow-elegant"
      >
        <div className="relative z-10 max-w-2xl">
          <Badge className="mb-3 border-0 bg-white/15 text-primary-foreground hover:bg-white/25">
            <Sparkles className="mr-1 h-3 w-3" /> AI SEO Studio
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Ship SEO content that ranks — in minutes, not weeks.
          </h2>
          <p className="mt-3 text-primary-foreground/85">
            Generate full SEO blog packs: outlines, long-form articles, keyword intent maps, content clusters, internal linking, and local SEO copy — all from a single brief.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild size="lg" variant="secondary" className="gap-2">
              <Link to="/blog">
                Generate a Blog <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 border-white/30 bg-transparent text-primary-foreground hover:bg-white/10">
              <Link to="/pack">View SEO Blog Pack</Link>
            </Button>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-32 h-48 w-48 rounded-full bg-accent/40 blur-3xl" />
      </motion.div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t, i) => {
          const Icon = t.icon;
          return (
            <motion.div key={t.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="shadow-card">
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{t.label}</p>
                    <p className="mt-1 text-3xl font-semibold tracking-tight">{t.value}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-success">
                      <TrendingUp className="h-3 w-3" /> +12% this week
                    </p>
                  </div>
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-secondary">
                    <Icon className={`h-5 w-5 ${t.accent}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Features */}
      <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Generators</h3>
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <Link key={f.to} to={f.to}>
              <Card className="group h-full shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant">
                <CardHeader>
                  <div className="mb-2 grid h-10 w-10 place-items-center rounded-lg bg-secondary">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{f.title}</CardTitle>
                  <CardDescription>{f.desc}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center text-sm font-medium text-primary">
                  Open generator <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent activity */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Recent generations</CardTitle>
          <CardDescription>Your latest AI-generated SEO assets.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {stats.generations.map((g) => (
              <li key={g.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{g.type}</Badge>
                  <span className="text-sm">{g.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">{new Date(g.date).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
