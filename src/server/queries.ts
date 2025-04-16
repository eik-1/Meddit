import { db } from "./db";
import "server-only";
import { auth } from "@clerk/nextjs/server";
import { communities, posts, users } from "./db/schema";
import { desc, eq } from "drizzle-orm";

export async function getCurrentUserProfileImageUrl(): Promise<string | null> {
  const { userId } = await auth();
  console.log(userId);

  if (!userId) {
    return null;
  }

  try {
    const result = await db
      .select({ profileImageUrl: users.profileImageUrl })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return result[0]?.profileImageUrl ?? null;
  } catch (error) {
    console.error("Error fetching user profile image URL:", error);
    return null;
  }
}

export async function getCommunities(): Promise<
  | {
      id: string;
      name: string;
      imageUrl: string;
    }[]
  | null
> {
  try {
    const result = await db
      .select({
        id: communities.id,
        name: communities.name,
        imageUrl: communities.imageUrl,
      })
      .from(communities);

    if (!result || result.length === 0) {
      return null;
    }

    return result.map((community) => ({
      id: community.id.toString(),
      name: community.name,
      imageUrl: community.imageUrl ?? "",
    }));
  } catch (error) {
    console.error("Error fetching communities:", error);
    return null;
  }
}

type Post = {
  id: number;
  title: string;
  content: string;
  imageUrls: string[] | null;
  medicinesLinks: string[] | null;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  communityId: number;
};

export async function getPostById(postId: number): Promise<Post | null> {
  try {
    const result = await db.select().from(posts).where(eq(posts.id, postId));
    if (!result || result.length === 0) {
      return null;
    }
    return result[0];
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    return null;
  }
}

export async function getLatestPosts(
  limit: number = 10
): Promise<Post[] | null> {
  try {
    const result = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(limit);

    if (!result || result.length === 0) {
      return null;
    }

    return result.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      imageUrls: post.imageUrls,
      medicinesLinks: post.medicinesLinks,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      authorId: post.authorId,
      communityId: post.communityId,
    }));
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    return null;
  }
}

export async function getPostsByCommunity(
  communityId: number
): Promise<Post[] | null> {
  try {
    const result = await db
      .select()
      .from(posts)
      .where(eq(posts.communityId, communityId))
      .orderBy(desc(posts.createdAt));

    if (!result || result.length === 0) {
      return null;
    }

    return result.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      imageUrls: post.imageUrls,
      medicinesLinks: post.medicinesLinks,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      authorId: post.authorId,
      communityId: post.communityId,
    }));
  } catch (error) {
    console.error("Error fetching posts by community:", error);
    return null;
  }
}

export type PostView = NonNullable<Awaited<ReturnType<typeof getPostView>>>;

export async function getPostView(postId: number) {
  try {
    const result = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
      with: {
        author: {
          columns: {
            id: true,
            username: true,
            profileImageUrl: true,
          },
        },
        community: {
          columns: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!result) return null;

    // TODO: Add vote count and user's vote status later
    // TODO: Add comment count later

    return result;
  } catch (error) {
    console.error("Error fetching post view:", error);
    return null;
  }
}
