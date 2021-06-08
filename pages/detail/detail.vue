<template>
	<view style="width: 750rpx;overflow-x: hidden;">
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
				<view class="u-skeleton-rect" style="width: 750rpx;height: 420rpx;"></view>
			</template>
			<template v-else>
				<video v-if="fromData.online && !showVideoAd" :src="playUrl" id="play" :title="$H.ellipsis(title,16)"
					controls :play-strategy="strategy" show-casting-button style="width: 750rpx;height: 420rpx;"
					@fullscreenchange="fullscreenchange" :autoplay="autoplay" @controlstoggle="showControls"
					:object-fit="objectFit" show-mute-btn enable-play-gesture vslide-gesture show-screen-lock-button
					@timeupdate="timeupdate" :poster="detail.vod_pic" @ended="nextEpisode()" direction="90"
					:duration="duration" :initial-time="current" :unit-id="$H.getConfig('play_start_ad')"
					@error="error()">
					<template v-if="isFullscreen && controls">
						<view style="position: absolute;top: 29px;right:110px;">
							<view class="top-icon" @click.stop="openRateMenu()">倍速</view>
						</view>
						<view style="position: absolute;top: 29px;right:155px;">
							<view class="top-icon" :class="objectFit == 'cover' ? 'top-icon-active': ''"
								@click.stop="changeObjectFit(objectFit == 'contain' ? 'cover': 'contain')">撑满全屏</view>
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
					<template v-if="rateMenu && isFullscreen && controls">
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

					<template v-if="fromMenu && isFullscreen && controls">
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
									style="height: 80rpx;line-height: 80rpx;"
									@click.stop="changeFrom(index)">
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
									style="height: 80rpx;line-height: 80rpx;"
									@click.stop="changeEpisode(index)">
									<view :class="episodeCurrent == index ? 'hon' :'white'">
										{{$H.ellipsis(item.episode,16)}}
									</view>
									<view class="gray font25" v-if="episodeCurrent == index">正在播放</view>
								</view>
							</scroll-view>
						</u-popup>
					</template>
				</video>


				<template
					v-if="(!fromData.online && $H.getConfig('video_ad')) || (showVideoAd && $H.getConfig('video_ad'))">
					<ad :unit-id="$H.getConfig('video_ad')" ad-type="video" ad-theme="white"></ad>
				</template>
				<template v-else-if="!fromData.online && !$H.getConfig('video_ad')">
					<view style="width: 750rpx;height: 225px;background-color: #000000;"
						class="flex align-center justify-center">
						<image :src="detail.vod_pic" mode="aspectFit" style="height: 225px;"></image>
					</view>
				</template>
			</template>
			<view class="px-2 vodinfo">
				<view class="flex align-center justify-between mt-1">
					<view class="font33 f7 u-skeleton-rect">
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
							itemBgColor="#f7f9fb" @onTap="!fromData.online ? copyIePlay() : false">
						</u-tabs-zdy>
					</view>
				</template>


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
									style="height: 80rpx;line-height: 80rpx;"
									@click.stop="!fromData.online ? copyIePlay() : changeEpisode(index)">
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

				<view class="mt-2 flex align-center justify-between">
					<view class="font29 f6 u-skeleton-rect">播放来源</view>
					<view style="margin-right: -33rpx;">
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
						<u-tabs-zdy :list="playFrom" :current="playFromIndex" @change="changeFrom" :show-bar="false"
							:active-item-style="{backgroundColor:'#f7f9fb'}" active-color="#ff6022"
							itemBgColor="#f7f9fb" name="name">
						</u-tabs-zdy>
					</view>
				</template>

				<view class="mt-25 flex align-center justify-between">
					<view class="font29 f6 u-skeleton-rect">影片简介</view>
					<view class="font27 f5 gray u-skeleton-rect" @click="addGroup()"
						style="text-decoration: underline;color: #FF0000;">点我加入交流群，追剧不迷路</view>
				</view>

				<view class="my-3 font28" v-if="!loading">
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
					<view class="flex align-center justify-between flex-wrap voditem">
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
				playUrl: null, // 当前播放地址
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
				moreList: [],
				isRadLoad: false, // 是否加载完成
				isShowRad: false, // 是否 ad show过了
				redAd: null,
				isError: false,
				showVideoAd: false,
				timer: null
			}
		},
		async onLoad(e) {
			let res = await this.$api.vodDetail(e.id);
			this.detail = res.data;
			await this.initCache();
			await this.initPlay();
			this.initRedAd();
			let sysInfo = uni.getSystemInfoSync();
			this.popupH = sysInfo.windowHeight - sysInfo.statusBarHeight - uni.upx2px(560) + 'px';
			this.checkOnline();
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
			clearTimeout(this.timer);
			this.cachePlay();
		},
		watch: {
			playFromIndex(val, oldVal) {
				this.showVideoAd = false;
				this.checkOnline();
			},
			episodeCurrent(val, oldVal) {
				if (this.fromData.online == false) { // 不支持在线播放
					setTimeout(() => {
						this.handle.stop();
					}, 10);
				}
			}
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
			title() {
				try {
					return this.detail.vod_name + ' ' + this.episode[this.episodeCurrent].episode;
				} catch (e) {
					//TODO handle the exception
				}
			},
			fromName() {
				try {
					return this.playFrom[this.playFromIndex].name;
				} catch (e) {
					//TODO handle the exception
				}
			},
			fromData() {
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
					imageUrl: this.detail.vod_pic, //图片链接，必须是网络连接，后面拼接时间戳防止本地缓存
				}
			},
			addGroup() {
				uni.previewImage({
					current: 'https://upyun.2oc.cc/group.jpg', // 当前显示图片的http链接
					urls: ['https://upyun.2oc.cc/group.jpg'] // 需要预览的图片http链接列表
				});
			},
			copyIePlay() {
				const parse_url = this.fromData.parse_url + encodeURI(this.src);
				uni.setClipboardData({
					data: parse_url
				});
			},
			initRedAd() {
				// 不支持在线播放的，不播放激励视频
				if (!this.fromData.online) return;
				this.redAd = uni.createRewardedVideoAd({
					adUnitId: this.$H.getConfig('rewarded_ad')
				});
				this.redAd.onLoad(e => {
					this.isRadLoad = true;
				});
				this.redAd.onError(e => {
					this.isRadLoad = false;
					this.handle.play();
				});
				this.redAd.onClose(res => {
					if (res && res.isEnded) {
						this.handle.play(); // 播放开始
						this.$H.msg('切换高速线路成功');
					} else {
						this.$H.msg('您未完整观看视频，无法获得高速播放');
					}
				});
			},
			showRad() {
				if (!this.isRadLoad) return;
				if (!this.fromData.online) return; // 不支持在线播放也不触发
				this.handle.pause(); // 暂停播放
				uni.showModal({
					title: '温馨提示',
					content: '播放视频后可使用高速播放通道，是否观看视频？',
					cancelText: '不了',
					confirmText: '好的',
					success: (res) => {
						if (res.confirm) {
							setTimeout(() => {
								this.redAd.show();
							}, 50);
						} else {
							this.handle.play();
						}
					}
				});
			},
			checkOnline() {
				if (this.fromData.online == false) { // 不支持在线播放
					this.handle.stop();
					this.exitFullScreen();
					setTimeout(() => {
						uni.showModal({
							title: '提示信息',
							content: '该播放源不支持在线播放，可点击想看的集数复制链接到浏览器观看',
							showCancel: false,
							confirmText: '我知道了',
							success: res => {
								if (res.confirm) {
									this.copyIePlay();
								}
							}
						});
					}, 100);
				}
			},
			exitFullScreen() {
				if (this.isFullscreen && this.handle) this.handle.exitFullScreen();
			},
			async initPlay() {
				if (!this.handle) this.handle = uni.createVideoContext(`play`, this);
				if (!this.detail.vod_play_from.length) {
					uni.showModal({
						showCancel: false,
						title: '提示信息',
						content: '该影片资源缺失暂时无法观看，我们正在处理中',
						confirmText: '我知道了',
						success: res => {
							this.$H.back();
						}
					})
				}
				this.episodeList = this.detail.vod_play_url;
				this.playFrom = this.detail.vod_play_from;
				this.episode = this.episodeList[this.playFromIndex];
				this.parseUrl();
			},
			cachePlay() {
				if (!this.detail) {
					return;
				}
				let {
					vod_id,
					vod_pic,
					vod_remarks,
					type,
					parentType
				} = this.detail;
				let cache = uni.getStorageSync('history') || [];
				let cacheId = cache.findIndex(v => v.vod_id == vod_id);
				let saveData = {
					vod_id,
					vod_pic,
					vod_remarks,
					type,
					parentType,
					duration: Math.floor(this.duration),
					current: Math.floor(this.current),
					episodeCurrent: this.episodeCurrent,
					playFrom: this.playFromIndex,
					title: this.title,
					fromName: this.fromName
				};
				if (cacheId == '-1') {
					cache.unshift(saveData);
					if (cache.length >= 30) cache.pop();
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
				if (this.cache) {
					this.playFromIndex = this.cache.playFrom;
					this.episodeCurrent = this.cache.episodeCurrent;
					this.duration = this.cache.duration;
					this.current = this.cache.current;
					this.$H.msg('正在加载上次播放记录');
				}
			},
			fullscreenchange(e) {
				this.isFullscreen = e.detail.fullscreen;
			},
			timeupdate(e) {
				this.duration = e.detail.duration;
				this.current = e.detail.currentTime;
				if (this.isShowRad == false) {
					this.isShowRad = true;
					clearTimeout(this.timer);
					this.timer = setTimeout(() => {
						this.showRad();
					}, 30000);
				}
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
				if(this.episodeCurrent == index) return;
				this.controls = false;
				this.episodeCurrent = index;
				this.parseUrl(true);
				setTimeout(() => {
					this.changeToEpi();
					this.controls = true;
				}, 10);
			},
			async parseUrl(rest = false) {
				let url = this.episode[this.episodeCurrent].src;
				if (this.fromData.get_url && url) {
					uni.showLoading({
						mask: true,
						title: '解析中'
					});
					let res = await this.$api.parseUrl(url, this.fromData.get_url);
					uni.hideLoading();
					if (!res || !res.data.url) {
						this.playUrl = '';
						uni.showModal({
							showCancel: false,
							title: '提示信息',
							content: '该播放源解析资源失败，请切换播放源，如果都不可播放请联系客服处理'
						});
						this.exitFullScreen();
						this.showVideoAd = true;
						return;
					}
					this.playUrl = res.data.url;
				} else {
					this.playUrl = url;
				}
				if (rest) this.current = 0;
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
				}, 500);
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
				if(this.playFromIndex == index) return;
				this.playFromIndex = index;
				this.fromMenu = false;
				this.episodeCurrent = 0; // 重置当前播放 不同的播放源 相同的集数key不同
				this.current = 0;
				this.controls = false;
				this.initPlay();
				setTimeout(() => {
					this.controls = true
				}, 10);
			},
			error(e) {
				if (this.isError) return;
				this.isError = true;
				uni.showModal({
					showCancel: false,
					title: '温馨提示',
					content: '视频加载慢或长时间无反应，可尝试切换播放源,部分蓝光资源可能加载时间会稍微长一些，有任何疑问可加群或联系客服解决。',
					confirmText: '我知道了'
				});
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
