import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GPL Perto de Ti",
  description: "Encontra o GPL mais barato perto de ti em Portugal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          crossOrigin=""
        />
      </head>
      <body className="bg-gray-50 text-gray-900 min-h-screen">{children}</body>
    </html>
  );
}
