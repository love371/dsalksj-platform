export default async function sitemap() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts`,
      { cache: "no-store" }
    );

    const posts = await res.json();

    const postUrls = Array.isArray(posts)
      ? posts.map((post) => ({
          url: `https://dsalksj.in/post/${post.slug}`,
          lastModified: new Date(),
        }))
      : [];

    return [
      {
        url: "https://dsalksj.in",
        lastModified: new Date(),
      },
      ...postUrls,
    ];
  } catch (error) {
    return [
      {
        url: "https://dsalksj.in",
        lastModified: new Date(),
      },
    ];
  }
}