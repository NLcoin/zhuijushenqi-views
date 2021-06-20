<template>
	<view>
		<u-navbar title-color="#222" :title="detail.vod_name || '影片名称'" title-bold :border-bottom="false"
			title-size="30" back-icon-color="#222" back-icon-size="40" :is-back="false">
			<view class="flex align-center">
				<view style="width: 80rpx;" class="ml-2" @click="$H.back()">
					<u-icon name="arrow-left" size="38"></u-icon>
				</view>
				<view style="width: 80rpx;" @click="$H.toTab('index/index')">
					<u-icon name="home" size="38"></u-icon>
				</view>
			</view>
		</u-navbar>
		<view class="u-skeleton">
			<template v-if="loading">
				<view class="u-skeleton-rect" style="width: 750rpx;height: 225px;"></view>
			</template>
			<template v-else>
				<video :src="playUrl" id="play" :title="$H.ellipsis(title,14)" controls show-casting-button
					style="width: 750rpx;" @fullscreenchange="fullscreenchange" :autoplay="autoplay"
					@controlstoggle="showControls" :object-fit="objectFit" show-mute-btn enable-play-gesture
					show-screen-lock-button @timeupdate="timeupdate" :poster="$H.getConfig('play_poster')"
					@ended="nextEpisode()" direction="90" :duration="duration" :initial-time="current"
					:unit-id="$H.getConfig('play_start_ad')">
					<template v-if="isFullscreen && controls">
						<view style="position: absolute;top: 29px;right:110px;">
							<view class="top-icon" @click.stop="openRateMenu()">倍速</view>
						</view>
						<view style="position: absolute;top: 29px;right:155px;">
							<view class="top-icon" @click.stop="openObjectFitMenu()">撑满全屏</view>
						</view>
						<view style="position: absolute;top: 29px;right: 227px;" @click.stop="openFromMenu()">
							<view class="top-icon">切换播放源</view>
						</view>
						<view style="position: absolute;top: 29px;right: 40%">
							<view class="flex align-center">
								<view class="top-icon mr-4" @click.stop="lastEpisode()">
									上一集
								</view>
								<view class="top-icon mr-4" @click.stop="openEpisodeListMenu()">
									剧集列表
								</view>
								<view class="top-icon" @click.stop="nextEpisode()">
									下一集
								</view>
							</view>
						</view>
					</template>
					<template v-if="rateMenu && isFullscreen">
						<view style="position: absolute;left:15%;top:30%;" class="flex flex-column">
							<view class="font35 mb-3 white">倍速</view>
							<view class="flex align-center mt-3">
								<view class="rate-btn" v-for="(item,index) in supportRate" :key="index"
									:class="rateIndex == index ? 'rate-btn-active' : ''"
									@click.stop="changeRate(index)">
									{{item.toFixed(1)}}X
								</view>
							</view>
						</view>
					</template>

					<template v-if="objectFitMenu && isFullscreen">
						<view style="position: absolute;left:15%;top:30%;" class="flex flex-column">
							<view class="font35 mb-3 white">模式选择</view>
							<view class="flex align-center mt-3">
								<view class="rate-btn" :class="objectFit == 'contain' ? 'rate-btn-active' : ''"
									@click.stop="changeObjectFit('contain')">
									自适应
								</view>
								<view class="rate-btn" :class="objectFit == 'fill' ? 'rate-btn-active' : ''"
									@click.stop="changeObjectFit('fill')">
									填充
								</view>
								<view class="rate-btn" :class="objectFit == 'cover' ? 'rate-btn-active' : ''"
									@click.stop="changeObjectFit('cover')">
									覆盖
								</view>
							</view>
						</view>
					</template>

					<template v-if="fromMenu && isFullscreen">
						<u-popup v-model="fromMenu" mode="right" width="600" :mask="false"
							:custom-style="{backgroundColor: 'rgba(0, 0, 0, 0.7)'}">
							<scroll-view scroll-y="true" :scroll-with-animation="true" :show-scrollbar="false"
								scroll-anchoring :scroll-into-view="toEpi" style="height: 100%">
								<view class="mx-2 border-bottom-hui w100" style="height: 90rpx;">
									<text
										style="font-size: 28rpx;line-height: 90rpx;color: #FFFFFF;">当前播放源-{{fromName}}</text>
								</view>
								<view v-for="(item,index) in playFrom" :key="index"
									class="flex align-center justify-between border-bottom-hui mx-25"
									style="height: 80rpx;line-height: 80rpx;" @click.stop="changeFrom(index)">
									<view :class="playFromIndex == index ? 'hon' :'white'">
										{{$H.ellipsis(item.name,8)}}
									</view>
									<view class="gray font25" v-if="playFromIndex == index">正在使用</view>
								</view>
							</scroll-view>
						</u-popup>
					</template>

					<template v-if="isFullscreen && episodeListMenu">
						<u-popup v-model="episodeListMenu" mode="right" width="600" :mask="false"
							:custom-style="{backgroundColor: 'rgba(0, 0, 0, 0.7)'}">
							<scroll-view scroll-y="true" :scroll-with-animation="true" :show-scrollbar="false"
								scroll-anchoring :scroll-into-view="toEpi" style="height: 100%">
								<view class="mx-2 border-bottom-hui w100" style="height: 90rpx;">
									<text
										style="font-size: 28rpx;line-height: 90rpx;color: #FFFFFF;">全部剧集({{episode.length}})-{{fromName}}</text>
								</view>
								<view :id="'epi'+ (index+1)" v-for="(item,index) in episode" :key="index"
									class="flex align-center justify-between border-bottom-hui mx-25"
									style="height: 80rpx;line-height: 80rpx;" @click.stop="changeEpisode(index)">
									<view :class="episodeCurrent == index ? 'hon' :'white'">
										{{$H.ellipsis(item.episode,16)}}
									</view>
									<view class="gray font25" v-if="episodeCurrent == index">正在播放</view>
								</view>
							</scroll-view>
						</u-popup>
					</template>
				</video>
			</template>
			<view class="flex align-center justify-between pb-15" style="width: 750rpx;height: 80rpx;" v-if="!loading">
				<view style="width: 230rpx;margin-left: -10rpx;">
					<u-tabs :list="tabs" :is-scroll="false" :current="tabCurrent" @change="tabChange"
						active-color="#ff6022">
					</u-tabs>
				</view>
				<view class="tr" style="line-height: 80rpx;">
					<u-button :hair-line="false" open-type="share" hover-class="none"
						:custom-style="{border:'none',fontSize:'27rpx'}" size="mini">
						分享给好友
					</u-button>
				</view>
			</view>
			<u-popup v-model="setShow" mode="bottom" height="400rpx">
				<view class="flex flex-column p-3">
					<view class="flex align-center justify-between mb-3">

						<view class="f8 font32" style="width: 200rpx;">
							自动跳过片首
						</view>
						<view class="flex align-center">
							<u-input type="number" v-model="skipStart" placeholder="请输入跳过的秒数" maxlength="3"
								:clearable="false" />
							<view class="f8 font32 ml-1">秒</view>
						</view>
					</view>

					<view class="flex align-center justify-between mb-3">

						<view class="f8 font32" style="width: 200rpx;">
							自动跳过片尾
						</view>
						<view class="flex align-center">
							<u-input type="number" v-model="skipEnd" placeholder="请输入跳过的秒数" :clearable="false"
								maxlength="3" />
							<view class="f8 font32 ml-1">秒</view>
						</view>
					</view>
				</view>
			</u-popup>

			<template v-if="!isFullscreen && episodeListMenu">
				<uni-popup type="bottom" ref="epiList" :maskShow="true" @clickMask="openEpisodeListMenu()">
					<view :style="{height:popupH}" class="w100 bg-bai">
						<view class="flex align-center justify-between border-bottom-hui" style="height: 80rpx;"
							@click="openEpisodeListMenu()">
							<text style="font-size: 30rpx;line-height: 80rpx;"
								class="ml-2 f6">全部剧集({{episode.length}})</text>
							<u-icon name="arrow-down" size="30" color="gray" class="mr-2"></u-icon>
						</view>
						<scroll-view scroll-y="true" :scroll-with-animation="true" :show-scrollbar="true"
							:scroll-into-view="toEpi" style="height: 100%;background-color: #fff;">
							<view :id="'epi'+ (index+1)" v-for="(item,index) in episode" :key="index"
								class="flex align-center justify-between border-bottom-hui mx-25"
								style="height: 80rpx;line-height: 80rpx;" @click.stop="changeEpisode(index)">
								<view :class="episodeCurrent == index ? 'hon' :''" class="f6">
									{{$H.ellipsis(item.episode,16) || $H.formatNumber(index+1)}}
								</view>
								<view class="gray font25" v-if="episodeCurrent == index">正在播放</view>
							</view>
							<view class="bg-bai" style="height: 80rpx;"></view>
						</scroll-view>
					</view>
				</uni-popup>
			</template>
			<scroll-view scroll-y="true" :style="{height:scrollH}">
				<view class="px-2 vodinfo">
					<view class="flex align-center justify-between mt-1">
						<view class="font33 f7 u-skeleton-rect">
							{{$H.ellipsis(detail.vod_name || '影片名称')}}
						</view>
						<view class="font27 u-skeleton-rect gray" @click.stop="toDownload">
							<u-icon name="download" class="mr-1"></u-icon>浏览器播放
						</view>
					</view>

					<view class="my-2 flex align-center justify-between">
						<view class="font25 gray u-skeleton-rect text-ellipsis1" style="width: 400rpx;">
							{{detail.parentType ? detail.parentType.type_name : detail.type.type_name}} ·
							同步更新 · {{detail.vod_hits}}次播放
						</view>
						<view class="u-skeleton-rect font25 gray">
							{{$u.timeFormat(detail.vod_time, 'yyyy-mm-dd hh:MM:ss')}}
						</view>
					</view>

					<view class="mt-2 flex align-center justify-between u-skeleton-rect">
						<view class="font29 f6">播放列表</view>
						<view class="flex align-center" @click="openEpisodeListMenu()">
							<view class="gray font26 mr-1">
								{{episodeListMenu ? '收起' : '展开'}}
							</view>
							<u-icon :name="episodeListMenu ? 'arrow-up' : 'arrow-down'" color="gray"></u-icon>
						</view>
					</view>
					<template v-if="loading">
						<view class="mt-2 u-skeleton-rect w100" style="height: 90rpx;"></view>
					</template>
					<template v-else>
						<view class="mt-2" style="margin-left: -10rpx;">
							<u-tabs-zdy ref="epitabs" :list="episode" :current="episodeCurrent" @change="changeEpisode"
								name="episode" :show-bar="false" :active-item-style="{backgroundColor:'#f7f9fb'}"
								active-color="#ff6022" itemBgColor="#f7f9fb">
							</u-tabs-zdy>
						</view>
					</template>
					<view class="mt-2 flex align-center justify-between">
						<view class="font29 f6 u-skeleton-rect">播放来源</view>
						<view style="margin-right: -23rpx;">
							<u-button :hair-line="false" @click="$H.previewImage('kf_img')"
								:custom-style="{border:'none',fontSize:'28rpx'}" size="mini" class="u-skeleton-rect">
								<text class="font27 gray">联系客服</text>
							</u-button>
						</view>
					</view>
					<template v-if="loading">
						<view class="mt-2 u-skeleton-rect w100" style="height: 90rpx;"></view>
					</template>
					<template v-else>
						<view class="mt-2" style="margin-left: -10rpx;">
							<u-tabs-zdy :list="playFrom" :current="playFromIndex" @change="changeFrom" :show-bar="false"
								:active-item-style="{backgroundColor:'#f7f9fb'}" active-color="#ff6022"
								itemBgColor="#f7f9fb" name="name">
							</u-tabs-zdy>
						</view>
					</template>

					<view class="mt-2 mb-1 font29 f6 u-skeleton-rect">使用帮助</view>
					<u-collapse :head-style="{fontSize:'28rpx'}">
						<u-collapse-item :title="item.head" v-for="(item, index) in $H.getConfig('help_list')"
							:key="index" :open="item.open" :disabled="item.disabled" class="u-skeleton-rect">
							{{item.body}}
						</u-collapse-item>
					</u-collapse>

					<view class="mt-3 flex align-center justify-between">
						<view class="font29 f6 u-skeleton-rect">影片简介</view>
					</view>

					<view class="my-3 font28 u-skeleton-rect">
						<rich-text :nodes="replaceContent || '<p>该影片暂时没有简介哦</p>'" v-if="!loading"></rich-text>
					</view>

				</view>
			</scroll-view>
		</view>
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	let redAd = null;
	let isRadLoad = true;
	let isAdWatch = false;
	import playMixin from '@/pages/detail/mixin/playMixin.js';
	export default {
		mixins: [playMixin],
		data() {
			return {
				loading: true,
				tabs: [{
					name: '详情'
				}, {
					name: '设置'
				}],
				scrollH: 1820 + 'px',
				tabCurrent: 0,
				setShow: false,
				skipStart: 0,
				skipEnd: 0
			}
		},
		async onLoad(e) {
			let res = await this.$api.vodDetail(e.id);
			this.detail = res.data;
			await this.initCache();
			await this.initPlay();
			this.initRedAd();
			this.loading = false;
			let sysInfo = uni.getSystemInfoSync();
			this.popupH = sysInfo.windowHeight - uni.upx2px(630) + 'px';
		},
		onReady() {
			setTimeout(async () => {
				let rectInfo = await this.$u.getRect('.vodinfo');
				this.scrollH = rectInfo.height + 'px';
			}, 50);
		},
		onShow() {
			if (!this.handle) return;
			this.handle.play();
		},
		async onHide() {
			this.handle.pause();
		},
		onUnload() {
			this.cachePlay();
		},
		watch: {
			current(n, o) {
				if (this.setShow) {
					this.handle.pause();
				}
				let nowCurrent = this.duration - n;
				if (n < this.skipStart && this.skipStart > 0 && o <= 0) { // 跳过片首
					if (this.skipStart > (this.duration - this.skipEnd)) {
						this.skipStart = 0;
						return this.$H.msg('跳过片首时长错误');
					}
					this.handle.seek(parseInt(this.skipStart));
					this.$H.msg('已为您自动跳过片首');
				}
				if (this.skipEnd > (this.duration - this.skipStart)) {
					this.skipEnd = 0;
					return this.$H.msg('跳过片尾时长错误');
				}
				if (nowCurrent <= this.skipEnd && this.skipEnd > 0) {
					if (this.episodeCurrent == this.episode.length - 1) {
						this.skipStart = 0;
						this.skipEnd = 0;
						return this.$H.msg('没有下一集了');
					}
					this.$H.msg('已为您自动跳过片尾');
					this.changeEpisode(this.episodeCurrent + 1);
				}
			},
			setShow(n, o) {
				if (n) {
					this.handle.pause();
				} else {
					this.handle.play();
				}
			}
		},
		methods: {
			onShareAppMessage() {
				return {
					title: this.title,
					path: '', //页面路径及参数
					imageUrl: this.detail.vod_pic, //图片链接，必须是网络连接，后面拼接时间戳防止本地缓存
				}
			},
			openSet() {
				this.setShow = true;
			},
			timeupdate(e) {
				this.duration = e.detail.duration;
				this.current = e.detail.currentTime;
			},
			initRedAd() {
				redAd = uni.createRewardedVideoAd({
					adUnitId: this.$H.getConfig('rewarded_ad')
				});
				redAd.onLoad(e => {
					isRadLoad = true;
				});
				redAd.onError(e => {
					isRadLoad = false;
				});
				redAd.onClose(res => {
					if (res && res.isEnded) {
						this.$H.msg('观看完成');
						isAdWatch = true;
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/detail/cache/cache?vod_id=' + this.detail.vod_id +
									'&watching=' + this
									.episodeCurrent
							});
						}, 100);
					} else {
						this.$H.msg('您未完整观看视频，无法获得奖励');
					}
				});
			},
			toDownload() {
				if (!isRadLoad || isAdWatch) {
					uni.navigateTo({
						url: '/pages/detail/cache/cache?vod_id=' + this.detail.vod_id + '&watching=' + this
							.episodeCurrent
					});
					return;
				}
				uni.showModal({
					title: '温馨提示',
					content: '使用该功能需要观看一则视频，是否观看？',
					success: res => {
						if (res.confirm) {
							this.handle.pause();
							redAd.show().catch(() => {
								uni.navigateTo({
									url: '/pages/detail/cache/cache?vod_id=' + this.detail
										.vod_id + '&watching=' + this
										.episodeCurrent
								});
							});
						}
					}
				});
			},
			tabChange(index) {
				if (index == 1) {
					return this.openSet();
				}
				this.tabCurrent = index;
			}
		}
	}
</script>

<style>
	.top-icon {
		color: #FFFFFF;
		font-size: 27rpx;
	}

	.top-icon-active {
		color: #ef5952;
		font-size: 27rpx;
	}

	.rate-btn {
		background-color: rgba(0, 0, 0, 0.5);
		width: 180rpx;
		height: 180rpx;
		color: #FFFFFF;
		text-align: center;
		font-size: 34rpx;
		line-height: 180rpx;
		margin-right: 30rpx;
	}

	.from-btn {
		background-color: rgba(0, 0, 0, 0.5);
		width: 190rpx;
		height: 180rpx;
		color: #FFFFFF;
		font-size: 34rpx;
		margin-right: 30rpx;
	}

	.rate-btn-active {
		color: #ef5952;
		border-bottom: #ef5952 solid 5rpx;
	}
</style>
