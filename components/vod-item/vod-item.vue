<template>
	<view>
		<view class="mb-2 mian" :class="listClass" @click="$H.toDetail(item.vod_id)">
			<u-lazy-load :image="item.vod_pic" img-mode="aspectFill" height="310" border-radius="10" :is-effect="false">
			</u-lazy-load>
			<view class="top_icon">{{item.vod_score}}</view>
			<view class="vod_remark">{{item.vod_remarks.length > 8 ? '' :item.vod_remarks}}</view>
			<view class="tc text-ellipsis1 font26 mt-1">
				{{item.vod_name}}
			</view>
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
	.mian {
		position: relative;
		width: 220rpx;
	}

	.vod_remark {
		font-size: 24rpx;
		position: absolute;
		text-shadow: 0 0 10rpx rgb(0 0 0 / 70%);
		bottom: 50rpx;
		right: 10rpx;
		color: #fff;
	}

	.top_icon {
		background-color: #ff6022;
		border-top-left-radius: 10rpx;
		position: absolute;
		top: 0;
		left: 0;
		color: #fff;
		font-size: 22rpx;
		padding: 0rpx 10rpx;
	}
</style>
