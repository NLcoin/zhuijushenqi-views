import Request from '@/utils/luch-request/index.js'
import $C from '@/common/config.js'
import $H from '@/common/util.js'
import md5Libs from "uview-ui/libs/function/md5";

const getBaseParam = (params) => {
	params.timestamp = Math.round(new Date());
	let paramsSort = $H.ksort(params);
	let queryString = $H.queryString(paramsSort);
	let sign = md5Libs.md5(queryString + $C.app_key);
	return {
		timestamp: params.timestamp,
		sign
	};
}

const http = new Request()

http.setConfig((config) => {
	/* 设置全局配置 */
	config.baseURL = $C.api_url
	config.timeout = 15000;
	return config
})

http.interceptors.request.use((config) => {
	/* 请求之前拦截器。可以使用async await 做异步操作 */
	let {
		timestamp,
		sign
	} = getBaseParam(config.params);
	config.params = {
		...config.params,
		timestamp,
		sign
	}
	return config
}, (config) => {
	return Promise.reject(config)
})


http.interceptors.response.use(async (response) => {
	/* 请求之后拦截器。可以使用async await 做异步操作  */
	if (response.data.errorCode) {
		uni.showToast({
			title: response.data.msg,
			icon: 'none',
			duration: 2000
		});
		return;
	}
	return response.data;
}, (response) => {
	try{
		uni.showToast({
			title: response.data.msg,
			icon: 'none',
			duration: 2000
		});
		return;
	}catch(e){
		return response;
	}
})

export {
	http
}
