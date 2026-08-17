import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  await requireAdminAuth();

  let appsCount = 0;
  let projectsCount = 0;
  let postsCount = 0;
  let commentsCount = 0;

  try {
    appsCount = await prisma.app.count();
    projectsCount = await prisma.project.count();
    postsCount = await prisma.post.count();
    commentsCount = await prisma.comment.count();
  } catch (e) {
    console.error("Error loading dashboard counts:", e);
  }

  return (
    <div>
      <h2 style={{ margin: "0 0 8px 0" }}>📊 Resumen del Sistema</h2>
      <p style={{ margin: "0 0 24px 0", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
        Estadísticas generales de los contenidos publicados en la plataforma.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>📱 Aplicaciones</h3>
          <p style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--accent-primary)', margin: '10px 0 0 0' }}>{appsCount}</p>
        </div>
        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>💼 Proyectos</h3>
          <p style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--accent-secondary)', margin: '10px 0 0 0' }}>{projectsCount}</p>
        </div>
        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>📝 Artículos</h3>
          <p style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--status-available)', margin: '10px 0 0 0' }}>{postsCount}</p>
        </div>
        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>💬 Comentarios</h3>
          <p style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#f59e0b', margin: '10px 0 0 0' }}>{commentsCount}</p>
        </div>
      </div>
    </div>
  );
}
