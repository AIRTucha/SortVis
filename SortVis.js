"use strict"
var dataset;
var bufferDataset;
var sortingLog;
var width;
var height;
var scale;
var duration;

var mainColor = "#AAAAAA";

function SortVis(size, comp, w, h, du, iColor, jColor, trueColor, falseColor, mColor){
  var obj = {};
  
  var indexedBarChart = updateBarChart(iColor, jColor);
  var trueBarChart = updateBarChart(trueColor, trueColor);
  var falseBarChart = updateBarChart(falseColor, falseColor);
  var sorting = bubbleSort(updateBarChart(iColor, jColor))
 
  dataset = randomArray(size);
  bufferDataset =  dataset.slice(0);
  width = w * 0.99;
  height = h * 0.99;
  duration = du;
  mainColor = mColor;
  sortingLog = sorting(comp);
  
  d3.select("#chart")
            .append("svg")
            .attr("id", "barChart")
            .attr("width", width)
            .attr("height", height)
            .selectAll("*").remove();
  
  scale = d3.scale.linear()
            .domain([0, 1])
            .range([0, height]);
  
  obj.sortingAnimation = function(){reLoop(sortingLog)};
  
  obj.call = function(i){
    sortingLog[i](function(a, b){drawBarChart(a, b);});
  }
  obj.setD = function(i){
    var d = duration;
    
    duration = i;
    
    return d;
  
  }
  obj.logSize = sortingLog.length;
  
  drawBarChart(function(){});
  
  return obj;
}

function bubbleSort(drawChart){
  return function(compare){
    var sLog = [];

    for(var i = 0; i < dataset.length; i++)
      for(var j = i; j < dataset.length; j++)
      { 
       sLog.push(wraper(i, j, function(a, b, cb){drawChart(a, b, cb)}));
        if(compare(dataset[i],dataset[j]))
        {
          //sLog.push(wraper(dataset, i, j, function(data, a, b, cb){falseBarChart(a, b, data, cb)}));
          sLog.push(wraper(i, j, function(a, b, cb){drawSwap(a, b, cb)}));
          swap(i, j);
        }
       // else  sLog.push(wraper(dataset, i, j, function(data, a, b, cb){trueBarChart(a, b, data, cb)}));
      }
    
    sLog.push(wraper(i, j, function(a, b, cb){updateBarChart(mainColor, mainColor)(a, b, cb)}));
    
    dataset = bufferDataset;

    return sLog;
  }
}

function randomArray(sizeOfArray){
  var a = [];
  
  for(var i = 0; i < sizeOfArray; i++)
    a.push(Math.random()%100);
  
  return a;
}
          
function drawBarChart(){
  d3.select("#barChart").selectAll("rect").remove();
  
  d3.select("#barChart").selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("id","element")
    .attr("x", function(d, i) {
        return i * (width / dataset.length);
    })
    .attr("y", function(d, i) {
        return height - scale(d);
    })				   
    .attr("width", (width / dataset.length)*0.9 )
    .attr("height", function(d) {
        return scale(d);
    })
    .attr("fill", function(d, i) {
        return mainColor;
    });
}

function drawBarChart(a, b){
  d3.select("#barChart").selectAll("rect").remove();
  
  d3.select("#barChart").selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("id","element")
    .attr("x", function(d, i) {
        return i * (width / dataset.length);
    })
    .attr("y", function(d, i) {
        return height - scale(d);
    })				   
    .attr("width", (width / dataset.length)*0.9 )
    .attr("height", function(d) {
        return scale(d);
    })
    .attr("fill", function(d, i) {
        if(i == a)
          return  "#AA0077";
        else if(i == b)
          return "#DD00AA";
        else 
          return mainColor;
      });
}

function updateBarChart(firstColor, secondColor){  
  return function(a, b, callback){
    d3.select("#barChart").selectAll("rect")
      .data(dataset)
      .transition()
      .duration(duration)
      .attr("fill", function(d, i) {
        if(i == a)
          return firstColor;
        else if(i == b)
          return secondColor;
        else 
          return mainColor;
      }).each("end", function(d, i){
        if(i == dataset.length-1) {
          try{
            callback(a, b);
          }catch(e){};
        }
      });
  }
}

function drawSwap(a, b, callback){
  swap(a, b);

  d3.select("#barChart").selectAll("rect")
      .transition()
      .duration(duration)
      .attr("x", function(d, i) {
        if(i == a) 
          return b * (width / dataset.length);
        else if(i == b)
          return a * (width / dataset.length);
        else 
          return i * (width / dataset.length);
      })			   
      .each("end", function(d, i){
        if(i == dataset.length - 1) {
          drawBarChart();
          callback(a, b);
        }
      });
}

function drawMoveTo(a, pos){
    var buffDataset = [];
    d3.select("#barChart").selectAll("rect")
      .transition()
      .duration(duration)
      .attr("x", function(d, i) {
        var iCur = i;
      
        if(i == a) 
          iCur = pos ;
        else if(i > a && i <= pos)
          iCur -= 1;
        else if(i < a && i >= pos)
          iCur += 1;
        
        buffDataset[iCur] = d;
        return iCur * (width / dataset.length);
      })
      .attr("y", function(d) {
          return height - scale(d);
      })				   
      .attr("width", (width / dataset.length)*0.9 )
      .attr("height", function(d) {
          return scale(d);
      })
      .attr("fill", function(d,i) {
          return mainColor;
      }).each("end", function(){
        dataset = buffDataset;
        drawBarChart();
      });
}

function swap(a, b){
  var buffer = dataset[a];
  
  dataset[a] = dataset[b];
  dataset[b] = buffer;
}

function reLoop(fLog){
  fLog.shift()(function(){
    if(fLog.length > 0)
      reLoop(fLog);
  });
} 

function wraper(i, j, callback){
  return function(cb) {
    return callback(i, j, cb);
  };
}

module.exports = SortVis;
	