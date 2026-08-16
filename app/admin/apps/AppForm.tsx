"use client";

import { useState, useRef } from "react";
import { HardDrive, Cpu, Download, Info, Image as ImageIcon, Sparkles, Upload } from "lucide-react";

interface AppFormProps {
  createAction: (formData: FormData) => Promise<void>;
}

const statusOptions = [
  { value: "available", label: "Disponible", color: "var(--status-available, #10b981)" },
  { value: "beta", label: "Beta", color: "var(--status-beta, #f59e0b)" },
  { value: "soon", label: "Próximamente", color: "var(--status-soon, #6b7280)" },
];

export default function AppForm({ createAction }: AppFormProps) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🚀");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Herramientas");
  const [version, setVersion] = useState("1.0.0");
  const [size, setSize] = useState("15.4 MB");
  const [minRequirements, setMinRequirements] = useState("Android 8.0+");
  const [changelog, setChangelog] = useState("- Versión inicial de lanzamiento\n- Optimización de rendimiento");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [status, setStatus] = useState("available");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isImageUrl = (val: string) => {
    return val && (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("/") || val.startsWith("data:image"));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIcon(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const max = 500;
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
        const dataUrl = canvas.toDataURL("image/png", 0.85);
        setIcon(dataUrl);
        setUploadingIcon(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

      {/* Formulario Principal */}
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
            <Sparkles size={18} color="var(--accent-primary)" /> Añadir Nueva App / APK
          </h3>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Todos los campos son editables</span>
        </div>

        {/* Nombre & Categoría */}
        <div className="admin-form-row-2">
          <div>
            <label style={labelStyle}>Nombre de la Aplicación</label>
            <input
              type="text"
              name="name"
              placeholder="Ej. MT File Explorer Pro"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Categoría</label>
            <input
              type="text"
              name="category"
              placeholder="Ej. Utilidades, Juegos"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
        </div>

        {/* Icono (Emoji o URL o Subir Imagen) */}
        <div>
          <label style={labelStyle}>
            Icono o Imagen de la App <span style={{ color: "var(--text-muted)", fontWeight: "normal" }}>(Emoji, URL o Subir Imagen)</span>
          </label>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input
              type="text"
              name="icon"
              placeholder="Pega Emoji, URL o sube una imagen..."
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
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
              <Upload size={14} /> {uploadingIcon ? "Subiendo..." : "Subir Foto"}
            </button>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
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
              {isImageUrl(icon) ? (
                <img src={icon} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => { (e.target as any).src = "/logo.png"; }} />
              ) : (
                icon || "📱"
              )}
            </div>
          </div>
        </div>

        {/* Descripción Breve */}
        <div>
          <label style={labelStyle}>Descripción breve</label>
          <textarea
            name="description"
            placeholder="Resumen atractivo de lo que hace tu aplicación..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ ...inputStyle, minHeight: "75px" }}
          />
        </div>

        {/* Versión, Tamaño y Requisitos */}
        <div className="admin-form-row-3">
          <div>
            <label style={labelStyle}>Versión</label>
            <input
              type="text"
              name="version"
              placeholder="1.0.0"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Tamaño APK</label>
            <input
              type="text"
              name="size"
              placeholder="12 MB"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Requisitos</label>
            <input
              type="text"
              name="minRequirements"
              placeholder="Android 8.0+"
              value={minRequirements}
              onChange={(e) => setMinRequirements(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
        </div>

        {/* Estado Visual */}
        <div>
          <label style={labelStyle}>Estado de disponibilidad</label>
          <input type="hidden" name="status" value={status} />
          <div style={{ display: "flex", gap: "10px" }}>
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatus(opt.value)}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: `1px solid ${status === opt.value ? opt.color : "var(--border-color)"}`,
                  background: status === opt.value ? `${opt.color}22` : "var(--bg-card)",
                  color: status === opt.value ? opt.color : "var(--text-secondary)",
                  fontWeight: status === opt.value ? 700 : 500,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                ● {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* URL de Descarga */}
        <div>
          <label style={labelStyle}>Enlace directo de descarga (APK o enlace a la nube)</label>
          <input
            type="url"
            name="downloadUrl"
            placeholder="https://tu-servidor.com/app.apk o enlace de descarga"
            value={downloadUrl}
            onChange={(e) => setDownloadUrl(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        {/* Changelog */}
        <div>
          <label style={labelStyle}>Novedades de la versión (Changelog)</label>
          <textarea
            name="changelog"
            placeholder="- Corrección de errores&#10;- Nueva interfaz"
            value={changelog}
            onChange={(e) => setChangelog(e.target.value)}
            required
            style={{ ...inputStyle, minHeight: "80px", fontFamily: "monospace", fontSize: "0.85rem" }}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
          style={{ padding: "14px", fontSize: "1rem", marginTop: "6px", width: "100%", justifyContent: "center" }}
        >
          {isSubmitting ? "Publicando aplicación..." : "🚀 Publicar Aplicación"}
        </button>
      </form>

      {/* Tarjeta de Vista Previa en Vivo (Live Card Preview) */}
      <div style={{ position: "sticky", top: "110px" }}>
        <h4 style={{ margin: "0 0 12px 0", fontSize: "0.9rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
          👁️ Vista Previa en Vivo
        </h4>
        <div
          className="glass"
          style={{
            padding: "24px",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-glass)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ width: "52px", height: "52px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>
              {isImageUrl(icon) ? (
                <img
                  src={icon}
                  alt={name || "App icon"}
                  style={{ width: "52px", height: "52px", objectFit: "contain", borderRadius: "12px" }}
                  onError={(e) => { (e.target as any).src = "/logo.png"; }}
                />
              ) : (
                icon || "📱"
              )}
            </div>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: "50px",
                background: status === "available" ? "rgba(16,185,129,0.15)" : status === "beta" ? "rgba(245,158,11,0.15)" : "rgba(107,114,128,0.15)",
                color: status === "available" ? "#10b981" : status === "beta" ? "#f59e0b" : "#9ca3af",
                textTransform: "uppercase",
              }}
            >
              {statusOptions.find((s) => s.value === status)?.label}
            </span>
          </div>

          <h3 style={{ margin: 0, fontSize: "1.15rem" }}>{name || "Nombre de tu App"}</h3>
          <span style={{ fontSize: "0.75rem", color: "var(--accent-primary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {category || "Categoría"}
          </span>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {description || "Aquí aparecerá la descripción atractiva de tu aplicación cuando la llenes."}
          </p>

          <div style={{ display: "flex", gap: "12px", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><HardDrive size={13} /> {size || "0 MB"}</span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Cpu size={13} /> v{version || "1.0"}</span>
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <div style={{ flex: 1, padding: "8px 12px", background: "var(--bg-secondary)", borderRadius: "8px", fontSize: "0.8rem", textAlign: "center", color: "var(--text-muted)" }}>
              <Info size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} /> Más info
            </div>
            <div style={{ flex: 1, padding: "8px 12px", background: "var(--accent-primary)", borderRadius: "8px", fontSize: "0.8rem", textAlign: "center", color: "white", fontWeight: 600 }}>
              <Download size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} /> Descargar
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
