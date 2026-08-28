import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AdminLayout } from "@/src/components/layout/AdminLayout";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neria Collective — Operations & E-Commerce Admin Console",
  description: "Internal commerce management dashboard for Neria Collective fashion operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} antialiased`}>
      <body className="bg-[#FFF4F8] text-[#263550] min-h-screen">
        <AdminLayout>
          {children}
        </AdminLayout>
      </body>
    </html>
  );
}
