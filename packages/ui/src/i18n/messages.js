import en from "./locales/en";
import zhCN from "./locales/zh-CN";
import zhTW from "./locales/zh-TW";

export const messages = {
  en,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
};

export const supportedLocales = Object.keys(messages);

export const getBrowserLocale = (language = "") => {
  const normalized = language.toLowerCase();

  if (
    normalized === "zh-tw" ||
    normalized === "zh-hk" ||
    normalized === "zh-mo" ||
    normalized.startsWith("zh-hant")
  ) {
    return "zh-TW";
  }

  if (normalized === "zh" || normalized.startsWith("zh-")) {
    return "zh-CN";
  }

  return "en";
};

export const translate = (locale, key) => {
  const localeMessages = messages[locale] || messages.en;

  return key
    .split(".")
    .reduce((value, segment) => value && value[segment], localeMessages);
};
