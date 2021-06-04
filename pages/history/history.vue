<template>
	<view>
		<u-navbar title-color="#222" title="浏览记录" title-bold :border-bottom="false" title-size="30" :is-back="false">
		</u-navbar>
		<view class="m-2">
			<vod-history v-for="(item,index) in list" :key="index" :item="item"></vod-history>
			<template v-if="!list.length">
				<u-empty text="没有更多数据了" mode="data" margin-top="35"></u-empty>
				<view class="my-3 flex align-center justify-between">
					<view class="font29 f6">为你推荐</view>
				</view>
				<view class="flex align-center justify-between flex-wrap">
					<block v-for="(item,index) in moreList" :key="index">
						<vod-item :item="item"></vod-item>
					</block>
				</view>
			</template>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: uni.getStorageSync('history') || [],
				moreList: []
			}
		},
		async onShow() {
			this.list = uni.getStorageSync('history');
			if (!this.list.length) {
				let more = await this.$api.getVodHot(1, 9);
				this.moreList = more.data.list;
			}
		},
		methods: {}
	}
</script>

<style lang="less">

</style>
