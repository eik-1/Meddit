import { notFound } from "next/navigation";
import { getPostView } from "@/server/queries";
import PostViewClient from "@/components/PostView";

type PostPageProps = {
  params: {
    postId: string;
  };
};

export default async function PostPage({ params }: PostPageProps) {
  const param = await params;
  const postId = parseInt(param.postId, 10);
  if (isNaN(postId)) {
    notFound();
  }

  const post = await getPostView(postId);
  if (!post) {
    notFound();
  }

  return <PostViewClient post={post} />;
}
