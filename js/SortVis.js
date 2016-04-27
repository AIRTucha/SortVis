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
/*
* Constract bar chart
* @param - size of an array
* @param - width
* @param - hieght
* @param - duration of the animation 
* @param - color settins
* ...
*/
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
  /*
  * Starts forward animation
  * @param - function executed every step
  */
  obj.forwardAnimation = function(callback){
    inRun = 1;
    reLoop(callback);
  };
  /*
  * Starts backward animation
  * @param - function executed every step
  */
  obj.backwardAnimation = function(callback){
    inRun = -1;
    reLoop(callback);
  };
  /*
  * Jump to certain step in animation process
  */
  obj.intervalAnimation = function(end){
    inRun = 0;
    step = end; 
    sortingLog[step](function(data){drawBarChart(data);});
  };
  /*
  * Execute one step anymation to specified direction
  */
  obj.forwardStep = stepAnimation(function(a){ return a+1; });
  obj.backwardStep = stepAnimation(function(a){ return a-1; });
  /*
  * @return stage of current animation process
  */
  obj.getStep = function(){
    return step;
  };
  /*
  * Set stage of current animation process
  * @param - step number
  */
  obj.setStep = function(s){
    step = s;
  };
  /*
  * Set visualisation in run forward state
  */
  obj.forward = function(){
    inRun = 1;
  }
  /*
  * Set visualisation in stop state
  */
  obj.stop = function(){
    inRun = 0;
  }
  /*
  * Set visualisation in run back state
  */
  obj.back = function(){
    inRun = -1;
  }
  /*
  * @return inRun state
  */
  obj.getRun = function(){
    return inRun;
  }
  /*
  * Regenerate dataset
  */
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
  /*
  * Set duration of every animation step
  * @param - duratuin in ms
  */
  obj.setDuration = function(v){
    duration = v;
  }
  /*
  * Set array size and regenerate the dataset
  * @param - desirable size of the dataset
  */
  obj.setSize = function(v){
    size = v;
    inRun = 0;
    obj.reset();
  }
  /*
  * @return index of the last function in animation query
  */
  obj.getLogSize = function(){
    return sortingLog.length - 1;
  }
  /*
  * Redraw the chart in according to new screen size
  * @param - width
  * @param - hieght
  */
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
  /*
  * Set algorithm from array in according with the index
  * @param an index of algorithm
  */
  obj.setAlgo = function (v){
    sorting = sortings[v]();
    obj.intervalAnimation(0);
    sortingLog = sorting(comp);
    resetChart(dataset);
  }
  
  //start the animation which draw the barchart
  startBarChart(dataset);
  
  return obj;
}

/*
* Array of sorting algorithms
*/
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
          sLog.push(wraper(j, j+1, dataset.length, dataset.slice(0), function(a, b, p, data, cb){drawSwap(a, b, data, cb)}));
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
          sLog.push(wraper(p, i, p, dataset.slice(0), function(a, b, p, data, cb){drawSwap(a, b, data, cb);}));
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
          sLog.push(wraper(p1, p2, dataset.length, dataset.slice(0), function(a, b, p, data, cb){drawSwap(a, b, data, cb)}));
          swap(p1, p2);
          swaped = true;
        }
      }
      swaped = false;
      for(var j = dataset.length - 2 - i; j > 0; j--) { 
       sLog.push(wraper(j, j-1, dataset.length, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));
        if(!compare(dataset[j].d, dataset[j-1].d)) {
          sLog.push(wraper(j, j-1, dataset.length, dataset.slice(0), function(a, b, p, data, cb){drawSwap(a, b, data, cb)}));
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
    sLog.push(wraper(i+1, j, dataset.length, dataset.slice(0), function(a, b, p, data, cb){drawMoveTo(a, b, data, cb)})); 
    
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
        repairTop(sLog, dataset, dataset.length-1, i);
      
      for(var i = dataset.length - 1; i > 0; i--){
        sLog.push(wraper(0, i-1, dataset.length, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));
        sLog.push(wraper(0, i-1, dataset.length, dataset.slice(0), function(a, b, p, data, cb){drawSwap(a, b, data, cb)}));
        swap(0, i);
        sLog.push(wraper(0, i-1, dataset.length, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));
        repairTop(sLog, dataset, i-1, 0);
      }   
  
  
      sLog.push(wraper(dataset.length, dataset.length, dataset.length, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));
        
      dataset = bufferDataset;

      return sLog;
      }
  }
]
/*
* Support function for Heap Sort
* @param - Query of animation functions
* @param - dataset
* @param - first boundary
* @param - last boundary
*/
function repairTop(sLog, data, bottom, topIndex){
  var tmp = data[topIndex];
  var succ = topIndex * 2 + 1;
  
  if(succ < bottom && data[succ].d > data[succ+1].d)
    succ++;
  
  while(succ <= bottom && tmp.d > data[succ].d){
     sLog.push(wraper(succ, topIndex, dataset.length, data.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));
    sLog.push(wraper(succ, topIndex, dataset.length, data.slice(0), function(a, b, p, data, cb){drawEqual(a, b, data, cb)})); 
    
    data[topIndex] = data[succ];
    
    topIndex = succ;
    succ = succ * 2 + 1;
    
    if(succ < bottom && data[succ].d > data[succ+1].d)
      succ++;
  }
  
  
sLog.push(wraper(data.length, topIndex, topIndex, data.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));  
  sLog.push(wraper(tmp, topIndex, data.length, data.slice(0), function(a, b, p, data, cb){drawSet(tmp, b, data, cb)}));
  
  data[topIndex] = tmp;
}
/*
* Quick Sorting Algorithm
* @param - Query of animation functions
* @param - left boundary
* @param - right boundary
*/
function quickSortAlgo(sLog, left, right){
  if(left < right){
    var bound = left;
    
    for(var i = left + 1; i < right; i++){
       sLog.push(wraper(i, bound+1, dataset.length, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));

      if(dataset[i].d > dataset[left].d){
        sLog.push(wraper(i, bound+1, dataset.length, dataset.slice(0), function(a, b, p, data, cb){drawSwap(a, b, data, cb)}));
        swap(i, ++bound);
      }
    }

sLog.push(wraper(left, bound, dataset.length, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));
sLog.push(wraper(left, bound, dataset.length, dataset.slice(0), function(a, b, p, data, cb){drawSwap(a, b, data, cb)}));
    swap(left, bound);
    
    quickSortAlgo(sLog, left, bound);
    quickSortAlgo(sLog, ++bound, right);
  }
}
/*
* Merge Sorting Algorithm
* @param - Query of animation functions
* @param - particular dataset
* @param - help dataset
* @param - left boundary
* @param - right boundary
*/
function mergeSortAlgo(sLog, data, arr, left, right){
  if(left != right){
    var midIndex = Math.floor((right + left)/2);
    
    mergeSortAlgo(sLog, data, arr, left, midIndex);
    mergeSortAlgo(sLog, data, arr, midIndex + 1, right);
    
    midIndex = Math.floor((left + right)/2);
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
    
    for(var i = left; i <= right; i++){
       sLog.push(wraper(left, right, i, data.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));
       sLog.push(wraper(arr[i], i, i, data.slice(0), function(a, b, p, data, cb){drawSet(a, b, data, cb)}));
      data[i] = arr[i];
    }
  }
}

/*
* swap dataset values
* @param - first index
* @param - second index
*/
function swap(a, b){
  var buffer = dataset[a];
  
  dataset[a] = dataset[b];
  dataset[b] = buffer;
}
/*
* run via "linked list" of functions and execute them sequentially
* @param - function which is executed every interation
*/
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
/*
* @return function withc perform one step animation in according with param
* @param - function which set direction of the step
*/
function stepAnimation(foo){
  return function (){
    inRun = 0;
    
    step = foo(step);
    if(step < sortingLog.length && step >= 0)
      sortingLog[step](function(a, b, p, data){});
    else 
      step = 0 > step ?  0 : sortingLog.length - 1
  }
}
/*
* wrap the function with closures
* @param - 1st closures value
* @param - 2nd closures value
* @param - 3rd closures value
* @param - 4th closures value
* @param - function which is needed to be wrapped
* @return - function with closures passed as arguments and opportunity to add callback
*/
function wraper(i, j, p, d, callback){
  return function(cb) {
    return callback(i, j, p, d, cb);
  };
}
/*
* generate d3.js scale
* @param - hieght of the chart
* @param - min of the data range
* @param - max of the data range
*/ 
function getScale(h, min, max){
  return d3.scale.linear()
            .domain([0, max])
            .range([0, h*.97]);
}
/*
* create an array of random values, storied as array of object with preset color and border width
* @param - size of array
* @param - default color
*/ 
function randomArray(sizeOfArray, color){
  var a = [];
  
  for(var i = 0; i < sizeOfArray; i++)
    a.push({d : Math.random()%100, c : color, b : 0});
  
  return a;
}
/*
* disable all highlighting and redraw original an sorted dataset
* @param - particular dataset
*/ 
function resetChart(data){
  data.forEach(function(d){
    d.c = mainColor;
    d.b = 0;
  });
  
  d3.select("#barChart").selectAll("rect")
    .transition()
    .duration(duration)
    .attr('y', height)
    .each('end',function(){
        startBarChart(data);
  });
}
/*
* draw the bar chart with animation
* @param - particular dataset
*/ 
function startBarChart(data){
  d3.select("#barChart").selectAll("rect").remove();
  
  d3.select("#barChart").selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class","element")
    .attr("x", function(d, i) {
        return i * (width / data.length);
    })
    .attr("y", height)				   
    .attr("width", (width / data.length)*0.9 )
    .attr("height", function(d) {
        return scale(d.d);
    })
    .attr("fill", function(d, i) {
        return d.c;
    })
    .transition()
    .duration(duration)
      .attr("y", function(d, i) {
        return height - scale(d.d);
    });
;
}
/*
* quick way to draw the bar chart
* @param - particular dataset
*/
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
/*
* update bar char in according with provided data, add highlighting
* @param - index of the first highlighted bar
* @param - index of the second highlighted bar
* @param - index of the bar with border
* @param - particular dataset
* @param - callback to call next function in query
*/
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
/*
* draw animation for swap bar with index a and b
* @param - the index of the first bar
* @param - the index of the second bar
* @param - particular dataset
* @param - callback to call next function in query
*/
function drawSwap(a, b, data, callback){
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
/*
* draw animation which move a bar to certain location
* @param - index from which the bar has to be moved
* @param - index there the bar has to be moved
* @param - particular dataset
* @param - callback to call next function in query
*/
function drawMoveTo(from, to, data, callback){
    d3.select("#barChart").selectAll("rect")
      .transition()
      .duration(duration)
      .attr("x", function(d, i) {
        var iCur = i;
      
        if(i == from) 
          iCur = to;
        else if(i > from && i <= to)
          iCur -= 1;
        else if(i < from && i >= to)
          iCur += 1;
        
        return iCur * (width / dataset.length);
      })				   
      .each("end", function(d, i){
        if(i == data.length - 1) 
          callback(data);
      });
}

/*
* draw animation which sets bar to the amount of other one
* @param - index of the source bar 
* @param - index of the target bar
* @param - particular dataset
* @param - callback to call next function iin query
*/
function drawEqual(source, target, data, callback){
    d3.select("#barChart").selectAll("rect")
      .transition()
      .duration(duration)
      .attr("height", function(d, i) {
          return scale(i == target ? data[source].d : d.d);
      })
      .attr("y", function(d, i) {
          return height - scale(i == target ? data[source].d : d.d);
      })
      .each("end", function(d, i){
        if(i == data.length - 1) 
          callback(data);
      });
}
/*
* draw animation which sets bar to the amount
* @param - value assegned to the bar
* @param - index of the bar
* @param - particular dataset
* @param - callback to call next function iin query
*/
function drawSet(amount, index, data, callback){
    d3.select("#barChart").selectAll("rect")
      .transition()
      .duration(duration)
      .attr("height", function(d, i) {
          return scale(i == index ? amount.d : d.d);
      })
      .attr("y", function(d, i) {
          return height - scale(i == index ? amount.d : d.d);
      })
      .each("end", function(d, i){
        if(i == data.length - 1) 
          callback(data);
        });
}

module.exports = SortVis;
	