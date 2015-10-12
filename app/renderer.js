(function() {
var Scene = Class.extend({
	renderables: null,
	hitregions: null,
	init: function() {
		this.renderables = [];
		this.hitregions = {};
	},
	add: function(renderable) {
		this.renderables.push(renderable);
		return this;
	}
});
var Renderable = Class.extend({
	box: null,
	polygon: null,
	onTouchStart: null,
	onTouchEnd: null,
	onTouchCancel: null,
	onTouchMove: null
});
var Renderer = window.Renderer = Class.extend({
	scene: null,
	init: function(args) {
		this.canvas = args.canvas;
		if (!initGL(this.canvas))
			initNoGL(this.canvas);
		let a;
	},
	initGl(canvas) {
		var ctx;
		try {
			ctx = canvas.getContext("webgl") || canvas.getContext('experimental-webgl');
		} catch (e) {
			return false;
		}
		if (ctx !== undefined)
			
	drawNoGL: function(scene) {
		
	},
	drawGL: function(scene) {
		
	}
});
Renderer.Scene = Scene;
Renderer.Renderable = Renderable;
	
})();