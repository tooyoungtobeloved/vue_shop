import Vue from "vue";
// import axios from "./plugins/axios";
import axios from "axios";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
import "./assets/css/global.css";
import "./assets/fonts/iconfont.css";

// axios.defaults.baseURL = "http://127.0.0.1:8080";
Vue.prototype.$http = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
