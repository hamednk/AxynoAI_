import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { JetBrains_Mono, Michroma, Syne, Vazirmatn } from "next/font/google";
import { ThemeProvider, ThemeScript } from "@/components/providers/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AxisRail } from "@/components/layout/AxisRail";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { routing } from "@/i18n/routing";
import { site } from "@/lib/site";
import type { Metadata, Viewport } from "next";
import "../globals.css";

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

const michroma = Michroma({
  variable: "--font-michroma",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    metadataBase: new URL("https://axynoai.com"),
    title: {
      default: `${t("tagline")} | ${site.name}`,
      template: `%s | ${site.name}`,
    },
    description: t("description"),
    openGraph: {
      title: `${t("tagline")} | ${site.name}`,
      description: t("description"),
      siteName: site.name,
      locale: locale === "fa" ? "fa_IR" : "en_US",
      type: "website",
      images: [{ url: site.logo }],
    },
    icons: {
      icon: [
        { url: "/favicon.png", type: "image/png" },
        { url: "/logo.png", type: "image/png" },
      ],
      apple: [{ url: "/logo.png", type: "image/png" }],
      shortcut: "/favicon.png",
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === "fa" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      data-scroll-behavior="smooth"
      className={`dark ${vazirmatn.variable} ${syne.variable} ${michroma.variable} ${jetbrains.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="relative flex min-h-full min-w-0 flex-col font-sans antialiased">
        <ThemeScript />
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <AxisRail />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <ChatWidget />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
