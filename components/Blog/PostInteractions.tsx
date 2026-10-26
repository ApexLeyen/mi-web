"use client";

import { useState } from "react";
import ShareButtons from "@/components/ShareButtons/ShareButtons";
import { Heart } from "lucide-react";

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string | Date;
}

interface PostInteractionsProps {
  postId: string;
  postTitle: string;
  postExcerpt?: string;
  postTag?: string;
  initialLikes: number;
  initialComments: Comment[];
}

export default function PostInteractions({
  postId,
  postTitle,
  postExcerpt,
  postTag,
  initialLikes,
  initialComments,
}: PostInteractionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState({ author: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLike = async () => {
    const storageKey = `liked-${postId}`;
    const currentLikesStr = localStorage.getItem(storageKey);
    const currentLikes = currentLikesStr ? parseInt(currentLikesStr, 10) : 0;

    if (currentLikes >= 2) {
      alert('¡Ya diste tus dos "Me Gusta" en este artículo! Gracias por tu apoyo. ❤️');
      return;
    }

    localStorage.setItem(storageKey, (currentLikes + 1).toString());
    setLikes((prev) => prev + 1);

    try {
      await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    } catch (error) {
      console.error("Error liking post:", error);
      setLikes((prev) => prev - 1);
      localStorage.setItem(storageKey, currentLikes.toString());
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.author.trim() || !newComment.content.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      });

      if (res.ok) {
        const addedComment = await res.json();
        setComments([addedComment, ...comments]);
        setNewComment({ author: "", content: "" });
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Social Share & Like Bar */}
      <div style={{ margin: "40px 0", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={handleLike}
            style={{
              background: "var(--accent-gradient)",
              border: "none",
              boxShadow: "0 6px 20px var(--accent-glow)",
              padding: "14px 34px",
              borderRadius: "50px",
              fontSize: "1.05rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#ffffff",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Heart size={20} fill="white" />
            <span>Me Gusta</span>
            <span
              style={{
                background: "rgba(255,255,255,0.25)",
                padding: "2px 10px",
                borderRadius: "20px",
                fontSize: "0.9rem",
              }}
            >
              {likes}
            </span>
          </button>
        </div>

        {/* Share Buttons */}
        <ShareButtons
          title={`${postTitle} — Muñeco Tecnology`}
          description={postExcerpt || `Lee este interesante artículo sobre ${postTag || "tecnología"} en Muñeco Tecnology.`}
          label="📢 ¿Te gustó este artículo? ¡Compártelo con un clic!"
        />
      </div>

      {/* Comments Section */}
      <section style={{ borderTop: "1px solid var(--border-glass)", paddingTop: "40px", paddingBottom: "80px" }}>
        <h3 style={{ marginBottom: "20px" }}>Comentarios ({comments.length})</h3>

        <form
          onSubmit={handleCommentSubmit}
          style={{ background: "var(--bg-secondary)", padding: "24px", borderRadius: "12px", marginBottom: "40px" }}
        >
          <h4 style={{ margin: "0 0 15px 0" }}>Deja un comentario</h4>
          <input
            type="text"
            placeholder="Tu nombre"
            value={newComment.author}
            onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
            required
            style={inputStyle}
          />
          <textarea
            placeholder="¿Qué te pareció el artículo?"
            value={newComment.content}
            onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
            required
            style={{ ...inputStyle, minHeight: "100px", marginTop: "12px" }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{ marginTop: "12px", opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? "Enviando..." : "Publicar comentario"}
          </button>
        </form>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {comments.map((comment) => (
            <div key={comment.id} className="glass" style={{ padding: "20px", borderRadius: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <strong style={{ color: "var(--accent-primary)" }}>{comment.author}</strong>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  {new Date(comment.createdAt).toLocaleDateString("es-ES")}
                </span>
              </div>
              <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.5 }}>{comment.content}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid var(--border-color)",
  background: "var(--bg-card)",
  color: "var(--text-primary)",
  fontFamily: "inherit",
  outline: "none",
};
