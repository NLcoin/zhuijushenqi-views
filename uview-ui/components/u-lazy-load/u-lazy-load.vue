<template>
	<view class="u-wrap" :style="{
			  opacity: Number(opacity),
			  borderRadius: borderRadius + 'rpx',
			  // 因为time值需要改变,所以不直接用duration值(不能改变父组件prop传过来的值)
			  transition: `opacity ${time / 1000}s ease-in-out`
		   }"
	 :class="'u-lazy-item-' + elIndex">
		<view :class="'u-lazy-item-' + elIndex">
			<image :style="{borderRadius: borderRadius + 'rpx', height: imgHeight}" v-if="!isError" class="u-lazy-item"
			 :src="isShow ? image : loadingImg" :mode="imgMode" @load="imgLoaded" @error="loadError" @tap="clickImg"></image>
			<image :style="{borderRadius: borderRadius + 'rpx', height: imgHeight}" class="u-lazy-item error" v-else :src="errorImg"
			 :mode="imgMode" @load="errorImgLoaded" @tap="clickImg"></image>
		</view>
	</view>
</template>

<script>
	/**
	 * lazyLoad 懒加载
	 * @description 懒加载使用的场景为：页面有很多图片时，APP会同时加载所有的图片，导致页面卡顿，各个位置的图片出现前后不一致等.
	 * @tutorial https://www.uviewui.com/components/lazyLoad.html
	 * @property {String Number} index 用户自定义值，在事件触发时回调，用以区分是哪个图片
	 * @property {String} image 图片路径
	 * @property {String} loading-img 预加载时的占位图
	 * @property {String} error-img 图片加载出错时的占位图
	 * @property {String} threshold 触发加载时的位置，见上方说明，单位 rpx（默认300）
	 * @property {String Number} duration 图片加载成功时，淡入淡出时间，单位ms（默认）
	 * @property {String} effect 图片加载成功时，淡入淡出的css动画效果（默认ease-in-out）
	 * @property {Boolean} is-effect 图片加载成功时，是否启用淡入淡出效果（默认true）
	 * @property {String Number} border-radius 图片圆角值，单位rpx（默认0）
	 * @property {String Number} height 图片高度，注意：实际高度可能受img-mode参数影响（默认450）
	 * @property {String Number} mg-mode 图片的裁剪模式，详见image组件裁剪模式（默认widthFix）
	 * @event {Function} click 点击图片时触发
	 * @event {Function} load 图片加载成功时触发
	 * @event {Function} error 图片加载失败时触发
	 * @example <u-lazy-load :image="image" :loading-img="loadingImg" :error-img="errorImg"></u-lazy-load>
	 */
	export default {
		name: 'u-lazy-load',
		props: {
			index: {
				type: [Number, String]
			},
			// 要显示的图片
			image: {
				type: String,
				default: ''
			},
			// 图片裁剪模式
			imgMode: {
				type: String,
				default: 'widthFix'
			},
			// 占位图片路径
			loadingImg: {
				type: String,
				default:''
			},
			// 加载失败的错误占位图
			errorImg: {
				type: String,
				default: 'data:image/jpg;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/Z'
			},
			// 图片进入可见区域前多少像素时，单位rpx，开始加载图片
			// 负数为图片超出屏幕底部多少距离后触发懒加载，正数为图片顶部距离屏幕底部多少距离时触发(图片还没出现在屏幕上)
			threshold: {
				type: [Number, String],
				default: 100
			},
			// 淡入淡出动画的过渡时间
			duration: {
				type: [Number, String],
				default: 500
			},
			// 渡效果的速度曲线，各个之间差别不大，因为这是淡入淡出，且时间很短，不是那些变形或者移动的情况，会明显
			// linear|ease|ease-in|ease-out|ease-in-out|cubic-bezier(n,n,n,n);
			effect: {
				type: String,
				default: 'ease-in-out'
			},
			// 是否使用过渡效果
			isEffect: {
				type: Boolean,
				default: true
			},
			// 圆角值
			borderRadius: {
				type: [Number, String],
				default: 0
			},
			// 图片高度，单位rpx
			height: {
				type: [Number, String],
				default: '450'
			}
		},
		data() {
			return {
				isShow: false,
				opacity: 1,
				time: this.duration,
				loadStatus: '', // 默认是懒加载中的状态
				isError: false, // 图片加载失败
				elIndex: this.$u.guid()
			}
		},
		computed: {
			// 将threshold从rpx转为px
			getThreshold() {
				// 先取绝对值，因为threshold可能是负数，最后根据this.threshold是正数或者负数，重新还原
				let thresholdPx = uni.upx2px(Math.abs(this.threshold));
				return this.threshold < 0 ? -thresholdPx : thresholdPx;
			},
			// 计算图片的高度，可能为auto，带%，或者直接数值
			imgHeight() {
				return this.$u.addUnit(this.height);
			}
		},
		created() {
			// 由于一些特殊原因，不能将此变量放到data中定义
			this.observer = {};
		},
		watch: {
			isShow(nVal) {
				// 如果是不开启过渡效果，直接返回
				if (!this.isEffect) return;
				this.time = 0;
				// 原来opacity为1(不透明，是为了显示占位图)，改成0(透明，意味着该元素显示的是背景颜色，默认的白色)，再改成1，是为了获得过渡效果
				this.opacity = 0;
				// 延时30ms，否则在浏览器H5，过渡效果无效
				setTimeout(() => {
					this.time = this.duration;
					this.opacity = 1;
				}, 30)
			},
			// 图片路径发生变化时，需要重新标记一些变量，否则会一直卡在某一个状态，比如isError
			image(n) {
				if(!n) {
					// 如果传入null或者''，或者undefined，标记为错误状态
					this.isError = true;
				} else {
					this.init();
					this.isError = false;
				}
			}
		},
		methods: {
			// 用于重新初始化
			init() {
				this.isError = false;
				this.loadStatus = '';
			},
			// 点击图片触发的事件,loadlazy-还是懒加载中状态，loading-图片正在加载，loaded-图片加加载完成
			clickImg() {
				let whichImg = '';
				// 如果isShow为false，意味着图片还没开始加载，点击的只能是最开始的占位图
				if (this.isShow == false) whichImg = 'lazyImg';
				// 如果isError为true，意味着图片加载失败，这是只剩下错误的占位图，所以点击的只能是错误占位图
				// 当然，也可以给错误的占位图元素绑定点击事件，看你喜欢~
				else if (this.isError == true) whichImg = 'errorImg';
				// 总共三张图片，除了两个占位图，剩下的只能是正常的那张图片了
				else whichImg = 'realImg';
				// 只通知当前图片的index
				this.$emit('click', this.index);
			},
			// 图片加载完成事件，可能是加载占位图时触发，也可能是加载真正的图片完成时触发，通过isShow区分
			imgLoaded() {
				// 占位图加载完成
				if (this.loadStatus == '') {
					this.loadStatus = 'lazyed';
				}
				// 真正的图片加载完成 
				else if (this.loadStatus == 'lazyed') {
					this.loadStatus = 'loaded';
					this.$emit('load', this.index);
				}
			},
			// 错误的图片加载完成
			errorImgLoaded() {
				this.$emit('error', this.index);
			},
			// 图片加载失败
			loadError() {
				this.isError = true;
			},
			disconnectObserver(observerName) {
				const observer = this[observerName];
				observer && observer.disconnect();
			},
		},
		beforeDestroy() {
			// 销毁页面时，可能还没触发某张很底部的懒加载图片，所以把这个事件给去掉
			//observer.disconnect();
		},
		mounted() {
			// 此uOnReachBottom事件由mixin.js发出，目的是让页面到底时，保证所有图片都进行加载，做到绝对稳定且可靠
			this.$nextTick(() => {
				uni.$once('uOnReachBottom', () => {
					if (!this.isShow) this.isShow = true;
				});
			})
			// mounted的时候，不一定挂载了这个元素，延时30ms，否则会报错或者不报错，但是也没有效果
			setTimeout(() => {
				// 这里是组件内获取布局状态，不能用uni.createIntersectionObserver，而必须用this.createIntersectionObserver
				this.disconnectObserver('contentObserver');
				const contentObserver = uni.createIntersectionObserver(this);
				// 要理解这里怎么计算的，请看这个：
				// https://blog.csdn.net/qq_25324335/article/details/83687695
				contentObserver.relativeToViewport({
					bottom: this.getThreshold,
				}).observe('.u-lazy-item-' + this.elIndex, (res) => {
					if (res.intersectionRatio > 0) {
						// 懒加载状态改变
						this.isShow = true;
						// 如果图片已经加载，去掉监听，减少性能的消耗
						this.disconnectObserver('contentObserver');
					}
				})
				this.contentObserver = contentObserver;
			}, 30)
		}
	}
</script>

<style scoped lang="scss">
	@import "../../libs/css/style.components.scss";
	
	.u-wrap {
		background-color: #eee;
		overflow: hidden;
	}

	.u-lazy-item {
		width: 100%;
		// 骗系统开启硬件加速
		transform: transition3d(0, 0, 0);
		// 防止图片加载“闪一下”
		will-change: transform;
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
	}
</style>
