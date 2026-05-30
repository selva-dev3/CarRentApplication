import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "./providers";

export const metadata: Metadata = {
  title: "APEX — Luxury Car Rentals",
  description: "Experience the pinnacle of automotive luxury. Rent hypercars, supercars, and premium vehicles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-body antialiased">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
