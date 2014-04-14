vectorjs
========

Small vector calculation lib.

## Example Usage

### Initializing:
'''
var p = point(10, 0);
var p = point({x:10,y:0});
var p = point({r:10, theta:0});
var p = point(10, theta, 'polar');
// { x: 10, y: 0};
'''

### Vector operation chaining
Each computation returns a new instance of point, it does not mutate the original point instance.

'''
var p = point(1,1);
p.add({x:1,y:2})
 .subtract({x:3, y:4})
 .normalize()
 .dot({x:1,y:2});
// -2.1213203435596424
'''

Class method can also be used:
'''
point.add({x:1,y:2}, {x:1,y:2});
// point(2,4)
'''

### Seamless conversion between polar/XY coordinate systems
'''
p = point(0,1);

p.r == 1 // true
p.theta == Math.PI / 2 // true
'''

### API's

The following can all be used both as class methods, or instance methods(chainable).
'''
point.add
point.subtract
point.normalize
point.size
point.dot
point.cross
point.isPoint
point.isPointPolar
point.isPointXY
point.toPolar
point.toXY
'''

