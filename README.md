# Prime Time — Grade 6 adaptive chapter (web app)

Single-chapter adaptive learning system: **structured lessons**, **checkpoint quizzes**, **unit assessment**, **mastery tracking per concept**, and **rule-based recommendations** (prerequisite checks, weakest skill, stretch). Content is authored for clarity and alignment with multiplicative structure of whole numbers (not raw LLM output).

## Run locally

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open the URL shown (usually `http://localhost:5173`).

```bash
npm run build
npm run preview
```

## Host (free options)

Build output is static files in `dist/`.

- **Netlify:** connect the repo or drag-drop `dist`. This repo includes `netlify.toml` and `public/_redirects` so client-side routes (`/lesson/...`, `/progress`, `/assessment`) work after refresh.
- **Vercel:** import project; `vercel.json` includes SPA rewrites.
- **Cloudflare Pages:** build command `npm run build`, output directory `dist`; add a SPA fallback rule to `index.html` if deep links 404.

Submit the public URL to your instructor by the deadline.

## Pedagogy & adaptation (for viva)

- **Content:** six lessons + unit check covering factors, factor pairs, primes/composites, prime factorization, GCF/LCM, applications.
- **Learner model:** per-concept mastery 0–100%, updated with a blended score after each quiz; attempts logged.
- **Adaptation:** inspectable rules in `src/lib/learnerModel.ts` (prerequisite thresholds, weakest concept, stretch).

## Reset progress

Use **Reset saved progress** on the home page, or clear site data for the origin in your browser.
