<template>
	<view>
		<u-navbar title-color="#222" title="缓存影片" title-bold :border-bottom="false" title-size="30"
			back-icon-color="#222" back-icon-size="38" back-icon-name="arrow-left">
		</u-navbar>
		<view class="flex align-center justify-center top" :style="{'top': top+'px'}">
			<text class="mr-1">当前下载源： </text>
			<view class="flex myp-flex-row align-center" @click="showOptions()">
				<view class="f6 mr-1" style="color: #ff6022;">
					{{downFrom[fromIndex] ? downFrom[fromIndex].text : ''}}
				</view>
				<u-icon name="arrow-down" size="33" color="#ff6022" @iconClicked="showOptions()"></u-icon>
			</view>
		</view>
		<view class="flex align-center flex-wrap">
			<block v-for="(item,index) in episode" :key="index">
				<view class="item mx-2 mb-2" :style="{width: this.$u.addUnit('auto')}" style="position: relative;">
					<view style="position: absolute;bottom: 0;right: 10rpx;" v-if="watching == index">
						<u-icon name="eye" size="28" color="#ff6022"></u-icon>
					</view>
					<view style="line-height: 95rpx;" class="font29 tc mx-2" :class="item.copy ? 'mian-color' : 'hei'"
						@click="clickItem(index)">{{item.name}}
					</view>
				</view>
			</block>
		</view>
		<u-action-sheet :list="downFrom" @click="changeOptions" v-model="show" border-radius="20" :tips="tips">
		</u-action-sheet>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail: {},
				top: 0,
				watching: 0,
				episodeList: [],
				episode: [],
				fromIndex: 0,
				downFrom: [],
				show: false,
				tips: {
					text: '建议请先尝试在线播放后再选择合适的下载源',
					color: '#909399',
					fontSize: 24
				},
			}
		},
		async onLoad(e) {
			this.watching = e.watching;
			let res = await this.$api.vodDetail(e.vod_id);
			this.detail = res.data;
			this.initData();
			let sysInfo = uni.getSystemInfoSync();
			this.top = sysInfo.statusBarHeight + uni.upx2px(70);
		},
		onReady() {
			uni.showModal({
				showCancel: false,
				content: '点击剧集可复制播放链接，打开浏览器粘贴地址访问会播放并显示下载按钮，部分浏览器会播放但没有下载按钮，可以下载“夸克,UC”等浏览器进行下载。不同的下载源可下载的集数，大小等会有不同，请先尝试在线播放后再选择合适的下载源',
				confirmText: '我知道了'
			})
		},
		methods: {
			initData() {
				this.episodeList = this.detail.vod_play_url;
				this.downFrom = this.detail.vod_play_from;
				this.episode = this.episodeList[this.fromIndex];
				this.parseFrom(this.downFrom);
				this.parseEpisode();
			},
			parseEpisode() {
				let obj = [];
				for (var i = 0; i < this.episode.length; i++) {
					let list = this.episode[i];
					obj.push({
						name: list.episode,
						src: encodeURI(list.src),
						copy: false
					});
				}
				this.episode = obj;
			},
			parseFrom(data) {
				if (!data[0]) return this.downFrom = [];
				let obj = [];
				for (var i = 0; i < data.length; i++) {
					if (i == this.fromIndex) {
						obj.push({
							text: data[i].name,
							color: '#ff6022',
							fontSize: 30
						});
					} else {
						obj.push({
							text: data[i].name,
							color: '#333',
							fontSize: 30
						});
					}
				}
				this.downFrom = obj;
			},
			async clickItem(index) {
				let url = this.episode[index].src;
				let fromData = this.detail.vod_play_from[this.fromIndex];
				if (fromData.get_url) {
					url = this.$H.getConfig(fromData.get_url) + url;
				}
				this.episode[index].copy = true;
				uni.setClipboardData({
					data: url
				});
			},
			showOptions() {
				this.show = true;
			},
			changeOptions(index) {
				this.show = false;
				if (this.fromIndex == index) return;
				this.downFrom[this.fromIndex].color = '#333';
				this.downFrom[index].color = '#ff6022';
				this.fromIndex = index;
				this.episode = this.episodeList[this.fromIndex];
				this.parseEpisode();
			},
		}
	}
</script>

<style>
	.item {
		background-color: #f7f9fb;
		border-radius: 8rpx;
		height: 95rpx;
	}

	.top {
		font-size: 29rpx;
		position: sticky;
		width: 100%;
		height: 100rpx;
		z-index: 1;
		background-color: #FFFFFF;
	}
</style>
