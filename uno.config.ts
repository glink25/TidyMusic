import { defineConfig, transformerDirectives, presetUno, presetIcons } from "unocss";
import fs from "fs";
const loadJSON = (path: string) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), { encoding: "utf-8" }));

export default defineConfig({
  transformers: [transformerDirectives({ enforce: "pre" })],
  presets: [
    presetUno(),
    presetIcons({
      collections: {
        md: () => loadJSON("node_modules/@iconify-json/material-symbols/icons.json"),
        tb: () => loadJSON("node_modules/@iconify-json/tabler/icons.json"),
      },
    }),
    // ...other presets
  ],
  theme: {
    colors: {
      primary: "var(--primary-color, #facc15)",
      text: "rgba(116,115,115,1)",
    },
  },
});
