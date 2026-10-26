import Link from "next/link";
import { Metadata } from "next";
import { Award, Target, Eye, Code2, Smartphone, Globe, ShieldCheck, Mail, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre Nosotros — Muñeco Tecnology",
  description: "Conoce a Muñeco Tecnology: trayectoria, misión, visión y el desarrollador detrás de nuestras aplicaciones móviles y contenidos técnicos.",
  alternates: {
    canonical: "https://munecotecnology.uk/about",
  },
};

export default function AboutPage() {
  return (
    <div style={{ paddingTop: "100px", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <div className="container" style={{ maxWidth: "860px", paddingBottom: "70px" }}>
        <div style={{ marginBottom: "24px" }}>
          <Link
            href="/"
            style={{ color: "var(--accent-primary)", textDecoration: "none", fontWeight: 500 }}
          >
            ← Volver al inicio
          </Link>
        </div>

        <div className="section-header" style={{ textAlign: "left", marginBottom: "40px" }}>
          <span className="section-tag">Acerca de</span>
          <h1 className="section-title">
            Sobre <span className="gradient-text">Muñeco Tecnology</span>
          </h1>
          <p style={{ fontSize: "1.15rem", lineHeight: 1.6, marginTop: "12px" }}>
            Plataforma digital dedicada al desarrollo de aplicaciones móviles para Android, soluciones de software personalizadas y divulgación de tutoriales tecnológicos de alta calidad.
          </p>
        </div>

        {/* Historia / Quiénes somos */}
        <div className="glass" style={{ padding: "36px", borderRadius: "16px", marginBottom: "32px", lineHeight: "1.8" }}>
          <h2 style={{ marginTop: 0, fontSize: "1.6rem", color: "var(--text-primary)" }}>
            ¿Quiénes somos y qué hacemos?
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "16px" }}>
            <strong>Muñeco Tecnology</strong> nació con el objetivo de convertir ideas complejas en herramientas tecnológicas intuitivas, rápidas y accesibles para todos los usuarios. Desde nuestros inicios, nos hemos enfocado en el diseño y programación de aplicaciones nativas e híbridas para el sistema operativo Android, optimizando cada detalle de rendimiento, seguridad y experiencia visual.
          </p>
          <p style={{ color: "var(--text-secondary)", marginBottom: "16px" }}>
            Además de crear herramientas prácticas, este portal funciona como un espacio de aprendizaje continuo. Publicamos regularmente artículos, análisis y tutoriales técnicos sobre programación moderna (Kotlin, React, Next.js, Node.js), inteligencia artificial y optimización móvil, dirigidos tanto a entusiastas como a programadores que buscan resolver desafíos del día a día.
          </p>
        </div>

        {/* Pilares: Misión, Visión, Valores */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "36px" }}>
          <div className="glass" style={{ padding: "28px", borderRadius: "14px" }}>
            <div style={{ color: "var(--accent-primary)", marginBottom: "12px" }}>
              <Target size={28} />
            </div>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "1.25rem" }}>Nuestra Misión</h3>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6 }}>
              Democratizar el acceso a software funcional y seguro, creando herramientas móviles que aporten valor tangible a la vida cotidiana de nuestros usuarios y divulgando conocimiento técnico de manera clara y honesta.
            </p>
          </div>

          <div className="glass" style={{ padding: "28px", borderRadius: "14px" }}>
            <div style={{ color: "var(--accent-secondary)", marginBottom: "12px" }}>
              <Eye size={28} />
            </div>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "1.25rem" }}>Nuestra Visión</h3>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6 }}>
              Consolidarnos como un referente independiente en el desarrollo de software y aplicaciones móviles, reconocidos por la calidad de nuestros productos, la transparencia editorial y la cercanía con nuestra comunidad.
            </p>
          </div>

          <div className="glass" style={{ padding: "28px", borderRadius: "14px" }}>
            <div style={{ color: "var(--accent-primary)", marginBottom: "12px" }}>
              <ShieldCheck size={28} />
            </div>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "1.25rem" }}>Calidad y Ética</h3>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6 }}>
              Todas nuestras aplicaciones son libres de malware y se distribuyen bajo estándares estrictos de privacidad. En nuestros artículos, garantizamos contenido original verificado con pruebas reales de código.
            </p>
          </div>
        </div>

        {/* Stack y Especialidades */}
        <div className="glass" style={{ padding: "36px", borderRadius: "16px", marginBottom: "32px" }}>
          <h2 style={{ marginTop: 0, fontSize: "1.5rem", marginBottom: "16px" }}>
            Especialidades Técnicas
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px", lineHeight: 1.6 }}>
            En Muñeco Tecnology empleamos tecnologías modernas y probadas para garantizar la estabilidad, escalabilidad y seguridad de cada solución:
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <Smartphone size={22} style={{ color: "var(--accent-primary)" }} />
              <div>
                <strong>Android Nativo</strong>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Kotlin, Jetpack Compose, Room</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <Globe size={22} style={{ color: "var(--accent-primary)" }} />
              <div>
                <strong>Desarrollo Web</strong>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Next.js, React, TypeScript</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <Code2 size={22} style={{ color: "var(--accent-primary)" }} />
              <div>
                <strong>Backend & APIs</strong>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Node.js, Express, SQLite, Prisma</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <Award size={22} style={{ color: "var(--accent-primary)" }} />
              <div>
                <strong>Consultoría de Software</strong>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Arquitectura y optimización</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enlaces de contacto y llamadas a la acción */}
        <div className="glass" style={{ padding: "32px", borderRadius: "16px", textAlign: "center" }}>
          <h3 style={{ marginTop: 0, fontSize: "1.4rem" }}>¿Deseas ponerte en contacto con nosotros?</h3>
          <p style={{ color: "var(--text-secondary)", maxWidth: "560px", margin: "10px auto 24px auto", lineHeight: 1.6 }}>
            Ya sea para solicitar el desarrollo de una app personalizada, consultar una duda técnica o proponer una colaboración, estamos siempre atentos a nuevos mensajes.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <Mail size={16} /> Ir a Contacto
            </Link>
            <Link href="/#apps" className="btn btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              Explorar Apps <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
