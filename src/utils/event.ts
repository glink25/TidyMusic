export const preventContextMenu = () => {
  document.addEventListener(
    "contextmenu",
    (e) => {
      if (import.meta.env.DEV) {
        return;
      }
      if (
        (e.target as HTMLElement).dataset["allow-contextmenu"] === undefined &&
        !["input", "textarea"].includes((e.target as HTMLElement).tagName.toLowerCase())
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    { capture: true }
  );
};
