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
- Deploy the contents of this directory

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
```

Copy the Function's public domain into the frontend Site variable:

```env
VITE_APPWRITE_ADMIN_FUNCTION_URL=https://your-function-domain
```

Remove create, update, and delete permissions from every content collection
and remove Storage create/delete permissions for public users. Keep public read
permission only where content/images are intended to be public. The Function's
server API key bypasses document permissions, while its Clerk verification
prevents other visitors from using the write endpoint.
