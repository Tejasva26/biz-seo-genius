import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { AnalysisSettingsForm } from "@/components/seo/AnalysisSettingsForm";

export const Route = createFileRoute("/analysis")({
  head: () => ({
    meta: [
      { title: "SEO Analysis Settings — RankForge AI" },
      { name: "description", content: "Configure the website, target location, keyword, and audit depth for your SEO analysis workflow." },
    ],
    links: [{ rel: "canonical", href: "/analysis" }],
  }),
  component: AnalysisPage,
});

function AnalysisPage() {
  return (
    <AppLayout title="SEO Analysis Settings" subtitle="Define the site, location, and goals behind your audit recommendations">
      <div className="mx-auto max-w-5xl">
        <AnalysisSettingsForm />
      </div>
    </AppLayout>
  );
}
