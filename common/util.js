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

	/**
	 * 时间转换时间戳
	 * @param {Object} time
	 */
	parseTime(time) {
		return Math.round(new Date(time) / 1000);
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
		if (!this.getConfig('check')) {
			uni.navigateTo({
				url: '/pages/detail/detail?id=' + id
			});
		} else {
			uni.navigateTo({
				url: '/pages/detail/detail2?id=' + id
			});
		}
	},

	getConfig(name) {
		let config = uni.getStorageSync('config');
		return config[name];
	},

	getExt(filePath) {
		const index = filePath.lastIndexOf(".");
		const ext = filePath.substr(index + 1);
		return ext;
	},

	getIePlayUrl(url) {
		return $C.parse_url + url;
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
