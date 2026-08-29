"use client";

import Link from "next/link";
import { GitBranch, MessageCircle, Send, Mail, Heart } from "lucide-react";
import ShareButtons from "@/components/ShareButtons/ShareButtons";
import styles from "./Footer.module.css";

const XIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const quickLinks = [
  { href: "/#about", label: "Sobre Mí" },
  { href: "/#apps", label: "Mis Apps" },
  { href: "/#portfolio", label: "Portafolio" },
  { href: "/blog", label: "Blog y Tutoriales" },
];

const legalLinks = [
  { href: "/privacy", label: "Política de Privacidad" },
  { href: "/terms", label: "Términos y Condiciones" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topBar} />
      <div className="container">
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              <img src="/logo.png" alt="Muñeco Tecnology Logo" style={{ height: "65px", width: "auto" }} />
            </div>
            <p className={styles.brandDesc}>
              Transformando ideas en soluciones digitales. Desarrollo de software, apps Android y plataformas web de nivel profesional.
            </p>
            <div className={styles.socials}>
              <a
                href="https://github.com/ApexLeyen"
                className={styles.socialBtn}
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
              >
                <GitBranch size={18} />
              </a>
              <a
                href="https://api.whatsapp.com/send?text=¡Hola!%20Te%20comparto%20la%20página%20oficial%20de%20Muñeco%20Tecnology:%20https://my-web.apexleyen2515.workers.dev"
                className={styles.socialBtn}
                aria-label="WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
                title="Compartir por WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href="https://t.me/share/url?url=https://my-web.apexleyen2515.workers.dev&text=Conoce%20Muñeco%20Tecnology"
                className={styles.socialBtn}
                aria-label="Telegram"
                target="_blank"
                rel="noopener noreferrer"
                title="Compartir por Telegram"
              >
                <Send size={18} />
              </a>
              <a
                href="https://twitter.com/intent/tweet?url=https://my-web.apexleyen2515.workers.dev&text=Conoce%20Muñeco%20Tecnology"
                className={styles.socialBtn}
                aria-label="Twitter / X"
                target="_blank"
                rel="noopener noreferrer"
                title="Compartir en X"
              >
                <XIcon size={14} />
              </a>
              <a
                href="mailto:soporte.app.afi@gmail.com"
                className={styles.socialBtn}
                aria-label="Email"
                title="Enviar Correo"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Menú Rápido</h4>
            {quickLinks.map((l) => (
              <Link key={l.href} href={l.href} className={styles.footerLink}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Legal */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Legal</h4>
            {legalLinks.map((l) => (
              <Link key={l.href} href={l.href} className={styles.footerLink}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Contact & Share */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Contacto y Servicios</h4>
            <a href="mailto:soporte.app.afi@gmail.com" className={styles.footerLink} id="footer-email">
              soporte.app.afi@gmail.com
            </a>
            <a
              href="mailto:soporte.app.afi@gmail.com?subject=Consulta%20de%20Servicios%20-%20Muñeco%20Tecnology"
              className={`btn btn-primary ${styles.contactBtn}`}
              id="footer-contact-btn"
            >
              Contratar servicios
            </a>
          </div>
        </div>

        {/* Share website bar at bottom */}
        <div style={{ marginBottom: "30px" }}>
          <ShareButtons
            title="Muñeco Tecnology — Apps y Soluciones Digitales"
            description="Visita la web oficial de Muñeco Tecnology para descargar apps, ver proyectos y tutoriales de tecnología."
            label="📣 ¿Te gusta este sitio? ¡Compártelo con tus amigos!"
          />
        </div>

        <div className={styles.bottom}>
          <p>
            © {new Date().getFullYear()} <strong>Muñeco Tecnology</strong>. Todos los derechos reservados.
          </p>
          <div className={styles.madeWith}>
            <span>Desarrollado con</span>
            <Heart size={14} color="#ef4444" fill="#ef4444" />
            <span>para la comunidad tech</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
