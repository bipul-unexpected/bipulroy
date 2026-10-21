# Bipul Roy portfolio

Production Vite + React portfolio with a premium motion UI, Web3Forms contact
submission, Clerk authentication, and Appwrite-backed content publishing.

## Local development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in the Clerk and Appwrite values.
The app still renders its curated static portfolio when Appwrite is not
configured, so a fresh preview is useful before the provider setup is complete.

## Appwrite setup

Create one database and these collections in the Appwrite console:

| Collection | Required attributes |
| --- | --- |
| `projects` | `title` string, `description` string, `imageUrl` string, `imageFileId` string, `url` string, `category` string, `tags` string array, `published` boolean, `featured` boolean |
| `articles` | `title` string, `excerpt` string, `body` string, `description` string, `imageUrl` string, `imageFileId` string, `url` string, `category` string, `tags` string array, `published` boolean, `featured` boolean |
| `gallery` | `title` string, `description` string, `imageUrl` string, `imageFileId` string, `published` boolean, `featured` boolean |
| `tools` | `title` string, `name` string, `description` string, `website` string, `icon` string, `category` string, `tags` string array, `published` boolean, `featured` boolean |
| `experience` | `title` string, `description` string, `body` string, `category` string, `tags` string array, `published` boolean, `featured` boolean |
| `services` | `title` string, `description` string, `category` string, `tags` string array, `published` boolean, `featured` boolean |
| `testimonials` | `title` string, `description` string, `body` string, `category` string, `published` boolean, `featured` boolean |

See the table in
`functions/admin-content/README.md` for the attributes each collection needs.
Give every collection **public read permission** so the public site can render
it, and keep write/delete restricted to the Function's server API key.

Create a Storage bucket for portfolio media and set its file read permission
to `Any` if images are public. Keep file creation restricted to authenticated
users. Set the web platform hostname to the Appwrite Sites domain and the
production domain.

Set collection permissions so documents are readable by `Any`, and leave
create, update, and delete ungranted to client users. The private Appwrite
Function performs writes with its restricted server API key after verifying the
owner's Clerk token. The UI only exposes the publishing studio to a Clerk user
whose public metadata contains:

```json
{ "role": "admin" }
```

Appwrite permissions are the authoritative security boundary; configure them
in the console rather than relying only on the client-side admin check. Grant
the Function API key only the database document and Storage file scopes it
needs. Public visitors only need read access to published documents and file
view access. The studio supports create, draft listing, edit, delete, and
tracked image cleanup.

## Clerk setup

Create a Clerk application, add the production and local domains, and set the
publishable key in `VITE_CLERK_PUBLISHABLE_KEY`. Disable **Sign-up** in
Clerk's User & Authentication settings and restrict access to the owner
account. Add `{ "role": "admin" }` to the owner account's public metadata. No
secret Clerk key belongs in this frontend repository.

The public portfolio does not render or link to the admin studio. The private
studio is available only at `/onionbipulking`. It renders Clerk sign-in with
signup disabled and, after authentication, exposes CRUD tabs for projects,
articles, gallery, tools, experience, services, and testimonials. Configure
Appwrite collection and Storage permissions before using writes; Appwrite
remains the authorization boundary for database and file operations.

## Public pages

The portfolio has direct, fast-loading paths for the main content surfaces:

- `/projects`
- `/gallery`
- `/services`
- `/journal`
- `/experience`
- `/contact`
- `/tech-stack`

The build creates an independent `index.html` entry inside each route
directory from the single maintained `page-template.html` file and its route
metadata map in `scripts/generate-pages.mjs`. Generated route documents are
not source files and are recreated on every `dev` and `build` command. This is
an enhanced MPA, not a single-page deployment: every
public URL has its own document, title, description, canonical URL, and Open
Graph metadata. Configure Appwrite Sites with `dist` as the output directory
so direct visits and refreshes resolve to the route's own HTML entry.

Same-origin links use a progressive History API enhancement when JavaScript is
available, so navigation changes the URL and rendered page without a document
reload. If JavaScript is disabled, unavailable, or the browser does not
support the API, the same semantic links fall back to normal browser
navigation. This keeps SEO, deep links, accessibility, and static hosting
reliable without making the application depend on SPA routing.

## Contact form

The contact form submits directly to Web3Forms using the supplied public access
key (`39f9a6b3-763c-4ef6-bf81-06128530394d`). Configure the destination email,
allowed domains, and spam controls in the Web3Forms dashboard before launch.

## Production checks

```bash
npm run lint:types
npm run build
```

### Tailwind opacity gotcha

Tailwind 3's default `opacity` scale skips `1`, `15`, `35`, `45`, `55`, `65`
and `85`. A colour modifier on one of those values (`bg-white/45`,
`bg-background/85`, `focus:bg-destructive/20`) is therefore **silently not
emitted**, and the element renders without its background, border or ring.

Use the arbitrary syntax for those values — `bg-white/[0.45]`,
`bg-background/[0.85]` — which always produces CSS. The same applies to
`rounded-*`: the `borderRadius` scale is driven by the `--radius-*` custom
properties, so those must be declared (see
[Admin dashboard UI](#admin-dashboard-ui)).

Deploy the generated `dist` directory through Appwrite Sites. Keep
`public/robots.txt`, `public/sitemap.xml`, and the canonical domain aligned with
the final Appwrite Sites custom domain.

Appwrite Sites is a static frontend host, so keep only public SDK identifiers in
`VITE_*` variables. Never add an Appwrite API key or Clerk secret key to the
Vite environment. Configure the Site with these exact settings:

- Rendering strategy: **Static**
- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: `dist`
- SPA fallback file: `index.html`

The fallback file is configured in **Sites → Settings → Build settings**. The
`public/_redirects` file is not used by Appwrite Sites for SPA fallback. After
changing any build setting, save the site and create a new deployment. Add the
production hostname as an Appwrite Web platform, then use that same hostname in
Web3Forms allowed domains and Clerk production domains.

Set the `VITE_*` values from `.env.example` in **Sites → Settings →
Environment variables** before deploying. The tagged `.env` path is not part of
this repository; do not create or commit a secret `.env` file.
Set `VITE_CLERK_ADMIN_USER_ID` to the same public Clerk user ID used by the
Function's `CLERK_ADMIN_USER_ID`. This is an identifier, not a secret; it keeps
the owner-facing dashboard gate aligned with the server authorization check.

### Admin write security

Browser Clerk authentication does not create an Appwrite session. Therefore the
admin studio sends create, update, delete, and image operations to the
`functions/admin-content` Appwrite Function. Deploy that Function first and
set its public domain as `VITE_APPWRITE_ADMIN_FUNCTION_URL`. Keep the Function
API key, Clerk JWKS configuration, and `CLERK_ADMIN_USER_ID` in Function
environment variables only, and set `ALLOWED_ORIGIN` to the exact portfolio
origin. The setup and exact scopes are documented in
`functions/admin-content/README.md`.

### Admin dashboard UI

The private `/onionbipulking` workspace uses the official shadcn
`dashboard-01` primitives generated from `components.json`. The generated
sidebar is responsive (including the mobile off-canvas mode), while the
collection navigation, search, CRUD controls, publication metrics, Clerk
account controls, and persisted dark mode are connected to the live Appwrite
content workflow. To regenerate or add shadcn components, run
`npx shadcn@latest add <component>` from the repository root; do not edit
generated UI primitives to add application-specific data access.

#### Theme and layout rules

- The studio owns its theme and **defaults to dark**. The choice is stored
  under `bipul-admin-theme` in `localStorage`, so the public site keeps its own
  `bipul-theme` preference and the two never overwrite each other.
- In dark mode the admin highlight colour is **white** (`--primary` is
  overridden on `#admin`), and near-black in light mode. Active navigation
  items, primary buttons, and the total-content card all use it, which keeps
  active states readable in both themes.
- The `--sidebar-*` tokens are declared for **both** light and dark. Omitting
  the dark values leaves the admin rail on the light near-white surface with
  unreadable text.
- The radius scale (`--radius-sm` … `--radius-3xl`) is declared once in
  `src/index.css` after the theme imports. The bundled UI theme packages each
  ship their own scale and all target `:root`, so without the override the
  winner depends on import order and `rounded-xl` ends up larger than
  `rounded-2xl`.

#### Writing content

The dashboard overview shows the live record count for every collection
(projects, articles, gallery, tools, experience, services, testimonials) plus
the published count and the combined total.

The editor labels follow the collection, so what an editor types is exactly
what the website renders: for a project the fields are *Name*, *Category*,
*Summary*, *Impact / Outcome* and *Stack*; for a testimonial they are *Name*,
*Role*, *Company* and *Quote*.

#### Articles and attachments

An article is published to `/journal/<id>`. The article title and cover image
link straight to it and open in a new tab, so the reading experience never
interrupts the journal.

The article body is written in Markdown and rendered by
`src/components/ui/Markdown.tsx`. That renderer emits React elements rather
than an HTML string, so published content can never inject markup.

Every record can also carry **supporting files** — a `.md` spec, a PDF, a
zip, any file up to 10 MB. The studio uploads them to Storage and stores the
file ids on the record (the `attachments` attribute, a string array that the
admin Function reads from the live collection schema). The article page lists
them with a download button, and the public file URL is built from the file
id, so a file is reachable without any extra permission work.

Published articles are **prerendered at build time**. `scripts/generate-pages.mjs`
reads the published articles and writes a static `journal/<id>/index.html`
containing the full article text, so crawlers see the content without running
JavaScript. The same script refreshes `public/sitemap.xml` with the article
URLs. It reads the Appwrite environment variables from `.env` when it exists
and from the build environment otherwise, and it skips the article step
entirely when Appwrite is not configured.

The public site reads the published records of each collection. There is **no
hard-coded work on the website any more**: the demo projects, articles, case
studies, experience entries and testimonials that used to live in
`src/data/portfolio.ts` have been removed, and the site now shows only what is
published from the studio. When a collection is empty its section renders a
short, honest empty state instead of placeholder work.

Two collections are the exception, because they describe the practice rather
than the work: the **service menu** and the **tech stack**. The studio adds to
those rather than replacing them, so the keyword surface of the site stays
intact.

Two collection settings are required for this to work:

1. **Public read permission** on every collection (and on the Storage bucket).
   Without it the browser gets `401` and the dashboard shows zero records even
   though writes succeed. See `functions/admin-content/README.md`.
2. **A redeployed Function.** The `list` operation is what lets the studio read
   drafts; until the Function is redeployed the studio falls back to a direct
   read.

The admin Function reads the live attribute keys of the target collection
before every write and drops anything the collection does not declare. If the
schema cannot be read it stays permissive, and if Appwrite still rejects a
field it strips that field and retries, so a collection that is missing
`title` (or any other attribute) saves instead of failing with
`Invalid document structure: Unknown attribute: …`.

#### Appwrite Function publish checklist

1. In **Appwrite Console → Functions**, create a Function named
   `admin-content`, choose **Node.js 22**, and set the entrypoint to
   `src/main.js`.
2. Deploy the complete `functions/admin-content` directory. Its
   `package.json` and lockfile must be included so Appwrite installs
   `node-appwrite` and `jose`. The uploaded source root must contain
   `package.json` directly; do not upload an outer `admin-content/` directory
   inside a ZIP.
3. Create a server API key in **Overview → API keys**. Grant only Databases
   document read/create/update/delete and Storage file read/create/delete
   scopes. Never put this key in `.env`, `VITE_*`, or frontend code.
4. Add every variable from
   `functions/admin-content/README.md` under **Functions → Settings →
   Environment variables**. Use the exact database, collection, bucket, Clerk
   issuer/JWKS, owner user ID, and production origin values.
5. Set Function **Execute access** to `Any`. The Function is intentionally
   public at the transport layer because it validates the Clerk bearer token
   and owner ID before every operation.
6. Deploy a new Function version, copy its public endpoint, and set
   `VITE_APPWRITE_ADMIN_FUNCTION_URL` to that endpoint in **Sites → Settings →
   Environment variables**.
7. In Clerk, disable public sign-up and copy the owner user ID into
   `CLERK_ADMIN_USER_ID`. In Appwrite, remove public create/update/delete
   permissions from content collections and public Storage create/delete
   permissions.
8. Redeploy the Site with `npm ci`, `npm run build`, and output directory
   `dist`. Test `/onionbipulking`, sign in as the owner, create one draft,
   publish it, edit it, and delete it. Confirm a second Clerk account receives
   `403` and that unauthenticated requests cannot write.

If an Appwrite deployment reports
`ENOENT: /usr/local/build/package.json`, the Function source root is wrong.
Re-upload the contents of `functions/admin-content` and confirm the archive
root contains `package.json`, `package-lock.json`, and `src/main.js`.

The current Appwrite project is hosted in the `sgp` region. For CLI
deployments, configure the regional endpoint before creating a deployment:

```powershell
appwrite client --endpoint="https://sgp.cloud.appwrite.io/v1" `
  --project-id="69a262f10033525a04ab"
Set-Location functions\admin-content
appwrite functions create-deployment `
  --function-id=admincontent `
  --code=. `
  --entrypoint=src/main.js `
  --commands="npm install" `
  --activate
```

For admin CRUD, open **Appwrite Console -> Functions -> admin-content ->
Domains** and copy the generated HTTPS `.appwrite.run` domain. Set that exact
value as `VITE_APPWRITE_ADMIN_FUNCTION_URL` in **Sites -> Settings ->
Environment variables**. Do not use `https://sgp.cloud.appwrite.io/v1`, the
Function deployment ID, or the Appwrite project URL as this value. Save the
Site variables and create a new Site deployment; Vite embeds `VITE_*` values
at build time.

If Appwrite execution logs show successful `OPTIONS` requests with `204` but
the browser reports “Failed to fetch”, inspect the preflight response headers.
It must include `Access-Control-Allow-Origin: https://bipul.tech`,
`Access-Control-Allow-Methods: POST, OPTIONS`, and
`Access-Control-Allow-Headers: Content-Type, Authorization`. A successful
OPTIONS log alone does not mean that the browser sent the authenticated POST.

## Terminal mode

The terminal icon in the navigation opens a full-screen interactive browser
shell. It is intentionally sandboxed and never executes operating-system
commands. Supported commands include `whoami`, `ls`, `pwd`, `date`, `echo`,
`cat README`, `neofetch`, `open <path>`, `theme`, `clear`, `help`, and `exit`.
Use `Esc` or `exit` to return to the normal portfolio.

## Scrolling and motion

Desktop wheel scrolling uses Lenis for one coordinated smooth-scroll loop.
Native touch scrolling remains enabled on phones and tablets. The WebGL splash
cursor is desktop-only, disables itself for reduced-motion/coarse-pointer
devices, and cleans up its animation frame and global listeners on unmount so
it cannot duplicate render loops under React Strict Mode.

## Icon sources

The hero uses the bundled Next.js asset from [3Dicons](https://3dicons.co/)
under its CC0 1.0 license. Technology pills use the existing `react-icons`
package for brand marks. Flaticon packs are not hotlinked because pack-specific
download and attribution terms vary; add a specific licensed pack only after
selecting its license and attribution requirements.
