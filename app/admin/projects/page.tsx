import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth";
import ProjectForm from "./ProjectForm";
import { Trash2, ExternalLink, GitBranch, Briefcase } from "lucide-react";

export const dynamic = 'force-dynamic';

async function createProject(formData: FormData) {
  "use server";
  await requireAdminAuth();
  await prisma.project.create({
    data: {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      image: formData.get("image") as string,
      tags: formData.get("tags") as string,
      url: formData.get("url") as string,
      github: formData.get("github") as string,
      color: formData.get("color") as string,
    },
  });
  revalidatePath("/admin/projects");
  revalidatePath("/");
}

async function deleteProject(formData: FormData) {
  "use server";
  await requireAdminAuth();
  await prisma.project.delete({ where: { id: formData.get("id") as string } });
  revalidatePath("/admin/projects");
  revalidatePath("/");
}

export default async function AdminProjects() {
  await requireAdminAuth();
  let projects: any[] = [];
  try {
    projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (e) {
    console.error("Error loading projects:", e);
  }

  const isImageUrl = (val: string) => {
    return val && (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("/") || val.startsWith("data:image"));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
      <div>
        <h2 style={{ margin: "0 0 8px 0", fontSize: "1.6rem" }}>💼 Gestión de Proyectos</h2>
        <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Muestra tus trabajos y creaciones con imágenes de portada, etiquetas de tecnologías y enlaces directos a demos y código.
        </p>
      </div>

      {/* Formulario con Live Preview */}
      <ProjectForm createAction={createProject} />

      {/* Listado de proyectos publicados */}
      <div style={{ borderTop: "1px solid var(--border-glass)", paddingTop: "32px" }}>
        <h3 style={{ margin: "0 0 20px 0", fontSize: "1.3rem" }}>
          Proyectos Publicados ({projects.length})
        </h3>

        {projects.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", background: "var(--bg-secondary)", borderRadius: "12px", color: "var(--text-muted)" }}>
            <Briefcase size={36} style={{ marginBottom: "12px", opacity: 0.5 }} />
            <p style={{ margin: 0 }}>Aún no has publicado ningún proyecto. ¡Crea el primero arriba!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {projects.map((project) => (
              <div
                key={project.id}
                style={{
                  background: "var(--bg-secondary)",
                  borderRadius: "14px",
                  border: "1px solid var(--border-glass)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Cabecera con imagen o gradiente */}
                <div
                  style={{
                    position: "relative",
                    height: "120px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `linear-gradient(135deg, ${project.color}22, ${project.color}44)`,
                    overflow: "hidden",
                  }}
                >
                  {isImageUrl(project.image) ? (
                    <img src={project.image} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "3rem" }}>{project.image || "💼"}</span>
                  )}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "3px", background: project.color }} />
                </div>

                <div style={{ padding: "18px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: "1.1rem" }}>{project.title}</h4>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {project.description}
                  </p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                    {project.tags.split(",").map((t: string, idx: number) => (
                      <span
                        key={idx}
                        style={{
                          padding: "2px 8px",
                          borderRadius: "50px",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          background: "var(--bg-card)",
                          color: "var(--accent-primary)",
                          border: "1px solid var(--border-color)",
                        }}
                      >
                        {t.trim()}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: "12px", marginTop: "auto" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                        style={{ padding: "5px 10px", fontSize: "0.78rem" }}
                        title="Ver demo"
                      >
                        <ExternalLink size={13} /> Demo
                      </a>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                        style={{ padding: "5px 10px", fontSize: "0.78rem" }}
                        title="Ver repositorio GitHub"
                      >
                        <GitBranch size={13} /> Repo
                      </a>
                    </div>
                    <form action={deleteProject}>
                      <input type="hidden" name="id" value={project.id} />
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
