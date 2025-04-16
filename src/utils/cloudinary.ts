import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadStream = (buffer: Buffer, options: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    // Convert buffer to Readable stream and pipe it
    Readable.from(buffer).pipe(stream);
  });
};

/**
 * Uploads a community image file to Cloudinary.
 * @param file The image file object to upload.
 * @returns The secure URL of the uploaded image, or undefined if upload fails.
 */
export async function uploadCommunityImage(
  file: File
): Promise<string | undefined> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadStream(buffer, {
      folder: "meddit/communities",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new Error("Image upload failed");
  }
}

export async function uploadPostImages(files: File[]): Promise<string[]> {
  console.log("Uploading images to Cloudinary...");
  const uploadPromises: Promise<string | null>[] = files.map((file) => {
    return (async () => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await uploadStream(buffer, {
        folder: "meddit/posts",
      });
      return result.secure_url;
    })();
  });

  try {
    const results = await Promise.all(uploadPromises);
    console.log("Uploaded images:", results);
    return results.filter((url): url is string => url !== null);
  } catch (error) {
    console.error("Cloudinary multi-upload failed:", error);
    throw new Error("One or more image uploads failed");
  }
}
