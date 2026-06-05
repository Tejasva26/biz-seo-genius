import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { InputForm } from "@/components/seo/InputForm";
import { GenerateSkeleton } from "@/components/seo/GenerateSkeleton";
import { CopyButton } from "@/components/seo/CopyButton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { generateCluster, generateLinks, type BlogInput, type LinkSuggestion } from "@/lib/mock-seo";
import { useAppState, trackGeneration } from "@/lib/seo-store";
import { motion } from "framer-motion";
import { ArrowRight, Link2 } from "lucide-react";

export const Route = createFileRoute("/linking")({
  head: () => ({
    meta: [
      { title: "Internal Linking Ideas — RankForge AI" },
      { name: "description", content: "AI-suggested internal linking with anchor text and reasoning." },
    ],
    links: [{ rel: "canonical", href: "/linking" }],
  }),
  component: LinkingPage,
});

function LinkingPage() {
  const { input } = useAppState();
  const [links, setLinks] = useState<LinkSuggestion[] | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async (i: BlogInput) => {
    setLoading(true);
    setLinks(null);
    await new Promise((r) => setTimeout(r, 700));
    const c = generateCluster(i);
    const l = generateLinks(c);
    setLinks(l);
    trackGeneration("Linking", `${l.length} internal links`);
    setLoading(false);
  };

  return (
    <AppLayout title="Internal Linking" subtitle="Suggested anchor text and link reasoning">
      <div className="grid gap-6 lg:grid-cols-[380px,1fr]">
        <InputForm initial={input} onGenerate={run} loading={loading} cta="Generate Linking Plan" />

        <div className="space-y-6">
          {loading && <GenerateSkeleton />}
          {!loading && !links && (
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <Link2 className="mb-3 h-10 w-10 opacity-40" />
                <p className="text-sm">Generate a cluster to receive an internal linking plan.</p>
              </CardContent>
            </Card>
          )}
          {links && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Visual flow */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Internal Linking Map</CardTitle>
                  <CardDescription>How content flows authority across your cluster.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {links.slice(0, 8).map((l, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg border bg-card p-3 text-sm">
                        <span className="line-clamp-1 flex-1 font-medium">{l.source}</span>
                        <div className="flex items-center gap-1 text-primary">
                          <span className="hidden rounded-md bg-primary/10 px-2 py-0.5 text-xs font-mono md:inline">{l.anchor}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                        <span className="line-clamp-1 flex-1 text-right text-muted-foreground">{l.target}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">All Linking Suggestions ({links.length})</CardTitle>
                    <CardDescription>Source → target with anchor text and reasoning.</CardDescription>
                  </div>
                  <CopyButton text={links.map((l) => `${l.source} → ${l.target} [${l.anchor}]`).join("\n")} label="Copy" />
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Source Article</TableHead>
                          <TableHead>Target Article</TableHead>
                          <TableHead>Anchor</TableHead>
                          <TableHead className="hidden lg:table-cell">Reason</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {links.map((l, i) => (
                          <TableRow key={i}>
                            <TableCell className="max-w-[200px] truncate text-sm">{l.source}</TableCell>
                            <TableCell className="max-w-[200px] truncate text-sm">{l.target}</TableCell>
                            <TableCell><Badge variant="outline" className="font-mono text-xs">{l.anchor}</Badge></TableCell>
                            <TableCell className="hidden text-xs text-muted-foreground lg:table-cell">{l.reason}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
