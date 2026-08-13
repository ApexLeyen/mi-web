import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

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
  const apps = await prisma.app.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Gestionar Aplicaciones</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
        {/* List */}
        <div>
          <h3>Aplicaciones Publicadas ({apps.length})</h3>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {apps.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No hay aplicaciones publicadas todavía.</p>
            ) : (
              apps.map(app => (
                <div key={app.id} style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ fontSize: '2rem' }}>{app.icon}</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0 }}>{app.name} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>v{app.version}</span></h4>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{app.category} • {app.status}</p>
                  </div>
                  <form action={deleteApp}>
                    <input type="hidden" name="id" value={app.id} />
                    <button type="submit" style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Eliminar</button>
                  </form>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Form */}
        <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px' }}>
          <h3>Añadir Nueva App</h3>
          <form action={createApp} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
            <input type="text" name="name" placeholder="Nombre de la App" required style={inputStyle} />
            <input type="text" name="icon" placeholder="Icono (Emoji ej. 🚀)" required style={inputStyle} />
            <textarea name="description" placeholder="Descripción breve" required style={{...inputStyle, minHeight: '80px'}} />
            <input type="text" name="category" placeholder="Categoría" required style={inputStyle} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" name="version" placeholder="Versión" required style={inputStyle} />
              <input type="text" name="size" placeholder="Tamaño" required style={inputStyle} />
            </div>
            <input type="text" name="minRequirements" placeholder="Requisitos Mínimos" required style={inputStyle} />
            <textarea name="changelog" placeholder="Changelog" required style={{...inputStyle, minHeight: '80px'}} />
            <input type="url" name="downloadUrl" placeholder="URL de Descarga" required style={inputStyle} />
            <select name="status" required style={inputStyle}>
              <option value="available">Disponible</option>
              <option value="beta">Beta</option>
              <option value="soon">Próximamente</option>
            </select>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>Publicar App</button>
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
