<template>
	<view>
		<u-navbar :is-back="false" title-color="#222" title-bold :border-bottom="false" title-size="30">
			<view style="width: 550rpx;font-weight: 600;">
				<u-tabs :list="tabs" active-color="#ff6022" @change="changeTabs" :current="current"
					inactive-color="#222" font-size="32" :active-item-style="{fontSize:'33rpx'}"></u-tabs>
			</view>
		</u-navbar>
		<view style="z-index: 99;position: sticky;" :style="{top:searchTop+'px'}">
			<view class="mt-1 py-1 bg-bai border-top-hui" @click="toSearch()">
				<view class="flex align-center">
					<u-icon name="search" color="#ff6022" size="40" class="ml-3"></u-icon>
					<view style="font-size: 28rpx;line-height: 70rpx;" class="gray ml-2">
						输入影片名 演员或导演搜索
					</view>
				</view>
			</view>
		</view>
		<view class="u-skeleton">
			<swiper :current="current" @change="changeSwiper" :style="{height:swiperH+'px'}">
				<swiper-item>
					<scroll-view scroll-y="true" style="height: 100%;" @scrolltolower="loadReMore()">
						<view class="mx-2">
							<view class="mb-3 u-skeleton-rect">
								<u-swiper :list="recommend.sliderList" img-mode="aspectFill" :title="true"
									bg-color="#fff" height="410" border-radius="0" :effect3d="false"
									@click="clickRecommendSwiper">
								</u-swiper>
							</view>
							<view class="mt-4 mb-3 u-skeleton-rect">
								<u-section title="今日更新" font-size="29" :show-line="false"
									@click="toMore('今日更新'+recommend.today.total+'部影片','today')">
								</u-section>
							</view>
							<scroll-view scroll-x="true">
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
										<block v-for="(item,index) in recommend.today.list" :key="index">
											<vod-item :item="item"></vod-item>
										</block>
									</view>
								</template>
							</scroll-view>
							<!-- ad -->
							<view class="mt-2" v-if="!loading">
								<vod-ad name="index_banner"></vod-ad>
							</view>
							<view class="mt-4 mb-3 u-skeleton-rect">
								<u-section title="热门电影" font-size="29" :show-line="false"
									@click="toMore('热门电影','hotMovie')">
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
									<block v-for="(item,index) in recommend.hotMovie" :key="index">
										<vod-item :item="item"></vod-item>
									</block>
								</view>
							</template>
							<view class="mt-4 mb-3 u-skeleton-rect">
								<u-section title="热门电视剧" font-size="29" :show-line="false"
									@click="toMore('热门电视剧','hotTv')">
								</u-section>
							</view>
							<view class="flex align-center justify-between flex-wrap voditem">
								<block v-for="(item,index) in recommend.hotTv" :key="index">
									<vod-item :item="item"></vod-item>
								</block>
							</view>

							<!-- ad -->
							<view class="mt-2" v-if="!loading">
								<vod-ad name="index_banner2"></vod-ad>
							</view>

							<view class="mt-4 mb-3 u-skeleton-rect">
								<u-section title="热门综艺" font-size="29" :show-line="false"
									@click="toMore('热门综艺','hotVariety')">
								</u-section>
							</view>

							<view class="flex align-center justify-between flex-wrap voditem">
								<block v-for="(item,index) in recommend.hotVariety" :key="index">
									<vod-item :item="item"></vod-item>
								</block>
							</view>


							<view class="mt-4 mb-3 u-skeleton-rect">
								<u-section title="热门动漫" font-size="29" :show-line="false"
									@click="toMore('热门动漫','hotComic')">
								</u-section>
							</view>

							<view class="flex align-center justify-between flex-wrap voditem">
								<block v-for="(item,index) in recommend.hotComic" :key="index">
									<vod-item :item="item"></vod-item>
								</block>
							</view>

							<!-- ad -->
							<view class="mt-2" v-if="!loading">
								<vod-ad name="index_banner3"></vod-ad>
							</view>

							<view class="mt-4 mb-3 u-skeleton-rect">
								<u-section title="更多影片" font-size="29" :show-line="false" :right="false"></u-section>
							</view>
							<view class="flex align-center justify-between flex-wrap voditem">
								<block v-for="(item,index) in recommend.more.list" :key="index">
									<vod-item :item="item"></vod-item>
								</block>
							</view>
							<view class="pt-3" style="padding-bottom: 130rpx;">
								<u-loadmore :status="recommend.more.loadStatus" />
							</view>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<scroll-view scroll-y="true" style="height: 100%;" @scrolltolower="loadOtMore('dy')">
						<view class="mx-2" v-if="load.dy">
							<view class="mb-3 u-skeleton-rect">
								<u-swiper :list="sliderList.dy" img-mode="aspectFill" :title="true" bg-color="#fff"
									height="410" border-radius="0" :effect3d="false" @click="clickSwiper">
								</u-swiper>
							</view>
							<view class="mt-4 mb-3 u-skeleton-rect">
								<u-section title="今日更新" font-size="29" :show-line="false"
									@click="toMore('今日更新'+today.dy.total+'部电影','today',current)">
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
									<block v-for="(item,index) in today.dy.list" :key="index">
										<vod-item :item="item"></vod-item>
									</block>
								</view>
							</template>
							<view class="mt-4 mb-3 u-skeleton-rect">
								<u-section title="更多电影" font-size="29" :show-line="false" :right="false"></u-section>
							</view>
							<view class="flex align-center justify-between flex-wrap voditem">
								<block v-for="(item,index) in more.dy.list" :key="index">
									<vod-item :item="item"></vod-item>
								</block>
							</view>
							<view class="pt-3" style="padding-bottom: 130rpx;">
								<u-loadmore :status="more.dy.loadStatus" />
							</view>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<scroll-view scroll-y="true" style="height: 100%;" @scrolltolower="loadOtMore('dsj')">
						<view class="mx-2" v-if="load.dsj">
							<view class="mb-3 u-skeleton-rect">
								<u-swiper :list="sliderList.dsj" img-mode="aspectFill" :title="true" bg-color="#fff"
									height="410" border-radius="0" :effect3d="false" @click="clickSwiper">
								</u-swiper>
							</view>
							<view class="mt-4 mb-3 u-skeleton-rect">
								<u-section title="今日更新" font-size="29" :show-line="false"
									@click="toMore('今日更新'+today.dsj.total+'部电视剧','today',current)">
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
									<block v-for="(item,index) in today.dsj.list" :key="index">
										<vod-item :item="item"></vod-item>
									</block>
								</view>
							</template>
							<view class="mt-4 mb-3 u-skeleton-rect">
								<u-section title="更多电视剧" font-size="29" :show-line="false" :right="false"></u-section>
							</view>
							<view class="flex align-center justify-between flex-wrap voditem">
								<block v-for="(item,index) in more.dsj.list" :key="index">
									<vod-item :item="item"></vod-item>
								</block>
							</view>
							<view class="pt-3" style="padding-bottom: 130rpx;">
								<u-loadmore :status="more.dsj.loadStatus" />
							</view>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<scroll-view scroll-y="true" style="height: 100%;" @scrolltolower="loadOtMore('zy')">
						<view class="mx-2" v-if="load.zy">
							<view class="mb-3 u-skeleton-rect">
								<u-swiper :list="sliderList.zy" img-mode="aspectFill" :title="true" bg-color="#fff"
									height="410" border-radius="0" :effect3d="false" @click="clickSwiper">
								</u-swiper>
							</view>
							<view class="mt-4 mb-3 u-skeleton-rect">
								<u-section title="今日更新" font-size="29" :show-line="false"
									@click="toMore('今日更新'+today.zy.total+'部综艺','today',current)">
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
									<block v-for="(item,index) in today.zy.list" :key="index">
										<vod-item :item="item"></vod-item>
									</block>
								</view>
							</template>
							<view class="mt-4 mb-3 u-skeleton-rect">
								<u-section title="更多综艺" font-size="29" :show-line="false" :right="false"></u-section>
							</view>
							<view class="flex align-center justify-between flex-wrap voditem">
								<block v-for="(item,index) in more.zy.list" :key="index">
									<vod-item :item="item"></vod-item>
								</block>
							</view>
							<view class="pt-3" style="padding-bottom: 130rpx;">
								<u-loadmore :status="more.zy.loadStatus" />
							</view>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<scroll-view scroll-y="true" style="height: 100%;" @scrolltolower="loadOtMore('dm')">
						<view class="mx-2" v-if="load.dm">
							<view class="mb-3 u-skeleton-rect">
								<u-swiper :list="sliderList.dm" img-mode="aspectFill" :title="true" bg-color="#fff"
									height="410" border-radius="0" :effect3d="false" @click="clickSwiper">
								</u-swiper>
							</view>
							<view class="mt-4 mb-3 u-skeleton-rect">
								<u-section title="今日更新" font-size="29" :show-line="false"
									@click="toMore('今日更新'+today.dm.total+'部动漫','today',current)">
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
									<block v-for="(item,index) in today.dm.list" :key="index">
										<vod-item :item="item"></vod-item>
									</block>
								</view>
							</template>
							<view class="mt-4 mb-3 u-skeleton-rect">
								<u-section title="更多动漫" font-size="29" :show-line="false" :right="false"></u-section>
							</view>
							<view class="flex align-center justify-between flex-wrap voditem">
								<block v-for="(item,index) in more.dm.list" :key="index">
									<vod-item :item="item"></vod-item>
								</block>
							</view>
							<view class="pt-3" style="padding-bottom: 130rpx;">
								<u-loadmore :status="more.dm.loadStatus" />
							</view>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
		<u-skeleton :loading="loading" bg-color="#fff" :animation="true"></u-skeleton>
	</view>
</template>

<script>
	let interstitialAd = null
	import recommendMixin from '@/pages/index/mixin/recommendMixin.js';
	export default {
		mixins: [recommendMixin],
		data() {
			return {
				tabs: this.$H.getConfig('tabs') || [{
					id: 0,
					name: '推荐'
				}, {
					id: 1,
					name: '电影'
				}, {
					id: 2,
					name: '电视剧'
				}, {
					id: 3,
					name: '综艺'
				}, {
					id: 4,
					name: '动漫'
				}],
				current: 0,
				swiperH: 200,
				searchTop: 40,
				load: {
					dy: false,
					dsj: false,
					zy: false,
					dm: false,
				},
				sliderList: {
					dy: [],
					dsj: [],
					zy: [],
					dm: [],
				},
				today: {
					dy: {
						total: 0,
						list: []
					},
					dsj: {
						total: 0,
						list: []
					},
					zy: {
						total: 0,
						list: []
					},
					dm: {
						total: 0,
						list: []
					}
				},
				more: {
					dy: {
						page: 1,
						pageSize: 9,
						loadStatus: 'loading',
						list: []
					},
					dsj: {
						page: 1,
						pageSize: 9,
						loadStatus: 'loading',
						list: []
					},
					zy: {
						page: 1,
						pageSize: 9,
						loadStatus: 'loading',
						list: []
					},
					dm: {
						page: 1,
						pageSize: 9,
						loadStatus: 'loading',
						list: []
					}
				},
				loading: true,
			}
		},
		async onLoad() {
			let sysInfo = uni.getSystemInfoSync();
			this.searchTop = uni.upx2px(80) + sysInfo.statusBarHeight;
			this.swiperH = sysInfo.windowHeight - 80;
			await this.loadPageData();
			if (uni.createInterstitialAd) {
				interstitialAd = uni.createInterstitialAd({
					adUnitId: this.$H.getConfig('interAd')
				});
			}
		},
		onReady() {
			setTimeout(() => {
				if (!interstitialAd) return;
				interstitialAd.show();
			}, 15000);
		},
		computed: {
			currentKey() {
				const key = ['dy', 'dsj', 'zy', 'dm'];
				return key[this.current - 1];
			}
		},
		methods: {
			toMore(title = '更多', type, current) {
				uni.navigateTo({
					url: '/pages/more/more?title=' + title + '&type=' + type + '&current=' + current
				});
			},
			toSearch() {
				uni.switchTab({
					url: '/pages/search/search'
				})
			},
			clickSwiper(index) {
				let vodId = this.sliderList[this.currentKey][index].vod_id;
				this.$H.toDetail(vodId);
			},
			clickRecommendSwiper(index) {
				let vodId = this.recommend.sliderList[index].vod_id;
				this.$H.toDetail(vodId);
			},
			async loadPageData() {
				if (this.current == 0) {
					if (this.recommend.load) return;
					this.loading = true;
					await this.loadRePage();
					this.loading = false;
				} else {
					await this.loadOtPageData();
				}
			},
			async loadOtPageData() {
				let index = this.currentKey;
				if (this.load[index] == true) return;
				uni.showLoading({
					mask: true,
					title: '加载中'
				});
				this.loading = true;
				await this.loadOtSlider(index);
				await this.loadOtToday(index);
				this.load[index] = true;
				this.loading = false;
				uni.hideLoading();
				await this.loadOtData(index);
			},
			async loadOtSlider(key) {
				let res = await this.$api.getVodSlider(this.current);
				this.sliderList[key] = res.data.list;
			},
			async loadOtToday(key) {
				let res = await this.$api.getVodToday(1, 9, this.current);
				this.today[key] = res.data;
			},
			async loadOtMore(key) {
				if (this.more[key].loadStatus != 'loadmore') return;
				this.more[key].page += 1;
				this.more[key].loadStatus = 'loading';
				await this.loadOtData(key);
			},
			async loadOtData(key) {
				let res = await this.$api.getVodHot(this.more[key].page, this.more[key].pageSize, this.current);
				if (res.data.page == 1) {
					this.more[key].list = res.data.list;
				} else {
					this.more[key].list = this.more[key].list.concat(res.data.list);
				}
				this.more[key].loadStatus = 'loadmore';
				if (res.data.list.length < this.more[key].pageSize) this.more[key].loadStatus =
					'nomore';
			},
			async changeTabs(index) {
				this.current = index;
				await this.loadPageData();
			},
			async changeSwiper(e) {
				this.current = e.detail.current;
				await this.loadPageData();
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
