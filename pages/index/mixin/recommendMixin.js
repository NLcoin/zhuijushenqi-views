export default {
	data() {
		return {
			recommend: {
				load: false,
				today: {},
				hotMovie: [],
				hotTv: [],
				hotVariety: [],
				hotComic: [],
				sliderList: [],
				more: {
					page: 1,
					pageSize: 9,
					loadStatus: 'loading',
					list: []
				}
			}
		}
	},
	methods: {
		async loadRePage() {
			// 加载轮播图
			await this.initSlider();
			// 今日更新
			await this.initToday();
			// 热门电影
			await this.initHotMovie();
			// 热门电视剧
			await this.initHotTv();
			// 热门综艺
			await this.initHotVariety();
			// 热门动漫
			await this.initHotComic();
		},
		async initSlider() {
			let res = await this.$api.getVodSlider(0);
			this.recommend.sliderList = res.data.list;
		},
		async initToday() {
			let res = await this.$api.getVodToday(1, 9);
			this.recommend.today = res.data;
		},
		async initHotMovie() {
			let res = await this.$api.getVodHotMovie(1, 9);
			this.recommend.hotMovie = res.data.list;
		},
		async initHotTv() {
			let res = await this.$api.getVodHotTv(1, 9);
			this.recommend.hotTv = res.data.list;
		},
		async initHotVariety() {
			let res = await this.$api.getVodHotVariety(1, 9);
			this.recommend.hotVariety = res.data.list;
		},
		async initHotComic() {
			let res = await this.$api.getVodHotComic(1, 9);
			this.recommend.hotComic = res.data.list;
		},
		async loadReMore() {
			if (this.recommend.more.loadStatus != 'loadmore') return;
			this.recommend.more.page += 1;
			this.recommend.more.loadStatus = 'loading';
			await this.loadReData();
		},
		async loadReData() {
			let res = await this.$api.getVodHot(this.recommend.more.page, this.recommend.more.pageSize);
			if (res.data.page == 1) {
				this.recommend.more.list = res.data.list;
			} else {
				this.recommend.more.list = this.recommend.more.list.concat(res.data.list);
			}
			this.recommend.more.loadStatus = 'loadmore';
			if (res.data.list.length < this.recommend.more.pageSize) this.recommend.more.loadStatus =
				'nomore';
		}
	}
}
