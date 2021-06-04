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
					<view class="flex flex-column justify-between" style="height: 340rpx;">
						<view class="f7 font30 text-ellipsis1 u-skeleton-rect">{{detail.vod_name}}</view>
						<view class="font27 text-ellipsis1 u-skeleton-rect">{{detail.vod_area}} / {{detail.vod_lang}} /
							{{detail.type.type_name}}
						</view>
						<view class="font27 text-ellipsis1 u-skeleton-rect">上映时间{{detail.vod_year}} / {{replaceRemarks}}</view>
						<view class="font27 text-ellipsis2 u-skeleton-rect">主演：{{replaceActor || '未知'}}</view>
						<view class="font27 text-ellipsis1 u-skeleton-rect">导演：{{replaceDirector || '未知'}}</view>
						<view class="flex align-center u-skeleton-fillet">
							<u-button show-message-card hover-class="none" open-type="contact" send-message-path
							:send-message-title="detail.vod_name" size="mini" type="warning" class="mr-3">
								联系我们
							</u-button>
							<u-button open-type="share" size="mini" type="success">
								分享给好友
							</u-button>
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
				detail: {},
				toEpi: null,
				loading: true,
				moreList: []
			}
		},
		async onLoad(e) {
			let res = await this.$api.vodDetail(e.id);
			this.detail = res.data;
			let more = await this.$api.getVodHot(1, 6);
			this.moreList = more.data.list;
			this.loading = false;
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
			}
		},
		methods: {
			onShareAppMessage() {
				return {
					title: this.title,
					path: "", //页面路径及参数
					imageUrl: this.detail.vod_pic, //图片链接，必须是网络连接，后面拼接时间戳防止本地缓存
				}
			}
		}
	}
</script>

<style>

</style>
