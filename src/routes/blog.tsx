import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { InputForm } from "@/components/seo/InputForm";
import { GenerateSkeleton } from "@/components/seo/GenerateSkeleton";
import { CopyButton } from "@/components/seo/CopyButton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { generateArticle, generateOutline, type BlogArticle, type BlogOutline, type BlogInput } from "@/lib/mock-seo";
import { useAppState, trackGeneration } from "@/lib/seo-store";
import { motion } from "framer-motion";
import { Hash, FileText } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "AI Blog Generator — RankForge AI" },
      { name: "description", content: "Generate SEO blog outlines and full long-form blog articles optimized for search intent." },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogPage,
});

function BlogPage() {
  const { input } = useAppState();
  const [outline, setOutline] = useState<BlogOutline | null>(null);
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async (i: BlogInput) => {
    setLoading(true);
    setOutline(null);
    setArticle(null);
    await new Promise((r) => setTimeout(r, 900));
    const a = generateArticle(i);
    setOutline(a);
    setArticle(a);
    trackGeneration("Blog", a.h1, { blogs: 1 });
    setLoading(false);
  };

  const fullText = article
    ? `${article.h1}\n\n${article.intro}\n\n${article.body.map((b) => `## ${b.heading}\n\n${b.paragraphs.join("\n\n")}`).join("\n\n")}\n\n## FAQs\n\n${article.faqAnswers.map((f) => `**${f.q}**\n${f.a}`).join("\n\n")}\n\n## Conclusion\n${article.conclusion}\n\n${article.cta}`
    : "";

  return (
    <AppLayout title="Blog Generator" subtitle="Outlines and full-length SEO blog articles">
      <div className="grid gap-6 lg:grid-cols-[380px,1fr]">
        <InputForm initial={input} onGenerate={run} loading={loading} cta="Generate Blog + Outline" />

        <div className="space-y-6">
          {loading && <GenerateSkeleton />}
          {!loading && !article && (
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <FileText className="mb-3 h-10 w-10 opacity-40" />
                <p className="text-sm">Fill in the brief and click generate to see your SEO blog outline and full article.</p>
              </CardContent>
            </Card>
          )}
          {article && outline && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Tabs defaultValue="article">
                <TabsList>
                  <TabsTrigger value="outline">Outline</TabsTrigger>
                  <TabsTrigger value="article">Full Article</TabsTrigger>
                  <TabsTrigger value="meta">SEO Meta</TabsTrigger>
                </TabsList>

                <TabsContent value="outline" className="mt-4">
                  <Card className="shadow-card">
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div>
                        <CardTitle className="text-base">Blog Outline</CardTitle>
                        <CardDescription>H1 / H2 / H3 structure with FAQs and CTA.</CardDescription>
                      </div>
                      <CopyButton text={JSON.stringify(outline, null, 2)} label="Copy outline" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Badge className="mb-2" variant="outline">H1</Badge>
                        <h2 className="text-xl font-semibold">{outline.h1}</h2>
                        <p className="mt-1 text-xs text-muted-foreground">Target: {outline.wordCount} words</p>
                      </div>
                      <Separator />
                      {outline.sections.map((s, i) => (
                        <div key={i}>
                          <p className="flex items-center gap-2 font-medium">
                            <Hash className="h-4 w-4 text-primary" /> {s.h2}
                          </p>
                          <ul className="ml-6 mt-1.5 list-disc space-y-1 text-sm text-muted-foreground">
                            {s.h3.map((h, j) => <li key={j}>{h}</li>)}
                          </ul>
                        </div>
                      ))}
                      <Separator />
                      <div>
                        <p className="font-medium">FAQ Section</p>
                        <ul className="ml-6 mt-1.5 list-disc space-y-1 text-sm text-muted-foreground">
                          {outline.faqs.map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                      </div>
                      <div className="rounded-lg gradient-subtle p-4 text-sm">
                        <p className="mb-1 font-medium">Call to Action</p>
                        <p className="text-muted-foreground">{outline.cta}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="article" className="mt-4">
                  <Card className="shadow-card">
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div>
                        <CardTitle className="text-base">Full Blog Article</CardTitle>
                        <CardDescription>{article.wordCount}-word draft, search-intent optimized.</CardDescription>
                      </div>
                      <CopyButton text={fullText} label="Copy article" />
                    </CardHeader>
                    <CardContent className="prose-sm max-w-none space-y-4">
                      <h1 className="text-2xl font-semibold leading-tight">{article.h1}</h1>
                      <p className="text-muted-foreground">{article.intro}</p>
                      {article.body.map((b, i) => (
                        <div key={i} className="space-y-2">
                          <h2 className="text-lg font-semibold">{b.heading}</h2>
                          {b.paragraphs.map((p, j) => <p key={j} className="text-sm leading-relaxed text-muted-foreground">{p}</p>)}
                        </div>
                      ))}
                      <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
                      <div className="space-y-3">
                        {article.faqAnswers.map((f, i) => (
                          <div key={i}>
                            <p className="text-sm font-medium">{f.q}</p>
                            <p className="text-sm text-muted-foreground">{f.a}</p>
                          </div>
                        ))}
                      </div>
                      <h2 className="text-lg font-semibold">Conclusion</h2>
                      <p className="text-sm text-muted-foreground">{article.conclusion}</p>
                      <div className="rounded-lg gradient-primary p-5 text-primary-foreground">
                        <p className="text-sm font-medium">{article.cta}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="meta" className="mt-4">
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle className="text-base">SEO Metadata</CardTitle>
                      <CardDescription>Ready to paste into your CMS.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <MetaRow label="SEO Title" value={article.seoTitle} hint={`${article.seoTitle.length}/60 chars`} />
                      <MetaRow label="Meta Description" value={article.metaDescription} hint={`${article.metaDescription.length}/160 chars`} />
                      <MetaRow label="URL Slug" value={`/blog/${article.slug}`} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function MetaRow({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="mb-1.5 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <div className="flex items-center gap-2">
          {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
          <CopyButton text={value} label="Copy" />
        </div>
      </div>
      <p className="text-sm">{value}</p>
    </div>
  );
}
