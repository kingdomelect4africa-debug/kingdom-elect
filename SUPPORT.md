# Kingdom E.L.E.C.T. for Africa — Documentation & Support Guide

A complete how-to guide for operating the Kingdom E.L.E.C.T. for Africa platform, followed by a technical reference for whoever maintains the code.

**Security note:** this file documents *where* credentials and secrets live, never their actual values. Nothing here should ever contain a live password, API key, or connection string — those belong in `.env.local` (gitignored) or the Vercel dashboard, never in a committed file.

---

# Part 1 — How-To Guide (for admins/staff)

## 1.1 Logging in

1. Go to `https://admin.kingdomelect4africa.online/admin/login`. The admin CMS lives on its own subdomain, separate from the public site — visiting `/admin` on the public domain (`kingdomelect4africa.online`) automatically redirects you here.
2. Enter your email and password.
3. You'll land on the **Dashboard**.

If you forget your password: another Super Administrator can reset it for you at **Users → [your name] → edit** (leave the password field blank to keep it, or type a new one to change it). If there's no other Super Administrator available, this requires a developer to run a one-off reset script.

Every admin page enforces access **on the server**, not just by hiding menu items — if your role doesn't permit something, the action is rejected even if you construct the request directly.

**Getting help**: for account/access issues or anything you're stuck on, email **support@kingdomelect4africa.online**. General public-facing enquiries go to **info@kingdomelect4africa.online**; the organizing team's own inbox (registration/event notifications, partnership follow-ups) is **contact@kingdomelect4africa.online**.

## 1.2 The Dashboard

Shows, at a glance: new registrations (7 days), new applications (7 days), new people (7 days), unread messages, upcoming events, draft articles, and pending applications — each links straight to the relevant list. Below that, **Quick Actions** jump straight into creating an article, event, program, registration form, partner, or chapter.

## 1.3 Editing the flagship pages (Homepage, About, The Situation Room, The Five)

These four pages are **structured editors** — every visible piece of text, stat, and step is a named field you edit directly (not a drag-and-drop page builder). Go to **Pages → Homepage** (or About / The Situation Room / The Five).

- **Homepage**: hero heading/subheading/buttons, "Africa's Defining Moment" heading + body + three stat points, the five Kingdom Framework steps (People → Institutions → Territories → Nations → Generations), The Five intro, Situation Room teaser copy, Kingdom Intelligence intro, closing call-to-action.
- **About**: hero, "Why E.L.E.C.T." story, Vision/Mission/Purpose/Essence statements, the six Objectives, the eight personality traits.
- **The Situation Room**: hero + philosophy quote, the four "functions" (Diagnostic Altar, Strategic Council, etc.), the eight session-type list items, the seven outcome list items, and — importantly — a dropdown to pick **which real Event** the page's "Register" button points to.
- **The Five**: intro copy, plus per-pillar tagline/body/"sphere of influence" tags for each of Educators, Leaders, Entrepreneurs, Creatives, Technocrats. (The "Related Programs / Kingdom Intelligence / Stories" links shown on this page are **not** edited here — they're pulled in automatically from whichever Programs/Articles/Stories you've tagged with that pillar. Tag content correctly and it appears here on its own.)

Click **Save** at the bottom of each form — changes go live on the public site immediately.

## 1.4 Site Settings

**Settings** — site name, tagline, contact email + support email/phone/address (shown in the footer and on the Contact page), footer text, default SEO title/description.

## 1.5 Running an event with real registration

This is the full flow, start to finish:

1. **Build the registration form first** (skip if reusing an existing one): **Form Builder → Create Form**. Give it a name, then add fields one at a time — pick a type (text, email, phone, date, country, dropdown, radio, checkbox, file, consent), a label, whether it's required, and (for dropdown/radio) the list of options. Reorder fields with the ↑/↓ buttons. Set what happens on submission (a confirmation message, or a redirect). Save.
2. **Create the event**: **Events → Create Event**. Fill in title, type, summary, full description, start/end date & time, timezone, venue (or mark it virtual and give a link), capacity, and — under Registration — pick the form you just built. Set **Registration Status** to Open, and **Publish Status** to Published when you're ready for it to go live.
3. **Add speakers**: on the event's edit page, scroll to **Speakers** and pick an existing Person from the dropdown. If they're not in the system yet, create them first at **People → New Person**, then come back and add them here.
4. The event now has a real public page with a working registration form. Anyone who submits it creates a real **Registration** record and, if they're new, a real **Person** record (matched by email, so the same person registering for two events never gets duplicated).
5. **Managing registrants**: **Registrations** — filter by event, see who's registered and what they answered, and update their status (Registered → Confirmed → Checked In → Attended → No Show).
6. **On the day, checking people in**: **Check-In** is a fast, mobile-friendly screen — pick the event, search by name or email, tap **Check In**. (Check-In Staff accounts only see events they've specifically been assigned to.)

## 1.6 Running a program

**Programs → Create Program** — title, summary, full description, which pillars it belongs to, status (Open for Applications / Ongoing / Closed / Archived), and an optional Program Manager. On the program's edit page you can add **Cohorts** (a named intake with its own dates/capacity) and see **Applications** submitted against it — open one to review the applicant's answers, leave reviewer notes, and change their status through the pipeline (Submitted → Under Review → Shortlisted → Accepted/Rejected → Enrolled/Withdrawn).

## 1.7 Publishing Kingdom Intelligence articles

**Articles → Create Article** — title, subtitle, category, excerpt, full body, which pillars it relates to, and optionally which Program/Event it's related to (this is what makes it show up on The Five page automatically). Assign one or more authors from People.

Status works as an editorial pipeline: **Draft → In Review → Published → Archived**. If you're logged in as an **Author**, you can only edit your own unpublished drafts, and submitting doesn't publish — it moves to "In Review" for a Content Editor or Super Admin to publish. Tick **Feature on Homepage** to have it appear in the homepage's Kingdom Intelligence teaser.

## 1.8 Publishing Stories

**Stories → Create Story** — pick the **Person** the story is about (add them under People first if needed), title, summary, full body, and optionally link it to a related Program/Event/Chapter. Same Draft/Published status pattern as Articles.

## 1.9 Managing People, Chapters, and Partners

- **People** is the single source of truth for every human in the system — staff, speakers, chapter leads, registrants, everyone. Opening a person's record shows every relationship they hold (affiliations, event registrations, program applications, speaking appearances) in one place, rather than scattered duplicate records. A **Chapter Administrator** only sees people belonging to their own chapter.
- **Chapters** — only a **Super Administrator** can create or delete a chapter (this is a deliberate structural decision). A Chapter Administrator can edit their own chapter's details once it exists.
- **Partners** (Organizations) — name, type, description, website, whether it's featured on the homepage.
- **Partnerships** links a Partner to a specific Program/Event/Chapter and tracks the relationship's value — the value field is only visible to **Finance Administrators** and Super Admins, everyone else sees the rest of the record without it.

## 1.10 Handling website messages

Every submission from the public **Contact** and **Get Involved** forms lands in **Inquiries**. Filter by status (new messages are flagged), open one to see the full message and the sender's details, and mark it In Progress / Resolved as you work through it — this also records who's handling it.

## 1.11 Media Library

**Media** — upload an image or file, give it descriptive alt text (required — this is what screen readers announce and what shows if the image fails to load) and an optional caption. Delete removes it from the library.

Files are stored durably in Cloudflare R2 (not on the server's local disk), so uploads persist across deployments.

## 1.12 Managing staff accounts and roles

**Users** (Super Administrator only) — create a new staff account with a name, email, temporary password, and role. Roles:

| Role | Can do |
|---|---|
| **Super Administrator** | Everything, everywhere |
| **Content Editor** | Articles, Stories, Media, and publishing (including other people's drafts) |
| **Events Manager** | Events, Sessions, Speakers, Check-In, Form Builder |
| **Program Manager** | Programs, Cohorts, Applications, Form Builder |
| **Communications Manager** | Inquiries, Media |
| **Chapter Administrator** | Their own Chapter, People, and Events — scoped to that chapter only, enforced on the server |
| **Finance Administrator** | Partnerships, including the confidential value field |
| **Check-In Staff** | The Check-In screen, for events they're specifically assigned to |
| **Author** | Create/edit their own Articles, but can't publish and can't touch anyone else's |

Deactivating a user (rather than deleting) is the intended way to remove access — it preserves their history as the author/creator of past records.

## 1.13 Troubleshooting

- **A public page briefly shows an error, then works on reload**: the database (Neon) occasionally takes a few seconds to wake up after being idle. This isn't a bug — just try again.
- **"…content has not been configured yet"** on a flagship page: nobody has saved that page's editor yet — go fill it in under Pages.
- **A dropdown (e.g. "assign a registration form" on an event) is empty**: you need to create that thing first (e.g. build a Form under Form Builder before it'll show up as an option on an Event).
- **I can't see a menu item I expect**: your role doesn't include that area — see the table in [§1.12](#112-managing-staff-accounts-and-roles). Ask a Super Administrator if you need it.

---

# Part 2 — Technical Reference (for developers)

## 2.1 Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack) | See [§2.7](#27-known-quirksgotchas) for version-pinning notes |
| Language | TypeScript 5.9.3 | Deliberately pinned off TypeScript 7 (too new/unproven at build time) |
| Database | PostgreSQL via **Neon** (serverless) | Via Prisma 6.19.3 (pinned off Prisma 7 — breaking config changes) |
| Styling | Tailwind CSS v4 | CSS-first `@theme` tokens in `src/styles/tokens.css` |
| Animation | Motion (`motion/react`) | The maintained successor to Framer Motion |
| Auth | Custom | scrypt hashing (`src/lib/password.ts`) + DB-backed sessions in an httpOnly cookie (`src/lib/auth.ts`) — no third-party auth library |
| Hosting | Vercel | Project `kingdom-elect`, auto-deploys from GitHub `main`. One deployment serves both domains — `src/proxy.ts` splits traffic by hostname (see [§2.6](#26-deployment)) |
| Media storage | **Cloudflare R2** (S3-compatible) | Bucket `kingdomelect`; client in `src/lib/r2.ts`; served via `src/app/api/media/[...key]/route.ts` (public by default, auth-gated for any `private/`-prefixed key) |
| Source control | GitHub | `kingdomelect4africa-debug/kingdom-elect`, branch `main` |

## 2.2 Repository structure

```
prisma/
  schema.prisma          Full data model — Person is the relationship hub (see PersonAffiliation)
  seed.ts                 Seeds a super-admin + realistic sample content (idempotent — safe to re-run)

src/
  app/
    (marketing)/          Public site route group
    (admin)/admin/         Admin CMS — /admin/login (public) + /admin/(protected)/* (auth-gated)
    layout.tsx / not-found.tsx / sitemap.ts / robots.ts

  components/
    marketing/             Public-site components
    admin/                 Admin CMS components
    devices/               Signature SVG motifs
    ui/                    Shared primitives (Button, Container, Section/Kicker/Rule/LinkArrow)

  lib/
    db.ts                   Prisma client singleton + Neon cold-start retry wrapper
    auth.ts / password.ts   Sessions + password hashing
    rbac.ts                 Role → domain access-control map
    actions/                Server Actions (admin/* one file per entity, plus public forms)

  styles/
    tokens.css / fonts.ts    Design tokens, Fraunces + Inter

scripts/extract-logo.js      One-off tool that extracted the real logo asset from brand-book PNGs
kingdom-elect/                Static HTML/CSS/JS design reference used for the Aug 2026 UI redesign
public/brand/logo-mark.png    The production logo asset; public/*.png are the original brand-book pages
public/brand/earth-africa.jpg  Homepage hero backdrop (NASA "Blue Marble", Apollo 17 — public domain)
```

## 2.3 Running it locally

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URI, see §2.5
npm run dev                  # http://localhost:3000
npm run build                # production build
npm run typecheck             # tsc --noEmit
npm run db:push                # push prisma/schema.prisma to the database
npm run db:seed                # seed super-admin + sample content (idempotent)
```

## 2.4 Data model, in brief

Full detail in `prisma/schema.prisma`. Entities: `User`, `Session`, `Person`, `PersonAffiliation`, `Organization`, `Chapter`, `Program`, `Cohort`, `Event`, `EventSession`, `Speaker`, `Article`, `Story`, `FormDefinition`, `Registration`, `Application`, `Partnership`, `Project`, `Inquiry`, `Media`, `SiteSettings`, plus one structured content model per flagship page. Flagship pages deliberately use fixed structured sections rather than a generic block builder (see [§1.3](#13-editing-the-flagship-pages-homepage-about-the-situation-room-the-five)).

## 2.5 Environment variables

Set in `.env.local` locally (gitignored) and in **Vercel → Project → Settings → Environment Variables** for Production/Preview/Development.

| Variable | Purpose |
|---|---|
| `DATABASE_URI` | Postgres connection string (Neon) |
| `NEXT_PUBLIC_SERVER_URL` | Public base URL, used in `sitemap.ts`/`robots.ts`/metadata |
| `NEON_API_KEY` | Operational token for scripted Neon management (not read by the app) |
| `GITHUB_TOKEN` | Push access from this environment (not read by the app) |
| `VERCEL_TOKEN` | Drives deployments/env-var management via the Vercel CLI/API (not read by the app) |
| `R2_ACCOUNT_ID` | Cloudflare account id — used to build the R2 S3-compatible endpoint |
| `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | R2 API credentials (server-only, never exposed to the client) |
| `R2_BUCKET` | R2 bucket name (`kingdomelect`) |

## 2.6 Deployment

- **Automatic**: push to `main` → Vercel production deploy (GitHub integration).
- **Manual**: `npx vercel deploy --prod --token "$VERCEL_TOKEN"`.
- **Live domains**: `https://kingdomelect4africa.online` (public site, `www.` also attached) and `https://admin.kingdomelect4africa.online` (admin CMS). Both are attached to the same single Vercel project (`kingdom-elect`) — there is no separate admin deployment. `src/proxy.ts` does the hostname-based split: the admin host rewrites every path into the `/admin` namespace; the public host redirects any `/admin*` request to the admin host. This achieves a genuinely separate admin origin (own routing, own cookies) without a second deployment/CORS layer.

## 2.7 Known quirks/gotchas

- **Neon cold starts** surface as `P1001` errors; `src/lib/db.ts` retries automatically. If a *build* fails with `P1001`, just redeploy.
- **`.bind()` + `useActionState` hangs**: combining a server action bound with `.bind(null, arg)` and `useActionState` reproducibly hung the HTTP response in this Next 16/Turbopack setup (DB write completed, response never returned). Fix used throughout: pass extra arguments as hidden form fields instead. See the comment in `src/lib/actions/registration.ts` — don't reintroduce this pattern.
- **Next.js 16 changed several APIs** most tutorials/training data assume (async `cookies()`/`headers()`, `next lint` removed, Server Actions body-size limit). Check `node_modules/next/dist/docs/` before assuming older-Next.js conventions apply.
- **TypeScript/Prisma pinned below latest** — both had brand-new major versions available (TS 7, Prisma 7) with unproven ecosystem support at build time; don't blindly `@latest` these two.

## 2.8 Outstanding work

- **Live email delivery** — `FormDefinition.notificationEmails` and `SiteSettings.contactEmail`/`supportEmail` are real, populated fields, but nothing actually sends mail yet: no provider (Resend/SES/etc.) is wired, and `src/lib/actions/inquiry.ts`/`registration.ts` only write DB rows today. Building the actual send path (and deciding from/reply-to addresses) is still open.
- **Live payment gateway** (`Registration.paymentProvider`/`paymentReference`/`paymentStatus` fields exist, unwired).
- **Deeper art direction** on lighter-fidelity pages (Chapters, Partners, list pages).
- **Automated RBAC test suite** — currently verified manually/via one-off scripts.
- **Person de-duplication** — exact-email-match only; no fuzzy-merge tool.
