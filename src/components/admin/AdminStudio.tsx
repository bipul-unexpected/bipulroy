import { useState } from "react";
import type { FormEvent } from "react";
import { useUser, SignInButton, UserButton } from "@clerk/react";
import { CheckCircle2, LogIn, Plus, Upload } from "lucide-react";
import { createContent, isAdminUser, uploadContentImage, type ContentKind } from "../../lib/content";

const contentKinds: { value: ContentKind; label: string }[] = [
  { value: "projects", label: "Project" },
  { value: "articles", label: "Article" },
  { value: "gallery", label: "Gallery image" },
  { value: "tools", label: "Tool" },
];

export function AdminStudio() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [kind, setKind] = useState<ContentKind>("projects");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  if (!isLoaded) return null;
  if (!isSignedIn) {
    return (
      <section id="admin" className="relative py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6"><div className="glass-panel rounded-2xl p-5 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div><p className="text-xs font-mono uppercase tracking-[0.18em] text-primary">Private studio</p><h2 className="mt-2 text-xl font-bold text-foreground">Manage the portfolio securely.</h2><p className="mt-1 text-sm text-muted-foreground">Sign in with Clerk to access the publishing workspace.</p></div>
          <SignInButton mode="modal"><button type="button" className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"><LogIn className="h-4 w-4" /> Admin sign in</button></SignInButton>
        </div></div>
      </section>
    );
  }
  if (!isAdminUser(user)) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      const imageUrl = image ? await uploadContentImage(image) : undefined;
      await createContent(kind, {
        title,
        description,
        excerpt: description,
        url: url || undefined,
        imageUrl,
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        published: true,
        featured: true,
      });
      setTitle(""); setDescription(""); setUrl(""); setTags(""); setImage(null);
      setStatus("Published successfully. Refresh the public sections to see it.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Publishing failed. Check Appwrite permissions and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="admin" className="relative py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6"><div className="glass-panel rounded-2xl p-5 sm:p-7 md:p-9">
        <div className="mb-7 flex flex-col sm:flex-row justify-between gap-4"><div><p className="text-xs font-mono uppercase tracking-[0.18em] text-primary">Private studio</p><h2 className="mt-2 text-2xl font-bold text-foreground">Publish new work</h2><p className="mt-1 text-sm text-muted-foreground">Appwrite Database stores metadata; Storage stores media.</p></div><UserButton /></div>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-muted-foreground">Content type<select value={kind} onChange={(event) => setKind(event.target.value as ContentKind)} className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-foreground">{contentKinds.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
          <label className="text-sm text-muted-foreground">Title<input required value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-foreground" /></label>
          <label className="text-sm text-muted-foreground md:col-span-2">Description<textarea required value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-foreground" /></label>
          <label className="text-sm text-muted-foreground">URL<input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://" className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-foreground" /></label>
          <label className="text-sm text-muted-foreground">Tags, comma separated<input value={tags} onChange={(event) => setTags(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-foreground" /></label>
          <label className="md:col-span-2 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground"><Upload className="h-4 w-4 text-primary" /><span>{image?.name || "Upload image (optional)"}</span><input type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] || null)} className="sr-only" /></label>
          <div className="md:col-span-2 flex items-center gap-4"><button disabled={busy} className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-60"><Plus className="h-4 w-4" />{busy ? "Publishing..." : "Publish content"}</button>{status && <p className="inline-flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-primary" />{status}</p>}</div>
        </form>
      </div></div>
    </section>
  );
}
