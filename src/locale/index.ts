import { createI18n } from "vue-i18n";
import en from "./lang/en.json";
import zh from "./lang/zh.json";
import { useSettings } from "@/composables/useStorage";

export const messages = [
  {
    locale: "en",
    message: en,
    label: "English",
  },
  {
    locale: "zh-CN",
    message: zh,
    label: "中文",
  },
];

export const { lang } = useSettings();

export const i18n = createI18n({
  legacy: false,
  locale: lang.value,
  fallbackLocale: "en",
  messages: Object.fromEntries(messages.map(({ locale, message }) => [locale, message])),
});
