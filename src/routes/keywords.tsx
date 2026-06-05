import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { InputForm } from "@/components/seo/InputForm";
import { GenerateSkeleton } from "@/components/seo/GenerateSkeleton";
import { CopyButton } from "@/components/seo/CopyButton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { generateKeywords, type BlogInput, type KeywordRow } from "@/lib/mock-seo";
import { useAppState, trackGeneration } from "@/lib/seo-store";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/keywords")({
  head: () => ({
    meta: [
      { title: "Keyword Intent Mapping — RankForge AI" },
      { name: "description", content: "Map primary, secondary, and long-tail keywords with search intent classification." },
    ],
    links: [{ rel: "canonical", href: "/keywords" }],
  }),
  component: KeywordsPage,
});

const intentColors: Record<string, string> = {
  Informational: "bg-primary/10 text-primary",
  Commercial: "bg-warning/15 text-warning-foreground",
  Transactional: "bg-success/15 text-success-foreground",
  Navigational: "bg-accent/15 text-accent-foreground",
};

function KeywordsPage() {
  const { input } = useAppState();
  const [rows, setRows] = useState<KeywordRow[] | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async (i: BlogInput) => {
    setLoading(true);
    setRows(null);
    await new Promise((r) => setTimeout(r, 700));
    const r = generateKeywords(i);
    setRows(r);
    trackGeneration("Keywords", `${i.topic} — ${r.length} keywords`, { keywords: r.length });
    setLoading(false);
  };

  return (
    <AppLayout title="Keyword Intent Mapping" subtitle="Primary, secondary, and long-tail keywords with intent">
      <div className="grid gap-6 lg:grid-cols-[380px,1fr]">
        <InputForm initial={input} onGenerate={run} loading={loading} cta="Map Keywords" />

        <div className="space-y-6">
          {loading && <GenerateSkeleton />}
          {!loading && !rows && (
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <Search className="mb-3 h-10 w-10 opacity-40" />
                <p className="text-sm">Submit the brief to map keywords by intent and difficulty.</p>
              </CardContent>
            </Card>
          )}
          {rows && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-4">
                {(["Primary", "Secondary", "Long-tail"] as const).map((t) => (
                  <Card key={t} className="shadow-card">
                    <CardContent className="p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{t}</p>
                      <p className="mt-1 text-2xl font-semibold">{rows.filter((r) => r.type === t).length}</p>
                    </CardContent>
                  </Card>
                ))}
                <Card className="shadow-card">
                  <CardContent className="p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Total volume</p>
                    <p className="mt-1 text-2xl font-semibold">{rows.reduce((a, r) => a + r.volume, 0).toLocaleString()}</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Keyword Intent Table</CardTitle>
                    <CardDescription>Group your content strategy by buyer journey stage.</CardDescription>
                  </div>
                  <CopyButton text={rows.map((r) => `${r.keyword}\t${r.type}\t${r.intent}\t${r.volume}\t${r.difficulty}`).join("\n")} label="Copy TSV" />
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Keyword</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Intent</TableHead>
                          <TableHead className="hidden md:table-cell">Reason</TableHead>
                          <TableHead className="text-right">Volume</TableHead>
                          <TableHead className="w-36">Difficulty</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rows.map((r, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{r.keyword}</TableCell>
                            <TableCell><Badge variant="outline">{r.type}</Badge></TableCell>
                            <TableCell>
                              <Badge className={`border-0 ${intentColors[r.intent]}`}>{r.intent}</Badge>
                            </TableCell>
                            <TableCell className="hidden max-w-xs text-xs text-muted-foreground md:table-cell">{r.reason}</TableCell>
                            <TableCell className="text-right tabular-nums">{r.volume.toLocaleString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress value={r.difficulty} className="h-1.5" />
                                <span className="w-8 text-right text-xs tabular-nums">{r.difficulty}</span>
                              </div>
                            </TableCell>
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
