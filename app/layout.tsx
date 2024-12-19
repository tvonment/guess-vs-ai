import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import React from 'react';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Guess vs AI",
  description: "Play a game of guess what against an AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/images/favicon-16x16.png" sizes="16x16" />
        <link rel="icon" href="/images/favicon-32x32.png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" sizes="180x180" />
        <meta name="theme-color" content="#fe9b39" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col items-center justify-center min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
