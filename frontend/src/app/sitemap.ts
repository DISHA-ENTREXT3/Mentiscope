import { blogPosts, BlogPost } from "@/data/blog-posts";

export default async function sitemap() {
  const baseUrl = "https://mentiscope.vercel.app";

  const blogs = blogPosts.map((post: BlogPost) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  const routes = ["", "/blog", "/login", "/signup", "/dashboard", "/privacy", "/terms", "/cookies"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  return [...routes, ...blogs];
}
