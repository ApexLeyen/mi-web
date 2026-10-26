import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import MarkdownRenderer from "@/components/MarkdownRenderer/MarkdownRenderer";
import PostInteractions from "@/components/Blog/PostInteractions";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    return {
      title: "Artículo no encontrado — Muñeco Tecnology",
      description: "El artículo solicitado no existe o fue eliminado.",
    };
  }

  return {
    title: `${post.title} — Muñeco Tecnology`,
    description: post.excerpt || `Lee ${post.title} en el blog de Muñeco Tecnology.`,
    authors: [{ name: "Muñeco Tecnology" }],
    category: post.tag || "Tecnología",
    openGraph: {
      title: `${post.title} — Muñeco Tecnology`,
      description: post.excerpt || `Tutorial técnico y guía en Muñeco Tecnology.`,
      url: `https://munecotecnology.uk/blog/${post.id}`,
      type: "article",
      images: post.emoji.startsWith("http") ? [{ url: post.emoji }] : [{ url: "https://munecotecnology.uk/logo.png" }],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      comments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!post) {
    notFound();
  }

  const isCustomImage =
    post.emoji.startsWith("http") ||
    post.emoji.startsWith("/") ||
    post.emoji.startsWith("data:image");

  return (
    <div style={{ paddingTop: "100px", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <div className="container" style={{ maxWidth: "840px" }}>
        <Link
          href="/blog"
          style={{
            color: "var(--accent-primary)",
            textDecoration: "none",
            display: "inline-block",
            marginBottom: "24px",
            fontWeight: 500,
          }}
        >
          ← Volver al blog
        </Link>

        <article>
          <header style={{ marginBottom: "36px" }}>
            {isCustomImage ? (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxHeight: "440px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  marginBottom: "24px",
                  background: "var(--bg-secondary)",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img
                  src={post.emoji}
                  alt={post.title}
                  style={{ width: "100%", maxHeight: "440px", objectFit: "cover" }}
                />
              </div>
            ) : (
              <div style={{ fontSize: "4rem", marginBottom: "20px" }}>{post.emoji}</div>
            )}

            <h1
              style={{
                fontSize: "2.35rem",
                lineHeight: 1.25,
                marginBottom: "16px",
                color: "var(--text-primary)",
                fontWeight: 800,
              }}
            >
              {post.title}
            </h1>

            <div
              style={{
                display: "flex",
                gap: "14px",
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  background: "var(--accent-primary)",
                  color: "#fff",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                }}
              >
                {post.tag}
              </span>
              <span>⏱ {post.readTime}</span>
              <span>📅 {new Date(post.createdAt).toLocaleDateString("es-ES")}</span>
              <span>✍️ Por Muñeco Tecnology</span>
            </div>
          </header>

          {/* Full Server-rendered content for Google AdSense & SEO */}
          <div style={{ marginBottom: "40px" }}>
            <MarkdownRenderer content={post.content} />
          </div>

          {/* Interactive like button, social sharing and comments */}
          <PostInteractions
            postId={post.id}
            postTitle={post.title}
            postExcerpt={post.excerpt}
            postTag={post.tag}
            initialLikes={post.likes}
            initialComments={post.comments.map((c) => ({
              id: c.id,
              author: c.author,
              content: c.content,
              createdAt: c.createdAt.toISOString(),
            }))}
          />
        </article>
      </div>
    </div>
  );
}
