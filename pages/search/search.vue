<template>
	<view>
		<u-navbar title-color="#222" title="搜索影片" title-bold :border-bottom="false" title-size="30" :is-back="false">
		</u-navbar>
		<view class="px-2 pt-1 pb-2 bg-bai" style="z-index: 999999;position: sticky;" :style="{top:searchTop+'px'}">
			<u-search placeholder="输入影片名 演员或导演搜索" v-model="keyword" :show-action="false" @search="submit()"
				@change="change()"></u-search>
		</view>
		<view class="mx-2">
			<template v-if="isSubmit == false">
				<template v-if="hisList.length">
					<!-- 搜索历史 -->
					<view class="flex align-center justify-between mb-2">
						<text class="hei">搜索历史</text>
						<text class="font27 gray" @click="dumpHistory()">清空</text>
					</view>
					<view class="flex align-center flex-wrap my-1">
						<block v-for="(item,index) in hisList" :key="index">
							<view class="his-word mr-2 mb-2" @click="clickWord(item)">
								<text class="font24 hei">{{item}}</text>
							</view>
						</block>
					</view>
				</template>
				<!-- 搜索热词 -->
				<view class="hei">大家都在搜</view>
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
				<vod-item2 v-for="(item,index) in result.list" :key="index" :item="item"></vod-item2>
				<view class="py-4">
					<u-loadmore :status="result.loadStatus" />
				</view>
			</template>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword: '',
				hotWords: [],
				hisList: uni.getStorageSync('search_cache') || [],
				isSubmit: false,
				searchTop: 0,
				result: {
					page: 1,
					pageSize: 10,
					loadStatus: 'loading',
					list: []
				}
			}
		},
		async onLoad() {
			let sysInfo = uni.getSystemInfoSync();
			this.searchTop = uni.upx2px(80) + sysInfo.statusBarHeight;
			await this.hotSearchWordsList();
		},
		methods: {
			async hotSearchWordsList() {
				let res = await this.$api.searchHotWords();
				this.hotWords = res.data.list;
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
				let res = await this.$api.searchVod(encodeURIComponent(this.keyword), this.result.page, this.result
					.pageSize);
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
			},
			async submit() {
				if (!this.keyword.length) {
					this.isSubmit = false;
					this.$H.msg('请输入关键词');
					return;
				}
				uni.showLoading({
					title: '正在搜索'
				});
				this.saveSearchLog();
				await this.loadData();
				uni.hideKeyboard();
				uni.hideLoading();
			},
			async change(val) {
				if (!val.length) {
					this.isSubmit = false;
					this.result = {
						page: 1,
						pageSize: 10,
						loadStatus: 'loading',
						list: []
					};
					return;
				}
			},
			clickWord(val) {
				this.keyword = val;
				this.submit();
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
