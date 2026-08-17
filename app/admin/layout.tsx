import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function handleLogout() {
  "use server";
  (await cookies()).delete("admin-auth");
  redirect("/admin/login");
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const auth = cookieStore.get("admin-auth");
  const isAuthenticated = auth?.value === "true";

  // If not authenticated (e.g. accessing /admin/login), render child page directly without admin layout chrome
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div style={{ paddingTop: '32px', minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '60px' }}>
      <div className="admin-container">
        {/* Dedicated Admin Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
          <div>
            <h1 className="section-title" style={{ fontSize: '2rem', margin: 0 }}>
              Panel de <span className="gradient-text">Administración</span>
            </h1>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sesión activa de Dariel</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <a href="/" target="_blank" className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
              🌐 Ver Sitio Web
            </a>
            <form action={handleLogout}>
              <button type="submit" className="btn btn-primary" style={{ background: '#ef4444', border: 'none', fontSize: '0.85rem', padding: '8px 16px' }}>
                Cerrar Sesión
              </button>
            </form>
          </div>
        </div>

        <div className="admin-grid">
          <aside className="admin-nav">
            <div className="admin-nav-links">
              <a href="/admin" className="btn btn-secondary">Dashboard</a>
              <a href="/admin/apps" className="btn btn-secondary">Aplicaciones</a>
              <a href="/admin/projects" className="btn btn-secondary">Proyectos</a>
              <a href="/admin/blog" className="btn btn-secondary">Blog</a>
              <a href="/admin/comments" className="btn btn-secondary">Comentarios</a>
            </div>
          </aside>
          <main className="glass admin-main" style={{ borderRadius: '16px' }}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
