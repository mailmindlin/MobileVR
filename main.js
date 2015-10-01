var canvas = $('canvas')[0];
var ctx = canvas.getContext('2d');

$(window).resize(function(){
	canvas.width = $(window).width();
	canvas.height = $(window).height();
});
$(window).trigger('resize');
var pData = {
	abs: 0,
	alpha: 0,
	beta: 0,
	gamma: 0,
	ax:0,
	ay:0,
	az:0,
	gx:0,
	gy:0,
	gz:0,
	da:0,
	db:0,
	dg:0,
};
window.addEventListener('deviceorientation', function(e) {
	pData.abs = event.absolute | 0;
	pData.alpha = event.alpha | 0;
	pData.beta = event.beta | 0;
	pData.gamma = event.gamma | 0;
}, true);
window.addEventListener('devicemotion', function(e) {
	var a=e.acceleration;
	pData.ax = a.x;
	pData.ay = a.y;
	pData.az = a.z;
	var g = e.accelerationIncludingGravity;
	pData.gx = g.x;
	pData.gy = g.y;
	pData.gz = g.z;
	var d = e.rotationRate;
	pData.da = d.alpha;
	pData.db = d.beta;
	pData.dg = d.gamma;
}, true);
var Renderer = {
	_doRender: true,
	set render(value) {
		this._doRender = value;
		if (value)
			this.renderFrame(0);
	},
	get render() {
		return this._doRender;
	},
	renderFrame: function(timestamp) {
		console.log('rendering');
		canvas.width = $(window).width();
		ctx.clearRect(0,0,canvas.width, canvas.height);
		
		ctx.font="20px Georgia";
		var text = JSON.stringify(pData);
		var lines = [];
		for (var i in pData)
			lines.push(i+": "+pData[i]);
		var overshoot;
		while((overshoot = ctx.measureText(lines[lines.length-1]).width/(canvas.width-10))>1) {
			var tmp = lines[lines.length-1];
			var i = tmp.length/overshoot -1 | 0;
			lines[lines.length-1] = tmp.substr(0,i);
			lines[lines.length] = tmp.substr(i);
		}
		text = lines.join("\n");
		console.log(text);
		for (var i=0;i<lines.length;i++)
			ctx.fillText(lines[i], 0, 20 + 20 * i);
		
		if (Renderer.render)
			window.requestAnimationFrame(Renderer.renderFrame);
	}
};
Renderer.render=true;
