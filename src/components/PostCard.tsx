"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNowStrict } from "date-fns";
import type { CommunityPostView } from "@/server/queries";
import { MessageSquare, ArrowUp, ArrowDown } from "lucide-react";
import { useState, useTransition } from "react";
import { handleVote } from "@/lib/actions";
import { voteTypeEnum } from "@/server/db/schema";
import { cn } from "@/lib/utils";

type PostCardProps = {
  post: CommunityPostView;
};

export default function PostCard({ post }: PostCardProps) {
  const timeAgo = formatDistanceToNowStrict(post.createdAt, {
    addSuffix: true,
  });

  const [voteScore, setVoteScore] = useState(post.voteScore);
  const [userVote, setUserVote] = useState(post.userVote);
  const [isPending, startTransition] = useTransition();

  const onVote = (voteType: (typeof voteTypeEnum.enumValues)[number]) => {
    if (isPending) return;

    let scoreChange = 0;
    let newUserVote: typeof userVote = null;

    if (userVote === voteType) {
      scoreChange = voteType === "UPVOTE" ? -1 : 1;
      newUserVote = null;
    } else {
      scoreChange = voteType === "UPVOTE" ? 1 : -1;
      if (userVote && userVote !== voteType) {
        scoreChange = voteType === "UPVOTE" ? 2 : -2;
      }
      newUserVote = voteType;
    }

    setVoteScore((prev) => prev + scoreChange);
    setUserVote(newUserVote);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("postId", post.id.toString());
      formData.append("voteType", voteType);
      const result = await handleVote(formData);

      if (result?.error) {
        console.error("Vote failed:", result.error);
        setVoteScore(post.voteScore);
        setUserVote(post.userVote);
      }
    });
  };

  return (
    <div className="rounded border bg-white shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
      <div className="p-4">
        {/* Post Header */}
        <div className="mb-2 flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
          {post.author.profileImageUrl && (
            <Image
              src={post.author.profileImageUrl}
              alt={`${post.author.username ?? "User"}'s profile picture`}
              width={20}
              height={20}
              className="rounded-full"
            />
          )}
          <span>
            Posted by{" "}
            <Link
              href={`/app/user/${post.author.username ?? post.author.id}`}
              className="font-medium text-gray-700 hover:underline dark:text-gray-300"
            >
              u/{post.author.username ?? "Unknown"}
            </Link>
          </span>
          <span>•</span>
          <time dateTime={post.createdAt.toISOString()}>{timeAgo}</time>
          <span className="hidden md:inline">•</span>
          <Link
            href={`/app/h/${post.community.name}`}
            className="hidden md:inline hover:underline font-medium text-gray-700 dark:text-gray-300"
          >
            h/{post.community.name}
          </Link>
        </div>

        {/* Post Title and Link */}
        <Link
          href={`/app/p/${post.id}`}
          className="block hover:text-blue-600 dark:hover:text-blue-400"
        >
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            {post.title}
          </h2>
        </Link>

        {/* Post Content Preview */}
        <div className="prose prose-sm max-h-40 overflow-hidden line-clamp-4 mb-3 dark:prose-invert">
          <p className="text-gray-700 dark:text-gray-300">{post.content}</p>
        </div>

        {/* Image Preview */}
        {post.imageUrls && post.imageUrls.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-1">
            {post.imageUrls.slice(0, 3).map((url, index) => (
              <Link key={index} href={`/app/p/${post.id}`}>
                <div className="relative aspect-square cursor-pointer">
                  <Image
                    src={url}
                    alt={`Post image ${index + 1}`}
                    fill
                    className="object-cover rounded"
                    sizes="(max-width: 768px) 30vw, (max-width: 1200px) 15vw, 100px"
                  />
                </div>
              </Link>
            ))}
            {post.imageUrls.length > 3 && (
              <Link href={`/app/p/${post.id}`}>
                <div className="relative aspect-square flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded text-gray-500 dark:text-gray-400 cursor-pointer">
                  +{post.imageUrls.length - 3} more
                </div>
              </Link>
            )}
          </div>
        )}

        {/* Post Footer Actions */}
        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onVote("UPVOTE")}
              disabled={isPending}
              className={cn(
                "rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-700",
                userVote === "UPVOTE"
                  ? "text-orange-500"
                  : "text-gray-500 dark:text-gray-400",
                isPending && "cursor-not-allowed opacity-50"
              )}
              aria-label="Upvote"
            >
              <ArrowUp
                className={cn(
                  "h-4 w-4",
                  userVote === "UPVOTE" && "fill-current"
                )}
              />
            </button>

            <span className="min-w-[1.5rem] text-center text-xs font-semibold text-gray-700 dark:text-gray-300">
              {voteScore}
            </span>

            <button
              onClick={() => onVote("DOWNVOTE")}
              disabled={isPending}
              className={cn(
                "rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-700",
                userVote === "DOWNVOTE"
                  ? "text-blue-600"
                  : "text-gray-500 dark:text-gray-400",
                isPending && "cursor-not-allowed opacity-50"
              )}
              aria-label="Downvote"
            >
              <ArrowDown
                className={cn(
                  "h-4 w-4",
                  userVote === "DOWNVOTE" && "fill-current"
                )}
              />
            </button>
          </div>

          <Link
            href={`/app/p/${post.id}#comments`}
            className="flex items-center space-x-1 rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{post.commentCount} Comments</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
