import {
	http
} from '@/api/service.js';

export default {
	// 获取影片轮播图
	getVodSlider() {
		return http.get('/vod/slider');
	},
	// 获取影片今日更新
	getVodToday(page, pageSize) {
		return http.get('/vod/today', {
			params: {
				page,
				pageSize
			}
		});
	},
	// 获取最新资讯
	getArtNew(page, pageSize){
		return http.get('/art/new', {
			params: {
				page,
				pageSize
			}
		});
	},
	// 获取热门电影
	getVodHot(page, pageSize){
		return http.get('/vod/hot', {
			params: {
				page,
				pageSize
			}
		});
	}
}
