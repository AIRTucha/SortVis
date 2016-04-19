var SortVis = require('./SortVis');
var buttons = require('./buttons')
var $ = require('jquery');


//trun on jq-ui
require('jquery-ui');

(function(namespace) {window.onload = function(){
  var s = new SortVis(20, 
                      function(a, b) {return a < b;},
                      $('#main').width() * 0.99,
                      $(window).height() * 0.85,
                      100,
                      "#AA0077", 
                      "#DD00AA", 
                      "#00BB00", 
                      "#BB0000", 
                      "#AAAAAA");
  
   var step = 0;
 
   var b= buttons(window.innerHeight*0.04, '#buttons',
     function(obj){
      s.backwardAnimation(function(){
        updataSlider();
        obj.setStop();
      });
     },
     function(){
       s.backwardStep(function(){
       updataSlider(); 
       });
     },
     function(){
        if(s.ifRun())
          s.stop();
        else
          s.reset();
     },
     function(){
       s.forwardStep(function(){
       updataSlider();
       });
     },
     function(obj){
       s.forwardAnimation(function(){
         updataSlider();
         obj.setStop();
       });
     });
  
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
        b.setReset();
      }
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