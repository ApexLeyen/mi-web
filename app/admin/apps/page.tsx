import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import AppForm from "./AppForm";
import { Trash2, ExternalLink, HardDrive, Cpu, Smartphone } from "lucide-react";

export const dynamic = 'force-dynamic';

async function createApp(formData: FormData) {
  "use server";
  await prisma.app.create({
    data: {
      name: formData.get("name") as string,
      icon: formData.get("icon") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      version: formData.get("version") as string,
      size: formData.get("size") as string,
      minRequirements: formData.get("minRequirements") as string,
      changelog: formData.get("changelog") as string,
      downloadUrl: formData.get("downloadUrl") as string,
      status: formData.get("status") as string,
    },
  });
  revalidatePath("/admin/apps");
  revalidatePath("/");
}

async function deleteApp(formData: FormData) {
  "use server";
  await prisma.app.delete({ where: { id: formData.get("id") as string } });
  revalidatePath("/admin/apps");
  revalidatePath("/");
}

export default async function AdminApps() {
  let apps: any[] = [];
  try {
    apps = await prisma.app.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (e) {
    console.error("Error loading apps:", e);
  }

  const isImageUrl = (val: string) => {
    return val && (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("/") || val.startsWith("data:image"));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
      <div>
        <h2 style={{ margin: "0 0 8px 0", fontSize: "1.6rem" }}>📱 Gestión de Aplicaciones (APK)</h2>
        <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Publica tus aplicaciones Android con soporte para imágenes, versiones, changelogs y descargas directas.
        </p>
      </div>

      {/* Formulario de creación con vista previa en vivo */}
      <AppForm createAction={createApp} />

      {/* Listado de aplicaciones publicadas */}
      <div style={{ borderTop: "1px solid var(--border-glass)", paddingTop: "32px" }}>
        <h3 style={{ margin: "0 0 20px 0", fontSize: "1.3rem" }}>
          Aplicaciones Publicadas ({apps.length})
        </h3>

        {apps.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", background: "var(--bg-secondary)", borderRadius: "12px", color: "var(--text-muted)" }}>
            <Smartphone size={36} style={{ marginBottom: "12px", opacity: 0.5 }} />
            <p style={{ margin: 0 }}>Aún no has publicado ninguna aplicación. ¡Crea la primera arriba!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
            {apps.map((app) => (
              <div
                key={app.id}
                style={{
                  padding: "18px",
                  background: "var(--bg-secondary)",
                  borderRadius: "12px",
                  border: "1px solid var(--border-glass)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "10px",
                      background: "var(--bg-card)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      flexShrink: 0,
                      fontSize: "2rem",
                    }}
                  >
                    {isImageUrl(app.icon) ? (
                      <img src={app.icon} alt={app.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    ) : (
                      app.icon || "📱"
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ margin: 0, fontSize: "1.05rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {app.name}
                    </h4>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "4px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      <span>{app.category}</span>
                      <span>•</span>
                      <span>v{app.version}</span>
                      <span>•</span>
                      <span style={{ color: app.status === "available" ? "#10b981" : app.status === "beta" ? "#f59e0b" : "#9ca3af" }}>
                        {app.status === "available" ? "Disponible" : app.status === "beta" ? "Beta" : "Próximamente"}
                      </span>
                    </div>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {app.description}
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: "10px", marginTop: "auto" }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    <HardDrive size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "3px" }} />
                    {app.size}
                  </span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <a
                      href={app.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ padding: "5px 10px", fontSize: "0.78rem" }}
                      title="Probar enlace de descarga"
                    >
                      <ExternalLink size={13} /> Link
                    </a>
                    <form action={deleteApp}>
                      <input type="hidden" name="id" value={app.id} />
                      <button
                        type="submit"
                        style={{
                          background: "#ef444422",
                          color: "#ef4444",
                          border: "1px solid #ef444444",
                          padding: "5px 12px",
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
