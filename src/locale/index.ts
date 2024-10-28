import { createI18n, useI18n } from "vue-i18n";
import en from "./lang/en.json";
import zh from "./lang/zh.json";

export const i18n = createI18n({
  legacy: false,
  locale: "zh",
  messages: {
    en,
    zh,
  },
});
