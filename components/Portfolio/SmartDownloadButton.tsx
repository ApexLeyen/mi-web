"use client";

import { useState, useEffect, useRef } from "react";
import { Download, ExternalLink, ChevronDown, Check, X } from "lucide-react";

export interface PlatformDownloads {
  default?: string;
  windows?: string;
  macSilicon?: string;
  macIntel?: string;
  android?: string;
  linux?: string;
}

export type PlatformKey = "windows" | "macSilicon" | "macIntel" | "android" | "linux" | "default";

interface SmartDownloadButtonProps {
  url: string;
  projectId: string;
  projectTitle: string;
  className?: string;
}

export function parsePlatformUrls(rawUrl: string): PlatformDownloads | null {
  if (!rawUrl) return null;
  const trimmed = rawUrl.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      const parsed = JSON.parse(trimmed);
      return parsed as PlatformDownloads;
    } catch {
      return null;
    }
  }
  return null;
}

const PLATFORM_META: Record<
  PlatformKey,
  { name: string; badge: string; icon: string; short: string }
> = {
  windows: {
    name: "Descargar para Windows",
    badge: ".exe / .zip",
    icon: "🪟",
    short: "Windows",
  },
  macSilicon: {
    name: "Descargar Mac (M1-M5)",
    badge: "Apple Silicon .dmg",
    icon: "🍎",
    short: "Mac M1-M5",
  },
  macIntel: {
    name: "Descargar Mac (Intel)",
    badge: "Intel x64 .dmg",
    icon: "🍏",
    short: "Mac Intel",
  },
  android: {
    name: "Descargar para Android",
    badge: "APK / App",
    icon: "🤖",
    short: "Android",
  },
  linux: {
    name: "Descargar para Linux",
    badge: ".deb / AppImage",
    icon: "🐧",
    short: "Linux",
  },
  default: {
    name: "Ver Proyecto / Demo",
    badge: "Web Demo",
    icon: "🌐",
    short: "Demo Web",
  },
};

function detectUserPlatform(): PlatformKey {
  if (typeof window === "undefined" || !navigator) return "windows";

  const ua = navigator.userAgent || "";
  const platform = (navigator as any).userAgentData?.platform || navigator.platform || "";

  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "android";
  if (/win/i.test(platform) || /windows/i.test(ua)) return "windows";

  if (/mac/i.test(platform) || /macintosh/i.test(ua)) {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (gl) {
        const debugInfo = (gl as any).getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
          const renderer = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "";
          if (/apple/i.test(renderer)) {
            return "macSilicon";
          }
          if (/intel|amd|radeon/i.test(renderer)) {
            return "macIntel";
          }
        }
      }
    } catch {
      // fallback
    }
    return "macSilicon";
  }

  if (/linux/i.test(platform) || /linux/i.test(ua)) return "linux";

  return "windows";
}

export default function SmartDownloadButton({
  url,
  projectId,
  projectTitle,
  className = "",
}: SmartDownloadButtonProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [detectedPlatform, setDetectedPlatform] = useState<PlatformKey>("windows");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setDetectedPlatform(detectUserPlatform());
  }, []);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  const platformData = parsePlatformUrls(url);

  // If plain URL (single download or web link)
  if (!platformData) {
    const isDirectDownload = /\.(zip|rar|7z|exe|dmg|apk|msi)(\?.*)?$/i.test(url);
    return (
      <a
        href={url || "#"}
        className={`btn btn-primary ${className}`}
        target="_blank"
        rel="noopener noreferrer"
        id={`project-link-${projectId}`}
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
      >
        {isDirectDownload ? <Download size={15} /> : <ExternalLink size={15} />}
        {isDirectDownload ? "Descargar" : "Ver proyecto"}
      </a>
    );
  }

  // Get list of platforms that actually have URLs provided
  const availablePlatforms = (
    Object.keys(PLATFORM_META) as PlatformKey[]
  ).filter((key) => Boolean(platformData[key]));

  if (availablePlatforms.length === 0) {
    return (
      <a
        href="#"
        className={`btn btn-primary ${className}`}
        style={{ opacity: 0.6, cursor: "not-allowed" }}
      >
        No disponible
      </a>
    );
  }

  // Choose the best platform to highlight:
  // 1. User's detected platform if available
  // 2. Or the first available platform
  const primaryKey: PlatformKey = platformData[detectedPlatform]
    ? detectedPlatform
    : availablePlatforms[0];

  const primaryUrl = platformData[primaryKey] || "#";
  const primaryMeta = PLATFORM_META[primaryKey];
  const hasMultiple = availablePlatforms.length > 1;

  return (
    <div style={{ position: "relative", width: "100%", display: "flex", flexDirection: "column", flex: 1 }} ref={dropdownRef}>
      <div style={{ display: "flex", width: "100%", borderRadius: "8px", overflow: "hidden" }}>
        {/* Main button: detected OS download */}
        <a
          href={primaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn btn-primary ${className}`}
          id={`project-smart-dl-${projectId}`}
          style={{
            flex: 1,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "7px",
            borderTopRightRadius: hasMultiple ? "0" : undefined,
            borderBottomRightRadius: hasMultiple ? "0" : undefined,
            padding: "9px 12px",
            fontSize: "0.82rem",
            textDecoration: "none",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={`${primaryMeta.name} (${primaryMeta.badge})`}
        >
          <span style={{ fontSize: "1rem" }}>{primaryMeta.icon}</span>
          <span>{primaryMeta.name}</span>
        </a>

        {/* Chevron split button if multiple platforms exist */}
        {hasMultiple && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDropdownOpen((prev) => !prev);
            }}
            aria-label="Ver todas las opciones de descarga"
            style={{
              background: "var(--accent-primary)",
              border: "none",
              borderLeft: "1px solid rgba(255, 255, 255, 0.25)",
              color: "white",
              padding: "0 10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-secondary)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent-primary)")}
          >
            <ChevronDown
              size={16}
              style={{
                transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            />
          </button>
        )}
      </div>

      {/* Subtle indicator of detected OS */}
      {hasMultiple && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDropdownOpen((prev) => !prev);
          }}
          style={{
            background: "none",
            border: "none",
            padding: "4px 2px 0 2px",
            color: "var(--text-muted)",
            fontSize: "0.72rem",
            textAlign: "left",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          <span>Detectado: <strong>{PLATFORM_META[detectedPlatform]?.short || "Tu sistema"}</strong></span>
          <span style={{ opacity: 0.9, color: "var(--accent-primary)", fontWeight: 600 }}>• ¿Cambiar plataforma? ▾</span>
        </button>
      )}

      {/* Multi-platform Dropdown Menu (Opens upward so it is never clipped by card bottom) */}
      {dropdownOpen && (
        <div
          className="glass"
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: 0,
            right: 0,
            zIndex: 9999,
            borderRadius: "14px",
            padding: "10px",
            background: "#161626",
            border: "1px solid var(--accent-primary)",
            boxShadow: "0 -10px 36px rgba(0,0,0,0.7), 0 0 24px rgba(124, 58, 237, 0.25)",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            minWidth: "240px",
            maxHeight: "320px",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "4px 6px 8px 6px",
              borderBottom: "1px solid var(--border-color)",
              marginBottom: "4px",
            }}
          >
            <span
              style={{
                fontSize: "0.74rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                color: "var(--accent-primary)",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span>🚀</span> Descargar para:
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(false);
              }}
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "none",
                borderRadius: "6px",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Cerrar opciones"
            >
              <X size={14} />
            </button>
          </div>

          {availablePlatforms.map((key) => {
            const meta = PLATFORM_META[key];
            const targetUrl = platformData[key];
            const isCurrent = key === primaryKey;

            return (
              <a
                key={key}
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setDropdownOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: isCurrent ? "var(--accent-primary)" : "var(--text-primary)",
                  background: isCurrent ? "rgba(124, 58, 237, 0.18)" : "var(--bg-card)",
                  border: isCurrent ? "1px solid var(--accent-primary)" : "1px solid rgba(255, 255, 255, 0.08)",
                  fontSize: "0.84rem",
                  transition: "background 0.15s, border-color 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isCurrent
                    ? "rgba(124, 58, 237, 0.28)"
                    : "rgba(255, 255, 255, 0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isCurrent
                    ? "rgba(124, 58, 237, 0.18)"
                    : "var(--bg-card)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "1.15rem" }}>{meta.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, lineHeight: 1.2 }}>{meta.short}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>{meta.badge}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {isCurrent && (
                    <span
                      style={{
                        fontSize: "0.68rem",
                        padding: "2px 7px",
                        borderRadius: "10px",
                        background: "var(--accent-primary)",
                        color: "white",
                        fontWeight: 600,
                      }}
                    >
                      Tu sistema
                    </span>
                  )}
                  <Download size={15} style={{ opacity: isCurrent ? 1 : 0.7, color: isCurrent ? "var(--accent-primary)" : undefined }} />
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
