import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminHeader from "@/components/AdminHeader/AdminHeader";
import { LayoutDashboard, Smartphone, Briefcase, FileText, MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

async function handleLogout() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete("admin-auth");
  redirect("/admin/login");
}

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Strict server-side authentication check
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("admin-auth");

  if (!authCookie || authCookie.value !== "true") {
    redirect("/admin/login");
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingBottom: "60px" }}>
      {/* Header exclusivo del Panel Administrador */}
      <AdminHeader logoutAction={handleLogout} />

      <div className="admin-container">
        <div className="admin-grid">
          {/* Barra de navegación del Administrador */}
          <aside className="admin-nav">
            <div className="admin-nav-links">
              <Link href="/admin" className="btn btn-secondary" style={{ justifyContent: "flex-start", gap: "10px" }}>
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link href="/admin/apps" className="btn btn-secondary" style={{ justifyContent: "flex-start", gap: "10px" }}>
                <Smartphone size={16} /> Aplicaciones
              </Link>
              <Link href="/admin/projects" className="btn btn-secondary" style={{ justifyContent: "flex-start", gap: "10px" }}>
                <Briefcase size={16} /> Proyectos
              </Link>
              <Link href="/admin/blog" className="btn btn-secondary" style={{ justifyContent: "flex-start", gap: "10px" }}>
                <FileText size={16} /> Blog
              </Link>
              <Link href="/admin/comments" className="btn btn-secondary" style={{ justifyContent: "flex-start", gap: "10px" }}>
                <MessageSquare size={16} /> Comentarios
              </Link>
            </div>
          </aside>

          {/* Contenido Principal */}
          <main className="glass admin-main" style={{ borderRadius: "16px" }}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
