<template>
	<view>
		<view class="flex align-center" @click="$H.toDetail(item.vod_id)">
			<view style="min-width: 225rpx;">
				<u-lazy-load :image="item.vod_pic" img-mode="aspectFill" height="310" border-radius="5"
					:is-effect="false">
				</u-lazy-load>
			</view>
			<view class="flex flex-column justify-between ml-2" style="height: 310rpx;">
				<view class="text-ellipsis1 font28" v-html="item.vod_name"></view>
				<view class="font28 text-ellipsis2">
					{{item.parentType ? item.parentType.type_name : item.type.type_name}} ·
					{{item.vod_area || '未知'}} · {{item.vod_lang || '未知'}}
				</view>
				<view class="text-ellipsis1 font28" v-html="replaceCon(item.vod_director)"></view>
				<view class="text-ellipsis1 font28" v-html="replaceCon(item.vod_actor)"></view>
				<view class="tc" style="width: 210rpx;height: 65rpx;background-color: #ff6022;border-radius: 8rpx;">
					<text style="color: #FFFFFF;line-height: 65rpx;">查看详情</text>
				</view>
			</view>
		</view>
		<view style="margin: 20rpx -20rpx">
			<u-gap height="10" bg-color="#f8f8fa"></u-gap>
		</view>
	</view>
</template>

<script>
	export default {
		name: "vod-item2",
		props: {
			item: Object
		},
		data() {
			return {

			};
		},
		methods: {
			replaceCon(con) {
				if (!con) return '未知';
				return con.replace(/,/g, '  ') || '未知';
			}
		}
	}
</script>

<style>

</style>
