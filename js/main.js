var SortVis = require('./SortVis');
var buttons = require('./buttons')
var page = require('./page');
var $ = require('jquery');


//trun on jq-ui
require('jquery-ui');

(function(namespace) {window.onload = function(){
  var s = new SortVis(20, 
                      function(a, b) {return a < b;},
                      $('#main').width() * 0.99,
                      $(window).height() * 0.85,
                      200,
                      "#AA0077", 
                      "#DD00AA", 
                      "#00BB00", 
                      "#BB0000", 
                      "#AAAAAA");
  
   var step = 0;
 

  var b = buttons(
    window.innerHeight*0.04, '#buttons',
    
     function(obj){
      if(s.getRun() == 0)
        obj.setStop();
    
      s.backwardAnimation(function(){ updataSlider(); });
     },
     function(){
       b.setReset();
       updataSlider();
       s.backwardStep();

     },
     function(){
        if(s.getRun() != 0){
          s.stop();
          b.setReset();
        }
        else{
          s.reset();
          b.setStop();
        }
    
        updataSlider();
     },
     function(){
       updataSlider();
       b.setReset();
       s.forwardStep();
     },
     function(obj){
      if(s.getRun() == 0)
        obj.setStop();
    
      s.forwardAnimation(function(){updataSlider();});
     }
  );
  
  $('#slyder').slider({
      animate: "fast",
      range : "min",
      min : 0,
      max : s.getLogSize(),
      values : 0,
      stop : function( event, ui ) {
        s.intervalAnimation(ui.value);
        b.setReset();
      }
  });
  
  $('#speed').on('change', function () {
    s.setDuration(500-this.value)
    $('#speed_n').text(500-this.value + 'mc');
  });
  
  $('#sizeSelector').on('change', function () { 
    s.setSize($(this).find('option:selected').val())
    b.setReset();
    updataSlider();
  });
  
  $('#algo').on('change', function () {
    s.setAlgo($(this).find('option:selected').val())
    b.setReset();
    updataSlider();
  });
  
  $('.savonia').click(function(){$(".about").fadeIn(500)});
  
 function updataSlider(){
    var steps = s.getStep();
    var logSize = s.getLogSize();
   
    $('#slyder').slider( "option", "value", steps).slider( "option", "max", logSize);
   
    if(steps <= 0 || steps >= logSize)
      b.setReset();
  }
  
  page.setLayout();
  page.createAbout();
  window.onresize = function(){
    s.resize($('#main').width() * 0.99, $(window).height() * 0.85)
    page.setLayout();
  }
}
})(window);