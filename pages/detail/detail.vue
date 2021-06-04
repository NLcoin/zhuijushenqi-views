<template>
	<view style="width: 750rpx;overflow-x: hidden;">
		<u-navbar title-color="#222" :title="detail.vod_name || '影片名称'" title-bold :border-bottom="false"
			title-size="30" back-icon-color="#222" back-icon-size="40" :is-back="false">
			<view>
				<u-icon name="arrow-left" class="mx-2" @click="$H.back()" size="38"></u-icon>
				<u-icon name="home" class="ml-2" @click="$H.toTab('index/index')" size="38"></u-icon>
			</view>
		</u-navbar>
		<view class="u-skeleton">
			<template v-if="loading">
				<view class="u-skeleton-rect" style="width: 750rpx;height: 225px;"></view>
			</template>
			<template v-else>
				<video :src="src" id="play" controls :play-strategy="strategy" show-casting-button style="width: 750rpx;"
					@fullscreenchange="fullscreenchange" :autoplay="autoplay" @controlstoggle="showControls"
					:object-fit="objectFit" show-mute-btn enable-play-gesture vslide-gesture show-screen-lock-button
					@timeupdate="timeupdate" :poster="detail.vod_pic" @ended="nextEpisode()" direction="90"
					:duration="duration" :initial-time="current">
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
						<view style="position: absolute;top: 48%;right: 7%" @click.stop="copyIePlay()">
							<u-icon name="ie" color="#FFF" size="41"></u-icon>
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
							<scroll-view scroll-x="true" :scroll-with-animation="true" :show-scrollbar="false"
								scroll-anchoring>
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
							<view class="mx-2 border-bottom-hui w100" style="height: 90rpx;position: sticky;top: 0;">
								<text
									style="font-size: 28rpx;line-height: 90rpx;color: #FFFFFF;">全部剧集({{episode.length}})-{{fromName}}</text>
							</view>
							<scroll-view scroll-y="true" :scroll-with-animation="true" :show-scrollbar="false"
								scroll-anchoring :scroll-into-view="toEpi" style="height: 100%">
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
			</template>
			<view class="px-2">
				<view class="flex align-center justify-between mt-1">
					<view class="font31 f6 u-skeleton-rect">
						{{$H.ellipsis(detail.vod_name || '影片名称')}}
					</view>
					<view style="margin-right: -20rpx;" class="u-skeleton-rect">
						<u-button :hair-line="false" open-type="share" hover-class="none"
							:custom-style="{border:'none',fontSize:'27rpx'}" size="mini">
							分享给好友
						</u-button>
					</view>
				</view>

				<view class="my-1 flex align-center justify-between">
					<view class="font25 gray u-skeleton-rect">
						{{detail.parentType ? detail.parentType.type_name : '未知'}} ·
						{{detail.vod_remarks ? replaceRemarks : '暂无'}} · {{detail.vod_hits}}次播放
					</view>
					<view class="u-skeleton-rect">
						<u-rate v-model="detail.vod_score / 2" disabled></u-rate><text
							class="hon ml-1">{{detail.vod_score || '0.0'}}分</text>
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
						<u-tabs-zdy :list="episode" :current="episodeCurrent" @change="changeEpisode" name="episode"
							:show-bar="false" :active-item-style="{backgroundColor:'#f7f9fb'}" active-color="#ff6022"
							itemBgColor="#f7f9fb">
						</u-tabs-zdy>
					</view>
				</template>


				<template v-if="!isFullscreen && episodeListMenu">
					<uni-popup type="bottom" ref="epiList">
						<view :style="{height:popupH}" class="w100 bg-bai">
							<view class="flex align-center justify-between border-bottom-hui" style="height: 80rpx;"
								@click="openEpisodeListMenu()">
								<text style="font-size: 29rpx;line-height: 80rpx;"
									class="ml-2">全部剧集({{episode.length}})</text>
								<u-icon name="arrow-down" size="30" color="gray" class="mr-2"></u-icon>
							</view>
							<scroll-view scroll-y="true" :scroll-with-animation="true" :show-scrollbar="true"
								:scroll-into-view="toEpi" style="height: 100%;background-color: #fff;">
								<view :id="'epi'+ (index+1)" v-for="(item,index) in episode" :key="index"
									class="flex align-center justify-between border-bottom-hui mx-25"
									style="height: 80rpx;line-height: 80rpx;" @click.stop="changeEpisode(index)">
									<view :class="episodeCurrent == index ? 'hon' :''">{{$H.ellipsis(item.episode,16)}}
									</view>
									<view class="gray font25" v-if="episodeCurrent == index">正在播放</view>
								</view>
							</scroll-view>
						</view>
					</uni-popup>
				</template>

				<view class="mt-2 flex align-center justify-between">
					<view class="font29 f6 u-skeleton-rect">播放来源</view>
					<view style="margin-right: -35rpx;">
						<u-button :hair-line="false" show-message-card hover-class="none"
							:send-message-img="detail.vod_pic" open-type="contact" send-message-path
							:send-message-title="title" :custom-style="{border:'none',fontSize:'28rpx'}" size="mini"
							class="u-skeleton-rect">
							<text class="font27 gray">播放遇到问题？</text>
						</u-button>
					</view>
				</view>
				<template v-if="loading">
					<view class="mt-2 u-skeleton-rect w100" style="height: 90rpx;"></view>
				</template>
				<template v-else>
					<view class="mt-2" style="margin-left: -10rpx;">
						<u-tabs-zdy :list="fromTabs" :current="playFromIndex" @change="changeFrom" :show-bar="false"
							:active-item-style="{backgroundColor:'#f7f9fb'}" active-color="#ff6022"
							itemBgColor="#f7f9fb">
						</u-tabs-zdy>
					</view>
				</template>

				<view class="mt-2 flex align-center justify-between">
					<view class="font29 f6 u-skeleton-rect">影片简介</view>
				</view>

				<view class="my-2 font28" v-if="!loading">
					<u-read-more show-height="200" close-text="展开阅读" color="#ff6022">
						<rich-text :nodes="replaceContent || '<p>该影片暂时没有简介哦</p>'"></rich-text>
					</u-read-more>
				</view>

				<view class="my-2 flex align-center justify-between">
					<view class="font29 f6 u-skeleton-rect">为你推荐</view>
				</view>
				<template v-if="loading">
					<!-- 骨架屏模拟数据 -->
					<view class="flex align-center justify-between flex-wrap">
						<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mr-1 mb-4"></view>
						<view class="u-skeleton-fillet vodskeleton mb-4"></view>
					</view>
					<!-- end -->
				</template>
				<template v-else>
					<view class="flex align-center justify-between flex-wrap">
						<block v-for="(item,index) in moreList" :key="index">
							<vod-item :item="item"></vod-item>
						</block>
					</view>
				</template>
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
				cache: null, // 缓存数据
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
				popupH: 0,
				rateIndex: 2, // 播放倍速 index
				rateMenu: false, // 倍速菜单
				episodeListMenu: false, // 剧集菜单
				fromMenu: false, // 播放源菜单
				moreList: []
			}
		},
		async onLoad(e) {
			let res = await this.$api.vodDetail(e.id);
			this.detail = res.data;
			await this.initCache();
			await this.initPlay();
			let sysInfo = uni.getSystemInfoSync();
			this.popupH = sysInfo.windowHeight - uni.upx2px(140) - sysInfo.statusBarHeight - 225 + 'px';
			let more = await this.$api.getVodHot(1, 6);
			this.moreList = more.data.list;
			this.loading = false;
		},
		onShow() {
			if (!this.handle) return;
			this.handle.play();
		},
		onHide() {
			this.handle.pause();
		},
		onUnload() {
			this.cachePlay();
		},
		computed: {
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
			},
			fromTabs() {
				let arr = [];
				for (let i = 0; i < this.playFrom.length; i++) {
					arr.push({
						name: this.playFrom[i]
					});
				}
				return arr;
			}
		},
		methods: {
			onShareAppMessage() {
				return {
					title: this.title,
					path: "", //页面路径及参数
					imageUrl: this.detail.vod_pic, //图片链接，必须是网络连接，后面拼接时间戳防止本地缓存
				}
			},
			copyIePlay() {
				uni.setClipboardData({
					data: this.$H.getIePlayUrl(this.src),
					success: () => {
						uni.hideToast();
						this.$H.msg('复制播放地址成功');
					}
				});
			},
			async initPlay() {
				this.handle = uni.createVideoContext(`play`, this);
				if (this.cache) {
					this.playFromIndex = this.cache.playFrom;
					this.episodeCurrent = this.cache.episodeCurrent;
					this.duration = this.cache.duration;
					this.current = this.cache.current;
					this.$H.msg('正在为你跳转至上次播放的位置', 2000);
				}
				this.episodeList = this.detail.vod_play_url;
				this.playFrom = this.detail.vod_play_from;
				this.episode = this.episodeList[this.playFromIndex];
			},
			cachePlay() {
				if(!this.detail){
					return ;
				}
				let {
					vod_id,
					vod_pic,
					vod_remarks
				} = this.detail;
				let cache = uni.getStorageSync('history') || [];
				let cacheId = cache.findIndex(v => v.vod_id == vod_id);
				let saveData = {
					vod_id,
					vod_pic,
					vod_remarks,
					duration: Math.floor(this.duration),
					current: Math.floor(this.current),
					episodeCurrent: this.episodeCurrent,
					playFrom: this.playFromIndex,
					title: this.title,
					fromName: this.fromName
				};
				if (cacheId == '-1') {
					cache.unshift(saveData);
				} else {
					cache[cacheId] = saveData;
				}
				uni.setStorageSync('history', cache);
			},
			async initCache() {
				let {
					vod_id
				} = this.detail;
				let cache = uni.getStorageSync('history') || [];
				let cacheId = cache.findIndex(v => v.vod_id == vod_id);
				if (cacheId == '-1') return;
				this.cache = cache[cacheId];
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
				if (this.episodeListMenu) {
					setTimeout(() => this.$refs['epiList'].open(), 10);
				} else {
					this.$refs['epiList'].close();
				}
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
