import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CustomTitleBar } from "./components/titlebar";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pi-Apps",
  description: "New version of Pi-Apps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-hidden">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}>
        <CustomTitleBar />
        <div className="max-h-full h-[93vh] mt-10 overflow-auto">
          <div>
            <Toaster />
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
