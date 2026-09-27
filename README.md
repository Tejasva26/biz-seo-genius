# 🧠 Biz SEO Genius

An AI-powered SEO analysis and optimization tool built for businesses. Get actionable insights, keyword suggestions, and SEO scoring to help your business rank higher in search results.

🔗 **Live Demo:** [biz-seo-genius.vercel.app](https://biz-seo-genius.vercel.app)

---

## ✨ Features

- 📊 **SEO Score Dashboard** — Visual breakdown of your site's SEO health
- 🔍 **Keyword Analysis** — Discover and evaluate high-impact keywords for your business
- 📈 **Performance Charts** — Track SEO metrics over time with interactive charts
- 💡 **Actionable Recommendations** — Clear, prioritized steps to improve rankings
- ⚡ **Fast & Responsive** — Smooth animations and mobile-friendly UI

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [TanStack Start](https://tanstack.com/start) | Full-stack SSR framework |
| [TanStack Router](https://tanstack.com/router) | Type-safe client-side routing |
| [React 19](https://react.dev) | UI library |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling |
| [Radix UI](https://www.radix-ui.com) | Accessible UI components |
| [Recharts](https://recharts.org) | Data visualization |
| [Framer Motion](https://www.framer.com/motion) | Animations |
| [React Hook Form](https://react-hook-form.com) | Form handling |
| [Zod](https://zod.dev) | Schema validation |
| [Vite](https://vitejs.dev) | Build tool |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/Tejasva26/biz-seo-genius.git
cd biz-seo-genius

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be running at `http://localhost:3000`.

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

---

## 📦 Deployment

This project uses **TanStack Start with Nitro** and supports multiple deployment targets via the `DEPLOY_TARGET` environment variable.

### Vercel

1. Import the repo into [Vercel](https://vercel.com)
2. Set the following in your project settings:
   - **Framework Preset:** Other
   - **Build Command:** `npm run build`
   - **Output Directory:** `.output/public`
3. Add environment variable: `DEPLOY_TARGET=vercel`
4. Deploy

### Netlify

1. Import the repo into [Netlify](https://netlify.com)
2. Set **Build Command** to `npm run build` and **Publish Directory** to `.output/public`
3. Add environment variable: `DEPLOY_TARGET=netlify`
4. Deploy

### Cloudflare Workers (default)

No extra config needed — the default build targets Cloudflare Workers.

---

## 📁 Project Structure

```
biz-seo-genius/
├── src/
│   ├── routes/        # TanStack Router file-based routes
│   ├── components/    # Reusable UI components
│   └── styles.css     # Global styles
├── vite.config.ts     # Vite + Nitro config
├── package.json
└── tsconfig.json
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

---



Built with ❤️ using [Lovable](https://lovable.dev)
