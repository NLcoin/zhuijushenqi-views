<template>
	<view style="width: 750rpx;overflow-x: hidden;">
		<u-navbar title-color="#222" title="影片详情" title-bold :border-bottom="false" title-size="30"
			back-icon-color="#222" back-icon-size="40" :is-back="false">
			<view>
				<u-icon name="arrow-left" class="mx-2" @click="$H.back()" size="38"></u-icon>
				<u-icon name="home" class="ml-2" @click="$H.toTab('index/index')" size="38"></u-icon>
			</view>
		</u-navbar>
		<view class="u-skeleton">
			<view class="px-2">
				<view class="flex align-center mt-2">
					<view class="mr-3 u-skeleton-fillet">
						<image :src="detail.vod_pic" mode="aspectFill"
							style="height: 330rpx;width: 230rpx;border-radius: 8rpx;"></image>
					</view>
					<view class="flex flex-column justify-between mb-1" style="height: 330rpx;">
						<view class="f7 font31 text-ellipsis1 u-skeleton-rect">{{detail.vod_name}}</view>
						<view class="font27 text-ellipsis1 u-skeleton-rect">{{detail.vod_area}} / {{detail.vod_lang}} /
							{{detail.parentType ? detail.parentType.type_name : detail.type.type_name}}
						</view>
						<view class="font27 text-ellipsis1 u-skeleton-rect">上映时间 / {{replaceYear}}
						</view>
						<view class="font27 text-ellipsis2 u-skeleton-rect">主演：{{replaceActor || '未知'}}</view>
						<view class="font27 text-ellipsis1 u-skeleton-rect">导演：{{replaceDirector || '未知'}}</view>
						<view class="flex align-center">
							<template v-if="$H.getConfig('check')">
								<u-button class="u-skeleton-fillet mr-2" size="mini" type="warning" @click="$H.previewImage('group_img')">
									添加交流群
								</u-button>
								<u-button open-type="share" type="success" size="mini" class="u-skeleton-fillet">
									分享给好友
								</u-button>
							</template>
							<template v-else>
								<u-button type="success" size="medium" @click.stop="clickAd()"
									class="u-skeleton-fillet">
									立即播放
								</u-button>
							</template>
						</view>
					</view>
				</view>
				<view class="my-2 flex align-center justify-between">
					<view class="font29 f6 u-skeleton-rect">
						影片评分
					</view>
					<view class="u-skeleton-rect">
						<u-rate v-model="detail.vod_score / 2" disabled></u-rate><text
							class="hon ml-1">{{detail.vod_score || '0.0'}}分</text>
					</view>
				</view>

				<view class="mt-1" v-if="!loading">
					<vod-ad name="index_banner"></vod-ad>
				</view>

				<view class="mt-2 flex align-center justify-between">
					<view class="font29 f6 u-skeleton-rect">影片简介</view>
				</view>

				<view class="my-2 font28 u-skeleton-rect">
					<u-read-more close-text="展开" color="#ff6022">
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
	let redAd = null;
	let isRadLoad = true;
	export default {
		data() {
			return {
				detail: {},
				moreList: [],
				loading: true
			}
		},
		async onLoad(e) {
			this.initRedAd();
			let res = await this.$api.vodDetail(e.id);
			this.detail = res.data;
			let more = await this.$api.getVodHot(1, 6);
			this.moreList = more.data.list;
			this.loading = false;
		},
		onUnload() {
			if (!this.detail) {
				return;
			}
			let {
				vod_id,
				vod_pic,
				vod_remarks,
				vod_name,
				vod_score,
				type,
				parentType
			} = this.detail;
			let cache = uni.getStorageSync('history2') || [];
			let cacheId = cache.findIndex(v => v.vod_id == vod_id);
			let saveData = {
				vod_id,
				vod_name,
				vod_pic,
				vod_remarks,
				vod_score,
				type,
				parentType
			};
			if (cacheId == '-1') {
				cache.unshift(saveData);
			} else {
				cache[cacheId] = saveData;
			}
			uni.setStorageSync('history2', cache);
		},
		computed: {
			replaceYear() {
				try {
					if (!this.detail.vod_year || this.detail.vod_year == 0) return '未知年份';
					return this.detail.vod_year;
				} catch (e) {
					//TODO handle the exception
				}
			},
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
			}
		},
		methods: {
			onShareAppMessage() {
				return {
					title: this.detail.vod_name,
					path: "", //页面路径及参数
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
						this.$H.setTodayCache();
						this.$H.msg('观看完成');
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/detail/detail?id=' + this.detail.vod_id
							})
						}, 100);
					} else {
						this.$H.msg('您未完整观看视频，无法获得奖励');
					}
				});
			},
			clickAd() {
				if (!isRadLoad) {
					uni.redirectTo({
						url: '/pages/detail/detail?id=' + this.detail.vod_id
					});
					return;
				}
				uni.showModal({
					title: '温馨提示',
					content: '每日一次，希望理解',
					success: res => {
						if (res.confirm) {
							redAd.show().catch(() => {
								uni.redirectTo({
									url: '/pages/detail/detail?id=' + this.detail
										.vod_id
								});
							});
						}
					}
				});
			}
		}
	}
</script>

<style>

</style>
