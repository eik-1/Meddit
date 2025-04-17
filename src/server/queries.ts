import "server-only";

import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import {
  communities,
  posts,
  users,
  votes,
  voteTypeEnum,
  comments,
} from "./db/schema";
import { desc, eq, sql, and, count } from "drizzle-orm";

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

export type PostView = NonNullable<Awaited<ReturnType<typeof getPostView>>> & {
  voteScore: number;
  userVote: (typeof voteTypeEnum.enumValues)[number] | null; // 'UPVOTE' | 'DOWNVOTE' | null
  commentCount: number;
};

export async function getPostView(postId: number) {
  const { userId } = await auth();

  try {
    const postResult = await db.query.posts.findFirst({
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

    if (!postResult) return null;

    const voteScoreResult = await db
      .select({
        score: sql<number>`COALESCE(SUM(CASE WHEN ${votes.type} = 'UPVOTE' THEN 1 WHEN ${votes.type} = 'DOWNVOTE' THEN -1 ELSE 0 END), 0)::int`,
      })
      .from(votes)
      .where(eq(votes.postId, postId));

    const voteScore = voteScoreResult[0]?.score ?? 0;

    let userVote: (typeof voteTypeEnum.enumValues)[number] | null = null;
    if (userId) {
      const userVoteResult = await db
        .select({ type: votes.type })
        .from(votes)
        .where(and(eq(votes.postId, postId), eq(votes.userId, userId)))
        .limit(1);
      userVote = userVoteResult[0]?.type ?? null;
    }

    const commentCountResult = await db
      .select({ value: count() })
      .from(comments)
      .where(eq(comments.postId, postId));

    const commentCount = commentCountResult[0].value;

    return {
      ...postResult,
      voteScore,
      userVote,
      commentCount,
    };
  } catch (error) {
    console.error("Error fetching post view:", error);
    return null;
  }
}

export type CommentWithAuthor = NonNullable<
  Awaited<ReturnType<typeof getCommentsByPostId>>
>[number];

export async function getCommentsByPostId(postId: number) {
  try {
    const result = await db.query.comments.findMany({
      where: eq(comments.postId, postId),
      with: {
        author: {
          columns: {
            id: true,
            username: true,
            profileImageUrl: true,
          },
        },
      },
      orderBy: desc(comments.createdAt),
    });

    return result;
  } catch (error) {
    console.error("Error fetching comments by post ID:", error);
    return null;
  }
}
