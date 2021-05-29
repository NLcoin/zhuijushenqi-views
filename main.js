import Vue from 'vue'
import App from './App'
import {
	http
} from '@/api/service.js'
import api from '@/api/index.js'

// 引入uview-ui组件
import uView from "uview-ui";
Vue.use(uView);

// HTTP请求组件
Vue.prototype.$http = http;

// API封装
Vue.prototype.$api = api;

// 引入全局配置文件
import $C from '@/common/config.js';
Vue.prototype.$C = $C;

// 引入助手函数
import $H from '@/common/util.js';
Vue.prototype.$H = $H;

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
