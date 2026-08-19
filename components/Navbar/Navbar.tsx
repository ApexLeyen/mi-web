"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Cpu } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider/ThemeProvider";
import styles from "./Navbar.module.css";

const navLinks = [
  { href: "#about", label: "Sobre Mí" },
  { href: "#apps", label: "Mis Apps" },
  { href: "#portfolio", label: "Portafolio" },
  { href: "#blog", label: "Blog" },
  { href: "#contact", label: "Contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}
      >
        <div className={styles.container}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <img src="/logo.png" alt="Muñeco Tecnology Logo" className={styles.logoImg} />
            <span className={`section-tag ${styles.logoTag}`}>✦ Muñeco Tecnology</span>
          </Link>

          {/* Desktop Nav */}
          <nav className={styles.desktopNav}>
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className={styles.navLink}>
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className={styles.actions}>
            <button
              className={styles.themeBtn}
              onClick={toggleTheme}
              aria-label="Cambiar tema"
              id="theme-toggle"
            >
              <AnimatePresence mode="wait">
                {theme === "dark" ? (
                  <motion.span
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun size={18} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon size={18} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <a href="#apps" className={`btn btn-primary ${styles.ctaBtn}`}>
              Descargar Apps
            </a>

            <Link href="/admin/login" className={`btn btn-secondary ${styles.adminBtn}`}>
              Admin
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className={styles.menuBtn}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menú"
              id="mobile-menu-toggle"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu — rendered OUTSIDE header so CSS transforms don't break position:fixed */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className={styles.mobileLinksList}>
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className={styles.mobileLink}
                  initial={{ x: 25, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{link.label}</span>
                  <span style={{ fontSize: "1.1rem", opacity: 0.5 }}>›</span>
                </motion.a>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              style={{ padding: "24px 20px", display: "flex", gap: "12px", flexDirection: "column", marginTop: "auto" }}
            >
              <a href="#apps" className="btn btn-primary" style={{ width: "100%", padding: "14px" }} onClick={() => setMenuOpen(false)}>
                🚀 Descargar Apps
              </a>
              <Link href="/admin/login" className="btn btn-secondary" style={{ width: "100%", padding: "14px" }} onClick={() => setMenuOpen(false)}>
                🔒 Panel Administrador
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
