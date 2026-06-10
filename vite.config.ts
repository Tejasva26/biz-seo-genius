import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const target = process.env.DEPLOY_TARGET ?? "cloudflare";

const presetMap: Record<string, string> = {
  cloudflare: "cloudflare_module",
  vercel: "vercel",
  netlify: "netlify",
  node: "node-server",
};

const preset = presetMap[target] ?? "cloudflare_module";
const isCloudflare = preset === "cloudflare_module";

export default defineConfig({
  tanstackStart: isCloudflare
    ? { server: { entry: "server" } }
    : {},
  nitro: { preset },
});
