import { notFound } from "next/navigation";
import { localeDir, locales, type Locale } from "@/i18n/config";
import { IBM_Plex_Sans_Arabic, IBM_Plex_Sans } from "next/font/google";
import "@/globals.css";
import { Metadata } from "next";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["latin", "arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

const ibmPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export const metadata: Metadata = {
  icons: {
    icon: '/icon.png', // points to public/icon.png
  },
};

export default async function LangLayout({ children, params }: LayoutProps) {
  const { lang } = await params;

  if (!locales.includes(lang as Locale)) notFound();
  const locale = lang as Locale;

  return (
    <html lang={locale} dir={localeDir[locale]} data-locale={locale} className={`${ibmPlex.variable} ${ibmPlexArabic.variable}`}>
      <body>
        <div className="side-pattern" aria-hidden />
        {children}
      </body>
    </html>
  );
}