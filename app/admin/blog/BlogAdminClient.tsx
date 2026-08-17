"use client";

import { useState } from "react";
import BlogForm from "./BlogForm";
import { Trash2, Heart, MessageSquare, FileText, Edit3, ExternalLink } from "lucide-react";
import Link from "next/link";

interface BlogAdminClientProps {
  posts: any[];
  createAction: (formData: FormData) => Promise<void>;
  updateAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
}

export default function BlogAdminClient({ posts, createAction, updateAction, deleteAction }: BlogAdminClientProps) {
  const [editingPost, setEditingPost] = useState<any | null>(null);

  const handleEditClick = (post: any) => {
    setEditingPost(post);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  const isImageUrl = (val: string) => {
    return val && (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("/") || val.startsWith("data:image"));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
      {/* Formulario de Crear / Editar */}
      <BlogForm
        key={editingPost ? editingPost.id : "new"}
        createAction={createAction}
        updateAction={updateAction}
        editingPost={editingPost}
        onCancelEdit={handleCancelEdit}
      />

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
                  border: editingPost?.id === post.id ? "2px solid var(--accent-primary)" : "1px solid var(--border-glass)",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  flexWrap: "wrap",
                  transition: "border 0.2s",
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

                <div style={{ flex: "1 1 220px", minWidth: 0 }}>
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
                      <MessageSquare size={12} /> {post._count?.comments || 0}
                    </span>
                    <span>⏱ {post.readTime}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString("es-ES")}</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginLeft: "auto" }}>
                  <Link
                    href={`/blog/${post.id}`}
                    target="_blank"
                    className="btn btn-secondary"
                    style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                    title="Ver en la web"
                  >
                    <ExternalLink size={13} /> Ver
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleEditClick(post)}
                    style={{
                      background: "rgba(124, 58, 237, 0.15)",
                      color: "var(--accent-primary)",
                      border: "1px solid rgba(124, 58, 237, 0.3)",
                      padding: "6px 14px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Edit3 size={13} /> Editar
                  </button>

                  <form action={deleteAction}>
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
                      }}
                    >
                      <Trash2 size={13} /> Eliminar
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
