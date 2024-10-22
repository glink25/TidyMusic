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
      },
    }),
    // ...other presets
  ],
  theme: {
    colors: {
      primary: "var(--primary-color, #facc15)",
    },
  },
});
