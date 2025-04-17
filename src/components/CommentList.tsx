import type { CommentWithAuthor } from "@/server/queries";
import Image from "next/image";
import { formatDistanceToNowStrict } from "date-fns";

type CommentListProps = {
  comments: CommentWithAuthor[];
};

function formatTimeAgo(date: Date): string {
  return formatDistanceToNowStrict(date, { addSuffix: true });
}

export default function CommentList({ comments }: CommentListProps) {
  if (!comments || comments.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        No comments yet. Be the first to comment!
      </p>
    );
  }

  return (
    <ul className="space-y-6">
      {comments.map((comment) => (
        <li key={comment.id} className="flex space-x-3">
          <div className="flex-shrink-0">
            <Image
              src={
                comment.author.profileImageUrl ??
                "https://res.cloudinary.com/doac8yyie/image/upload/f_auto,q_auto/default"
              }
              alt={`${comment.author.username ?? "User"}'s avatar`}
              width={32}
              height={32}
              className="rounded-full"
            />
          </div>
          <div className="flex-1">
            <div className="text-sm">
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {comment.author.username ?? "Anonymous"}
              </span>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                {formatTimeAgo(comment.createdAt)}
              </span>
            </div>
            <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
              {comment.text}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
