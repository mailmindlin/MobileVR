try {
Object.defineEnum(window,'Directions',[
	'up',//'screen' side of device
	'down',//'back' of device
	'left',//landscape, rotated right 90deg
	'right',//landscape, rotated left 90deg
	'top',//top of device (portrait top)
	'bottom']);//bottom of device (portrait upsidedown)
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
var PositionController = {
	_data: {
		rotation: Directions.top,
		dx: 0,
		dy: 0,
		dz: 0,
		x: 0,
		y: 0,
		z: 0
	},
	_offsets: {
		alpha: 0,
		beta: 0,
		gamma: 0
	},
	init: function() {
		window.addEventListener('devicemotion',PositionController.devmotion.bind(PositionController), true);
		window.addEventListener('deviceorientation',PositionController.devorientation.bind(PositionController), true);
	},
	devmotion: function(event) {
		console.log(event);
		var a=event.acceleration;
		this._data.x+= (this._data.dx = this._data.dx + (this._data.ddx = a.x));
		this._data.y+= (this._data.dy = this._data.dy + (this._data.ddy = a.y));
		this._data.z+= (this._data.dz = this._data.dz + (this._data.ddz = a.z));
		var g = event.accelerationIncludingGravity;
		this._data.gx = g.x;
		this._data.gy = g.y;
		this._data.gz = g.z;
		var d = event.rotationRate;
		this._data.da = d.alpha;
		this._data.db = d.beta;
		this._data.dg = d.gamma;
		if (Math.abs(d.alpha)>1)
			console.log('da:',d.alpha);
		if (Math.abs(d.beta)>1)
			console.log('da:',d.beta);
		if (Math.abs(d.gamma)>1)
			console.log('da:',d.gamma);
	},
	devorientation: function(event) {
		console.log(event);
		this._data.alpha = event.alpha;
		this._data.beta = event.beta;
		this._data.gamma = event.gamma;
		this.updatePYR();
	},
	updatePYR() {
		var alpha = this._data.alpha, beta = this._data.beta, gamma = this._data.gamma;
		switch (this._data.orientation) {
			case Directions.top:
				this._data.pitch = Angle.rel0(beta) | 0;
				this._data.yaw   = Angle.rel0(alpha) | 0;
				this._data.roll  = Angle.rel0(gamma) | 0;
				break;
			case Directions.bottom:
				this._data.pitch = Angle.rel0(beta) | 0;
				this._data.yaw   = Angle.rel0(alpha) | 0;
				this._data.roll  = Angle.relsu(180, gamma) | 0;
				break;
			case Directions.up:
				this._data.pitch = Angle.rel0(beta) | 0;
				this._data.yaw   = Angle.rel0(alpha) | 0;
				this._data.roll  = Angle.rel0(gamma) | 0;
				break;
			case Directions.down:
				this._data.pitch = Angle.relsu(180,beta)  | 0;
				this._data.yaw   = Angle.relsu(180,alpha) | 0;
				this._data.roll  = Angle.rel0(gamma) | 0;
				break;
			case Directions.left:
				this._data.pitch = Angle.rel0(gamma) | 0;
				this._data.yaw   = Angle.rel0(alpha) | 0;
				this._data.roll  = Angle.rel0(beta)  | 0;
				break;
			case Directions.right:
				this._data.pitch = Angle.relsu(270, gamma) | 0;
				this._data.yaw   = Angle.rel0(alpha) | 0;
				this._data.roll  = Angle.rel0(beta) | 0;
				break;
		}
	},
	get enabled() {
		return 'ondevicemotion' in window;
	},
	get alpha() {
		return this._data.alpha || 0;
	},
	set alpha(value) {
		this._offsets.alpha = this.alpha - value;
	},
	get beta() {
		return this._data.alpha || 0;
	},
	set beta(value) {
		this._offsets.beta = this.beta - value;
	},
	get gamma() {
		return this._data.alpha || 0;
	},
	set gamma(value) {
		this._offsets.gamma = this.gamma - value;
	},
	get pitch() {
		return this._data.pitch || 0;
	},
	get yaw() {
		return this._data.yaw || 0;
	},
	get roll() {
		return this._data.roll || 0;
	},
	get rotation() {
		return this._data.rotation;
	},
	set rotation(o) {
		if (Directions.indexOf(o)<0)
			throw new TypeError("Object is not instance of Directions");
		this._data.rotation = o;
		this.updatePYR();
	},
	get orientation() {
		return new DOMPoint(this.pitch, this.yaw, this.roll);
	},
	get angularVelocity() {
		return new DOMPoint(this._data.da, this._data.db, this._data.dg);
	},
	get position() {
		return new DOMPoint(this._data.x, this._data.y, this._data.z);
	},
	get linearVelocity() {
		return new DOMPoint(this._data.dx, this._data.dy, this._data.dz);
	},
	get linearAcceleration() {
		return new DOMPoint(this._data.ddx, this._data.ddy, this._data.ddz);
	}
};
}catch (e) {
	if (isMobile)
		window.onerror(e.message, "pos.js", e.lineNumber, 0, e);
	else
		throw e;
}