//prefix fixer
document.fullscreenEnabled = document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullScreenEnabled;

navigator.fullscreen = {
	request: function(_element) {
		var element = _element;
		if (element instanceof Array) {
			if (element.length == 1)
				element = element[0];
			else
				return Promise.reject("Invalid argument");
		}
		return new Promise(function(yay, nay) {
			