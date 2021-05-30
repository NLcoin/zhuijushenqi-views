<template>
	<view>
		<u-navbar :is-back="false" title-color="#222" title-bold :border-bottom="false" title-size="30">
			<view class="ml-3 f7 font33">热门影视推荐</view>
		</u-navbar>
		<view class="u-skeleton">
			<u-notice-bar type="none" 
			:list="['免责声明：小程序内容来源于网络，服务器未存储任何视频，如有侵犯您的权益请告知我们尽快处理']" v-if="!loading">
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
					<u-section title="今日更新" font-size="29" :show-line="false"></u-section>
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
							<block v-for="(item,index) in today" :key="index">
								<vod-item :item="item" listClass="mr-2" iconText="class">
								</vod-item>
							</block>
						</view>
					</template>
				</scroll-view>

				<view class="mt-2 mb-3 u-skeleton-rect">
					<u-section title="最新资讯" font-size="29" :show-line="false"></u-section>
				</view>
				<template v-if="loading">
					<!-- 骨架屏模拟数据 -->
					<view class="mb-2">
						<view class="flex align-center justify-between">
							<view style="border-radius: 10rpx;width: 270rpx;height: 170rpx;" class="u-skeleton-fillet">
							</view>
							<view>
								<view style="height: 100rpx;width: 435rpx;" class="u-skeleton-rect mb-2"></view>
								<view style="height: 50rpx;width: 435rpx;" class="u-skeleton-rect"></view>
							</view>
						</view>
					</view>
					<view class="mb-2">
						<view class="flex align-center justify-between">
							<view style="border-radius: 10rpx;width: 270rpx;height: 170rpx;" class="u-skeleton-fillet">
							</view>
							<view>
								<view style="height: 100rpx;width: 435rpx;" class="u-skeleton-rect mb-2"></view>
								<view style="height: 50rpx;width: 435rpx;" class="u-skeleton-rect"></view>
							</view>
						</view>
					</view>
					<view class="mb-2">
						<view class="flex align-center justify-between">
							<view style="border-radius: 10rpx;width: 270rpx;height: 170rpx;" class="u-skeleton-fillet">
							</view>
							<view>
								<view style="height: 100rpx;width: 435rpx;" class="u-skeleton-rect mb-2"></view>
								<view style="height: 50rpx;width: 435rpx;" class="u-skeleton-rect"></view>
							</view>
						</view>
					</view>
					<view class="mb-2">
						<view class="flex align-center justify-between">
							<view style="border-radius: 10rpx;width: 270rpx;height: 170rpx;" class="u-skeleton-fillet">
							</view>
							<view>
								<view style="height: 100rpx;width: 435rpx;" class="u-skeleton-rect mb-2"></view>
								<view style="height: 50rpx;width: 435rpx;" class="u-skeleton-rect"></view>
							</view>
						</view>
					</view>
					<!-- end -->
				</template>
				<template v-else>
					<block v-for="(item,index) in art" :key="index">
						<art-item :item="item"></art-item>
					</block>
				</template>
				
				<view class="mt-4 mb-3 u-skeleton-rect">
					<u-section title="热门电影" font-size="29" :show-line="false"></u-section>
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
				today: [],
				art: [],
				hotMovie: [],
				loading: true
			}
		},
		async onLoad() {
			// 加载轮播图
			await this.initSlider();
			// 今日更新
			await this.initToday();
			// 最新资讯
			await this.initArt();
			// 热门电影
			await this.initHotMovie();
			// 骨架屏结束
			this.loading = false;
		},
		methods: {
			async initSlider() {
				let res = await this.$api.getVodSlider();
				this.sliderList = res.data.list;
			},
			async initToday() {
				let res = await this.$api.getVodToday(1, 9);
				this.today = res.data.list;
			},
			async initArt() {
				let res = await this.$api.getArtNew(1, 4);
				this.art = res.data.list;
			},
			async initHotMovie() {
				let res = await this.$api.getVodHot(1, 9);
				this.hotMovie = res.data.list;
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
