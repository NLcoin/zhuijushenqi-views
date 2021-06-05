<template>
	<view>
		<u-navbar :is-back="false" title-color="#222" title-bold :border-bottom="false" title-size="30">
			<view class="ml-3 f7 font33">浏览记录</view>
		</u-navbar>
		<view class="p-2">
			<template v-if="$H.getConfig('check')">
				<view class="flex align-center justify-between flex-wrap voditem">
					<block v-for="(item,index) in list" :key="index">
						<vod-item :item="item"></vod-item>
					</block>
				</view>
			</template>
			<template v-else>
				<vod-history v-for="(item,index) in list" :key="index" :item="item"></vod-history>
			</template>
			<template v-if="!list.length">
				<u-empty text="没有更多数据了" mode="data" margin-top="35"></u-empty>
				<view class="my-3 flex align-center justify-between">
					<view class="font29 f6">为你推荐</view>
				</view>
				<view class="flex align-center justify-between flex-wrap voditem">
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
				list: this.getData() || [],
				moreList: []
			}
		},
		async onShow() {
			this.list = this.getData();
			if (!this.list.length) {
				let more = await this.$api.getVodHot(1, 9);
				this.moreList = more.data.list;
			}
		},
		methods: {
			getData() {
				let check = this.$H.getConfig('check');
				if (check) {
					return uni.getStorageSync('history2');
				}
				return uni.getStorageSync('history');
			}
		}
	}
</script>

<style lang="less">

</style>
