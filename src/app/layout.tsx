import type { Metadata } from "next";
import { JetBrains_Mono, Syne, Vazirmatn } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AxisRail } from "@/components/layout/AxisRail";
import { site } from "@/lib/site";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.tagline} | ${site.name}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  metadataBase: new URL("https://axynoai.com"),
  openGraph: {
    title: `${site.tagline} | ${site.name}`,
    description: site.description,
    siteName: site.name,
    locale: "fa_IR",
    type: "website",
    images: [{ url: site.logo }],
  },
  icons: {
    icon: site.logo,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      data-scroll-behavior="smooth"
      className={`${vazirmatn.variable} ${syne.variable} ${jetbrains.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="relative flex min-h-full flex-col font-sans antialiased">
        <ThemeProvider>
          <AxisRail />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
