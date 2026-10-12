import type { MetadataRoute } from "next";

const baseUrl = "https://www.supaping.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl },
    { url: `${baseUrl}/blog/why-does-supabase-pause` },
    { url: `${baseUrl}/blog/keep-supabase-project-active` },
    { url: `${baseUrl}/blog/supabase-keep-alive-cron` },
    { url: `${baseUrl}/blog/supabase-keep-alive-methods` },
    { url: `${baseUrl}/blog` },
    { url: `${baseUrl}/privacy` },
    { url: `${baseUrl}/terms` },
  ];
}