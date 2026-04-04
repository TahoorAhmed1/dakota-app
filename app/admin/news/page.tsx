"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import AdminLoadingState from "@/components/admin/admin-loading-state";
import { getAdminKeyFromStorage } from "@/lib/admin-client";

type NewsPost = {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  imageUrl: "",
  isPublished: true,
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function adminFetch(path: string, options: RequestInit = {}) {
  const adminKey = getAdminKeyFromStorage();
  const headers: HeadersInit = {
    ...(options.headers as Record<string, string>),
  };
  if (adminKey) headers["x-admin-key"] = adminKey;
  if (options.body) headers["Content-Type"] = "application/json";
  const res = await fetch(path, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed: ${res.statusText}`);
  }
  return res.json();
}

export default function AdminNewsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchPosts = async () => {
    try {
      const data = await adminFetch("/api/admin/news");
      setPosts(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load posts";
      setError(msg);
      if (msg.toLowerCase().includes("unauthorized")) {
        setTimeout(() => router.push("/admin/login"), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEdit = (post: NewsPost) => {
    setEditingId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      description: post.description,
      imageUrl: post.imageUrl ?? "",
      isPublished: post.isPublished,
    });
    setError("");
    setShowForm(true);
  };

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: editingId ? prev.slug : slugify(value),
    }));
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.slug.trim() || !form.description.trim()) {
      setError("Title, slug, and description are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        const updated = await adminFetch(`/api/admin/news/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        setPosts((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
        toast.success("Post updated.");
      } else {
        const created = await adminFetch("/api/admin/news", {
          method: "POST",
          body: JSON.stringify(form),
        });
        setPosts((prev) => [created, ...prev]);
        toast.success("Post created.");
      }
      setShowForm(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save post";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await adminFetch(`/api/admin/news/${id}`, { method: "DELETE" });
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Post deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete post");
    } finally {
      setDeleting(null);
    }
  };

  const handleTogglePublish = async (post: NewsPost) => {
    try {
      const updated = await adminFetch(`/api/admin/news/${post.id}`, {
        method: "PUT",
        body: JSON.stringify({ isPublished: !post.isPublished }),
      });
      setPosts((prev) => prev.map((p) => (p.id === post.id ? updated : p)));
      toast.success(updated.isPublished ? "Post published." : "Post unpublished.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update post");
    }
  };

  if (loading) {
    return <AdminLoadingState label="Loading news posts..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-black">News & Events</h2>
          <p className="mt-1 text-sm text-black/70">Manage blog posts shown on the client site.</p>
        </div>
        <button
          onClick={openCreate}
          className="w-full rounded-xl bg-orange-500 px-5 py-2.5 font-semibold text-black transition hover:bg-orange-400 sm:w-auto"
        >
          + New Post
        </button>
      </div>

      {error && !showForm ? (
        <div className="rounded-2xl border border-orange-400 bg-orange-100 p-4 text-black">{error}</div>
      ) : null}

      {/* Form Modal */}
      {showForm ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-16">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="mb-5 text-xl font-bold text-black">
              {editingId ? "Edit Post" : "New Post"}
            </h3>

            {error ? (
              <div className="mb-4 rounded-xl border border-orange-400 bg-orange-100 p-3 text-sm text-black">
                {error}
              </div>
            ) : null}

            <div className="space-y-4">
              <label className="block space-y-1 text-sm font-medium text-black">
                <span>Title *</span>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Post title"
                  className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </label>

              <label className="block space-y-1 text-sm font-medium text-black">
                <span>Slug *</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
                  placeholder="url-friendly-slug"
                  className="w-full rounded-xl border border-black/20 px-3 py-2 font-mono text-sm text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <span className="text-xs text-black/50">/news/{form.slug || "..."}</span>
              </label>

              <label className="block space-y-1 text-sm font-medium text-black">
                <span>Description *</span>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={6}
                  placeholder="Post content / description"
                  className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </label>

              <label className="block space-y-1 text-sm font-medium text-black">
                <span>Image URL</span>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </label>

              {form.imageUrl ? (
                <div className="overflow-hidden rounded-xl border border-black/10">
                  <Image
                    src={form.imageUrl}
                    alt="Preview"
                    width={600}
                    height={200}
                    className="h-40 w-full object-cover"
                    unoptimized
                  />
                </div>
              ) : null}

              <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-black">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm((prev) => ({ ...prev, isPublished: e.target.checked }))}
                  className="h-4 w-4 accent-orange-500"
                />
                <span>Published (visible to visitors)</span>
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-black/20 px-5 py-2.5 font-medium text-black transition hover:bg-black/5"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-orange-500 px-5 py-2.5 font-semibold text-black transition hover:bg-orange-400 disabled:bg-black/30 disabled:text-white"
              >
                {saving ? "Saving..." : editingId ? "Save Changes" : "Create Post"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Posts Table */}
      {posts.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-10 text-center text-black/50 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          No posts yet. Click <strong>+ New Post</strong> to create one.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <table className="w-full text-sm">
            <thead className="border-b border-black/10 bg-black/5 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-black">Image</th>
                <th className="px-4 py-3 font-semibold text-black">Title</th>
                <th className="hidden px-4 py-3 font-semibold text-black md:table-cell">Slug</th>
                <th className="px-4 py-3 font-semibold text-black">Status</th>
                <th className="hidden px-4 py-3 font-semibold text-black lg:table-cell">Created</th>
                <th className="px-4 py-3 font-semibold text-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {posts.map((post) => (
                <tr key={post.id} className="transition hover:bg-black/2">
                  <td className="px-4 py-3">
                    {post.imageUrl ? (
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        width={64}
                        height={48}
                        className="h-12 w-16 rounded-lg object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-black/10 text-xs text-black/40">
                        No img
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-black">{post.title}</td>
                  <td className="hidden px-4 py-3 font-mono text-xs text-black/60 md:table-cell">
                    {post.slug}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleTogglePublish(post)}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                        post.isPublished
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-black/10 text-black/50 hover:bg-black/20"
                      }`}
                    >
                      {post.isPublished ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="hidden px-4 py-3 text-black/60 lg:table-cell">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(post)}
                        className="rounded-lg border border-black/20 px-3 py-1.5 text-xs font-medium text-black transition hover:bg-black/5"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deleting === post.id}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        {deleting === post.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
