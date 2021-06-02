<script>
	export default {
		onLaunch: function() {
			this.$api.getConfig().then(res => {
				uni.setStorageSync('config',res);
			});
		},
		onShow: function() {
			const updateManager = uni.getUpdateManager(); // 获取更新管理器对象
			updateManager.onCheckForUpdate(function(res) {
				if (res.hasUpdate) {
					updateManager.onUpdateReady(function() {
						uni.showModal({
							title: '版本更新',
							content: '新版本已经准备好，点击确定重新启动',
							showCancel: false,
							success: res => {
								if (res.confirm) {
									updateManager.applyUpdate();
								}
							}
						})
					})
					updateManager.onUpdateFailed(function() {
						uni.showModal({
							title: '更新失败',
							content: '更新包下载失败，请检查网络设置',
							showCancel: false
						})
					})
				}
			})
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
