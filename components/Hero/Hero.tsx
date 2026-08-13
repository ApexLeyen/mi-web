"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download, Briefcase, Code2, Sparkles, Terminal, Globe, Smartphone } from "lucide-react";
import styles from "./Hero.module.css";

const floatingCards = [
  { icon: <Smartphone size={20} />, label: "Apps Android", value: "10+" },
  { icon: <Globe size={20} />, label: "Webs creadas", value: "15+" },
  { icon: <Terminal size={20} />, label: "Proyectos", value: "30+" },
];

export default function Hero() {
  return (
    <section className={styles.hero} id="home">
      {/* Background blobs */}
      <div className={`bg-blob ${styles.blob1}`} />
      <div className={`bg-blob ${styles.blob2}`} />
      <div className={`bg-blob ${styles.blob3}`} />
      <div className={`bg-grid ${styles.grid}`} />

      <div className="container">
        <div className={styles.content}>
          {/* Left: Text */}
          <div className={styles.textSide}>
            <motion.h1
              className={styles.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Transformando{" "}
              <span className="gradient-text">ideas</span>{" "}
              en soluciones{" "}
              <span className="gradient-text">digitales.</span>
            </motion.h1>

            <motion.p
              className={styles.subtitle}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              Desarrollador de software especializado en aplicaciones móviles,
              soluciones web y herramientas tecnológicas de alto impacto.
            </motion.p>

            <motion.div
              className={styles.buttons}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <a href="#portfolio" className="btn btn-primary" id="hero-ver-proyectos">
                <Code2 size={18} />
                Ver proyectos
                <ArrowRight size={16} />
              </a>
              <a href="#apps" className="btn btn-secondary" id="hero-descargar-apps">
                <Download size={18} />
                Descargar Apps
              </a>
              <a href="mailto:soporte.app.afi@gmail.com" className="btn btn-outline" id="hero-contratar">
                <Briefcase size={18} />
                Contratar servicios
              </a>
            </motion.div>

            {/* Floating stats */}
            <motion.div
              className={styles.stats}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              {floatingCards.map((card, i) => (
                <div key={i} className={`glass ${styles.statCard}`}>
                  <div className={styles.statIcon}>{card.icon}</div>
                  <div>
                    <div className={styles.statValue}>{card.value}</div>
                    <div className={styles.statLabel}>{card.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Illustration */}
          <motion.div
            className={styles.visualSide}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className={styles.devCard}>
              <div className={styles.cardHeader}>
                <span className={styles.dot} style={{ background: "#ff5f57" }} />
                <span className={styles.dot} style={{ background: "#febc2e" }} />
                <span className={styles.dot} style={{ background: "#28c840" }} />
                <span className={styles.fileName}>main.tsx</span>
              </div>
              <div className={styles.codeBlock}>
                <div className={styles.codeLine}>
                  <span className={styles.kw}>const</span>{" "}
                  <span className={styles.fn}>developer</span> = {"{"}
                </div>
                <div className={`${styles.codeLine} ${styles.indent}`}>
                  <span className={styles.prop}>name</span>:{" "}
                  <span className={styles.str}>&apos;Muñeco Tecnology&apos;</span>,
                </div>
                <div className={`${styles.codeLine} ${styles.indent}`}>
                  <span className={styles.prop}>stack</span>:{" "}
                  <span className={styles.str}>[&apos;React&apos;, &apos;Next.js&apos;, &apos;Android&apos;]</span>,
                </div>
                <div className={`${styles.codeLine} ${styles.indent}`}>
                  <span className={styles.prop}>passion</span>:{" "}
                  <span className={styles.str}>&apos;Crear soluciones 🚀&apos;</span>,
                </div>
                <div className={`${styles.codeLine} ${styles.indent}`}>
                  <span className={styles.prop}>available</span>:{" "}
                  <span className={styles.kw}>true</span>
                </div>
                <div className={styles.codeLine}>{"}"}</div>
                <div className={`${styles.codeLine} ${styles.cursor}`}>&nbsp;</div>
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              className={`glass ${styles.badge1}`}
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Smartphone size={16} />
              <span>Android Dev</span>
            </motion.div>
            <motion.div
              className={`glass ${styles.badge2}`}
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
            >
              <Globe size={16} />
              <span>Web Dev</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
