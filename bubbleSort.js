var SortVis = require('./SortVis');
var $ = require('jquery');

//trun on jq-ui
require('jquery-ui');

(function(namespace) {window.onload = function(){
  var s = new SortVis(20, 
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
  
  
  
//   $('#slyder').slider({
//        animate: "fast",
//        range : "min",
//        min : 0,
//        max : s.logSize,
//        values : 0,
//        slide : function( event, ui ) {
//        //   var a = s.setD(0);
//          s.call(ui.value);
//         // s.setD(a);
//        }
//   });
}

//namespace.usctVis = usctVis;
})(window);