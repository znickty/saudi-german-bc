"use client";
import { usePathname, useRouter } from "next/navigation";
import { locales, localeNames, type Locale } from "@/i18n/config";

export default function LanguageSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(lang: Locale) {
    const segments = pathname.split("/").filter(Boolean);
    segments[0] = lang;
    router.push("/" + segments.join("/"));
  }

  return (
    <div className="lang-switch">
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          className={l === current ? "active" : ""}
          aria-label={localeNames[l]}
        >
          {localeNames[l]}
        </button>
      ))}
    </div>
  );
}