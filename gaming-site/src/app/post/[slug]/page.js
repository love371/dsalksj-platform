import PostClient from "./PostClient";

export async function generateMetadata({ params }) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/slug/${params.slug}`,
      { cache: "no-store" }
    );

    const post = await res.json();

    return {
      title: post.title || "Post - dsalksj",
      description: post.description || "Gaming content on dsalksj",
      openGraph: {
        title: post.title || "Post - dsalksj",
        description: post.description || "Gaming content on dsalksj",
        images: [post.bannerImage || post.image].filter(Boolean)
      }
    };
  } catch {
    return {
      title: "Post - dsalksj",
      description: "Gaming content on dsalksj"
    };
  }
}

export default function Page() {
  return <PostClient />;
}