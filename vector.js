(function(root) {
    'use strict';

    var _extend = function(obj) {
        Array.prototype.slice.call(arguments, 1).forEach(function(source) {
            if (source) {
                for (var prop in source) {
                    obj[prop] = source[prop];
                }
            }
        });
        return obj;
    };

    var Vector2dMethods = {
        add      : function add(a,b) {
            return { x: a.x + b.x, y: a.y + b.y }
        },
        subtract : function subtract(a,b) {
            return { x: a.x - b.x, y: a.y - b.y }  
        },
        dot  : function dot(a, b) {
            return a.x * b.x + a.y * b.y 
        },
        cross: function(a, b) {
            return a.x * b.y - a.y * b.x
        },
        normalize: function normalize(a, n) {
            n = typeof n == "number" ? n : 1;
            var d = Math.sqrt(a.x*a.x + a.y*a.y);
            if (d==0) return {x:0,y:0}
            return { x: a.x/d*n, y:a.y/d*n}
        },
        distance : function distance(a,b) {
            var dx = a.x - b.x,
                dy = a.y - b.y;
            return Math.sqrt(dx*dx + dy*dy)  
        },
        size   : function size(a) {
            return Math.sqrt(a.x*a.x + a.y*a.y)    
        },
        isVector : function isVector(a) {
            return (Object(a) === a &&
                typeof a.x == "number" &&
                typeof a.y == "number") 
        }
    };

    var methods = Object.keys(Vector2dMethods), 
        vector2dMethods = {
            valueOf : function () {
                return {x:this.x, y:this.y}  
            }  
        };
    methods
        .map(function(method) {
            return function() {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(this);
                return this(Vector2dMethods[method].apply(this, args))  
            }    
        })
        .forEach(function(fn, i) {
            vector2dMethods[methods[i]] = fn;      
        });

    var Vector2d = function() { 
        var vector = new Function("a", "v", 
            's=arguments.callee;return (Object(a)===a?(s.x=a.x,s.y=a.y,s):(a=="x"||a=="y"?(typeof v=="number"?(s[a]=v,s):s[a]):a))')
        _extend(vector, vector2dMethods);
        return arguments.length ? vector.apply(this, arguments) : vector;
    };
    _extend(Vector2d, Vector2dMethods);
    var _Vector = root.vec;
    Vector2d.no_conflict = function() {
        return _Vector;
    }
    root.vec = Vector2d;

})(window);