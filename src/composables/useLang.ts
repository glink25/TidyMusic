import { i18n, messages } from "@/locale";
import { useSettings } from "./useStorage";
import { computed } from "vue";

const useLang = (() => {
  const options = messages.map((e) => ({ label: e.label, locale: e.locale }));
  const { lang, loaded } = useSettings();
  loaded.then(() => {
    i18n.global.locale.value = lang.value;
  });
  const locale = computed({
    get: () => lang.value,
    set: (v: string) => {
      i18n.global.locale.value = v;
      lang.value = v;
    },
  });
  return () => {
    return {
      locale: locale,
      options,
    };
  };
})();

export default useLang;
