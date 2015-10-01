(function() {
	function isset(a) {return typeof a !== 'undefined'};
	
	Object.defineEnum(window, 'VREye', ['left','right']);
	
	window.VRPositionState = function VRPositionState(args) {
		this.timestamp = args.timestamp || Date.now()/1000.0;
		if(this.hasPosition = ('position' in args)) {
			if (!args.position instanceof DOMPoint)
				throw new TypeError('args.position not DOMPoint');
			this.position = args.position;
		}
		
		if ('linearVelocity' in args)
			this.linearVelocity = args.linearVelocity;
		
		if ('linearAcceleration' in args)
			this.linearAcceleration = args.linearAcceleration;
		
		if (this.hasOrientation = ('orientation' in args)) {
			if (!args.orientation instanceof DOMPoint)
				throw new TypeError('args.orientation not DOMPoint');
			this.orientation = orientation;
		}
		
		if ('angularVelocity' in args)
			this.angularVelocity = args.angularVelocity;
		
		if ('angularAcceleration' in args)
			this.angularAcceleration = args.angularAcceleration;
		
		Object.makeConst(this, ['timestamp', 'hasPosition', 'position', 'linearVelocity', 'linearAcceleration', 'hasOrientation',
			'orientation', 'angularVelocity', 'angularAcceleration']);
	};
		
	var VRDevice = window.VRDevice = function VRDevice(hardwareUnitId, deviceId, deviceName) {
		Object.defineProperties(this, {
			'hardwareUnitId': {
				configurable: false,
				enumerable: true,
				value: hardwareUnitId
			},
			'deviceId': {
				configurable: false,
				enumerable: true,
				value: deviceId
			},
			'deviceName': {
				configurable: false,
				enumerable: true,
				value: deviceName
		}});
	};
	Object.defineProperties(VRDevice.prototype, {
		'hardwareUnitId': {
			configurable: false,
			enumerable: true
		},
		'deviceId': {
			configurable: false,
			enumerable: true
		},
		'deviceName': {
			configurable: false,
			enumerable: true
	}});
	
	var HDMVRDevice = window.HMDVRDevice = function HDMVRDevice(x) {
		
	};
	HMDVRDevice.prototype = Object.create(VRDevice);
	HDMVRDevice.prototype = HMDVRDevice;
	HDMVRDevice.prototype.getEyeParameters = function(whichEye){
		return this._getEyeParameters(whichEye);
	};
	HDMVRDevice.prototype.setFieldOfView = function(leftFOV, rightFOV, zNear, zFar){
		var args = [leftFOV, rightFOV, zNear, zFar];
		if (typeof zNear === 'undefined')
			args[2] = 0.01;
		if (typeof zFar === 'undefined')
			args[3] = 10000.0;
		return this._setFieldOfView.apply(this, args);
	};
	
	window.PositionSensorVRDevice = function PositionSensorVRDevice() {
		
	};
	PositionSensorVRDevice.prototype = Object.create(VRDevice);
	PositionSensorVRDevice.prototype.constructor = PositionSensorVRDevice;
	PositionSensorVRDevice.prototype.getState = function() {
		return undefined;
	};
	PositionSensorVRDevice.prototype.getImmediateState = function() {
		return undefined;
	};
	PositionSensorVRDevice.prototype.resetSensor = function() {
		return;
	};
	
	
	
	var vrDevices = [];
	Navigator.prototype.getVRDevices = function() {
		return Promise.resolve(vrDevices);//TODO seal vrDevices
	};
	Navigator.prototype.__registerVRDevice = function(device) {
		if (!device instanceof VRDevice)
			throw new TypeError('device is not VRDevice');
		vrDevices.push(device);
	};
})();