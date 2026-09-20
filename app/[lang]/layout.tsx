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

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  if (!locales.includes(params.lang)) notFound();

  return (
    <html
      lang={params.lang}
      dir={localeDir[params.lang]}
      className={`${ibmPlex.variable} ${ibmPlexArabic.variable}`}
    >
      <body>
        <div className="side-pattern" aria-hidden />
        {children}
      </body>
    </html>
  );
}