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
  var bubbleSort = function(compare){
    var sLog = [];

    for(var i = 0; i < dataset.length; i++)
      for(var j = 0; j < dataset.length; j++)
      { 
       // sLog.push(wraper(dataset, function(data, cb){indexedBarChart(i, j, data, cb)}));
        if(compare(dataset[i],dataset[j]))
        {
        //  sLog.push(wraper(dataset, function(data, cb){falseBarChart(i, j, data, cb)}));
          sLog.push(wraper(dataset, function(data, cb){drawSwap(i, j, data, cb)}));
          swap(i, j);
        }
     //   else  sLog.push(wraper(dataset, function(data, cb){trueBarChart(i, j, data, cb)}));
      }

    dataset = bufferDataset;

    return sLog;
  }
 
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
  
  obj.sortingAnimation = function(){reLoop(sortingLog)};
  
  drawBarChart(dataset, function(){});
  
//  trueBarChart(3, 5, dataset, function(){
//      drawSwap(3, 5, dataset, function(){
//         falseBarChart(3, 5, dataset, function(){
//            drawSwap(5, 3, dataset, function(){
//              drawSwap(3, 4, dataset, function(){
//                 falseBarChart(3, 5, dataset, function(){
//                    drawSwap(2, 3, dataset, function(){
//
//                    });
//                });
//              });
//            });
//        });
//      });
//  });
  return obj;
}

function randomArray(sizeOfArray){
  var a = [];
  
  for(var i = 0; i < sizeOfArray; i++)
    a.push(Math.random()%100);
  
  return a;
}
          
function drawBarChart(data, callback){
  d3.select("#barChart").selectAll("rect").remove();
  
  d3.select("#barChart").selectAll("rect")
    .data(data)
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
  
    callback();
}


function updateBarChart(firstColor, secondColor){  
  return function(a, b, data, callback){
    d3.select("#barChart").selectAll("rect")
      .data(data)
      .transition()
      .duration(duration)
      .attr("fill", function(d,i) {
        if(i == a)
          return firstColor;
        else if(i == b)
          return secondColor;
        else 
          return mainColor;
      }).each("end", function(d, i ){
        if(i == data.length-1) {
          callback();
          console.log("up");
        }
      });
  }
}

function drawSwap(a, b, data, callback){
  var buffer = data[a];
  data[a] = data[b];
  data[b] = buffer;
  
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
        if(i == data.length - 2) {
          drawBarChart(data, function(){
              callback();
              console.log("swap");
          });
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

function wraper(item, callback){
  var local = item;
  
  return function(cb) {
    return callback(local, cb)
  };
}

module.exports = SortVis;
	