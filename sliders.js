/**
* Create sliders in accoding with config object
**/
var $ = require('jquery');
var Snap = require('snap');
var Box = require('./box');

//trun on jq-ui
require('jquery-ui');

/*
* Great sliders 
* @param conf = {
    container : plase holder Class or ID (String)
    title : sliders block name (String)
    width : width of sliders (int)
    color : String color code 
    sliderH : hieght of every slider int
    x : int
    y : int
    //array with personal sliders settings
    sliders :[
      {
        range : true - for range sliders, 'min' - for normal
        min : int minamal value
        max : int maximal value
        values: [ int default min range, int default max range] for range
        value: int default value for normal
        text : function (v){return (String) handling of int @param - v },
        callback: function (v){ 
        handlining of int @param - v
      },
*/
 
function sliders(conf) {
  var w = $(window).width();
  var h = $(window).height();
  var s = Snap(conf.container);
  var box = Box("#main", 
                conf.title, 
                conf.width + h*0.06, 
                conf.sliderH * conf.sliders.length + conf.sliderH,
                conf.color);
  var slider = [];
    
  //move box to right position
  box.attr({transform : 'translate(' + conf.x + ',' + conf.y + ')'});
  
  //run accross array of sliders and creates them
  conf.sliders.forEach(function(d,i,ds){
    var fO = s.append(Snap.parse('<foreignObject ' +                                    
                                   'width=' + conf.width + ' ' + 
                                   'height=' + conf.sliderH +  ' ' + 
                                   'x=' + (h*0.025 + conf.x) + ' ' +
                                   'y=' + ((conf.sliderH*i+h*0.04) + conf.y) +
                                   ' id=' + conf.title.replace(' ','_') + i + '>' +                                   
                                   '<div id=' + 'slider_' + conf.title.replace(' ','_') + i + ' ' +
                                   '></div></foreignObject>'));
    
    $('#slider_' + conf.title.replace(' ','_') + i)
      .css({'width':conf.width,'margin-top':conf.sliderH/8 });    
   
   
    
    if(d.range == true){
      //create jQuery UI range slider 
      $('#slider_' + conf.title.replace(' ','_') + i).slider({
        animate: "fast",
        range : d.range,
        min : d.min,
        max : d.max,
        values : d.values,
        slide : function( event, ui ) {
          $('#result_' + conf.title.replace(' ','_') + i).remove();
          $('#' + conf.title.replace(' ','_') + i).prepend(
            '<p id=' + 
            'result_' + conf.title.replace(' ','_') + i + '>'+ 
            d.getText(ui.values) + 
            '</p>' 
          );
          d.callback(ui.values);
        }
      });
      
      //create title of the slider
      $('#' + conf.title.replace(' ','_') + i).prepend(
        '<p id=' + 
        'result_' + conf.title.replace(' ','_') + i + '>'+ 
        d.getText([
          $('#slider_' + conf.title.replace(' ','_') + i).slider("values", 0),
          $('#slider_' + conf.title.replace(' ','_') + i).slider( "values", 1)
        ]) + 
        '</p>' 
      );
    }
    else {
       //create jQuery UI normal slider 
      $('#slider_' + conf.title.replace(' ','_') + i).slider({
        animate: "fast",
        range : d.range,
        min : d.min,
        max : d.max,
        value : d.value,
        slide : function( event, 
                           ui ) {
          $('#result_' + conf.title.replace(' ','_') + i).remove();
          $('#' + conf.title.replace(' ','_') + i).prepend(
            '<p id=' + 
            'result_' + conf.title.replace(' ','_') + i + '>'+ 
            d.getText(ui.value) + 
            '</p>' 
          );
          d.callback(ui.value);
        }
      });
      
      //create title of the slider
      $('#' + conf.title.replace(' ','_') + i).prepend(
        '<p id=' + 
        'result_' + conf.title.replace(' ','_') + i + '>'+ 
        d.getText($('#slider_' + conf.title.replace(' ','_') + i).slider("value")) + 
        '</p>' 
      );
    }
    

    slider.push($('#slider_' + conf.title.replace(' ','_') + i));
  });  
  
  //set slider color
  $('.ui-slider-range').css({"background" : conf.color, "opacity" : 0.8});  
  
  return slider;
}

module.exports = sliders;
