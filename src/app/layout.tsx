import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/pages/shared/Navigation";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // ⚡ Show text immediately with fallback font
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap', // ⚡ Show text immediately with fallback font
  preload: true,
  fallback: ['Courier New', 'monospace'],
});

export const metadata: Metadata = {
  title: "PixFusion AI Studio",
  description: "AI-powered image fusion and editing studio",
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:rgb(168,85,247);stop-opacity:1" /><stop offset="100%" style="stop-color:rgb(236,72,153);stop-opacity:1" /></linearGradient></defs><rect fill="url(%23grad)" width="100" height="100" rx="20"/><text x="50" y="70" font-size="60" font-weight="bold" fill="white" text-anchor="middle" font-family="Arial">P</text></svg>',
        type: 'image/svg+xml',
      }
    ],
    apple: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:rgb(168,85,247);stop-opacity:1" /><stop offset="100%" style="stop-color:rgb(236,72,153);stop-opacity:1" /></linearGradient></defs><rect fill="url(%23grad)" width="100" height="100" rx="20"/><text x="50" y="70" font-size="60" font-weight="bold" fill="white" text-anchor="middle" font-family="Arial">P</text></svg>',
      }
    ],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to speed up external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <Navigation />
          <main className="flex-grow page-enter">
            {children}
          </main>
          <Toaster 
            position="top-center" 
            richColors 
            closeButton
            toastOptions={{
              style: {
                background: 'rgba(15, 5, 32, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}