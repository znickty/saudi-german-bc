import "server-only";
import type { Locale } from "./config";
import { defaultLocale } from "./config"; // Assuming you have a defaultLocale (e.g. 'en')

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  ar: () => import("./dictionaries/ar.json").then((m) => m.default),
  de: () => import("./dictionaries/de.json").then((m) => m.default),
};

export const getDictionary = async (locale: Locale) => {
  const loader = dictionaries[locale] ?? dictionaries[defaultLocale ?? "en"];
  return loader();
};