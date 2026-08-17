"use client";

import Link from "next/link";
import { Sun, Moon, ExternalLink, LogOut, ShieldCheck } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider/ThemeProvider";

interface AdminHeaderProps {
  logoutAction: () => Promise<void>;
}

export default function AdminHeader({ logoutAction }: AdminHeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "var(--bg-primary)",
        borderBottom: "1px solid var(--border-color)",
        padding: "14px 0",
        marginBottom: "28px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      <div
        className="admin-container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
        }}
      >
        {/* Logo & Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src="/logo.png" alt="Logo" style={{ height: "38px", width: "auto" }} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>Muñeco Tecnology</span>
              <span
                style={{
                  background: "rgba(124,58,237,0.15)",
                  color: "var(--accent-primary)",
                  padding: "2px 8px",
                  borderRadius: "50px",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <ShieldCheck size={12} /> Admin
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--text-muted)" }}>
              Panel de Control y Gestión
            </p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={toggleTheme}
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              border: "1px solid var(--border-color)",
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            title="Cambiar tema"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <Link
            href="/"
            target="_blank"
            className="btn btn-secondary"
            style={{ padding: "8px 14px", fontSize: "0.85rem", gap: "6px" }}
          >
            <ExternalLink size={14} /> Ver Sitio Web
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                padding: "8px 16px",
                fontSize: "0.85rem",
                background: "#ef4444",
                border: "none",
                gap: "6px",
              }}
            >
              <LogOut size={14} /> Salir
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
