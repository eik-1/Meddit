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
import { desc, eq, sql, and, count, or, isNull } from "drizzle-orm";

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

export async function getCommunityByName(name: string) {
  try {
    const result = await db.query.communities.findFirst({
      where: eq(communities.name, name),
    });
    return result ?? null;
  } catch (error) {
    console.error("Error fetching community by name:", error);
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

export type CommunityPostView = {
  id: number;
  title: string;
  content: string;
  imageUrls: string[] | null;
  createdAt: Date;
  author: {
    id: string;
    username: string | null;
    profileImageUrl: string | null;
  };
  community: {
    id: number;
    name: string;
    imageUrl: string | null;
  };
  voteScore: number;
  userVote: (typeof voteTypeEnum.enumValues)[number] | null;
  commentCount: number;
};

export async function getPostViewsByCommunityName(
  communityName: string
): Promise<CommunityPostView[] | null> {
  const { userId } = await auth();

  try {
    const community = await db.query.communities.findFirst({
      where: eq(communities.name, communityName),
      columns: { id: true },
    });

    if (!community) {
      console.warn(`Community not found: ${communityName}`);
      return null;
    }
    const communityId = community.id;

    const postsWithDetails = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        imageUrls: posts.imageUrls,
        createdAt: posts.createdAt,
        authorId: posts.authorId,
        authorUsername: users.username,
        authorProfileImageUrl: users.profileImageUrl,
        communityId: posts.communityId,
        communityName: communities.name,
        communityImageUrl: communities.imageUrl,
        voteScore:
          sql<number>`COALESCE(SUM(CASE WHEN ${votes.type} = 'UPVOTE' THEN 1 WHEN ${votes.type} = 'DOWNVOTE' THEN -1 ELSE 0 END), 0)::int`.as(
            "vote_score"
          ),
        commentCount: sql<number>`COUNT(DISTINCT ${comments.id})::int`.as(
          "comment_count"
        ),
        userVote:
          sql<string>`MAX(CASE WHEN ${votes.userId} = ${userId} THEN ${votes.type} ELSE NULL END)`.as(
            "user_vote"
          ),
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .innerJoin(communities, eq(posts.communityId, communities.id))
      .leftJoin(votes, eq(posts.id, votes.postId))
      .leftJoin(comments, eq(posts.id, comments.postId))
      .where(eq(posts.communityId, communityId))
      .groupBy(
        posts.id,
        users.username,
        users.profileImageUrl,
        communities.name,
        communities.imageUrl
      )
      .orderBy(desc(posts.createdAt));
    if (!postsWithDetails || postsWithDetails.length === 0) {
      return [];
    }

    return postsWithDetails.map((p) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      imageUrls: p.imageUrls,
      createdAt: p.createdAt,
      author: {
        id: p.authorId,
        username: p.authorUsername,
        profileImageUrl: p.authorProfileImageUrl,
      },
      community: {
        id: p.communityId,
        name: p.communityName,
        imageUrl: p.communityImageUrl,
      },
      voteScore: p.voteScore,
      userVote:
        p.userVote && voteTypeEnum.enumValues.includes(p.userVote as any)
          ? (p.userVote as (typeof voteTypeEnum.enumValues)[number])
          : null,
      commentCount: p.commentCount,
    }));
  } catch (error) {
    console.error("Error fetching post views by community name:", error);
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

export async function getLatestPosts(): Promise<CommunityPostView[] | null> {
  const { userId } = await auth();

  try {
    const postsWithDetails = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        imageUrls: posts.imageUrls,
        createdAt: posts.createdAt,
        authorId: posts.authorId,
        authorUsername: users.username,
        authorProfileImageUrl: users.profileImageUrl,
        communityId: posts.communityId,
        communityName: communities.name,
        communityImageUrl: communities.imageUrl,
        voteScore:
          sql<number>`COALESCE(SUM(CASE WHEN ${votes.type} = 'UPVOTE' THEN 1 WHEN ${votes.type} = 'DOWNVOTE' THEN -1 ELSE 0 END), 0)::int`.as(
            "vote_score"
          ),
        commentCount: sql<number>`COUNT(DISTINCT ${comments.id})::int`.as(
          "comment_count"
        ),
        // Determine user's vote. MAX is used because the aggregation needs an aggregate function.
        // Since we filter by userId later in the CASE or use userId in the main query join,
        // MAX will pick the user's vote if it exists (as it's the only non-NULL value for that user).
        userVote: sql<
          string | null
        >`MAX(CASE WHEN ${votes.userId} = ${userId} THEN ${votes.type} ELSE NULL END)`.as(
          "user_vote"
        ),
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .innerJoin(communities, eq(posts.communityId, communities.id))
      .leftJoin(votes, eq(posts.id, votes.postId))
      .leftJoin(comments, eq(posts.id, comments.postId))
      // No community filter here, fetches from all
      .groupBy(
        posts.id,
        users.username,
        users.profileImageUrl,
        communities.name,
        communities.imageUrl
        // Include communityId in groupBy if needed by your SQL dialect/configuration
        // communities.id
      )
      .orderBy(desc(posts.createdAt)); // Order by newest first

    if (!postsWithDetails || postsWithDetails.length === 0) {
      return []; // Return empty array if no posts found
    }

    // Map the raw database results to the desired CommunityPostView structure
    return postsWithDetails.map((p) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      imageUrls: p.imageUrls,
      createdAt: p.createdAt,
      author: {
        id: p.authorId,
        username: p.authorUsername,
        profileImageUrl: p.authorProfileImageUrl,
      },
      community: {
        id: p.communityId,
        name: p.communityName,
        imageUrl: p.communityImageUrl,
      },
      voteScore: p.voteScore,
      // Ensure userVote is one of the valid enum values or null
      userVote:
        p.userVote && voteTypeEnum.enumValues.includes(p.userVote as any)
          ? (p.userVote as (typeof voteTypeEnum.enumValues)[number])
          : null,
      commentCount: p.commentCount,
    }));
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    return null; // Return null in case of an error
  }
}
