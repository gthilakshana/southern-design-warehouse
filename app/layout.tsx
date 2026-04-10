import type { Metadata } from "next";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: "Southern Design Warehouse | Premium Remodeling Materials",
    template: "%s | Southern Design Warehouse"
  },
  description: "Southern Design Warehouse is a trusted remodeling materials showroom and contractor supply warehouse for kitchen, bathroom, and home renovations. Experience excellence in design and scale.",
  keywords: ["Southern Design Warehouse", "remodeling materials", "kitchen renovation", "bathroom materials", "contractor supply", "warehouse", "showroom", "Tampa FL"],
  openGraph: {
    title: "Southern Design Warehouse",
    description: "Premium Remodeling Materials & Contractor Supply Warehouse.",
    url: "https://southerndesignwarehouse.com",
    siteName: "Southern Design Warehouse",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Southern Design Warehouse Logo"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Southern Design Warehouse",
    description: "Premium Remodeling Materials & Contractor Supply Warehouse.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased bg-white text-gray-900 scroll-smooth" style={{ fontFamily: 'Arial, sans-serif' }}>
        <NextTopLoader
          color="#dc2626"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #dc2626,0 0 5px #dc2626"
        />
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}