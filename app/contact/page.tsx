import Link from "next/link";
import { Metadata } from "next";
import Contact from "@/components/Contact/Contact";
import { Mail, MessageCircle, Send, Clock, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contacto — Muñeco Tecnology",
  description: "Ponte en contacto con el equipo de Muñeco Tecnology para solicitar presupuestos de software, desarrollo de apps Android o soporte técnico.",
  alternates: {
    canonical: "https://munecotecnology.uk/contact",
  },
};

export default function ContactPage() {
  return (
    <div style={{ paddingTop: "100px", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <div className="container" style={{ maxWidth: "900px", paddingBottom: "70px" }}>
        <div style={{ marginBottom: "24px" }}>
          <Link
            href="/"
            style={{ color: "var(--accent-primary)", textDecoration: "none", fontWeight: 500 }}
          >
            ← Volver al inicio
          </Link>
        </div>

        <div className="section-header" style={{ textAlign: "left", marginBottom: "36px" }}>
          <span className="section-tag">Contacto</span>
          <h1 className="section-title">
            Hablemos de tu <span className="gradient-text">Proyecto</span>
          </h1>
          <p style={{ fontSize: "1.15rem", lineHeight: 1.6, marginTop: "12px" }}>
            ¿Tienes alguna consulta, sugerencia o necesitas el desarrollo de una aplicación personalizada? Escríbenos y te responderemos en menos de 24 horas.
          </p>
        </div>

        {/* Tarjetas rápidas de contacto directo */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "18px", marginBottom: "40px" }}>
          <div className="glass" style={{ padding: "24px", borderRadius: "14px" }}>
            <div style={{ color: "var(--accent-primary)", marginBottom: "10px" }}>
              <Mail size={24} />
            </div>
            <strong style={{ display: "block", marginBottom: "4px" }}>Correo Oficial</strong>
            <a
              href="mailto:munecotecnology@gmail.com"
              style={{ color: "var(--accent-primary)", textDecoration: "none", wordBreak: "break-all" }}
            >
              munecotecnology@gmail.com
            </a>
          </div>

          <div className="glass" style={{ padding: "24px", borderRadius: "14px" }}>
            <div style={{ color: "var(--accent-primary)", marginBottom: "10px" }}>
              <Clock size={24} />
            </div>
            <strong style={{ display: "block", marginBottom: "4px" }}>Tiempo de Respuesta</strong>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              Lunes a Sábado: &lt; 24 horas
            </span>
          </div>

          <div className="glass" style={{ padding: "24px", borderRadius: "14px" }}>
            <div style={{ color: "var(--accent-primary)", marginBottom: "10px" }}>
              <Send size={24} />
            </div>
            <strong style={{ display: "block", marginBottom: "4px" }}>Redes Sociales</strong>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              Telegram / WhatsApp disponibles
            </span>
          </div>
        </div>

        {/* Formulario integrado */}
        <div style={{ marginBottom: "50px" }}>
          <Contact />
        </div>

        {/* Preguntas Frecuentes (FAQ) para dar valor y contenido indexable */}
        <div className="glass" style={{ padding: "36px", borderRadius: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <HelpCircle size={24} style={{ color: "var(--accent-primary)" }} />
            <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Preguntas Frecuentes</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "6px" }}>¿Las aplicaciones descargadas desde esta web son seguras?</h3>
              <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "0.95rem" }}>
                Totalmente. Todas las aplicaciones publicadas en Muñeco Tecnology son desarrolladas y firmadas por nosotros. No contienen adware invasivo, ni software espía. Además, enlazamos siempre a Google Play Store cuando la app está disponible oficialmente.
              </p>
            </div>

            <div style={{ borderTop: "1px solid var(--border-glass)", paddingTop: "16px" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "6px" }}>¿Ofreces servicios de desarrollo para empresas o personas?</h3>
              <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "0.95rem" }}>
                Sí. Desarrollamos apps móviles nativas para Android (APK), interfaces web modernas y paneles administrativos personalizados adaptados a las necesidades de tu proyecto.
              </p>
            </div>

            <div style={{ borderTop: "1px solid var(--border-glass)", paddingTop: "16px" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "6px" }}>¿Cómo puedo solicitar una cotización o presupuesto?</h3>
              <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "0.95rem" }}>
                Basta con rellenar el formulario de contacto indicando las características deseadas de tu app o escribirnos directamente a munecotecnology@gmail.com. Te responderemos con un análisis de viabilidad y costos sin compromiso.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
