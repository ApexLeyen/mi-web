import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function handleLogout() {
  "use server";
  (await cookies()).delete("admin-auth");
  redirect("/admin/login");
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="container">
        <h1 className="section-title">Panel de <span className="gradient-text">Administración</span></h1>
        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '40px', marginTop: '40px' }}>
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a href="/admin" className="btn btn-secondary">Dashboard</a>
            <a href="/admin/apps" className="btn btn-secondary">Aplicaciones</a>
            <a href="/admin/projects" className="btn btn-secondary">Proyectos</a>
            <a href="/admin/blog" className="btn btn-secondary">Blog</a>
            <a href="/admin/comments" className="btn btn-secondary">Comentarios</a>
            
            <form action={handleLogout} style={{ marginTop: 'auto', paddingTop: '40px' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', background: '#ef4444', border: 'none' }}>
                Cerrar Sesión
              </button>
            </form>
          </aside>
          <main className="glass" style={{ padding: '30px', minHeight: '600px' }}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
