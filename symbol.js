try {
//Adapted from https://github.com/medikoo/es6-symbol/blob/master/polyfill.js
if (!'Symbol' in window) (function() {
	var d,
		create = Object.create,
		objPrototype = Object.prototype,
		Symbol,
		HiddenSymbol,
		globalSymbols = create(null);
	//implementation from https://www.npmjs.com/package/d
	d = function() {
		var result = {configurable: true, enumerable: false, writable: true};
		if (arguments.length==0)
			return result;
		if (arguments.length==1) {
			result.value = arguments[0];
			return result;
		}
		var instr = arguments[0] || '';
		return {
			value: arguments[1],
			configurable: instr.indexOf('c')>-1,
			writable: instr.indexOf('w')>-1,
			enumerable: instr.indexOf('e')>-1};
	};
	d.gs = function(instr, g, s) {
		var hinstr = typeof instr === 'string';
		return {
			configurable: hinstr?instr.indexOf('c')>-1:true,
			enumerable: hinstr?instr.indexOf('e')>-1:false,
			'get': g,
			'set': s};
	};
	
	var generateName = (function() {
		var created = Object.create(null);
		return function(desc) {
			var postfix = 0, name;
			while(created[desc + (postfix || '')])
				++postfix;
			
			desc += (postfix || '');
			created[desc] = true;
			name = '@@' + desc;
			Object.defineProperty(Object.prototype, name, d.gs(null, function (value) {
				Object.defineProperty(Object.prototype, name, d(value));
			}));
		}});
	
	HiddenSymbol = function Symbol(description) {
		if (this instanceof  HiddenSymbol)
			throw new TypeError('TypeError: Symbol is not a constructor');
		return Symbol(description);
	};
	window.Symbol = Symbol = function Symbol(description) {
		var symbol;
		if (this instanceof Symbol)
			throw new TypeError('TypeError: Symbol is not a constructor');
		symbol = create(HiddenSymbol.prototype);
		description = (description === undefined ? '' : String(description));
		return Object.defineProperties(symbol, {
			__description__: d('', description),
			__name__: d('',generateName(description))
		});
	};
	Object.defineProperties(Symbol, {
		'for': d(function(key) {
			if (globalSymbols[key])
				return globalSymbols[key];
		}),
		keyFor: d(function(s) {
			var key;
			validateSymbol(s);
			for (key in globalSymbols)
				if (globalSymbols[key] == s)
					return key;
		}),
		hasInstance: d('',Symbol('hasInstance')),
		isConcatSpreadable: d('', Symbol('isConcatSpreadable')),
		iterator: d('', Symbol('iterator')),
		match: d('', Symbol('match')),
		replace: d('', Symbol('replace')),
		search: d('', Symbol('search')),
		species: d('', Symbol('species')),
		split: d('', Symbol('split')),
		toPrimitive: d('', Symbol('toPrimitive')),
		toStringTag: d('', Symbol('toStringTag')),
		unscopables: d('', Symbol('unscopables'))
	});
	Object.defineProperties(HiddenSymbol.prototype, {
		constructor: d(Symbol),
		toString: d('', function(){return this.__name__;})
	});
	Object.defineProperties(Symbol.prototype, {
		toString: d(function() {return 'Symbol (' + validateSymbol(this).__description__ + ')'; }),
		valueOf: d(function () { return validateSymbol(this); })
	});
	Object.defineProperty(Symbol.prototype, Symbol.toPrimitive, d('',
		function () { return validateSymbol(this); }));
	Object.defineProperty(Symbol.prototype, Symbol.toStringTag, d('c', 'Symbol'));
	Object.defineProperty(HiddenSymbol.prototype, Symbol.toPrimitive,
		d('c', Symbol.prototype[Symbol.toPrimitive]));
	Object.defineProperty(HiddenSymbol.prototype, Symbol.toStringTag,
		d('c', Symbol.prototype[Symbol.toStringTag]));
})();
window.getSymbolName = function(sym) {
	if (typeof sym === 'string')
		return sym;
	var str = sym.toString();
	return str.substr(7, str.length-8);
};
}catch (e) {
	if (isMobile)
		window.onerror(e.message, "symbol.js", e.lineNumber, 0, e);
	else
		throw e;
}