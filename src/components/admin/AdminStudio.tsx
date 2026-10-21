import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useAuth, useUser, SignIn, UserButton } from "@clerk/react";
import { BarChart3, CheckCircle2, Edit3, LayoutDashboard, Moon, Plus, RefreshCw, Search, Sun, Trash2, Upload, X } from "lucide-react";
import {
  createContent,
  deleteContentImage,
  deleteContent,
  isAdminUser,
  listContent,
  updateContent,
  uploadContentImage,
  configureAdminTokenProvider,
  type ContentKind,
  type RemoteContent,
} from "../../lib/content";

const contentKinds: { value: ContentKind; label: string }[] = [
  { value: "projects", label: "Project" },
  { value: "articles", label: "Article" },
  { value: "gallery", label: "Gallery image" },
  { value: "tools", label: "Tool" },
  { value: "experience", label: "Experience" },
  { value: "services", label: "Service" },
  { value: "testimonials", label: "Testimonial" },
];

type FormState = {
  title: string;
  description: string;
  body: string;
  url: string;
  website: string;
  tags: string;
  category: string;
  icon: string;
  published: boolean;
  featured: boolean;
};

const emptyForm: FormState = {
  title: "", description: "", body: "", url: "", website: "", tags: "",
  category: "", icon: "", published: true, featured: false,
};

function toForm(item: RemoteContent): FormState {
  return {
    title: item.title || item.name || "",
    description: item.description || item.excerpt || "",
    body: item.body || "",
    url: item.url || "",
    website: item.website || "",
    tags: item.tags?.join(", ") || "",
    category: item.category || "",
    icon: item.icon || "",
    published: item.published !== false,
    featured: Boolean(item.featured),
  };
}

function toPayload(form: FormState, imageUrl?: string, imageFileId?: string) {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    excerpt: form.description.trim(),
    body: form.body.trim() || undefined,
    url: form.url.trim() || undefined,
    website: form.website.trim() || undefined,
    tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    category: form.category.trim() || undefined,
    icon: form.icon.trim() || undefined,
    imageUrl,
    imageFileId,
    published: form.published,
    featured: form.featured,
  };
}

export function AdminStudio() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [kind, setKind] = useState<ContentKind>("projects");
  const [records, setRecords] = useState<RemoteContent[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [image, setImage] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark"),
  );

  const canManage = isLoaded && isSignedIn && isAdminUser(user);

  useEffect(() => {
    configureAdminTokenProvider(getToken);
    return () => configureAdminTokenProvider(null);
  }, [getToken]);

  async function loadRecords(selectedKind = kind) {
    setLoading(true);
    try {
      setRecords(await listContent(selectedKind, { includeUnpublished: true }));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to load Appwrite content.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (canManage) void loadRecords();
  // The selected kind is intentionally handled by the explicit selector below.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canManage]);

  const modeLabel = useMemo(() => editingId ? "Update content" : "Publish content", [editingId]);

  function toggleAdminTheme() {
    const next = !isDarkMode;
    setIsDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.classList.toggle("light", !next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("bipul-theme", next ? "dark" : "light");
  }

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function startEdit(item: RemoteContent) {
    setEditingId(item.$id);
    setForm(toForm(item));
    setImage(null);
    window.scrollTo({ top: document.getElementById("admin")?.offsetTop || 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setImage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      const uploaded = image ? await uploadContentImage(image) : undefined;
      const payload = toPayload(form, uploaded?.url, uploaded?.fileId);
      const previous = editingId ? records.find((record) => record.$id === editingId) : undefined;
      if (editingId) await updateContent(kind, editingId, payload);
      else await createContent(kind, payload);
      if (previous?.imageFileId && uploaded?.fileId && previous.imageFileId !== uploaded.fileId) {
        try {
          await deleteContentImage(previous.imageFileId);
        } catch (error) {
          console.warn("Content updated, but its previous Appwrite image could not be removed:", error);
        }
      }
      resetForm();
      await loadRecords();
      setStatus(editingId ? "Content updated successfully." : "Content published successfully.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Appwrite operation failed. Check permissions and attributes.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(item: RemoteContent) {
    if (!window.confirm(`Delete “${item.title || item.name}”? This cannot be undone.`)) return;
    setBusy(true);
    setStatus("");
    try {
      await deleteContent(kind, item.$id);
      if (item.imageFileId) {
        try {
          await deleteContentImage(item.imageFileId);
        } catch (error) {
          console.warn("Content deleted, but its Appwrite image could not be removed:", error);
        }
      }
      if (editingId === item.$id) resetForm();
      await loadRecords();
      setStatus("Content deleted successfully.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Delete failed. Check Appwrite permissions.");
    } finally {
      setBusy(false);
    }
  }

  if (!isLoaded) return null;
  if (!isSignedIn) {
    return (
      <section id="admin" className="relative py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6"><div className="glass-panel flex flex-col items-start justify-between gap-5 rounded-2xl p-5 sm:flex-row sm:items-center sm:p-7">
          <div><p className="text-xs font-mono uppercase tracking-[0.18em] text-primary">Private studio</p><h2 className="mt-2 text-xl font-bold text-foreground">Manage the portfolio securely.</h2><p className="mt-1 text-sm text-muted-foreground">Sign in with Clerk to access the publishing workspace.</p></div>
          <SignIn routing="hash" signUpUrl="" />
        </div></div>
      </section>
    );
  }
  if (!canManage) {
    return (
      <section id="admin" className="relative py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="glass-panel rounded-2xl p-5 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-amber-600">Admin access required</p>
                <h2 className="mt-2 text-2xl font-bold text-foreground">Your Clerk account is signed in, but it is not an administrator.</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Configure the owner Clerk user ID in the Site environment or add the exact public metadata below, then sign out and sign in again. This dashboard intentionally stays hidden from non-admin accounts.
                </p>
                <pre className="mt-4 w-fit rounded-xl border border-border bg-background/70 px-4 py-3 font-mono text-sm text-foreground">{`{ "role": "admin" }`}</pre>
                <p className="mt-3 text-xs text-muted-foreground">
                  Clerk Dashboard → Users → your account → Public metadata → Save.
                </p>
              </div>
              <UserButton />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="admin" className="min-h-screen bg-background py-6 text-foreground sm:py-10">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[240px_1fr]">
        <aside className="glass-panel h-fit rounded-2xl p-4 lg:sticky lg:top-6">
          <div className="flex items-center gap-3 border-b border-border/60 px-2 pb-5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground"><LayoutDashboard className="h-5 w-5" /></div>
            <div><p className="font-semibold text-foreground">Studio</p><p className="text-xs text-muted-foreground">Bipul Roy / Admin</p></div>
          </div>
          <nav className="mt-5 space-y-1" aria-label="Admin sections">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Workspace</p>
            <button type="button" className="flex w-full items-center gap-3 rounded-xl bg-primary/10 px-3 py-2.5 text-left text-sm font-semibold text-primary"><BarChart3 className="h-4 w-4" />Content overview</button>
            {contentKinds.map((item) => <button key={item.value} type="button" onClick={() => { setKind(item.value); resetForm(); void loadRecords(item.value); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm ${kind === item.value ? "bg-secondary font-semibold text-foreground" : "text-muted-foreground hover:bg-secondary/70"}`}>{item.label}</button>)}
          </nav>
        </aside>
        <div className="min-w-0">
        <div className="glass-panel rounded-2xl p-5 sm:p-7 md:p-9">
        <div className="mb-7 flex flex-col justify-between gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-center"><div><p className="text-xs font-mono uppercase tracking-[0.18em] text-primary">Private workspace</p><h2 className="mt-2 text-2xl font-bold text-foreground">Portfolio control center</h2><p className="mt-1 text-sm text-muted-foreground">Manage projects, journal, media, services, and social proof.</p></div><div className="flex items-center gap-2"><button type="button" onClick={toggleAdminTheme} className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-muted-foreground" aria-label={isDarkMode ? "Use light mode" : "Use dark mode"}>{isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button><UserButton /></div></div>
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/70 bg-background/40 p-4"><p className="text-xs text-muted-foreground">Current collection</p><p className="mt-1 font-semibold text-foreground">{contentKinds.find((item) => item.value === kind)?.label}</p></div>
          <div className="rounded-xl border border-border/70 bg-background/40 p-4"><p className="text-xs text-muted-foreground">Records loaded</p><p className="mt-1 font-semibold text-foreground">{records.length}</p></div>
          <div className="rounded-xl border border-border/70 bg-background/40 p-4"><p className="text-xs text-muted-foreground">Published</p><p className="mt-1 font-semibold text-emerald-600">{records.filter((item) => item.published !== false).length}</p></div>
        </div>
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input aria-label="Search records" placeholder="Search records..." className="w-full rounded-xl border border-border bg-background/60 py-2.5 pl-9 pr-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" /></div>
          <button type="button" onClick={() => void loadRecords()} className="inline-flex items-center gap-1 rounded-xl bg-secondary px-3 py-2.5 text-xs text-muted-foreground" disabled={loading}><RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh</button>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4 border-b border-border/60 pb-8 md:grid-cols-2">
          <label className="text-sm text-muted-foreground">Title<input required value={form.title} onChange={(event) => updateForm("title", event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-foreground" /></label>
          <label className="text-sm text-muted-foreground">Category / slug<input value={form.category} onChange={(event) => updateForm("category", event.target.value)} placeholder="saas, frontend, engineering" className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-foreground" /></label>
          <label className="text-sm text-muted-foreground md:col-span-2">Description<textarea required value={form.description} onChange={(event) => updateForm("description", event.target.value)} rows={3} className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-foreground" /></label>
          {(kind === "articles" || kind === "experience" || kind === "testimonials") && <label className="text-sm text-muted-foreground md:col-span-2">{kind === "articles" ? "Article body" : "Additional details"}<textarea value={form.body} onChange={(event) => updateForm("body", event.target.value)} rows={6} className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 font-mono text-sm text-foreground" /></label>}
          <label className="text-sm text-muted-foreground">Public URL<input type="url" value={form.url} onChange={(event) => updateForm("url", event.target.value)} placeholder="https://" className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-foreground" /></label>
          {kind === "tools" && <label className="text-sm text-muted-foreground">Tool website<input type="url" value={form.website} onChange={(event) => updateForm("website", event.target.value)} placeholder="https://" className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-foreground" /></label>}
          <label className="text-sm text-muted-foreground">Tags, comma separated<input value={form.tags} onChange={(event) => updateForm("tags", event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-foreground" /></label>
          {kind === "tools" && <label className="text-sm text-muted-foreground">Icon name / URL<input value={form.icon} onChange={(event) => updateForm("icon", event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-foreground" /></label>}
          <label className="md:col-span-2 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground"><Upload className="h-4 w-4 text-primary" /><span>{image?.name || "Upload or replace image (optional)"}</span><input type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] || null)} className="sr-only" /></label>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground md:col-span-2"><label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.published} onChange={(event) => updateForm("published", event.target.checked)} /> Published</label><label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(event) => updateForm("featured", event.target.checked)} /> Featured</label></div>
          <div className="flex flex-wrap items-center gap-3 md:col-span-2"><button disabled={busy} className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-60"><Plus className="h-4 w-4" />{busy ? "Saving..." : modeLabel}</button>{editingId && <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-3 text-sm font-semibold text-muted-foreground"><X className="h-4 w-4" />Cancel edit</button>}{status && <p role="status" className="inline-flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-primary" />{status}</p>}</div>
        </form>
        <div className="mt-7 space-y-2">
          <h3 className="text-sm font-semibold text-foreground">{contentKinds.find((item) => item.value === kind)?.label} records ({records.length})</h3>
          {records.length === 0 && <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">{loading ? "Loading records..." : "No records yet."}</p>}
          {records.map((item) => <div key={item.$id} className="flex flex-col gap-3 rounded-xl border border-border/70 bg-background/30 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="truncate font-semibold text-foreground">{item.title || item.name}</p><p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{item.description || item.excerpt}</p><span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] ${item.published === false ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600"}`}>{item.published === false ? "Draft" : "Published"}</span></div><div className="flex shrink-0 gap-2"><button type="button" onClick={() => startEdit(item)} className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-muted-foreground"><Edit3 className="h-3.5 w-3.5" /> Edit</button><button type="button" onClick={() => void handleDelete(item)} disabled={busy} className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive"><Trash2 className="h-3.5 w-3.5" /> Delete</button></div></div>)}
        </div>
      </div>
      </div>
      </div>
    </section>
  );
}
