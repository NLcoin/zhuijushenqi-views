<template>
	<view class="mb-2" :class="listClass" @click="openDetail(item.vod_id)" style="position: relative;width: 210rpx;">
		<u-lazy-load :image="item.vod_pic" img-mode="aspectFill" class="vod-img" height="300" border-radius="10"></u-lazy-load>
		<view v-if="iconText" class="top_icon">{{icon(item,iconText)}}</view>
		<view class="vod_remark">{{item.vod_remarks.length > 8 ? '' :item.vod_remarks}}</view>
		<view class="vod_score" v-if="isScore">{{item.vod_score}}</view>
		<view class="u-text-center text-ellipsis1 font26 mt-1">
			{{item.vod_name}}
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item: Object,
			iconText: String,
			isScore: {
				type: Boolean,
				default: true
			},
			listClass: String
		},
		methods: {
			openDetail(id) {
				uni.navigateTo({
					url: '/pages/detail/movie/movie?id=' + id
				});
			},
			icon(item, text) {
				if (text == 'class') return item.type.type_name;
				if (text == 'hits_day') return '今日热度' + item.vod_hits_day;
				if (text == 'hits_week') return '周热度' + item.vod_hits_week;
				if (text == 'hits_month') return '月热度' + item.vod_hits_month;
				if (text == 'hits_all') return '总热度' + item.vod_hits;
				return text;
			}
		}
	}
</script>

<style>
	.vod-img{
		width: 210rpx;
	}
	
	.vod_remark {
		font-size: 24rpx;
		position: absolute;
		text-shadow: 0 0 4px rgb(0 0 0 / 70%);
		bottom: 50rpx;
		left: 10rpx;
		color: #fff;
	}

	.vod_score {
		font-size: 24rpx;
		position: absolute;
		bottom: 50rpx;
		right: 10rpx;
		color: #ff6022;
	}

	.top_icon {
		background-color: #ff6022;
		border-top-left-radius: 10rpx;
		position: absolute;
		top: 0;
		left: 0rpx;
		color: #fff;
		font-size: 22rpx;
		padding: 0rpx 10rpx;
	}
</style>
