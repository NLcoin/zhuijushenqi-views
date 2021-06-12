<template>
	<view class="flex border-bottom-hui py-2 align-center words-list" 
	hover-class="bg-hui" 
	@click.stop="doSearch(item.vod_name)">
		<u-icon name="search" color="gray" size="31"></u-icon>
		<view class="ml-2 font27 words-list-text flex align-center text-ellipsis1">
			<view v-html="item.vod_name2"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "search-complete-list",
		props: {
			item: [Object, Array]
		},
		data() {
			return {

			};
		},
		methods:{
			doSearch(word){
				console.log(word);
				this.$emit('doSearch',word);
			}
		}
	}
</script>

<style lang="less">
	.words-list {
		height: 90rpx;
		line-height: 90rpx;

		&-text {
			color: #5a5555;
		}

		&-author {
			color: #dd491d;
			border: 1rpx solid #dd491d;
			line-height: 30rpx;
			border-radius: 8rpx;
			font-size: 23rpx;
			padding: 2rpx;
			margin-top: 3rpx;
		}
	}
</style>
