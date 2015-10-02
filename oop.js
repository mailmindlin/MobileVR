try {
(function() {
	Object.defineEnum = function(scope, name, arr) {
		var symbols = [];
		for (var i in arr) {
			var sym;
			if (arr[i].toString().indexOf('Symbol')==0)//the best check of arr[i] instanceof Symbol that I could come up with
				sym = arr[i];
			else
				sym = Symbol(arr[i]);
			symbols[i] = symbols[arr[i]] = symbols[sym] = sym;
		}
		Object.defineProperty(scope, name, {configurable: false, enumerable: true, get: function(){return symbols;}});
	};
	Object.makeConst = function(scope, names) {
		for(var i in names)
			if (scope.hasOwnProperty(names[i]))
				Object.defineProperty(scope, names[i], {configurable: false, enumerable: true, value: scope[names[i]]});
	};
	Object.extendMultiple = function(parents, constructor) {
		
	};
})();
}catch (e) {
	if (isMobile)
		window.onerror(e.message, "oop.js", e.lineNumber, 0, e);
	else
		throw e;
}