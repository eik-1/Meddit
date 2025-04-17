"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { CommentWithAuthor, PostView } from "@/server/queries";
import { formatDistanceToNowStrict } from "date-fns";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  LinkIcon,
  MessageSquare,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import Link from "next/link";
import { handleVote } from "@/lib/actions";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

type PostViewClientProps = {
  post: PostView;
  comments: CommentWithAuthor[];
};

function formatTimeAgo(date: Date): string {
  return formatDistanceToNowStrict(date, { addSuffix: true });
}

export default function PostViewClient({
  post,
  comments,
}: PostViewClientProps) {
  const router = useRouter();
  const timeAgo = formatTimeAgo(post.createdAt);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPending, startTransition] = useTransition();

  // Image states and handlers
  const hasImages = post.imageUrls && post.imageUrls.length > 0;
  const multipleImages = hasImages && post.imageUrls!.length > 1;
  const hasMedicineLinks =
    post.medicinesLinks && post.medicinesLinks.length > 0;
  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? post.imageUrls!.length - 1 : prevIndex - 1
    );
  };
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === post.imageUrls!.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Vote handler
  const onVote = (voteType: "UPVOTE" | "DOWNVOTE") => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("postId", post.id.toString());
      formData.append("voteType", voteType);
      const result = await handleVote(formData);
      if (result?.error) {
        console.error("Vote failed:", result.error);
      }
    });
  };

  return (
    <div className="mx-auto max-w-4xl p-4">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-4 cursor-pointer flex items-center space-x-2 text-sm text-zinc-500 hover:underline dark:text-zinc-400"
      >
        <ArrowLeft size={16} strokeWidth={3} />
        <span className="font-semibold">Back</span>
      </button>

      {/* Post Header */}
      <div className="mb-2 mt-7 flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
        {post.community.imageUrl && (
          <Image
            src={post.community.imageUrl}
            alt={`${post.community.name} icon`}
            width={20}
            height={20}
            className="rounded-full"
          />
        )}
        <Link
          href={`/app/h/${post.community.name}`}
          className="cursor-pointer font-semibold text-gray-800 hover:underline dark:text-gray-200"
        >
          h/{post.community.name}
        </Link>
        <span>•</span>
        <span>Posted by u/{post.author.username ?? "Unknown"}</span>
        <span>{timeAgo}</span>
      </div>

      {/* Post Title */}
      <h1 className="mb-3 mt-5 text-xl font-bold text-gray-900 dark:text-white">
        {post.title}
      </h1>

      {/* Post Content */}
      <div className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 mb-4">
        {post.content}
      </div>

      {/* Image Carousel Section */}
      {hasImages && (
        <div className="relative mb-4 h-96 w-full overflow-hidden rounded border border-gray-300 dark:border-gray-700">
          {/* Current Image */}
          <Image
            key={currentImageIndex}
            src={post.imageUrls![currentImageIndex]}
            alt={`Post image ${currentImageIndex + 1}`}
            fill
            style={{ objectFit: "contain" }}
            className="bg-gray-100 dark:bg-gray-800"
            priority={currentImageIndex === 0}
          />

          {/* Navigation Buttons (only if multiple images) */}
          {multipleImages && (
            <>
              {/* Previous Button */}
              <button
                onClick={handlePreviousImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black bg-opacity-50 p-2 text-white hover:bg-opacity-75 cursor-pointer focus:outline-none"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              {/* Next Button */}
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black bg-opacity-50 p-2 text-white hover:bg-opacity-75 cursor-pointer focus:outline-none"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
              {/* Image Counter (Optional) */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black bg-opacity-60 px-2 py-1 text-xs text-white">
                {currentImageIndex + 1} / {post.imageUrls!.length}
              </div>
            </>
          )}
        </div>
      )}

      {/* Medicine Links Section */}
      {hasMedicineLinks && (
        <div className="mb-4 rounded border border-gray-300 p-4 dark:border-gray-700">
          <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-800 dark:text-gray-200">
            <LinkIcon className="mr-2 h-5 w-5" />
            Medicine Links
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            {post.medicinesLinks!.map((link, index) => (
              <li key={index}>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  {link.slice(0, 50)}...
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Bar (Votes & Comments) */}
      <div className="mt-4 flex items-center space-x-4 border-t border-gray-200 pt-3 dark:border-gray-700">
        {/* Vote Controls */}
        <div className="flex items-center space-x-1 rounded-full bg-gray-100 p-1 dark:bg-gray-800">
          <button
            onClick={() => onVote("UPVOTE")}
            disabled={isPending}
            className={`rounded-full cursor-pointer p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 ${
              post.userVote === "UPVOTE"
                ? "text-orange-500"
                : "text-gray-500 dark:text-gray-400"
            }`}
            aria-label="Upvote"
          >
            <ArrowUp size={20} />
          </button>

          <span className="min-w-[2rem] text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
            {post.voteScore}
          </span>

          <button
            onClick={() => onVote("DOWNVOTE")}
            disabled={isPending}
            className={`rounded-full cursor-pointer p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 ${
              post.userVote === "DOWNVOTE"
                ? "text-blue-600"
                : "text-gray-500 dark:text-gray-400"
            }`}
            aria-label="Downvote"
          >
            <ArrowDown size={20} />
          </button>
        </div>

        {/* Comment Button/Link */}
        <div className="flex items-center space-x-1 rounded-md p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
          <MessageSquare size={20} />
          <span className="text-sm">
            {post.commentCount} Comment{post.commentCount !== 1 ? "s" : ""}
          </span>
        </div>

        {/* TODO: Add Share Button */}
      </div>

      {/* Comment Input Section */}
      <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Leave a Comment
        </h2>
        <CommentForm postId={post.id} />
      </div>

      {/* Comments List Section */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Comments ({post.commentCount})
        </h2>
        <CommentList comments={comments} />
      </div>
    </div>
  );
}
