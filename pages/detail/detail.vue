<template>
	<view>
		<u-navbar title-color="#222" :title="result.vod_name || '影片名称'" title-bold :border-bottom="false"
			title-size="30" back-icon-color="#222" back-icon-size="40">
		</u-navbar>
		<video :src="url" controls :play-strategy="strategy" show-casting-button show-snapshot-button
			style="width: 750rpx;height: 440rpx;" @fullscreenchange="fullscreenchange" autoplay object-fit="fill"
			show-mute-btn enable-play-gesture vslide-gesture show-screen-lock-button>
		</video>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: 'https://n1.szjal.cn/20210405/G3wKt0zN/index.m3u8',
				result: {},
				isFullscreen: false,
				network: 'wifi'
			}
		},
		async onLoad(e) {
			uni.onNetworkStatusChange((res) => {
				this.network = res.networkType;
				if (this.network == 'none') {
					uni.showLoading({
						title: '无网络'
					});
				} else {
					uni.hideLoading();
				}
				if (this.network != 'wifi' || this.network != 'ethernet') {
					this.$H.msg('当前正在使用移动数据，请注意流量使用');
				}
			});
			let res = await this.$api.vodDetail(e.id);
			this.result = res.data;
		},
		async onReady() {
			
		},
		computed: {
			strategy() {
				return this.$H.getExt(this.url) == 'm3u8' ? 3 : 0;
			}
		},
		methods: {
			fullscreenchange(e) {
				this.isFullscreen = e.detail.fullscreen;
			}
		}
	}
</script>

<style>

</style>
