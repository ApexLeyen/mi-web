"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Cpu, GitBranch, PlayCircle, Send, X, Mail, Heart } from "lucide-react";
import styles from "./Footer.module.css";

const quickLinks = [
  { href: "#about", label: "Sobre Mí" },
  { href: "#apps", label: "Mis Apps" },
  { href: "#portfolio", label: "Portafolio" },
  { href: "#blog", label: "Blog" },
];

const legalLinks = [
  { href: "/privacy", label: "Política de Privacidad" },
  { href: "/terms", label: "Términos y Condiciones" },
];

const socials = [
  { icon: <GitBranch size={18} />, href: "#", label: "GitHub" },
  { icon: <PlayCircle size={18} />, href: "#", label: "YouTube" },
  { icon: <Send size={18} />, href: "#", label: "Telegram" },
  { icon: <X size={18} />, href: "#", label: "X / Twitter" },
  { icon: <Mail size={18} />, href: "mailto:soporte.app.afi@gmail.com", label: "Email" },
];

export default function Footer() {
  const pathname = usePathname();

  // Hide main site footer on all /admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.topBar} />
      <div className="container">
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              <img src="/logo.png" alt="Muñeco Tecnology Logo" style={{ height: '65px', width: 'auto' }} />
            </div>
            <p className={styles.brandDesc}>
              Transformando ideas en soluciones digitales. Desarrollo de software, apps Android y plataformas web de nivel profesional.
            </p>
            <div className={styles.socials}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className={styles.socialBtn}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  id={`footer-social-${s.label.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Menú Rápido</h4>
            {quickLinks.map((l) => (
              <a key={l.href} href={l.href} className={styles.footerLink}>{l.label}</a>
            ))}
          </div>

          {/* Legal */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Legal</h4>
            {legalLinks.map((l) => (
              <Link key={l.href} href={l.href} className={styles.footerLink}>{l.label}</Link>
            ))}
          </div>

          {/* Contact */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Contacto</h4>
            <a href="mailto:soporte.app.afi@gmail.com" className={styles.footerLink} id="footer-email">
              soporte.app.afi@gmail.com
            </a>
            <a href="mailto:soporte.app.afi@gmail.com" className={`btn btn-primary ${styles.contactBtn}`} id="footer-contact-btn">
              Contratar servicios
            </a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            © {new Date().getFullYear()} <strong>Muñeco Tecnology</strong>. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
