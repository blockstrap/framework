/*
 * Sonic 0.1
 * --
 * https://github.com/jamespadolsey/Sonic
 * --
 * This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://sam.zoy.org/wtfpl/COPYING for more details. */ 

(function(){

	var emptyFn = function(){};

	function Sonic(d) {

		this.data = d.path || d.data;
		this.imageData = [];

		this.multiplier = d.multiplier || 1;
		this.padding = d.padding || 0;

		this.fps = d.fps || 25;

		this.stepsPerFrame = ~~d.stepsPerFrame || 1;
		this.trailLength = d.trailLength || 1;
		this.pointDistance = d.pointDistance || .05;

		this.domClass = d.domClass || 'sonic';

		this.fillColor = d.fillColor || '#FFF';
		this.strokeColor = d.strokeColor || '#FFF';

		this.stepMethod = typeof d.step == 'string' ?
			stepMethods[d.step] :
			d.step || stepMethods.square;

		this._setup = d.setup || emptyFn;
		this._teardown = d.teardown || emptyFn;
		this._preStep = d.preStep || emptyFn;

		this.width = d.width;
		this.height = d.height;

		this.fullWidth = this.width + 2*this.padding;
		this.fullHeight = this.height + 2*this.padding;

		this.domClass = d.domClass || 'sonic';

		this.setup();

	}

	var argTypes = Sonic.argTypes = {
		DIM: 1,
		DEGREE: 2,
		RADIUS: 3,
		OTHER: 0
	};

	var argSignatures = Sonic.argSignatures = {
		arc: [1, 1, 3, 2, 2, 0],
		bezier: [1, 1, 1, 1, 1, 1, 1, 1],
		line: [1,1,1,1]
	};

	var pathMethods = Sonic.pathMethods = {
		bezier: function(t, p0x, p0y, p1x, p1y, c0x, c0y, c1x, c1y) {
			
		    t = 1-t;

		    var i = 1-t,
		        x = t*t,
		        y = i*i,
		        a = x*t,
		        b = 3 * x * i,
		        c = 3 * t * y,
		        d = y * i;

		    return [
		        a * p0x + b * c0x + c * c1x + d * p1x,
		        a * p0y + b * c0y + c * c1y + d * p1y
		    ]

		},
		arc: function(t, cx, cy, radius, start, end) {

		    var point = (end - start) * t + start;

		    var ret = [
		        (Math.cos(point) * radius) + cx,
		        (Math.sin(point) * radius) + cy
		    ];

		    ret.angle = point;
		    ret.t = t;

		    return ret;

		},
		line: function(t, sx, sy, ex, ey) {
			return [
				(ex - sx) * t + sx,
				(ey - sy) * t + sy
			]
		}
	};

	var stepMethods = Sonic.stepMethods = {
		
		square: function(point, i, f, color, alpha) {
			this._.fillRect(point.x - 3, point.y - 3, 6, 6);
		},

		fader: function(point, i, f, color, alpha) {

			this._.beginPath();

			if (this._last) {
				this._.moveTo(this._last.x, this._last.y);
			}

			this._.lineTo(point.x, point.y);
			this._.closePath();
			this._.stroke();

			this._last = point;

		}

	}

	Sonic.prototype = {
		setup: function() {

			var args,
				type,
				method,
				value,
				data = this.data;

			this.canvas = document.createElement('canvas');
			this._ = this.canvas.getContext('2d');

			this.canvas.className = this.domClass;

			this.canvas.height = this.fullHeight;
			this.canvas.width = this.fullWidth;

			this.points = [];

			for (var i = -1, l = data.length; ++i < l;) {

				args = data[i].slice(1);
				method = data[i][0];

				if (method in argSignatures) for (var a = -1, al = args.length; ++a < al;) {

					type = argSignatures[method][a];
					value = args[a];

					switch (type) {
						case argTypes.RADIUS:
							value *= this.multiplier;
							break;
						case argTypes.DIM:
							value *= this.multiplier;
							value += this.padding;
							break;
						case argTypes.DEGREE:
							value *= Math.PI/180;
							break;
					};

					args[a] = value;

				}

				args.unshift(0);

				for (var r, pd = this.pointDistance, t = pd; t <= 1; t += pd) {
					
					// Avoid crap like 0.15000000000000002
					t = Math.round(t*1/pd) / (1/pd);

					args[0] = t;

					r = pathMethods[method].apply(null, args);

					this.points.push({
						x: r[0],
						y: r[1],
						progress: t
					});

				}

			}

			this.frame = 0;
			//this.prep(this.frame);

		},

		prep: function(frame) {

			if (frame in this.imageData) {
				return;
			}

			this._.clearRect(0, 0, this.fullWidth, this.fullHeight);
			
			var points = this.points,
				pointsLength = points.length,
				pd = this.pointDistance,
				point,
				index,
				frameD;

			this._setup();

			for (var i = -1, l = pointsLength*this.trailLength; ++i < l && !this.stopped;) {

				index = frame + i;

				point = points[index] || points[index - pointsLength];

				if (!point) continue;

				this.alpha = Math.round(1000*(i/(l-1)))/1000;

				this._.globalAlpha = this.alpha;

				this._.fillStyle = this.fillColor;
				this._.strokeStyle = this.strokeColor;

				frameD = frame/(this.points.length-1);
				indexD = i/(l-1);

				this._preStep(point, indexD, frameD);
				this.stepMethod(point, indexD, frameD);

			} 

			this._teardown();

			this.imageData[frame] = (
				this._.getImageData(0, 0, this.fullWidth, this.fullWidth)
			);

			return true;

		},

		draw: function() {
			
			if (!this.prep(this.frame)) {

				this._.clearRect(0, 0, this.fullWidth, this.fullWidth);

				this._.putImageData(
					this.imageData[this.frame],
					0, 0
				);

			}

			this.iterateFrame();

		},

		iterateFrame: function() {
			
			this.frame += this.stepsPerFrame;

			if (this.frame >= this.points.length) {
				this.frame = 0;
			}

		},

		play: function() {

			this.stopped = false;

			var hoc = this;

			this.timer = setInterval(function(){
				hoc.draw();
			}, 1000 / this.fps);

		},
		stop: function() {

			this.stopped = true;
			this.timer && clearInterval(this.timer);

		}
	};

	window.Sonic = Sonic;

}());

var loader = new Sonic({
    
    width: 400,
    height: 400,

    backgroundColor: '#111',

    stepsPerFrame: 4,
    trailLength: 0.8,
    pointDistance: 0.005,
    fps: 35,

    setup: function() {
            this._.lineWidth = 10;
    },

    step: function(point, i, f) {

            var progress = point.progress,
                    degAngle = 360 * progress,
                    angle = Math.PI/180 * degAngle,
                    angleB = Math.PI/180 * (degAngle - 180),
                    size = i*5;

            this._.fillStyle = '#FFFFFF';

            this._.fillRect(
                    Math.cos(angle) * 100 + (200-size/2),
                    Math.sin(angle) * 75 + (200-size/2),
                    size,
                    size
            ); 

            this._.fillStyle = '#01C0FD';

            this._.fillRect(
                    Math.cos(angleB) * 75 + (200-size/2),
                    Math.sin(angleB) * 100 + (200-size/2),
                    size,
                    size
            );

            if (point.progress == 1) {

                    this._.globalAlpha = f < .5 ? 1-f : f;

                    this._.fillStyle = '#555';

                    this._.beginPath();
                    this._.arc(200, 200, 0, 0, 360, 0);
                    this._.closePath();
                    this._.fill();

            }


    },

    path: [
            ['line', 0, 0, 1, 1] // stub -- not actually rendered
    ]
});

if($('#neuroware').length > 0)
{
    var neuroware_sonic_injection = function(obj)
    {
        loader.play();
        $(obj).html('<a href="#" id="loader-wrapper" class="loading-elements"><span id="logo"></span></a><span id="loader-canvas" class="loading-elements"></span>');
        $(obj).find('#loader-canvas').html(loader.canvas);
    }
    if($('#neuroware').length > 0)
    {
        $('#neuroware').each(function()
        {
            neuroware_sonic_injection(this);
        })
    }
}