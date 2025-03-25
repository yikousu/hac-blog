import { createApp } from "vue";
import { createPinia } from "pinia";
// 导入了Element Plus库，它被赋值给了变量ElementPlus 你就可以在应用中使用Element Plus库提供的组件和功能。
import ElementPlus from "element-plus";
// 导入样式
import "element-plus/dist/index.css";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus); //使用了Vue 3的app.use()方法来安装Element Plus库

app.mount("#app");
