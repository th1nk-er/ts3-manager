import Vue from "vue";
import VueI18n from "vue-i18n";
import store from "@/store";
import {
  getBrowserLocale,
  messages,
  supportedLocales,
} from "./messages";

Vue.use(VueI18n);

const browserLocale = getBrowserLocale(navigator.language);
const locale = supportedLocales.includes(store.state.settings.locale)
  ? store.state.settings.locale
  : browserLocale;

// Keep the persisted store and the i18n instance in sync from the first render.
store.commit("setLocale", locale);

export default new VueI18n({
  locale,
  fallbackLocale: "en",
  messages,
  silentFallbackWarn: process.env.NODE_ENV === "production",
});
