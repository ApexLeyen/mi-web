"use client";

import { useState, useRef } from "react";
import { Sparkles, ExternalLink, GitBranch, Palette, Upload } from "lucide-react";
import SmartDownloadButton from "@/components/Portfolio/SmartDownloadButton";

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
  const [urlMode, setUrlMode] = useState<"single" | "multi">("single");
  const [singleUrl, setSingleUrl] = useState("");
  const [urlWindows, setUrlWindows] = useState("");
  const [urlMacSilicon, setUrlMacSilicon] = useState("");
  const [urlMacIntel, setUrlMacIntel] = useState("");
  const [urlAndroid, setUrlAndroid] = useState("");
  const [github, setGithub] = useState("");
  const [color, setColor] = useState("#7c3aed");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const computedUrl = (() => {
    if (urlMode === "single") {
      return singleUrl.trim();
    }
    const multi: Record<string, string> = {};
    if (urlWindows.trim()) multi.windows = urlWindows.trim();
    if (urlMacSilicon.trim()) multi.macSilicon = urlMacSilicon.trim();
    if (urlMacIntel.trim()) multi.macIntel = urlMacIntel.trim();
    if (urlAndroid.trim()) multi.android = urlAndroid.trim();
    if (singleUrl.trim()) multi.default = singleUrl.trim();
    return Object.keys(multi).length > 0 ? JSON.stringify(multi) : "";
  })();

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

        {/* Hidden final url input */}
        <input type="hidden" name="url" value={computedUrl} />

        {/* Selector de modo de descarga */}
        <div>
          <label style={labelStyle}>Opciones de Descarga y Plataformas</label>
          <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
            <button
              type="button"
              onClick={() => setUrlMode("single")}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border-glass)",
                background: urlMode === "single" ? "var(--accent-primary)" : "var(--bg-card)",
                color: "white",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              🔗 Enlace Único (Web / Demo)
            </button>
            <button
              type="button"
              onClick={() => setUrlMode("multi")}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border-glass)",
                background: urlMode === "multi" ? "var(--accent-primary)" : "var(--bg-card)",
                color: "white",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              🖥️ Multi-Plataforma (Windows / Mac M1-M5 / Intel / Android)
            </button>
          </div>

          {urlMode === "single" ? (
            <div>
              <input
                type="url"
                placeholder="https://drive.google.com/... o https://mi-demo.com"
                value={singleUrl}
                onChange={(e) => setSingleUrl(e.target.value)}
                required={urlMode === "single"}
                style={inputStyle}
              />
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                Enlace directo al demo web o archivo de descarga único.
              </span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", background: "var(--bg-card)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
              <div style={{ fontSize: "0.82rem", color: "var(--accent-primary)", fontWeight: 600 }}>
                💡 Rellena solo las plataformas que tengas disponibles (pueden ser de Drive, MediaFire, Mega, etc.):
              </div>

              <div>
                <label style={{ ...labelStyle, fontSize: "0.8rem" }}>🪟 Enlace Windows (.exe / .zip)</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/.../MiApp-Windows.zip"
                  value={urlWindows}
                  onChange={(e) => setUrlWindows(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ ...labelStyle, fontSize: "0.8rem" }}>🍎 Mac Apple Silicon M1-M5 (.dmg)</label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/.../MiApp-Mac-AppleSilicon.dmg"
                    value={urlMacSilicon}
                    onChange={(e) => setUrlMacSilicon(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ ...labelStyle, fontSize: "0.8rem" }}>🍏 Mac Intel x64 (.dmg)</label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/.../MiApp-Mac-Intel.dmg"
                    value={urlMacIntel}
                    onChange={(e) => setUrlMacIntel(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ ...labelStyle, fontSize: "0.8rem" }}>🤖 Android (.apk)</label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/.../MiApp.apk"
                    value={urlAndroid}
                    onChange={(e) => setUrlAndroid(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ ...labelStyle, fontSize: "0.8rem" }}>🌐 Demo Web (opcional)</label>
                  <input
                    type="url"
                    placeholder="https://mi-demo.com"
                    value={singleUrl}
                    onChange={(e) => setSingleUrl(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Repositorio GitHub */}
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
              height: "190px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${color}22, ${color}44)`,
              overflow: "hidden",
            }}
          >
            {isImageUrl(image) ? (
              <>
                <img
                  src={image}
                  alt=""
                  aria-hidden="true"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    filter: "blur(14px) opacity(0.35)",
                    transform: "scale(1.2)",
                  }}
                  onError={(e) => { (e.target as any).style.display = "none"; }}
                />
                <img
                  src={image}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    position: "relative",
                    zIndex: 1,
                    padding: "8px",
                  }}
                  onError={(e) => { (e.target as any).src = "/logo.png"; }}
                />
              </>
            ) : (
              <span style={{ fontSize: "3.5rem", zIndex: 1 }}>{image || "💼"}</span>
            )}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "3px", background: color, zIndex: 2 }} />
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

            <div style={{ display: "flex", gap: "8px", marginTop: "8px", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <SmartDownloadButton
                  url={computedUrl || "#"}
                  projectId="preview"
                  projectTitle={title || "Proyecto"}
                />
              </div>
              <div style={{ flex: 1, padding: "9px 12px", background: "var(--bg-secondary)", borderRadius: "8px", fontSize: "0.82rem", textAlign: "center", color: "var(--text-primary)", fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                <GitBranch size={13} /> GitHub
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
