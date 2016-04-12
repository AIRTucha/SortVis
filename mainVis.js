(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
       sLog.push(wraper(i, j, function(a, b, cb){indexedBarChart(a, b, cb)}));
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
 
  dataset = randomArray(size);
  bufferDataset =  dataset.slice(0);
  width = w * 0.99;
  height = h * 0.99;
  duration = du;
  mainColor = mColor;
  sortingLog = bubbleSort(comp);
  
//  sortingLog.push(wraper(dataset, function(data, cb){drawSwap(3, 4, data, cb)}));
//  sortingLog.push(wraper(dataset, function(data, cb){drawSwap(5, 6, data, cb)}));
  
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
  
  
  
  drawBarChart(function(){});
  
  
  reLoop(sortingLog);
  return obj;
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

function updateBarChart(firstColor, secondColor){  
  return function(a, b, callback){
    d3.select("#barChart").selectAll("rect")
      .data(dataset)
      .transition()
      .duration(duration)
      .attr("fill", function(d,i) {
        if(i == a)
          return firstColor;
        else if(i == b)
          return secondColor;
        else 
          return mainColor;
      }).each("end", function(d, i, a){
        if(i == dataset.length-1) {
          callback();
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
          callback();
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
    return callback(i, j, cb)
  };
}

module.exports = SortVis;
	
},{}],2:[function(require,module,exports){
var SortVis = require('./SortVis');

(function(namespace) {window.onload = function(){
  var s = new SortVis(1000, 
                      function(a, b) {return a > b;},
                      window.innerWidth, 
                      window.innerHeight, 
                      0,
                      "#AA0077", 
                      "#DD00AA", 
                      "#00BB00", 
                      "#BB0000", 
                      "#AAAAAA")

//  
//  setTimeout(function(){s.moveTo(7, 4);}, 1000);
//  setTimeout(function(){s.indexedBarChart(3,4);}, 2000);
}

//namespace.usctVis = usctVis;
})(window);
},{"./SortVis":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIlNvcnRWaXMuanMiLCJidWJibGVTb3J0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiXG52YXIgZGF0YXNldDtcbnZhciBidWZmZXJEYXRhc2V0O1xudmFyIHNvcnRpbmdMb2c7XG52YXIgd2lkdGg7XG52YXIgaGVpZ2h0O1xudmFyIHNjYWxlO1xudmFyIGR1cmF0aW9uO1xuXG52YXIgbWFpbkNvbG9yID0gXCIjQUFBQUFBXCI7XG5cbmZ1bmN0aW9uIFNvcnRWaXMoc2l6ZSwgY29tcCwgdywgaCwgZHUsIGlDb2xvciwgakNvbG9yLCB0cnVlQ29sb3IsIGZhbHNlQ29sb3IsIG1Db2xvcil7XG4gIHZhciBvYmogPSB7fTtcbiAgXG4gIHZhciBpbmRleGVkQmFyQ2hhcnQgPSB1cGRhdGVCYXJDaGFydChpQ29sb3IsIGpDb2xvcik7XG4gIHZhciB0cnVlQmFyQ2hhcnQgPSB1cGRhdGVCYXJDaGFydCh0cnVlQ29sb3IsIHRydWVDb2xvcik7XG4gIHZhciBmYWxzZUJhckNoYXJ0ID0gdXBkYXRlQmFyQ2hhcnQoZmFsc2VDb2xvciwgZmFsc2VDb2xvcik7XG4gIHZhciBidWJibGVTb3J0ID0gZnVuY3Rpb24oY29tcGFyZSl7XG4gICAgdmFyIHNMb2cgPSBbXTtcblxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBkYXRhc2V0Lmxlbmd0aDsgaSsrKVxuICAgICAgZm9yKHZhciBqID0gMDsgaiA8IGRhdGFzZXQubGVuZ3RoOyBqKyspXG4gICAgICB7IFxuICAgICAgIHNMb2cucHVzaCh3cmFwZXIoaSwgaiwgZnVuY3Rpb24oYSwgYiwgY2Ipe2luZGV4ZWRCYXJDaGFydChhLCBiLCBjYil9KSk7XG4gICAgICAgIGlmKGNvbXBhcmUoZGF0YXNldFtpXSxkYXRhc2V0W2pdKSlcbiAgICAgICAge1xuICAgICAgICAgIC8vc0xvZy5wdXNoKHdyYXBlcihkYXRhc2V0LCBpLCBqLCBmdW5jdGlvbihkYXRhLCBhLCBiLCBjYil7ZmFsc2VCYXJDaGFydChhLCBiLCBkYXRhLCBjYil9KSk7XG4gICAgICAgICAgc0xvZy5wdXNoKHdyYXBlcihpLCBqLCBmdW5jdGlvbihhLCBiLCBjYil7ZHJhd1N3YXAoYSwgYiwgY2IpfSkpO1xuICAgICAgICAgIHN3YXAoaSwgaik7XG4gICAgICAgIH1cbiAgICAgICAvLyBlbHNlICBzTG9nLnB1c2god3JhcGVyKGRhdGFzZXQsIGksIGosIGZ1bmN0aW9uKGRhdGEsIGEsIGIsIGNiKXt0cnVlQmFyQ2hhcnQoYSwgYiwgZGF0YSwgY2IpfSkpO1xuICAgICAgfVxuICAgIFxuICAgIHNMb2cucHVzaCh3cmFwZXIoaSwgaiwgZnVuY3Rpb24oYSwgYiwgY2Ipe3VwZGF0ZUJhckNoYXJ0KG1haW5Db2xvciwgbWFpbkNvbG9yKShhLCBiLCBjYil9KSk7XG4gICAgXG4gICAgZGF0YXNldCA9IGJ1ZmZlckRhdGFzZXQ7XG5cbiAgICByZXR1cm4gc0xvZztcbiAgfVxuIFxuICBkYXRhc2V0ID0gcmFuZG9tQXJyYXkoc2l6ZSk7XG4gIGJ1ZmZlckRhdGFzZXQgPSAgZGF0YXNldC5zbGljZSgwKTtcbiAgd2lkdGggPSB3ICogMC45OTtcbiAgaGVpZ2h0ID0gaCAqIDAuOTk7XG4gIGR1cmF0aW9uID0gZHU7XG4gIG1haW5Db2xvciA9IG1Db2xvcjtcbiAgc29ydGluZ0xvZyA9IGJ1YmJsZVNvcnQoY29tcCk7XG4gIFxuLy8gIHNvcnRpbmdMb2cucHVzaCh3cmFwZXIoZGF0YXNldCwgZnVuY3Rpb24oZGF0YSwgY2Ipe2RyYXdTd2FwKDMsIDQsIGRhdGEsIGNiKX0pKTtcbi8vICBzb3J0aW5nTG9nLnB1c2god3JhcGVyKGRhdGFzZXQsIGZ1bmN0aW9uKGRhdGEsIGNiKXtkcmF3U3dhcCg1LCA2LCBkYXRhLCBjYil9KSk7XG4gIFxuICBkMy5zZWxlY3QoXCIjY2hhcnRcIilcbiAgICAgICAgICAgIC5hcHBlbmQoXCJzdmdcIilcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJiYXJDaGFydFwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aClcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodClcbiAgICAgICAgICAgIC5zZWxlY3RBbGwoXCIqXCIpLnJlbW92ZSgpO1xuICBcbiAgc2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuICAgICAgICAgICAgLmRvbWFpbihbMCwgMV0pXG4gICAgICAgICAgICAucmFuZ2UoWzAsIGhlaWdodF0pO1xuICBcbiAgb2JqLnNvcnRpbmdBbmltYXRpb24gPSBmdW5jdGlvbigpe3JlTG9vcChzb3J0aW5nTG9nKX07XG4gIFxuICBcbiAgXG4gIGRyYXdCYXJDaGFydChmdW5jdGlvbigpe30pO1xuICBcbiAgXG4gIHJlTG9vcChzb3J0aW5nTG9nKTtcbiAgcmV0dXJuIG9iajtcbn1cblxuZnVuY3Rpb24gcmFuZG9tQXJyYXkoc2l6ZU9mQXJyYXkpe1xuICB2YXIgYSA9IFtdO1xuICBcbiAgZm9yKHZhciBpID0gMDsgaSA8IHNpemVPZkFycmF5OyBpKyspXG4gICAgYS5wdXNoKE1hdGgucmFuZG9tKCklMTAwKTtcbiAgXG4gIHJldHVybiBhO1xufVxuICAgICAgICAgIFxuZnVuY3Rpb24gZHJhd0JhckNoYXJ0KCl7XG4gIGQzLnNlbGVjdChcIiNiYXJDaGFydFwiKS5zZWxlY3RBbGwoXCJyZWN0XCIpLnJlbW92ZSgpO1xuICBcbiAgZDMuc2VsZWN0KFwiI2JhckNoYXJ0XCIpLnNlbGVjdEFsbChcInJlY3RcIilcbiAgICAuZGF0YShkYXRhc2V0KVxuICAgIC5lbnRlcigpXG4gICAgLmFwcGVuZChcInJlY3RcIilcbiAgICAuYXR0cihcImlkXCIsXCJlbGVtZW50XCIpXG4gICAgLmF0dHIoXCJ4XCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgcmV0dXJuIGkgKiAod2lkdGggLyBkYXRhc2V0Lmxlbmd0aCk7XG4gICAgfSlcblxuICAgIC5hdHRyKFwieVwiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiBoZWlnaHQgLSBzY2FsZShkKTtcbiAgICB9KVx0XHRcdFx0ICAgXG4gICAgLmF0dHIoXCJ3aWR0aFwiLCAod2lkdGggLyBkYXRhc2V0Lmxlbmd0aCkqMC45IClcbiAgICAuYXR0cihcImhlaWdodFwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgIHJldHVybiBzY2FsZShkKTtcbiAgICB9KVxuICAgIC5hdHRyKFwiZmlsbFwiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiBtYWluQ29sb3I7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUJhckNoYXJ0KGZpcnN0Q29sb3IsIHNlY29uZENvbG9yKXsgIFxuICByZXR1cm4gZnVuY3Rpb24oYSwgYiwgY2FsbGJhY2spe1xuICAgIGQzLnNlbGVjdChcIiNiYXJDaGFydFwiKS5zZWxlY3RBbGwoXCJyZWN0XCIpXG4gICAgICAuZGF0YShkYXRhc2V0KVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKGR1cmF0aW9uKVxuICAgICAgLmF0dHIoXCJmaWxsXCIsIGZ1bmN0aW9uKGQsaSkge1xuICAgICAgICBpZihpID09IGEpXG4gICAgICAgICAgcmV0dXJuIGZpcnN0Q29sb3I7XG4gICAgICAgIGVsc2UgaWYoaSA9PSBiKVxuICAgICAgICAgIHJldHVybiBzZWNvbmRDb2xvcjtcbiAgICAgICAgZWxzZSBcbiAgICAgICAgICByZXR1cm4gbWFpbkNvbG9yO1xuICAgICAgfSkuZWFjaChcImVuZFwiLCBmdW5jdGlvbihkLCBpLCBhKXtcbiAgICAgICAgaWYoaSA9PSBkYXRhc2V0Lmxlbmd0aC0xKSB7XG4gICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZHJhd1N3YXAoYSwgYiwgY2FsbGJhY2spe1xuICBzd2FwKGEsIGIpO1xuXG4gIGQzLnNlbGVjdChcIiNiYXJDaGFydFwiKS5zZWxlY3RBbGwoXCJyZWN0XCIpXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24oZHVyYXRpb24pXG4gICAgICAuYXR0cihcInhcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICBpZihpID09IGEpIFxuICAgICAgICAgIHJldHVybiBiICogKHdpZHRoIC8gZGF0YXNldC5sZW5ndGgpO1xuICAgICAgICBlbHNlIGlmKGkgPT0gYilcbiAgICAgICAgICByZXR1cm4gYSAqICh3aWR0aCAvIGRhdGFzZXQubGVuZ3RoKTtcbiAgICAgICAgZWxzZSBcbiAgICAgICAgICByZXR1cm4gaSAqICh3aWR0aCAvIGRhdGFzZXQubGVuZ3RoKTtcbiAgICAgIH0pXHRcdFx0ICAgXG4gICAgICAuZWFjaChcImVuZFwiLCBmdW5jdGlvbihkLCBpKXtcbiAgICAgICAgaWYoaSA9PSBkYXRhc2V0Lmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBkcmF3QmFyQ2hhcnQoKTtcbiAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbn1cblxuZnVuY3Rpb24gZHJhd01vdmVUbyhhLCBwb3Mpe1xuICAgIHZhciBidWZmRGF0YXNldCA9IFtdO1xuICAgIGQzLnNlbGVjdChcIiNiYXJDaGFydFwiKS5zZWxlY3RBbGwoXCJyZWN0XCIpXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24oZHVyYXRpb24pXG4gICAgICAuYXR0cihcInhcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICB2YXIgaUN1ciA9IGk7XG4gICAgICBcbiAgICAgICAgaWYoaSA9PSBhKSBcbiAgICAgICAgICBpQ3VyID0gcG9zIDtcbiAgICAgICAgZWxzZSBpZihpID4gYSAmJiBpIDw9IHBvcylcbiAgICAgICAgICBpQ3VyIC09IDE7XG4gICAgICAgIGVsc2UgaWYoaSA8IGEgJiYgaSA+PSBwb3MpXG4gICAgICAgICAgaUN1ciArPSAxO1xuICAgICAgICBcbiAgICAgICAgYnVmZkRhdGFzZXRbaUN1cl0gPSBkO1xuICAgICAgICByZXR1cm4gaUN1ciAqICh3aWR0aCAvIGRhdGFzZXQubGVuZ3RoKTtcbiAgICAgIH0pXG4gICAgICAuYXR0cihcInlcIiwgZnVuY3Rpb24oZCkge1xuICAgICAgICAgIHJldHVybiBoZWlnaHQgLSBzY2FsZShkKTtcbiAgICAgIH0pXHRcdFx0XHQgICBcbiAgICAgIC5hdHRyKFwid2lkdGhcIiwgKHdpZHRoIC8gZGF0YXNldC5sZW5ndGgpKjAuOSApXG4gICAgICAuYXR0cihcImhlaWdodFwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgcmV0dXJuIHNjYWxlKGQpO1xuICAgICAgfSlcbiAgICAgIC5hdHRyKFwiZmlsbFwiLCBmdW5jdGlvbihkLGkpIHtcbiAgICAgICAgICByZXR1cm4gbWFpbkNvbG9yO1xuICAgICAgfSkuZWFjaChcImVuZFwiLCBmdW5jdGlvbigpe1xuICAgICAgICBkYXRhc2V0ID0gYnVmZkRhdGFzZXQ7XG4gICAgICAgIGRyYXdCYXJDaGFydCgpO1xuICAgICAgfSk7XG59XG5cbmZ1bmN0aW9uIHN3YXAoYSwgYil7XG4gIHZhciBidWZmZXIgPSBkYXRhc2V0W2FdO1xuICBkYXRhc2V0W2FdID0gZGF0YXNldFtiXTtcbiAgZGF0YXNldFtiXSA9IGJ1ZmZlcjtcbn1cblxuZnVuY3Rpb24gcmVMb29wKGZMb2cpe1xuICBmTG9nLnNoaWZ0KCkoZnVuY3Rpb24oKXtcbiAgICBpZihmTG9nLmxlbmd0aCA+IDApXG4gICAgICByZUxvb3AoZkxvZyk7XG4gIH0pO1xufSBcblxuZnVuY3Rpb24gd3JhcGVyKGksIGosIGNhbGxiYWNrKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKGNiKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrKGksIGosIGNiKVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNvcnRWaXM7XG5cdCIsInZhciBTb3J0VmlzID0gcmVxdWlyZSgnLi9Tb3J0VmlzJyk7XG5cbihmdW5jdGlvbihuYW1lc3BhY2UpIHt3aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKXtcbiAgdmFyIHMgPSBuZXcgU29ydFZpcygxMDAwLCBcbiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihhLCBiKSB7cmV0dXJuIGEgPiBiO30sXG4gICAgICAgICAgICAgICAgICAgICAgd2luZG93LmlubmVyV2lkdGgsIFxuICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5pbm5lckhlaWdodCwgXG4gICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICBcIiNBQTAwNzdcIiwgXG4gICAgICAgICAgICAgICAgICAgICAgXCIjREQwMEFBXCIsIFxuICAgICAgICAgICAgICAgICAgICAgIFwiIzAwQkIwMFwiLCBcbiAgICAgICAgICAgICAgICAgICAgICBcIiNCQjAwMDBcIiwgXG4gICAgICAgICAgICAgICAgICAgICAgXCIjQUFBQUFBXCIpXG5cbi8vICBcbi8vICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7cy5tb3ZlVG8oNywgNCk7fSwgMTAwMCk7XG4vLyAgc2V0VGltZW91dChmdW5jdGlvbigpe3MuaW5kZXhlZEJhckNoYXJ0KDMsNCk7fSwgMjAwMCk7XG59XG5cbi8vbmFtZXNwYWNlLnVzY3RWaXMgPSB1c2N0VmlzO1xufSkod2luZG93KTsiXX0=
