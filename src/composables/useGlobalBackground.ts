import { watch } from "vue";

const transparent = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

const prefetch = async (src: string) => {
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const image = new Image();
    image.style.position = "fixed";
    image.style.opacity = "0";
    image.style.top = "-1000px";
    document.body.appendChild(image);
    image.src = src;
    image.onload = () => {
      res(image);
    };
    image.onerror = (err) => {
      image.remove();
      rej(err);
    };
  });
  img.remove();
};

export default function useGlobalBackground(watcher: () => string | undefined) {
  const clean = () => {
    // document.body.style.removeProperty("background");
    document.body.style.background = `center / 200% no-repeat url(${transparent}) `;
  };
  const setBg = async (src: string) => {
    await prefetch(src);
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
