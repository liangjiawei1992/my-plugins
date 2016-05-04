# 插件
### 一、h5 banner滑动（基于zepto || jquery）

*调用方式

	$('.banner ul').myslide({
		loop: true,
		autoplay: {
			play: true,
			time: 3000
		},
		process: {
			show: true,
			processBox: '.showbox'
		},
		dur: 800
	});

*参数说明

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

