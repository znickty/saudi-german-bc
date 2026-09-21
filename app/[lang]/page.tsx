import { getDictionary } from "@/i18n/get-dictionary";
import { locales, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import BeyondTrade from "../components/BeyondTrade";
import WhySaudi from "../components/WhySaudi";
import Pathways from "../components/Pathways";
import CouncilSupport from "../components/CouncilSupport";
import AfterSubmission from "../components/AfterSubmission";
import InvestorForm from "../components/InvestorForm";
import Footer from "../components/Footer";

type PageProps = {
  params: Promise<{ lang: string }>;
};

export default async function Home({ params }: PageProps) {
  const { lang } = await params;

  if (!locales.includes(lang as Locale)) notFound();
  const locale = lang as Locale;

  const t = await getDictionary(locale);

  return (
    <>
      <Navbar lang={locale} t={t} />
      <main>
        <Hero t={t.hero} />
        <BeyondTrade t={t.beyond} />
        <WhySaudi t={t.whySaudi} />
        <Pathways t={t.pathways} />
        <CouncilSupport t={t.support} />
        <AfterSubmission t={t.after} />
        <InvestorForm t={t.form} lang={locale} />
      </main>
      <Footer t={t.footer} tagline={t.brand.tagline} />
    </>
  );
}