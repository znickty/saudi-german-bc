import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import BeyondTrade from "../components/BeyondTrade";
import WhySaudi from "../components/WhySaudi";
import Pathways from "../components/Pathways";
import CouncilSupport from "../components/CouncilSupport";
import AfterSubmission from "../components/AfterSubmission";
import InvestorForm from "../components/InvestorForm";
import Footer from "../components/Footer";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const t = await getDictionary(lang);

  return (
    <>
      <Navbar lang={lang} t={t} />
      <main>
        <Hero t={t.hero} />
        <BeyondTrade t={t.beyond} />
        <WhySaudi t={t.whySaudi} />
        <Pathways t={t.pathways} />
        <CouncilSupport t={t.support} />
        <AfterSubmission t={t.after} />
        <InvestorForm t={t.form} lang={lang} />
      </main>
      <Footer t={t.footer} tagline={t.brand.tagline} />
    </>
  );
}