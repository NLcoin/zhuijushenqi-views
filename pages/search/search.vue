<template>
	<view>
		<u-navbar :is-back="false" title-color="#222" title-bold :border-bottom="false" title-size="30">
			<view class="ml-3 f7 font33">搜索影片</view>
		</u-navbar>
		<view class="p-2 bg-bai w100" style="z-index: 999;position: sticky;" :style="{top:searchTop+'px'}">
			<u-search placeholder="输入影片名 演员或导演搜索" v-model="keyword" @search="submit()" @change="change()"
				@custom="submit()" @focus="focusChange()" @blur="blurChange()"></u-search>
		</view>
		<view class="mx-2">
			<template v-if="isSubmit == false">
				<template v-if="!focus && !keyword">
					<template v-if="hisList.length">
						<!-- 搜索历史 -->
						<view class="flex align-center justify-between mb-2 my-1">
							<text class="hei">搜索历史</text>
							<text class="font27 mr-15 gray" @click="dumpHistory()">清空</text>
						</view>
						<view class="flex align-center flex-wrap my-1">
							<block v-for="(item,index) in hisList" :key="index">
								<view class="his-word mr-2 mb-2" @click="clickWord(item)">
									<text class="font24 hei">{{item}}</text>
								</view>
							</block>
						</view>
					</template>
					<view class="mb-3 mt-1">
						<vod-ad name="search_banner"></vod-ad>
					</view>
					<!-- 搜索热词 -->
					<view class="hei my-1">大家都在搜</view>
					<block v-for="(item,index) in hotWords" :key="index">
						<view class="flex align-center border-bottom-hui w100 py-2" @click="clickWord(item.keyword)"
							hover-class="bg-hui">
							<view class="hot-num" :class="index+1 <= 3 ? 'hot-num-'+(index+1) : 'hot-num-other'">
								{{index+1}}
							</view>
							<view class="font28">
								{{item.keyword}}
							</view>
						</view>
					</block>
				</template>

				<template v-else>
					<block v-for="(item,index) in completeList" :key="index">
						<search-complete-list :item="item" @doSearch="clickWord"></search-complete-list>
					</block>
				</template>
			</template>
			<template v-else>
				<view class="flex align-center justify-between bg-bai w100" :style="{top:searchTop+45+'px'}"
					style="position: sticky;height: 90rpx;z-index: 99;margin-top: -20rpx;">
					<view class="font27 gray">
						共搜索到 {{result.total}} 部相关影片
					</view>
					<view class="flex align-center gray" @click="clickSelect()">
						<u-icon name="grid" size="35" class="mr-1"></u-icon>
						<view class="font27">筛选</view>
					</view>
				</view>
				<search-select ref="select" @change="selectChange"></search-select>
				<view>
					<vod-item2 v-for="(item,index) in result.list" :key="index" :item="item"></vod-item2>
				</view>
				<view v-if="!result.list.length" class="flex align-center justify-center my-5">
					<u-button show-message-card type="default" size="mini" send-message-img open-type="contact"
						send-message-path :send-message-title="keyword"
						:custom-style="{border:'none',fontSize:'31rpx',textDecoration:'underline'}" :hair-line="false">
						如果您有推荐的影片可以点此联系我们添加
					</u-button>
				</view>
				<vod-ad name="search_banner"></vod-ad>
				<view class="py-4">
					<u-loadmore :status="result.loadStatus" />
				</view>
			</template>
		</view>
	</view>
</template>

<script>
	let interstitialAd = null
	export default {
		data() {
			return {
				keyword: '',
				hotWords: uni.getStorageSync('hotwords') || [],
				hisList: uni.getStorageSync('search_cache') || [],
				isSubmit: false,
				focus: false,
				searchTop: 0,
				popupShow: false,
				result: {
					page: 1,
					pageSize: 10,
					total: 0,
					loadStatus: 'loading',
					list: []
				},
				searchData: {
					keyword: '',
					page: 1,
					pageSize: 10,
					class: 0,
					area: 0,
					lang: 0
				},
				completeList: []
			}
		},
		async onLoad() {
			let sysInfo = uni.getSystemInfoSync();
			this.searchTop = uni.upx2px(80) + sysInfo.statusBarHeight;
			await this.hotSearchWordsList();
			if (uni.createInterstitialAd) {
				interstitialAd = uni.createInterstitialAd({
					adUnitId: this.$H.getConfig('interAd')
				});
			}
		},
		onReady() {
			setTimeout(() => {
				if (!interstitialAd) return;
				interstitialAd.show();
			}, 3000);
		},
		onUnload() {
			interstitialAd = null;
		},
		methods: {
			onShareAppMessage() {
				return {
					title: '全网热门影片搜索',
					path: "", //页面路径及参数
					imageUrl: "", //图片链接，必须是网络连接，后面拼接时间戳防止本地缓存
				}
			},
			clickSelect() {
				this.$refs['select'].show = true;
			},
			async selectChange(e) {
				this.searchData.class = e.class;
				this.searchData.area = e.area;
				this.searchData.lang = e.lang;
				this.result.page = 1;
				uni.showLoading({
					mask:true,
					title: '正在搜索'
				});
				await this.loadData();
				uni.hideLoading();
			},
			async hotSearchWordsList() {
				let res = await this.$api.searchHotWords();
				this.hotWords = res.data.list;
				uni.setStorageSync('hotwords', this.hotWords);
			},
			async onReachBottom() {
				await this.loadMore();
			},
			async loadMore() {
				if (this.result.loadStatus != 'loadmore') return;
				this.result.page += 1;
				this.result.loadStatus = 'loading';
				await this.loadData();
			},
			async loadData() {
				this.searchData.keyword = encodeURIComponent(this.keyword);
				this.searchData.page = this.result.page;
				this.searchData.pageSize = this.result.pageSize;
				let res = await this.$api.searchVod(this.searchData);
				this.isSubmit = true;
				for (let i = 0; i < res.data.list.length; i++) {
					let oReg = new RegExp(this.keyword, "g");
					let replaceString;
					replaceString = '<span style="color:#ff6022;">' + this.keyword + '</span>';
					res.data.list[i].vod_actor = '主演：' + (res.data.list[i].vod_actor.replace(oReg, replaceString) ||
						'未知');
					replaceString = '<span style="color:#ff6022;">' + this.keyword + '</span>';
					res.data.list[i].vod_director = '导演：' + (res.data.list[i].vod_director.replace(oReg,
						replaceString) || '未知');
					replaceString = '<span style="color:#ff6022;">' + this.keyword + '</span>';
					res.data.list[i].vod_name = res.data.list[i].vod_name.replace(oReg, replaceString);
				}
				if (this.result.page == 1) {
					this.result.list = res.data.list;
				} else {
					this.result.list = this.result.list.concat(res.data.list);
				}
				this.result.total = res.data.total;
				this.result.loadStatus = 'loadmore';
				if (res.data.list.length < this.result.pageSize) this.result.loadStatus = 'nomore';
				if (!this.result.list.length) {
					uni.showModal({
						title: '提示信息',
						content: '没有查找到影片，可尝试去除符号或缩短关键词重新搜索',
						showCancel: false,
						confirmText: '我知道了'
					});
				}
			},
			async submit() {
				if (!this.keyword.length) {
					this.isSubmit = false;
					this.$H.msg('请输入关键词');
					return;
				}
				uni.showLoading({
					mask:true,
					title: '正在搜索'
				});
				this.saveSearchLog();
				await this.loadData();
				uni.hideKeyboard();
				uni.hideLoading();
			},
			async change(val) {
				this.keyword = val;
				if (!this.keyword.length) {
					this.isSubmit = false;
					this.focus = false;
					this.completeList = [];
					this.result = {
						page: 1,
						pageSize: 10,
						loadStatus: 'loading',
						list: []
					};
					return;
				}
				this.resetData();
				this.searchComplete(val);
			},
			resetData() {
				this.$refs['select'].reset();
				this.searchData.class = 0;
				this.searchData.area = 0;
				this.searchData.lang = 0;
			},
			clickWord(val) {
				this.keyword = val;
				this.submit();
			},
			focusChange() {
				this.focus = true;
				this.isSubmit = false;
				this.searchComplete(this.keyword);
			},
			blurChange() {
				this.focus = false;
			},
			searchComplete(e) {
				if (!e || !e.length) return;
				this.$u.debounce(async () => {
					let res = await this.$api.searchComplete(encodeURIComponent(e));
					for (let i = 0; i < res.data.list.length; i++) {
						let oReg = new RegExp(this.keyword, "g");
						let replaceString;
						replaceString = '<span style="color:#ff6022;">' + this.keyword + '</span>';
						res.data.list[i].vod_name2 = res.data.list[i].vod_name.replace(oReg, replaceString);
					}
					this.completeList = res.data.list;
				}, 150);
			},
			saveSearchLog() {
				uni.getStorage({
					key: 'search_cache',
					success: (res) => {
						let list = res.data;
						if (list.length > 20) {
							for (let item of list) {
								if (item == this.keyword) {
									return;
								}
							}
							list.pop();
							list.unshift(this.keyword);
						} else {
							for (let item of list) {
								if (item == this.keyword) {
									return;
								}
							}
							list.unshift(this.keyword);
						}
						this.hisList = list;
						uni.setStorage({
							key: 'search_cache',
							data: this.hisList
						});
					},
					fail: () => {
						this.hisList = [];
						this.hisList.push(this.keyword);
						uni.setStorage({
							key: 'search_cache',
							data: this.hisList
						});
					}
				})
			},
			dumpHistory() {
				this.hisList = [];
				uni.setStorage({
					key: 'search_cache',
					data: []
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.his-word {
		background-color: #e6e6e8;
		padding: 12rpx 15rpx;
		border-radius: 8rpx;
		line-height: 30rpx;
	}

	.hot-num {
		width: 32rpx;
		height: 32rpx;
		margin-right: 10rpx;
		border-radius: 5rpx;
		font-size: 24rpx;
		line-height: 32rpx;
		text-align: center;
	}

	.hot-num-1 {
		background: #e42818;
		color: #FFFFFF;
	}

	.hot-num-2 {
		background: #ff7100;
		color: #FFFFFF;
	}

	.hot-num-3 {
		background: #ffb900;
		color: #FFFFFF;
	}

	.hot-num-other {
		background: #e6e6e6;
		color: #878787;
	}
</style>
