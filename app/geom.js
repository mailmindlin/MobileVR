(function() {
	function isset(a) {return typeof a !== 'undefined'};
	if (!'DOMPoint' in window) {
		window.DOMPoint = function DOMPoint(x, y, z, w) {
			var props = {};
			if (isset(x))
				props.x = {enumerable: true, value: x};
			if (isset (y)
				props.y = {enumerable: true, value: y};
			if (isset (z)
				props.z = {enumerable: true, value: z};
			if (isset (w)
				props.w = {enumerable: true, value: w};
			Object.defineProperties(this, props);
		};
		DOMPoint.prototype.matrixTransform = function(matrix) {
			//TODO finish
		};
		
		window.DOMPointReadOnly = function DOMPointReadOnly(x, y, z, w) {
			DOMPoint.apply(this, arguments);
		};
		DOMPointReadOnly.prototype = Object.create(DOMPoint);
		DOMPointReadOnly.prototype.constructor = DOMPointReadOnly;
		delete DOMPointReadOnly.prototype.matrixTransform;
	}
	
})();