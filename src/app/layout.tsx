import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/pages/shared/Navigation";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PixFusion AI Studio",
  description: "AI-powered image fusion and editing studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <Navigation />
          <main className="flex-grow">
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