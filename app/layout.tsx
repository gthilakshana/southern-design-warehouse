import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Southern Design Warehouse | Premium Remodeling Materials",
  description: "Southern Design Warehouse is a trusted remodeling materials showroom and contractor supply warehouse for kitchen, bathroom, and home renovations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased bg-white text-gray-900 scroll-smooth" style={{ fontFamily: 'Arial, sans-serif' }}>
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}