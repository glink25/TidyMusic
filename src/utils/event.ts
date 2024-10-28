export const preventContextMenu = () => {
  document.addEventListener(
    "contextmenu",
    (e) => {
      e.preventDefault();
      console.log("context captured", (e.target as HTMLElement).dataset["allow-contextmenu"]);
      if ((e.target as HTMLElement).dataset["allow-contextmenu"] === undefined) {
        e.stopPropagation();
      }
    },
    { capture: true }
  );
};
