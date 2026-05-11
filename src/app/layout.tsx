import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SEBA - Digital Directory",
  description: "SEBA Digital Directory App",
  openGraph: {
    title: "SEBA - Digital Directory",
    description: "SEBA Digital Directory App",
    url: "https://seba.org",
    siteName: "SEBA",
    images: [
      {
        url: "https://service.digitalks.co.in/s3docs/seba/surat/ad1115ada39d4062b1a42618d32b64b1.png",
        width: 800,
        height: 600,
        alt: "SEBA Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SEBA - Digital Directory",
    description: "SEBA Digital Directory App",
    images: ["https://service.digitalks.co.in/s3docs/seba/surat/ad1115ada39d4062b1a42618d32b64b1.png"],
  },
};

import { AlertProvider } from "@/context/AlertContext";
import RouteGuard from "@/components/RouteGuard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AlertProvider>
          <RouteGuard>
            {children}
          </RouteGuard>
        </AlertProvider>
      </body>
    </html>
  );
}
