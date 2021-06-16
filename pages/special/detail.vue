<template>
	<view>
		<u-navbar title-color="#222" :title="detail.topic_name || '专题名称'" title-bold :border-bottom="false"
			title-size="30" back-icon-color="#222" back-icon-size="40" :is-back="false">
			<view class="flex align-center">
				<view style="width: 80rpx;" class="ml-2" @click="$H.back()">
					<u-icon name="arrow-left" size="38"></u-icon>
				</view>
				<view style="width: 80rpx;" @click="$H.toTab('index/index')">
					<u-icon name="home" size="38"></u-icon>
				</view>
			</view>
		</u-navbar>
		<view class="m-2">
			<view class="flex align-center justify-between flex-wrap voditem">
				<block v-for="(item,index) in detail.vod" :key="index">
					<vod-item2 :item="item"></vod-item2>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail: {}
			}
		},
		async onLoad(e) {
			uni.showLoading({
				mask:true,
				title:'加载中'
			})
			let res = await this.$api.topicDetail(e.id);
			this.detail = res.data;
			uni.hideLoading();
		},
		methods: {}
	}
</script>

<style>

</style>
