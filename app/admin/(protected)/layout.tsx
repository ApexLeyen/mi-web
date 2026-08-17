import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function handleLogout() {
  "use server";
  (await cookies()).delete("admin-auth");
  redirect("/admin/login");
}

// This layout wraps all protected admin pages: /, /apps, /blog, /projects, /comments
// If no session cookie → auto-redirect to /admin/login
export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const auth = cookieStore.get("admin-auth");

  if (!auth?.value || auth.value !== "true") {
    redirect("/admin/login");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        paddingBottom: "60px",
      }}
    >
      <div className="admin-container" style={{ paddingTop: "32px" }}>
        {/* Admin Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "28px",
            paddingBottom: "20px",
            borderBottom: "1px solid var(--border-glass)",
          }}
        >
          <div>
            <h1
              className="section-title"
              style={{ fontSize: "1.8rem", margin: 0, lineHeight: 1.2 }}
            >
              Panel de{" "}
              <span className="gradient-text">Administración</span>
            </h1>
            <span
              style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
            >
              Sesión activa · Dariel
            </span>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <a
              href="/"
              target="_blank"
              className="btn btn-secondary"
              style={{ fontSize: "0.85rem", padding: "8px 18px" }}
            >
              🌐 Ver Sitio
            </a>
            <form action={handleLogout}>
              <button
                type="submit"
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  padding: "8px 18px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                Cerrar Sesión
              </button>
            </form>
          </div>
        </div>

        {/* Admin Body */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {/* Sidebar Nav */}
          <aside>
            <nav
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border-glass)",
                borderRadius: "14px",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              {[
                { href: "/admin", label: "📊 Dashboard" },
                { href: "/admin/apps", label: "📱 Aplicaciones" },
                { href: "/admin/projects", label: "💼 Proyectos" },
                { href: "/admin/blog", label: "📝 Blog" },
                { href: "/admin/comments", label: "💬 Comentarios" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "block",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.08)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main
            className="glass"
            style={{
              borderRadius: "16px",
              padding: "28px",
              minWidth: 0,
            }}
          >
            {children}
          </main>
        </div>
      </div>

      {/* Responsive sidebar collapse on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .admin-protected-body {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
