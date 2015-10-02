var version = "0.0.0.11";
matry {
console.info(version);
alert("Version "+version);
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
	roll: 0,
	x: 0,
	y: 0
};
window.Angle = {
	rel0: function (x) {
		return Angle.rel0s(x%360);
	},
	rel0s: function (x) {
		return x>180?(x-360):(x<-180?(x+360):x);
	},
	reluu: function(z, x) {
		return Angle.rel0s(Angle.rel0(x)-Angle.rel0(z));
	},
	relsu: function(z, x) {
		return Angle.rel0s(Angle.rel0s(x)-Angle.rel0(z));
	},
	relus: function(z, x) {
		return Angle.rel0s(Angle.rel0(x)-Angle.rel0s(z));
	},
	relss: function(z, x) {
		return Angle.rel0s(Angle.rel0s(x)-Angle.rel0s(z));
	}
};
function angleRelativeTo(tare, gross) {
	var _gross = gross % 360, _tare = tare % 360;
	var result = _gross - _tare;
	if (result>180)
		result = 360 - result;
	if (result<-180)
		result = -360 - result;
	return result;
}
window.addEventListener('deviceorientation', function(e) {
	pData.abs = event.absolute | 0;
	pData.alpha = event.alpha | 0;
	pData.beta = event.beta | 0;
	pData.gamma = event.gamma | 0;
	switch (pData.orientation) {
		case Directions.top:
			pData.pitch = Angle.rel0(event.beta) | 0;
			pData.yaw   = Angle.rel0(event.alpha) | 0;
			pData.roll  = Angle.rel0(event.gamma) | 0;
			break;
		case Directions.bottom:
			pData.pitch = Angle.rel0(event.beta) | 0;
			pData.yaw   = Angle.rel0(event.alpha) | 0;
			pData.roll  = Angle.relsu(180, event.gamma) | 0;
			break;
		case Directions.up:
			pData.pitch = Angle.rel0(event.beta) | 0;
			pData.yaw   = Angle.rel0(event.alpha) | 0;
			pData.roll  = Angle.rel0(event.gamma) | 0;
			break;
		case Directions.down:
			pData.pitch = Angle.relsu(180,event.beta)  | 0;
			pData.yaw   = Angle.relsu(180,event.alpha) | 0;
			pData.roll  = Angle.rel0(event.gamma) | 0;
			break;
		case Directions.left:
			pData.pitch = Angle.rel0(event.gamma) | 0;
			pData.yaw   = Angle.rel0(event.alpha) | 0;
			pData.roll  = Angle.rel0(event.beta)  | 0;
			break;
		case Directions.right:
			pData.pitch = Angle.relsu(270, event.gamma) | 0;
			pData.yaw   = Angle.rel0(event.alpha) | 0;
			pData.roll  = Angle.rel0(event.beta) | 0;
			break;
	}
}, true);
$(canvas).click(function() {
	pData.orientation = Directions[(Directions.indexOf(pData.orientation) + 1) % Directions.length];
});
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
function drawScale(ctx, x, y, value, range, width) {
	//console.log(value, (value/range + 1) * width, y);
	ctx.beginPath();
	ctx.moveTo((value/range + 1) * width, y);
	ctx.lineTo(x, y);
	ctx.stroke();
}
function renderInfo(ctx, width, height) {
	ctx.font="20px Georgia";
	var text = JSON.stringify(pData);
	var lines = ['o: ' + pData.orientation.toString(),"",
		"α: " + pData.alpha,"β: " + pData.beta,"γ: " + pData.gamma,"",
		"p: "+pData.pitch, "y: "+pData.yaw, "r: "+pData.roll,"",
		'x: '+pData.x, 'y: '+pData.y];
	var overshoot;
	while((overshoot = ctx.measureText(lines[lines.length-1]).width/(canvas.width-10))>1) {
		var tmp = lines[lines.length-1];
		var i = tmp.length/overshoot -1 | 0;
		lines[lines.length-1] = tmp.substr(0,i);
		lines[lines.length] = tmp.substr(i);
	}
	text = lines.join("\n");
	//console.log(text);
	for (var i=0;i<lines.length;i++)
		ctx.fillText(lines[i], 0, 40 + 20 * i);
	
	ctx.strokeStyle='black';
	
	ctx.beginPath();
	ctx.moveTo(width/2, 70);
	ctx.lineTo(width/2, 200);
	ctx.stroke();
	
	drawScale(ctx, width/2, 75, Angle.rel0( pData.alpha), 180, width/2);
	drawScale(ctx, width/2, 95, Angle.rel0( pData.beta), 180, width/2);
	drawScale(ctx, width/2, 115, Angle.rel0( pData.gamma), 180, width/2);
	
	drawScale(ctx, width/2, 155, pData.pitch, 180, width/2);
	drawScale(ctx, width/2, 175, pData.yaw, 180, width/2);
	drawScale(ctx, width/2, 195, pData.roll, 180, width/2);
}
function renderDot(ctx) {
	
	var x = canvas.width/2 + 2 * pData.yaw;
	var y = canvas.height/2 + 2 * pData.pitch;
	pData.x = x - canvas.width/2;
	pData.y = y - canvas.height/2;
	
	ctx.fillStyle = '#000';
	ctx.beginPath();
	ctx.arc(x, y, 10, 0, 6.29);
	ctx.fill();
	//console.log(ra,rb, pData.beta);
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
		//console.log('rendering');
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

}catch (e) {
	if (isMobile)
		window.onerror(e.message, "main.js", e.lineNumber, 0, e);
	else
		throw e;
}