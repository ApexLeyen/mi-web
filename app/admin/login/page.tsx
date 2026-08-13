"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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
    } else {
      setError(data.error || "Error inesperado");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "var(--bg-primary)" }}>
      <form onSubmit={handleSubmit} style={{ background: "var(--bg-secondary)", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>Acceso Administrador</h2>
        {error && <p style={{ color: "var(--status-unavailable)", marginBottom: "10px" }}>{error}</p>}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="username" style={{ display: "block", marginBottom: "5px" }}>Usuario</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border-color)" }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="password" style={{ display: "block", marginBottom: "5px" }}>Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border-color)" }}
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Ingresar</button>
      </form>
    </div>
  );
}
