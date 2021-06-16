// 引入全局配置文件
import $C from '@/common/config.js';
export default {
	/**
	 * 判断是否为空
	 * @param {Object} value
	 */
	isEmpty(value) {
		return (value === null || value === '' || value === undefined) ? true : false;
	},
	/**
	 * 去除空格
	 * @param {Object} value
	 */
	trim(value) {
		return value.replace(/(^\s*)|(\s*$)/g, "");
	},

	/**
	 * 将对象转换成URL参数
	 * @param {Object} params
	 */
	queryString(params) {
		return Object.keys(params).map((key) => {
			return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
		}).join('&');
	},

	/**
	 * 数组排序
	 * @param {Object} o
	 */
	ksort(o) {
		let sorted = {},
			keys = Object.keys(o);
		keys.sort();
		keys.forEach((key) => {
			sorted[key] = o[key];
		})
		return sorted;
	},

	/**
	 * 快捷输出提示
	 * @param {String} msg
	 */
	msg(msg, duration = 1500) {
		return uni.showToast({
			icon: 'none',
			title: msg,
			duration: duration
		});
	},

	/**
	 * 检测内容中是否带有HTTP
	 */
	checkUrl(url) {
		if ((/(http|https):\/\/([\w.]+\/?)\S*/.test(url)) == true) {
			return url;
		}
		return false;
	},

	/**
	 * 获取当前时间戳
	 */
	getTime() {
		return Math.round(new Date() / 1000);
	},

	getRandomColor() {
		const rgb = []
		for (let i = 0; i < 3; ++i) {
			let color = Math.floor(Math.random() * 256).toString(16)
			color = color.length == 1 ? '0' + color : color
			rgb.push(color)
		}
		return '#' + rgb.join('')
	},

	/**
	 * 时间转换时间戳
	 * @param {Object} time
	 */
	parseTime(time) {
		return Math.round(new Date(time) / 1000);
	},

	s_to_hs(s) {
		//计算分钟
		//算法：将秒数除以60，然后下舍入，既得到分钟数
		var h;
		h = Math.floor(s / 60);
		//计算秒
		//算法：取得秒%60的余数，既得到秒数
		s = s % 60;
		//将变量转换为字符串
		h += '';
		s += '';
		//如果只有一位数，前面增加一个0
		h = (h.length == 1) ? '0' + h : h;
		s = (s.length == 1) ? '0' + s : s;
		return h + ':' + s;
	},

	parseChatTime(v1, v2) {
		if (v2 < 1) {
			return false;
		}
		if ((v1 - v2) < 300) { // 小于300秒不显示
			return false;
		} else if (v1 - v2 < 86400) { // 是否为当天
			return this.formatTime(v2);
		} else {
			return this.formatFullTime(v2);
		}
	},

	formatTime(timestamp) {
		if (String(timestamp).length === 10) {
			timestamp *= 1000
		}
		let date = new Date(timestamp)
		let hour = date.getHours()
		let minute = date.getMinutes()
		if (hour >= 0 && hour < 6) {
			return '凌晨 ' + [hour, minute].map(this.formatNumber).join(':')
		}
		if (hour >= 6 && hour < 12) {
			return '早上 ' + [hour, minute].map(this.formatNumber).join(':')
		}
		if (hour === 12) {
			return '中午 ' + [hour, minute].map(this.formatNumber).join(':')
		}
		if (hour > 12 && hour < 18) {
			return '下午 ' + [hour, minute].map(this.formatNumber).join(':')
		}
		if (hour >= 18 < hour < 24) {
			return '晚上 ' + [hour, minute].map(this.formatNumber).join(':')
		}
	},

	formatFullTime(timestamp, n = 1) {
		if (String(timestamp).length === 10) {
			timestamp *= 1000
		}
		let date = new Date(timestamp)
		let year = date.getFullYear()
		let month = date.getMonth() + 1
		let day = date.getDate()

		let hour = date.getHours()
		let minute = date.getMinutes()
		let second = date.getSeconds()

		if (n === 1) return [year, month, day].map(this.formatNumber).join('-') + ' ' + [hour, minute, second].map(this
			.formatNumber).join(':')
		if (n === 2) return [month, day].map(this.formatNumber).join('-') + ' ' + [hour, minute].map(this.formatNumber)
			.join(':')
	},

	/**
	 * 解析时间戳
	 * @param {Object} timestamp
	 */
	friendlyDate(timestamp) {
		timestamp *= 1000;
		var formats = {
			'year': '%n%年前',
			'month': '%n%月前',
			'day': '%n%天前',
			'hour': '%n%小时前',
			'minute': '%n%分钟前',
			'second': '%n%秒前',
		};

		var now = Date.now();
		var seconds = Math.floor((now - timestamp) / 1000);
		var minutes = Math.floor(seconds / 60);
		var hours = Math.floor(minutes / 60);
		var days = Math.floor(hours / 24);
		var months = Math.floor(days / 30);
		var years = Math.floor(months / 12);

		var diffType = '';
		var diffValue = 0;
		if (years > 0) {
			diffType = 'year';
			diffValue = years;
		} else {
			if (months > 0) {
				diffType = 'month';
				diffValue = months;
			} else {
				if (days > 0) {
					diffType = 'day';
					diffValue = days;
				} else {
					if (hours > 0) {
						diffType = 'hour';
						diffValue = hours;
					} else {
						if (minutes > 0) {
							diffType = 'minute';
							diffValue = minutes;
						} else {
							diffType = 'second';
							diffValue = seconds === 0 ? (seconds = 1) : seconds;
						}
					}
				}
			}
		}
		return formats[diffType].replace('%n%', diffValue);
	},

	/**
	 * 截取指定长度字符，多余部分转换为...
	 * @param {Object} value
	 */
	ellipsis(value, length = 13) {
		if (!value) return '';
		if (value.length > length) {
			return value.slice(0, length) + '...'
		}
		return value
	},

	/**
	 * 将10000+ 缩短为xx万
	 * @param {Object} int
	 */
	numberToShort(int, fixed = 2) {
		if (!typeof int === 'number' || isNaN(int)) return 0;
		if (int.toString().length > 4) return (int / 10000).toFixed(fixed) + '万';
		return int;
	},

	/**
	 * 生成指定范围随机数
	 * @param {Object} min
	 * @param {Object} max
	 */
	randomNum(min, max) {
		return parseInt(Math.random() * (max - min + 1) + min, 10);
	},

	/**
	 * 文件大小转换
	 * @param {Object} size
	 */
	changeSize(size) {
		let num;
		if ((size / 1024) <= 1024) {
			num = size / 1024;
			return num.toFixed(2) + 'KB';
		}
		if ((size / 1024) > 1024 && (size / 1024) <= (1024 * 1024)) {
			num = (size / 1024) / 1024;
			return num.toFixed(2) + 'MB';
		}
		if ((size / 1024) > (1024 * 1024)) {
			num = ((size / 1024) / 1024) / 1024
			return num.toFixed(2) + 'GB';
		}
	},

	toTab(path) {
		uni.switchTab({
			url: '/pages/' + path
		});
		return;
	},

	back(delta = 1) {
		uni.navigateBack({
			delta: delta
		});
	},

	toDetail(id) {
		if (!this.getConfig('check') && this.getTodayCache()) {
			uni.navigateTo({
				url: '/pages/detail/detail?id=' + id
			});
		} else {
			uni.navigateTo({
				url: '/pages/detail/detail2?id=' + id
			});
		}
	},

	setTodayCache() {
		const timeStamp = new Date(new Date().setHours(0, 0, 0, 0)) / 1000; // 当天凌晨时间戳
		uni.setStorageSync('ad_today', timeStamp);
	},

	getTodayCache() {
		const timeStamp = new Date(new Date().setHours(0, 0, 0, 0)) / 1000; // 当天凌晨时间戳
		let cache = uni.getStorageSync('ad_today');
		if (!cache) return false;
		if (cache < timeStamp) {
			uni.removeStorageSync('ad_today');
			return false;
		}
		return true;
	},

	getConfig(name) {
		try {
			let config = uni.getStorageSync('config');
			return config[name];
		} catch (e) {
			return '';
		}
	},

	getExt(filePath) {
		const index = filePath.lastIndexOf(".");
		const ext = filePath.substr(index + 1);
		return ext;
	},

	formatNumber(num) {
		num = num.toString()
		return num[1] ? num : '0' + num
	},

	getNetwork() {
		return new Promise((resolve, reject) => {
			uni.getNetworkType({
				success: (res) => {
					resolve(res.networkType);
				},
				fail: (e) => {
					reject(e);
				}
			});
		});
	}
}
