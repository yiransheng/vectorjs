(function(root) {
    'use strict';

    var Point2d, Point2dConstructor, M=Math;

    function _extend(obj) {
        Array.prototype.slice.call(arguments, 1).forEach(function(source) {
            if (source) {
                for (var prop in source) {
                    obj[prop] = source[prop];
                }
                Object.defineProperty(obj, prop, {
                    enumerable: false,
                    configurable: false
                });
            }
        });
        return obj;
    }
    function isNumber(n) {
        return typeof n == "number"
    }
    function add(a,b) {
        return { x: a.x + b.x, y: a.y + b.y }
    }
    function subtract(a,b) {
        return { x: a.x - b.x, y: a.y - b.y }  
    }
    function dot(a, b) {
        return a.x * b.x + a.y * b.y 
    }
    function cross(a, b) {
        return a.x * b.y - a.y * b.x
    }
    function normalize(a, n) {
        n = isNumber(n) ? n : 1;
        var d = M.sqrt(a.x*a.x + a.y*a.y);
        if (d===0) return {x:0,y:0};
        return { x: a.x/d*n, y:a.y/d*n}
    }
    function distance(a,b) {
        var dx = a.x - b.x,
            dy = a.y - b.y;
        return M.sqrt(dx*dx + dy*dy)  
    }
    function size(a) {
        return M.sqrt(a.x*a.x + a.y*a.y)    
    }
    function isPoint(a) {
        return a instanceof Point2dConstructor || isPointXY(a) || isPointPolar(a) 
    }
    function isPointXY(a) {
        if (!a) return false;
        if (a instanceof Point2dConstructor) 
            return a.hasOwnProperty("__x");
        if (Object(a) === a) {
            return  isNumber(a.x) && isNumber(a.y)  
        } 
        return false;
    }
    function isPointPolar(a) {
        if (!a) return false;
        if (a instanceof Point2dConstructor) 
            return a.hasOwnProperty("__r");
        if (Object(a) === a) {
            return  isNumber(a.r) && isNumber(a.theta)
        } 
        return false;
    }
    function toPolar(a) {
        if (isPointPolar(a)) return {r:a.r, theta:a.theta};
        if (!isPointXY(a)) throw new TypeError("Expect XY type Point!")
        return  {
            r : size(a),
            theta : M.atan2(a.y, a.x) 
        }
    }
    function toXY(a) {
        if (isPointXY(a)) return {x:a.x, y:a.y};
        if (!isPointPolar(a)) throw new TypeError("Expect Polar type Point!")
        return {
            x : a.r * M.cos(a.theta),
            y : a.r * M.sin(a.theta)  
        }  
    }

    var Point2dMethods = {
        add : add,
        subtract: subtract,
        cross : cross,
        normalize: normalize,
        distance : distance,
        size: size,
        isPoint: isPoint,
        isPointXY: isPointXY,
        isPointPolar: isPointPolar,
        toXY: toXY,
        toPolar: toPolar
    };

    var methods = Object.keys(Point2dMethods), point2dProto={}; 
    Object.defineProperties(point2dProto, {
        raiseTypeError : {
            value : function() {
                if (isNumber(this.x) && isNumber(this.y))
                    return false;
                return new TypeError("Invalid Point Type.")
            },
            enumerable : false
        },
        valueOf : {
            value: function () {
                return isPointXY(this) ? { x: this.x, y: this.y} : toXY(this) 
            },
            enumerable : false
        },
        set : { 
            value : function(attr,value) {
                if (Object(attr) === attr) {
                    for (var prop in attr) {
                        this.set(prop, attr[prop])  
                    }
                } else if (attr!="x"&&attr!="y"&&attr!="r"&&attr!="theta") {
                    return this
                } else if (typeof value == 'function') {
                    this.set(attr, value(this));
                } else if (isNumber(value)) {
                    this[attr] = value
                }
                return this
            },
            enumerable: false
        },
        transform : { 
            value : function(fn, copy) {
                self = copy == "copy" ? Point2d(this.x, this.y) : this;
                fn(self);
                return self;
            },
            enumerable : false
        }, 
        __x : {
            value : 0,
            enumerable: false,
            writable: true
        },
        __y : {
            value : 0,
            enumerable: false,
            writable: true
        },
        __r : {
            value : 0,
            enumerable: false,
            writable: true
        },
        __theta : {
            value : 0,
            enumerable: false,
            writable: true
        }
    });
    methods
        .map(function(method) {
            return function() {
                var e = this.raiseTypeError();
                if (e) throw e;
                var args = Array.prototype.slice.call(arguments);
                args.unshift(this);
                return Point2d(Point2dMethods[method].apply(this, args))  
            }    
        })
        .forEach(function(fn, i) {
            var e={}; e[methods[i]]=fn;
            _extend(point2dProto, e);      
        });
    Object.defineProperty(point2dProto, "x", {
        set : function(x) { 
            if (isPointPolar(this)) {
                var p = toXY(this),
                    _p = toPolar({ x: x, y:p.y });
                this.r = _p.r;
                this.theta = _p.theta;
            } else {
                this.__x = x;
            }
        },
        get : function() {
            if (isPointPolar(this)) {
                return toXY(this).x
            } else {
                return this.__x
            }    
        },
        enumerable: true
    });
    Object.defineProperty(point2dProto, "y", {
        set : function(y) { 
            if (isPointPolar(this)) {
                var p = toXY(this),
                    _p = toPolar({ x: p.x, y:y });
                this.r = _p.r;
                this.theta = _p.theta;
            } else {
                this.__y = y;
            }
        },
        get : function() {
            if (isPointPolar(this)) {
                return toXY(this).y
            } else {
                return this.__y
            }    
        },
        enumerable: true
    });

    Object.defineProperty(point2dProto, "r", {
        set : function(r) {
            if (isPointXY(this)) {
                var p = toPolar(this),
                    _p = toXY({ r: r, theta: p.theta })
                this.__x = _p.x;
                this.__y = _p.y;
            } else {
                this.__r = r
            }
        },
        get : function() {
            if (isPointXY(this)) {
                return toPolar(this).r
            } else {
                return this.__r
            } 
        },
        enumerable: true
    });

    Object.defineProperty(point2dProto, "theta", {
        set : function(theta) {
            if (isPointXY(this)) {
                var p = toPolar(this),
                    _p = toXY({ r: p.r, theta: theta })
                this.__x = _p.x;
                this.__y = _p.y;
            } else {
                this.__theta = theta                
            }
        },
        get : function() {
            if (isPointXY(this)) {
                return toPolar(this).theta
            } else {
                return this.__theta
            } 
        },
        enumerable: true
    });
     
    Point2dConstructor = function(x,y,polar) {
        if (polar) {
            delete this.__x;
            delete this.__y;
            this.r = x;
            this.theta = y;
        } else {
            delete this.__r;
            delete this.__theta;
            this.x = x;
            this.y = y;
        }        
    };

    Point2dConstructor.prototype = point2dProto;

    Point2d = function(obj, y, polar) { 
        if (obj instanceof Point2dConstructor) {
            return obj;
        } else if (isPoint(obj)) {
            if (isPointXY(obj)) {
                var p = new Point2dConstructor(obj.x, obj.y); 
            } else {
                var p = new Point2dConstructor(obj.r, obj.theta, true);   
            }
            return p;
        } else if (obj instanceof Array) {
            return obj.map(Point2d)
        } else if (isNumber(obj) && isNumber(y)){
            return polar=="polar" ? Point2d({ r:obj, theta: y}) : Point2d({x:obj, y:y})
        } else if (obj == undefined) {
            return Point2d({x:0, y:0})
        } else {
            return obj
        }
    };
    methods
        .map(function(method) {
            return function() {
                var p = Point2dMethods[method].apply(this, arguments);
                return Point2d(p)    
            }
        })
        .forEach(function(fn, i) {
            Point2d[methods[i]] = fn;     
        });
    var _Point = root.point;
    Point2d.no_conflict = function() {
        return _Point;
    }
    root.point = Point2d;

})(window);