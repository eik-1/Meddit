import CreatePostForm from "@/components/CreatePostForm";
import { getCommunities } from "@/server/queries";
import { amiri } from "@/fonts/fonts";

type CreatePostPageProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function CreatePostPage({
  searchParams,
}: CreatePostPageProps) {
  const communitiesData = await getCommunities();
  const communitiesList = communitiesData ?? [];

  const communityName = searchParams?.communityName as string;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1
        className={`text-3xl font-extrabold mb-6 border-b pb-3 ${amiri.className}`}
      >
        Create a New Post
      </h1>
      <CreatePostForm
        communities={communitiesList}
        communityName={communityName}
      />
    </div>
  );
}
