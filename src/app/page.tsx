import HomeClient from "./HomeClient";

export type BlogPost = { title: string; url: string; date: string };

// Build-time fetch (Jamstack pattern): runs once during `next build`,
// result gets baked into the static HTML. No client-side network call,
// no loading state needed. Refresh by re-running the build.
async function getRecentPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(
      "https://www.aitipseveryday.com/feeds/posts/default?alt=json&max-results=3",
      { cache: "force-cache" }
    );
    if (!res.ok) return [];

    const data = await res.json();
    const entries: Array<{
      title?: { $t?: string };
      published?: { $t?: string };
      link?: Array<{ rel?: string; href?: string }>;
    }> = data?.feed?.entry ?? [];

    return entries.map((entry) => {
      const linkObj = (entry.link ?? []).find((l) => l.rel === "alternate");
      const rawDate = entry.published?.$t ?? "";
      const date = rawDate
        ? new Date(rawDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "";

      return {
        title: entry.title?.$t ?? "Untitled post",
        url: linkObj?.href ?? "https://aitipseveryday.com",
        date,
      };
    });
  } catch {
    // Build shouldn't fail because the blog is briefly unreachable —
    // just render the section with an empty list.
    return [];
  }
}

export default async function Page() {
  const posts = await getRecentPosts();
  return <HomeClient posts={posts} />;
}
