import { createApp } from "vue";
import App from "@/App.vue";
import "@unocss/reset/tailwind.css";
import "virtual:uno.css";
import "@/styles/index.css";
import { preventContextMenu } from "./utils/event";

preventContextMenu();

createApp(App).mount("#app");
