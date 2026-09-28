import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, CheckCircle2 } from "lucide-react";

export type SeoAnalysisGoal = "Traffic" | "Leads" | "Sales" | "Brand";
export type SeoAnalysisDepth = "Quick audit" | "Standard audit" | "Deep crawl";

export interface SeoAnalysisSettings {
  websiteUrl: string;
  targetLocation: string;
  focusKeyword: string;
  industry: string;
  primaryGoal: SeoAnalysisGoal;
  analysisDepth: SeoAnalysisDepth;
  includeCompetitors: boolean;
  includeLocalSeo: boolean;
  includeTechnicalAudit: boolean;
  pageTypes: string;
  notes: string;
}

export const defaultSeoAnalysisSettings: SeoAnalysisSettings = {
  websiteUrl: "https://www.example.com",
  targetLocation: "Mumbai, India",
  focusKeyword: "seo services",
  industry: "Digital marketing",
  primaryGoal: "Leads",
  analysisDepth: "Standard audit",
  includeCompetitors: true,
  includeLocalSeo: true,
  includeTechnicalAudit: true,
  pageTypes: "Homepage, service pages, blog posts",
  notes: "Focus on conversion-ready landing pages and local intent keywords.",
};

const STORAGE_KEY = "seo_analysis_settings_v1";

export function readSeoAnalysisSettings(): SeoAnalysisSettings {
  if (typeof window === "undefined") return defaultSeoAnalysisSettings;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSeoAnalysisSettings;

    return { ...defaultSeoAnalysisSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSeoAnalysisSettings;
  }
}

export function saveSeoAnalysisSettings(settings: SeoAnalysisSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function AnalysisSettingsForm() {
  const [settings, setSettings] = useState<SeoAnalysisSettings>(() => readSeoAnalysisSettings());
  const [saved, setSaved] = useState(false);

  const updateField = <K extends keyof SeoAnalysisSettings>(key: K, value: SeoAnalysisSettings[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveSeoAnalysisSettings(settings);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="h-4 w-4 text-primary" />
          SEO Analysis Settings
        </CardTitle>
        <CardDescription>Configure the audit inputs and SEO goals that should drive your optimization recommendations.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                value={settings.websiteUrl}
                onChange={(event) => updateField("websiteUrl", event.target.value)}
                placeholder="https://www.example.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="targetLocation">Target location</Label>
              <Input
                id="targetLocation"
                value={settings.targetLocation}
                onChange={(event) => updateField("targetLocation", event.target.value)}
                placeholder="Mumbai, India"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="focusKeyword">Focus keyword</Label>
              <Input
                id="focusKeyword"
                value={settings.focusKeyword}
                onChange={(event) => updateField("focusKeyword", event.target.value)}
                placeholder="seo services"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={settings.industry}
                onChange={(event) => updateField("industry", event.target.value)}
                placeholder="Digital marketing"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="primaryGoal">Primary goal</Label>
              <Select value={settings.primaryGoal} onValueChange={(value: SeoAnalysisGoal) => updateField("primaryGoal", value)}>
                <SelectTrigger id="primaryGoal">
                  <SelectValue placeholder="Choose a goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Traffic">Traffic</SelectItem>
                  <SelectItem value="Leads">Leads</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Brand">Brand</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="analysisDepth">Audit depth</Label>
              <Select value={settings.analysisDepth} onValueChange={(value: SeoAnalysisDepth) => updateField("analysisDepth", value)}>
                <SelectTrigger id="analysisDepth">
                  <SelectValue placeholder="Choose depth" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Quick audit">Quick audit</SelectItem>
                  <SelectItem value="Standard audit">Standard audit</SelectItem>
                  <SelectItem value="Deep crawl">Deep crawl</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3 rounded-lg border bg-muted/30 p-3">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="includeCompetitors">Competitor tracking</Label>
                <Switch id="includeCompetitors" checked={settings.includeCompetitors} onCheckedChange={(checked) => updateField("includeCompetitors", checked)} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="includeLocalSeo">Local SEO scan</Label>
                <Switch id="includeLocalSeo" checked={settings.includeLocalSeo} onCheckedChange={(checked) => updateField("includeLocalSeo", checked)} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="includeTechnicalAudit">Technical audit</Label>
                <Switch id="includeTechnicalAudit" checked={settings.includeTechnicalAudit} onCheckedChange={(checked) => updateField("includeTechnicalAudit", checked)} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pageTypes">Page types to review</Label>
              <Input
                id="pageTypes"
                value={settings.pageTypes}
                onChange={(event) => updateField("pageTypes", event.target.value)}
                placeholder="Homepage, service pages, blog posts"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={settings.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Add any additional context, blockers, or opportunities to include in the analysis."
              rows={4}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-success">
              {saved ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Settings saved
                </>
              ) : (
                <span className="text-muted-foreground">Your audit settings are stored locally in the browser.</span>
              )}
            </div>
            <Button type="submit" className="gradient-primary text-primary-foreground hover:opacity-90">
              Save analysis settings
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
