"use strict"

var d3 = require('d3');

var dataset;
var sortingLog;
var width;
var height;
var scale;
var duration;

var step = 0;
var mainColor = "#AAAAAA";

var inRun = false;

function SortVis(size, comp, w, h, du, iColor, jColor, trueColor, falseColor, mColor){
  var obj = {};
  
  var indexedBarChart = updateBarChart(iColor, jColor);
  var trueBarChart = updateBarChart(trueColor, trueColor);
  var falseBarChart = updateBarChart(falseColor, falseColor);
  var sorting = bubbleSort(updateBarChart(iColor, jColor))
  var forwardLoop =  reLoop(function(a){return a+1;});
  var backwardLoop =  reLoop(function(a){return a-1;});  
  
  dataset = randomArray(size);
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
  
  scale = getScale(height, dataset.reduce( function(a, b) {return a > b ? a : b;}));
  
  obj.forwardAnimation = function(callback){
    inRun = true;
    forwardLoop(sortingLog.slice(0), callback);
  };
  
  obj.backwardAnimation = function(callback){
    inRun = true;
    backwardLoop(sortingLog.slice(0), callback);
  };
  
  obj.intervalAnimation = function(start, end){
    step = start;
    inRun = false; 
    
    while(end != step){
      sortingLog[step](function(a, b, data){drawBarChart(data, a, b);});
      step += step < end ? 1 : -1;
    }
  };
  
  obj.forwardStep = stepAnimation(function(a){return a+1;});
  obj.backwardStep = stepAnimation(function(a){return a-1;});

  obj.getStep = function(){
    return step;
  };
  
  obj.setStep = function(s){
    step = s;
  };
  
  obj.start = function(){
    inRun = true;
  }
  
  obj.stop = function(){
    inRun = false;
  }
  
  obj.ifRun = function(){
    return inRun;
  }
  
  obj.reset = function(){
    dataset = randomArray(size);
    scale = getScale(height, dataset.reduce( function(a, b) {return a > b ? a : b;}));
    sortingLog = sorting(comp);
    resetChart(dataset);
    step = 0;
  }
  
  obj.logSize = sortingLog.length - 1;
  
  startBarChart(dataset);
  
  return obj;
}

function bubbleSort(drawChart){
  return function(compare){
    var sLog = [];
    var bufferDataset = dataset.slice(0);

    for(var i = 0; i < dataset.length; i++)
      for(var j = i; j < dataset.length; j++)
      { 
       sLog.push(wraper(i, j, dataset.slice(0), function(a, b, data, cb){drawChart(a, b, data, cb)}));
        if(compare(dataset[i], dataset[j]))
        {
          swap(i, j);
          sLog.push(wraper(i, j, dataset.slice(0), function(a, b, data, cb){drawSwap(a, b, data, cb)}));
        }
      }
    sLog.push(wraper(i, j, dataset.slice(0), function(a, b, data, cb){
      updateBarChart(mainColor, mainColor)(a, b, data, cb)
    }));
    
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

function resetChart(data){
  d3.select("#barChart").selectAll("rect")
    .transition()
    .duration(duration)
    .attr('x', 0).each('end',function(){
        startBarChart(data);
  });
  
 

}
  
function startBarChart(data){
  d3.select("#barChart").selectAll("rect")
    .remove()
    .data(data)
    .enter()
    .append("rect")
    .attr("class","element")
    .attr("x", 0)
    .attr("y", function(d, i) {
        return height - scale(d);
    })				   
    .attr("width", (width / data.length)*0.9 )
    .attr("height", function(d) {
        return scale(d);
    })
    .attr("fill", function(d, i) {
        return mainColor;
    })
    .transition()
    .duration(duration)
    .attr("x", function(d, i) {
        return i * (width / data.length);
    });
}

function drawBarChart(data){
  d3.select("#barChart").selectAll("rect")
    .remove()
    .data(data)
    .enter()
    .append("rect")
    .attr("class","element")
    .attr("x", function(d, i) {
        return i * (width / data.length);
    })
    .attr("y", function(d, i) {
        return height - scale(d);
    })				   
    .attr("width", (width / data.length)*0.9 )
    .attr("height", function(d) {
        return scale(d);
    })
    .attr("fill", function(d, i) {
        return mainColor;
    });
}

function drawBarChart(data, a, b){
  d3.select("#barChart").selectAll("rect").remove();
  
  d3.select("#barChart").selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class","element")
    .attr("x", function(d, i) {
        return i * (width / data.length);
    })
    .attr("y", function(d, i) {
        return height - scale(d);
    })				   
    .attr("width", (width / data.length)*0.9 )
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
  return function(a, b, data, callback){
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
        if(i == data.length-1) {
          try{
            callback(a, b, data);
          }catch(e){};
        }
      });
  }
}

function drawSwap(a, b, data, callback){
 // swap(a, b);

  d3.select("#barChart").selectAll("rect")
      .transition()
      .duration(duration)
      .attr("x", function(d, i) {
        if(i == a) 
          return b * (width / data.length);
        else if(i == b)
          return a * (width / data.length);
        else 
          return i * (width / data.length);
      })			   
      .each("end", function(d, i){
        if(i == data.length - 1) {
          drawBarChart(data);
          callback(a, b, data);
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

function reLoop(foo){
  return function (fLog, callback){
    if(inRun){
      callback();
      fLog[step](function(){
        step = foo(step);
        if(fLog.length > step && step >= 0)
          reLoop(foo)(fLog, callback);
        else step = 0 > step ?  0 : sortingLog.length - 1;
      });
    }
  } 
}

function stepAnimation(foo){
  return function (){
    sortingLog[step](function(a, b, data){drawBarChart(data, a, b);});
    inRun = false;
    
    step = foo(step);
    if(sortingLog.length-1 < step)
      step = sortingLog.length - 1;
    else if(step < 0)
      step = 0;
  }
}

function wraper(i, j, data, callback){
  return function(cb) {
    return callback(i, j, data, cb);
  };
}

function getScale(h, max){
  return d3.scale.linear()
            .domain([0, max])
            .range([0, h]);
}

module.exports = SortVis;
	