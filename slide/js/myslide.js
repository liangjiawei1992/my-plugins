/*
	author:jiawei,
	time:20160416
*/
'use strict';
(function() {
	var MySlide = function(el, opt) {
		this.$element = el,
			this.$eparnet = el.parent();
		//默认设置
		this.defaults = {
			//子标签
			childTag: 'li',
			//从几个开始显示，从1开始
			startIndex: 1,
			//滑动域宽度
			viewWidth: window.innerWidth,
			//动画时间（单位毫秒ms）;
			dur: 800,
			//是否显示进度
			prog: false,
			//是否循环
			loop: true,
			//是否自动播放(自动播放时循环必须为ture)
			autoplay: {
				play: false,
				time: 1000
			},
			//进度条(是否显示/显示区域)
			process: {
				show: false,
				processBox: null
			},
			//当前进度
			curIndex: 0
		};
		this.options = $.extend({}, this.defaults, opt);
		this.run();
	};
	MySlide.prototype = {
		init: function() {
			var _this = this;
			//当前cur
			this.curIndex = 0;
			//窗口改变
			if (_this.options.viewWidth == window.innerWidth) {
				var t;
				$(window).on('resize', function() {
					clearTimeout(t);
					t = setTimeout(function() {
						_this.options.viewWidth = window.innerWidth;
					}, 100)
				})
			};
			if (this.options.loop) {
				var frist = this.$element.find(this.options.childTag + ':first-child');
				var last = this.$element.find(this.options.childTag + ':last-child');
				var clonefirst = frist.clone(),
					cloneLast = last.clone();
				// 分别添加首尾节点
				this.$element.append(clonefirst);
				this.$element.prepend(cloneLast);
				this.curIndex = this.options.startIndex - 1;
			} else {
				this.options.startIndex--;
				this.curIndex = this.options.startIndex;
			};
			var posiX = this.options.viewWidth * this.options.startIndex;
			this.startPosiX(posiX);
			this.oX = {
				startX: 0,
				endX: 0,
				disX: 0
			};
			this.len = this.$element.find(this.options.childTag).length;
			if (this.options.process.show) {
				this.createProcess();
				this.processCur(this.curIndex)
			}
		},
		startPosiX: function(posiX) {
			this.$element.css({
				"transform": "translate3d(" + (-posiX) + "px, 0px, 0px)",
				"transition-duration": "0ms"
			});
		},
		startFn: function(e) {
			var touchs = e.targetTouches[0];
			this.oX.startX = touchs.pageX;
			var _this = this;
			window.clearInterval(_this.mytimer);
			window.clearTimeout(_this._t);
			e.stopPropagation();
			e.preventDefault();
		},
		moveFn: function(e) {
			var _this = this;
			var touchs = e.targetTouches[0];
			this.oX.endX = touchs.pageX;
			this.oX.disX = this.oX.endX - this.oX.startX;
			if (this.options.loop) {
				if (this.options.startIndex == 0) {
					this.options.startIndex = this.len - 2;
				} else if (this.options.startIndex == this.len - 1) {
					this.options.startIndex = 1;
				};
			}
			this.animateFn(-this.options.startIndex * this.options.viewWidth + this.oX.disX, 0);
			e.stopPropagation();
			e.preventDefault();
		},
		endFn: function(e) {
			var goX = -this.options.startIndex * this.options.viewWidth;
			if (Math.abs(this.oX.disX) >= parseInt(this.options.viewWidth / 8)) {
				if (this.options.loop) {
					if (this.oX.disX > 0) {
						this.options.startIndex--;
						if (this.options.startIndex <= 0) {
							this.curIndex = this.len - 3;
						} else {
							this.curIndex = this.options.startIndex - 1;
						};
					} else {
						this.options.startIndex++;
						if (this.options.startIndex <= this.len - 2) {
							this.curIndex = this.options.startIndex - 1;
						} else {
							this.curIndex = 0;
						}
					}
					if (this.options.process.show) {
						this.processCur(this.curIndex);
					}
				} else {
					if ((this.options.startIndex == 0 && this.oX.disX > 0) || (this.options.startIndex == this.len - 1 && this.oX.disX < 0)) {
						//到头了
					} else {
						if (this.oX.disX > 0) {
							this.options.startIndex--;
						} else {
							this.options.startIndex++;
						}
						this.curIndex = this.options.startIndex;
					}
					if (_this.options.process.show) {
						_this.processCur(_this.curIndex);
					}
				}
				this.oX.disX = 0;
			}
			goX = -this.options.startIndex * this.options.viewWidth;
			this.animateFn(goX, this.options.dur);
			var _this = this;
			if (this.options.loop == true && this.options.autoplay.play == true) {
				this._t = setTimeout(function() {
					_this.mytimer = _this.timer();
				}, _this.options.autoplay.time + _this.options.dur)
			}
		},
		animateFn: function(value, time) {
			this.$element.css({
				"transform": "translate3d(" + value + "px, 0px, 0px)",
				"transition-duration": time + 'ms'
			})
		},
		timer: function() {
			var _this = this;
			var goX = 0;
			return window.setInterval(function() {
				_this.options.startIndex++;
				if (_this.options.startIndex == _this.len - 1) {
					_this.options.startIndex = 1;
					_this.animateFn(0, 0);
				};
				_this.curIndex = _this.options.startIndex - 1;
				goX = -_this.options.startIndex * _this.options.viewWidth;
				setTimeout(function() {
					_this.animateFn(goX, _this.options.dur);
					if (_this.options.process.show) {
						_this.processCur(_this.curIndex);
					}
				}, 10);
			}, _this.options.autoplay.time);
		},
		createProcess: function() {
			var eleNum = this.options.loop ? this.len - 2 : this.len;
			var str = "";
			for (var i = 0; i < eleNum; i++) {
				str += "<span></span>"
			}
			$(this.options.process.processBox).append(str);
		},
		processCur: function(idx) {
			$(this.options.process.processBox).find('span').eq(idx).addClass('cur').siblings().removeClass('cur');
		},
		run: function() {
			var _this = this;
			this.init();
			this.$eparnet.on('touchstart', function(e) {
				_this.startFn(e);
			});
			this.$eparnet.on('touchmove', function(e) {
				_this.moveFn(e);
			});
			this.$eparnet.on('touchend', function(e) {
				_this.endFn(e);
			});
			if (this.options.loop == true && this.options.autoplay.play == true) {
				this.mytimer = this.timer();
			}
		}
	};
	$.fn.myslide = function(options) {
		var _this = $(this);
		var slide = new MySlide(_this, options);
	}
})();