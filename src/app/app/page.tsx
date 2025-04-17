import PostCard from "@/components/PostCard";
import { getLatestPosts } from "@/server/queries";
import { amiri } from "@/fonts/fonts";

export default async function AppPage() {
  // Fetch the latest posts from all communities
  const posts = await getLatestPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1
        className={`text-5xl font-bold mb-6 text-gray-900 dark:text-white ${amiri.className}`}
      >
        Latest Posts
      </h1>
      {posts && posts.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No posts yet. Be the first to create one!
        </p>
      ) : (
        <div className="space-y-6">
          {posts && posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  );
}
