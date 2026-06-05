// Mock AI generators producing realistic SEO content. Deterministic-ish with light randomness.

export type Intent = "Informational" | "Commercial" | "Transactional" | "Navigational";

export interface BlogInput {
  businessName: string;
  industry: string;
  product: string;
  audience: string;
  location: string;
  topic: string;
}

export interface BlogOutline {
  seoTitle: string;
  metaDescription: string;
  slug: string;
  h1: string;
  wordCount: number;
  sections: { h2: string; h3: string[] }[];
  faqs: string[];
  cta: string;
}

export interface BlogArticle extends BlogOutline {
  intro: string;
  body: { heading: string; paragraphs: string[] }[];
  faqAnswers: { q: string; a: string }[];
  conclusion: string;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export function generateOutline(input: BlogInput): BlogOutline {
  const topic = input.topic || "SEO Strategy";
  const loc = input.location ? ` in ${input.location}` : "";
  const h1 = `The Complete Guide to ${topic}${loc} for ${input.audience || "Modern Businesses"} (${new Date().getFullYear()})`;
  const seoTitle = `${topic}${loc}: A Practical Guide by ${input.businessName || "Experts"}`;
  return {
    seoTitle: seoTitle.slice(0, 60),
    metaDescription: `Discover how ${input.businessName || "industry leaders"} use ${topic.toLowerCase()} to grow ${input.industry || "your business"}${loc}. Actionable tips, frameworks, and ${input.product || "services"}.`.slice(0, 158),
    slug: slugify(`${topic}-${input.location}-guide`),
    h1,
    wordCount: 1800 + Math.floor(Math.random() * 600),
    sections: [
      {
        h2: `Why ${topic} Matters for ${input.industry || "Your Industry"}`,
        h3: [
          `The current state of ${topic.toLowerCase()}`,
          `Common challenges ${input.audience || "businesses"} face`,
          `ROI benchmarks and key metrics`,
        ],
      },
      {
        h2: `Core Principles of ${topic}`,
        h3: [`Foundational frameworks`, `Tools and platforms`, `Process workflows`],
      },
      {
        h2: `Step-by-Step Implementation`,
        h3: [
          `Step 1: Audit your current setup`,
          `Step 2: Define clear KPIs`,
          `Step 3: Execute and iterate`,
        ],
      },
      {
        h2: `${topic} for ${input.audience || "Growing Brands"}`,
        h3: [`Local strategies${loc}`, `Scaling beyond launch`, `Case studies and results`],
      },
      {
        h2: `Mistakes to Avoid`,
        h3: [`Over-automation`, `Ignoring intent`, `Skipping measurement`],
      },
    ],
    faqs: [
      `What is ${topic.toLowerCase()} and why does it matter?`,
      `How long does ${topic.toLowerCase()} take to show results?`,
      `What does ${topic.toLowerCase()} typically cost${loc}?`,
      `Can small businesses benefit from ${topic.toLowerCase()}?`,
      `How is ${input.businessName || "your team"} different from competitors?`,
    ],
    cta: `Ready to grow with ${input.product || "expert support"}? Book a free strategy call with ${input.businessName || "our team"}${loc} today.`,
  };
}

export function generateArticle(input: BlogInput): BlogArticle {
  const outline = generateOutline(input);
  const biz = input.businessName || "our team";
  const loc = input.location || "your city";
  return {
    ...outline,
    intro: `In today's competitive ${input.industry || "marketplace"}, mastering ${input.topic.toLowerCase()} is no longer optional — it's essential. ${input.audience || "Modern brands"} that invest in a deliberate ${input.topic.toLowerCase()} strategy consistently outperform competitors who treat it as an afterthought. In this in-depth guide, ${biz} unpacks every framework, tool, and tactic we use to help clients${loc ? ` across ${loc}` : ""} achieve sustainable, search-driven growth with ${input.product || "our services"}.`,
    body: outline.sections.map((s) => ({
      heading: s.h2,
      paragraphs: s.h3.map(
        (h3) =>
          `${h3}. ${biz} has worked with dozens of ${input.audience || "businesses"} on exactly this challenge. The reality is that most teams underestimate how much compounding leverage a well-executed ${input.topic.toLowerCase()} program delivers. Done right, you'll see qualified traffic, lower acquisition costs, and a stronger brand authority signal across the search landscape — including ${loc} specifically. The tactics below are battle-tested and ready to deploy this quarter.`,
      ),
    })),
    faqAnswers: outline.faqs.map((q) => ({
      q,
      a: `Great question. ${q.replace("?", "")} — in short, it depends on your starting point, goals, and competitive landscape, but most ${input.audience || "businesses"} working with ${biz} see meaningful improvements within 60–90 days when following the framework above.`,
    })),
    conclusion: `${input.topic} is one of the highest-leverage investments any ${input.industry || "modern"} business can make today. The brands that win in ${loc} are the ones that combine clear intent mapping, helpful long-form content, and a measurable ${input.topic.toLowerCase()} workflow. If you're ready to take the next step, ${biz} is here to help.`,
  };
}

export interface KeywordRow {
  keyword: string;
  type: "Primary" | "Secondary" | "Long-tail";
  intent: Intent;
  reason: string;
  volume: number;
  difficulty: number;
}

export function generateKeywords(input: BlogInput): KeywordRow[] {
  const t = input.topic.toLowerCase();
  const loc = input.location || "";
  const biz = (input.businessName || "brand").toLowerCase();
  const rows: KeywordRow[] = [
    { keyword: t, type: "Primary", intent: "Informational", reason: "Broad topical anchor for the cluster.", volume: 12100, difficulty: 62 },
    { keyword: `${t} guide`, type: "Primary", intent: "Informational", reason: "Top-of-funnel research intent.", volume: 5400, difficulty: 48 },
    { keyword: `best ${t}`, type: "Secondary", intent: "Commercial", reason: "Comparison stage, evaluating options.", volume: 2900, difficulty: 55 },
    { keyword: `${t} services`, type: "Secondary", intent: "Commercial", reason: "Considering a provider.", volume: 1900, difficulty: 51 },
    { keyword: `${t} agency ${loc}`.trim(), type: "Secondary", intent: "Transactional", reason: "Location-qualified buyer intent.", volume: 880, difficulty: 38 },
    { keyword: `hire ${t} expert`, type: "Long-tail", intent: "Transactional", reason: "High intent to purchase.", volume: 320, difficulty: 28 },
    { keyword: `how to do ${t} for small business`, type: "Long-tail", intent: "Informational", reason: "Persona-specific how-to.", volume: 480, difficulty: 22 },
    { keyword: `${t} pricing ${loc}`.trim(), type: "Long-tail", intent: "Commercial", reason: "Late-stage cost research.", volume: 210, difficulty: 25 },
    { keyword: `${biz} ${t}`, type: "Long-tail", intent: "Navigational", reason: "Brand + topic lookup.", volume: 90, difficulty: 12 },
    { keyword: `${t} checklist`, type: "Long-tail", intent: "Informational", reason: "Practical resource intent.", volume: 720, difficulty: 30 },
  ];
  return rows.filter((r) => r.keyword.length > 0);
}

export interface ClusterArticle {
  title: string;
  keyword: string;
  intent: Intent;
}

export interface ContentCluster {
  pillar: { title: string; keyword: string; description: string };
  supporting: ClusterArticle[];
}

export function generateCluster(input: BlogInput): ContentCluster {
  const t = input.topic;
  return {
    pillar: {
      title: `The Ultimate ${t} Pillar Guide for ${input.industry || "Business"}`,
      keyword: t.toLowerCase(),
      description: `Comprehensive pillar page covering every facet of ${t.toLowerCase()} — definitions, frameworks, tools, case studies, and FAQs. Acts as the authority hub all supporting articles link to.`,
    },
    supporting: [
      { title: `What Is ${t}? A Beginner's Introduction`, keyword: `what is ${t.toLowerCase()}`, intent: "Informational" },
      { title: `${t} vs Traditional Methods: A 2025 Comparison`, keyword: `${t.toLowerCase()} comparison`, intent: "Commercial" },
      { title: `Top 10 ${t} Tools for ${input.audience || "Marketers"}`, keyword: `best ${t.toLowerCase()} tools`, intent: "Commercial" },
      { title: `How to Build a ${t} Strategy from Scratch`, keyword: `${t.toLowerCase()} strategy`, intent: "Informational" },
      { title: `${t} Pricing: What Should You Budget?`, keyword: `${t.toLowerCase()} cost`, intent: "Commercial" },
      { title: `${t} Case Study: 3x Growth in 90 Days`, keyword: `${t.toLowerCase()} case study`, intent: "Informational" },
      { title: `Common ${t} Mistakes (and How to Avoid Them)`, keyword: `${t.toLowerCase()} mistakes`, intent: "Informational" },
      { title: `Hire a ${t} Expert: What to Look For`, keyword: `hire ${t.toLowerCase()} expert`, intent: "Transactional" },
      { title: `${t} for ${input.location || "Local Businesses"}`, keyword: `${t.toLowerCase()} ${input.location || "local"}`, intent: "Transactional" },
      { title: `The Future of ${t}: Trends to Watch`, keyword: `${t.toLowerCase()} trends`, intent: "Informational" },
    ],
  };
}

export interface LinkSuggestion {
  source: string;
  target: string;
  anchor: string;
  reason: string;
}

export function generateLinks(cluster: ContentCluster): LinkSuggestion[] {
  const links: LinkSuggestion[] = [];
  cluster.supporting.forEach((s) => {
    links.push({
      source: s.title,
      target: cluster.pillar.title,
      anchor: cluster.pillar.keyword,
      reason: "Reinforces pillar authority and passes topical relevance back to the hub.",
    });
  });
  for (let i = 0; i < cluster.supporting.length - 1; i++) {
    links.push({
      source: cluster.supporting[i].title,
      target: cluster.supporting[i + 1].title,
      anchor: cluster.supporting[i + 1].keyword,
      reason: "Lateral link to related sub-topic — keeps users on the cluster journey.",
    });
  }
  return links;
}

export interface LocalSeoInput {
  city: string;
  state: string;
  country: string;
  service: string;
  businessName?: string;
}

export interface LocalSeoPack {
  title: string;
  landingCopy: string;
  metaDescription: string;
  faqs: { q: string; a: string }[];
}

export function generateLocalSeo(input: LocalSeoInput): LocalSeoPack {
  const biz = input.businessName || "Our Team";
  return {
    title: `Best ${input.service} in ${input.city}, ${input.state} | ${biz}`,
    landingCopy: `Looking for the best ${input.service.toLowerCase()} in ${input.city}? ${biz} is the trusted ${input.service.toLowerCase()} partner for businesses across ${input.city}, ${input.state} and the wider ${input.country} region. With years of local expertise, transparent pricing, and a track record of measurable results, we help ${input.city}-based brands grow faster than they ever thought possible. From strategy to execution, our ${input.city} team treats every client like a long-term partner — not a number on a spreadsheet.`,
    metaDescription: `Top-rated ${input.service.toLowerCase()} in ${input.city}, ${input.state}. ${biz} delivers proven, locally-focused results. Free consultation available.`.slice(0, 158),
    faqs: [
      { q: `Do you offer ${input.service.toLowerCase()} in ${input.city}?`, a: `Yes — ${biz} serves clients across ${input.city} and the surrounding ${input.state} area with dedicated local support.` },
      { q: `How much does ${input.service.toLowerCase()} cost in ${input.city}?`, a: `Pricing depends on scope, but most ${input.city} clients invest between $500 and $5,000 per month. We offer transparent, flexible packages.` },
      { q: `Why choose a local ${input.city} provider?`, a: `Local providers understand the ${input.city} market, customer behavior, and competitive landscape better than out-of-region agencies.` },
      { q: `How fast can we get started?`, a: `Most ${input.city} engagements kick off within 5–7 business days of the initial strategy call.` },
    ],
  };
}

export interface ContentCalendarRow {
  day: number;
  date: string;
  topic: string;
  keyword: string;
  intent: Intent;
  priority: "High" | "Medium" | "Low";
}

export function generateCalendar(input: BlogInput): ContentCalendarRow[] {
  const t = input.topic;
  const cluster = generateCluster(input);
  const titles = [cluster.pillar.title, ...cluster.supporting.map((s) => s.title)];
  const intents: Intent[] = ["Informational", "Commercial", "Transactional", "Navigational"];
  const priorities: ("High" | "Medium" | "Low")[] = ["High", "High", "Medium", "Medium", "Low"];
  const rows: ContentCalendarRow[] = [];
  const start = new Date();
  for (let d = 1; d <= 30; d++) {
    const date = new Date(start);
    date.setDate(start.getDate() + (d - 1));
    rows.push({
      day: d,
      date: date.toISOString().slice(0, 10),
      topic: titles[(d - 1) % titles.length] || `${t} insight #${d}`,
      keyword: `${t.toLowerCase()} ${["tips", "guide", "examples", "case study", "trends"][d % 5]}`,
      intent: intents[d % intents.length],
      priority: priorities[d % priorities.length],
    });
  }
  return rows;
}

export const DEFAULT_INPUT: BlogInput = {
  businessName: "BrightPath Digital",
  industry: "Digital Marketing",
  product: "SEO & Content Strategy Services",
  audience: "Growth-stage B2B SaaS founders",
  location: "Mumbai",
  topic: "AI-Powered SEO",
};
