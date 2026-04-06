"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { getAdminKeyFromStorage } from "@/lib/admin-client";

type GalleryImage = {
  id: string;
  publicId: string;
  url: string;
  alt: string;
  caption: string;
  category: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  displayOrder: number;
  isPublished: boolean;
  createdAt: string;
};

const CATEGORIES = ["general", "hunting", "camps", "dogs", "scenery", "groups"];

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

function adminHeaders(extra: Record<string, string> = {}): HeadersInit {
  const h: Record<string, string> = { ...extra };
  const key = getAdminKeyFromStorage();
  if (key) h["x-admin-key"] = key;
  return h;
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [urlInput, setUrlInput] = useState("");
  const [urlCategory, setUrlCategory] = useState("general");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/gallery", {
        headers: adminHeaders(),
      });
      if (!res.ok) throw new Error("Failed to load gallery");
      const data = await res.json();
      setImages(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load gallery");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // ---------- File Upload ----------
  const handleFileUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (!fileArray.length) return;

    setUploading(true);
    setUploadProgress(`Uploading ${fileArray.length} file(s)...`);

    const formData = new FormData();
    for (const f of fileArray) formData.append("files", f);
    formData.append("category", urlCategory);

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: adminHeaders(),
        body: formData,
      });

      const data = await res.json();
      if (data.uploaded?.length) {
        toast.success(`${data.uploaded.length} image(s) uploaded`);
        fetchImages();
      }
      if (data.errors?.length) {
        for (const e of data.errors) toast.error(`${e.name}: ${e.error}`);
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress("");
    }
  };

  // ---------- URL Upload ----------
  const handleUrlUpload = async () => {
    const url = urlInput.trim();
    if (!url) return;

    setUploading(true);
    setUploadProgress("Uploading from URL...");

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: adminHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ url, category: urlCategory }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Upload failed");
      }

      toast.success("Image uploaded from URL");
      setUrlInput("");
      fetchImages();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress("");
    }
  };

  // ---------- Delete ----------
  const handleDelete = async (ids: string[]) => {
    if (!ids.length) return;
    if (!confirm(`Delete ${ids.length} image(s)? This cannot be undone.`)) return;

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "DELETE",
        headers: adminHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ ids }),
      });

      if (!res.ok) throw new Error("Delete failed");
      const data = await res.json();
      toast.success(`${data.deleted} image(s) deleted`);
      setSelectedIds(new Set());
      fetchImages();
    } catch {
      toast.error("Delete failed");
    }
  };

  // ---------- Update Metadata ----------
  const handleUpdate = async (id: string, updates: Record<string, unknown>) => {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "PATCH",
        headers: adminHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("Update failed");
      toast.success("Image updated");
      fetchImages();
      setEditingImage(null);
    } catch {
      toast.error("Update failed");
    }
  };

  // ---------- Selection ----------
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    const filtered = filteredImages.map((i) => i.id);
    setSelectedIds(new Set(filtered));
  };

  const clearSelection = () => setSelectedIds(new Set());

  // ---------- Drag & Drop ----------
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) handleFileUpload(e.dataTransfer.files);
  };

  const filteredImages =
    filterCategory === "all"
      ? images
      : images.filter((i) => i.category === filterCategory);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black">Gallery Management</h2>
          <p className="mt-1 text-sm text-black/60">{images.length} images • Cloudinary storage</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm font-medium transition hover:bg-black/5"
          >
            {viewMode === "grid" ? "☰ List" : "▦ Grid"}
          </button>
        </div>
      </div>

      {/* Upload Section */}
      <div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-black">Upload Images</h3>

        <div className="grid gap-5 md:grid-cols-2">
          {/* File Upload / Drag & Drop */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
              dragActive
                ? "border-orange-500 bg-orange-50"
                : "border-black/20 bg-black/2 hover:border-orange-400 hover:bg-orange-50/50"
            }`}
          >
            <svg className="mb-2 h-10 w-10 text-black/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16V4m0 0-4 4m4-4 4 4M4 14v4a2 2 0 002 2h12a2 2 0 002-2v-4" />
            </svg>
            <p className="text-sm font-medium text-black/60">
              Drag & drop images here or <span className="text-orange-500 underline">browse</span>
            </p>
            <p className="mt-1 text-xs text-black/40">JPEG, PNG, WebP, GIF up to 10 MB each</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) handleFileUpload(e.target.files);
                e.target.value = "";
              }}
            />
          </div>

          {/* URL Upload */}
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-black/60 uppercase tracking-wider">Image URL</label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-black/60 uppercase tracking-wider">Category</label>
              <select
                value={urlCategory}
                onChange={(e) => setUrlCategory(e.target.value)}
                className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleUrlUpload}
              disabled={!urlInput.trim() || uploading}
              className="w-full rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
            >
              Upload from URL
            </button>
          </div>
        </div>

        {uploading && (
          <div className="mt-4 flex items-center gap-3 rounded-lg bg-orange-50 p-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
            <span className="text-sm font-medium text-orange-700">{uploadProgress}</span>
          </div>
        )}
      </div>

      {/* Filters & Bulk Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-lg border border-black/15 px-3 py-2 text-sm outline-none"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-black/60">{selectedIds.size} selected</span>
            <button
              onClick={() => handleDelete(Array.from(selectedIds))}
              className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Delete Selected
            </button>
            <button onClick={clearSelection} className="rounded-lg border border-black/10 px-3 py-2 text-sm transition hover:bg-black/5">
              Clear
            </button>
          </div>
        )}

        {filteredImages.length > 0 && selectedIds.size !== filteredImages.length && (
          <button onClick={selectAll} className="text-sm text-orange-500 transition hover:text-orange-600">
            Select All
          </button>
        )}
      </div>

      {/* Gallery Grid / List */}
      {filteredImages.length === 0 ? (
        <div className="flex min-h-[30vh] items-center justify-center rounded-xl border-2 border-dashed border-black/10">
          <p className="text-sm text-black/40">No images yet. Upload some above!</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className={`group relative overflow-hidden rounded-xl border-2 transition ${
                selectedIds.has(img.id) ? "border-orange-500 ring-2 ring-orange-500/30" : "border-transparent hover:border-black/10"
              }`}
            >
              <div className="relative aspect-square bg-black/5">
                <Image
                  src={img.url}
                  alt={img.alt || "Gallery image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/40">
                  <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition group-hover:opacity-100">
                    <button
                      onClick={() => setEditingImage(img)}
                      className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black shadow transition hover:bg-orange-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete([img.id])}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow transition hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Select checkbox */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelect(img.id);
                  }}
                  className={`absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded border-2 text-xs transition ${
                    selectedIds.has(img.id)
                      ? "border-orange-500 bg-orange-500 text-white"
                      : "border-white/80 bg-white/60 opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {selectedIds.has(img.id) && "✓"}
                </button>

                {/* Published badge */}
                {!img.isPublished && (
                  <span className="absolute right-2 top-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white">
                    DRAFT
                  </span>
                )}
              </div>

              <div className="bg-white p-2">
                <p className="truncate text-xs font-medium text-black/70">{img.alt || img.publicId.split("/").pop()}</p>
                <div className="mt-0.5 flex items-center gap-2 text-[10px] text-black/40">
                  <span>{img.format.toUpperCase()}</span>
                  <span>•</span>
                  <span>{formatBytes(img.bytes)}</span>
                  <span>•</span>
                  <span>{img.width}×{img.height}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className={`flex items-center gap-4 rounded-xl border-2 bg-white p-3 transition ${
                selectedIds.has(img.id) ? "border-orange-500" : "border-transparent hover:border-black/10"
              }`}
            >
              <button
                onClick={() => toggleSelect(img.id)}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 text-xs ${
                  selectedIds.has(img.id)
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "border-black/20"
                }`}
              >
                {selectedIds.has(img.id) && "✓"}
              </button>

              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-black/5">
                <Image src={img.url} alt={img.alt || ""} fill className="object-cover" sizes="56px" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-black">{img.alt || img.publicId.split("/").pop()}</p>
                <div className="mt-0.5 flex flex-wrap gap-2 text-xs text-black/50">
                  <span className="rounded bg-black/5 px-1.5 py-0.5">{img.category}</span>
                  <span>{img.format.toUpperCase()} • {formatBytes(img.bytes)} • {img.width}×{img.height}</span>
                  {!img.isPublished && <span className="rounded bg-yellow-100 px-1.5 py-0.5 text-yellow-700">Draft</span>}
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => setEditingImage(img)}
                  className="rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium transition hover:bg-black/5"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete([img.id])}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingImage && (
        <EditImageModal
          image={editingImage}
          onClose={() => setEditingImage(null)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
}

// ---------- Edit Modal ----------
function EditImageModal({
  image,
  onClose,
  onSave,
}: {
  image: GalleryImage;
  onClose: () => void;
  onSave: (id: string, updates: Record<string, unknown>) => void;
}) {
  const [alt, setAlt] = useState(image.alt);
  const [caption, setCaption] = useState(image.caption);
  const [category, setCategory] = useState(image.category);
  const [displayOrder, setDisplayOrder] = useState(image.displayOrder);
  const [isPublished, setIsPublished] = useState(image.isPublished);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <h3 className="text-lg font-bold text-black">Edit Image</h3>
          <button onClick={onClose} className="text-xl text-black/40 transition hover:text-black">×</button>
        </div>

        <div className="mb-5 flex justify-center">
          <div className="relative h-40 w-60 overflow-hidden rounded-lg bg-black/5">
            <Image src={image.url} alt={alt || ""} fill className="object-contain" sizes="240px" />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-black/60 uppercase tracking-wider">Alt Text</label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-orange-500"
              placeholder="Describe the image..."
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-black/60 uppercase tracking-wider">Caption</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-orange-500"
              placeholder="Optional caption..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-black/60 uppercase tracking-wider">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-orange-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-black/60 uppercase tracking-wider">Display Order</label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 rounded accent-orange-500"
            />
            <span className="text-sm font-medium text-black">Published (visible on site)</span>
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-black/10 px-4 py-2 text-sm font-medium transition hover:bg-black/5"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onSave(image.id, { alt, caption, category, displayOrder, isPublished })
            }
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
