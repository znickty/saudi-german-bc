import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import LanguageSwitcher from "./LanguageSwitcher";

type Dict = {
  brand: { name: string; nameAr: string };
  nav: { whySaudi: string; pathways: string; support: string; membership: string; cta: string };
};

export default function Navbar({ lang, t }: { lang: Locale; t: Dict }) {
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link href={`/${lang}`} className="logo" aria-label={t.brand.name}>
          <div className="logo-partners">
            <Image src="/logomark.png" alt={t.brand.name} width={180} height={50} priority />
            <span className="logo-divider" aria-hidden>|</span>
            <Image src="/fsc-logo.svg" alt="Federation of Saudi Chambers" width={110} height={50} priority />
          </div>
          {/* <div className="logo-text">
            <span className="en">{t.brand.name}</span>
            <span className="ar">{t.brand.nameAr}</span>
          </div> */}
        </Link>

        <nav className="nav-links">
          <a href="#why-saudi">{t.nav.whySaudi}</a>
          <a href="#pathways">{t.nav.pathways}</a>
          <a href="#support">{t.nav.support}</a>
          <a href="#membership">{t.nav.membership}</a>
          <a href="#investor-form" className="nav-cta">{t.nav.cta}</a>
          <LanguageSwitcher current={lang} />
        </nav>
      </div>
    </header>
  );
}