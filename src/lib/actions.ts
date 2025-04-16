"use server";

import { db } from "@/server/db";
import {
  comments,
  communities,
  posts,
  votes,
  voteTypeEnum,
} from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { uploadCommunityImage, uploadPostImages } from "@/utils/cloudinary";
import { redirect } from "next/navigation";

const alphanumericRegex = /^[a-zA-Z0-9]+$/;

export type CreateCommunityState = {
  error?: string;
  success?: boolean;
  communityName?: string;
};

export async function createCommunity(
  prevState: CreateCommunityState | undefined,
  formData: FormData
): Promise<CreateCommunityState> {
  const { userId } = await auth();
  let name = formData.get("name")?.toString().toLowerCase();
  const description = formData.get("description")?.toString();
  const imageFile = formData.get("image") as File | null;

  name = name?.split(" ").join("-");

  let imageUrl: string | undefined = undefined;

  if (!userId) {
    return {
      error: "Unauthorized: You must be signed in to create a community.",
    };
  }

  if (!name) {
    return { error: "Community name is required." };
  }
  if (name.length < 3 || name.length > 21) {
    return {
      error: "Community name must be between 3 and 21 characters long.",
    };
  }
  if (!alphanumericRegex.test(name)) {
    return { error: "Community name can only contain letters and numbers." };
  }

  if (!description) {
    return { error: "Description is required." };
  }
  if (description.length > 500) {
    return { error: "Description cannot exceed 500 characters." };
  }

  if (imageFile && imageFile.size > 0) {
    if (imageFile.size > 4 * 1024 * 1024) {
      return { error: "Image file size should not exceed 4MB." };
    }
    if (!imageFile.type.startsWith("image/")) {
      return { error: "Invalid file type. Only images are allowed." };
    }

    try {
      imageUrl = await uploadCommunityImage(imageFile);
      if (!imageUrl) {
        return {
          error: "Failed to upload community image. Please try again.",
        };
      }
    } catch (uploadError) {
      console.error("Community image upload failed:", uploadError);
      return {
        error:
          "An error occurred during image upload. Please check server logs.",
      };
    }
  }

  try {
    const existingCommunity = await db
      .select({ id: communities.id })
      .from(communities)
      .where(eq(communities.name, name))
      .limit(1);

    if (existingCommunity.length > 0) {
      return { error: "A community with this name already exists." };
    }

    const newCommunity = await db
      .insert(communities)
      .values({
        name: name,
        description: description,
        imageUrl: imageUrl,
      })
      .returning({ id: communities.id, name: communities.name });

    if (!newCommunity || newCommunity.length === 0) {
      return { error: "Community creation failed unexpectedly after check." };
    }

    revalidatePath("/app");
    revalidatePath(`/app/h/${newCommunity[0].name}`);

    return { success: true, communityName: newCommunity[0].name };
  } catch (error: any) {
    console.error("Failed to create community:", error);
    if (error.code === "23505" && error.constraint?.includes("name_key")) {
      return {
        error:
          "A community with this name already exists (database constraint).",
      };
    }
    return { error: "Failed to create community due to a database error." };
  }
}

export type CreatePostFormState = {
  message: string;
  errors?: {
    communityId?: string[];
    title?: string[];
    content?: string[];
    images?: string[];
    medicineLinks?: string[];
    _form?: string[];
  };
  success?: boolean;
} | null;

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

export async function createPost(
  prevState: CreatePostFormState,
  formData: FormData
): Promise<CreatePostFormState> {
  const { userId } = await auth();

  if (!userId) {
    return {
      message: "Authentication Error",
      errors: { _form: ["User not authenticated. Please log in."] },
      success: false,
    };
  }

  const errors: NonNullable<CreatePostFormState>["errors"] = {};

  // Community ID
  const communityIdString = formData.get("communityId")?.toString();
  let communityId: number | null = null;
  if (!communityIdString) {
    errors.communityId = ["Community selection is required."];
  } else {
    communityId = parseInt(communityIdString, 10);
    if (isNaN(communityId) || communityId <= 0) {
      errors.communityId = ["Invalid community selected."];
      communityId = null;
    }
  }

  // Title
  const title = formData.get("title")?.toString().trim() ?? "";
  if (!title) {
    errors.title = ["Title is required."];
  } else if (title.length < 3 || title.length > 120) {
    errors.title = ["Title must be between 3 and 120 characters."];
  }

  // Content
  const content = formData.get("content")?.toString().trim() ?? "";
  if (!content) {
    errors.content = ["Content is required."];
  } else if (content.length < 10) {
    errors.content = ["Content must be at least 10 characters."];
  }

  // Images
  const rawImageFormData = formData.getAll("images");
  console.log("rawImageFormData", rawImageFormData);
  const imageFiles = rawImageFormData.filter(
    (f): f is File => f instanceof File && f.size > 0
  );

  if (imageFiles.length > 3) {
    errors.images = ["Maximum of 3 images allowed."];
  } else {
    for (const file of imageFiles) {
      if (file.size > 4 * 1024 * 1024) {
        errors.images = [`Max file size is 4MB (${file.name}).`];
        break;
      }
      if (!file.type.startsWith("image/")) {
        errors.images = [
          `.jpg, .jpeg, .png, files are accepted (${file.name}).`,
        ];
        break;
      }
    }
  }

  // Medicine Links
  const medicineLinks = formData
    .getAll("medicineLinks")
    .map((link) => (typeof link === "string" ? link.trim() : ""))
    .filter((link) => link !== "");

  if (medicineLinks.length > 5) {
    errors.medicineLinks = ["Maximum of 5 medicine links allowed."];
  } else {
    const invalidLinks = medicineLinks.filter((link) => !isValidUrl(link));
    if (invalidLinks.length > 0) {
      errors.medicineLinks = [
        "One or more medicine links have an invalid URL format.",
      ];
    }
  }

  if (Object.keys(errors).length > 0) {
    console.error("Validation Errors (Manual):", errors);
    return {
      message: "Validation Error",
      errors: errors,
      success: false,
    };
  }

  const validatedCommunityId = communityId as number;
  const validatedImageFiles = imageFiles;
  const validatedMedicineLinks = medicineLinks;

  let uploadedImageUrls: string[] = [];
  if (validatedImageFiles.length > 0) {
    try {
      uploadedImageUrls = await uploadPostImages(validatedImageFiles);
    } catch (error) {
      console.error("Failed to upload post images:", error);
      return {
        message: "Server Error",
        errors: { _form: ["Failed to process images during upload."] },
        success: false,
      };
    }
  }

  let postId: number | null = null;
  let communityName: string | null = null;

  try {
    const community = await db.query.communities.findFirst({
      where: eq(communities.id, validatedCommunityId),
      columns: { id: true, name: true },
    });

    if (!community) {
      return {
        message: "Validation Error",
        errors: { communityId: ["Selected community does not exist."] },
        success: false,
      };
    }
    communityName = community.name;

    const newPost = await db
      .insert(posts)
      .values({
        communityId: validatedCommunityId,
        authorId: userId,
        title: title,
        content: content,
        imageUrls: uploadedImageUrls,
        medicinesLinks: validatedMedicineLinks,
      })
      .returning({ id: posts.id });

    console.log("Post created successfully:", newPost[0]);
    postId = newPost[0].id;

    revalidatePath(`/app/h/${communityName}`);
    revalidatePath(`/app/p/${newPost[0].id}`);
    revalidatePath("/app");
  } catch (error) {
    console.error("Database insert failed:", error);
    return {
      message: "Database Error",
      errors: { _form: ["Failed to save the post."] },
      success: false,
    };
  }
  redirect(`/app/p/${postId}`);
}

export async function handleVote(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "User not authenticated" };
  }

  const postIdString = formData.get("postId")?.toString();
  const voteType = formData.get("voteType")?.toString();

  // Manual Validation
  const postId = Number(postIdString);
  if (!postIdString || isNaN(postId) || postId <= 0) {
    return { success: false, error: "Invalid Post ID." };
  }

  if (!voteType || !voteTypeEnum.enumValues.includes(voteType as any)) {
    return { success: false, error: "Invalid Vote Type." };
  }
  const validatedVoteType =
    voteType as (typeof voteTypeEnum.enumValues)[number];

  const postPath = `/app/p/${postId}`; // Path to revalidate

  try {
    const existingVote = await db.query.votes.findFirst({
      where: and(eq(votes.userId, userId), eq(votes.postId, postId)),
    });

    if (existingVote) {
      if (existingVote.type === validatedVoteType) {
        await db
          .delete(votes)
          .where(and(eq(votes.userId, userId), eq(votes.postId, postId)));
      } else {
        await db
          .update(votes)
          .set({ type: validatedVoteType })
          .where(and(eq(votes.userId, userId), eq(votes.postId, postId)));
      }
    } else {
      await db.insert(votes).values({
        userId,
        postId,
        type: validatedVoteType,
      });
    }

    revalidatePath(postPath);
    return { success: true };
  } catch (error) {
    console.error("Error handling vote:", error);
    return { success: false, error: "Failed to process vote." };
  }
}

export async function addComment(formData: FormData): Promise<{
  success: boolean;
  errors?: { text?: string[]; _form?: string[] };
}> {
  const { userId } = await auth();
  if (!userId) {
    // Changed error structure slightly to match potential client-side handling
    return { success: false, errors: { _form: ["User not authenticated"] } };
  }

  const postIdString = formData.get("postId")?.toString();
  const text = formData.get("text")?.toString().trim();

  // Manual Validation
  const errors: { text?: string[]; _form?: string[] } = {};
  const postId = Number(postIdString);

  if (!postIdString || isNaN(postId) || postId <= 0) {
    // This case might indicate a form setup issue rather than user input error
    errors._form = ["Invalid Post ID provided."];
    // Immediately return if post ID is fundamentally wrong
    return { success: false, errors };
  }

  if (!text || text.length === 0) {
    errors.text = ["Comment cannot be empty."];
  } else if (text.length > 10000) {
    // Example max length
    errors.text = ["Comment exceeds maximum length of 10,000 characters."];
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const validatedText = text as string; // Type assertion after validation
  const postPath = `/app/p/${postId}`;

  try {
    await db.insert(comments).values({
      authorId: userId,
      postId,
      text: validatedText,
    });

    revalidatePath(postPath);
    return { success: true };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { success: false, errors: { _form: ["Failed to add comment."] } };
  }
}
