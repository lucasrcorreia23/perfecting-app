import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Perfecting - Treinamento de Vendas com IA",
  description: "Plataforma de agentes de IA para treinamento de times de vendas através de role-plays e simulações de conversas.",
  keywords: ["treinamento de vendas", "IA", "role-play", "simulação", "vendas"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased bg-[#FAFAFA] text-[#1F2937]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
