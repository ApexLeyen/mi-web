"use client";

import { useState } from "react";
import { Send, Rocket, Mail, CheckCircle } from "lucide-react";
import styles from "./Contact.module.css";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("project")
    };

    try {
      const response = await fetch("https://formsubmit.co/ajax/soporte.app.afi@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          Nombre: data.name,
          Email: data.email,
          Proyecto: data.message,
          _subject: "Nuevo cliente desde Muñeco Tecnology 🚀"
        }),
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("idle");
        alert("Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.");
      }
    } catch (error) {
      setStatus("idle");
      alert("Error de conexión. Revisa tu internet e intenta de nuevo.");
    }
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
              <input type="text" id="name" name="name" required placeholder="Ej. Juan Pérez" />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Correo Electrónico</label>
              <input type="email" id="email" name="email" required placeholder="tu@correo.com" />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="project">Detalles del Proyecto</label>
              <textarea 
                id="project" 
                name="project"
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
