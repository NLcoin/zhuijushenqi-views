<template>
	<view>
		<view style="width: 340rpx;" class="mb-2" @click="toDetail(item.topic_id)">
			<image :src="item.topic_pic" mode="aspectFill" style="width: 340rpx;height: 220rpx;border-radius: 10rpx;"
				lazy-load></image>
			<view class="flex align-center justify-between flex-1 icon-position mx-1">
				<view class="myp-flex-row myp-align-center">
					<u-icon name="eye" color="#ffffff" size="28"></u-icon>
					<text style="font-size: 23rpx;" class="white ml-1">{{$H.numberToShort(item.topic_hits)}}</text>
				</view>
				<view class="myp-flex-row myp-align-center">
					<u-icon name="thumb-up" color="#ffffff" size="28"></u-icon>
					<text style="font-size: 23rpx;" class="white ml-1">{{$H.numberToShort(item.topic_up)}}</text>
				</view>
			</view>
			<view class="mt-1 name text-ellipsis2" style="height: 60rpx;margin-top: -35rpx;">
				{{item.topic_name}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "special-list",
		props: {
			item: [Array, Object]
		},
		data() {
			return {

			};
		},
		methods:{
			toDetail(id){
				uni.navigateTo({
					url: '/pages/special/detail?id=' + id
				});
			}
		}
	}
</script>

<style>
	.icon-position {
		position: relative;
		bottom: 53rpx;
	}

	.name {
		font-size: 25rpx;
		color: #212121;
		line-height: 16px;
	}
</style>
