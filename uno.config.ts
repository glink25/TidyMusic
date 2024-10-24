import { defineConfig, transformerDirectives, presetUno, presetIcons, presetMini } from "unocss";
import { presetTheme } from "unocss-preset-theme";
import fs from "fs";
const loadJSON = (path: string) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), { encoding: "utf-8" }));

const themes = {
  dark: {
    colors: {
      primary: "rgba(217, 173, 0, 1)",
      text: "#fff",
      icon: "#fff",
      bg: "#333",
    },
  } as any,
  light: {
    colors: {
      primary: "#facc15",
      text: "#fff",
      icon: "rgba(116,115,115,1)",
      bg: "#fff",
    },
  },
};

export default defineConfig({
  transformers: [transformerDirectives({ enforce: "pre" })],
  presets: [
    presetUno({
      dark: "media",
    }),
    presetTheme({
      theme: {
        dark: themes.dark,
      },
    }),
    presetIcons({
      collections: {
        md: () => loadJSON("node_modules/@iconify-json/material-symbols/icons.json"),
        tb: () => loadJSON("node_modules/@iconify-json/tabler/icons.json"),
      },
    }),
    // ...other presets
  ],
  theme: themes.light,
});
