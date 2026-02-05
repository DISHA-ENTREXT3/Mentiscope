import { MetadataRoute } from 'next'
import { blogPosts, BlogPost } from "@/data/blog-posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mentiscope.vercel.app";

  const blogs = blogPosts.map((post: BlogPost) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const routes = ["", "/blog", "/pricing", "/login", "/signup", "/privacy", "/terms", "/cookies"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return [...routes, ...blogs];
}
