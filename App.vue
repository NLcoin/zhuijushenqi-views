<script>
	export default {
		onLaunch: async function() {
			let res = await this.$api.getConfig();
			uni.setStorageSync('config', res);
			// 检测网络状态
			uni.getNetworkType({
				success: res => {
					if (res.networkType == 'none') {
						uni.showLoading({
							title: '无网络',
							mask: true
						});
						return false;
					}
					if (res.networkType != 'wifi') {
						uni.showToast({
							duration: 3000,
							title: '当前处于非wifi环境下，请留意流量使用',
							icon: 'none'
						})
					}
				}
			});
			uni.onNetworkStatusChange(res => {
				if (res.isConnected) {
					uni.hideLoading();
				} else {
					uni.showLoading({
						title: '无网络',
						mask: true
					});
					return false;
				}
				if (res.networkType != 'wifi') {
					uni.showToast({
						duration: 2000,
						title: '当前处于非wifi环境下，请留意流量使用',
						icon: 'none'
					});
				}
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
