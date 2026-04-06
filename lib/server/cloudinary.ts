import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

export async function uploadToCloudinary(
  file: Buffer | string,
  options: { folder?: string; publicId?: string } = {}
): Promise<{ publicId: string; url: string; width: number; height: number; format: string; bytes: number }> {
  const folder = options.folder ?? "dakota-app/gallery";

  return new Promise((resolve, reject) => {
    const opts: Record<string, unknown> = {
      folder,
      resource_type: "image" as const,
      overwrite: true,
    };
    if (options.publicId) opts.public_id = options.publicId;

    if (typeof file === "string") {
      // URL or base64 data URI
      cloudinary.uploader.upload(file, opts, (error, result) => {
        if (error || !result) return reject(error ?? new Error("Upload failed"));
        resolve({
          publicId: result.public_id,
          url: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      });
    } else {
      // Buffer
      const stream = cloudinary.uploader.upload_stream(opts, (error, result) => {
        if (error || !result) return reject(error ?? new Error("Upload failed"));
        resolve({
          publicId: result.public_id,
          url: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      });
      stream.end(file);
    }
  });
}

export async function deleteFromCloudinary(publicId: string) {
  return cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}
