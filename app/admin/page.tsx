import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const appsCount = await prisma.app.count();
  const projectsCount = await prisma.project.count();
  const postsCount = await prisma.post.count();
  const commentsCount = await prisma.comment.count();

  return (
    <div>
      <h2>Resumen del Sistema</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '30px' }}>
        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <h3>📱 Aplicaciones</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{appsCount}</p>
        </div>
        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <h3>💼 Proyectos</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>{projectsCount}</p>
        </div>
        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <h3>📝 Artículos</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--status-available)' }}>{postsCount}</p>
        </div>
        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <h3>💬 Comentarios</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>{commentsCount}</p>
        </div>
      </div>
    </div>
  );
}
