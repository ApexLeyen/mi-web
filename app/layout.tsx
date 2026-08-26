import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider/ThemeProvider";
import PublicLayoutWrapper from "@/components/PublicLayoutWrapper/PublicLayoutWrapper";

const BASE_URL = "https://my-web.apexleyen2515.workers.dev";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Muñeco Tecnology — Desarrollo de Apps y Software",
    template: "%s | Muñeco Tecnology",
  },
  description:
    "Muñeco Tecnology: desarrollo de aplicaciones Android, software a medida y soluciones digitales. Descarga apps, conoce proyectos y contrata servicios de desarrollo.",
  keywords: [
    "Muñeco Tecnology",
    "apps APK Android",
    "desarrollo de software",
    "aplicaciones Android",
    "portafolio desarrollador",
    "programador freelance",
    "soluciones digitales",
    "descargar apps gratis",
    "desarrollo web Next.js",
  ],
  authors: [{ name: "Muñeco Tecnology", url: BASE_URL }],
  creator: "Muñeco Tecnology",
  publisher: "Muñeco Tecnology",
  category: "technology",
  alternates: {
    canonical: BASE_URL,
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
    shortcut: "/logo.png",
  },
  openGraph: {
    title: "Muñeco Tecnology — Desarrollo de Apps y Software",
    description:
      "Aplicaciones Android, software a medida y soluciones digitales. Descarga apps y conoce los proyectos de Muñeco Tecnology.",
    url: BASE_URL,
    siteName: "Muñeco Tecnology",
    type: "website",
    locale: "es_ES",
    images: [
      {
        url: `${BASE_URL}/logo.png`,
        width: 512,
        height: 512,
        alt: "Logo de Muñeco Tecnology",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muñeco Tecnology — Desarrollo de Apps y Software",
    description: "Apps Android, software a medida y soluciones digitales.",
    images: [`${BASE_URL}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "7e8UpR4Hbqhec9vTrDv01EC6QE_g_ze8kGXzJsq7O2U",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
};

// JSON-LD Structured Data for Google Rich Results
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Muñeco Tecnology",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description:
    "Desarrollo de aplicaciones Android, software a medida y soluciones tecnológicas digitales.",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    availableLanguage: "Spanish",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="7e8UpR4Hbqhec9vTrDv01EC6QE_g_ze8kGXzJsq7O2U" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <PublicLayoutWrapper>
            {children}
          </PublicLayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
