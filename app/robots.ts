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
    sitemap: "https://my-web.apexleyen2515.workers.dev/sitemap.xml",
    host: "https://my-web.apexleyen2515.workers.dev",
  };
}
