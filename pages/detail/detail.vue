<template>
	<view>
		<u-navbar title-color="#222" :title="detail.vod_name || '影片名称'" title-bold :border-bottom="false"
			title-size="30" back-icon-color="#222" back-icon-size="40">
		</u-navbar>
		<video :src="src" id="play" controls :play-strategy="strategy" show-casting-button style="width: 750rpx;"
			@fullscreenchange="fullscreenchange" :autoplay="autoplay" @controlstoggle="showControls"
			:object-fit="objectFit" show-mute-btn enable-play-gesture vslide-gesture show-screen-lock-button
			@timeupdate="timeupdate" :poster="detail.vod_pic" @ended="nextEpisode()" @error="error()" direction="90">
			<template v-if="isFullscreen && controls">
				<view style="position: absolute;top: 53rpx;right: 200rpx;">
					<view class="top-icon" @click.stop="openRateMenu()">倍速</view>
				</view>
				<view style="position: absolute;top: 53rpx;right: 275rpx;">
					<view class="top-icon" :class="objectFit == 'fill' ? 'top-icon-active': ''"
						@click.stop="changeObjectFit(objectFit == 'contain' ? 'fill': 'contain')">撑满全屏</view>
				</view>
				<view style="position: absolute;top: 53rpx;right: 400rpx;" @click.stop="openFromMenu()">
					<view class="top-icon">切换播放源</view>
				</view>
				<view style="position: absolute;top: 53rpx;right: 40%">
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
				<view style="position: absolute;top: 55rpx;left: 10%;" @click.stop="handle.exitFullScreen()">
					<view class="font28 white">
						{{title}}
					</view>
				</view>
			</template>
			<template v-if="rateMenu && isFullscreen && controls">
				<view style="position: absolute;left:15%;top:30%;" class="flex flex-column">
					<view class="font35 mb-3 white">倍速</view>
					<view class="flex align-center mt-3">
						<view class="rate-btn" v-for="(item,index) in supportRate" :key="index"
							:class="rateIndex == index ? 'rate-btn-active' : ''" @click.stop="changeRate(index)">
							{{item.toFixed(1)}}X
						</view>
					</view>
				</view>
			</template>

			<template v-if="fromMenu && isFullscreen && controls">
				<view style="position: absolute;left:15%;top:30%;" class="flex flex-column">
					<view class="font35 mb-3 white">播放源</view>
					<scroll-view scroll-x="true" :scroll-with-animation="true" :show-scrollbar="false" scroll-anchoring>
						<view class="flex align-center mt-3">
							<view class="from-btn flex align-center justify-center" v-for="(item,index) in playFrom"
								:key="index" :class="playFromIndex == index ? 'rate-btn-active' : ''"
								@click.stop="changeFrom(index)">
								<text class="mb-2">{{$H.ellipsis(item,8)}}</text>
							</view>
						</view>
					</scroll-view>
				</view>
			</template>

			<template v-if="isFullscreen && episodeListMenu">
				<u-popup v-model="episodeListMenu" mode="right" width="600" :mask="false"
					:custom-style="{backgroundColor: 'rgba(0, 0, 0, 0.7)'}">
					<view class="mx-2 border-bottom-hui w100" style="height: 90rpx;">
						<text
							style="font-size: 28rpx;line-height: 90rpx;color: #FFFFFF;">全部剧集({{episode.length}})-{{fromName}}</text>
					</view>
					<scroll-view scroll-y="true" :scroll-with-animation="true" :show-scrollbar="false" scroll-anchoring
						:scroll-into-view="toEpi" style="height: 100%">
						<view :id="'epi'+ (index+1)" v-for="(item,index) in episode" :key="index"
							class="flex align-center justify-between border-bottom-hui mx-25"
							style="height: 80rpx;line-height: 80rpx;" @click.stop="changeEpisode(index)">
							<view :class="episodeCurrent == index ? 'hon' :'white'">{{$H.ellipsis(item.episode,16)}}
							</view>
							<view class="gray font25" v-if="episodeCurrent == index">正在播放</view>
						</view>
					</scroll-view>
				</u-popup>
			</template>
		</video>
		<view class="px-2 u-skeleton">
			<view class="flex align-center justify-between mt-1">
				<view class="font30 f6 u-skeleton-rect">
					{{$H.ellipsis(detail.vod_name)}}
				</view>
				<view style="margin-right: -20rpx;" class="u-skeleton-rect">
					<u-button :hair-line="false" open-type="share" :custom-style="{border:'none',fontSize:'27rpx'}"
						size="mini">
						分享给好友
					</u-button>
				</view>
			</view>

			<view class="my-1 flex align-center justify-between">
				<view class="font25 gray u-skeleton-rect"> {{detail.parentType ? detail.parentType.type_name : '未知'}} ·
					{{detail.vod_remarks ? replaceRemarks : '暂无'}} · {{detail.vod_hits}}次播放
				</view>
				<view class="u-skeleton-rect">
					<u-rate v-model="detail.vod_score / 2" disabled></u-rate><text
						class="hon ml-1">{{detail.vod_score}}分</text>
				</view>
			</view>
			
			<view class="mt-2 flex align-center justify-between">
				<view class="font28">播放列表</view>
				<view class="flex align-center">
					<view class="gray font26 mr-1">
						展开
					</view>
					<u-icon name="arrow-down" color="gray" ></u-icon>
				</view>
			</view>
		</view>
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail: {}, // 视频详情数据
				handle: null, // 操作句柄
				isFullscreen: false, // 是否全屏
				autoplay: true, // 是否自动播放
				duration: 0, // 视频总时长
				current: 0, // 当前播放进度
				controls: false, // 是否打开控制层
				objectFit: 'contain', // 视频填充模式
				episodeCurrent: 0, // 当前播放集数
				toEpi: null,
				loading: true,
				episode: [], // 当前播放剧集列表
				episodeList: [], // 剧集列表
				playFrom: [], // 播放源
				playFromIndex: 0, // 当前播放源
				supportRate: [ // 支持的倍速
					0.5,
					0.8,
					1.0,
					1.25,
					1.5,
					2.0
				],
				rateIndex: 2, // 播放倍速 index
				rateMenu: false, // 倍速菜单
				episodeListMenu: false, // 剧集菜单
				fromMenu: false, // 播放源菜单
			}
		},
		async onLoad(e) {
			let res = await this.$api.vodDetail(e.id);
			this.detail = res.data;
			this.initPlay();
		},
		onShow() {
			if (!this.handle) return;
			this.handle.play();
		},
		onHide() {
			this.handle.pause();
		},
		onUnload() {

		},
		computed: {
			replaceDirector() {
				try {
					return this.detail.vod_director.replace(/,/g, ' ');
				} catch (e) {
					//TODO handle the exception
				}
			},
			replaceActor() {
				try {
					return this.detail.vod_actor.replace(/,/g, ' ');
				} catch (e) {
					//TODO handle the exception
				}
			},
			replaceContent() {
				try {
					return this.detail.vod_content.replace(/<[^>]+>/g, "");
				} catch (e) {
					//TODO handle the exception
				}
			},
			replaceRemarks() {
				try {
					return this.$H.ellipsis(this.detail.vod_remarks);
				} catch (e) {
					//TODO handle the exception
				}
			},
			strategy() {
				try {
					return this.$H.getExt(this.src) == 'm3u8' ? 3 : 0;
				} catch (e) {
					//TODO handle the exception
				}
			},
			src() {
				try {
					return this.episode[this.episodeCurrent].src;
				} catch (e) {
					//TODO handle the exception
				}
			},
			title() {
				try {
					return this.$H.ellipsis(this.detail.vod_name, 11) + ' ' + this.episode[this.episodeCurrent].episode;
				} catch (e) {
					//TODO handle the exception
				}
			},
			fromName() {
				try {
					return this.playFrom[this.playFromIndex];
				} catch (e) {
					//TODO handle the exception
				}
			}
		},
		methods: {
			onShareAppMessage() {
				return {
					title: this.title,
					path: "", //页面路径及参数
					imageUrl: "", //图片链接，必须是网络连接，后面拼接时间戳防止本地缓存
				}
			},
			initPlay() {
				this.handle = uni.createVideoContext(`play`, this);
				this.episodeList = this.detail.vod_play_url;
				this.playFrom = this.detail.vod_play_from;
				this.episode = this.episodeList[this.playFromIndex];
				this.loading = false;
			},
			fullscreenchange(e) {
				this.isFullscreen = e.detail.fullscreen;
			},
			timeupdate(e) {
				this.duration = e.detail.duration
				this.current = e.detail.currentTime
			},
			showControls(e) {
				this.controls = e.detail.show;
				if (!this.controls) {
					this.rateMenu = false;
					this.fromMenu = false;
				}
			},
			openRateMenu() {
				this.rateMenu = !this.rateMenu;
				this.fromMenu = false;
			},
			changeRate(index) {
				this.rateIndex = index;
				this.rateMenu = false;
				this.handle.playbackRate(this.supportRate[index]);
			},
			changeObjectFit(val) {
				this.objectFit = val;
			},
			lastEpisode() {
				if (this.episodeCurrent < 1) {
					return this.$H.msg('没有上一集了');
				}
				this.changeEpisode(this.episodeCurrent - 1);
			},
			nextEpisode() {
				if (this.episodeCurrent == this.episode.length - 1) {
					return this.$H.msg('没有下一集了');
				}
				this.changeEpisode(this.episodeCurrent + 1);
			},
			changeEpisode(index) {
				// this.episodeListMenu = false;
				this.controls = false;
				this.episodeCurrent = index;
				setTimeout(() => {
					this.changeToEpi();
					this.controls = true
				}, 10);
			},
			openEpisodeListMenu() {
				this.episodeListMenu = !this.episodeListMenu;
				this.toEpi = null;
				setTimeout(() => {
					this.changeToEpi();
				}, this.episode.length > 100 ? 300 : 100);
			},
			changeToEpi() {
				const index = this.episodeCurrent + 1;
				this.toEpi = 'epi' + index;
			},
			openFromMenu() {
				this.fromMenu = !this.fromMenu;
				this.rateMenu = false;
			},
			changeFrom(index) {
				this.playFromIndex = index;
				this.fromMenu = false;
				this.episodeCurrent = 0; // 重置当前播放 不同的播放源 相同的集数key不同
				this.initPlay();
			},
			error() {
				return this.$H.msg('视频资源加载出错，可尝试切换播放源');
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
