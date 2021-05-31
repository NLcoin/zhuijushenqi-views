<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>
<style lang="scss">
	@import "uview-ui/index.scss";
	// 动画库
	@import "/common/css/animate.min.css";
	// 全局CSS
	@import "/common/css/main.css";

	image {
		will-change: transform;
	}
</style>
<style>
	/*每个页面公共css */
</style>
