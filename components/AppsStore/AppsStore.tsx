"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Download, Info, Star, Calendar, HardDrive, Cpu } from "lucide-react";
import styles from "./AppsStore.module.css";

export interface App {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  version: string;
  size: string;
  updatedAt: string;
  minRequirements: string;
  changelog: string;
  downloadUrl: string;
  status: "available" | "beta" | "soon";
  screenshots: string[];
  rating?: number;
}

// Demo data — will be replaced by DB data later
const DEMO_APPS: App[] = [
  {
    id: "app-1",
    name: "MT File Manager",
    icon: "📁",
    description: "Gestor de archivos potente y elegante para Android con soporte de nubes, ZIP y modo oscuro integrado.",
    category: "Herramientas",
    version: "2.1.0",
    size: "8.4 MB",
    updatedAt: "2025-07-10",
    minRequirements: "Android 8.0+",
    changelog: "- Soporte de Google Drive\n- Mejoras de rendimiento\n- Nuevo diseño Material You",
    downloadUrl: "#",
    status: "available",
    screenshots: [],
    rating: 4.8,
  },
  {
    id: "app-2",
    name: "QuickNotes AI",
    icon: "📝",
    description: "Toma notas inteligentes con ayuda de IA. Organiza, resume y busca en tus notas al instante.",
    category: "Productividad",
    version: "1.0.3",
    size: "5.2 MB",
    updatedAt: "2025-06-22",
    minRequirements: "Android 9.0+",
    changelog: "- Integración con Gemini AI\n- Exportación a PDF",
    downloadUrl: "#",
    status: "beta",
    screenshots: [],
    rating: 4.5,
  },
  {
    id: "app-3",
    name: "MT Launcher Pro",
    icon: "🚀",
    description: "Lanzador de apps ultra personalizable con widgets dinámicos y gestos avanzados.",
    category: "Personalización",
    version: "0.9.0",
    size: "12.1 MB",
    updatedAt: "2025-08-01",
    minRequirements: "Android 10.0+",
    changelog: "Próximamente disponible.",
    downloadUrl: "#",
    status: "soon",
    screenshots: [],
  },
];

// Categories list will be computed dynamically now

const statusLabel: Record<string, string> = {
  available: "Disponible",
  beta: "Beta",
  soon: "Próximamente",
};

const statusClass: Record<string, string> = {
  available: "badge-available",
  beta: "badge-beta",
  soon: "badge-soon",
};

export default function AppsStore({ initialApps }: { initialApps?: App[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [selected, setSelected] = useState<App | null>(null);

  const appsToDisplay = initialApps && initialApps.length > 0 ? initialApps : DEMO_APPS;
  const categoriesList = useMemo(() => ["Todas", ...Array.from(new Set(appsToDisplay.map((a) => a.category)))], [appsToDisplay]);

  const filtered = useMemo(() => {
    return appsToDisplay.filter((app) => {
      const matchSearch =
        app.name.toLowerCase().includes(search.toLowerCase()) ||
        app.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "Todas" || app.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category, appsToDisplay]);

  return (
    <section id="apps" className={styles.section}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-tag">Mis Aplicaciones</span>
          <h2 className="section-title">
            Tienda de <span className="gradient-text">Apps</span>
          </h2>
          <p>Descarga y prueba mis aplicaciones Android. Actualizadas regularmente con nuevas funciones.</p>
        </motion.div>

        {/* Search & Filters */}
        <div className={styles.controls}>
          <div className={`glass ${styles.searchBox}`}>
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Buscar aplicaciones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
              id="app-search"
            />
          </div>
          <div className={styles.filters}>
            {categoriesList.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${category === cat ? styles.filterActive : ""}`}
                onClick={() => setCategory(cat)}
                id={`filter-${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Apps Grid */}
        <div className={styles.grid}>
          <AnimatePresence mode="popLayout">
            {filtered.map((app, i) => (
              <motion.div
                key={app.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className={`glass ${styles.appCard}`}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <div className={styles.cardTop}>
                  <div className={styles.appIcon}>{app.icon}</div>
                  <span className={`badge ${statusClass[app.status]}`}>
                    {statusLabel[app.status]}
                  </span>
                </div>

                <h3 className={styles.appName}>{app.name}</h3>
                <span className={styles.appCategory}>{app.category}</span>
                <p className={styles.appDesc}>{app.description}</p>

                <div className={styles.appMeta}>
                  <span><HardDrive size={13} /> {app.size}</span>
                  <span><Cpu size={13} /> v{app.version}</span>
                  {app.rating && <span><Star size={13} fill="currentColor" /> {app.rating}</span>}
                </div>

                <div className={styles.cardActions}>
                  <button
                    className={`btn btn-secondary ${styles.infoBtn}`}
                    onClick={() => setSelected(app)}
                    id={`app-info-${app.id}`}
                  >
                    <Info size={16} /> Más info
                  </button>
                  <a
                    href={app.downloadUrl}
                    className={`btn btn-primary ${styles.downloadBtn} ${app.status === "soon" ? styles.disabled : ""}`}
                    id={`app-download-${app.id}`}
                  >
                    <Download size={16} /> Descargar
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className={styles.empty}>
              <span>🔍</span>
              <p>No se encontraron aplicaciones con ese criterio.</p>
            </div>
          )}
        </div>
      </div>

      {/* App Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className={`glass ${styles.modal}`}
              initial={{ scale: 0.85, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 40 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.closeBtn} onClick={() => setSelected(null)} id="modal-close">✕</button>

              <div className={styles.modalHeader}>
                <div className={styles.modalIcon}>{selected.icon}</div>
                <div>
                  <h3 className={styles.modalTitle}>{selected.name}</h3>
                  <span className={`badge ${statusClass[selected.status]}`}>{statusLabel[selected.status]}</span>
                </div>
              </div>

              <p className={styles.modalDesc}>{selected.description}</p>

              <div className={styles.modalMeta}>
                <div className={styles.metaItem}><Calendar size={15} /> <strong>Actualizado:</strong> {selected.updatedAt}</div>
                <div className={styles.metaItem}><HardDrive size={15} /> <strong>Tamaño:</strong> {selected.size}</div>
                <div className={styles.metaItem}><Cpu size={15} /> <strong>Versión:</strong> {selected.version}</div>
                <div className={styles.metaItem}><Cpu size={15} /> <strong>Requisitos:</strong> {selected.minRequirements}</div>
              </div>

              <div className={styles.changelog}>
                <h4>📋 Changelog v{selected.version}</h4>
                <pre>{selected.changelog}</pre>
              </div>

              <a
                href={selected.downloadUrl}
                className={`btn btn-primary ${styles.modalDownload}`}
                id={`modal-download-${selected.id}`}
              >
                <Download size={18} /> Descargar APK
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
