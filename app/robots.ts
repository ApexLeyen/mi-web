import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: "https://munecotecnology.workers.dev/sitemap.xml",
    host: "https://munecotecnology.workers.dev",
  };
}
