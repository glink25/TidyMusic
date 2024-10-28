import { createApp } from "vue";
import App from "@/App.vue";
import "@unocss/reset/tailwind.css";
import "virtual:uno.css";
import "@/styles/index.css";
import { preventContextMenu } from "./utils/event";
import { i18n } from "./locale";

preventContextMenu();

const app = createApp(App);
app.use(i18n);

app.mount("#app");
