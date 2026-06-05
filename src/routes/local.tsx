import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GenerateSkeleton } from "@/components/seo/GenerateSkeleton";
import { CopyButton } from "@/components/seo/CopyButton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles, MapPin } from "lucide-react";
import { generateLocalSeo, type LocalSeoInput, type LocalSeoPack } from "@/lib/mock-seo";
import { trackGeneration } from "@/lib/seo-store";
import { motion } from "framer-motion";

export const Route = createFileRoute("/local")({
  head: () => ({
    meta: [
      { title: "Local SEO Generator — RankForge AI" },
      { name: "description", content: "Generate city + service local SEO landing pages, meta, and FAQs." },
    ],
    links: [{ rel: "canonical", href: "/local" }],
  }),
  component: LocalPage,
});

function LocalPage() {
  const [form, setForm] = useState<LocalSeoInput>({
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    service: "Digital Marketing",
    businessName: "BrightPath Digital",
  });
  const [loading, setLoading] = useState(false);
  const [pack, setPack] = useState<LocalSeoPack | null>(null);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPack(null);
    await new Promise((r) => setTimeout(r, 700));
    const p = generateLocalSeo(form);
    setPack(p);
    trackGeneration("Local SEO", p.title, { localPacks: 1 });
    setLoading(false);
  };

  return (
    <AppLayout title="Local SEO" subtitle="City-specific landing copy, meta, and FAQs">
      <div className="grid gap-6 lg:grid-cols-[380px,1fr]">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Sparkles className="h-4 w-4 text-primary" /> Local Brief</CardTitle>
            <CardDescription>Enter your city + service combination.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={run} className="space-y-4">
              {(["businessName", "service", "city", "state", "country"] as const).map((k) => (
                <div key={k} className="space-y-1.5">
                  <Label htmlFor={k} className="capitalize">{k.replace(/([A-Z])/g, " $1")}</Label>
                  <Input id={k} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
                </div>
              ))}
              <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground hover:opacity-90">
                {loading ? "Generating…" : "Generate Local SEO Pack"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {loading && <GenerateSkeleton />}
          {!loading && !pack && (
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <MapPin className="mb-3 h-10 w-10 opacity-40" />
                <p className="text-sm">Submit the brief to generate location-optimized content.</p>
              </CardContent>
            </Card>
          )}
          {pack && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-base">Local SEO Title</CardTitle>
                    <CardDescription>H1 for the landing page.</CardDescription>
                  </div>
                  <CopyButton text={pack.title} />
                </CardHeader>
                <CardContent>
                  <h2 className="text-xl font-semibold">{pack.title}</h2>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-base">Landing Page Copy</CardTitle>
                    <CardDescription>Above-the-fold body, location optimized.</CardDescription>
                  </div>
                  <CopyButton text={pack.landingCopy} />
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">{pack.landingCopy}</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-base">Meta Description</CardTitle>
                    <CardDescription>{pack.metaDescription.length}/160 chars</CardDescription>
                  </div>
                  <CopyButton text={pack.metaDescription} />
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{pack.metaDescription}</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Local FAQs</CardTitle>
                  <CardDescription>Schema-ready Q&A for the page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pack.faqs.map((f, i) => (
                    <div key={i} className="rounded-lg border p-3">
                      <p className="text-sm font-medium">{f.q}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{f.a}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
