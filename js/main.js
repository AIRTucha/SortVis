var SortVis = require('./SortVis');
var b = require('./buttons')
var $ = require('jquery');


//trun on jq-ui
require('jquery-ui');

(function(namespace) {window.onload = function(){
  var s = new SortVis(20, 
                      function(a, b) {return a < b;},
                      $('#main').width() * 0.99,
                      $(window).height() * 0.85,
                      10,
                      "#AA0077", 
                      "#DD00AA", 
                      "#00BB00", 
                      "#BB0000", 
                      "#AAAAAA");
  
   var step = 0;
 
   $('#slyder').slider({
      animate: "fast",
      range : "min",
      min : 0,
      max : s.logSize,
      values : 0,
      start : function( event, ui ) {
          step = ui.value;
      },
      stop : function( event, ui ) {
        s.intervalAnimation(step, ui.value);
      }
   });
  
  
  b(window.innerHeight*0.04, '#buttons',
   function(){
    s.backwardAnimation(function(){
      updataSlider();
    });
   },
   function(){
     s.backwardStep(function(){
      updataSlider(); 
     });
   },
   function(){
     console.log('resetStop');
   },
   function(){
     s.forwardStep(function(){
       updataSlider();
     });
   },
   function(){
     s.forwardAnimation(function(){
       updataSlider();
     });
   });
  
  
 function updataSlider(){
    $('#slyder').slider( "option", "value", s.getStep());
  }
  
}
})(window);




// (function(d3) {
//			var screenMode= 0.95;
//	 
//	 		window.onresize = function(){ location.reload(); }		
//			
//			if(window.innerHeight<window.innerWidth){
//				d3.select("body").append("div").attr("id","legend").classed("legendHorizontal",true);
//				d3.select("body").append("div").attr("id","chart").classed("chartHorizontal",true);
//				screenMode= 0.7;
//			} else {
//				d3.select("body").append("div").attr("id","legend").classed("legendHorizontal",false);
//				d3.select("body").append("div").attr("id","chart").classed("chartHorizontal",false);
//			}
//	 		d3.json('data',function(e,json){
//				if(e==null){
//					json=parseData(json);
//					
//					console.log(json);
//					createLegend(screenMode,json)
//					createPieChart(json.filter(function(d){return d.enabled}).sort(),screenMode*window.innerWidth/2,
//								   d3.layout.pie().value(function(d){return d.data[0].distance;}),"pieChar1");
//					createPieChart(json.filter(function(d){return d.enabled}).sort(),screenMode*window.innerWidth/2,
//								   d3.layout.pie().value(function(d){return d.size;}),"pieChar2");
//					createBarChart(screenMode*window.innerWidth,0.95*window.innerHeight,json);
//					createPlot(screenMode*window.innerWidth,0.95*window.innerHeight,json);
//				}else 
//                  alert("Data Request Fail");
//				});
//	 			
// })(window.d3);