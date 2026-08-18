"use client";

import React from "react";

interface MarkdownRendererProps {
  content: string;
  style?: React.CSSProperties;
}

export default function MarkdownRenderer({ content, style }: MarkdownRendererProps) {
  if (!content) return null;

  // Split content into blocks by double newlines or single newlines with markdown blocks
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let listBuffer: string[] = [];

  const flushList = (key: string) => {
    if (listBuffer.length > 0) {
      elements.push(
        <ul key={key} style={{ margin: "14px 0 18px 24px", paddingLeft: "12px", lineHeight: 1.8 }}>
          {listBuffer.map((item, idx) => (
            <li key={idx} style={{ marginBottom: "6px" }}>
              {parseInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  };

  const flushCode = (key: string) => {
    if (codeBuffer.length > 0) {
      elements.push(
        <pre
          key={key}
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            padding: "16px 20px",
            borderRadius: "12px",
            overflowX: "auto",
            fontSize: "0.92rem",
            fontFamily: "monospace",
            lineHeight: 1.6,
            margin: "18px 0",
            color: "var(--accent-secondary)",
          }}
        >
          <code>{codeBuffer.join("\n")}</code>
        </pre>
      );
      codeBuffer = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Code block toggle
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        flushCode(`code-${index}`);
        inCodeBlock = false;
      } else {
        flushList(`list-before-code-${index}`);
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    // Unordered List (- or *)
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      listBuffer.push(trimmed.slice(2));
      return;
    } else {
      flushList(`list-${index}`);
    }

    // Empty line
    if (!trimmed) {
      return;
    }

    // Image Markdown: ![alt](url)
    const imageMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imageMatch) {
      const altText = imageMatch[1] || "Imagen del artículo";
      const imageUrl = imageMatch[2];
      elements.push(
        <figure key={`img-${index}`} style={{ margin: "28px 0", textAlign: "center" }}>
          <img
            src={imageUrl}
            alt={altText}
            style={{
              maxWidth: "100%",
              maxHeight: "520px",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              borderRadius: "14px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
              border: "1px solid var(--border-color)",
              display: "inline-block",
            }}
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
          {altText && altText !== "Imagen" && altText !== "image" && (
            <figcaption
              style={{
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                marginTop: "8px",
                fontStyle: "italic",
              }}
            >
              {altText}
            </figcaption>
          )}
        </figure>
      );
      return;
    }

    // Check if line contains inline image(s) within text
    if (trimmed.includes("![") && trimmed.includes("](") && trimmed.includes(")")) {
      // Split and render segments
      const imgRegex = /!\[(.*?)\]\((.*?)\)/g;
      let lastIdx = 0;
      const parts: React.ReactNode[] = [];
      let match;

      while ((match = imgRegex.exec(trimmed)) !== null) {
        if (match.index > lastIdx) {
          parts.push(parseInlineMarkdown(trimmed.substring(lastIdx, match.index)));
        }
        const alt = match[1] || "Imagen";
        const url = match[2];
        parts.push(
          <div key={`inline-img-${index}-${match.index}`} style={{ margin: "24px 0", textAlign: "center" }}>
            <img
              src={url}
              alt={alt}
              style={{
                maxWidth: "100%",
                maxHeight: "520px",
                borderRadius: "14px",
                objectFit: "contain",
                boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
                border: "1px solid var(--border-color)",
              }}
            />
          </div>
        );
        lastIdx = match.index + match[0].length;
      }
      if (lastIdx < trimmed.length) {
        parts.push(parseInlineMarkdown(trimmed.substring(lastIdx)));
      }

      elements.push(<div key={`mixed-img-${index}`}>{parts}</div>);
      return;
    }

    // Headings
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${index}`} style={{ fontSize: "1.35rem", margin: "28px 0 12px 0", color: "var(--text-primary)" }}>
          {parseInlineMarkdown(trimmed.slice(4))}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${index}`} style={{ fontSize: "1.7rem", margin: "34px 0 14px 0", color: "var(--text-primary)" }}>
          {parseInlineMarkdown(trimmed.slice(3))}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith("# ")) {
      elements.push(
        <h1 key={`h1-${index}`} style={{ fontSize: "2rem", margin: "38px 0 16px 0", color: "var(--text-primary)" }}>
          {parseInlineMarkdown(trimmed.slice(2))}
        </h1>
      );
      return;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      elements.push(
        <blockquote
          key={`quote-${index}`}
          style={{
            borderLeft: "4px solid var(--accent-primary)",
            padding: "12px 18px",
            margin: "18px 0",
            background: "var(--bg-secondary)",
            borderRadius: "0 10px 10px 0",
            color: "var(--text-secondary)",
            fontStyle: "italic",
            fontSize: "1.05rem",
          }}
        >
          {parseInlineMarkdown(trimmed.slice(2))}
        </blockquote>
      );
      return;
    }

    // Regular Paragraph
    elements.push(
      <p key={`p-${index}`} style={{ margin: "0 0 16px 0", lineHeight: 1.8, fontSize: "1.08rem" }}>
        {parseInlineMarkdown(trimmed)}
      </p>
    );
  });

  flushList("list-end");
  flushCode("code-end");

  return (
    <div className="markdown-content" style={{ color: "var(--text-secondary)", ...style }}>
      {elements}
    </div>
  );
}

// Helper to parse bold (**), italic (*), code (`), and links ([text](url))
function parseInlineMarkdown(text: string): React.ReactNode {
  if (!text) return "";

  // Split by inline links [text](url)
  const linkRegex = /\[(.*?)\]\((.*?)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(parseFormattedText(text.substring(lastIndex, match.index)));
    }
    const linkText = match[1];
    const linkUrl = match[2];
    parts.push(
      <a
        key={`link-${match.index}`}
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "var(--accent-primary)",
          textDecoration: "underline",
          fontWeight: 600,
        }}
      >
        {linkText}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(parseFormattedText(text.substring(lastIndex)));
  }

  return parts.length > 0 ? parts : parseFormattedText(text);
}

function parseFormattedText(text: string): React.ReactNode {
  // Parse inline bold (**), italic (*), and backticks (`)
  const segments = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

  return segments.map((seg, i) => {
    if (seg.startsWith("**") && seg.endsWith("**") && seg.length > 4) {
      return <strong key={i} style={{ color: "var(--text-primary)", fontWeight: 700 }}>{seg.slice(2, -2)}</strong>;
    }
    if (seg.startsWith("*") && seg.endsWith("*") && seg.length > 2) {
      return <em key={i}>{seg.slice(1, -1)}</em>;
    }
    if (seg.startsWith("`") && seg.endsWith("`") && seg.length > 2) {
      return (
        <code
          key={i}
          style={{
            background: "var(--bg-secondary)",
            padding: "2px 6px",
            borderRadius: "4px",
            fontFamily: "monospace",
            fontSize: "0.9em",
            color: "var(--accent-primary)",
          }}
        >
          {seg.slice(1, -1)}
        </code>
      );
    }
    return seg;
  });
}
