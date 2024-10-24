import { watch } from "vue";

export default function useGlobalBackground(watcher: () => string | undefined) {
  const clean = () => {
    document.body.style.removeProperty("background");
  };
  const setBg = (src: string) => {
    document.body.style.background = `center / 200% no-repeat url(${src}) `;
  };
  watch(watcher, (src) => {
    if (!src) {
      clean();
      return;
    }
    setBg(src);
  });
}
