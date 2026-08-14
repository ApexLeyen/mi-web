"use client";

import { motion } from "framer-motion";
import { ExternalLink, GitBranch } from "lucide-react";
import styles from "./Portfolio.module.css";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string;
  url: string;
  github: string;
  color: string;
  createdAt: Date;
}

export default function Portfolio({ initialProjects = [] }: { initialProjects?: Project[] }) {
  return (
    <section id="portfolio" className={styles.section}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-tag">Portafolio</span>
          <h2 className="section-title">
            Proyectos <span className="gradient-text">Destacados</span>
          </h2>
          <p>Una selección de los proyectos que más me enorgullecen. Cada uno resuelve un problema real.</p>
        </motion.div>

        <div className={styles.grid}>
          {initialProjects.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No hay proyectos publicados todavía.</p>}
          {initialProjects.map((project, i) => (
            <motion.div
              key={project.id}
              className={`glass ${styles.card}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              {/* Image/Icon area */}
              <div
                className={styles.cardVisual}
                style={{ background: `linear-gradient(135deg, ${project.color}22, ${project.color}44)` }}
              >
                {(project.image.startsWith("http") || project.image.startsWith("/") || project.image.startsWith("data:image")) ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0 }}
                  />
                ) : (
                  <span className={styles.projectEmoji}>{project.image}</span>
                )}
                <div
                  className={styles.colorBar}
                  style={{ background: project.color }}
                />
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.title}>{project.title}</h3>
                <p className={styles.desc}>{project.description}</p>

                <div className={styles.tags}>
                  {project.tags.split(',').map((tag) => (
                    <span key={tag.trim()} className={styles.tag}>{tag.trim()}</span>
                  ))}
                </div>

                <div className={styles.actions}>
                  <a
                    href={project.url}
                    className={`btn btn-primary ${styles.actionBtn}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    id={`project-link-${project.id}`}
                  >
                    <ExternalLink size={15} />
                    Ver proyecto
                  </a>
                  <a
                    href={project.github}
                    className={`btn btn-secondary ${styles.actionBtn}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    id={`project-github-${project.id}`}
                  >
                    <GitBranch size={15} />
                    GitHub
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
