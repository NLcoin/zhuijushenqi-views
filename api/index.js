import {
	http
} from '@/api/service.js';

export default {
	// 获取配置信息
	getConfig() {
		return http.get('/config');
	},
	// 解析播放地址
	parseUrl(url, type) {
		return http.get('/vod/parse', {
			params: {
				url,
				type
			}
		});
	},
	// 获取影片轮播图
	getVodSlider(type) {
		return http.get('/vod/slider', {
			params: {
				type
			}
		});
	},
	// 获取影片今日更新
	getVodToday(page, pageSize, type) {
		return http.get('/vod/today', {
			params: {
				page,
				pageSize,
				type
			}
		});
	},
	// 获取热门电影
	getVodHotMovie(page, pageSize) {
		return http.get('/vod/hot/movie', {
			params: {
				page,
				pageSize
			}
		});
	},
	// 获取热门电视剧
	getVodHotTv(page, pageSize) {
		return http.get('/vod/hot/tv', {
			params: {
				page,
				pageSize
			}
		});
	},
	// 获取热门综艺
	getVodHotVariety(page, pageSize) {
		return http.get('/vod/hot/variety', {
			params: {
				page,
				pageSize
			}
		});
	},
	// 获取热门动漫
	getVodHotComic(page, pageSize) {
		return http.get('/vod/hot/comic', {
			params: {
				page,
				pageSize
			}
		});
	},
	// 获取热门列表
	getVodHot(page, pageSize, type) {
		return http.get('/vod/hot/index', {
			params: {
				page,
				pageSize,
				type
			}
		});
	},
	// 搜索影片
	searchVod(keyword, page = 1, pageSize = 10) {
		return http.get('/vod/search/index', {
			params: {
				keyword,
				page,
				pageSize
			}
		});
	},
	// 搜索提示
	searchComplete(keyword, pageSize = 10) {
		return http.get('/vod/search/complete', {
			params: {
				keyword,
				pageSize
			}
		});
	},
	// 搜索热词
	searchHotWords() {
		return http.get('/vod/search/hotwords');
	},
	// 影片详情
	vodDetail(id) {
		return http.get('/vod/detail/' + id, {
			params: {
				vod_id: id
			}
		});
	},
	// 加入房间
	addRoom(params) {
		return http.post('/room/add', params);
	},
	// 发送房间消息
	sendRoomMessage(params) {
		return http.post('/room/send', params);
	},
	// 获取房间人数
	getRoomNum(roomId) {
		return http.get('/room/online?roomId=' + roomId);
	},
	// 退出房间
	exitRoom(params) {
		return http.post('/room/exit', params);
	},
	// 房间消息记录
	getRoomLog(roomId) {
		return http.get('/room/index?roomId=' + roomId);
	},
	// 房间弹幕列表
	getRoomDm(roomId, episodeCurrent) {
		return http.get('/room/dm?roomId=' + roomId + '&episodeCurrent=' + episodeCurrent);
	},
	// 短链接生成
	suoUrl(url) {
		return http.get('/suo?url=' + url);
	},
	// 话题列表
	topicList(page, pageSize) {
		return http.get('/topic/new', {
			params: {
				page,
				pageSize
			}
		});
	},
	// 话题轮播
	topicSlider() {
		return http.get('/topic/slider');
	},
	// 话题详情
	topicDetail(topic_id) {
		return http.get('/topic/detail/' + topic_id);
	},
}
