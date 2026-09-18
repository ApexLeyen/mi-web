"use client";

import { motion } from "framer-motion";
import { Clock, ArrowRight, Tag } from "lucide-react";
import styles from "./Blog.module.css";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  tag: string;
  emoji: string;
  readTime: string;
  createdAt: Date;
  likes: number;
}

export default function Blog({ initialPosts = [] }: { initialPosts?: Post[] }) {
  return (
    <section id="blog" className={styles.section}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-tag">Blog</span>
          <h2 className="section-title">
            Artículos &amp; <span className="gradient-text">Tutoriales</span>
          </h2>
          <p>Comparto lo que aprendo: programación, IA, desarrollo móvil y las últimas tendencias tecnológicas.</p>
        </motion.div>

        <div className={styles.grid}>
          {initialPosts.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No hay artículos publicados todavía.</p>}
          {initialPosts.slice(0, 3).map((post, i) => (
            <motion.article
              key={post.id}
              className={`glass ${styles.card}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              {(post.emoji.startsWith("http") || post.emoji.startsWith("/") || post.emoji.startsWith("data:image")) ? (
                <div style={{ position: "relative", width: "100%", height: "170px", borderRadius: "10px", overflow: "hidden", marginBottom: "8px", background: "#050b14" }}>
                  <img src={post.emoji} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", transform: "scale(1.08)" }} />
                  <div style={{ position: "absolute", top: "10px", left: "10px", background: "#ffffff", padding: "4px 10px", borderRadius: "50px", display: "inline-flex", alignItems: "center", gap: "6px", boxShadow: "0 2px 10px rgba(0,0,0,0.5)", zIndex: 2 }}>
                    <img src="/logo.png" alt="Muñeco Tecnology" style={{ height: "16px", width: "auto" }} />
                    <span style={{ color: "#000000", fontSize: "0.68rem", fontWeight: 900, letterSpacing: "0.4px" }}>MUÑECO TECNOLOGY</span>
                  </div>
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,20,0.65) 0%, transparent 55%)", pointerEvents: "none" }} />
                </div>
              ) : (
                <div className={styles.emoji}>{post.emoji}</div>
              )}
              <div className={styles.meta}>
                <span className={styles.tag}><Tag size={11} /> {post.tag}</span>
                <span className={styles.date}><Clock size={11} /> {post.readTime}</span>
                <span className={styles.date}>{new Date(post.createdAt).toLocaleDateString('es-ES')}</span>
              </div>
              <h3 className={styles.title}>{post.title}</h3>
              <p className={styles.excerpt}>{post.excerpt}</p>
              <a href={`/blog/${post.id}`} className={styles.readMore} id={`blog-read-${post.id}`}>
                Leer artículo <ArrowRight size={16} />
              </a>
            </motion.article>
          ))}
        </div>

        <motion.div
          className={styles.seeAll}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <a href="/blog" className="btn btn-outline" id="blog-see-all">
            Ver todos los artículos <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
