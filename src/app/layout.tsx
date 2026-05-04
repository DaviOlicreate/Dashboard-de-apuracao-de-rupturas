import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Apuração de Rupturas",
  description: "Painel comercial de apuração de rupturas em lojas",
};

export const viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
