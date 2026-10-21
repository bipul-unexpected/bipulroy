import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useAuth, useUser, SignIn, UserButton } from "@clerk/react";
import {
  CheckCircle2,
  Edit3,
  Moon,
  Plus,
  RefreshCw,
  Search,
  Sun,
  Trash2,
  Upload,
  X,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { THEME_CHANGE_EVENT } from "../../lib/theme";
import { AppSidebar } from "../app-sidebar";
import { ChartAreaInteractive } from "../chart-area-interactive";
import { DataTable } from "../data-table";
import { SectionCards } from "../section-cards";
import { SiteHeader } from "../site-header";
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
  title: "",
  description: "",
  body: "",
  url: "",
  website: "",
  tags: "",
  category: "",
  icon: "",
  published: true,
  featured: false,
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
  const titleVal = form.title.trim();
  const descVal = form.description.trim();
  return {
    title: titleVal,
    name: titleVal,
    description: descVal,
    excerpt: descVal,
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
  const [collectionCounts, setCollectionCounts] = useState<Record<ContentKind, number>>({
    projects: 0,
    articles: 0,
    gallery: 0,
    tools: 0,
    experience: 0,
    services: 0,
    testimonials: 0,
  });
  const [form, setForm] = useState<FormState>(emptyForm);
  const [image, setImage] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error">("success");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  }

  async function loadCollectionCounts() {
    try {
      const entries = await Promise.all(
        contentKinds.map(async ({ value }) => {
          try {
            const list = await listContent(value, { includeUnpublished: true });
            return [value, list.length] as const;
          } catch {
            return [value, 0] as const;
          }
        }),
      );
      setCollectionCounts(Object.fromEntries(entries) as Record<ContentKind, number>);
    } catch {
      // Ignore count fetch errors
    }
  }

  useEffect(() => {
    if (canManage) {
      void loadRecords();
      void loadCollectionCounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canManage]);

  const modeLabel = useMemo(() => (editingId ? "Update Record" : "Publish Record"), [editingId]);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return records;
    return records.filter((item) =>
      `${item.title || item.name || ""} ${item.description || item.excerpt || ""} ${item.category || ""}`
        .toLowerCase()
        .includes(query),
    );
  }, [records, search]);

  const dashboardRows = useMemo(
    () =>
      filteredRecords.map((item, index) => ({
        id: index + 1,
        documentId: item.$id,
        header: item.title || item.name || "Untitled",
        type: contentKinds.find((entry) => entry.value === kind)?.label || kind,
        status: item.published === false ? "Draft" : "Published",
        target: item.category || "Portfolio",
        limit: item.featured ? "Featured" : "Standard",
        reviewer: item.$createdAt ? new Date(item.$createdAt).toLocaleDateString() : "—",
      })),
    [filteredRecords, kind],
  );

  const chartData = useMemo(() => {
    const counts = new Map<string, number>();
    records.forEach((item) => {
      const date = item.$createdAt?.slice(0, 10);
      if (date) counts.set(date, (counts.get(date) || 0) + 1);
    });
    return Array.from(counts.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({
        date,
        desktop: count,
        mobile: 0,
      }));
  }, [records]);

  function toggleAdminTheme() {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem("bipul-theme", next ? "dark" : "light");
    if (next) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: next }));
  }

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function startEdit(item: RemoteContent) {
    setEditingId(item.$id);
    setForm(toForm(item));
    setImage(null);
    document.getElementById("content-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
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

      if (editingId) {
        await updateContent(kind, editingId, payload);
      } else {
        await createContent(kind, payload);
      }

      if (previous?.imageFileId && uploaded?.fileId && previous.imageFileId !== uploaded.fileId) {
        try {
          await deleteContentImage(previous.imageFileId);
        } catch (error) {
          console.warn("Content updated, but previous image could not be removed:", error);
        }
      }

      resetForm();
      await loadRecords();
      await loadCollectionCounts();
      setStatus(editingId ? "Content updated successfully." : "Content published successfully.");
      setStatusType("success");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Appwrite operation failed.");
      setStatusType("error");
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
      await loadCollectionCounts();
      setStatus("Content deleted successfully.");
      setStatusType("success");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Delete failed.");
      setStatusType("error");
    } finally {
      setBusy(false);
    }
  }

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <section id="admin" className="relative min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md rounded-2xl border border-border/70 bg-card p-6 sm:p-8 shadow-xl">
          <div className="mb-6 text-center">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-primary dark:bg-white/10 dark:text-white">
              Private Studio
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground dark:text-white">
              Portfolio Admin Studio
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Sign in with your administrator Clerk account to manage content.
            </p>
          </div>
          <SignIn routing="hash" signUpUrl="" />
        </div>
      </section>
    );
  }

  if (!canManage) {
    return (
      <section id="admin" className="relative min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-lg rounded-2xl border border-border/70 bg-card p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-amber-500 font-semibold">
                Admin Access Required
              </p>
              <h2 className="mt-2 text-xl sm:text-2xl font-bold text-foreground dark:text-white">
                Account is not an administrator
              </h2>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                Your Clerk account is authenticated, but administrator privileges are required.
                Add public metadata role=admin in your Clerk dashboard or set your Clerk user ID in VITE_CLERK_ADMIN_USER_ID.
              </p>
              <pre className="mt-4 w-fit rounded-xl border border-border bg-background/80 px-4 py-2 font-mono text-xs text-foreground dark:text-white">
                {`{ "role": "admin" }`}
              </pre>
            </div>
            <UserButton />
          </div>
        </div>
      </section>
    );
  }

  return (
    <div id="admin" className="min-h-screen w-full bg-background text-foreground flex flex-col md:flex-row antialiased">
      {/* Sidebar: sleek desktop + full mobile drawer */}
      <AppSidebar
        collections={contentKinds}
        activeCollection={kind}
        onCollectionChange={(value) => {
          const nextKind = value as ContentKind;
          setKind(nextKind);
          resetForm();
          void loadRecords(nextKind);
        }}
        counts={collectionCounts}
        user={{
          name: user.fullName || "Bipul Roy",
          email: user.primaryEmailAddress?.emailAddress || "",
          avatar: user.imageUrl,
        }}
        openMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleAdminTheme}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 w-full min-h-screen bg-background">
        <SiteHeader
          title={contentKinds.find((item) => item.value === kind)?.label || "Dashboard"}
          onToggleSidebar={() => setMobileMenuOpen((prev) => !prev)}
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleAdminTheme}
                aria-label={isDarkMode ? "Use light mode" : "Use dark mode"}
                className="h-9 w-9 rounded-xl border-border/70 hover:bg-accent dark:hover:border-white/20"
              >
                {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-500" />}
              </Button>
              <UserButton />
            </div>
          }
        />

        <main className="flex-1 p-3.5 sm:p-5 lg:p-7 max-w-7xl w-full mx-auto space-y-6">
          {/* Status banner */}
          {status && (
            <div
              className={`flex items-center justify-between gap-3 p-4 rounded-2xl border text-sm transition-all ${
                statusType === "success"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                  : "bg-destructive/10 border-destructive/30 text-destructive dark:text-red-400"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {statusType === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0" />
                )}
                <span className="truncate">{status}</span>
              </div>
              <button
                type="button"
                onClick={() => setStatus("")}
                className="text-xs hover:opacity-75 focus:outline-none p-1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* 1. Overview Section Cards: projects, testimonials, articles, gallery, tools, experience, services */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold tracking-tight text-foreground dark:text-white">
                  Dashboard Overview
                </h2>
                <p className="text-xs text-muted-foreground">
                  Quick metrics across all portfolio content collections. Click any card to manage.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  void loadRecords();
                  void loadCollectionCounts();
                }}
                disabled={loading}
                className="h-8 rounded-xl text-xs gap-1.5 text-muted-foreground hover:text-foreground dark:hover:text-white"
              >
                <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
                <span>Sync</span>
              </Button>
            </div>
            <SectionCards
              stats={collectionCounts}
              activeKind={kind}
              onSelectKind={(selectedKey) => {
                const nextKind = selectedKey as ContentKind;
                setKind(nextKind);
                resetForm();
                void loadRecords(nextKind);
              }}
            />
          </section>

          {/* 2. Interactive Activity Chart */}
          <section className="space-y-2">
            <ChartAreaInteractive data={chartData} />
          </section>

          {/* 3. Data Table */}
          <section className="space-y-2">
            <DataTable
              data={dashboardRows}
              onEdit={(documentId) => {
                const item = records.find((record) => record.$id === documentId);
                if (item) startEdit(item);
              }}
              onDelete={(documentId) => {
                const item = records.find((record) => record.$id === documentId);
                if (item) void handleDelete(item);
              }}
              onCreate={() => {
                resetForm();
                document.getElementById("content-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            />
          </section>

          {/* 4. Content Editor Form */}
          <section
            id="content-editor"
            className="rounded-2xl border border-border/70 bg-card p-4 sm:p-6 lg:p-7 shadow-sm transition-all"
          >
            <div className="mb-6 flex flex-col gap-2 border-b border-border/60 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-primary dark:text-white font-semibold">
                  Content Editor
                </span>
                <h3 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-foreground dark:text-white">
                  Manage {contentKinds.find((item) => item.value === kind)?.label.toLowerCase()} content
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Create, publish, update, and organize the content displayed on your portfolio website.
                </p>
              </div>
              {editingId && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs py-1">
                    Editing Mode
                  </Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={resetForm}
                    className="h-8 rounded-xl text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* Quick stats pills */}
            <div className="mb-6 grid gap-2.5 grid-cols-2 sm:grid-cols-3">
              <div className="rounded-xl border border-border/70 bg-background/50 p-3 sm:p-4">
                <p className="text-[11px] text-muted-foreground">Selected Collection</p>
                <p className="mt-1 font-semibold text-sm sm:text-base text-foreground dark:text-white">
                  {contentKinds.find((item) => item.value === kind)?.label}
                </p>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/50 p-3 sm:p-4">
                <p className="text-[11px] text-muted-foreground">Total Records</p>
                <p className="mt-1 font-semibold text-sm sm:text-base text-foreground dark:text-white">
                  {records.length}
                </p>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/50 p-3 sm:p-4 col-span-2 sm:col-span-1">
                <p className="text-[11px] text-muted-foreground">Published</p>
                <p className="mt-1 font-semibold text-sm sm:text-base text-emerald-500">
                  {records.filter((item) => item.published !== false).length}
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="grid min-w-0 gap-4 border-b border-border/60 pb-8 md:grid-cols-2">
              <label className="text-xs font-medium text-muted-foreground">
                Title / Name *
                <input
                  required
                  value={form.title}
                  onChange={(event) => updateForm("title", event.target.value)}
                  placeholder="e.g. NextGen SaaS Platform"
                  className="mt-1.5 w-full rounded-xl border border-border/80 bg-background/70 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 dark:focus:ring-white/40 dark:focus:border-white transition-all"
                />
              </label>

              <label className="text-xs font-medium text-muted-foreground">
                Category / Role / Slug
                <input
                  value={form.category}
                  onChange={(event) => updateForm("category", event.target.value)}
                  placeholder="e.g. saas, frontend, engineering"
                  className="mt-1.5 w-full rounded-xl border border-border/80 bg-background/70 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 dark:focus:ring-white/40 dark:focus:border-white transition-all"
                />
              </label>

              <label className="text-xs font-medium text-muted-foreground md:col-span-2">
                Description / Summary *
                <textarea
                  required
                  value={form.description}
                  onChange={(event) => updateForm("description", event.target.value)}
                  rows={3}
                  placeholder="Short overview or excerpt..."
                  className="mt-1.5 w-full rounded-xl border border-border/80 bg-background/70 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 dark:focus:ring-white/40 dark:focus:border-white transition-all"
                />
              </label>

              {(kind === "articles" || kind === "experience" || kind === "testimonials" || kind === "services") && (
                <label className="text-xs font-medium text-muted-foreground md:col-span-2">
                  {kind === "articles" ? "Article Body / Markdown" : "Extended Details / Notes"}
                  <textarea
                    value={form.body}
                    onChange={(event) => updateForm("body", event.target.value)}
                    rows={6}
                    placeholder="Full content, notes, or highlights..."
                    className="mt-1.5 w-full rounded-xl border border-border/80 bg-background/70 px-4 py-2.5 font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 dark:focus:ring-white/40 dark:focus:border-white transition-all"
                  />
                </label>
              )}

              <label className="text-xs font-medium text-muted-foreground">
                Public / Live URL
                <input
                  type="url"
                  value={form.url}
                  onChange={(event) => updateForm("url", event.target.value)}
                  placeholder="https://..."
                  className="mt-1.5 w-full rounded-xl border border-border/80 bg-background/70 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 dark:focus:ring-white/40 dark:focus:border-white transition-all"
                />
              </label>

              {kind === "tools" && (
                <label className="text-xs font-medium text-muted-foreground">
                  Tool Website URL
                  <input
                    type="url"
                    value={form.website}
                    onChange={(event) => updateForm("website", event.target.value)}
                    placeholder="https://..."
                    className="mt-1.5 w-full rounded-xl border border-border/80 bg-background/70 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 dark:focus:ring-white/40 dark:focus:border-white transition-all"
                  />
                </label>
              )}

              <label className="text-xs font-medium text-muted-foreground">
                Tags (comma separated)
                <input
                  value={form.tags}
                  onChange={(event) => updateForm("tags", event.target.value)}
                  placeholder="React, TypeScript, Next.js"
                  className="mt-1.5 w-full rounded-xl border border-border/80 bg-background/70 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 dark:focus:ring-white/40 dark:focus:border-white transition-all"
                />
              </label>

              {kind === "tools" && (
                <label className="text-xs font-medium text-muted-foreground">
                  Icon Name / SVG URL
                  <input
                    value={form.icon}
                    onChange={(event) => updateForm("icon", event.target.value)}
                    placeholder="Code, Layout, Terminal"
                    className="mt-1.5 w-full rounded-xl border border-border/80 bg-background/70 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 dark:focus:ring-white/40 dark:focus:border-white transition-all"
                  />
                </label>
              )}

              {/* Image upload */}
              <label className="md:col-span-2 flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-border/80 p-4 text-xs text-muted-foreground hover:border-primary dark:hover:border-white/40 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Upload className="h-4 w-4 text-primary dark:text-white" />
                  <span className="font-medium text-foreground dark:text-white">
                    {image?.name || "Upload or replace media file (optional)"}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground uppercase">Browse</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setImage(event.target.files?.[0] || null)}
                  className="sr-only"
                />
              </label>

              {/* Toggles */}
              <div className="flex flex-wrap gap-5 text-xs text-muted-foreground md:col-span-2 pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(event) => updateForm("published", event.target.checked)}
                    className="rounded border-border text-primary dark:text-white focus:ring-0"
                  />
                  <span className="font-medium text-foreground dark:text-white">Published</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) => updateForm("featured", event.target.checked)}
                    className="rounded border-border text-primary dark:text-white focus:ring-0"
                  />
                  <span className="font-medium text-foreground dark:text-white">Featured Item</span>
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex flex-wrap items-center gap-3 md:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs sm:text-sm font-semibold transition-all disabled:opacity-60 bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>{busy ? "Saving..." : modeLabel}</span>
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-secondary px-4 py-2.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel Edit</span>
                  </button>
                )}
              </div>
            </form>

            {/* Records List preview */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground dark:text-white">
                  {contentKinds.find((item) => item.value === kind)?.label} Records ({records.length})
                </h4>
                <div className="relative min-w-[180px] sm:min-w-[240px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    aria-label="Filter records"
                    placeholder="Filter records..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="h-9 pl-8 text-xs rounded-xl"
                  />
                </div>
              </div>

              {filteredRecords.length === 0 && (
                <div className="rounded-xl border border-dashed border-border/80 p-8 text-center text-xs text-muted-foreground">
                  {loading ? "Loading records..." : search ? "No matching records found." : "No records published yet."}
                </div>
              )}

              <div className="grid gap-2.5">
                {filteredRecords.map((item) => (
                  <div
                    key={item.$id}
                    className="flex flex-col gap-3 rounded-xl border border-border/70 bg-background/50 p-4 transition-colors hover:border-border sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-semibold text-sm text-foreground dark:text-white">
                          {item.title || item.name}
                        </p>
                        {item.featured && (
                          <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                        {item.description || item.excerpt}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            item.published === false
                              ? "text-amber-500 border-amber-500/30"
                              : "text-emerald-500 border-emerald-500/30"
                          }`}
                        >
                          {item.published === false ? "Draft" : "Published"}
                        </Badge>
                        {item.category && (
                          <span className="text-[11px] font-mono text-muted-foreground">
                            #{item.category}
                          </span>
                        )}
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-muted-foreground hover:text-foreground dark:hover:text-white inline-flex items-center gap-0.5 ml-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(item)}
                        className="h-8 rounded-xl text-xs gap-1.5"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => void handleDelete(item)}
                        disabled={busy}
                        className="h-8 rounded-xl text-xs gap-1.5"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
