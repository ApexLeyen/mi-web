"use client";

import { useState } from "react";
import { Send, Rocket, Mail, CheckCircle } from "lucide-react";
import styles from "./Contact.module.css";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    // Aquí iría la lógica para enviar el correo (ej. Formspree, Resend o un API route propio).
    // Por ahora simulamos un envío:
    setTimeout(() => {
      setStatus("success");
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setStatus("idle"), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className={styles.contactSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>
            <Rocket size={16} /> Servicios de Desarrollo
          </span>
          <h2 className={styles.title}>
            ¿Tienes una idea? <span>Hagámosla realidad.</span>
          </h2>
          <p className={styles.subtitle}>
            Ofrezco desarrollo de aplicaciones Android (APK), software a medida, y soluciones web para tu negocio. Cuéntame tu proyecto y te enviaré un presupuesto sin compromiso.
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.contactInfo}>
            <div className={styles.infoCard}>
              <div className={styles.iconBox}>
                <Rocket size={24} />
              </div>
              <div>
                <h3>Apps a Medida</h3>
                <p>Desarrollo nativo e híbrido para Android con rendimiento óptimo.</p>
              </div>
            </div>
            
            <div className={styles.infoCard}>
              <div className={styles.iconBox}>
                <Mail size={24} />
              </div>
              <div>
                <h3>Soporte y Consultoría</h3>
                <p>Mantenimiento, actualización de apps y asesoría técnica.</p>
              </div>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Nombre o Empresa</label>
              <input type="text" id="name" required placeholder="Ej. Juan Pérez" />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Correo Electrónico</label>
              <input type="email" id="email" required placeholder="tu@correo.com" />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="project">Detalles del Proyecto</label>
              <textarea 
                id="project" 
                required 
                placeholder="Describe qué tipo de app o software necesitas..."
                rows={4}
              ></textarea>
            </div>

            <button 
              type="submit" 
              className={styles.submitBtn} 
              disabled={status !== "idle"}
            >
              {status === "idle" && <><Send size={18} /> Enviar Solicitud</>}
              {status === "submitting" && "Enviando..."}
              {status === "success" && <><CheckCircle size={18} /> Mensaje Enviado</>}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
