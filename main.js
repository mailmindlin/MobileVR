var version = "0.0.0.5";
console.info(version);
var canvas = $('canvas')[0];
var ctx = canvas.getContext('2d');
Object.defineEnum(window,'Directions',[
	'up',//'screen' side of device
	'down',//'back' of device
	'left',//landscape, rotated right 90deg
	'right',//landscape, rotated left 90deg
	'top',//top of device (portrait top)
	'bottom']);//bottom of device (portrait upsidedown)

$(window).resize(function(){
	canvas.width = $(window).width();
	canvas.height = $(window).height();
});
$(window).trigger('resize');
var pData = {
	orientation: Directions.up,
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
	pitch: 0,
	yaw: 0,
	roll: 0
};
window.addEventListener('deviceorientation', function(e) {
	pData.abs = event.absolute | 0;
	pData.alpha = event.alpha | 0;
	pData.beta = event.beta - 90 | 0;
	pData.gamma = event.gamma | 0;
	switch (pData.orientation) {
		case Directions.top:
			pData.pitch = event.alpha | 0;
			pData.yaw = event.beta - 90 | 0;
			pData.roll = event.gamma | 0;
			break;
		case Directions.bottom:
			pData.pitch = event.alpha | 0;
			pData.yaw = event.beta + 90 | 0;
			pData.roll = event.gamma | 0;
			break;
		case Directions.up:
			pData.pitch = event.beta | 0;
			pData.yaw = event.alpha | 0;
			pData.roll = event.gamma | 0;
			break;
		case Directions.down:
			pData.pitch = event.beta + 180 | 0;
			pData.yaw = event.alpha + 180 | 0;
			pData.roll = event.gamma | 0;
			break;
		case Directions.left:
			pData.pitch = event.gamma | 0;
			pData.yaw = event.beta | 0;
			pData.roll = event.alpha + 90 | 0;
			break;
		case Directions.right:
			pData.pitch = event.gamma | 0;
			pData.yaw = event.beta | 0;
			pData.roll = event.alpha - 90 | 0;
			break;
	}
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
function renderInfo(ctx, width, height) {
	ctx.font="20px Georgia";
	var text = JSON.stringify(pData);
	var lines = ["α: " + pData.alpha,"β: " + pData.beta,"γ: " + pData.gamma,
		"p: "+pData.pitch, "y: "+pData.yaw, "r: "+pData.roll];
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
	
	ctx.strokeStyle='black';
	ctx.beginPath();
	ctx.moveTo(width/2, 100);
	ctx.lineTo(width/2, 125);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo((pData.pitch/180 + 1) * width/2, 105);
	ctx.lineTo(width/2, 105);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo((pData.yaw/180 + 1) * width/2, 115);
	ctx.lineTo(width/2, 115);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo((pData.roll/180 + 1) * width/2, 120);
	ctx.lineTo(width/2, 120);
	ctx.stroke();
}
function renderDot(ctx) {
	var g = 0;
	var b = 90;
	var ra = (pData.gamma<180?pData.gamma:360-pData.gamma) - g;
	var rb = b - pData.beta;
	
	var x = canvas.width/2 + 2 * ra;
	var y = canvas.height/2 - 2 * rb;
	
	ctx.fillStyle = '#000';
	ctx.beginPath();
	ctx.arc(x, y, 10, 0, 6.29);
	ctx.fill();
	console.log(ra,rb, pData.beta);
}
var Renderer = {
	_doRender: true,
	set doRender(value) {
		this._doRender = value;
		if (value)
			this.renderFrame(0);
	},
	get doRender() {
		return this._doRender;
	},
	renderFrame: function(timestamp) {
		console.log('rendering');
		canvas.width = $(window).width();
		ctx.clearRect(0,0,canvas.width, canvas.height);
		
		renderInfo(ctx, canvas.width, canvas.height);
		renderDot(ctx, canvas.width, canvas.height);
		
		if (Renderer.render)
			window.requestAnimationFrame(Renderer.renderFrame);
	},
	render: renderDot
};
Renderer.doRender=true;
