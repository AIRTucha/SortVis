var SortVis = require('./SortVis');

(function(namespace) {window.onload = function(){
  var s = new SortVis(10, 
                      function(a, b) {return a < b;},
                      window.innerWidth, 
                      window.innerHeight, 
                      100,
                      "#AA0077", 
                      "#DD00AA", 
                      "#00BB00", 
                      "#BB0000", 
                      "#AAAAAA")

s.sortingAnimation();
}

//namespace.usctVis = usctVis;
})(window);