import Vue from "vue";
// import axios from "./plugins/axios";
import axios from "axios";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
import "./assets/css/global.css";
import "./assets/fonts/iconfont.css";
import TreeTable from "vue-table-with-tree-grid";

axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1/";
axios.interceptors.request.use(config => {
  //通过拦截器添加session验证
  config.headers.Authorization = sessionStorage.getItem("token");
  return config;
});
Vue.prototype.$http = axios;

Vue.config.productionTip = false;
Vue.component("tree-table", TreeTable);
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
