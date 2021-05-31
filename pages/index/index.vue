<template>
	<view>
		<u-navbar :is-back="false" title-color="#222" title-bold :border-bottom="false" title-size="30">
			<view class="ml-3 f7 font33">热门影视推荐</view>
		</u-navbar>
		<view class="u-skeleton">
			<u-notice-bar type="none" :list="['免责声明：小程序内容来源于网络，服务器未存储任何视频，如有侵犯您的权益请告知我们尽快处理']" v-if="!loading">
			</u-notice-bar>
			<u-sticky offset-top="160">
				<view class="px-2 pb-2 pt-1 bg-bai">
					<u-search placeholder="输入影片名 演员或导演搜索" v-model="keyword" :show-action="false" disabled
						class="u-skeleton-fillet"></u-search>
				</view>
			</u-sticky>
			<view class="mx-2">
				<view class="mb-3 mt-1 u-skeleton-fillet">
					<u-swiper :list="sliderList" img-mode="aspectFill" :title="true" bg-color="#fff" height="380"
						border-radius="0">
					</u-swiper>
				</view>

				<view class="mt-4 mb-3 u-skeleton-rect">
					<u-section title="今日更新" font-size="29" :show-line="false" @click="toMore('今日更新'+today.total+'部影片','today')">
					</u-section>
				</view>

				<scroll-view scroll-x="true">
					<template v-if="loading">
						<!-- 骨架屏模拟数据 -->
						<view class="flex align-center justify-between">
							<view style="width: 230rpx;height: 330rpx;border-radius: 10rpx;"
								class="u-skeleton-fillet mr-2">
							</view>
							<view style="width: 230rpx;height: 330rpx;border-radius: 10rpx;"
								class="u-skeleton-fillet mr-2">
							</view>
							<view style="width: 230rpx;height: 330rpx;border-radius: 10rpx;" class="u-skeleton-fillet">
							</view>
						</view>
						<!-- end -->
					</template>
					<template v-else>
						<view class="flex align-center justify-between">
							<block v-for="(item,index) in today.list" :key="index">
								<vod-item :item="item" listClass="mr-2" iconText="class">
								</vod-item>
							</block>
						</view>
					</template>
				</scroll-view>

				<view class="mt-4 mb-3 u-skeleton-rect">
					<u-section title="热门电影" font-size="29" :show-line="false" @click="toMore('热门电影','hotMovie')"></u-section>
				</view>

				<template v-if="loading">
					<!-- 骨架屏模拟数据 -->
					<view class="flex align-center justify-between flex-wrap">
						<view style="width: 210rpx;height: 310rpx;border-radius: 10rpx;"
							class="u-skeleton-fillet mr-3 mb-2">
						</view>
						<view style="width: 210rpx;height: 310rpx;border-radius: 10rpx;"
							class="u-skeleton-fillet mr-3 mb-2">
						</view>
						<view style="width: 210rpx;height: 310rpx;border-radius: 10rpx;" class="u-skeleton-fillet mb-2">
						</view>
						<view style="width: 210rpx;height: 310rpx;border-radius: 10rpx;"
							class="u-skeleton-fillet mr-3 mb-2">
						</view>
						<view style="width: 210rpx;height: 310rpx;border-radius: 10rpx;"
							class="u-skeleton-fillet mr-3 mb-2">
						</view>
						<view style="width: 210rpx;height: 310rpx;border-radius: 10rpx;" class="u-skeleton-fillet mb-2">
						</view>
					</view>
					<!-- end -->
				</template>
				<template v-else>
					<view class="flex align-center justify-between flex-wrap">
						<block v-for="(item,index) in hotMovie" :key="index">
							<vod-item :item="item"></vod-item>
						</block>
					</view>
				</template>

				<view class="mt-4 mb-3 u-skeleton-rect">
					<u-section title="猜你在追" font-size="29" :show-line="false" @click="toMore('猜你在追','hotTv')"></u-section>
				</view>

				<template v-if="loading">
					<!-- 骨架屏模拟数据 -->
					<view class="flex align-center justify-between flex-wrap">
						<view style="width: 210rpx;height: 310rpx;border-radius: 10rpx;"
							class="u-skeleton-fillet mr-3 mb-2">
						</view>
						<view style="width: 210rpx;height: 310rpx;border-radius: 10rpx;"
							class="u-skeleton-fillet mr-3 mb-2">
						</view>
						<view style="width: 210rpx;height: 310rpx;border-radius: 10rpx;" class="u-skeleton-fillet mb-2">
						</view>
						<view style="width: 210rpx;height: 310rpx;border-radius: 10rpx;"
							class="u-skeleton-fillet mr-3 mb-2">
						</view>
						<view style="width: 210rpx;height: 310rpx;border-radius: 10rpx;"
							class="u-skeleton-fillet mr-3 mb-2">
						</view>
						<view style="width: 210rpx;height: 310rpx;border-radius: 10rpx;" class="u-skeleton-fillet mb-2">
						</view>
					</view>
					<!-- end -->
				</template>
				<template v-else>
					<view class="flex align-center justify-between flex-wrap">
						<block v-for="(item,index) in hotTv" :key="index">
							<vod-item :item="item"></vod-item>
						</block>
					</view>
				</template>

				<view class="mt-4 mb-3 u-skeleton-rect">
					<u-section title="热门综艺" font-size="29" :show-line="false" @click="toMore('热门综艺','hotVariety')"></u-section>
				</view>

				<template v-if="loading">
					<!-- 骨架屏模拟数据 -->
					<view class="flex align-center justify-between flex-wrap">
						<view style="width: 210rpx;height: 310rpx;border-radius: 10rpx;"
							class="u-skeleton-fillet mr-3 mb-2">
						</view>
						<view style="width: 210rpx;height: 310rpx;border-radius: 10rpx;"
							class="u-skeleton-fillet mr-3 mb-2">
						</view>
						<view style="width: 210rpx;height: 310rpx;border-radius: 10rpx;" class="u-skeleton-fillet mb-2">
						</view>
						<view style="width: 210rpx;height: 310rpx;border-radius: 10rpx;"
							class="u-skeleton-fillet mr-3 mb-2">
						</view>
						<view style="width: 210rpx;height: 310rpx;border-radius: 10rpx;"
							class="u-skeleton-fillet mr-3 mb-2">
						</view>
						<view style="width: 210rpx;height: 310rpx;border-radius: 10rpx;" class="u-skeleton-fillet mb-2">
						</view>
					</view>
					<!-- end -->
				</template>
				<template v-else>
					<view class="flex align-center justify-between flex-wrap">
						<block v-for="(item,index) in hotVariety" :key="index">
							<vod-item :item="item"></vod-item>
						</block>
					</view>
				</template>


				<view class="mt-4 mb-3 u-skeleton-rect">
					<u-section title="热门动漫" font-size="29" :show-line="false" @click="toMore('热门动漫','hotComic')"></u-section>
				</view>

				<template v-if="loading">
					<!-- 骨架屏模拟数据 -->
					<view class="flex align-center justify-between flex-wrap">
						<view style="width: 210rpx;height: 310rpx;border-radius: 10rpx;"
							class="u-skeleton-fillet mr-3 mb-2">
						</view>
						<view style="width: 210rpx;height: 310rpx;border-radius: 10rpx;"
							class="u-skeleton-fillet mr-3 mb-2">
						</view>
						<view style="width: 210rpx;height: 310rpx;border-radius: 10rpx;" class="u-skeleton-fillet mb-2">
						</view>
						<view style="width: 210rpx;height: 310rpx;border-radius: 10rpx;"
							class="u-skeleton-fillet mr-3 mb-2">
						</view>
						<view style="width: 210rpx;height: 310rpx;border-radius: 10rpx;"
							class="u-skeleton-fillet mr-3 mb-2">
						</view>
						<view style="width: 210rpx;height: 310rpx;border-radius: 10rpx;" class="u-skeleton-fillet mb-2">
						</view>
					</view>
					<!-- end -->
				</template>
				<template v-else>
					<view class="flex align-center justify-between flex-wrap">
						<block v-for="(item,index) in hotComic" :key="index">
							<vod-item :item="item"></vod-item>
						</block>
					</view>
				</template>

				<template v-if="!loading">
					<view class="mt-4 mb-3 u-skeleton-rect">
						<u-section title="更多影片" font-size="29" :show-line="false" :right="false"></u-section>
					</view>
					<view class="flex align-center justify-between flex-wrap">
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
		async onReachBottom() {
			await this.loadMore();
		},
		methods: {
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
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
