import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import type { BlogInput } from "@/lib/mock-seo";
import { updateInput } from "@/lib/seo-store";

interface Props {
  initial: BlogInput;
  onGenerate: (input: BlogInput) => Promise<void> | void;
  loading?: boolean;
  cta?: string;
  fields?: (keyof BlogInput)[];
}

const labels: Record<keyof BlogInput, string> = {
  businessName: "Business Name",
  industry: "Industry",
  product: "Product / Service",
  audience: "Target Audience",
  location: "Target Location",
  topic: "Blog Topic",
};

const placeholders: Record<keyof BlogInput, string> = {
  businessName: "e.g. BrightPath Digital",
  industry: "e.g. Digital Marketing",
  product: "e.g. SEO & Content Strategy",
  audience: "e.g. B2B SaaS founders",
  location: "e.g. Mumbai",
  topic: "e.g. AI-Powered SEO",
};

export function InputForm({ initial, onGenerate, loading, cta = "Generate", fields }: Props) {
  const [data, setData] = useState<BlogInput>(initial);
  const keys = (fields ?? (Object.keys(labels) as (keyof BlogInput)[])) as (keyof BlogInput)[];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateInput(data);
    await onGenerate(data);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-primary" />
          Content Brief
        </CardTitle>
        <CardDescription>Fill in your business context — the AI will tailor every output.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          {keys.map((k) => (
            <div key={k} className="space-y-1.5">
              <Label htmlFor={k}>{labels[k]}</Label>
              <Input
                id={k}
                value={data[k]}
                onChange={(e) => setData({ ...data, [k]: e.target.value })}
                placeholder={placeholders[k]}
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground hover:opacity-90">
              {loading ? "Generating…" : cta}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
