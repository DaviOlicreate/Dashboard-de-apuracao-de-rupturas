import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Painel São Luiz | Rupturas",
  description: "Painel executivo de apuração de rupturas do Supermercados São Luiz",
};

export const viewport = {
  themeColor: "#f97316", // Laranja vibrante
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
      <body className={`${poppins.variable} font-sans`}>{children}</body>
    </html>
  );
}
