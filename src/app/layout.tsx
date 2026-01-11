import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Emagreça Sem Sofrer | Sua jornada começa aqui",
    template: "%s | Emagreça Sem Sofrer",
  },
  description: "O método para perder peso sem abrir mão do que você ama comer. Sem dietas restritivas, sem passar fome, sem culpa. Cardápios personalizados e tracker de progresso.",
  keywords: ["emagrecimento", "dieta", "saúde", "nutrição", "perder peso", "emagrecer", "cardápio personalizado", "tracker de peso"],
  authors: [{ name: "Emagreça Sem Sofrer" }],
  creator: "Emagreça Sem Sofrer",
  publisher: "Emagreça Sem Sofrer",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "Emagreça Sem Sofrer",
    description: "O método para perder peso sem abrir mão do que você ama comer. Sem dietas restritivas, sem passar fome, sem culpa.",
    type: "website",
    locale: "pt_BR",
    siteName: "Emagreça Sem Sofrer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Emagreça Sem Sofrer",
    description: "O método para perder peso sem abrir mão do que você ama comer.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
