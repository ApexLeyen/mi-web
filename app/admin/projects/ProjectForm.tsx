"use client";

import { useState, useRef } from "react";
import { Sparkles, ExternalLink, GitBranch, Palette, Upload } from "lucide-react";

interface ProjectFormProps {
  createAction: (formData: FormData) => Promise<void>;
}

const colorPresets = [
  "#7c3aed", // Violet
  "#06b6d4", // Cyan
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#ec4899", // Pink
  "#3b82f6", // Blue
];

export default function ProjectForm({ createAction }: ProjectFormProps) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("🚀");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("Next.js, TypeScript, Tailwind");
  const [url, setUrl] = useState("");
  const [github, setGithub] = useState("");
  const [color, setColor] = useState("#7c3aed");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isImageUrl = (val: string) => {
    return val && (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("/") || val.startsWith("data:image"));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const max = 800;
        if (width > max || height > max) {
          if (width > height) {
            height = Math.round((height * max) / width);
            width = max;
          } else {
            width = Math.round((width * max) / height);
            height = max;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
        setImage(dataUrl);
        setUploadingImage(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
  };

  return (
    <div className="admin-form-grid">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />

      {/* Formulario de Proyecto */}
      <form
        action={createAction}
        onSubmit={handleSubmit}
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "8px" }}>
            <Sparkles size={18} color="var(--accent-primary)" /> Añadir Nuevo Proyecto
          </h3>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Se mostrará en tu portafolio</span>
        </div>

        {/* Título */}
        <div>
          <label style={labelStyle}>Título del Proyecto</label>
          <input
            type="text"
            name="title"
            placeholder="Ej. Sistema de Facturación Cloud"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        {/* Imagen o Emoji de Portada */}
        <div>
          <label style={labelStyle}>
            Imagen de Portada o Emoji <span style={{ color: "var(--text-muted)", fontWeight: "normal" }}>(Emoji, URL o Subir Imagen)</span>
          </label>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input
              type="text"
              name="image"
              placeholder="Pega Emoji, URL o sube una imagen..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-card)",
                color: "var(--accent-primary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.82rem",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
              title="Subir foto desde tu dispositivo"
            >
              <Upload size={14} /> {uploadingImage ? "Subiendo..." : "Subir Foto"}
            </button>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: `linear-gradient(135deg, ${color}22, ${color}44)`,
                border: `1px solid ${color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                flexShrink: 0,
                fontSize: "1.5rem",
              }}
            >
              {isImageUrl(image) ? (
                <img src={image} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { (e.target as any).src = "/logo.png"; }} />
              ) : (
                image || "💼"
              )}
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label style={labelStyle}>Descripción del Proyecto</label>
          <textarea
            name="description"
            placeholder="Explica qué problema resuelve este proyecto y qué tecnologías utilizaste..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ ...inputStyle, minHeight: "85px" }}
          />
        </div>

        {/* Tags */}
        <div>
          <label style={labelStyle}>
            Tecnologías y Etiquetas <span style={{ color: "var(--text-muted)", fontWeight: "normal" }}>(Separadas por coma)</span>
          </label>
          <input
            type="text"
            name="tags"
            placeholder="React, Next.js, Node.js, Prisma, PostgreSQL"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            required
            style={inputStyle}
          />
          {tags && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
              {tags.split(",").map((t, idx) => t.trim() ? (
                <span
                  key={idx}
                  style={{
                    padding: "3px 10px",
                    borderRadius: "50px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    color: "var(--accent-primary)",
                  }}
                >
                  {t.trim()}
                </span>
              ) : null)}
            </div>
          )}
        </div>

        {/* Color temático con selector interactivo */}
        <div>
          <label style={labelStyle}>
            <Palette size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
            Color del Proyecto
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            {colorPresets.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: c,
                  border: color === c ? "3px solid white" : "2px solid transparent",
                  cursor: "pointer",
                  boxShadow: color === c ? `0 0 10px ${c}` : "none",
                  transition: "transform 0.15s",
                  transform: color === c ? "scale(1.15)" : "scale(1)",
                }}
              />
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginLeft: "6px" }}>
              <input
                type="color"
                name="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{ width: "36px", height: "34px", border: "none", cursor: "pointer", borderRadius: "6px", background: "transparent" }}
              />
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontFamily: "monospace" }}>{color}</span>
            </div>
          </div>
        </div>

        {/* URLs */}
        <div className="admin-form-row-2">
          <div>
            <label style={labelStyle}>URL del Proyecto / Demo</label>
            <input
              type="url"
              name="url"
              placeholder="https://mi-proyecto.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Repositorio GitHub</label>
            <input
              type="url"
              name="github"
              placeholder="https://github.com/usuario/repo"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
          style={{ padding: "14px", fontSize: "1rem", marginTop: "6px", width: "100%", justifyContent: "center" }}
        >
          {isSubmitting ? "Publicando proyecto..." : "💼 Publicar Proyecto"}
        </button>
      </form>

      {/* Live Preview Card */}
      <div style={{ position: "sticky", top: "110px" }}>
        <h4 style={{ margin: "0 0 12px 0", fontSize: "0.9rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
          👁️ Vista Previa en Vivo
        </h4>
        <div
          className="glass"
          style={{
            borderRadius: "16px",
            overflow: "hidden",
            background: "var(--bg-card)",
            border: "1px solid var(--border-glass)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
          }}
        >
          <div
            style={{
              position: "relative",
              height: "130px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${color}22, ${color}44)`,
              overflow: "hidden",
            }}
          >
            {isImageUrl(image) ? (
              <img src={image} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { (e.target as any).src = "/logo.png"; }} />
            ) : (
              <span style={{ fontSize: "3.5rem" }}>{image || "💼"}</span>
            )}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "3px", background: color }} />
          </div>

          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <h3 style={{ margin: 0, fontSize: "1.15rem" }}>{title || "Título del Proyecto"}</h3>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              {description || "Aquí se visualizará la descripción de tu proyecto en tiempo real."}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "4px" }}>
              {(tags || "Tag1, Tag2").split(",").map((t, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: "3px 8px",
                    borderRadius: "50px",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    background: "var(--bg-secondary)",
                    color: "var(--accent-primary)",
                  }}
                >
                  {t.trim()}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <div style={{ flex: 1, padding: "8px", background: "var(--accent-primary)", borderRadius: "8px", fontSize: "0.8rem", textAlign: "center", color: "white", fontWeight: 600 }}>
                <ExternalLink size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "3px" }} /> Ver demo
              </div>
              <div style={{ flex: 1, padding: "8px", background: "var(--bg-secondary)", borderRadius: "8px", fontSize: "0.8rem", textAlign: "center", color: "var(--text-primary)", fontWeight: 500 }}>
                <GitBranch size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "3px" }} /> GitHub
              </div>
            </div>
          </div>
        </div>
      </div>
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
