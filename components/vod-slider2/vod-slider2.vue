<template>
	<view>
		<swiper :autoplay="true" circular style="height: 490rpx;" previous-margin="190rpx" next-margin="190rpx"
			@change="change">
			<swiper-item v-for="(item,index) in list" :key="index">
				<view class="flex align-center flex-column" style="max-width: 330rpx;" @click="clickSwiper">
					<image :src="item.vod_pic" mode="aspectFill"
						:style="index == current ? 'width: 310rpx;height: 440rpx;' : 'width: 280rpx;height: 400rpx;'"
						style="border-radius: 10rpx;transition: 0.3s;" lazy-load>
					</image>
					<view class="mt-1 text-ellipsis1">
						{{item.vod_name}}
					</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		name:"vod-slider2",
		props: {
			list: [Array, Object]
		},
		data() {
			return {
				current: 0
			};
		},
		methods: {
			change(e) {
				this.current = e.detail.current;
			},
			clickSwiper(e) {
				this.$emit('click', e);
			}
		}
		
	}
</script>

<style>

</style>
