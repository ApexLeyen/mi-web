"use client";

import { motion, Variants } from "framer-motion";
import { Target, Eye, Award, Code2, Smartphone, Globe } from "lucide-react";
import styles from "./About.module.css";

const skills = [
  { icon: <Smartphone size={18} />, name: "Android / Kotlin" },
  { icon: <Globe size={18} />, name: "Next.js / React" },
  { icon: <Code2 size={18} />, name: "TypeScript / JS" },
  { icon: <Code2 size={18} />, name: "Node.js / APIs" },
  { icon: <Code2 size={18} />, name: "Python" },
  { icon: <Code2 size={18} />, name: "Bases de Datos" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

export default function About() {
  return (
    <section id="about" className={styles.about}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">Sobre Mí</span>
          <h2 className="section-title">
            El desarrollador detrás de{" "}
            <span className="gradient-text">Muñeco Tecnology</span>
          </h2>
          <p>Apasionado por la tecnología, la innovación y crear soluciones que transforman la vida de las personas.</p>
        </motion.div>

        <div className={styles.grid}>
          {/* Cards de misión y visión */}
          <div className={styles.cards}>
            {[
              {
                icon: <Award size={24} />,
                title: "Mi Experiencia",
                desc: "Años de experiencia desarrollando aplicaciones móviles, plataformas web y soluciones de software a medida. He trabajado en proyectos personales y colaborativos, enfocado siempre en la calidad y la experiencia del usuario.",
              },
              {
                icon: <Target size={24} />,
                title: "Mi Misión",
                desc: "Democratizar el acceso a la tecnología mediante aplicaciones innovadoras, funcionales y accesibles que resuelvan problemas reales de personas reales, con un diseño que marque la diferencia.",
              },
              {
                icon: <Eye size={24} />,
                title: "Mi Visión",
                desc: "Consolidar a Muñeco Tecnology como una marca referente en el desarrollo de software en la región, expandiendo el impacto a través de productos digitales de calidad mundial.",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                className={`glass ${styles.card}`}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <div className={styles.cardIcon}>{card.icon}</div>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDesc}>{card.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Habilidades */}
          <motion.div
            className={styles.skillsPanel}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className={`glass ${styles.skillsCard}`}>
              <h3 className={styles.skillsTitle}>Stack Tecnológico</h3>
              <p className={styles.skillsDesc}>
                Las herramientas con las que construyo soluciones de alto impacto cada día.
              </p>
              <div className={styles.skillsList}>
                {skills.map((skill, i) => (
                  <motion.div
                    key={i}
                    className={styles.skillChip}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className={styles.skillIcon}>{skill.icon}</span>
                    {skill.name}
                  </motion.div>
                ))}
              </div>

              {/* Availability indicator */}
              <div className={styles.availability}>
                <div className={styles.availDot} />
                <span>Disponible para nuevos proyectos</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
