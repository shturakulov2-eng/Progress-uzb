import type { Metadata } from "next";

import { BlogPageClient } from "@/components/shared/blog-page-client";

export const metadata: Metadata = {
  title: "Marketing blog — SMM va sotuv | Samarqand",
  description:
    "Samarqanddagi marketing agentligidan SMM, sotuv va brend o‘sishi bo‘yicha maqolalar. Progress.uzb blogi.",
  keywords: [
    "SMM Samarqand",
    "marketing blog",
    "sotuv",
    "brending",
    "Progress.uzb",
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Marketing blog — SMM va sotuv | Samarqand",
    description:
      "SMM, marketing va sotuv haqida amaliy maqolalar. Progress.uzb — Samarqand.",
    url: "/blog",
  },
};

export default function BlogPage() {
  return <BlogPageClient />;
}
