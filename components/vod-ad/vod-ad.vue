<template>
	<view>
		<ad :unit-id="aid" :ad-intervals="intervals" v-if="aid"></ad>
	</view>
</template>

<script>
	export default {
		name: "vod-ad",
		props: {
			name: String,
			intervals: {
				type: [Number, String],
				default: 30
			}
		},
		created() {
		},
		computed: {
			aid() {
				return this.$H.getConfig(this.name);
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style>

</style>
