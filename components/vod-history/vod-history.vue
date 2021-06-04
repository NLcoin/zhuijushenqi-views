<template>
	<view>
		<view class="flex align-center" @click="$H.toDetail(item.vod_id)">
			<view class="flex align-center vod">
				<view class="vod-pic-position">
					<image :src="item.vod_pic" class="vod-pic" mode="aspectFill" lazy-load>
					</image>
					<view class="vod-remarks-position">{{$H.ellipsis(item.vod_remarks,10)}}</view>
				</view>
				<view class="flex flex-column justify-between ml-15" style="height: 150rpx;">
					<view class="text-ellipsis2 hei font28">{{item.title}}
					</view>
					<view class="text-ellipsis1 font24 gray">
						{{played > 0 ? '已观看 ' + played + '%' : '观看不足1%'}}
						播放来源：{{item.fromName}}
					</view>
					<u-line-progress :striped="true" :percent="played" :striped-active="true" active-color="#ff6022">
					</u-line-progress>
				</view>
			</view>
		</view>
		<view style="margin: 20rpx -20rpx">
			<u-gap height="20" bg-color="#f8f8fa"></u-gap>
		</view>
	</view>
</template>

<script>
	export default {
		name: "vod-history",
		props: {
			item: Object
		},
		data() {
			return {

			};
		},
		computed: {
			played() {
				return Math.round((this.item.current / this.item.duration) * 100);
			}
		}
	}
</script>

<style lang="less">
	.vod {
		height: 150rpx;
		margin-right: 5rpx;

		&-pic-position {
			position: relative;
			width: 260rpx;
			height: 150rpx;
		}

		&-remarks-position {
			position: absolute;
			bottom: 5rpx;
			right: 10rpx;
			text-shadow: 0 0 10rpx rgb(0 0 0 / 70%);
			font-size: 24rpx;
			color: #FFFFFF;
		}

		&-pic {
			will-change: transform;
			height: 150rpx;
			width: 260rpx;
		}
	}
</style>
