"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, User, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Credenciales incorrectas");
      }
    } catch (err) {
      setError("Error de conexión al servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "var(--bg-primary)",
        padding: "20px",
      }}
    >
      <div
        className="glass"
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "36px",
          borderRadius: "20px",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-glass)",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <img src="/logo.png" alt="Logo" style={{ height: "48px", width: "auto", marginBottom: "12px" }} />
          <h2 style={{ fontSize: "1.4rem", margin: "0 0 6px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <ShieldCheck size={20} color="var(--accent-primary)" /> Panel Administrador
          </h2>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Ingresa tus credenciales para acceder a la gestión
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#ef4444",
              fontSize: "0.85rem",
              marginBottom: "18px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label htmlFor="username" style={labelStyle}>
              Usuario
            </label>
            <div style={{ position: "relative" }}>
              <User size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nombre de usuario"
                required
                style={{ ...inputStyle, paddingLeft: "38px" }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" style={labelStyle}>
              Contraseña
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ ...inputStyle, paddingLeft: "38px" }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%", padding: "12px", marginTop: "8px", fontSize: "0.95rem" }}
          >
            {loading ? "Verificando..." : "Iniciar Sesión"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", paddingTop: "18px", borderTop: "1px solid var(--border-glass)" }}>
          <Link
            href="/"
            style={{
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={14} /> Volver a la página principal
          </Link>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "var(--text-primary)",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid var(--border-color)",
  background: "var(--bg-card)",
  color: "var(--text-primary)",
  fontFamily: "inherit",
  fontSize: "0.9rem",
  outline: "none",
};
