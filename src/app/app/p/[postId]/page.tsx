import { notFound } from "next/navigation";
import { getPostView } from "@/server/queries";
import { formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";

type PostPageProps = {
  params: {
    postId: string;
  };
};

function formatTimeAgo(date: Date): string {
  return formatDistanceToNowStrict(date, { addSuffix: true });
}

export default async function PostPage({ params }: PostPageProps) {
  const postId = parseInt(params.postId, 10);

  // Validate postId
  if (isNaN(postId)) {
    notFound(); // Or redirect, or show an error message
  }

  const post = await getPostView(postId);

  if (!post) {
    notFound(); // Show 404 if post doesn't exist
  }

  const timeAgo = formatTimeAgo(post.createdAt);

  return (
    <div className="container mx-auto max-w-3xl p-4 bg-gray-900 text-white rounded-lg shadow-md">
      {/* Post Header */}
      <div className="flex items-center space-x-2 text-xs text-gray-400 mb-2">
        {post.community.imageUrl && (
          <Image
            src={post.community.imageUrl}
            alt={`${post.community.name} icon`}
            width={20}
            height={20}
            className="rounded-full"
          />
        )}
        <span className="font-semibold text-white hover:underline cursor-pointer">
          h/{post.community.name}
        </span>
        <span>•</span>
        <span>Posted by u/{post.author.username ?? "Unknown"}</span>
        <span>{timeAgo}</span>
      </div>

      {/* Post Title */}
      <h1 className="text-xl font-semibold mb-3">{post.title}</h1>

      {/* Post Content */}
      <div className="text-sm text-gray-200 whitespace-pre-wrap">
        {post.content}
      </div>

      {/* TODO: Add Images Section */}
      {/* TODO: Add Medicines Links Section */}
      {/* TODO: Add Actions (Votes, Comments) */}
      {/* TODO: Add Comments Section */}
    </div>
  );
}
