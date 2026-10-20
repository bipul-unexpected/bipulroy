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

Create a Storage bucket for portfolio media and set its file read permission
to `Any` if images are public. Keep file creation restricted to authenticated
users. Set the web platform hostname to the Appwrite Sites domain and the
production domain.

Set collection permissions so documents are readable by `Any`, while create,
update, and delete are restricted to authenticated users. The UI only exposes
the publishing studio to a Clerk user whose public metadata contains:

```json
{ "role": "admin" }
```

Appwrite permissions are the authoritative security boundary; configure them
in the console rather than relying only on the client-side admin check. Grant
the authenticated role create/read/update/delete permissions on all four
collections and create/delete permissions on the media bucket. Public visitors
only need read access to published documents and file view access. The studio
supports create, draft listing, edit, delete, and tracked image cleanup.

## Clerk setup

Create a Clerk application, add the production and local domains, and set the
publishable key in `VITE_CLERK_PUBLISHABLE_KEY`. Add `{ "role": "admin" }` to
the owner account's public metadata. No secret Clerk key belongs in this
frontend repository.

## Contact form

The contact form submits directly to Web3Forms using the supplied public access
key (`39f9a6b3-763c-4ef6-bf81-06128530394d`). Configure the destination email,
allowed domains, and spam controls in the Web3Forms dashboard before launch.

## Production checks

```bash
npm run lint:types
npm run build
```

Deploy the generated `dist/angular` directory through Appwrite Sites. Keep
`public/robots.txt`, `public/sitemap.xml`, and the canonical domain aligned with
the final Appwrite Sites custom domain.

Appwrite Sites is a static frontend host, so keep only public SDK identifiers in
`VITE_*` variables. Never add an Appwrite API key or Clerk secret key to the
Vite environment. Configure the Site build command as `npm run build`, output
directory as `dist/angular`, and add the production hostname as an Appwrite Web
platform. Use the same hostname in Web3Forms allowed domains and Clerk
production domains.

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
