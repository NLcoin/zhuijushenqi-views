<template>
	<view>
		<u-navbar title-color="#222" :title="title" title-bold :border-bottom="false" title-size="30"
			back-icon-color="#222" back-icon-size="38" back-icon-name="arrow-left">
		</u-navbar>
		<view class="u-skeleton m-2">
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
					<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
					<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
					<view class="u-skeleton-fillet vodskeleton mb-4"></view>
				</view>
				<!-- end -->
			</template>
			<template v-else>
				<view class="flex align-center justify-between flex-wrap voditem">
					<block v-for="(item,index) in result.list" :key="index">
						<vod-item :item="item"></vod-item>
					</block>
				</view>
				<view class="py-4">
					<u-loadmore :status="result.loadStatus" />
				</view>
			</template>
		</view>
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '查看更多',
				type: '',
				current: 0,
				loading: true,
				result: {
					page: 1,
					pageSize: 12,
					total: 0,
					list: [],
					loadStatus: 'loadmore'
				},
			};
		},
		async onLoad(e) {
			this.title = e.title;
			this.type = e.type;
			this.current = e.current;
			await this.loadData();
			this.loading = false;
		},
		async onReachBottom() {
			await this.loadMore();
		},
		methods: {
			async loadData() {
				let res = null;
				switch (this.type) {
					case 'today':
						res = await this.$api.getVodToday(this.result.page, this.result.pageSize, this.current);
						break;
					case 'hotMovie':
						res = await this.$api.getVodHotMovie(this.result.page, this.result.pageSize);
						break;
					case 'hotTv':
						res = await this.$api.getVodHotTv(this.result.page, this.result.pageSize);
						break;
					case 'hotVariety':
						res = await this.$api.getVodHotVariety(this.result.page, this.result.pageSize);
						break;
					case 'hotComic':
						res = await this.$api.getVodHotComic(this.result.page, this.result.pageSize);
						break;
				}
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

<style lang="less">

</style>
