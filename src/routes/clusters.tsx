import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { InputForm } from "@/components/seo/InputForm";
import { GenerateSkeleton } from "@/components/seo/GenerateSkeleton";
import { CopyButton } from "@/components/seo/CopyButton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateCluster, type BlogInput, type ContentCluster } from "@/lib/mock-seo";
import { useAppState, trackGeneration } from "@/lib/seo-store";
import { motion } from "framer-motion";
import { Network } from "lucide-react";

export const Route = createFileRoute("/clusters")({
  head: () => ({
    meta: [
      { title: "Content Cluster Generator — RankForge AI" },
      { name: "description", content: "Build pillar + supporting article clusters with visual topic relationships." },
    ],
    links: [{ rel: "canonical", href: "/clusters" }],
  }),
  component: ClustersPage,
});

function ClustersPage() {
  const { input } = useAppState();
  const [cluster, setCluster] = useState<ContentCluster | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async (i: BlogInput) => {
    setLoading(true);
    setCluster(null);
    await new Promise((r) => setTimeout(r, 800));
    const c = generateCluster(i);
    setCluster(c);
    trackGeneration("Cluster", c.pillar.title, { clusters: 1 });
    setLoading(false);
  };

  return (
    <AppLayout title="Content Clusters" subtitle="One pillar page + ten supporting articles">
      <div className="grid gap-6 lg:grid-cols-[380px,1fr]">
        <InputForm initial={input} onGenerate={run} loading={loading} cta="Generate Cluster" />

        <div className="space-y-6">
          {loading && <GenerateSkeleton />}
          {!loading && !cluster && (
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <Network className="mb-3 h-10 w-10 opacity-40" />
                <p className="text-sm">Submit the brief to generate a complete topical cluster.</p>
              </CardContent>
            </Card>
          )}
          {cluster && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Visual Map */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Cluster Map</CardTitle>
                  <CardDescription>Pillar at the center, supporting articles orbit around it.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative mx-auto aspect-square w-full max-w-md">
                    {/* Pillar */}
                    <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-2xl gradient-primary px-4 py-3 text-center text-primary-foreground shadow-elegant">
                      <p className="text-[10px] uppercase tracking-wide opacity-80">Pillar</p>
                      <p className="max-w-[140px] text-xs font-semibold leading-tight">{cluster.pillar.keyword}</p>
                    </div>
                    {/* Orbits */}
                    {cluster.supporting.map((s, i) => {
                      const angle = (i / cluster.supporting.length) * Math.PI * 2 - Math.PI / 2;
                      const r = 42;
                      const x = 50 + r * Math.cos(angle);
                      const y = 50 + r * Math.sin(angle);
                      return (
                        <div key={i}>
                          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <line x1="50" y1="50" x2={x} y2={y} stroke="currentColor" strokeOpacity="0.15" strokeDasharray="1.5,1.5" strokeWidth="0.4" className="text-primary" />
                          </svg>
                          <div
                            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-md border bg-card px-2 py-1 text-[10px] font-medium shadow-card"
                            style={{ left: `${x}%`, top: `${y}%`, maxWidth: 110 }}
                          >
                            {s.keyword}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Pillar Card */}
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <Badge className="mb-2 border-0 bg-primary/10 text-primary">Pillar Page</Badge>
                    <CardTitle>{cluster.pillar.title}</CardTitle>
                    <CardDescription className="mt-2">{cluster.pillar.description}</CardDescription>
                  </div>
                  <CopyButton text={cluster.pillar.title} label="Copy" />
                </CardHeader>
              </Card>

              {/* Supporting */}
              <div>
                <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Supporting Articles ({cluster.supporting.length})</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {cluster.supporting.map((s, i) => (
                    <Card key={i} className="shadow-card">
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <Badge variant="outline" className="text-[10px]">#{i + 1}</Badge>
                          <Badge className="border-0 bg-secondary text-secondary-foreground">{s.intent}</Badge>
                        </div>
                        <p className="text-sm font-semibold leading-tight">{s.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">Target keyword: <span className="font-mono text-foreground">{s.keyword}</span></p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
