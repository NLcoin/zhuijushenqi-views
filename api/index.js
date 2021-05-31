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
	getVodHotMovie(page, pageSize){
		return http.get('/vod/hot/movie', {
			params: {
				page,
				pageSize
			}
		});
	},
	// 获取热门电视剧
	getVodHotTv(page, pageSize){
		return http.get('/vod/hot/tv', {
			params: {
				page,
				pageSize
			}
		});
	},
	// 获取热门综艺
	getVodHotVariety(page, pageSize){
		return http.get('/vod/hot/variety', {
			params: {
				page,
				pageSize
			}
		});
	},
	// 获取热门动漫
	getVodHotComic(page, pageSize){
		return http.get('/vod/hot/comic', {
			params: {
				page,
				pageSize
			}
		});
	},
	// 获取热门列表
	getVodHot(page, pageSize){
		return http.get('/vod/hot/index', {
			params: {
				page,
				pageSize
			}
		});
	}
}
