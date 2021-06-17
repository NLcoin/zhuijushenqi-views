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
				<video :src="playUrl" id="play" :title="$H.ellipsis(title,16)" controls show-casting-button
					style="width: 750rpx;" @fullscreenchange="fullscreenchange" :autoplay="autoplay"
					@controlstoggle="showControls" :object-fit="objectFit" show-mute-btn enable-play-gesture
					show-screen-lock-button @timeupdate="timeupdate" :poster="detail.vod_pic" @ended="nextEpisode()"
					direction="90" :duration="duration" :initial-time="current" :unit-id="$H.getConfig('play_start_ad')"
					@error="error()" danmu-btn enable-danmu :danmu-list="danmuList" play-strategy="3">
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

					<template v-if="isFullscreen && controls">
						<view style="position: absolute;right:7%;top:46%;" @click="dmInputIcon()">
							<u-icon name="edit-pen" color="#ffffff" size="41"
								style="text-shadow: 0 0 10rpx rgb(0 0 0 / 70%);">
							</u-icon>
						</view>
					</template>

					<template v-if="isFullscreen && isDmInput">
						<view style="position: absolute;right: 0;left: 0;"
						class="flex align-center" :style="{bottom:dmInputH,width:dmInputW+'px'}">
							<view style="height: 85rpx;z-index: 1030;" class="bg-hui ml-2 p-2" :style="{width:dmInputW-90+'px'}">
								<input v-model="roomMsg" type="text" placeholder="请文明发言" :adjust-position="false"
									@confirm="sendRoomMsg()" confirm-type="send" @keyboardheightchange="dmInputChange"
									@blur="dmInputBlur()" focus auto-blur />
							</view>
							<view class="font30 ml-5" @touchend.prevent="sendRoomMsg()">
								发送
							</view>
						</view>
					</template>
				</video>
			</template>
			<view class="flex align-center justify-between pb-15" style="width: 750rpx;height: 80rpx;" v-if="!loading">
				<view style="width: 230rpx;margin-left: -10rpx;">
					<u-tabs :list="tabs" :is-scroll="false" :current="tabCurrent" @change="tabChange"
						active-color="#ff6022" item-width="40">
					</u-tabs>
				</view>
				<view class="tr" style="line-height: 80rpx;">
					<u-button :hair-line="false" open-type="share" hover-class="none"
						:custom-style="{border:'none',fontSize:'27rpx'}" size="mini">
						分享给好友
					</u-button>
				</view>
			</view>

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
			<swiper :current="tabCurrent" @change="changeSwiper" :style="{height:swiperH}">
				<swiper-item>
					<scroll-view scroll-y="true" :style="{height:scrollH}">
						<view class="px-2 vodinfo">
							<view class="flex align-center justify-between mt-1">
								<view class="font33 f7 u-skeleton-rect">
									{{$H.ellipsis(detail.vod_name || '影片名称')}}
								</view>
								<view class="font27 u-skeleton-rect gray" @click.stop="toDownload">
									<u-icon name="download" class="mr-1"></u-icon>离线缓存
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
									<u-tabs-zdy ref="epitabs" :list="episode" :current="episodeCurrent"
										@change="changeEpisode" name="episode" :show-bar="false"
										:active-item-style="{backgroundColor:'#f7f9fb'}" active-color="#ff6022"
										itemBgColor="#f7f9fb">
									</u-tabs-zdy>
								</view>
							</template>
							<view class="mt-2 flex align-center justify-between">
								<view class="font29 f6 u-skeleton-rect">播放来源</view>
								<view style="margin-right: -23rpx;">
									<u-button :hair-line="false" @click="$H.previewImage('kf_img')"
										:custom-style="{border:'none',fontSize:'28rpx'}" size="mini"
										class="u-skeleton-rect">
										<text class="font27 gray">联系客服</text>
									</u-button>
								</view>
							</view>
							<template v-if="loading">
								<view class="mt-2 u-skeleton-rect w100" style="height: 90rpx;"></view>
							</template>
							<template v-else>
								<view class="mt-2" style="margin-left: -10rpx;">
									<u-tabs-zdy :list="playFrom" :current="playFromIndex" @change="changeFrom"
										:show-bar="false" :active-item-style="{backgroundColor:'#f7f9fb'}"
										active-color="#ff6022" itemBgColor="#f7f9fb" name="name">
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
				</swiper-item>
				<swiper-item>
					<scroll-view :scroll-into-view="chatToIndex" scroll-y="true" style="background-color: #f8f8f8;"
						:style="{height:scrollH2}" scroll-with-animation>
						<view class="flex align-center justify-center" style="margin-top: 230rpx;" v-if="!isAddRoom">
							<u-button type="success" @click="addRoom()">
								加入讨论(当前{{roomNum}}人)
							</u-button>
						</view>
						<template v-if="isAddRoom">
							<block v-for="(item,index) in msgList" :key="index">
								<template v-if="item.data.type == 'msg'">
									<view class="py-2 flex align-center justify-center gray font27"
										v-if="$H.parseChatTime(item.time,index > 0 ? msgList[index-1].time : 0)">
										{{$H.parseChatTime(item.time,index > 0 ? msgList[index-1].time : 0)}}
									</view>
									<view class="flex align-start px-2 my-2" :id="'chat'+index"
										:style="userInfo.avatarUrl == item.from_pic ? 'flex-direction:row-reverse' : ''">
										<u-avatar :src="item.from_pic" size="mini"></u-avatar>
										<view class="flex flex-column">
											<view class="p-2 mx-2"
												:style="item.data.content.length <= 3 ? 'text-align: center;' : 'text-align: left;'"
												:class="userInfo.avatarUrl == item.from_pic ? 'bg-lv' : 'bg-bai'"
												style="border-radius: 10rpx;min-width: 100rpx;max-width: 400rpx;">
												{{item.data.content}}
											</view>
											<view class="font27 gray tc"
												style="text-decoration: underline;max-width: 400rpx;"
												@click="toMsgCurrent(item.data.current,item.data.episodeCurrent)">
												{{episode[item.data.episodeCurrent].episode}}
												{{$H.s_to_hs(item.data.current)}}
											</view>
										</view>
									</view>
								</template>
								<template v-else>
									<view class="flex align-center justify-center my-2 gray" :id="'chat'+index">
										{{item.data.content}}
									</view>
								</template>
							</block>
							<view class="py-2"></view>
						</template>
					</scroll-view>
					<view style="height: 100rpx;" class="border-top-hui bg-bai flex align-center abs-bottom"
						v-if="isAddRoom" :style="{bottom:inputH}">
						<view style="width: 610rpx;border-radius: 10rpx;" class="p-2 bg-hui ml-2">
							<input v-model="roomMsg" type="text" placeholder="请文明发言,内容会同步发送到弹幕" :adjust-position="false"
								@confirm="sendRoomMsg()" confirm-type="send" @keyboardheightchange="kbhChange"
								@blur="inputBlur()" style="transform: translateZ(0);" />
						</view>
						<view class="font30 ml-3" @touchend.prevent="sendRoomMsg()">
							发送
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	let socketOpen = false;
	let client_id = null;
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
					name: '讨论',
					count: 0
				}],
				swiperH: 1520 + 'px',
				scrollH: 1520 + 'px',
				scrollH2: 200 + 'px',
				tabCurrent: 0,
				userInfo: {},
				isAddRoom: false,
				roomMsg: '',
				msgList: [],
				roomNum: 0,
				danmuList: [],
				chatToIndex: '',
				keybH: 0,
				dmKeybH: 0,
				dmInputW: 0,
				isDmInput: false
			}
		},
		async onLoad(e) {
			let res = await this.$api.vodDetail(e.id);
			this.detail = res.data;
			if (e.hasOwnProperty('fid')) {
				this.playFromIndex = e.fid;
			}
			await this.loadOnlineNum();
			await this.initCache();
			await this.initPlay();
			await this.loadDanmuList();
			await this.loadRoomLog();
			this.initRedAd();
			this.connWss();
			this.loading = false;
			let sysInfo = uni.getSystemInfoSync();
			this.popupH = sysInfo.windowHeight - uni.upx2px(630) + 'px';
			this.swiperH = sysInfo.windowHeight - uni.upx2px(630) + 'px';
			let rectInfo = await this.$u.getRect('.vodinfo');
			this.scrollH = rectInfo.height + 'px';
			this.scrollH2 = sysInfo.windowHeight - uni.upx2px(815) + 'px';
		},
		onShow() {
			if (this.isAddRoom) {
				setTimeout(() => {
					this.reconnWss();
				}, 300);
			}
			if (!this.handle) return;
			this.handle.play();
		},
		async onHide() {
			this.handle.pause();
			if (this.isAddRoom) {
				await this.$api.sendRoomMessage({
					roomId: this.detail.vod_id,
					client_id,
					data: {
						type: 'left',
						content: this.userInfo.nickName +
							' 暂时离开了'
					},
					from_nick: this.userInfo.nickName,
					from_pic: this.userInfo.avatarUrl
				});
			}
		},
		onUnload() {
			if (this.isAddRoom) {
				this.$api.exitRoom({
					roomId: this.detail.vod_id,
					client_id,
					data: {
						type: 'exit',
						content: this.userInfo.nickName +
							' 退出了'
					},
					from_nick: this.userInfo.nickName,
					from_pic: this.userInfo.avatarUrl
				});
			}
			this.cachePlay();
		},
		watch: {
			episode(n, o) {
				if (n.length !== o.length && o.length) this.episodeCurrent = 0;
			}
		},
		computed: {
			inputH() {
				return (100 + this.keybH) + 'rpx';
			},
			dmInputH() {
				return this.dmKeybH + 'px';
			}
		},
		watch: {
			episodeCurrent(n, o) {
				this.loadDanmuList();
			},
			msgList(n, o) {
				this.chatToBottom();
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
			async loadRoomLog() {
				const res = await this.$api.getRoomLog(this.detail.vod_id);
				this.msgList = res.data;
				this.tabs[1].count = this.msgList.length;
			},
			async loadDanmuList() {
				const res = await this.$api.getRoomDm(this.detail.vod_id, this.episodeCurrent);
				this.danmuList = res.data;
			},
			async connWss() {
				uni.connectSocket({
					url: 'wss://ws.2oc.cc',
					success: res => {
						this.initWssHandle();
					}
				});
			},
			async reconnWss() {
				this.connWss();
				if (this.isAddRoom) {
					await this.$api.addRoom({
						roomId: this.detail.vod_id,
						client_id,
						data: {
							type: 'add',
							content: this.userInfo.nickName +
								' 回来了'
						},
						from_nick: this.userInfo.nickName,
						from_pic: this.userInfo.avatarUrl
					});
					await this.loadRoomLog();
				}
			},
			async reconBtn() {
				if (!this.isAddRoom) {
					this.$H.msg('您还没有加入讨论');
					return;
				}
				uni.showLoading({
					mask: true,
					title: '重连中'
				})
				await this.reconnWss();
				uni.hideLoading();
			},
			initWssHandle() {
				uni.onSocketOpen(res => {
					socketOpen = true;
				});
				uni.onSocketMessage(res => {
					const data = JSON.parse(res.data);
					if (data.type == 'ping') {
						console.log('连接正常');
						return;
					}
					let {
						type
					} = data.data;
					if (type == 'conn') {
						client_id = data.client_id;
					} else if (type == 'exit') {
						this.roomNum -= 1;
						this.msgList.push(data);
					} else if (type == 'add') {
						this.roomNum += 1;
						this.msgList.push(data);
					} else if (type == 'msg') {
						this.msgList.push(data);
						this.sendDm(data.data.content);
						this.tabs[1].count += 1;
					} else if (type == 'left') {
						this.msgList.push(data);
					}
				});
				uni.onSocketError((res) => {});
				uni.onSocketClose((res) => {
					this.reconnWss();
				});
			},
			kbhChange(e) {
				this.keybH = ((e.detail.height * 750) / uni.getSystemInfoSync().windowWidth) - 20;
			},
			inputBlur() {
				this.keybH = 0;
			},
			async dmInputIcon() {
				if (!this.isAddRoom) {
					this.addRoom();
					return;
				}
				this.isDmInput = true;
				this.dmInputW = uni.getSystemInfoSync().windowWidth;
			},
			dmInputChange(e) {
				this.dmKeybH = e.detail.height;
			},
			dmInputBlur() {
				this.dmKeybH = 0;
				this.isDmInput = false;
			},
			async loadOnlineNum() {
				const roomNum = await this.$api.getRoomNum(this.detail.vod_id);
				this.roomNum = roomNum.data.count;
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
				this.tabCurrent = index;
			},
			chatToBottom() {
				const lastIndex = this.msgList.length - 1;
				if (lastIndex < 0) return;
				this.chatToIndex = 'chat' + lastIndex;
			},
			async addRoom() {
				if (!uni.getUserProfile) {
					this.$H.msg('微信版本不支持，无法加入');
					return;
				}
				if (!socketOpen || !client_id) {
					this.$H.msg('链接服务器失败，请关闭页面或重启微信重试');
					return;
				}
				uni.getUserProfile({
					desc: "获取你的昵称、头像、地区及性别",
					success: async (res) => {
						this.userInfo = res.userInfo;
						let addRes = await this.$api.addRoom({
							roomId: this.detail.vod_id,
							client_id,
							data: {
								type: 'add',
								content: this.userInfo.nickName +
									' 加入了讨论'
							},
							from_nick: this.userInfo.nickName,
							from_pic: this.userInfo.avatarUrl
						});
						if (!addRes.errorCode) {
							this.isAddRoom = true;
							this.msgList = [];
							await this.loadRoomLog();
						} else {
							this.$H.msg('链接服务器失败，请关闭页面重试');
						}
					},
					fail: e => {
						uni.showModal({
							content: '获取微信基础信息失败，加入房间失败',
							showCancel: false,
							confirmText: '我知道了',
						});
					}
				});
			},
			async sendRoomMsg() {
				if (!this.roomMsg.length) {
					this.$H.msg('说点什么吧');
					return;
				}
				const data = {
					roomId: this.detail.vod_id,
					client_id,
					data: {
						type: 'msg',
						content: this.roomMsg,
						episodeCurrent: this.episodeCurrent,
						current: parseInt(this.current)
					},
					from_nick: this.userInfo.nickName,
					from_pic: this.userInfo.avatarUrl,
				};
				this.$u.throttle(async () => {
					this.$api.sendRoomMessage(data);
				}, 100);
				this.roomMsg = '';
			},
			sendDm(msg) {
				if (!this.handle) {
					return;
				}
				this.handle.sendDanmu({
					text: msg,
					color: '#ffffff'
				});
			},
			changeSwiper(e) {
				this.tabCurrent = e.detail.current;
				if (this.tabCurrent == 1) {
					this.loadOnlineNum();
				}
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

	.abs-bottom {
		position: absolute;
		right: 0;
		left: 0;
		transition: 0.3s;
	}
</style>
