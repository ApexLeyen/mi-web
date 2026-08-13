import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { ThemeProvider } from "@/components/ThemeProvider/ThemeProvider";

export const metadata: Metadata = {
  title: "Muñeco Tecnology — Transformando ideas en soluciones digitales",
  description:
    "Plataforma oficial de Muñeco Tecnology. Descarga apps, conoce proyectos y contrata los mejores servicios de desarrollo de software, aplicaciones y soluciones tecnológicas.",
  keywords: [
    "Muñeco Tecnology",
    "apps APK",
    "desarrollo de software",
    "portafolio",
    "desarrollador",
    "aplicaciones Android",
  ],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Muñeco Tecnology",
    description: "Transformando ideas en soluciones digitales.",
    type: "website",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
