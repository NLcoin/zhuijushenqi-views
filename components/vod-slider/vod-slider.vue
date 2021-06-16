<template>
	<view>
		<u-swiper :list="list" img-mode="aspectFill" :title="true" bg-color="#fff" height="420" border-radius="0"
			:effect3d="$H.getConfig('index_slider_3d')" @click="clickSwiper">
		</u-swiper>
	</view>
</template>

<script>
	export default {
		name: "vod-slider",
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
