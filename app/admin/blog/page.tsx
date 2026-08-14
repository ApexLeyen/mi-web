import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import BlogForm from "./BlogForm";
import { Trash2, Heart, MessageSquare, FileText } from "lucide-react";

export const dynamic = 'force-dynamic';

async function createPost(formData: FormData) {
  "use server";
  await prisma.post.create({
    data: {
      title: formData.get("title") as string,
      excerpt: formData.get("excerpt") as string,
      content: formData.get("content") as string,
      tag: formData.get("tag") as string,
      emoji: formData.get("emoji") as string,
      readTime: formData.get("readTime") as string,
    },
  });
  revalidatePath("/admin/blog");
  revalidatePath("/");
  revalidatePath("/blog");
}

async function deletePost(formData: FormData) {
  "use server";
  await prisma.post.delete({ where: { id: formData.get("id") as string } });
  revalidatePath("/admin/blog");
  revalidatePath("/");
  revalidatePath("/blog");
}

export default async function AdminBlog() {
  let posts: any[] = [];
  try {
    posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { comments: true } } }
    });
  } catch (e) {
    console.error("Error loading posts:", e);
  }

  const isImageUrl = (val: string) => {
    return val && (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("/") || val.startsWith("data:image"));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
      <div>
        <h2 style={{ margin: "0 0 8px 0", fontSize: "1.6rem" }}>✍️ Gestión del Blog</h2>
        <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Redacta artículos con formato enriquecido, imágenes de portada y vista previa completa antes de publicar.
        </p>
      </div>

      {/* Formulario con barra de herramientas y vista previa */}
      <BlogForm createAction={createPost} />

      {/* Listado de artículos publicados */}
      <div style={{ borderTop: "1px solid var(--border-glass)", paddingTop: "32px" }}>
        <h3 style={{ margin: "0 0 20px 0", fontSize: "1.3rem" }}>
          Artículos Publicados ({posts.length})
        </h3>

        {posts.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", background: "var(--bg-secondary)", borderRadius: "12px", color: "var(--text-muted)" }}>
            <FileText size={36} style={{ marginBottom: "12px", opacity: 0.5 }} />
            <p style={{ margin: 0 }}>Aún no has publicado ningún artículo. ¡Redacta el primero arriba!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {posts.map((post) => (
              <div
                key={post.id}
                style={{
                  padding: "18px",
                  background: "var(--bg-secondary)",
                  borderRadius: "12px",
                  border: "1px solid var(--border-glass)",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                {/* Emoji o imagen miniatura */}
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    background: "var(--bg-card)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    flexShrink: 0,
                    fontSize: "2rem",
                  }}
                >
                  {isImageUrl(post.emoji) ? (
                    <img src={post.emoji} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    post.emoji || "📝"
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ margin: 0, fontSize: "1.05rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {post.title}
                  </h4>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "6px", fontSize: "0.8rem", color: "var(--text-muted)", flexWrap: "wrap" }}>
                    <span style={{ background: "rgba(124,58,237,0.15)", color: "var(--accent-primary)", padding: "2px 8px", borderRadius: "50px", fontWeight: 600, fontSize: "0.75rem" }}>
                      {post.tag}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                      <Heart size={12} /> {post.likes}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                      <MessageSquare size={12} /> {post._count.comments}
                    </span>
                    <span>⏱ {post.readTime}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString("es-ES")}</span>
                  </div>
                </div>

                <form action={deletePost}>
                  <input type="hidden" name="id" value={post.id} />
                  <button
                    type="submit"
                    style={{
                      background: "#ef444422",
                      color: "#ef4444",
                      border: "1px solid #ef444444",
                      padding: "6px 14px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      flexShrink: 0,
                    }}
                  >
                    <Trash2 size={13} /> Eliminar
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
