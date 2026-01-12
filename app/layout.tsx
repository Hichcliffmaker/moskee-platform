import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Al-Madrasa | Moskee Platform",
  description: "Beheerplatform voor de moskee en school.",
  appleWebApp: {
    title: "Al-Madrasa",
    statusBarStyle: "black-translucent",
  }
};

export const viewport = {
  themeColor: '#0a1f18',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.variable}>
        {children}
      </body>
    </html>
  );
}
