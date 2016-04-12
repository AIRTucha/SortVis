(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
    
   //obj.sortingAnimation = function(){
////    delayFor(du, sortingLog, function(d, callback){
////      obj.indexedBarChart(d.i, d.j, function(){
////        if(d.result)
////        {
////          drawSwap(d.i, d.j, callback);
////        }
////      })
////    });
//    var delayCounter = 0;
//    sortingLog.forEach(function(d, i){
//      obj.indexedBarChart(d.i, d.j, delayCounter++);
//      if(d.result){
//        //obj.trueBarChart(d.i, d.j, delayCounter++);
//        obj.drawSwap(d.i, d.j, delayCounter);
//      }
//    });
//  }

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

//function bubbleSort(compare){
//  var sLog = [];
//  
//  for(var i = 0; i < dataset.length; i++)
//    for(var j = 0; j < dataset.length; j++)
//    {
//      var entry = {
//        i : i,
//        j : j,
//        result : true
//      };
//      
//      if(compare(dataset[i],dataset[j]))
//        swap(i, j);
//      else entry.result = false;
//        
//      sLog.push(entry);
//    }
//  
//  dataset = bufferDataset;
//  
//  return sLog;
//}

function bubbleSort(compare){
  var sLog = [];
  
  for(var i = 0; i < dataset.length; i++)
    for(var j = 0; j < dataset.length; j++)
    { 
      sLog.push(function(cb){indexedBarChart(i, j, cb)});
      if(compare(dataset[i],dataset[j]))
      {
        sLog.push(function(cb){falseBarChart(i, j, cb)});
        sLog.push(function(){drawSwap(i, j)});
        swap(i, j);
      }
      else sLog.push(function(cb){trueBarChart(i, j, cb)});
        
      //sLog.push(entry);
    }
  
  dataset = bufferDataset;
  
  return sLog;
}

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
  
  
//  
//  setTimeout(function(){s.moveTo(7, 4);}, 1000);
//  setTimeout(function(){s.indexedBarChart(3,4);}, 2000);
}

//namespace.usctVis = usctVis;
})(window);
},{"./SortVis":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIlNvcnRWaXMuanMiLCJidWJibGVTb3J0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIgICAgXG4gICAvL29iai5zb3J0aW5nQW5pbWF0aW9uID0gZnVuY3Rpb24oKXtcbi8vLy8gICAgZGVsYXlGb3IoZHUsIHNvcnRpbmdMb2csIGZ1bmN0aW9uKGQsIGNhbGxiYWNrKXtcbi8vLy8gICAgICBvYmouaW5kZXhlZEJhckNoYXJ0KGQuaSwgZC5qLCBmdW5jdGlvbigpe1xuLy8vLyAgICAgICAgaWYoZC5yZXN1bHQpXG4vLy8vICAgICAgICB7XG4vLy8vICAgICAgICAgIGRyYXdTd2FwKGQuaSwgZC5qLCBjYWxsYmFjayk7XG4vLy8vICAgICAgICB9XG4vLy8vICAgICAgfSlcbi8vLy8gICAgfSk7XG4vLyAgICB2YXIgZGVsYXlDb3VudGVyID0gMDtcbi8vICAgIHNvcnRpbmdMb2cuZm9yRWFjaChmdW5jdGlvbihkLCBpKXtcbi8vICAgICAgb2JqLmluZGV4ZWRCYXJDaGFydChkLmksIGQuaiwgZGVsYXlDb3VudGVyKyspO1xuLy8gICAgICBpZihkLnJlc3VsdCl7XG4vLyAgICAgICAgLy9vYmoudHJ1ZUJhckNoYXJ0KGQuaSwgZC5qLCBkZWxheUNvdW50ZXIrKyk7XG4vLyAgICAgICAgb2JqLmRyYXdTd2FwKGQuaSwgZC5qLCBkZWxheUNvdW50ZXIpO1xuLy8gICAgICB9XG4vLyAgICB9KTtcbi8vICB9XG5cblwidXNlIHN0cmljdFwiXG52YXIgZGF0YXNldDtcbnZhciBidWZmZXJEYXRhc2V0O1xudmFyIHNvcnRpbmdMb2c7XG52YXIgd2lkdGg7XG52YXIgaGVpZ2h0O1xudmFyIHNjYWxlO1xudmFyIGR1cmF0aW9uO1xuXG52YXIgbWFpbkNvbG9yID0gXCIjQUFBQUFBXCI7XG5cbmZ1bmN0aW9uIFNvcnRWaXMoc2l6ZSwgY29tcCwgdywgaCwgZHUsIGlDb2xvciwgakNvbG9yLCB0cnVlQ29sb3IsIGZhbHNlQ29sb3IsIG1Db2xvcil7XG4gIHZhciBvYmogPSB7fTtcbiAgXG4gIGRhdGFzZXQgPSByYW5kb21BcnJheShzaXplKTtcbiAgYnVmZmVyRGF0YXNldCA9ICBkYXRhc2V0LnNsaWNlKDApO1xuICB3aWR0aCA9IHcgKiAwLjk5O1xuICBoZWlnaHQgPSBoICogMC45OTtcbiAgZHVyYXRpb24gPSBkdTtcbiAgbWFpbkNvbG9yID0gbUNvbG9yO1xuICBzb3J0aW5nTG9nID0gYnViYmxlU29ydChjb21wKTtcbiAgXG4gIGQzLnNlbGVjdChcIiNjaGFydFwiKVxuICAgICAgICAgICAgLmFwcGVuZChcInN2Z1wiKVxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcImJhckNoYXJ0XCIpXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoKVxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KVxuICAgICAgICAgICAgLnNlbGVjdEFsbChcIipcIikucmVtb3ZlKCk7XG4gIFxuICBzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG4gICAgICAgICAgICAuZG9tYWluKFswLCAxXSlcbiAgICAgICAgICAgIC5yYW5nZShbMCwgaGVpZ2h0XSk7XG4gIFxuICBkcmF3QmFyQ2hhcnQoKTtcbiAgXG4gIHZhciB1cGRhdGVCYXJDaGFydCA9IHVwZGF0ZUJhckNoYXJ0KG1haW5Db2xvciwgbWFpbkNvbG9yKTtcbnZhciBpbmRleGVkQmFyQ2hhcnQgPSB1cGRhdGVCYXJDaGFydChpQ29sb3IsIGpDb2xvcik7XG52YXIgdHJ1ZUJhckNoYXJ0ID0gdXBkYXRlQmFyQ2hhcnQodHJ1ZUNvbG9yLCB0cnVlQ29sb3IpO1xudmFyIGZhbHNlQmFyQ2hhcnQgPSB1cGRhdGVCYXJDaGFydChmYWxzZUNvbG9yLCBmYWxzZUNvbG9yKTtcbiAgXG4gIGluZGV4ZWRCYXJDaGFydCg0LCAyLCBudWxsKTtcbiAvLyByZUxvb3Aoc29ydGluZ0xvZyk7ICBcblxuZnVuY3Rpb24gcmFuZG9tQXJyYXkoc2l6ZU9mQXJyYXkpe1xuICB2YXIgYSA9IFtdO1xuICBcbiAgZm9yKHZhciBpID0gMDsgaSA8IHNpemVPZkFycmF5OyBpKyspXG4gICAgYS5wdXNoKE1hdGgucmFuZG9tKCklMTAwKTtcbiAgXG4gIHJldHVybiBhO1xufVxuICAgICAgICAgIFxuZnVuY3Rpb24gZHJhd0JhckNoYXJ0KCl7XG4gIGQzLnNlbGVjdChcIiNiYXJDaGFydFwiKS5zZWxlY3RBbGwoXCJyZWN0XCIpLnJlbW92ZSgpO1xuICBcbiAgZDMuc2VsZWN0KFwiI2JhckNoYXJ0XCIpLnNlbGVjdEFsbChcInJlY3RcIilcbiAgICAuZGF0YShkYXRhc2V0KVxuICAgIC5lbnRlcigpXG4gICAgLmFwcGVuZChcInJlY3RcIilcbiAgICAuYXR0cihcImlkXCIsXCJlbGVtZW50XCIpXG4gICAgLmF0dHIoXCJ4XCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgcmV0dXJuIGkgKiAod2lkdGggLyBkYXRhc2V0Lmxlbmd0aCk7XG4gICAgfSlcblxuICAgIC5hdHRyKFwieVwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgIHJldHVybiBoZWlnaHQgLSBzY2FsZShkKTtcbiAgICB9KVx0XHRcdFx0ICAgXG4gICAgLmF0dHIoXCJ3aWR0aFwiLCAod2lkdGggLyBkYXRhc2V0Lmxlbmd0aCkqMC45IClcbiAgICAuYXR0cihcImhlaWdodFwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgIHJldHVybiBzY2FsZShkKTtcbiAgICB9KVxuICAgIC5hdHRyKFwiZmlsbFwiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHJldHVybiBtYWluQ29sb3I7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUJhckNoYXJ0KGZpcnN0Q29sb3IsIHNlY29uZENvbG9yKXsgIFxuICByZXR1cm4gZnVuY3Rpb24oYSwgYiwgY2FsbGJhY2spe1xuICAgIGQzLnNlbGVjdChcIiNiYXJDaGFydFwiKS5zZWxlY3RBbGwoXCJyZWN0XCIpXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgIC8vIC5kZWxheShkdXJhdGlvbiAqIGkpXG4gICAgICAuZHVyYXRpb24oZHVyYXRpb24pXG4gICAgICAuYXR0cihcInhcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICAgIHJldHVybiBpICogKHdpZHRoIC8gZGF0YXNldC5sZW5ndGgpO1xuICAgICAgfSlcbiAgICAgIC5hdHRyKFwieVwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgcmV0dXJuIGhlaWdodCAtIHNjYWxlKGQpO1xuICAgICAgfSlcdFx0XHRcdCAgIFxuICAgICAgLmF0dHIoXCJ3aWR0aFwiLCAod2lkdGggLyBkYXRhc2V0Lmxlbmd0aCkqMC45IClcbiAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICByZXR1cm4gc2NhbGUoZCk7XG4gICAgICB9KVxuICAgICAgLmF0dHIoXCJmaWxsXCIsIGZ1bmN0aW9uKGQsaSkge1xuICAgICAgICBpZihpID09IGEpXG4gICAgICAgICAgcmV0dXJuIGZpcnN0Q29sb3I7XG4gICAgICAgIGVsc2UgaWYoaSA9PSBiKVxuICAgICAgICAgIHJldHVybiBzZWNvbmRDb2xvcjtcbiAgICAgICAgZWxzZSBcbiAgICAgICAgICByZXR1cm4gbWFpbkNvbG9yO1xuICAgICAgfSkuZWFjaChcImVuZFwiLCBmdW5jdGlvbigpe2NvbnNvbGUubG9nKFwidGVzdFwiKX0pO1xuICB9XG59XG5cblxuXG5mdW5jdGlvbiBkcmF3U3dhcChhLCBiLCBjYWxsYmFjayl7XG4gIHZhciBidWZmZXIgPSBkYXRhc2V0W2FdO1xuICBkYXRhc2V0W2FdID0gZGF0YXNldFtiXTtcbiAgZGF0YXNldFtiXSA9IGJ1ZmZlcjtcbiAgXG4gIGQzLnNlbGVjdChcIiNiYXJDaGFydFwiKS5zZWxlY3RBbGwoXCJyZWN0XCIpXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24oZHVyYXRpb24pXG4gICAgICAuYXR0cihcInhcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICBpZihpID09IGEpIFxuICAgICAgICAgIHJldHVybiBiICogKHdpZHRoIC8gZGF0YXNldC5sZW5ndGgpO1xuICAgICAgICBlbHNlIGlmKGkgPT0gYilcbiAgICAgICAgICByZXR1cm4gYSAqICh3aWR0aCAvIGRhdGFzZXQubGVuZ3RoKTtcbiAgICAgICAgZWxzZSBcbiAgICAgICAgICByZXR1cm4gaSAqICh3aWR0aCAvIGRhdGFzZXQubGVuZ3RoKTtcbiAgICAgIH0pXG4gICAgICAuYXR0cihcInlcIiwgZnVuY3Rpb24oZCkge1xuICAgICAgICAgIHJldHVybiBoZWlnaHQgLSBzY2FsZShkKTtcbiAgICAgIH0pXHRcdFx0XHQgICBcbiAgICAgIC5hdHRyKFwid2lkdGhcIiwgKHdpZHRoIC8gZGF0YXNldC5sZW5ndGgpKjAuOSApXG4gICAgICAuYXR0cihcImhlaWdodFwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgcmV0dXJuIHNjYWxlKGQpO1xuICAgICAgfSlcbiAgICAgIC5hdHRyKFwiZmlsbFwiLCBmdW5jdGlvbihkLGkpIHtcbiAgICAgICAgICByZXR1cm4gbWFpbkNvbG9yO1xuICAgICAgfSkuZWFjaChcImVuZFwiLCBmdW5jdGlvbigpe1xuICAgICAgICAgIGRyYXdCYXJDaGFydCgpO1xuICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9KTtcbn1cblxuZnVuY3Rpb24gZHJhd01vdmVUbyhhLCBwb3Mpe1xuICAgIHZhciBidWZmRGF0YXNldCA9IFtdO1xuICAgIGQzLnNlbGVjdChcIiNiYXJDaGFydFwiKS5zZWxlY3RBbGwoXCJyZWN0XCIpXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24oZHVyYXRpb24pXG4gICAgICAuYXR0cihcInhcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICB2YXIgaUN1ciA9IGk7XG4gICAgICBcbiAgICAgICAgaWYoaSA9PSBhKSBcbiAgICAgICAgICBpQ3VyID0gcG9zIDtcbiAgICAgICAgZWxzZSBpZihpID4gYSAmJiBpIDw9IHBvcylcbiAgICAgICAgICBpQ3VyIC09IDE7XG4gICAgICAgIGVsc2UgaWYoaSA8IGEgJiYgaSA+PSBwb3MpXG4gICAgICAgICAgaUN1ciArPSAxO1xuICAgICAgICBcbiAgICAgICAgYnVmZkRhdGFzZXRbaUN1cl0gPSBkO1xuICAgICAgICByZXR1cm4gaUN1ciAqICh3aWR0aCAvIGRhdGFzZXQubGVuZ3RoKTtcbiAgICAgIH0pXG4gICAgICAuYXR0cihcInlcIiwgZnVuY3Rpb24oZCkge1xuICAgICAgICAgIHJldHVybiBoZWlnaHQgLSBzY2FsZShkKTtcbiAgICAgIH0pXHRcdFx0XHQgICBcbiAgICAgIC5hdHRyKFwid2lkdGhcIiwgKHdpZHRoIC8gZGF0YXNldC5sZW5ndGgpKjAuOSApXG4gICAgICAuYXR0cihcImhlaWdodFwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgcmV0dXJuIHNjYWxlKGQpO1xuICAgICAgfSlcbiAgICAgIC5hdHRyKFwiZmlsbFwiLCBmdW5jdGlvbihkLGkpIHtcbiAgICAgICAgICByZXR1cm4gbWFpbkNvbG9yO1xuICAgICAgfSkuZWFjaChcImVuZFwiLCBmdW5jdGlvbigpe1xuICAgICAgICBkYXRhc2V0ID0gYnVmZkRhdGFzZXQ7XG4gICAgICAgIGRyYXdCYXJDaGFydCgpO1xuICAgICAgfSk7XG59XG5cbi8vZnVuY3Rpb24gYnViYmxlU29ydChjb21wYXJlKXtcbi8vICB2YXIgc0xvZyA9IFtdO1xuLy8gIFxuLy8gIGZvcih2YXIgaSA9IDA7IGkgPCBkYXRhc2V0Lmxlbmd0aDsgaSsrKVxuLy8gICAgZm9yKHZhciBqID0gMDsgaiA8IGRhdGFzZXQubGVuZ3RoOyBqKyspXG4vLyAgICB7XG4vLyAgICAgIHZhciBlbnRyeSA9IHtcbi8vICAgICAgICBpIDogaSxcbi8vICAgICAgICBqIDogaixcbi8vICAgICAgICByZXN1bHQgOiB0cnVlXG4vLyAgICAgIH07XG4vLyAgICAgIFxuLy8gICAgICBpZihjb21wYXJlKGRhdGFzZXRbaV0sZGF0YXNldFtqXSkpXG4vLyAgICAgICAgc3dhcChpLCBqKTtcbi8vICAgICAgZWxzZSBlbnRyeS5yZXN1bHQgPSBmYWxzZTtcbi8vICAgICAgICBcbi8vICAgICAgc0xvZy5wdXNoKGVudHJ5KTtcbi8vICAgIH1cbi8vICBcbi8vICBkYXRhc2V0ID0gYnVmZmVyRGF0YXNldDtcbi8vICBcbi8vICByZXR1cm4gc0xvZztcbi8vfVxuXG5mdW5jdGlvbiBidWJibGVTb3J0KGNvbXBhcmUpe1xuICB2YXIgc0xvZyA9IFtdO1xuICBcbiAgZm9yKHZhciBpID0gMDsgaSA8IGRhdGFzZXQubGVuZ3RoOyBpKyspXG4gICAgZm9yKHZhciBqID0gMDsgaiA8IGRhdGFzZXQubGVuZ3RoOyBqKyspXG4gICAgeyBcbiAgICAgIHNMb2cucHVzaChmdW5jdGlvbihjYil7aW5kZXhlZEJhckNoYXJ0KGksIGosIGNiKX0pO1xuICAgICAgaWYoY29tcGFyZShkYXRhc2V0W2ldLGRhdGFzZXRbal0pKVxuICAgICAge1xuICAgICAgICBzTG9nLnB1c2goZnVuY3Rpb24oY2Ipe2ZhbHNlQmFyQ2hhcnQoaSwgaiwgY2IpfSk7XG4gICAgICAgIHNMb2cucHVzaChmdW5jdGlvbigpe2RyYXdTd2FwKGksIGopfSk7XG4gICAgICAgIHN3YXAoaSwgaik7XG4gICAgICB9XG4gICAgICBlbHNlIHNMb2cucHVzaChmdW5jdGlvbihjYil7dHJ1ZUJhckNoYXJ0KGksIGosIGNiKX0pO1xuICAgICAgICBcbiAgICAgIC8vc0xvZy5wdXNoKGVudHJ5KTtcbiAgICB9XG4gIFxuICBkYXRhc2V0ID0gYnVmZmVyRGF0YXNldDtcbiAgXG4gIHJldHVybiBzTG9nO1xufVxuXG5mdW5jdGlvbiBzd2FwKGEsIGIpe1xuICB2YXIgYnVmZmVyID0gZGF0YXNldFthXTtcbiAgZGF0YXNldFthXSA9IGRhdGFzZXRbYl07XG4gIGRhdGFzZXRbYl0gPSBidWZmZXI7XG59XG5cbmZ1bmN0aW9uIHJlTG9vcChmTG9nKXtcbiAgZkxvZy5zaGlmdCgpKGZ1bmN0aW9uKCl7XG4gICAgaWYoZkxvZy5sZW5ndGggPiAwKTtcbiAgICAgIHJlTG9vcChmTG9nKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRlbGF5Rm9yKGR1cmF0aW9uLCBkYXRhLCBjYWxsYmFjayl7XG4gIGNhbGxiYWNrKGRhdGEuc2hpZnQoKSwgZnVuY3Rpb24gKCl7XG4gICAgaWYgKGRhdGEubGVuZ3RoID4gMClcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtkZWxheUZvcihkdXJhdGlvbiwgZGF0YSwgY2FsbGJhY2spfSwgZHVyYXRpb24pXG4gIH0pOyBcbn1cbiAgXG4gIHJldHVybiBvYmo7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU29ydFZpcztcblx0IiwidmFyIFNvcnRWaXMgPSByZXF1aXJlKCcuL1NvcnRWaXMnKTtcblxuKGZ1bmN0aW9uKG5hbWVzcGFjZSkge3dpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpe1xuICB2YXIgcyA9IG5ldyBTb3J0VmlzKDEwLCBcbiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihhLCBiKSB7cmV0dXJuIGEgPiBiO30sXG4gICAgICAgICAgICAgICAgICAgICAgd2luZG93LmlubmVyV2lkdGgsIFxuICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5pbm5lckhlaWdodCwgXG4gICAgICAgICAgICAgICAgICAgICAgNTAwLFxuICAgICAgICAgICAgICAgICAgICAgIFwiI0FBMDA3N1wiLCBcbiAgICAgICAgICAgICAgICAgICAgICBcIiNERDAwQUFcIiwgXG4gICAgICAgICAgICAgICAgICAgICAgXCIjMDBCQjAwXCIsIFxuICAgICAgICAgICAgICAgICAgICAgIFwiI0JCMDAwMFwiLCBcbiAgICAgICAgICAgICAgICAgICAgICBcIiNBQUFBQUFcIilcbiAgXG4gIFxuLy8gIFxuLy8gIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtzLm1vdmVUbyg3LCA0KTt9LCAxMDAwKTtcbi8vICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7cy5pbmRleGVkQmFyQ2hhcnQoMyw0KTt9LCAyMDAwKTtcbn1cblxuLy9uYW1lc3BhY2UudXNjdFZpcyA9IHVzY3RWaXM7XG59KSh3aW5kb3cpOyJdfQ==
