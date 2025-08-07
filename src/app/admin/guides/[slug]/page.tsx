// src/app/admin/guides/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminLayout from "@/admin/components/layout/AdminLayout";
import GuideContent from "@/admin/components/guides/GuideContent";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface GuidePageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getGuideContent(slug: string) {
  try {
    const guidesDirectory = path.join(process.cwd(), "src/content/guides");
    const filePath = path.join(guidesDirectory, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);

    return {
      frontmatter: data,
      content,
      slug,
    };
  } catch (error) {
    console.error("Error reading guide:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideContent(slug);

  if (!guide) {
    return {
      title: "Guide Not Found",
    };
  }

  return {
    title: `${guide.frontmatter.title || slug} - Dev Guide`,
    description: guide.frontmatter.description || "Backend development guide",
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = await getGuideContent(slug);

  if (!guide) {
    notFound();
  }

  return (
    <AdminLayout title={`${guide.frontmatter.title || guide.slug} Guide`}>
      <GuideContent guide={guide} />
    </AdminLayout>
  );
}
