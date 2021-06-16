<template>
	<view>
		<u-navbar :is-back="false" title-color="#222" title-bold :border-bottom="false" title-size="30">
			<view class="ml-3 f7 font33">专题列表</view>
		</u-navbar>
		<view class="mt-1 mb-2">
			<u-swiper :list="slider" img-mode="aspectFill" :title="true" bg-color="#fff" height="350" border-radius="20"
				:effect3d="true" @click="clickSwiper">
			</u-swiper>
		</view>
		<view class="mt-4">
			<vod-ad name="index_banner2"></vod-ad>
		</view>
		<view class="mt-3 mb-3 ml-2">
			<u-section title="最新专题" font-size="29" :show-line="false" :right="false"></u-section>
		</view>
		<view class="flex align-center justify-between flex-wrap mx-2">
			<special-list v-for="(item,index) in result.list" :key="index" :item="item"></special-list>
		</view>
		<view class="py-4">
			<u-loadmore :status="result.loadStatus" />
		</view>
		<u-mask :show="mask" :mask-click-able="false"></u-mask>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				slider: [],
				result: {
					page: 1,
					pageSize: 12,
					total: 0,
					list: [],
					loadStatus: 'loadmore'
				},
				mask: true
			}
		},
		async onLoad() {
			uni.showLoading({
				mask: true,
				title: '加载中'
			})
			await this.getSlider();
			await this.loadData();
			this.mask = false;
			uni.hideLoading();
		},
		async onReachBottom() {
			await this.loadMore();
		},
		methods: {
			onShareAppMessage() {
				return {
					title: '热门影视专题',
					path: '', //页面路径及参数
					imageUrl: '', //图片链接，必须是网络连接，后面拼接时间戳防止本地缓存
				}
			},
			async getSlider() {
				let res = await this.$api.topicSlider();
				this.slider = res.data.list;
			},
			clickSwiper(index) {
				let id = this.slider[index].topic_id;
				uni.navigateTo({
					url: '/pages/special/detail?id=' + id
				});
			},
			async loadData() {
				let res = await this.$api.topicList(this.result.page, this.result.pageSize);
				if (res) {
					if (this.result.page == 1) {
						this.result.list = res.data.list;
					} else {
						this.result.list = this.result.list.concat(res.data.list);
					}
					this.result.total = res.data.total;
					this.result.loadStatus = 'loadmore';
					if (res.data.list.length < this.result.pageSize) this.result.loadStatus = 'nomore';
				}
			},
			async loadMore() {
				if (this.result.loadStatus != 'loadmore') return;
				this.result.page += 1;
				this.result.loadStatus = 'loading';
				await this.loadData();
			},
		}
	}
</script>

<style>

</style>
