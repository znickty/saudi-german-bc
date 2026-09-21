import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, IBM_Plex_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { localeDir, locales, type Locale } from "@/i18n/config";
import "../globals.css";

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

export const metadata: Metadata = {
  title: "Saudi German Business Council | Invest. Manufacture. Grow.",
  description:
    "The Saudi–German Business Council connects German industrial strength and technology with Saudi investment, manufacturing and regional growth opportunities.",
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export default async function LangLayout({ children, params }: LayoutProps) {
  const { lang } = await params;

  if (!locales.includes(lang as Locale)) notFound();
  const locale = lang as Locale;

  return (
    <html
      lang={locale}
      dir={localeDir[locale]}
      className={`${ibmPlex.variable} ${ibmPlexArabic.variable}`}
    >
      <body>
        <div className="side-pattern" aria-hidden />
        {children}
      </body>
    </html>
  );
}