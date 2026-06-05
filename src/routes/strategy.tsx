import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { InputForm } from "@/components/seo/InputForm";
import { GenerateSkeleton } from "@/components/seo/GenerateSkeleton";
import { CopyButton } from "@/components/seo/CopyButton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { generateCalendar, type BlogInput, type ContentCalendarRow } from "@/lib/mock-seo";
import { useAppState, trackGeneration } from "@/lib/seo-store";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";

export const Route = createFileRoute("/strategy")({
  head: () => ({
    meta: [
      { title: "Content Strategy Calendar — RankForge AI" },
      { name: "description", content: "30-day prioritized content calendar with keywords and intent." },
    ],
    links: [{ rel: "canonical", href: "/strategy" }],
  }),
  component: StrategyPage,
});

const priorityColor: Record<string, string> = {
  High: "bg-destructive/10 text-destructive",
  Medium: "bg-warning/15 text-warning-foreground",
  Low: "bg-muted text-muted-foreground",
};

function StrategyPage() {
  const { input } = useAppState();
  const [rows, setRows] = useState<ContentCalendarRow[] | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async (i: BlogInput) => {
    setLoading(true);
    setRows(null);
    await new Promise((r) => setTimeout(r, 700));
    const r = generateCalendar(i);
    setRows(r);
    trackGeneration("Strategy", `30-day calendar for ${i.topic}`);
    setLoading(false);
  };

  return (
    <AppLayout title="Content Strategy" subtitle="30-day prioritized content calendar">
      <div className="grid gap-6 lg:grid-cols-[380px,1fr]">
        <InputForm initial={input} onGenerate={run} loading={loading} cta="Generate 30-Day Calendar" />

        <div className="space-y-6">
          {loading && <GenerateSkeleton />}
          {!loading && !rows && (
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <CalendarDays className="mb-3 h-10 w-10 opacity-40" />
                <p className="text-sm">Generate a 30-day publishing calendar tuned to your brief.</p>
              </CardContent>
            </Card>
          )}
          {rows && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Calendar grid */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Monthly View</CardTitle>
                  <CardDescription>Color-coded by priority.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {rows.map((r) => (
                      <div key={r.day} className="aspect-square rounded-lg border bg-card p-2 text-[10px]">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{r.day}</span>
                          <span className={`rounded px-1 ${priorityColor[r.priority]}`}>{r.priority[0]}</span>
                        </div>
                        <p className="mt-1 line-clamp-3 text-muted-foreground">{r.topic}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Publishing Plan</CardTitle>
                    <CardDescription>Day-by-day breakdown.</CardDescription>
                  </div>
                  <CopyButton text={rows.map((r) => `${r.date}\t${r.topic}\t${r.keyword}\t${r.intent}\t${r.priority}`).join("\n")} label="Copy TSV" />
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Day</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Topic</TableHead>
                          <TableHead>Keyword</TableHead>
                          <TableHead>Intent</TableHead>
                          <TableHead>Priority</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rows.map((r) => (
                          <TableRow key={r.day}>
                            <TableCell className="font-semibold">{r.day}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{r.date}</TableCell>
                            <TableCell className="max-w-[260px] truncate text-sm">{r.topic}</TableCell>
                            <TableCell className="font-mono text-xs">{r.keyword}</TableCell>
                            <TableCell><Badge variant="outline">{r.intent}</Badge></TableCell>
                            <TableCell><Badge className={`border-0 ${priorityColor[r.priority]}`}>{r.priority}</Badge></TableCell>
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
