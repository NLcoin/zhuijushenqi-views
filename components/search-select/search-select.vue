<template>
	<view>
		<!-- 弹出层 -->
		<u-popup v-model="show" mode="bottom" height="700rpx">
			<view class="flex flex-column p-3">
				<view class="flex align-center justify-between mb-3">
					<view class="f8 font32" style="width: 130rpx;">
						分类
					</view>
					<view class="flex align-center flex-wrap flex-1">
						<block v-for="(item,index) in tabs" :key="index">
							<view style="width: auto;height: 70rpx;line-height: 70rpx;" class="bg-hui font28 mr-2 mb-2"
								:class="fromData.class == item.id ? 'bg-main white' : ''" @click="changeClass(item.id)">
								<text class="mx-5">{{item.name == '推荐' ? '综合' : item.name}}</text>
							</view>
						</block>
					</view>
				</view>

				<view class="flex align-center justify-between mb-2">
					<view class="f8 font32" style="width: 130rpx;">
						地区
					</view>
					<view class="flex flex-wrap align-center flex-1">

						<view style="width: auto;height: 70rpx;line-height: 70rpx;" class="bg-hui font28 mr-2 mb-2"
							:class="!fromData.area ? 'bg-main white' : ''" @click="changeOther('area',item)">
							<text class="mx-5">综合</text>
						</view>
						<block v-for="(item,index) in area" :key="index">
							<view style="width: auto;height: 70rpx;line-height: 70rpx;" class="bg-hui font28 mr-2 mb-2"
								:class="fromData.area == item ? 'bg-main white' : ''" @click="changeOther('area',item)">
								<text class="mx-5">{{item}}</text>
							</view>
						</block>

					</view>
				</view>

				<view class="flex align-center mb-3">
					<view class="f8 font32" style="width: 130rpx;">
						语言
					</view>
					<view class="flex flex-wrap align-center flex-1">
						<view style="width: auto;height: 70rpx;line-height: 70rpx;" class="bg-hui font28 mr-2 mb-2"
							:class="!fromData.lang ? 'bg-main white' : ''" @click="changeOther('lang',item)">
							<text class="mx-5">综合</text>
						</view>
						<block v-for="(item,index) in lang" :key="index">
							<view style="width: auto;height: 70rpx;line-height: 70rpx;" class="bg-hui font28 mr-2 mb-2"
								:class="fromData.lang == item ? 'bg-main white' : ''" @click="changeOther('lang',item)">
								<text class="mx-5">{{item}}</text>
							</view>
						</block>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name: "search-select",
		data() {
			return {
				show: false,
				fromData: {
					class: 0,
					area: 0,
					lang: 0
				}
			};
		},
		watch:{
			show(n,o){
				if(n) return;
				this.fromData = {
					class: 0,
					area: 0,
					lang: 0
				};
			}
		},
		computed: {
			tabs() {
				return this.$H.getConfig('tabs');
			},
			area() {
				return this.$H.getConfig('search_select').area;
			},
			lang() {
				return this.$H.getConfig('search_select').lang;
			}
		},
		methods: {
			changeClass(val) {
				if (this.fromData.class == val) return;
				this.fromData.class = val;
				this.$emit('change', this.fromData);
			},
			changeOther(name, val) {
				if (this.fromData[name] == val) return;
				this.fromData[name] = val;
				this.$emit('change', this.fromData);
			}
		}
	}
</script>

<style>

</style>
