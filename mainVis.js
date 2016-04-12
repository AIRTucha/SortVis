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
  
//var updateBarChart = updateBarChart(mainColor, mainColor);
var indexedBarChart = updateBarChart(iColor, jColor);
var trueBarChart = updateBarChart(trueColor, trueColor);
var falseBarChart = updateBarChart(falseColor, falseColor);
  
  updateBarChart(mainColor, mainColor)(4, 2, 5);
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
      indexedBarChart(d.i, d.j, delayCounter++);
      if(d.result){
        trueBarChart(d.i, d.j, delayCounter++);
        drawSwap(d.i, d.j, delayCounter++);
      }
    });
  }
  
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
  return function(a, b, i){
    d3.select("#barChart").selectAll("rect")
      .transition()
      .delay(duration * i)
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
      });//.each("end", function(){callback()});
  }
}

function drawSwap(a, b, i){
  var buffer = dataset[a];
  dataset[a] = dataset[b];
  dataset[b] = buffer;
  
  d3.select("#barChart").selectAll("rect")
      .transition()
      .delay(duration * i)
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
        //  callback();
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
  


module.exports = SortVis;
	
},{}],2:[function(require,module,exports){
var SortVis = require('./SortVis');

(function(namespace) {window.onload = function(){
  var s = new SortVis(10, 
                      function(a, b) {return a > b;},
                      window.innerWidth, 
                      window.innerHeight, 
                      500,
                      "#AA0077", 
                      "#DD00AA", 
                      "#00BB00", 
                      "#BB0000", 
                      "#AAAAAA")
  
  s.sortingAnimation();
//  
//  setTimeout(function(){s.moveTo(7, 4);}, 1000);
//  setTimeout(function(){s.indexedBarChart(3,4);}, 2000);
}

//namespace.usctVis = usctVis;
})(window);
},{"./SortVis":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIlNvcnRWaXMuanMiLCJidWJibGVTb3J0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIlxudmFyIGRhdGFzZXQ7XG52YXIgYnVmZmVyRGF0YXNldDtcbnZhciBzb3J0aW5nTG9nO1xudmFyIHdpZHRoO1xudmFyIGhlaWdodDtcbnZhciBzY2FsZTtcbnZhciBkdXJhdGlvbjtcblxudmFyIG1haW5Db2xvciA9IFwiI0FBQUFBQVwiO1xuXG5mdW5jdGlvbiBTb3J0VmlzKHNpemUsIGNvbXAsIHcsIGgsIGR1LCBpQ29sb3IsIGpDb2xvciwgdHJ1ZUNvbG9yLCBmYWxzZUNvbG9yLCBtQ29sb3Ipe1xuICB2YXIgb2JqID0ge307XG4gIFxuICBkYXRhc2V0ID0gcmFuZG9tQXJyYXkoc2l6ZSk7XG4gIGJ1ZmZlckRhdGFzZXQgPSAgZGF0YXNldC5zbGljZSgwKTtcbiAgd2lkdGggPSB3ICogMC45OTtcbiAgaGVpZ2h0ID0gaCAqIDAuOTk7XG4gIGR1cmF0aW9uID0gZHU7XG4gIG1haW5Db2xvciA9IG1Db2xvcjtcbiAgc29ydGluZ0xvZyA9IGJ1YmJsZVNvcnQoY29tcCk7XG4gIFxuICBkMy5zZWxlY3QoXCIjY2hhcnRcIilcbiAgICAgICAgICAgIC5hcHBlbmQoXCJzdmdcIilcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJiYXJDaGFydFwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aClcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodClcbiAgICAgICAgICAgIC5zZWxlY3RBbGwoXCIqXCIpLnJlbW92ZSgpO1xuICBcbiAgc2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuICAgICAgICAgICAgLmRvbWFpbihbMCwgMV0pXG4gICAgICAgICAgICAucmFuZ2UoWzAsIGhlaWdodF0pO1xuICBcbiAgZHJhd0JhckNoYXJ0KCk7XG4gIFxuLy92YXIgdXBkYXRlQmFyQ2hhcnQgPSB1cGRhdGVCYXJDaGFydChtYWluQ29sb3IsIG1haW5Db2xvcik7XG52YXIgaW5kZXhlZEJhckNoYXJ0ID0gdXBkYXRlQmFyQ2hhcnQoaUNvbG9yLCBqQ29sb3IpO1xudmFyIHRydWVCYXJDaGFydCA9IHVwZGF0ZUJhckNoYXJ0KHRydWVDb2xvciwgdHJ1ZUNvbG9yKTtcbnZhciBmYWxzZUJhckNoYXJ0ID0gdXBkYXRlQmFyQ2hhcnQoZmFsc2VDb2xvciwgZmFsc2VDb2xvcik7XG4gIFxuICB1cGRhdGVCYXJDaGFydChtYWluQ29sb3IsIG1haW5Db2xvcikoNCwgMiwgNSk7XG4gLy8gcmVMb29wKHNvcnRpbmdMb2cpOyAgXG4gIFxuICBvYmouc29ydGluZ0FuaW1hdGlvbiA9IGZ1bmN0aW9uKCl7XG4vLyAgICBkZWxheUZvcihkdSwgc29ydGluZ0xvZywgZnVuY3Rpb24oZCwgY2FsbGJhY2spe1xuLy8gICAgICBvYmouaW5kZXhlZEJhckNoYXJ0KGQuaSwgZC5qLCBmdW5jdGlvbigpe1xuLy8gICAgICAgIGlmKGQucmVzdWx0KVxuLy8gICAgICAgIHtcbi8vICAgICAgICAgIGRyYXdTd2FwKGQuaSwgZC5qLCBjYWxsYmFjayk7XG4vLyAgICAgICAgfVxuLy8gICAgICB9KVxuLy8gICAgfSk7XG4gICAgdmFyIGRlbGF5Q291bnRlciA9IDA7XG4gICAgc29ydGluZ0xvZy5mb3JFYWNoKGZ1bmN0aW9uKGQsIGkpe1xuICAgICAgaW5kZXhlZEJhckNoYXJ0KGQuaSwgZC5qLCBkZWxheUNvdW50ZXIrKyk7XG4gICAgICBpZihkLnJlc3VsdCl7XG4gICAgICAgIHRydWVCYXJDaGFydChkLmksIGQuaiwgZGVsYXlDb3VudGVyKyspO1xuICAgICAgICBkcmF3U3dhcChkLmksIGQuaiwgZGVsYXlDb3VudGVyKyspO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIFxuICByZXR1cm4gb2JqO1xufVxuXG5mdW5jdGlvbiByYW5kb21BcnJheShzaXplT2ZBcnJheSl7XG4gIHZhciBhID0gW107XG4gIFxuICBmb3IodmFyIGkgPSAwOyBpIDwgc2l6ZU9mQXJyYXk7IGkrKylcbiAgICBhLnB1c2goTWF0aC5yYW5kb20oKSUxMDApO1xuICBcbiAgcmV0dXJuIGE7XG59XG4gICAgICAgICAgXG5mdW5jdGlvbiBkcmF3QmFyQ2hhcnQoKXtcbiAgZDMuc2VsZWN0KFwiI2JhckNoYXJ0XCIpLnNlbGVjdEFsbChcInJlY3RcIikucmVtb3ZlKCk7XG4gIFxuICBkMy5zZWxlY3QoXCIjYmFyQ2hhcnRcIikuc2VsZWN0QWxsKFwicmVjdFwiKVxuICAgIC5kYXRhKGRhdGFzZXQpXG4gICAgLmVudGVyKClcbiAgICAuYXBwZW5kKFwicmVjdFwiKVxuICAgIC5hdHRyKFwiaWRcIixcImVsZW1lbnRcIilcbiAgICAuYXR0cihcInhcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICByZXR1cm4gaSAqICh3aWR0aCAvIGRhdGFzZXQubGVuZ3RoKTtcbiAgICB9KVxuXG4gICAgLmF0dHIoXCJ5XCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgcmV0dXJuIGhlaWdodCAtIHNjYWxlKGQpO1xuICAgIH0pXHRcdFx0XHQgICBcbiAgICAuYXR0cihcIndpZHRoXCIsICh3aWR0aCAvIGRhdGFzZXQubGVuZ3RoKSowLjkgKVxuICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgcmV0dXJuIHNjYWxlKGQpO1xuICAgIH0pXG4gICAgLmF0dHIoXCJmaWxsXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgcmV0dXJuIG1haW5Db2xvcjtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQmFyQ2hhcnQoZmlyc3RDb2xvciwgc2Vjb25kQ29sb3IpeyAgXG4gIHJldHVybiBmdW5jdGlvbihhLCBiLCBpKXtcbiAgICBkMy5zZWxlY3QoXCIjYmFyQ2hhcnRcIikuc2VsZWN0QWxsKFwicmVjdFwiKVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmRlbGF5KGR1cmF0aW9uICogaSlcbiAgICAgIC5kdXJhdGlvbihkdXJhdGlvbilcbiAgICAgIC5hdHRyKFwieFwiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgICAgcmV0dXJuIGkgKiAod2lkdGggLyBkYXRhc2V0Lmxlbmd0aCk7XG4gICAgICB9KVxuICAgICAgLmF0dHIoXCJ5XCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICByZXR1cm4gaGVpZ2h0IC0gc2NhbGUoZCk7XG4gICAgICB9KVx0XHRcdFx0ICAgXG4gICAgICAuYXR0cihcIndpZHRoXCIsICh3aWR0aCAvIGRhdGFzZXQubGVuZ3RoKSowLjkgKVxuICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgZnVuY3Rpb24oZCkge1xuICAgICAgICAgIHJldHVybiBzY2FsZShkKTtcbiAgICAgIH0pXG4gICAgICAuYXR0cihcImZpbGxcIiwgZnVuY3Rpb24oZCxpKSB7XG4gICAgICAgIGlmKGkgPT0gYSlcbiAgICAgICAgICByZXR1cm4gZmlyc3RDb2xvcjtcbiAgICAgICAgZWxzZSBpZihpID09IGIpXG4gICAgICAgICAgcmV0dXJuIHNlY29uZENvbG9yO1xuICAgICAgICBlbHNlIFxuICAgICAgICAgIHJldHVybiBtYWluQ29sb3I7XG4gICAgICB9KTsvLy5lYWNoKFwiZW5kXCIsIGZ1bmN0aW9uKCl7Y2FsbGJhY2soKX0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRyYXdTd2FwKGEsIGIsIGkpe1xuICB2YXIgYnVmZmVyID0gZGF0YXNldFthXTtcbiAgZGF0YXNldFthXSA9IGRhdGFzZXRbYl07XG4gIGRhdGFzZXRbYl0gPSBidWZmZXI7XG4gIFxuICBkMy5zZWxlY3QoXCIjYmFyQ2hhcnRcIikuc2VsZWN0QWxsKFwicmVjdFwiKVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmRlbGF5KGR1cmF0aW9uICogaSlcbiAgICAgIC5kdXJhdGlvbihkdXJhdGlvbilcbiAgICAgIC5hdHRyKFwieFwiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIGlmKGkgPT0gYSkgXG4gICAgICAgICAgcmV0dXJuIGIgKiAod2lkdGggLyBkYXRhc2V0Lmxlbmd0aCk7XG4gICAgICAgIGVsc2UgaWYoaSA9PSBiKVxuICAgICAgICAgIHJldHVybiBhICogKHdpZHRoIC8gZGF0YXNldC5sZW5ndGgpO1xuICAgICAgICBlbHNlIFxuICAgICAgICAgIHJldHVybiBpICogKHdpZHRoIC8gZGF0YXNldC5sZW5ndGgpO1xuICAgICAgfSlcbiAgICAgIC5hdHRyKFwieVwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgcmV0dXJuIGhlaWdodCAtIHNjYWxlKGQpO1xuICAgICAgfSlcdFx0XHRcdCAgIFxuICAgICAgLmF0dHIoXCJ3aWR0aFwiLCAod2lkdGggLyBkYXRhc2V0Lmxlbmd0aCkqMC45IClcbiAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICByZXR1cm4gc2NhbGUoZCk7XG4gICAgICB9KVxuICAgICAgLmF0dHIoXCJmaWxsXCIsIGZ1bmN0aW9uKGQsaSkge1xuICAgICAgICAgIHJldHVybiBtYWluQ29sb3I7XG4gICAgICB9KS5lYWNoKFwiZW5kXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgZHJhd0JhckNoYXJ0KCk7XG4gICAgICAgIC8vICBjYWxsYmFjaygpO1xuICAgICAgfSk7XG59XG5cbmZ1bmN0aW9uIGRyYXdNb3ZlVG8oYSwgcG9zKXtcbiAgICB2YXIgYnVmZkRhdGFzZXQgPSBbXTtcbiAgICBkMy5zZWxlY3QoXCIjYmFyQ2hhcnRcIikuc2VsZWN0QWxsKFwicmVjdFwiKVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKGR1cmF0aW9uKVxuICAgICAgLmF0dHIoXCJ4XCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgdmFyIGlDdXIgPSBpO1xuICAgICAgXG4gICAgICAgIGlmKGkgPT0gYSkgXG4gICAgICAgICAgaUN1ciA9IHBvcyA7XG4gICAgICAgIGVsc2UgaWYoaSA+IGEgJiYgaSA8PSBwb3MpXG4gICAgICAgICAgaUN1ciAtPSAxO1xuICAgICAgICBlbHNlIGlmKGkgPCBhICYmIGkgPj0gcG9zKVxuICAgICAgICAgIGlDdXIgKz0gMTtcbiAgICAgICAgXG4gICAgICAgIGJ1ZmZEYXRhc2V0W2lDdXJdID0gZDtcbiAgICAgICAgcmV0dXJuIGlDdXIgKiAod2lkdGggLyBkYXRhc2V0Lmxlbmd0aCk7XG4gICAgICB9KVxuICAgICAgLmF0dHIoXCJ5XCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICByZXR1cm4gaGVpZ2h0IC0gc2NhbGUoZCk7XG4gICAgICB9KVx0XHRcdFx0ICAgXG4gICAgICAuYXR0cihcIndpZHRoXCIsICh3aWR0aCAvIGRhdGFzZXQubGVuZ3RoKSowLjkgKVxuICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgZnVuY3Rpb24oZCkge1xuICAgICAgICAgIHJldHVybiBzY2FsZShkKTtcbiAgICAgIH0pXG4gICAgICAuYXR0cihcImZpbGxcIiwgZnVuY3Rpb24oZCxpKSB7XG4gICAgICAgICAgcmV0dXJuIG1haW5Db2xvcjtcbiAgICAgIH0pLmVhY2goXCJlbmRcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgZGF0YXNldCA9IGJ1ZmZEYXRhc2V0O1xuICAgICAgICBkcmF3QmFyQ2hhcnQoKTtcbiAgICAgIH0pO1xufVxuXG5mdW5jdGlvbiBidWJibGVTb3J0KGNvbXBhcmUpe1xuICB2YXIgc0xvZyA9IFtdO1xuICBcbiAgZm9yKHZhciBpID0gMDsgaSA8IGRhdGFzZXQubGVuZ3RoOyBpKyspXG4gICAgZm9yKHZhciBqID0gMDsgaiA8IGRhdGFzZXQubGVuZ3RoOyBqKyspXG4gICAge1xuICAgICAgdmFyIGVudHJ5ID0ge1xuICAgICAgICBpIDogaSxcbiAgICAgICAgaiA6IGosXG4gICAgICAgIHJlc3VsdCA6IHRydWVcbiAgICAgIH07XG4gICAgICBcbiAgICAgIGlmKGNvbXBhcmUoZGF0YXNldFtpXSxkYXRhc2V0W2pdKSlcbiAgICAgICAgc3dhcChpLCBqKTtcbiAgICAgIGVsc2UgZW50cnkucmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIFxuICAgICAgc0xvZy5wdXNoKGVudHJ5KTtcbiAgICB9XG4gIFxuICBkYXRhc2V0ID0gYnVmZmVyRGF0YXNldDtcbiAgXG4gIHJldHVybiBzTG9nO1xufVxuXG4vL2Z1bmN0aW9uIGJ1YmJsZVNvcnQoY29tcGFyZSl7XG4vLyAgdmFyIHNMb2cgPSBbXTtcbi8vICBcbi8vICBmb3IodmFyIGkgPSAwOyBpIDwgZGF0YXNldC5sZW5ndGg7IGkrKylcbi8vICAgIGZvcih2YXIgaiA9IDA7IGogPCBkYXRhc2V0Lmxlbmd0aDsgaisrKVxuLy8gICAgeyBcbi8vICAgICAgc0xvZy5wdXNoKGZ1bmN0aW9uKGNiKXtpbmRleGVkQmFyQ2hhcnQoaSwgaiwgY2IpfSk7XG4vLyAgICAgIGlmKGNvbXBhcmUoZGF0YXNldFtpXSxkYXRhc2V0W2pdKSlcbi8vICAgICAge1xuLy8gICAgICAgIHNMb2cucHVzaChmdW5jdGlvbihjYil7ZmFsc2VCYXJDaGFydChpLCBqLCBjYil9KTtcbi8vICAgICAgICBzTG9nLnB1c2goZnVuY3Rpb24oKXtkcmF3U3dhcChpLCBqKX0pO1xuLy8gICAgICAgIHN3YXAoaSwgaik7XG4vLyAgICAgIH1cbi8vICAgICAgZWxzZSBzTG9nLnB1c2goZnVuY3Rpb24oY2Ipe3RydWVCYXJDaGFydChpLCBqLCBjYil9KTtcbi8vICAgICAgICBcbi8vICAgICAgLy9zTG9nLnB1c2goZW50cnkpO1xuLy8gICAgfVxuLy8gIFxuLy8gIGRhdGFzZXQgPSBidWZmZXJEYXRhc2V0O1xuLy8gIFxuLy8gIHJldHVybiBzTG9nO1xuLy99XG5cbmZ1bmN0aW9uIHN3YXAoYSwgYil7XG4gIHZhciBidWZmZXIgPSBkYXRhc2V0W2FdO1xuICBkYXRhc2V0W2FdID0gZGF0YXNldFtiXTtcbiAgZGF0YXNldFtiXSA9IGJ1ZmZlcjtcbn1cblxuZnVuY3Rpb24gcmVMb29wKGZMb2cpe1xuICBmTG9nLnNoaWZ0KCkoZnVuY3Rpb24oKXtcbiAgICBpZihmTG9nLmxlbmd0aCA+IDApO1xuICAgICAgcmVMb29wKGZMb2cpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZGVsYXlGb3IoZHVyYXRpb24sIGRhdGEsIGNhbGxiYWNrKXtcbiAgY2FsbGJhY2soZGF0YS5zaGlmdCgpLCBmdW5jdGlvbiAoKXtcbiAgICBpZiAoZGF0YS5sZW5ndGggPiAwKVxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe2RlbGF5Rm9yKGR1cmF0aW9uLCBkYXRhLCBjYWxsYmFjayl9LCBkdXJhdGlvbilcbiAgfSk7IFxufVxuICBcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFNvcnRWaXM7XG5cdCIsInZhciBTb3J0VmlzID0gcmVxdWlyZSgnLi9Tb3J0VmlzJyk7XG5cbihmdW5jdGlvbihuYW1lc3BhY2UpIHt3aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKXtcbiAgdmFyIHMgPSBuZXcgU29ydFZpcygxMCwgXG4gICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oYSwgYikge3JldHVybiBhID4gYjt9LFxuICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5pbm5lcldpZHRoLCBcbiAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuaW5uZXJIZWlnaHQsIFxuICAgICAgICAgICAgICAgICAgICAgIDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICBcIiNBQTAwNzdcIiwgXG4gICAgICAgICAgICAgICAgICAgICAgXCIjREQwMEFBXCIsIFxuICAgICAgICAgICAgICAgICAgICAgIFwiIzAwQkIwMFwiLCBcbiAgICAgICAgICAgICAgICAgICAgICBcIiNCQjAwMDBcIiwgXG4gICAgICAgICAgICAgICAgICAgICAgXCIjQUFBQUFBXCIpXG4gIFxuICBzLnNvcnRpbmdBbmltYXRpb24oKTtcbi8vICBcbi8vICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7cy5tb3ZlVG8oNywgNCk7fSwgMTAwMCk7XG4vLyAgc2V0VGltZW91dChmdW5jdGlvbigpe3MuaW5kZXhlZEJhckNoYXJ0KDMsNCk7fSwgMjAwMCk7XG59XG5cbi8vbmFtZXNwYWNlLnVzY3RWaXMgPSB1c2N0VmlzO1xufSkod2luZG93KTsiXX0=
