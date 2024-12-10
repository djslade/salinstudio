import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const islandMoments = localFont({
  src: "./fonts/IslandMoments.ttf",
  variable: "--font-island-moments",
  weight: "400",
});

const afacad = localFont({
  src: "./fonts/Afacad.ttf",
  variable: "--font-afacad",
  weight: "400 500 600 700",
});

const ibmPlexMono = localFont({
  src: "./fonts/IBMPlexMono-Regular.ttf",
  variable: "--ibm-plex-mono",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Salin Studio",
  description: "Art by Miia Salin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body
        className={`${islandMoments.variable} ${afacad.variable} ${ibmPlexMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}

