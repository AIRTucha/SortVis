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
  
  obj.randomArray = randomArray;
  obj.drawBarChart = drawBarChart;

  obj.updateBarChart = updateBarChart(mainColor, mainColor);
  obj.indexedBarChart = updateBarChart(iColor, jColor);
  obj.trueBarChart = updateBarChart(trueColor, trueColor);
  obj.falseBarChart = updateBarChart(falseColor, falseColor);
  obj.drawSwap = drawSwap;
  obj.drawMoveTo = drawMoveTo;
  
  obj.sortingAnimation = function(){
    delayFor(du, sortingLog, function(d, callback){
      obj.indexedBarChart(d.i, d.j, function(){
        if(d.result)
        {
          drawSwap(d.i, d.j);
        }
      })
    });
  }

  
  d3.select("#chart")
            .append("svg")
            .attr("id", "barChart")
            .attr("width", width)
            .attr("height", height)
            .selectAll("*").remove();
  
  scale = d3.scale.linear()
            .domain([0, 1])
            .range([0, height]);
  
  
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

function updateBarChart(firstColor, secondColor, callback){  
  return function(a, b){
    d3.select("#barChart").selectAll("rect")
      .transition()
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
      }).each("end", callback);
  }
}

function drawSwap(a, b){
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
      }).each("end", function(){drawBarChart();});
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

function swap(a, b){
  var buffer = dataset[a];
  dataset[a] = dataset[b];
  dataset[b] = buffer;

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
  
  s.drawBarChart();
  s.sortingAnimation();
//  
//  setTimeout(function(){s.moveTo(7, 4);}, 1000);
//  setTimeout(function(){s.indexedBarChart(3,4);}, 2000);
}

//namespace.usctVis = usctVis;
})(window);
},{"./SortVis":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIlNvcnRWaXMuanMiLCJidWJibGVTb3J0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiXG52YXIgZGF0YXNldDtcbnZhciBidWZmZXJEYXRhc2V0O1xudmFyIHNvcnRpbmdMb2c7XG52YXIgd2lkdGg7XG52YXIgaGVpZ2h0O1xudmFyIHNjYWxlO1xudmFyIGR1cmF0aW9uO1xuXG52YXIgbWFpbkNvbG9yID0gXCIjQUFBQUFBXCI7XG5cbmZ1bmN0aW9uIFNvcnRWaXMoc2l6ZSwgY29tcCwgdywgaCwgZHUsIGlDb2xvciwgakNvbG9yLCB0cnVlQ29sb3IsIGZhbHNlQ29sb3IsIG1Db2xvcil7XG4gIHZhciBvYmogPSB7fTtcbiAgXG4gIGRhdGFzZXQgPSByYW5kb21BcnJheShzaXplKTtcbiAgYnVmZmVyRGF0YXNldCA9ICBkYXRhc2V0LnNsaWNlKDApO1xuICB3aWR0aCA9IHcgKiAwLjk5O1xuICBoZWlnaHQgPSBoICogMC45OTtcbiAgZHVyYXRpb24gPSBkdTtcbiAgbWFpbkNvbG9yID0gbUNvbG9yO1xuICBzb3J0aW5nTG9nID0gYnViYmxlU29ydChjb21wKTtcbiAgXG4gIG9iai5yYW5kb21BcnJheSA9IHJhbmRvbUFycmF5O1xuICBvYmouZHJhd0JhckNoYXJ0ID0gZHJhd0JhckNoYXJ0O1xuXG4gIG9iai51cGRhdGVCYXJDaGFydCA9IHVwZGF0ZUJhckNoYXJ0KG1haW5Db2xvciwgbWFpbkNvbG9yKTtcbiAgb2JqLmluZGV4ZWRCYXJDaGFydCA9IHVwZGF0ZUJhckNoYXJ0KGlDb2xvciwgakNvbG9yKTtcbiAgb2JqLnRydWVCYXJDaGFydCA9IHVwZGF0ZUJhckNoYXJ0KHRydWVDb2xvciwgdHJ1ZUNvbG9yKTtcbiAgb2JqLmZhbHNlQmFyQ2hhcnQgPSB1cGRhdGVCYXJDaGFydChmYWxzZUNvbG9yLCBmYWxzZUNvbG9yKTtcbiAgb2JqLmRyYXdTd2FwID0gZHJhd1N3YXA7XG4gIG9iai5kcmF3TW92ZVRvID0gZHJhd01vdmVUbztcbiAgXG4gIG9iai5zb3J0aW5nQW5pbWF0aW9uID0gZnVuY3Rpb24oKXtcbiAgICBkZWxheUZvcihkdSwgc29ydGluZ0xvZywgZnVuY3Rpb24oZCwgY2FsbGJhY2spe1xuICAgICAgb2JqLmluZGV4ZWRCYXJDaGFydChkLmksIGQuaiwgZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoZC5yZXN1bHQpXG4gICAgICAgIHtcbiAgICAgICAgICBkcmF3U3dhcChkLmksIGQuaik7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSk7XG4gIH1cblxuICBcbiAgZDMuc2VsZWN0KFwiI2NoYXJ0XCIpXG4gICAgICAgICAgICAuYXBwZW5kKFwic3ZnXCIpXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwiYmFyQ2hhcnRcIilcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgd2lkdGgpXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBoZWlnaHQpXG4gICAgICAgICAgICAuc2VsZWN0QWxsKFwiKlwiKS5yZW1vdmUoKTtcbiAgXG4gIHNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcbiAgICAgICAgICAgIC5kb21haW4oWzAsIDFdKVxuICAgICAgICAgICAgLnJhbmdlKFswLCBoZWlnaHRdKTtcbiAgXG4gIFxuICByZXR1cm4gb2JqO1xufVxuXG5mdW5jdGlvbiByYW5kb21BcnJheShzaXplT2ZBcnJheSl7XG4gIHZhciBhID0gW107XG4gIFxuICBmb3IodmFyIGkgPSAwOyBpIDwgc2l6ZU9mQXJyYXk7IGkrKylcbiAgICBhLnB1c2goTWF0aC5yYW5kb20oKSUxMDApO1xuICBcbiAgcmV0dXJuIGE7XG59XG4gICAgICAgICAgXG5mdW5jdGlvbiBkcmF3QmFyQ2hhcnQoKXtcbiAgZDMuc2VsZWN0KFwiI2JhckNoYXJ0XCIpLnNlbGVjdEFsbChcInJlY3RcIikucmVtb3ZlKCk7XG4gIFxuICBkMy5zZWxlY3QoXCIjYmFyQ2hhcnRcIikuc2VsZWN0QWxsKFwicmVjdFwiKVxuICAgIC5kYXRhKGRhdGFzZXQpXG4gICAgLmVudGVyKClcbiAgICAuYXBwZW5kKFwicmVjdFwiKVxuICAgIC5hdHRyKFwiaWRcIixcImVsZW1lbnRcIilcbiAgICAuYXR0cihcInhcIiwgZnVuY3Rpb24oZCwgaSkge1xuICAgICAgICByZXR1cm4gaSAqICh3aWR0aCAvIGRhdGFzZXQubGVuZ3RoKTtcbiAgICB9KVxuXG4gICAgLmF0dHIoXCJ5XCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgcmV0dXJuIGhlaWdodCAtIHNjYWxlKGQpO1xuICAgIH0pXHRcdFx0XHQgICBcbiAgICAuYXR0cihcIndpZHRoXCIsICh3aWR0aCAvIGRhdGFzZXQubGVuZ3RoKSowLjkgKVxuICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgcmV0dXJuIHNjYWxlKGQpO1xuICAgIH0pXG4gICAgLmF0dHIoXCJmaWxsXCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgcmV0dXJuIG1haW5Db2xvcjtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQmFyQ2hhcnQoZmlyc3RDb2xvciwgc2Vjb25kQ29sb3IsIGNhbGxiYWNrKXsgIFxuICByZXR1cm4gZnVuY3Rpb24oYSwgYil7XG4gICAgZDMuc2VsZWN0KFwiI2JhckNoYXJ0XCIpLnNlbGVjdEFsbChcInJlY3RcIilcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbihkdXJhdGlvbilcbiAgICAgIC5hdHRyKFwieFwiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgICAgcmV0dXJuIGkgKiAod2lkdGggLyBkYXRhc2V0Lmxlbmd0aCk7XG4gICAgICB9KVxuICAgICAgLmF0dHIoXCJ5XCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICByZXR1cm4gaGVpZ2h0IC0gc2NhbGUoZCk7XG4gICAgICB9KVx0XHRcdFx0ICAgXG4gICAgICAuYXR0cihcIndpZHRoXCIsICh3aWR0aCAvIGRhdGFzZXQubGVuZ3RoKSowLjkgKVxuICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgZnVuY3Rpb24oZCkge1xuICAgICAgICAgIHJldHVybiBzY2FsZShkKTtcbiAgICAgIH0pXG4gICAgICAuYXR0cihcImZpbGxcIiwgZnVuY3Rpb24oZCxpKSB7XG4gICAgICAgIGlmKGkgPT0gYSlcbiAgICAgICAgICByZXR1cm4gZmlyc3RDb2xvcjtcbiAgICAgICAgZWxzZSBpZihpID09IGIpXG4gICAgICAgICAgcmV0dXJuIHNlY29uZENvbG9yO1xuICAgICAgICBlbHNlIFxuICAgICAgICAgIHJldHVybiBtYWluQ29sb3I7XG4gICAgICB9KS5lYWNoKFwiZW5kXCIsIGNhbGxiYWNrKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBkcmF3U3dhcChhLCBiKXtcbiAgdmFyIGJ1ZmZlciA9IGRhdGFzZXRbYV07XG4gIGRhdGFzZXRbYV0gPSBkYXRhc2V0W2JdO1xuICBkYXRhc2V0W2JdID0gYnVmZmVyO1xuICBcbiAgZDMuc2VsZWN0KFwiI2JhckNoYXJ0XCIpLnNlbGVjdEFsbChcInJlY3RcIilcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbihkdXJhdGlvbilcbiAgICAgIC5hdHRyKFwieFwiLCBmdW5jdGlvbihkLCBpKSB7XG4gICAgICAgIGlmKGkgPT0gYSkgXG4gICAgICAgICAgcmV0dXJuIGIgKiAod2lkdGggLyBkYXRhc2V0Lmxlbmd0aCk7XG4gICAgICAgIGVsc2UgaWYoaSA9PSBiKVxuICAgICAgICAgIHJldHVybiBhICogKHdpZHRoIC8gZGF0YXNldC5sZW5ndGgpO1xuICAgICAgICBlbHNlIFxuICAgICAgICAgIHJldHVybiBpICogKHdpZHRoIC8gZGF0YXNldC5sZW5ndGgpO1xuICAgICAgfSlcbiAgICAgIC5hdHRyKFwieVwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgcmV0dXJuIGhlaWdodCAtIHNjYWxlKGQpO1xuICAgICAgfSlcdFx0XHRcdCAgIFxuICAgICAgLmF0dHIoXCJ3aWR0aFwiLCAod2lkdGggLyBkYXRhc2V0Lmxlbmd0aCkqMC45IClcbiAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICByZXR1cm4gc2NhbGUoZCk7XG4gICAgICB9KVxuICAgICAgLmF0dHIoXCJmaWxsXCIsIGZ1bmN0aW9uKGQsaSkge1xuICAgICAgICAgIHJldHVybiBtYWluQ29sb3I7XG4gICAgICB9KS5lYWNoKFwiZW5kXCIsIGZ1bmN0aW9uKCl7ZHJhd0JhckNoYXJ0KCk7fSk7XG59XG5cbmZ1bmN0aW9uIGRyYXdNb3ZlVG8oYSwgcG9zKXtcbiAgICB2YXIgYnVmZkRhdGFzZXQgPSBbXTtcbiAgICBkMy5zZWxlY3QoXCIjYmFyQ2hhcnRcIikuc2VsZWN0QWxsKFwicmVjdFwiKVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKGR1cmF0aW9uKVxuICAgICAgLmF0dHIoXCJ4XCIsIGZ1bmN0aW9uKGQsIGkpIHtcbiAgICAgICAgdmFyIGlDdXIgPSBpO1xuICAgICAgXG4gICAgICAgIGlmKGkgPT0gYSkgXG4gICAgICAgICAgaUN1ciA9IHBvcyA7XG4gICAgICAgIGVsc2UgaWYoaSA+IGEgJiYgaSA8PSBwb3MpXG4gICAgICAgICAgaUN1ciAtPSAxO1xuICAgICAgICBlbHNlIGlmKGkgPCBhICYmIGkgPj0gcG9zKVxuICAgICAgICAgIGlDdXIgKz0gMTtcbiAgICAgICAgXG4gICAgICAgIGJ1ZmZEYXRhc2V0W2lDdXJdID0gZDtcbiAgICAgICAgcmV0dXJuIGlDdXIgKiAod2lkdGggLyBkYXRhc2V0Lmxlbmd0aCk7XG4gICAgICB9KVxuICAgICAgLmF0dHIoXCJ5XCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICByZXR1cm4gaGVpZ2h0IC0gc2NhbGUoZCk7XG4gICAgICB9KVx0XHRcdFx0ICAgXG4gICAgICAuYXR0cihcIndpZHRoXCIsICh3aWR0aCAvIGRhdGFzZXQubGVuZ3RoKSowLjkgKVxuICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgZnVuY3Rpb24oZCkge1xuICAgICAgICAgIHJldHVybiBzY2FsZShkKTtcbiAgICAgIH0pXG4gICAgICAuYXR0cihcImZpbGxcIiwgZnVuY3Rpb24oZCxpKSB7XG4gICAgICAgICAgcmV0dXJuIG1haW5Db2xvcjtcbiAgICAgIH0pLmVhY2goXCJlbmRcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgZGF0YXNldCA9IGJ1ZmZEYXRhc2V0O1xuICAgICAgICBkcmF3QmFyQ2hhcnQoKTtcbiAgICAgIH0pO1xufVxuXG5mdW5jdGlvbiBidWJibGVTb3J0KGNvbXBhcmUpe1xuICB2YXIgc0xvZyA9IFtdO1xuICBcbiAgZm9yKHZhciBpID0gMDsgaSA8IGRhdGFzZXQubGVuZ3RoOyBpKyspXG4gICAgZm9yKHZhciBqID0gMDsgaiA8IGRhdGFzZXQubGVuZ3RoOyBqKyspXG4gICAge1xuICAgICAgdmFyIGVudHJ5ID0ge1xuICAgICAgICBpIDogaSxcbiAgICAgICAgaiA6IGosXG4gICAgICAgIHJlc3VsdCA6IHRydWVcbiAgICAgIH07XG4gICAgICBcbiAgICAgIGlmKGNvbXBhcmUoZGF0YXNldFtpXSxkYXRhc2V0W2pdKSlcbiAgICAgICAgc3dhcChpLCBqKTtcbiAgICAgIGVsc2UgZW50cnkucmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIFxuICAgICAgc0xvZy5wdXNoKGVudHJ5KTtcbiAgICB9XG4gIFxuICBkYXRhc2V0ID0gYnVmZmVyRGF0YXNldDtcbiAgXG4gIHJldHVybiBzTG9nO1xufVxuXG5mdW5jdGlvbiBzd2FwKGEsIGIpe1xuICB2YXIgYnVmZmVyID0gZGF0YXNldFthXTtcbiAgZGF0YXNldFthXSA9IGRhdGFzZXRbYl07XG4gIGRhdGFzZXRbYl0gPSBidWZmZXI7XG5cbn1cbmZ1bmN0aW9uIGRlbGF5Rm9yKGR1cmF0aW9uLCBkYXRhLCBjYWxsYmFjayl7XG4gIGNhbGxiYWNrKGRhdGEuc2hpZnQoKSwgZnVuY3Rpb24gKCl7XG4gICAgaWYgKGRhdGEubGVuZ3RoID4gMClcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtkZWxheUZvcihkdXJhdGlvbiwgZGF0YSwgY2FsbGJhY2spfSwgZHVyYXRpb24pXG4gIH0pOyBcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFNvcnRWaXM7XG5cdCIsInZhciBTb3J0VmlzID0gcmVxdWlyZSgnLi9Tb3J0VmlzJyk7XG5cbihmdW5jdGlvbihuYW1lc3BhY2UpIHt3aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKXtcbiAgdmFyIHMgPSBuZXcgU29ydFZpcygxMCwgXG4gICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oYSwgYikge3JldHVybiBhID4gYjt9LFxuICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5pbm5lcldpZHRoLCBcbiAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuaW5uZXJIZWlnaHQsIFxuICAgICAgICAgICAgICAgICAgICAgIDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICBcIiNBQTAwNzdcIiwgXG4gICAgICAgICAgICAgICAgICAgICAgXCIjREQwMEFBXCIsIFxuICAgICAgICAgICAgICAgICAgICAgIFwiIzAwQkIwMFwiLCBcbiAgICAgICAgICAgICAgICAgICAgICBcIiNCQjAwMDBcIiwgXG4gICAgICAgICAgICAgICAgICAgICAgXCIjQUFBQUFBXCIpXG4gIFxuICBzLmRyYXdCYXJDaGFydCgpO1xuICBzLnNvcnRpbmdBbmltYXRpb24oKTtcbi8vICBcbi8vICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7cy5tb3ZlVG8oNywgNCk7fSwgMTAwMCk7XG4vLyAgc2V0VGltZW91dChmdW5jdGlvbigpe3MuaW5kZXhlZEJhckNoYXJ0KDMsNCk7fSwgMjAwMCk7XG59XG5cbi8vbmFtZXNwYWNlLnVzY3RWaXMgPSB1c2N0VmlzO1xufSkod2luZG93KTsiXX0=
