import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

async function createProject(formData: FormData) {
  "use server";
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
  await prisma.project.delete({ where: { id: formData.get("id") as string } });
  revalidatePath("/admin/projects");
  revalidatePath("/");
}

export default async function AdminProjects() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <h2>Gestionar Proyectos</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px', marginTop: '20px' }}>
        {/* Lista */}
        <div>
          <h3>Proyectos Publicados ({projects.length})</h3>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {projects.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No hay proyectos todavía.</p>
            ) : (
              projects.map(project => (
                <div key={project.id} style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ fontSize: '2rem' }}>{project.image}</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0 }}>{project.title}</h4>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {project.tags} • <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: project.color, display: 'inline-block' }}></span>
                    </p>
                  </div>
                  <form action={deleteProject}>
                    <input type="hidden" name="id" value={project.id} />
                    <button type="submit" style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Eliminar</button>
                  </form>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Formulario */}
        <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px' }}>
          <h3>Añadir Proyecto</h3>
          <form action={createProject} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
            <input type="text" name="title" placeholder="Título del proyecto" required style={inputStyle} />
            <input type="text" name="image" placeholder="Icono (Emoji ej. 🛒)" required style={inputStyle} />
            <textarea name="description" placeholder="Descripción" required style={{...inputStyle, minHeight: '80px'}} />
            <input type="text" name="tags" placeholder="Tags (separados por coma)" required style={inputStyle} />
            <input type="url" name="url" placeholder="URL del proyecto" required style={inputStyle} />
            <input type="url" name="github" placeholder="URL de GitHub" required style={inputStyle} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontSize: '0.9rem' }}>Color:</label>
              <input type="color" name="color" defaultValue="#7c3aed" style={{ width: '50px', height: '35px', border: 'none', cursor: 'pointer', borderRadius: '6px' }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>Publicar Proyecto</button>
          </form>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  background: 'var(--bg-card)',
  color: 'var(--text-primary)',
  fontFamily: 'inherit',
  outline: 'none'
};
