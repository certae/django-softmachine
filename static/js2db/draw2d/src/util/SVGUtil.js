/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
// extending raphael with a polygon function
Raphael.fn.polygon = function(pointString) {
  var poly  = ['M'],
      point = pointString.split(' ');
      
  for(var i=0; i < point.length; i++) {
     var c = point[i].split(',');
     for(var j=0; j < c.length; j++) {
        var d = parseFloat(c[j]);
        if (d)
          poly.push(d);
     };
     if (i == 0)
      poly.push('L');
  }
  poly.push('Z');
  
  return this.path(poly);
};