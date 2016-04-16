'use strict';
let docEl = document.documentElement,
	resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
	recalc = () => {
		let clientWidth = docEl.clientWidth > 640 ? 640 : docEl.clientWidth;
		if (!clientWidth) {
			return;
		}
		docEl.style.fontSize = 20 * (clientWidth / 640) + 'px'; //这里的20是指在640是px的设计稿中字的基本大小
};


document.addEventListener('DOMContentLoaded', recalc, false);
window.addEventListener(resizeEvt, recalc, false);