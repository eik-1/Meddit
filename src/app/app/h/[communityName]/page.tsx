import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import {
  getCommunityByName,
  getPostViewsByCommunityName,
} from "@/server/queries";
import PostCard from "@/components/PostCard";

type Props = {
  params: {
    communityName: string;
  };
};

export default async function CommunityPage({ params }: Props) {
  const { communityName } = params;

  const [community, posts] = await Promise.all([
    getCommunityByName(communityName),
    getPostViewsByCommunityName(communityName),
  ]);

  if (!community) {
    notFound();
  }

  const communityPosts = posts ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Community Header */}
      <div className="mb-6 flex items-center space-x-4 border-b pb-4">
        {community.imageUrl && (
          <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600">
            <Image
              src={community.imageUrl}
              alt={`${community.name} logo`}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold">h/{community.name}</h1>
          {/* Optional: Add tagline or member count here later */}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-8 md:grid-cols-3">
        {/* Main Content Area (Posts) */}
        <div className="md:col-span-2">
          <div className="mb-4">
            <Link href={`/app/create-post?communityName=${community.name}`}>
              <Button className="w-full md:w-auto">Create Post</Button>
            </Link>
          </div>

          {/* Post Feed */}
          <div className="space-y-6">
            {communityPosts.length === 0 ? (
              <div className="mt-10 rounded border bg-white p-6 text-center text-gray-500 shadow-sm">
                <p>It looks a bit empty here...</p>
                <p>Be the first one to post in h/{community.name}!</p>
              </div>
            ) : (
              communityPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar (Community Info) */}
        <aside className="hidden md:block md:col-span-1">
          <div className="sticky top-20 rounded border bg-white p-4 shadow-sm">
            <h2 className="mb-3 border-b pb-2 text-base font-semibold">
              About h/{community.name}
            </h2>
            <p className="text-sm text-gray-700">{community.description}</p>
            <div className="mt-4 border-t pt-3 text-xs text-gray-500">
              {/* TODO: Add created date */}
              <p>Created {/* Add community creation date here */}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
