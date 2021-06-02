<template>
	<view>
		<u-navbar title-color="#222" :title="title" title-bold :border-bottom="false" title-size="30"
			back-icon-color="#222" back-icon-size="40">
		</u-navbar>
		<video src="" controls></video>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				result: {}
			}
		},
		async onLoad(e) {
			let res = await this.$api.vodDetail(e.id);
		},
		methods: {

		}
	}
</script>

<style>

</style>
