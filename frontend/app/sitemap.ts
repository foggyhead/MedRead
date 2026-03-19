import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://medread.in";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${base}/scan`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/cabinet`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];
}
