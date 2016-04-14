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

//s.sortingAnimation();
  
  
  
   $('#slyder').slider({
        animate: "slow",
        range : "min",
        min : 0,
        max : s.logSize,
        values : 0,
        start : function( event, ui ) {
          s.setStep(ui.value);
        },
        stop : function( event, ui ) {
          s.call(ui.value);
        }
   });
  
  s.sortingAnimation(function(){
    
    var a =  s.getStep();
    
    
    $('#slyder').slider( "option", "value", a );
  });

}

//namespace.usctVis = usctVis;
})(window);