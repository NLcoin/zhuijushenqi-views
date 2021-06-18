let isError = false;
export default {
	data() {
		return {
			detail: {}, // 视频详情数据
			handle: null, // 操作句柄
			cache: null, // 缓存数据
			isFullscreen: false, // 是否全屏
			autoplay: true, // 是否自动播放
			duration: 0, // 视频总时长
			current: 0, // 当前播放进度
			controls: false, // 是否打开控制层
			objectFit: 'contain', // 视频填充模式
			episodeCurrent: 0, // 当前播放集数
			playUrl: null, // 当前播放地址
			toEpi: null,
			episode: [], // 当前播放剧集列表
			episodeList: [], // 剧集列表
			playFrom: [], // 播放源
			playFromIndex: 0, // 当前播放源
			supportRate: [ // 支持的倍速
				0.5,
				0.8,
				1.0,
				1.25,
				1.5,
				2.0
			],
			popupH: 0,
			rateIndex: 2, // 播放倍速 index
			rateMenu: false, // 倍速菜单
			episodeListMenu: false, // 剧集菜单
			fromMenu: false, // 播放源菜单
		}
	},
	computed: {
		replaceContent() {
			try {
				return this.detail.vod_content.replace(/<[^>]+>/g, "");
			} catch (e) {
				//TODO handle the exception
			}
		},
		title() {
			try {
				return this.detail.vod_name + ' ' + this.episode[this.episodeCurrent].episode;
			} catch (e) {
				//TODO handle the exception
			}
		},
		fromName() {
			try {
				return this.playFrom[this.playFromIndex].name;
			} catch (e) {
				//TODO handle the exception
			}
		},
		fromData() {
			try {
				return this.playFrom[this.playFromIndex];
			} catch (e) {
				//TODO handle the exception
			}
		}
	},
	methods: {
		exitFullScreen() {
			if (this.isFullscreen && this.handle) this.handle.exitFullScreen();
		},
		async initPlay() {
			if (!this.handle) this.handle = uni.createVideoContext(`play`, this);
			this.episodeList = this.detail.vod_play_url;
			this.playFrom = this.detail.vod_play_from;
			this.episode = this.episodeList[this.playFromIndex];
			this.loadPlayUrl();
		},
		cachePlay() {
			if (!this.handle && !this.detail.hasOwnProperty('vod_id')) {
				return;
			}
			let {
				vod_id,
				vod_pic,
				vod_remarks
			} = this.detail;
			let cache = uni.getStorageSync('history') || [];
			let cacheId = cache.findIndex(v => v.vod_id == vod_id);
			let saveData = {
				vod_id,
				vod_pic,
				vod_remarks,
				uptime: this.$H.getTime(),
				duration: Math.floor(this.duration),
				current: Math.floor(this.current),
				episodeCurrent: this.episodeCurrent,
				playFrom: this.playFromIndex,
				title: this.title,
				fromName: this.fromName
			};
			if (cacheId == '-1') {
				cache.unshift(saveData);
				if (cache.length >= 20) cache.pop();
			} else {
				cache[cacheId] = saveData;
			}
			uni.setStorageSync('history', cache);
		},
		async initCache() {
			let {
				vod_id
			} = this.detail;
			let cache = uni.getStorageSync('history') || [];
			let cacheId = cache.findIndex(v => v.vod_id == vod_id);
			if (cacheId == '-1') return;
			this.cache = cache[cacheId];
			if (this.cache) {
				this.playFromIndex = this.cache.playFrom;
				this.episodeCurrent = this.cache.episodeCurrent;
				this.duration = this.cache.duration;
				this.current = this.cache.current;
				this.$H.msg('正在加载上次播放记录');
			}
		},
		fullscreenchange(e) {
			this.isFullscreen = e.detail.fullscreen;
		},
		timeupdate(e) {
			this.duration = e.detail.duration;
			this.current = e.detail.currentTime;
		},
		toMsgCurrent(current, episodeCurrent) {
			if (!this.handle) return;
			if(this.episodeCurrent != episodeCurrent){
				this.episodeCurrent = episodeCurrent;
			}
			this.handle.seek(parseInt(current));
			this.$H.msg('已跳转至该消息播放位置');
		},
		showControls(e) {
			this.controls = e.detail.show;
		},
		openRateMenu() {
			this.rateMenu = !this.rateMenu;
			this.fromMenu = false;
		},
		changeRate(index) {
			this.rateIndex = index;
			this.rateMenu = false;
			this.handle.playbackRate(this.supportRate[index]);
		},
		changeObjectFit(val) {
			this.objectFit = val;
		},
		lastEpisode() {
			if (this.episodeCurrent < 1) {
				return this.$H.msg('没有上一集了');
			}
			this.changeEpisode(this.episodeCurrent - 1);
		},
		nextEpisode() {
			if (this.episodeCurrent == this.episode.length - 1) {
				return this.$H.msg('没有下一集了');
			}
			this.changeEpisode(this.episodeCurrent + 1);
		},
		changeEpisode(index) {
			if (this.episodeCurrent == index) return;
			this.controls = false;
			this.episodeCurrent = index;
			this.current = 0;
			this.loadPlayUrl();
			setTimeout(() => {
				this.changeToEpi();
				this.controls = true;
			}, 10);
		},
		openEpisodeListMenu() {
			this.episodeListMenu = !this.episodeListMenu;
			this.toEpi = null;
			if (this.episodeListMenu) {
				setTimeout(() => this.$refs['epiList'].open(), 10);
			} else {
				this.$refs['epiList'].close();
			}
			setTimeout(() => {
				this.changeToEpi();
			}, 300);
		},
		changeToEpi() {
			const index = this.episodeCurrent + 1;
			this.toEpi = 'epi' + index;
		},
		openFromMenu() {
			this.fromMenu = !this.fromMenu;
			this.rateMenu = false;
		},
		async changeFrom(index) {
			if (this.playFromIndex == index) return;
			this.playFromIndex = index;
			this.fromMenu = false;
			this.controls = false;
			this.episode = this.episodeList[this.playFromIndex];
			this.loadPlayUrl();
			setTimeout(() => {
				this.controls = true;
			}, 10);
		},
		loadPlayUrl() {
			try {
				this.playUrl = '';
				let url = this.episode[this.episodeCurrent].src;
				if (this.fromData.get_url && url) {
					this.playUrl = this.$H.getConfig(this.fromData.get_url) + url;
					return;
				}
				this.playUrl = url;
			} catch (e) {
				//TODO handle the exception
			}
		},
		error(e) {
			if (isError) return;
			isError = true;
			uni.showModal({
				showCancel: false,
				content: '视频加载慢或长时间无反应，可尝试切换播放源如无其他播放源可搜索同名其他资源播放,部分蓝光资源可能加载时间会稍微长一些，有任何疑问可加群或联系客服解决。',
				confirmText: '我知道了'
			});
		}
	}
}
