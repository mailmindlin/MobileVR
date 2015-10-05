try {
(function() {
	function isset(a) {return typeof a !== 'undefined'};
	
	Object.defineEnum(window, 'VREye', ['left','right']);
	
	window.VRPositionState = Class.extend({
		get timestamp() {
			return undefined;
		},
		get hasPosition() {
			return undefined;
		},
		__set: function(name, value) {
			this.__defineGetter__(name, function(){return value;});
			return value;
		},
		init: function VRPositionState(args) {
			this.__set('timestamp',args.timestamp || Date.now()/1000.0);
			if(this.__set('hasPosition','position' in args)) {
				if (!args.position instanceof DOMPoint)
					throw new TypeError('args.position not DOMPoint');
				this.__set('position',args.position);
			}
		
			if ('linearVelocity' in args)
				this.__set('linearVelocity',args.linearVelocity);
			
			if ('linearAcceleration' in args)
				this.__set('linearAcceleration',args.linearAcceleration);
			
			if (this.__set('hasOrientation',('orientation' in args))) {
				if (!args.orientation instanceof DOMPoint)
					throw new TypeError('args.orientation not DOMPoint');
				this.__set('orientation',args.orientation);
			}
			
			if ('angularVelocity' in args)
				this.__set('angularVelocity',args.angularVelocity);
			
			if ('angularAcceleration' in args)
				this.__set('angularAcceleration',args.angularAcceleration);
			
			Object.makeConst(this, ['timestamp', 'hasPosition', 'position', 'linearVelocity', 'linearAcceleration', 'hasOrientation',
				'orientation', 'angularVelocity', 'angularAcceleration']);
		}
	});
	
	var VRDevice = window.VRDevice = Class.extend({
		hardwareUnitId: undefined,
		deviceId: undefined,
		deviceName: undefined,
		init: function VRDevice(hardwareUnitId, deviceId, deviceName) {
			
		}
	});
	
	var HDMVRDevice = window.HMDVRDevice = Class.extend({
		getEyeParameters: function(whichEye) {
			return this._getEyeParameters(whichEye);
		},
		setFieldOfView: function(leftFOV, rightFOV, zNear, zFar) {
			var args = [leftFOV, rightFOV, zNear, zFar];
			if (typeof zNear === 'undefined')
				args[2] = 0.01;
			if (typeof zFar === 'undefined')
				args[3] = 10000.0;
			return this._setFieldOfView.apply(this, args);
		}
	});
	
	var PositionSensorVRDevice = window.PositionSensorVRDevice =  Class.extend({
		getState: function() {
			return undefined;
		},
		getImmediateState: function() {
			return undefined;
		},
		resetSensor: function() {
			return;
		}
	});
	
	
	
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
}catch (e) {
	if (isMobile)
		window.onerror(e.message, "webvrpoly.js", e.lineNumber, 0, e);
	else
		throw e;
}