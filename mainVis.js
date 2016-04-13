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
  
  //var indexedBarChart = updateBarChart(iColor, jColor);
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
  var s = new SortVis(10, 
                      function(a, b) {return a < b;},
                      window.innerWidth, 
                      window.innerHeight, 
                      100,
                      "#AA0077", 
                      "#DD00AA", 
                      "#00BB00", 
                      "#BB0000", 
                      "#AAAAAA")

s.sortingAnimation();
}

//namespace.usctVis = usctVis;
})(window);
},{"./SortVis":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIlNvcnRWaXMuanMiLCJidWJibGVTb3J0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCJcbnZhciBkYXRhc2V0O1xudmFyIGJ1ZmZlckRhdGFzZXQ7XG52YXIgc29ydGluZ0xvZztcbnZhciB3aWR0aDtcbnZhciBoZWlnaHQ7XG52YXIgc2NhbGU7XG52YXIgZHVyYXRpb247XG5cbnZhciBtYWluQ29sb3IgPSBcIiNBQUFBQUFcIjtcblxuZnVuY3Rpb24gU29ydFZpcyhzaXplLCBjb21wLCB3LCBoLCBkdSwgaUNvbG9yLCBqQ29sb3IsIHRydWVDb2xvciwgZmFsc2VDb2xvciwgbUNvbG9yKXtcbiAgdmFyIG9iaiA9IHt9O1xuICBcbiAgLy92YXIgaW5kZXhlZEJhckNoYXJ0ID0gdXBkYXRlQmFyQ2hhcnQoaUNvbG9yLCBqQ29sb3IpO1xuICB2YXIgdHJ1ZUJhckNoYXJ0ID0gdXBkYXRlQmFyQ2hhcnQodHJ1ZUNvbG9yLCB0cnVlQ29sb3IpO1xuICB2YXIgZmFsc2VCYXJDaGFydCA9IHVwZGF0ZUJhckNoYXJ0KGZhbHNlQ29sb3IsIGZhbHNlQ29sb3IpO1xuICB2YXIgc29ydGluZyA9IGJ1YmJsZVNvcnQodXBkYXRlQmFyQ2hhcnQoaUNvbG9yLCBqQ29sb3IpKVxuIFxuICBkYXRhc2V0ID0gcmFuZG9tQXJyYXkoc2l6ZSk7XG4gIGJ1ZmZlckRhdGFzZXQgPSAgZGF0YXNldC5zbGljZSgwKTtcbiAgd2lkdGggPSB3ICogMC45OTtcbiAgaGVpZ2h0ID0gaCAqIDAuOTk7XG4gIGR1cmF0aW9uID0gZHU7XG4gIG1haW5Db2xvciA9IG1Db2xvcjtcbiAgc29ydGluZ0xvZyA9IHNvcnRpbmcoY29tcCk7XG4gIFxuICBkMy5zZWxlY3QoXCIjY2hhcnRcIilcbiAgICAgICAgICAgIC5hcHBlbmQoXCJzdmdcIilcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJiYXJDaGFydFwiKVxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aClcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodClcbiAgICAgICAgICAgIC5zZWxlY3RBbGwoXCIqXCIpLnJlbW92ZSgpO1xuICBcbiAgc2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuICAgICAgICAgICAgLmRvbWFpbihbMCwgMV0pXG4gICAgICAgICAgICAucmFuZ2UoWzAsIGhlaWdodF0pO1xuICBcbiAgb2JqLnNvcnRpbmdBbmltYXRpb24gPSBmdW5jdGlvbigpe3JlTG9vcChzb3J0aW5nTG9nKX07XG4gIFxuICBcbiAgXG4gIGRyYXdCYXJDaGFydChmdW5jdGlvbigpe30pO1xuICBcbiAgcmV0dXJuIG9iajtcbn1cblxuZnVuY3Rpb24gYnViYmxlU29ydChkcmF3Q2hhcnQpe1xuICByZXR1cm4gZnVuY3Rpb24oY29tcGFyZSl7XG4gICAgdmFyIHNMb2cgPSBbXTtcblxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBkYXRhc2V0Lmxlbmd0aDsgaSsrKVxuICAgICAgZm9yKHZhciBqID0gaTsgaiA8IGRhdGFzZXQubGVuZ3RoOyBqKyspXG4gICAgICB7IFxuICAgICAgIHNMb2cucHVzaCh3cmFwZXIoaSwgaiwgZnVuY3Rpb24oYSwgYiwgY2Ipe2RyYXdDaGFydChhLCBiLCBjYil9KSk7XG4gICAgICAgIGlmKGNvbXBhcmUoZGF0YXNldFtpXSxkYXRhc2V0W2pdKSlcbiAgICAgICAge1xuICAgICAgICAgIC8vc0xvZy5wdXNoKHdyYXBlcihkYXRhc2V0LCBpLCBqLCBmdW5jdGlvbihkYXRhLCBhLCBiLCBjYil7ZmFsc2VCYXJDaGFydChhLCBiLCBkYXRhLCBjYil9KSk7XG4gICAgICAgICAgc0xvZy5wdXNoKHdyYXBlcihpLCBqLCBmdW5jdGlvbihhLCBiLCBjYil7ZHJhd1N3YXAoYSwgYiwgY2IpfSkpO1xuICAgICAgICAgIHN3YXAoaSwgaik7XG4gICAgICAgIH1cbiAgICAgICAvLyBlbHNlICBzTG9nLnB1c2god3JhcGVyKGRhdGFzZXQsIGksIGosIGZ1bmN0aW9uKGRhdGEsIGEsIGIsIGNiKXt0cnVlQmFyQ2hhcnQoYSwgYiwgZGF0YSwgY2IpfSkpO1xuICAgICAgfVxuICAgIFxuICAgIHNMb2cucHVzaCh3cmFwZXIoaSwgaiwgZnVuY3Rpb24oYSwgYiwgY2Ipe3VwZGF0ZUJhckNoYXJ0KG1haW5Db2xvciwgbWFpbkNvbG9yKShhLCBiLCBjYil9KSk7XG4gICAgXG4gICAgZGF0YXNldCA9IGJ1ZmZlckRhdGFzZXQ7XG5cbiAgICByZXR1cm4gc0xvZztcbiAgfVxufVxuXG5mdW5jdGlvbiByYW5kb21BcnJheShzaXplT2ZBcnJheSl7XG4gIHZhciBhID0gW107XG4gIFxuICBmb3IodmFyIGkgPSAwOyBpIDwgc2l6ZU9mQXJyYXk7IGkrKylcbiAgICBhLnB1c2goTWF0aC5yYW5kb20oKSUxMDApO1xuICBcbiAgcmV0dXJuIGE7XG59XG4gICAgICAgICAgXG5mdW5jdGlvbiBkcmF3QmFyQ2hhcnQoKXtcbiAgZDMuc2VsZWN0KFwiI2JhckNoYXJ0XCIpLnNlbGVjdEFsbChcInJlY3RcIikucmVtb3ZlKCk7XG4gIFxuICBkMy5zZWxlY3QoXCIjYmFyQ2hhcnRcIikuc2VsZWN0QWxsKFwicmVjdFwiKVxuICAgIC5kYXRhKGRhdGFzZXQpXG4gICAgLmVudGVyKClcbiAgICAuYXBwZW5kKFwicmVjdFwiKVxuICAgIC5hdHRyKFwiaWRcIixcImVsZW1lbnRcIilcbiAgICAuYXR0cihcInhcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICByZXR1cm4gaSAqICh3aWR0aCAvIGRhdGFzZXQubGVuZ3RoKTtcbiAgICB9KVxuXG4gICAgLmF0dHIoXCJ5XCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgcmV0dXJuIGhlaWdodCAtIHNjYWxlKGQpO1xuICAgIH0pXHRcdFx0XHQgICBcbiAgICAuYXR0cihcIndpZHRoXCIsICh3aWR0aCAvIGRhdGFzZXQubGVuZ3RoKSowLjkgKVxuICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgcmV0dXJuIHNjYWxlKGQpO1xuICAgIH0pXG4gICAgLmF0dHIoXCJmaWxsXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgcmV0dXJuIG1haW5Db2xvcjtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQmFyQ2hhcnQoZmlyc3RDb2xvciwgc2Vjb25kQ29sb3IpeyAgXG4gIHJldHVybiBmdW5jdGlvbihhLCBiLCBjYWxsYmFjayl7XG4gICAgZDMuc2VsZWN0KFwiI2JhckNoYXJ0XCIpLnNlbGVjdEFsbChcInJlY3RcIilcbiAgICAgIC5kYXRhKGRhdGFzZXQpXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24oZHVyYXRpb24pXG4gICAgICAuYXR0cihcImZpbGxcIiwgZnVuY3Rpb24oZCxpKSB7XG4gICAgICAgIGlmKGkgPT0gYSlcbiAgICAgICAgICByZXR1cm4gZmlyc3RDb2xvcjtcbiAgICAgICAgZWxzZSBpZihpID09IGIpXG4gICAgICAgICAgcmV0dXJuIHNlY29uZENvbG9yO1xuICAgICAgICBlbHNlIFxuICAgICAgICAgIHJldHVybiBtYWluQ29sb3I7XG4gICAgICB9KS5lYWNoKFwiZW5kXCIsIGZ1bmN0aW9uKGQsIGksIGEpe1xuICAgICAgICBpZihpID09IGRhdGFzZXQubGVuZ3RoLTEpIHtcbiAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBkcmF3U3dhcChhLCBiLCBjYWxsYmFjayl7XG4gIHN3YXAoYSwgYik7XG5cbiAgZDMuc2VsZWN0KFwiI2JhckNoYXJ0XCIpLnNlbGVjdEFsbChcInJlY3RcIilcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbihkdXJhdGlvbilcbiAgICAgIC5hdHRyKFwieFwiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIGlmKGkgPT0gYSkgXG4gICAgICAgICAgcmV0dXJuIGIgKiAod2lkdGggLyBkYXRhc2V0Lmxlbmd0aCk7XG4gICAgICAgIGVsc2UgaWYoaSA9PSBiKVxuICAgICAgICAgIHJldHVybiBhICogKHdpZHRoIC8gZGF0YXNldC5sZW5ndGgpO1xuICAgICAgICBlbHNlIFxuICAgICAgICAgIHJldHVybiBpICogKHdpZHRoIC8gZGF0YXNldC5sZW5ndGgpO1xuICAgICAgfSlcdFx0XHQgICBcbiAgICAgIC5lYWNoKFwiZW5kXCIsIGZ1bmN0aW9uKGQsIGkpe1xuICAgICAgICBpZihpID09IGRhdGFzZXQubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIGRyYXdCYXJDaGFydCgpO1xuICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xufVxuXG5mdW5jdGlvbiBkcmF3TW92ZVRvKGEsIHBvcyl7XG4gICAgdmFyIGJ1ZmZEYXRhc2V0ID0gW107XG4gICAgZDMuc2VsZWN0KFwiI2JhckNoYXJ0XCIpLnNlbGVjdEFsbChcInJlY3RcIilcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbihkdXJhdGlvbilcbiAgICAgIC5hdHRyKFwieFwiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIHZhciBpQ3VyID0gaTtcbiAgICAgIFxuICAgICAgICBpZihpID09IGEpIFxuICAgICAgICAgIGlDdXIgPSBwb3MgO1xuICAgICAgICBlbHNlIGlmKGkgPiBhICYmIGkgPD0gcG9zKVxuICAgICAgICAgIGlDdXIgLT0gMTtcbiAgICAgICAgZWxzZSBpZihpIDwgYSAmJiBpID49IHBvcylcbiAgICAgICAgICBpQ3VyICs9IDE7XG4gICAgICAgIFxuICAgICAgICBidWZmRGF0YXNldFtpQ3VyXSA9IGQ7XG4gICAgICAgIHJldHVybiBpQ3VyICogKHdpZHRoIC8gZGF0YXNldC5sZW5ndGgpO1xuICAgICAgfSlcbiAgICAgIC5hdHRyKFwieVwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgcmV0dXJuIGhlaWdodCAtIHNjYWxlKGQpO1xuICAgICAgfSlcdFx0XHRcdCAgIFxuICAgICAgLmF0dHIoXCJ3aWR0aFwiLCAod2lkdGggLyBkYXRhc2V0Lmxlbmd0aCkqMC45IClcbiAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICByZXR1cm4gc2NhbGUoZCk7XG4gICAgICB9KVxuICAgICAgLmF0dHIoXCJmaWxsXCIsIGZ1bmN0aW9uKGQsaSkge1xuICAgICAgICAgIHJldHVybiBtYWluQ29sb3I7XG4gICAgICB9KS5lYWNoKFwiZW5kXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgIGRhdGFzZXQgPSBidWZmRGF0YXNldDtcbiAgICAgICAgZHJhd0JhckNoYXJ0KCk7XG4gICAgICB9KTtcbn1cblxuZnVuY3Rpb24gc3dhcChhLCBiKXtcbiAgdmFyIGJ1ZmZlciA9IGRhdGFzZXRbYV07XG4gIFxuICBkYXRhc2V0W2FdID0gZGF0YXNldFtiXTtcbiAgZGF0YXNldFtiXSA9IGJ1ZmZlcjtcbn1cblxuZnVuY3Rpb24gcmVMb29wKGZMb2cpe1xuICBmTG9nLnNoaWZ0KCkoZnVuY3Rpb24oKXtcbiAgICBpZihmTG9nLmxlbmd0aCA+IDApXG4gICAgICByZUxvb3AoZkxvZyk7XG4gIH0pO1xufSBcblxuZnVuY3Rpb24gd3JhcGVyKGksIGosIGNhbGxiYWNrKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKGNiKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrKGksIGosIGNiKVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNvcnRWaXM7XG5cdCIsInZhciBTb3J0VmlzID0gcmVxdWlyZSgnLi9Tb3J0VmlzJyk7XG5cbihmdW5jdGlvbihuYW1lc3BhY2UpIHt3aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKXtcbiAgdmFyIHMgPSBuZXcgU29ydFZpcygxMCwgXG4gICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oYSwgYikge3JldHVybiBhIDwgYjt9LFxuICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5pbm5lcldpZHRoLCBcbiAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuaW5uZXJIZWlnaHQsIFxuICAgICAgICAgICAgICAgICAgICAgIDEwMCxcbiAgICAgICAgICAgICAgICAgICAgICBcIiNBQTAwNzdcIiwgXG4gICAgICAgICAgICAgICAgICAgICAgXCIjREQwMEFBXCIsIFxuICAgICAgICAgICAgICAgICAgICAgIFwiIzAwQkIwMFwiLCBcbiAgICAgICAgICAgICAgICAgICAgICBcIiNCQjAwMDBcIiwgXG4gICAgICAgICAgICAgICAgICAgICAgXCIjQUFBQUFBXCIpXG5cbnMuc29ydGluZ0FuaW1hdGlvbigpO1xufVxuXG4vL25hbWVzcGFjZS51c2N0VmlzID0gdXNjdFZpcztcbn0pKHdpbmRvdyk7Il19
