try {
(function() {
	function set(obj, name, value) {
		obj.__defineGetter__(name, function(){return value;});
		return value;
	}
	function isset(a) {return typeof a !== 'undefined'};
	
	Object.defineEnum(window, 'VREye', ['left','right']);
	
	var VRFieldOfView = window.VRFieldOfView = Class.extend({
		get upDegrees() {
			return 0;
		},
		get rightDegrees() {
			return 0;
		},
		get downDegrees() {
			return 0;
		},
		get leftDegrees() {
			return 0;
		},
		init: function VRFieldOfView() {
			if (arguments.length==0)
				return;
			if (arguments.length==1) {
				var init = arguments[0];
				set(this 'upDegrees', init.upDegrees);
				set(this 'rightDegrees', init.rightDegrees);
				set(this 'downDegrees', init.downDegrees);
				set(this 'leftDegrees', init.leftDegrees);
				return;
			} else if (arguments.length == 4) {
				set(this 'upDegrees', arguments[0]);
				set(this 'rightDegrees', arguments[1]);
				set(this 'downDegrees', arguments[2]);
				set(this 'leftDegrees', arguments[3]);
			} else {
				throw new TypeError("Expected 0, 1, or 4 arguments. Invalid number of arguments " + arguments.length +'.');
			}
		}
	});
	
	var VRFieldOfViewInit = window.VRFieldOfViewInit = new VRFieldOfView(0.0,0.0,0.0,0.0);
	
	window.VRPositionState = Class.extend({
		get timestamp() {
			return undefined;
		},
		hasPosition: false,
		position: null,
		linearVelocity: null,
		linearAcceleration: null,
		hasOrientation: false,
		orientation: null,
		angularVelocity: null,
		angularAcceleration: null,
		init: function VRPositionState(args) {
			set(this, 'timestamp',args.timestamp || Date.now()/1000.0);
			if(set(this, 'hasPosition','position' in args)) {
				if (!args.position instanceof DOMPoint)
					throw new TypeError('args.position not DOMPoint');
				set(this, 'position',args.position);
				
				if ('linearVelocity' in args)
					set(this, 'linearVelocity',args.linearVelocity);
				
				if ('linearAcceleration' in args)
					set(this, 'linearAcceleration',args.linearAcceleration);
			} else {
				set(this, 'position', null);
			}
			
			if (set(this, 'hasOrientation',('orientation' in args))) {
				if (!args.orientation instanceof DOMPoint)
					throw new TypeError('args.orientation not DOMPoint');
				set(this, 'orientation',args.orientation);
			}
			
			if ('angularVelocity' in args)
				set(this, 'angularVelocity',args.angularVelocity);
			
			if ('angularAcceleration' in args)
				set(this, 'angularAcceleration',args.angularAcceleration);
			
			Object.makeConst(this, ['timestamp', 'hasPosition', 'position', 'linearVelocity', 'linearAcceleration', 'hasOrientation',
				'orientation', 'angularVelocity', 'angularAcceleration']);
		}
	});
	
	var VREyeParameters = window.VREyeParameters = Class.extend({
		/**
		 * const readonly attribute VRFieldOfView
		 * Describes the minimum supported field of view for the eye.
		 */
		get minimumFieldOfView() {
			return undefined;
		},
		/**
		 * const readonly attribute VRFieldOfView
		 * Describes the maximum supported field of view for the eye.
		 */
		get maximumFieldOfView() {
			return undefined;
		},
		/**
		 * const readonly attribute VRFieldOfView
		 * 
		 * Describes the recommended field of view for the eye. It is RECOMMENDED that this be set to a value based on user
		 * calibration.
		 */
		get recommendedFieldOfView() {
			return undefined;
		},
		/**
		 * const readonly attribute DOMPoint
		 *
		 * fset from the center of the users head to the eye in meters. This value SHOULD represent the users inter-pupilary
		 * distance (IPD), but may also represent the distance from the centerpoint of the headset to the centerpoint of the lense
		 * for the given eye. Values for the left eye MUST be negative, values for the right eye MUST be positive.
		 */
		get eyeTranslation() {
			return undefined;
		},
		/**
		 * The current field of view for the eye, as specified by setFieldOfView. Defaults to recommendedFieldOfView.
		 */
		get currentFieldOfView() {
			return undefined;
		},
		/**
		 * Describes the viewport of a canvas into which visuals for this eye should be rendered. The renderRect for the left eye
		 * and right eye MUST NOT overlap, and the renderRect for the rightEye MUST be to the right of the renderRect for the left
		 * eye.
		 * The union of the renderRects for both eyes SHOULD describe the optimal rendering resolution for the HMD when using
		 * currentFieldOfView, such that the center of the users view maintains a 1:1 pixel ratio after any distortion to correct for
		 * HMD optics is applied to the rendering.
		 */
		get renderRect() {
			return undefined;
		}
	})
	
	var VRDevice = window.VRDevice = Class.extend({
		hardwareUnitId: undefined,
		deviceId: undefined,
		deviceName: undefined,
		init: function VRDevice(hardwareUnitId, deviceId, deviceName) {
			set(this, 'hardwareUnitId', hardwareUnitId);
			set(this, 'deviceId', deviceId);
			set(this, 'deviceName', deviceName);
		}
	});
	
	var HDMVRDevice = window.HMDVRDevice = VRDevice.extend({
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
	
	var PositionSensorVRDevice = window.PositionSensorVRDevice =  VRDevice.extend({
		getState: function() {
			return undefined;
		},
		getImmediateState: function() {
			return this.getState();
		},
		resetSensor: function() {
			return;
		}
	});
	
	var GyroscopeVRDevice = window.GyroscopeVRDevice = VRDevice.extend({
		init: function(posobj) {
			this.getState = function() {
				return new VRPositionState(posobj);
			};
		}
	})
	
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