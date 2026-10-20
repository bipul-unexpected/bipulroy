# Admin content Appwrite Function

This function is the only write path for the private portfolio studio. It
verifies the Clerk session JWT, optionally pins access to one Clerk user ID,
and uses a server-only Appwrite API key for database and Storage operations.

## Appwrite Function setup

Create a Function in Appwrite:

- Runtime: Node.js 22
- Entrypoint: `src/main.js`
- Install command: `npm install`
- Execute access: Any (the function itself validates the Clerk token)
- Deploy the contents of this directory, including `package.json`,
  `package-lock.json`, and `src/main.js`. The deployment root must contain
  `package.json` directly; do not upload `functions/`, `functions/admin-content`
  as a nested folder, or an archive whose first entry is
  `admin-content/package.json`.

Use the Appwrite region-specific endpoint for the project. For the current
portfolio project, the region is `sgp`, so configure the CLI with
`https://sgp.cloud.appwrite.io/v1`; the global endpoint can return
“Project is not accessible in this region.”

Give the Function API key only these scopes:

- Databases: read, documents create/read/update/delete
- Storage: files create/read/delete

Add these Function environment variables. Keep them secret and never prefix
them with `VITE_`:

```env
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=server_only_api_key
APPWRITE_DATABASE_ID=your_database_id
APPWRITE_STORAGE_BUCKET_ID=your_bucket_id
APPWRITE_PROJECTS_COLLECTION_ID=projects
APPWRITE_ARTICLES_COLLECTION_ID=articles
APPWRITE_GALLERY_COLLECTION_ID=gallery
APPWRITE_TOOLS_COLLECTION_ID=tools
APPWRITE_EXPERIENCE_COLLECTION_ID=experience
APPWRITE_SERVICES_COLLECTION_ID=services
APPWRITE_TESTIMONIALS_COLLECTION_ID=testimonials
CLERK_JWKS_URL=https://your-clerk-domain/.well-known/jwks.json
CLERK_JWT_ISSUER=https://your-clerk-domain
CLERK_ADMIN_USER_ID=user_your_owner_id
ALLOWED_ORIGIN=https://your-portfolio-domain.com
```

Copy the Function's public domain into the frontend Site variable:

```env
VITE_APPWRITE_ADMIN_FUNCTION_URL=https://your-function-domain
```

After changing Function variables or source, create and deploy a new Function
version. Then redeploy the Appwrite Site so the frontend receives the updated
public endpoint or environment values.

## Console publish steps

1. Open **Appwrite Console → Functions → Create function**.
2. Select **Node.js 22**, set the entrypoint to `src/main.js`, and set execute
   access to **Any**.
3. Upload this directory's **contents** or connect its repository source.
   Ensure the Function root contains `package.json` and `src/main.js` at its
   top level. If uploading a ZIP, open it before uploading and verify that it
   contains `package.json`, `package-lock.json`, and `src/main.js` rather than
   an outer `admin-content/` directory.
4. Add the variables above in **Settings → Environment variables**.
5. Create a least-privilege API key under **Overview → API keys**, paste it as
   `APPWRITE_API_KEY`, and deploy a new version.
6. Copy the deployed Function endpoint into the Site variable
   `VITE_APPWRITE_ADMIN_FUNCTION_URL`.
7. Redeploy the Site and test create, update, image upload, and delete from
   `/onionbipulking`.

Do not expose `APPWRITE_API_KEY`, Clerk secret keys, or any other server
variable through a `VITE_` prefix. `ALLOWED_ORIGIN` must exactly match the
production origin, including protocol and without a trailing slash.

## Troubleshooting `ENOENT: /usr/local/build/package.json`

This error means Appwrite started the build in a source directory that does
not contain the Function package manifest. It is a deployment-source problem,
not a missing dependency. Delete the failed deployment, re-upload the
contents of this directory with the correct root, and keep these settings:

```text
Runtime: Node.js 22
Entrypoint: src/main.js
Install command: npm install
Build command: npm install
```

The repository's canonical source files are:

```text
functions/admin-content/package.json
functions/admin-content/package-lock.json
functions/admin-content/src/main.js
```

Do not use `functions/package-lock.tar.gz`, a cache archive, or the portfolio
root as the Function source. After upload, Appwrite's build log should show
`npm install` reading `/usr/local/build/package.json`.

Remove create, update, and delete permissions from every content collection
and remove Storage create/delete permissions for public users. Keep public read
permission only where content/images are intended to be public. The Function's
server API key bypasses document permissions, while its Clerk verification
prevents other visitors from using the write endpoint.
