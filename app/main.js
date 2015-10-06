var version = "0.0.0.13";
try {
console.info(version);
alert("Version "+version);
var canvas = $('canvas')[0];
var ctx = canvas.getContext('2d');
$(window).resize(function(){
	canvas.width = $(window).width();
	canvas.height = $(window).height();
});
$(window).trigger('resize');
window.gsd=false;
$(canvas).click(function() {
	PositionController.orientation = Directions[(Directions.indexOf(PositionController.orientation) + 1) % Directions.length];
});
PositionController.init();
function drawIpInput(ctx, width, height) {
	var buttons = [];
	
}
function drawScale(ctx, x, y, value, range, width) {
	//console.log(value, (value/range + 1) * width, y);
	ctx.beginPath();
	ctx.moveTo((value/range + 1) * width, y);
	ctx.lineTo(x, y);
	ctx.stroke();
}
function renderInfo(ctx, width, height) {
	ctx.font="20px Georgia";
	var text = JSON.stringify(PositionController);
	var lines = ['o: ' + PositionController.orientation.toString(),"",
		"α: " + PositionController.alpha,"β: " + PositionController.beta,"γ: " + PositionController.gamma,"",
		"p: "+PositionController.pitch, "y: "+PositionController.yaw, "r: "+PositionController.roll,"",
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
	
	drawScale(ctx, width/2, 75, Angle.rel0( PositionController.alpha), 180, width/2);
	drawScale(ctx, width/2, 95, Angle.rel0( PositionController.beta), 180, width/2);
	drawScale(ctx, width/2, 115, Angle.rel0( PositionController.gamma), 180, width/2);
	
	drawScale(ctx, width/2, 155, PositionController.pitch, 180, width/2);
	drawScale(ctx, width/2, 175, PositionController.yaw, 180, width/2);
	drawScale(ctx, width/2, 195, PositionController.roll, 180, width/2);
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