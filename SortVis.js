    
   

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
  
  dataset = randomArray(size);
  bufferDataset =  dataset.slice(0);
  width = w * 0.99;
  height = h * 0.99;
  duration = du;
  mainColor = mColor;
  sortingLog = bubbleSort(comp);
  
  d3.select("#chart")
            .append("svg")
            .attr("id", "barChart")
            .attr("width", width)
            .attr("height", height)
            .selectAll("*").remove();
  
  scale = d3.scale.linear()
            .domain([0, 1])
            .range([0, height]);
  
  drawBarChart();
  
var updateBarChart = updateBarChart(mainColor, mainColor);
var indexedBarChart = updateBarChart(iColor, jColor);
var trueBarChart = updateBarChart(trueColor, trueColor);
var falseBarChart = updateBarChart(falseColor, falseColor);
  
  indexedBarChart(4, 2, null);
 // reLoop(sortingLog);  
  
  obj.sortingAnimation = function(){
//    delayFor(du, sortingLog, function(d, callback){
//      obj.indexedBarChart(d.i, d.j, function(){
//        if(d.result)
//        {
//          drawSwap(d.i, d.j, callback);
//        }
//      })
//    });
    var delayCounter = 0;
    sortingLog.forEach(function(d, i){
      obj.indexedBarChart(d.i, d.j, delayCounter++);
      if(d.result){
        //obj.trueBarChart(d.i, d.j, delayCounter++);
        obj.drawSwap(d.i, d.j, delayCounter);
      }
    });
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

    .attr("y", function(d) {
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

function updateBarChart(firstColor, secondColor){  
  return function(a, b, callback){
    d3.select("#barChart").selectAll("rect")
      .transition()
     // .delay(duration * i)
      .duration(duration)
      .attr("x", function(d, i) {
          return i * (width / dataset.length);
      })
      .attr("y", function(d) {
          return height - scale(d);
      })				   
      .attr("width", (width / dataset.length)*0.9 )
      .attr("height", function(d) {
          return scale(d);
      })
      .attr("fill", function(d,i) {
        if(i == a)
          return firstColor;
        else if(i == b)
          return secondColor;
        else 
          return mainColor;
      }).each("end", function(){console.log("test")});
  }
}



function drawSwap(a, b, callback){
  var buffer = dataset[a];
  dataset[a] = dataset[b];
  dataset[b] = buffer;
  
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
          drawBarChart();
          callback();
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

function bubbleSort(compare){
  var sLog = [];
  
  for(var i = 0; i < dataset.length; i++)
    for(var j = 0; j < dataset.length; j++)
    {
      var entry = {
        i : i,
        j : j,
        result : true
      };
      
      if(compare(dataset[i],dataset[j]))
        swap(i, j);
      else entry.result = false;
        
      sLog.push(entry);
    }
  
  dataset = bufferDataset;
  
  return sLog;
}

//function bubbleSort(compare){
//  var sLog = [];
//  
//  for(var i = 0; i < dataset.length; i++)
//    for(var j = 0; j < dataset.length; j++)
//    { 
//      sLog.push(function(cb){indexedBarChart(i, j, cb)});
//      if(compare(dataset[i],dataset[j]))
//      {
//        sLog.push(function(cb){falseBarChart(i, j, cb)});
//        sLog.push(function(){drawSwap(i, j)});
//        swap(i, j);
//      }
//      else sLog.push(function(cb){trueBarChart(i, j, cb)});
//        
//      //sLog.push(entry);
//    }
//  
//  dataset = bufferDataset;
//  
//  return sLog;
//}

function swap(a, b){
  var buffer = dataset[a];
  dataset[a] = dataset[b];
  dataset[b] = buffer;
}

function reLoop(fLog){
  fLog.shift()(function(){
    if(fLog.length > 0);
      reLoop(fLog);
  });
}

function delayFor(duration, data, callback){
  callback(data.shift(), function (){
    if (data.length > 0)
      setTimeout(function(){delayFor(duration, data, callback)}, duration)
  }); 
}
  
  return obj;
}

module.exports = SortVis;
	