import Vue from "vue";
// import axios from "./plugins/axios";
import axios from "axios";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
import "./assets/css/global.css";
import "./assets/fonts/iconfont.css";
import TreeTable from "vue-table-with-tree-grid";
import VueQuillEditor from "vue-quill-editor";
import "quill/dist/quill.core.css"; // import styles
import "quill/dist/quill.snow.css"; // for snow theme
import "quill/dist/quill.bubble.css"; // for bubble theme
Vue.use(VueQuillEditor);

axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1/";
axios.interceptors.request.use(config => {
  //通过拦截器添加session验证
  config.headers.Authorization = sessionStorage.getItem("token");
  return config;
});
Vue.prototype.$http = axios;
Vue.filter("dateFormat", function(originTime) {
  const dt = new Date(originTime);
  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + "").padStart("0", 2);
  const d = (dt.getDate() + 1 + "").padStart("0", 2);
  const hh = (dt.getHours() + 1 + "").padStart("0", 2);
  const mm = (dt.getMinutes() + 1 + "").padStart("0", 2);
  const ss = (dt.getSeconds() + 1 + "").padStart("0", 2);
  return `${y}-${m}-${d}-${hh}:${mm}:${ss}`;
});

Vue.config.productionTip = false;
Vue.component("tree-table", TreeTable);
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
