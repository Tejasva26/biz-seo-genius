import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { InputForm } from "@/components/seo/InputForm";
import { CopyButton } from "@/components/seo/CopyButton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  generateArticle,
  generateKeywords,
  generateCluster,
  generateLinks,
  generateLocalSeo,
  generateCalendar,
  type BlogInput,
  type BlogArticle,
  type KeywordRow,
  type ContentCluster,
  type LinkSuggestion,
  type LocalSeoPack,
  type ContentCalendarRow,
} from "@/lib/mock-seo";
import { useAppState, trackGeneration } from "@/lib/seo-store";
import { Package, Download, FileDown, Copy, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const Route = createFileRoute("/pack")({
  head: () => ({
    meta: [
      { title: "AI-Generated SEO Blog Pack — RankForge AI" },
      { name: "description", content: "Download the complete AI-generated SEO Blog Pack as PDF or DOCX." },
    ],
    links: [{ rel: "canonical", href: "/pack" }],
  }),
  component: PackPage,
});

interface Pack {
  input: BlogInput;
  article: BlogArticle;
  keywords: KeywordRow[];
  cluster: ContentCluster;
  links: LinkSuggestion[];
  local: LocalSeoPack;
  calendar: ContentCalendarRow[];
}

function PackPage() {
  const { input } = useAppState();
  const [pack, setPack] = useState<Pack | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async (i: BlogInput) => {
    setLoading(true);
    setPack(null);
    await new Promise((r) => setTimeout(r, 1100));
    const cluster = generateCluster(i);
    const p: Pack = {
      input: i,
      article: generateArticle(i),
      keywords: generateKeywords(i),
      cluster,
      links: generateLinks(cluster),
      local: generateLocalSeo({
        city: i.location || "Mumbai",
        state: "Maharashtra",
        country: "India",
        service: i.product || "SEO Services",
        businessName: i.businessName,
      }),
      calendar: generateCalendar(i),
    };
    setPack(p);
    trackGeneration("Blog Pack", `Complete SEO Pack: ${i.topic}`, { blogs: 1, clusters: 1, localPacks: 1, keywords: 10 });
    setLoading(false);
  };

  const buildText = (p: Pack) => {
    return `# SEO BLOG PACK\n## ${p.input.businessName} — ${p.input.topic}\n\n=== BLOG OUTLINE ===\nH1: ${p.article.h1}\nTarget length: ${p.article.wordCount} words\n\n${p.article.sections.map((s) => `## ${s.h2}\n${s.h3.map((h) => `  - ${h}`).join("\n")}`).join("\n\n")}\n\nFAQs:\n${p.article.faqs.map((f) => `- ${f}`).join("\n")}\n\nCTA: ${p.article.cta}\n\n=== FULL ARTICLE ===\n${p.article.intro}\n\n${p.article.body.map((b) => `## ${b.heading}\n${b.paragraphs.join("\n\n")}`).join("\n\n")}\n\n## FAQs\n${p.article.faqAnswers.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n")}\n\n## Conclusion\n${p.article.conclusion}\n\n=== KEYWORDS ===\n${p.keywords.map((k) => `[${k.type}] ${k.keyword} — ${k.intent} (vol ${k.volume}, KD ${k.difficulty})\n  Reason: ${k.reason}`).join("\n")}\n\n=== CONTENT CLUSTER ===\nPillar: ${p.cluster.pillar.title}\n${p.cluster.pillar.description}\n\nSupporting:\n${p.cluster.supporting.map((s, i) => `${i + 1}. ${s.title} — kw: ${s.keyword} (${s.intent})`).join("\n")}\n\n=== INTERNAL LINKING ===\n${p.links.map((l) => `${l.source} → ${l.target} [anchor: ${l.anchor}]\n  Reason: ${l.reason}`).join("\n")}\n\n=== LOCAL SEO ===\n${p.local.title}\n\n${p.local.landingCopy}\n\nMeta: ${p.local.metaDescription}\n\nLocal FAQs:\n${p.local.faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n")}\n\n=== 30-DAY CONTENT CALENDAR ===\n${p.calendar.map((r) => `Day ${r.day} (${r.date}) [${r.priority}] — ${r.topic} :: ${r.keyword} (${r.intent})`).join("\n")}\n`;
  };

  const buildHtml = (p: Pack) => {
    const escape = (s: string) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);
    return `<!doctype html><html><head><meta charset="utf-8"><title>SEO Blog Pack — ${escape(p.input.topic)}</title><style>
      body{font-family:-apple-system,Segoe UI,Inter,Arial,sans-serif;max-width:800px;margin:40px auto;padding:0 24px;color:#1a1a2e;line-height:1.6}
      h1{color:#4f46e5}h2{border-bottom:2px solid #eee;padding-bottom:6px;margin-top:32px}
      h3{color:#4f46e5}table{width:100%;border-collapse:collapse;font-size:14px}
      th,td{padding:8px;border:1px solid #ddd;text-align:left}th{background:#f4f4ff}
      .badge{display:inline-block;background:#eef;padding:2px 8px;border-radius:4px;font-size:12px;margin-right:6px}
      .cta{background:linear-gradient(135deg,#4f46e5,#7c4dff);color:white;padding:16px;border-radius:8px;margin:16px 0}
    </style></head><body>
      <h1>SEO Blog Pack</h1>
      <p><strong>${escape(p.input.businessName)}</strong> · ${escape(p.input.industry)} · ${escape(p.input.location)}</p>
      <h2>1. Blog Outline</h2><h3>${escape(p.article.h1)}</h3>
      <p><em>Target: ${p.article.wordCount} words</em></p>
      ${p.article.sections.map((s) => `<h4>${escape(s.h2)}</h4><ul>${s.h3.map((h) => `<li>${escape(h)}</li>`).join("")}</ul>`).join("")}
      <h4>FAQs</h4><ul>${p.article.faqs.map((f) => `<li>${escape(f)}</li>`).join("")}</ul>
      <div class="cta">${escape(p.article.cta)}</div>
      <h2>2. Full Blog Article</h2><h3>${escape(p.article.h1)}</h3>
      <p>${escape(p.article.intro)}</p>
      ${p.article.body.map((b) => `<h3>${escape(b.heading)}</h3>${b.paragraphs.map((pg) => `<p>${escape(pg)}</p>`).join("")}`).join("")}
      <h3>FAQs</h3>${p.article.faqAnswers.map((f) => `<p><strong>${escape(f.q)}</strong><br>${escape(f.a)}</p>`).join("")}
      <h3>Conclusion</h3><p>${escape(p.article.conclusion)}</p>
      <h2>3. Keyword Intent Mapping</h2>
      <table><tr><th>Keyword</th><th>Type</th><th>Intent</th><th>Volume</th><th>KD</th></tr>
      ${p.keywords.map((k) => `<tr><td>${escape(k.keyword)}</td><td>${k.type}</td><td>${k.intent}</td><td>${k.volume}</td><td>${k.difficulty}</td></tr>`).join("")}
      </table>
      <h2>4. Content Cluster</h2>
      <p><span class="badge">Pillar</span><strong>${escape(p.cluster.pillar.title)}</strong></p>
      <p>${escape(p.cluster.pillar.description)}</p>
      <ol>${p.cluster.supporting.map((s) => `<li><strong>${escape(s.title)}</strong> — <code>${escape(s.keyword)}</code> (${s.intent})</li>`).join("")}</ol>
      <h2>5. Internal Linking</h2>
      <table><tr><th>Source</th><th>Target</th><th>Anchor</th></tr>
      ${p.links.map((l) => `<tr><td>${escape(l.source)}</td><td>${escape(l.target)}</td><td><code>${escape(l.anchor)}</code></td></tr>`).join("")}
      </table>
      <h2>6. Local SEO Version</h2>
      <h3>${escape(p.local.title)}</h3><p>${escape(p.local.landingCopy)}</p>
      <p><strong>Meta:</strong> ${escape(p.local.metaDescription)}</p>
      ${p.local.faqs.map((f) => `<p><strong>${escape(f.q)}</strong><br>${escape(f.a)}</p>`).join("")}
      <h2>7. 30-Day Content Calendar</h2>
      <table><tr><th>Day</th><th>Date</th><th>Topic</th><th>Keyword</th><th>Intent</th><th>Priority</th></tr>
      ${p.calendar.map((r) => `<tr><td>${r.day}</td><td>${r.date}</td><td>${escape(r.topic)}</td><td>${escape(r.keyword)}</td><td>${r.intent}</td><td>${r.priority}</td></tr>`).join("")}
      </table>
    </body></html>`;
  };

  const download = (name: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${name}`);
  };

  const downloadPdf = (p: Pack) => {
    const html = buildHtml(p);
    const w = window.open("", "_blank");
    if (!w) { toast.error("Pop-up blocked. Allow pop-ups to print to PDF."); return; }
    w.document.write(html + `<script>setTimeout(()=>window.print(),300)</script>`);
    w.document.close();
    toast.success("Opening print dialog — choose 'Save as PDF'.");
  };

  const sections = pack
    ? [
        { title: "SEO Blog Outline", done: true },
        { title: "Full Blog Content", done: true },
        { title: "Keyword Intent Mapping", done: true },
        { title: "Content Cluster Plan", done: true },
        { title: "Internal Linking Recommendations", done: true },
        { title: "Local SEO Version", done: true },
        { title: "Monthly Content Calendar", done: true },
      ]
    : [];

  return (
    <AppLayout title="SEO Blog Pack" subtitle="Complete AI-generated deliverable — export in one click">
      <div className="grid gap-6 lg:grid-cols-[380px,1fr]">
        <InputForm initial={input} onGenerate={run} loading={loading} cta="Generate Full Blog Pack" />

        <div className="space-y-6">
          {!pack && !loading && (
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <Package className="mb-3 h-10 w-10 opacity-40" />
                <p className="text-sm">Generate to assemble the complete SEO Blog Pack.</p>
              </CardContent>
            </Card>
          )}

          {loading && (
            <Card className="shadow-card">
              <CardContent className="space-y-3 p-6">
                <p className="text-sm font-medium">Assembling your Blog Pack…</p>
                {["Outline", "Article", "Keywords", "Cluster", "Linking", "Local", "Calendar"].map((s, i) => (
                  <motion.div key={s} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> Generating {s}…
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          )}

          {pack && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="overflow-hidden shadow-elegant">
                <div className="gradient-primary p-6 text-primary-foreground">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Badge className="mb-2 border-0 bg-white/15 text-primary-foreground">Deliverable</Badge>
                      <h2 className="text-2xl font-semibold">Complete SEO Blog Pack</h2>
                      <p className="mt-1 text-sm text-primary-foreground/85">{pack.input.topic} · {pack.input.businessName}</p>
                    </div>
                    <Package className="h-10 w-10 opacity-80" />
                  </div>
                </div>
                <CardContent className="space-y-4 p-6">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <Stat label="Outline sections" value={pack.article.sections.length} />
                    <Stat label="Article words" value={pack.article.wordCount} />
                    <Stat label="Keywords" value={pack.keywords.length} />
                    <Stat label="Cluster articles" value={pack.cluster.supporting.length + 1} />
                    <Stat label="Internal links" value={pack.links.length} />
                    <Stat label="Calendar days" value={pack.calendar.length} />
                  </div>
                  <Separator />
                  <div>
                    <p className="mb-2 text-sm font-medium">Included sections</p>
                    <ul className="grid gap-1.5 sm:grid-cols-2">
                      {sections.map((s) => (
                        <li key={s.title} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-success" /> {s.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Separator />
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => downloadPdf(pack)} className="gap-2 gradient-primary text-primary-foreground hover:opacity-90">
                      <FileDown className="h-4 w-4" /> Download PDF
                    </Button>
                    <Button variant="outline" onClick={() => download(`seo-blog-pack-${pack.input.topic.toLowerCase().replace(/\s+/g, "-")}.doc`, buildHtml(pack), "application/msword")} className="gap-2">
                      <Download className="h-4 w-4" /> Download DOCX
                    </Button>
                    <Button variant="outline" onClick={() => download(`seo-blog-pack.html`, buildHtml(pack), "text/html")} className="gap-2">
                      <Download className="h-4 w-4" /> Download HTML
                    </Button>
                    <CopyButton text={buildText(pack)} label="Copy all to clipboard" />
                    <Button
                      variant="ghost"
                      className="gap-2"
                      onClick={async () => {
                        await navigator.clipboard.writeText(buildText(pack));
                        toast.success("Plain-text pack copied");
                      }}
                    >
                      <Copy className="h-4 w-4" /> Copy as plain text
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Live Preview</CardTitle>
                  <CardDescription>Quick scroll-through of the rendered pack.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[500px] space-y-6 overflow-y-auto rounded-lg border bg-muted/30 p-5">
                    <Section title="1. SEO Blog Outline">
                      <h4 className="font-semibold">{pack.article.h1}</h4>
                      <ul className="mt-2 ml-5 list-disc text-sm text-muted-foreground">
                        {pack.article.sections.map((s, i) => <li key={i}>{s.h2}</li>)}
                      </ul>
                    </Section>
                    <Section title="2. Full Article (excerpt)">
                      <p className="text-sm text-muted-foreground">{pack.article.intro.slice(0, 280)}…</p>
                    </Section>
                    <Section title="3. Keywords">
                      <p className="text-sm text-muted-foreground">{pack.keywords.slice(0, 4).map((k) => k.keyword).join(" · ")} …</p>
                    </Section>
                    <Section title="4. Cluster">
                      <p className="text-sm text-muted-foreground">{pack.cluster.pillar.title} + {pack.cluster.supporting.length} supporting articles</p>
                    </Section>
                    <Section title="5. Internal Linking">
                      <p className="text-sm text-muted-foreground">{pack.links.length} link suggestions across the cluster</p>
                    </Section>
                    <Section title="6. Local SEO">
                      <p className="text-sm font-medium">{pack.local.title}</p>
                    </Section>
                    <Section title="7. 30-Day Calendar">
                      <p className="text-sm text-muted-foreground">{pack.calendar.length} planned posts across the month</p>
                    </Section>
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

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-primary">{title}</p>
      {children}
    </div>
  );
}
