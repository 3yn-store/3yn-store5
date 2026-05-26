# متجر عين — YouTube Premium Storefront

## Project Overview
Arabic storefront ("متجر عين") for selling YouTube Premium subscriptions via WhatsApp-based manual fulfillment. Built with React + Vite + TypeScript in a pnpm monorepo.

## Stack
- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Routing**: wouter (hash-free client-side routing with SPA fallback)
- **Forms**: react-hook-form + zod validation
- **Animations**: framer-motion
- **Icons**: lucide-react + react-icons

## User Preferences
- Store name: "عين" (used in footer, headings)
- WhatsApp number: 966500708427
- Price: 4 SAR (was 29 SAR)
- Product name: "اشتراك يوتيوب بريميوم | على ايميلك"
- Language: Arabic (RTL), font: Tajawal
- All reviews are pre-seeded (22 × 5-star), users can add more without login
- Logo: `/logo.png` (orange eye logo) — used in navbar, footer, splash
- YouTube logo in product cards: custom `YtLogo` SVG (red rectangle + white triangle)

## Pages & Routes
- `/` — Home (hero, products, features, reviews, order form)
- `/product` — Product detail page (with rating tracker + reviews)
- `/support` — Support page (WhatsApp contact)
- `/about` — About page
- `/policy/returns` — Returns policy
- `/policy/terms` — Terms of service
- `/policy/privacy` — Privacy policy

## Running the App
```bash
pnpm install
pnpm --filter @workspace/youtube-subs run dev
```

## Building for Production
```bash
pnpm --filter @workspace/youtube-subs run build
# Output: artifacts/youtube-subs/dist/public/
```

## Deployment Notes
- SPA routing: `public/_redirects` (Netlify) and `public/404.html` (GitHub Pages) included
- No backend required — order flow opens WhatsApp with prefilled message
- No API keys or secrets required
