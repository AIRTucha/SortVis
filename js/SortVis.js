"use strict"

var d3 = require('d3');

var dataset;
var sortingLog;
var width;
var height;
var scale;
var duration;
var size;

var step = 0;
var mainColor = "#AAAAAA";
var firstColor = "#AA0077";          
var secondColor = "#DD00AA";

var inRun = 0;

function SortVis(size, comp, w, h, du, iColor, jColor, trueColor, falseColor, mColor){
  var obj = {};

  var sorting = sortings[0]();
  
  dataset = randomArray(size, mainColor);
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
  
  scale = getScale(height, 
                   dataset.reduce( function(a, b) {return a.d < b.d ? a : b;}).d,
                   dataset.reduce( function(a, b) {return a.d > b.d ? a : b;}).d
                  );
  
  obj.forwardAnimation = function(callback){
    inRun = 1;
    reLoop(callback);
  };
  
  obj.backwardAnimation = function(callback){
    inRun = -1;
    reLoop(callback);
  };
  
  obj.intervalAnimation = function(end){
    inRun = 0;
    step = end; 
    sortingLog[step](function(data){drawBarChart(data);});
  };
  
  obj.forwardStep = stepAnimation(function(a){ return a+1; });
  obj.backwardStep = stepAnimation(function(a){ return a-1; });

  obj.getStep = function(){
    return step;
  };
  
  obj.setStep = function(s){
    step = s;
  };
  
  obj.forward = function(){
    inRun = 1;
  }
  
  obj.stop = function(){
    inRun = 0;
  }
  
  obj.back = function(){
    inRun = -1;
  }
  
  obj.getRun = function(){
    return inRun;
  }
  
  obj.reset = function(){
    dataset = randomArray(size, mainColor);
    scale = getScale(height, 
                   dataset.reduce( function(a, b) {return a.d < b.d ? a : b;}).d,
                   dataset.reduce( function(a, b) {return a.d > b.d ? a : b;}).d
                  );
    sortingLog = sorting(comp);
    resetChart(dataset);
    step = 0;
  }
  
  obj.setDuration = function(v){
    duration = v;
  }
  
  obj.setSize = function(v){
    size = v;
    inRun = 0;
    obj.reset();
  }
  
  obj.getLogSize = function(){
    return sortingLog.length - 1;
  }
  
  obj.resize = function(w, h) {
    width = w;
    height = h;
    scale = getScale(height, 
                   dataset.reduce( function(a, b) {return a.d < b.d ? a : b;}).d,
                   dataset.reduce( function(a, b) {return a.d > b.d ? a : b;}).d
                  );
    
    d3.select('#chart').select('svg').remove();
    
    d3.select("#chart")
      .append("svg")
      .attr("id", "barChart")
      .attr("width", width)
      .attr("height", height)
      .selectAll("*").remove();
    
    drawBarChart(dataset);
  }
  
  obj.setAlgo = function (v){
    sorting = sortings[v]();
    obj.intervalAnimation(0);
    sortingLog = sorting(comp);
    resetChart(dataset);
  }
  
  startBarChart(dataset);
  
  return obj;
}

var sortings = [
  function bubbleSort(){
  return function(compare){
    var sLog = [];
    var bufferDataset = dataset.slice(0);

     sLog.push(wraper(dataset.length, dataset.length, dataset.length, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));
    
    for(var i = 0; i < dataset.length-1; i++)
      for(var j = 0; j < dataset.length-1-i; j++)
      { 
       sLog.push(wraper(j, j+1, dataset.length, dataset.slice(0), function(a, b, p,  data, cb){updateBarChart(a, b, p, data, cb)}));
        if(compare(dataset[j].d, dataset[j+1].d))
        {
          sLog.push(wraper(j, j+1, dataset.length, dataset.slice(0), function(a, b, p, data, cb){drawSwap(a, b, p, data, cb)}));
          swap(j, j+1);
        }
      }
    
    sLog.push(wraper(dataset.length, dataset.length, dataset.length, dataset.slice(0), function(a, b, p, data){
      updateBarChart(a, b, p, data, drawBarChart(data))
    }));
    
    dataset = bufferDataset;

    return sLog;
  }
},
  function selectionSort(){
    return function(compare){
      var sLog = [];
      var bufferDataset = dataset.slice(0);

      sLog.push(wraper(dataset.length, dataset.length, dataset.length, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));

      for(var i = 0; i < dataset.length - 1; i++){
        var p = i;
        sLog.push(wraper(i, j, p, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));
        for(var j = i+1; j < dataset.length; j++){ 
          if(!compare(dataset[j].d, dataset[p].d)){
            p = j;
          }
          sLog.push(wraper(i, j, p, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));
        }
        if(p != i){
          sLog.push(wraper(p, i, p, dataset.slice(0), function(a, b, p, data, cb){drawSwap(a, b, p, data, cb);}));
          swap(p, i);
        }
      }

      sLog.push(wraper(dataset.length, dataset.length, dataset.length, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));

      dataset = bufferDataset;
      return sLog;
    }
},
function cocktailSort(){
  return function(compare){
    var sLog = [];
    var bufferDataset = dataset.slice(0);
    sLog.push(wraper(dataset.length, dataset.length, dataset.length, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));

    for(var i = 0; i < dataset.length/2; i++)
    {
      var swaped = false;
      for(var j = i; j < dataset.length - i - 1; j++){ 
       var p1 = j;
       var p2 = j+1;
       sLog.push(wraper(p1, p2, dataset.length, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));
        if(compare(dataset[p1].d, dataset[p2].d)){
          sLog.push(wraper(p1, p2, dataset.length, dataset.slice(0), function(a, b, p, data, cb){drawSwap(a, b, p, data, cb)}));
          swap(p1, p2);
          swaped = true;
        }
      }
      swaped = false;
      for(var j = dataset.length - 2 - i; j > 0; j--) { 
       sLog.push(wraper(j, j-1, dataset.length, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));
        if(!compare(dataset[j].d, dataset[j-1].d)) {
          sLog.push(wraper(j, j-1, dataset.length, dataset.slice(0), function(a, b, p, data, cb){drawSwap(a, b, p, data, cb)}));
          swap(j, j-1);
          swaped = true;
        }
      }
      
      if(!swaped)
        break;
    }
    
    sLog.push(wraper(dataset.length, dataset.length, dataset.length, dataset.slice(0), function(a, b, p, data){
      updateBarChart(a, b, p, data, drawBarChart(data))
    }));
    
    dataset = bufferDataset;

    return sLog;
    
  }
},
function insertionSort(){
  return function (compare){
  var sLog = [];
  var bufferDataset = dataset.slice(0);
  
  sLog.push(wraper(dataset.length, dataset.length, dataset.length, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));

  
  for(var i = 0; i < dataset.length - 1; i++){
    var j = i + 1;
    var tmp = dataset[j];
    
    sLog.push(wraper(i, j, dataset.length, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));
    
    var localData = dataset.slice(0);
    while(j > 0 && !compare(tmp.d, dataset[j-1].d)){
      dataset[j] = dataset[j-1];
       sLog.push(wraper(i+1, j, dataset.length, localData.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));
      j--;
    }
    
    sLog.push(wraper(i+1, j, dataset.length, localData.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));
    sLog.push(wraper(i+1, j, dataset.length, dataset.slice(0), function(a, b, p, data, cb){drawMoveTo(a, b, p, data, cb)})); 
    
    dataset[j] = tmp;
  }
  
      
    sLog.push(wraper(dataset.length, dataset.length, dataset.length, dataset.slice(0), function(a, b, p, data){
      updateBarChart(a, b, p, data, drawBarChart(data))
    }));
    
    dataset = bufferDataset;

    return sLog;
  }
},
  function mergeSort(){
    return function (compare){
      var bufferDataset = dataset.slice(0);
      var sLog = [];

       sLog.push(wraper(dataset.length, dataset.length, dataset.length, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));

      mergeSortAlgo(sLog, dataset, dataset.slice(0), 0, dataset.length-1);

      sLog.push(wraper(dataset.length, dataset.length, dataset.length, dataset.slice(0), function(a, b, p, data){
        updateBarChart(a, b, p, data, drawBarChart(data))
      }));

      dataset = bufferDataset;

      return sLog;
  }
},
  function quickSort(){
    return function(){
       var sLog = [];
       var bufferDataset = dataset.slice(0);
  
  sLog.push(wraper(dataset.length, dataset.length, dataset.length, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));
      
      quickSortAlgo(sLog, 0, dataset.length);
  
      sLog.push(wraper(dataset.length, dataset.length, dataset.length, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));
        
      dataset = bufferDataset;

      return sLog;
      }
  },
  function heapSort(){
    return function(){
       var sLog = [];
       var bufferDataset = dataset.slice(0);
  
  sLog.push(wraper(dataset.length, dataset.length, dataset.length, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));
      
      
      for(var i = Math.floor(dataset.length/2) - 1; i >= 0; i--)
        repairTop(sLog, dataset, dataset.length-1, i, true);
      
      for(var i = dataset.length - 1; i > 0; i--){
        sLog.push(wraper(0, i-1, dataset.length, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));
        sLog.push(wraper(0, i, dataset.length, dataset.slice(0), function(a, b, p, data, cb){drawSwap(a, b, p, data, cb)}));
        swap(0, i);
        sLog.push(wraper(0, i-1, dataset.length, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));
        repairTop(sLog, dataset, i-1, 0, true);
      }   
  
  
      sLog.push(wraper(dataset.length, dataset.length, dataset.length, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));
        
      dataset = bufferDataset;

      return sLog;
      }
  }
]

function repairTop(sLog, data, bottom, topIndex, order){
  var tmp = data[topIndex];
  var succ = topIndex * 2 + 1;
  
  if(succ < bottom && data[succ].d > data[succ+1].d)
    succ++;
  
  while(succ <= bottom && tmp.d > data[succ].d){
     sLog.push(wraper(succ, topIndex, dataset.length, data.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));
    sLog.push(wraper(succ, topIndex, dataset.length, data.slice(0), function(a, b, p, data, cb){drawEqual(a, b, p, data, cb)})); 
    
    data[topIndex] = data[succ];
    
    topIndex = succ;
    succ = succ * 2 + 1;
    
    if(succ < bottom && data[succ].d > data[succ+1].d)
      succ++;
  }
  
  
sLog.push(wraper(data.length, topIndex, topIndex, data.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));  
  sLog.push(wraper(tmp, topIndex, data.length, data.slice(0), function(a, b, p, data, cb){drawSet(tmp, b, p, data, cb)}));
  
  data[topIndex] = tmp;
}

function quickSortAlgo(sLog, left, right){
  if(left < right){
    var bound = left;
    
    for(var i = left + 1; i < right; i++){
       sLog.push(wraper(i, bound+1, dataset.length, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));

      if(dataset[i].d > dataset[left].d){
        sLog.push(wraper(i, bound+1, dataset.length, dataset.slice(0), function(a, b, p, data, cb){drawSwap(a, b, p, data, cb)}));
        swap(i, ++bound);
      }
    }

sLog.push(wraper(left, bound, dataset.length, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));
sLog.push(wraper(left, bound, dataset.length, dataset.slice(0), function(a, b, p, data, cb){drawSwap(a, b, p, data, cb)}));
    swap(left, bound);
    
    quickSortAlgo(sLog, left, bound);
    quickSortAlgo(sLog, ++bound, right);
  }
}

function mergeSortAlgo(sLog, data, arr, left, right){
  if(left != right){
    var midIndex = Math.floor((right + left)/2);
    
    mergeSortAlgo(sLog, data, arr, left, midIndex);
    mergeSortAlgo(sLog, data, arr, midIndex + 1, right);
    merge(data, arr, left, right);
    
    for(var i = left; i <= right; i++){
       sLog.push(wraper(left, right, i, data.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));
       sLog.push(wraper(arr[i], i, i, data.slice(0), function(a, b, p, data, cb){drawSet(a, b, p, data, cb)}));
      data[i] = arr[i];
    }
  }
}
  
function merge(data, arr, left, right){
  var midIndex = Math.floor((left + right)/2);
  var leftIndex = left;
  var rightIndex = midIndex + 1;
  var aIndex = left;
  
  while(leftIndex <= midIndex && rightIndex <= right)
    if(data[leftIndex].d >= data[rightIndex].d)
      arr[aIndex++] = data[leftIndex++];
    else
      arr[aIndex++] = data[rightIndex++];
  
  while(leftIndex <= midIndex)
    arr[aIndex++] = data[leftIndex++];
  
  while(rightIndex <= right)
    arr[aIndex++] = data[rightIndex++];  
}

function swap(a, b){
  var buffer = dataset[a];
  
  dataset[a] = dataset[b];
  dataset[b] = buffer;
}

function reLoop(callback){
  if(inRun != 0){
    callback();
     step += inRun;
      if(step < sortingLog.length && step >= 0)
        sortingLog[step](function(){ 
         reLoop(callback); 
        });
      else {
        inRun = 0;
        step = 0 > step ?  0 : sortingLog.length;
      }
  }
}

function stepAnimation(foo){
  return function (){
    inRun = 0;
    
    step = foo(step);
    if(sortingLog.length > step && step >= 0)
      sortingLog[step](function(a, b, p, data){});
    else 
      step = 0 > step ?  0 : sortingLog.length - 1;

  }
}

function wraper(i, j, p, data, callback){
  return function(cb) {
    return callback(i, j, p, data, cb);
  };
}

function getScale(h, min, max){
  return d3.scale.linear()
            .domain([0, max])
            .range([0, h*.97]);
}

function randomArray(sizeOfArray, color){
  var a = [];
  
  for(var i = 0; i < sizeOfArray; i++)
    a.push({d : Math.random()%100, c : color, b : 0});
  
  return a;
}

function resetChart(data){
  data.forEach(function(d){
    d.c = mainColor;
    d.b = 0;
  });
  
  d3.select("#barChart").selectAll("rect")
    .transition()
    .duration(duration)
    .attr('x', 0).each('end',function(){
        startBarChart(data);
  });
}
  
function startBarChart(data){
  d3.select("#barChart").selectAll("rect")
    .remove();
   d3.select("#barChart").selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class","element")
    .attr("x", 0)
    .attr("y", function(d, i) {
        return height - scale(d.d);
    })				   
    .attr("width", (width / data.length)*0.9 )
    .attr("height", function(d) {
        return scale(d.d);
    })
    .attr("fill", function(d, i) {
        return d.c;
    })
    .transition()
    .duration(duration)
    .attr("x", function(d, i) {
        return i * (width / data.length);
    });
}

function drawBarChart(data){
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
        return height - scale(d.d);
    })				   
    .attr("width", (width / data.length)*0.9 )
    .attr("height", function(d) {
        return scale(d.d);
    })
    .attr("stroke", firstColor)
    .attr("stroke-width", function(d){
      return d.b;
    })
    .attr("fill", function(d, i) {
        return d.c;
    });
}

function updateBarChart(a, b, p, data, callback){
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
          return height - scale(d.d);
      })				   
      .attr("width", (width / data.length)*0.9 )
      .attr("height", function(d) {
          return scale(d.d);
      })
      .attr("fill", function(d){return d.c})
      .attr("stroke", firstColor)
      .attr("stroke-width", function(d){
        return d.b;
      })
      .transition()
      .duration(duration)
      .attr("fill", function(d, i) {
        if(i == a)
          d.c = firstColor;
        else if(i == b)
          d.c = secondColor;
        else d.c = mainColor;
        
          return d.c;
      })
      .attr("stroke", firstColor)
      .attr("stroke-width", function(d, i){
          d.b = i == p ? (width / data.length)*0.1 : 0;
          return d.b;
      })
      .each("end", function(d, i){
          if(i == data.length-1)
            try{
              callback(data);
            }catch(e){}
      });
}

function drawSwap(a, b, p, data, callback){
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
        if(i == data.length - 1) 
          callback(data);
        });
}

function drawMoveTo(a, b, p, data, callback){
    d3.select("#barChart").selectAll("rect")
      .transition()
      .duration(duration)
      .attr("x", function(d, i) {
        var iCur = i;
      
        if(i == a) 
          iCur = b ;
        else if(i > a && i <= b)
          iCur -= 1;
        else if(i < a && i >= b)
          iCur += 1;
        
        return iCur * (width / dataset.length);
      })				   
      .each("end", function(d, i){
        if(i == data.length - 1) 
          callback(data);
        });
}

function drawEqual(a, b, p, data, callback){
    d3.select("#barChart").selectAll("rect")
      .transition()
      .duration(duration)
      .attr("height", function(d, i) {
          return scale(i == b ? data[a].d : d.d);
      })
      .attr("y", function(d, i) {
          return height - scale(i == b ? data[a].d : d.d);
      })
      .each("end", function(d, i){
        if(i == data.length - 1) 
          callback(data);
        });
}

function drawSet(a, b, p, data, callback){
    d3.select("#barChart").selectAll("rect")
      .transition()
      .duration(duration)
      .attr("height", function(d, i) {
          return scale(i == b ? a.d : d.d);
      })
      .attr("y", function(d, i) {
          return height - scale(i == b ? a.d : d.d);
      })
      .each("end", function(d, i){
        if(i == data.length - 1) 
          callback(data);
        });
}

module.exports = SortVis;
	