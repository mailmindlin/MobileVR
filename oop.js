(function() {
	Object.defineEnum = function(scope, name, arr) {
		var symbols = [];
		for (var i in arr) {
			if (arr[i].toString().indexOf('Symbol')==0)//the best check of arr[i] instanceof Symbol that I could come up with
				symbols[i] = arr[i];
			else
				symbols[i] = Symbol(arr[i]);
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