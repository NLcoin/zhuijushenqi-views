<template>
	<view class="mb-2">
		<view class="flex align-center justify-between">
			<image :src="item.art_pic" class="mr-15 art-img" mode="aspectFill" v-if="$H.checkUrl(item.art_pic)"></image>
			<view>
				<view style="height: 145rpx;width: 435rpx;">
					<view class="art-title">{{item.art_name}}</view>
				</view>
				
				<view class="flex align-center justify-between">
					<view class="art-bottom-text">{{$H.friendlyDate(item.art_time)}}</view>
					<view class="flex align-center">
						<u-icon name="thumb-up" color="#C0C0C0"></u-icon>
						<text class="art-bottom-text ml-1">{{$H.numberToShort(item.art_up, 2)}}</text>
					</view>
					<view class="flex align-center">
						<u-icon name="eye" color="#C0C0C0"></u-icon>
						<text class="art-bottom-text ml-1">{{$H.numberToShort(item.art_hits,2)}}人看过</text>
					</view>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "art-item",
		props: {
			item: Object
		},
		data() {
			return {

			};
		}
	}
</script>

<style>
	.art-img {
		will-change: transform;
		height: 170rpx;
		border-radius: 10rpx;
		width: 270rpx;
	}
	
	.art-title {
		font-size: 30rpx;
		text-overflow: ellipsis;
		word-break: break-word;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}
	
	.art-bottom-text {
		font-size: 24rpx;
		color: #C0C0C0;
	}
	
</style>
