"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { getAdminKeyFromStorage } from "@/lib/admin-client";

type ImageCatalogImage = {
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

const CATEGORIES = ["catalog"];

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

export default function AdminImageCatalogPage() {
  const [images, setImages] = useState<ImageCatalogImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingImage, setEditingImage] = useState<ImageCatalogImage | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [urlCategory, setUrlCategory] = useState("catalog");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/image-catalog", {
        headers: adminHeaders(),
      });
      if (!res.ok) throw new Error("Failed to load image catalog");
      const data = await res.json();
      setImages(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load image catalog");
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
      const res = await fetch("/api/admin/image-catalog", {
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
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress("");
    }
  };

  // ---------- URL Upload ----------
  const handleUrlUpload = async () => {
    if (!urlInput.trim()) return;

    setUploading(true);
    setUploadProgress("Uploading from URL...");

    try {
      const res = await fetch("/api/admin/image-catalog", {
        method: "POST",
        headers: adminHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          url: urlInput.trim(),
          category: urlCategory,
        }),
      });

      if (res.ok) {
        toast.success("Image uploaded from URL");
        fetchImages();
        setUrlInput("");
      } else {
        const error = await res.json();
        toast.error(error.error || "Upload failed");
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress("");
    }
  };

  // ---------- Delete Images ----------
  const handleDelete = async () => {
    if (!selectedIds.size) return;

    if (!confirm(`Delete ${selectedIds.size} image(s)?`)) return;

    try {
      const res = await fetch("/api/admin/image-catalog", {
        method: "DELETE",
        headers: adminHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });

      if (res.ok) {
        toast.success(`${selectedIds.size} image(s) deleted`);
        setSelectedIds(new Set());
        fetchImages();
      } else {
        toast.error("Delete failed");
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // ---------- Update Image ----------
  const handleUpdate = async (id: string, updates: Partial<ImageCatalogImage>) => {
    try {
      const res = await fetch("/api/admin/image-catalog", {
        method: "PUT",
        headers: adminHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ id, ...updates }),
      });

      if (res.ok) {
        toast.success("Image updated");
        fetchImages();
        setEditingImage(null);
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  // ---------- Drag & Drop ----------
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-black">Loading image catalog...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-black">Manage Image Catalog</h2>

      {/* Upload Section */}
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <h3 className="mb-4 text-lg font-semibold text-black">Upload Images</h3>

        {/* File Upload */}
        <div
          className={`mb-4 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
            dragActive ? "border-orange-500 bg-orange-50" : "border-black/20"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          <div className="space-y-2">
            <div className="text-sm text-black/70">
              Drag & drop images here, or{" "}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-orange-500 underline hover:text-orange-600"
              >
                browse files
              </button>
            </div>
            <div className="text-xs text-black/50">Supports JPEG, PNG, WebP, GIF, AVIF (max 10MB each)</div>
          </div>
        </div>

        {/* URL Upload */}
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="Or paste image URL..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 rounded-xl border border-black/20 px-3 py-2 text-black focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <button
            onClick={handleUrlUpload}
            disabled={!urlInput.trim() || uploading}
            className="rounded-xl bg-orange-500 px-4 py-2 font-medium text-black transition hover:bg-orange-400 disabled:bg-black/30 disabled:text-white"
          >
            Upload URL
          </button>
        </div>

        {uploading && (
          <div className="mt-4 text-sm text-black/70">{uploadProgress}</div>
        )}
      </div>

      {/* Images List */}
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-black">
            Images ({images.length})
          </h3>

          {selectedIds.size > 0 && (
            <button
              onClick={handleDelete}
              className="rounded-lg bg-red-500 px-3 py-1 text-sm text-white transition hover:bg-red-600"
            >
              Delete Selected ({selectedIds.size})
            </button>
          )}
        </div>

        {images.length === 0 ? (
          <div className="text-center py-8 text-black/70">
            No images uploaded yet
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {images.map((image) => (
              <div key={image.id} className="group relative rounded-xl border border-black/10 overflow-hidden">
                <div className="aspect-square">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors">
                  <div className="absolute top-2 left-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(image.id)}
                      onChange={(e) => {
                        const newSelected = new Set(selectedIds);
                        if (e.target.checked) {
                          newSelected.add(image.id);
                        } else {
                          newSelected.delete(image.id);
                        }
                        setSelectedIds(newSelected);
                      }}
                      className="h-4 w-4 accent-orange-500"
                    />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-xs text-white">
                      <div className="truncate">{image.alt || "No alt text"}</div>
                      <div className="text-white/70">{formatBytes(image.bytes)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}