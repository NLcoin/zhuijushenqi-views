<template>
	<view>
		<u-navbar :is-back="false" title-color="#222" title-bold :border-bottom="false" title-size="30">
			<view class="ml-3 f7 font33">热门影视推荐</view>
		</u-navbar>
		<view class="u-skeleton">
			<u-notice-bar type="none" :hair-line="false" :list="$H.getConfig('notices')" v-if="!loading && $H.getConfig('notices')">
			</u-notice-bar>
			<view style="z-index: 99;position: sticky;" :style="{top:searchTop+'px'}">
				<view class="p-2 bg-bai">
					<u-search placeholder="输入影片名 演员或导演搜索" :show-action="false" disabled class="u-skeleton-fillet"
						@click="toSearch()"></u-search>
				</view>
			</view>
			<view class="mx-2">
				<view class="mb-3 u-skeleton-fillet">
					<u-swiper :list="sliderList" img-mode="aspectFill" :title="true" bg-color="#fff" height="380"
						border-radius="8" :effect3d="false" @click="clickSwiper">
					</u-swiper>
				</view>
				
				<view class="mt-4 mb-3 u-skeleton-rect">
					<u-section title="今日更新" font-size="29" :show-line="false"
						@click="toMore('今日更新'+today.total+'部影片','today')">
					</u-section>
				</view>

				<scroll-view scroll-x="true">
					<template v-if="loading">
						<!-- 骨架屏模拟数据 -->
						<view class="flex align-center justify-between">
							<view class="u-skeleton-fillet vodskeleton mr-1"></view>
							<view class="u-skeleton-fillet vodskeleton mr-1"></view>
							<view class="u-skeleton-fillet vodskeleton"></view>
						</view>
						<!-- end -->
					</template>
					<template v-else>
						<view class="flex align-center justify-between">
							<block v-for="(item,index) in today.list" :key="index">
								<vod-item :item="item" listClass="mr-2">
								</vod-item>
							</block>
						</view>
					</template>
				</scroll-view>
				
				<!-- ad -->
				<view class="mt-2">
					<vod-ad name="index_banner" v-if="!loading"></vod-ad>
				</view>

				<view class="mt-4 mb-3 u-skeleton-rect">
					<u-section title="热门电影" font-size="29" :show-line="false" @click="toMore('热门电影','hotMovie')">
					</u-section>
				</view>

				<template v-if="loading">
					<!-- 骨架屏模拟数据 -->
					<view class="flex align-center justify-between flex-wrap">
						<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mb-4"></view>
					</view>
					<!-- end -->
				</template>
				<template v-else>
					<view class="flex align-center justify-between flex-wrap voditem">
						<block v-for="(item,index) in hotMovie" :key="index">
							<vod-item :item="item"></vod-item>
						</block>
					</view>
				</template>

				<view class="mt-4 mb-3 u-skeleton-rect">
					<u-section title="热门电视剧" font-size="29" :show-line="false" @click="toMore('热门电视剧','hotTv')">
					</u-section>
				</view>

				<template v-if="loading">
					<!-- 骨架屏模拟数据 -->
					<view class="flex align-center justify-between flex-wrap">
						<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mb-4"></view>
					</view>
					<!-- end -->
				</template>
				<template v-else>
					<view class="flex align-center justify-between flex-wrap voditem">
						<block v-for="(item,index) in hotTv" :key="index">
							<vod-item :item="item"></vod-item>
						</block>
					</view>
				</template>
				
				<!-- ad -->
				<view class="mt-2">
					<vod-ad name="index_banner2" v-if="!loading"></vod-ad>
				</view>

				<view class="mt-4 mb-3 u-skeleton-rect">
					<u-section title="热门综艺" font-size="29" :show-line="false" @click="toMore('热门综艺','hotVariety')">
					</u-section>
				</view>

				<template v-if="loading">
					<!-- 骨架屏模拟数据 -->
					<view class="flex align-center justify-between flex-wrap">
						<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mb-4"></view>
					</view>
					<!-- end -->
				</template>
				<template v-else>
					<view class="flex align-center justify-between flex-wrap voditem">
						<block v-for="(item,index) in hotVariety" :key="index">
							<vod-item :item="item"></vod-item>
						</block>
					</view>
				</template>


				<view class="mt-4 mb-3 u-skeleton-rect">
					<u-section title="热门动漫" font-size="29" :show-line="false" @click="toMore('热门动漫','hotComic')">
					</u-section>
				</view>

				<template v-if="loading">
					<!-- 骨架屏模拟数据 -->
					<view class="flex align-center justify-between flex-wrap">
						<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mb-4"></view>
					</view>
					<!-- end -->
				</template>
				<template v-else>
					<view class="flex align-center justify-between flex-wrap voditem">
						<block v-for="(item,index) in hotComic" :key="index">
							<vod-item :item="item"></vod-item>
						</block>
					</view>
				</template>
				
				<!-- ad -->
				<view class="mt-2">
					<vod-ad name="index_banner3" v-if="!loading"></vod-ad>
				</view>

				<template v-if="!loading">
					<view class="mt-4 mb-3 u-skeleton-rect">
						<u-section title="更多影片" font-size="29" :show-line="false" :right="false"></u-section>
					</view>
					<view class="flex align-center justify-between flex-wrap voditem">
						<block v-for="(item,index) in more.list" :key="index">
							<vod-item :item="item"></vod-item>
						</block>
					</view>
					<view class="py-5">
						<u-loadmore :status="more.loadStatus" />
					</view>
				</template>

			</view>
		</view>
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sliderList: [],
				today: {},
				hotMovie: [],
				hotTv: [],
				hotVariety: [],
				hotComic: [],
				searchTop: 40,
				more: {
					page: 1,
					pageSize: 9,
					loadStatus: 'loading',
					list: []
				},
				loading: true
			}
		},
		async onLoad() {
			let sysInfo = uni.getSystemInfoSync();
			this.searchTop = uni.upx2px(80) + sysInfo.statusBarHeight;
			await this.loadPageData();
		},
		async onReachBottom() {
			await this.loadMore();
		},
		async onPullDownRefresh(){
			uni.showLoading({
				title:'正在刷新',
				mask:true
			});
			await this.loadPageData();
			uni.stopPullDownRefresh();
			uni.hideLoading();
		},
		methods: {
			async loadPageData() {
				// 加载轮播图
				await this.initSlider();
				// 今日更新
				await this.initToday();
				// 热门电影
				await this.initHotMovie();
				// 骨架屏结束
				this.loading = false;
				// 热门电视剧
				await this.initHotTv();
				// 热门综艺
				await this.initHotVariety();
				// 热门动漫
				await this.initHotComic();
				// 更多...
				await this.loadData();
			},
			async initSlider() {
				let res = await this.$api.getVodSlider();
				this.sliderList = res.data.list;
			},
			async initToday() {
				let res = await this.$api.getVodToday(1, 9);
				this.today = res.data;
			},
			async initHotMovie() {
				let res = await this.$api.getVodHotMovie(1, 9);
				this.hotMovie = res.data.list;
			},
			async initHotTv() {
				let res = await this.$api.getVodHotTv(1, 9);
				this.hotTv = res.data.list;
			},
			async initHotVariety() {
				let res = await this.$api.getVodHotVariety(1, 9);
				this.hotVariety = res.data.list;
			},
			async initHotComic() {
				let res = await this.$api.getVodHotComic(1, 9);
				this.hotComic = res.data.list;
			},
			async loadMore() {
				if (this.more.loadStatus != 'loadmore') return;
				this.more.page += 1;
				this.more.loadStatus = 'loading';
				await this.loadData();
			},
			async loadData() {
				let res = await this.$api.getVodHot(this.more.page, this.more.pageSize);
				if (res.data.page == 1) {
					this.more.list = res.data.list;
				} else {
					this.more.list = this.more.list.concat(res.data.list);
				}
				this.more.loadStatus = 'loadmore';
				if (res.data.list.length < this.more.pageSize) this.more.loadStatus = 'nomore';
			},
			toMore(title = '更多', type) {
				uni.navigateTo({
					url: '/pages/more/more?title=' + title + '&type=' + type
				});
			},
			toSearch() {
				uni.switchTab({
					url: '/pages/search/search'
				})
			},
			clickSwiper(index){
				let vodId = this.sliderList[index].vod_id;
				this.$H.toDetail(vodId);
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
