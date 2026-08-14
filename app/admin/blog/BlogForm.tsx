"use client";

import { useState, useRef } from "react";
import { Sparkles, Bold, Italic, Heading2, Heading3, Code, List, Quote, Link2, Image as ImageIcon, Eye, Edit3, Clock, Tag, Heart, MessageSquare } from "lucide-react";

interface BlogFormProps {
  createAction: (formData: FormData) => Promise<void>;
}

export default function BlogForm({ createAction }: BlogFormProps) {
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("⚡");
  const [tag, setTag] = useState("Next.js");
  const [readTime, setReadTime] = useState("5 min");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const isImageUrl = (val: string) => {
    return val && (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("/") || val.startsWith("data:image"));
  };

  // Insert markdown helpers
  const insertFormat = (before: string, after: string = "", defaultText: string = "texto") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || defaultText;
    const replacement = before + selectedText + after;

    const newValue = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    setContent(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 10);
  };

  // Auto calculate reading time
  const handleContentChange = (val: string) => {
    setContent(val);
    const words = val.trim().split(/\s+/).filter(Boolean).length;
    const mins = Math.max(1, Math.ceil(words / 180));
    setReadTime(`${mins} min`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Selector de pestañas */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "8px" }}>
          <Sparkles size={18} color="var(--accent-primary)" /> Redactar y Publicar Artículo
        </h3>

        <div style={{ display: "flex", background: "var(--bg-secondary)", padding: "4px", borderRadius: "10px", border: "1px solid var(--border-glass)" }}>
          <button
            type="button"
            onClick={() => setActiveTab("editor")}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              border: "none",
              background: activeTab === "editor" ? "var(--accent-primary)" : "transparent",
              color: activeTab === "editor" ? "white" : "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Edit3 size={14} /> Editor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              border: "none",
              background: activeTab === "preview" ? "var(--accent-primary)" : "transparent",
              color: activeTab === "preview" ? "white" : "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Eye size={14} /> Vista Previa Completa
          </button>
        </div>
      </div>

      {activeTab === "editor" ? (
        <form
          action={createAction}
          onSubmit={() => setIsSubmitting(true)}
          style={{
            background: "var(--bg-secondary)",
            padding: "24px",
            borderRadius: "16px",
            border: "1px solid var(--border-glass)",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          {/* Título */}
          <div>
            <label style={labelStyle}>Título del Artículo</label>
            <input
              type="text"
              name="title"
              placeholder="Ej. Cómo implementar Inteligencia Artificial en tus Apps"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ ...inputStyle, fontSize: "1.1rem", fontWeight: 600 }}
            />
          </div>

          {/* Emoji / Portada + Categoría + Tiempo */}
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>
                Portada o Emoji <span style={{ color: "var(--text-muted)", fontWeight: "normal" }}>(Emoji o URL de imagen)</span>
              </label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="text"
                  name="emoji"
                  placeholder="⚡ o https://images.unsplash.com/..."
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  required
                  style={{ ...inputStyle, flex: 1 }}
                />
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "8px",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    flexShrink: 0,
                    fontSize: "1.5rem",
                  }}
                >
                  {isImageUrl(emoji) ? (
                    <img src={emoji} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { (e.target as any).src = "/logo.png"; }} />
                  ) : (
                    emoji || "📝"
                  )}
                </div>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Categoría / Etiqueta</label>
              <input
                type="text"
                name="tag"
                placeholder="Ej. Android, IA, Web"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Tiempo de Lectura</label>
              <input
                type="text"
                name="readTime"
                placeholder="5 min"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* Extracto */}
          <div>
            <label style={labelStyle}>Resumen / Extracto breve (se muestra en las tarjetas de la web)</label>
            <textarea
              name="excerpt"
              placeholder="Un resumen conciso de 2 líneas que enganche a tus lectores..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              required
              style={{ ...inputStyle, minHeight: "65px" }}
            />
          </div>

          {/* Barra de Formato Rápido */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label style={{ ...labelStyle, margin: 0 }}>Contenido del Artículo (con soporte Markdown y texto enriquecido)</label>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                {content.trim().split(/\s+/).filter(Boolean).length} palabras
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "4px",
                padding: "8px",
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderBottom: "none",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
              }}
            >
              <button type="button" onClick={() => insertFormat("**", "**", "texto en negrita")} style={toolbarBtnStyle} title="Negrita">
                <Bold size={15} />
              </button>
              <button type="button" onClick={() => insertFormat("*", "*", "texto en cursiva")} style={toolbarBtnStyle} title="Cursiva">
                <Italic size={15} />
              </button>
              <div style={dividerStyle} />
              <button type="button" onClick={() => insertFormat("\n## ", "\n", "Título de sección")} style={toolbarBtnStyle} title="Título H2">
                <Heading2 size={15} />
              </button>
              <button type="button" onClick={() => insertFormat("\n### ", "\n", "Subtítulo")} style={toolbarBtnStyle} title="Subtítulo H3">
                <Heading3 size={15} />
              </button>
              <div style={dividerStyle} />
              <button type="button" onClick={() => insertFormat("\n- ", "\n", "Elemento de lista")} style={toolbarBtnStyle} title="Lista con viñetas">
                <List size={15} />
              </button>
              <button type="button" onClick={() => insertFormat("\n> ", "\n", "Cita inspiradora o nota importante")} style={toolbarBtnStyle} title="Cita">
                <Quote size={15} />
              </button>
              <button type="button" onClick={() => insertFormat("```javascript\n", "\n```", "// Tu código aquí")} style={toolbarBtnStyle} title="Bloque de código">
                <Code size={15} />
              </button>
              <div style={dividerStyle} />
              <button type="button" onClick={() => insertFormat("[", "](https://enlace.com)", "Texto del enlace")} style={toolbarBtnStyle} title="Enlace">
                <Link2 size={15} />
              </button>
              <button type="button" onClick={() => insertFormat("![Descripción de imagen](", ")", "https://url-de-tu-imagen.com")} style={toolbarBtnStyle} title="Insertar Imagen">
                <ImageIcon size={15} />
              </button>
            </div>

            <textarea
              ref={textareaRef}
              name="content"
              placeholder="Escribe aquí tu artículo completo... Puedes estructurarlo con párrafos, títulos (##), listas y código."
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              required
              style={{
                ...inputStyle,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                minHeight: "280px",
                lineHeight: 1.7,
                fontFamily: "inherit",
                fontSize: "0.95rem",
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{ padding: "14px", fontSize: "1rem", marginTop: "6px", width: "100%", justifyContent: "center" }}
          >
            {isSubmitting ? "Publicando artículo..." : "📝 Publicar Artículo en el Blog"}
          </button>
        </form>
      ) : (
        /* Pestaña de Vista Previa */
        <div
          className="glass"
          style={{
            padding: "36px",
            borderRadius: "16px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-glass)",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* Header del post */}
          <div>
            {isImageUrl(emoji) ? (
              <div style={{ height: "240px", width: "100%", borderRadius: "12px", overflow: "hidden", marginBottom: "20px" }}>
                <img src={emoji} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { (e.target as any).src = "/logo.png"; }} />
              </div>
            ) : (
              <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>{emoji || "📝"}</div>
            )}

            <h1 style={{ fontSize: "2.2rem", margin: "0 0 16px 0", lineHeight: 1.2 }}>
              {title || "Título del Artículo en Vista Previa"}
            </h1>

            <div style={{ display: "flex", gap: "12px", alignItems: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
              <span style={{ background: "var(--accent-primary)", color: "white", padding: "3px 12px", borderRadius: "50px", fontWeight: 600 }}>
                {tag || "Tecnología"}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Clock size={14} /> {readTime || "5 min"}</span>
              <span>📅 {new Date().toLocaleDateString("es-ES")}</span>
            </div>
          </div>

          {/* Extracto destacado */}
          {excerpt && (
            <div style={{ padding: "16px 20px", background: "var(--bg-secondary)", borderRadius: "10px", borderLeft: "4px solid var(--accent-primary)", fontSize: "1rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
              {excerpt}
            </div>
          )}

          {/* Contenido formateado */}
          <div style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>
            {content || "Escribe contenido en el editor para previsualizarlo aquí..."}
          </div>

          {/* Interacciones simuladas */}
          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "20px", display: "flex", gap: "16px", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--accent-primary)", fontWeight: 600 }}>
              <Heart size={18} fill="currentColor" /> 0 Likes
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)" }}>
              <MessageSquare size={18} /> 0 Comentarios
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "var(--text-primary)",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid var(--border-color)",
  background: "var(--bg-card)",
  color: "var(--text-primary)",
  fontFamily: "inherit",
  fontSize: "0.9rem",
  outline: "none",
};

const toolbarBtnStyle: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: "6px",
  border: "1px solid transparent",
  background: "transparent",
  color: "var(--text-secondary)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.15s",
};

const dividerStyle: React.CSSProperties = {
  width: "1px",
  height: "20px",
  background: "var(--border-color)",
  margin: "0 4px",
  alignSelf: "center",
};
