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

var inRun = false;

function SortVis(size, comp, w, h, du, iColor, jColor, trueColor, falseColor, mColor){
  var obj = {};

  var sorting = insertionSort();
  var forwardLoop =  reLoop(function(a){return a+1;});
  var backwardLoop =  reLoop(function(a){return a-1;});  
  
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
    inRun = true;
    forwardLoop(callback);
  };
  
  obj.backwardAnimation = function(callback){
    inRun = true;
    backwardLoop(callback);
  };
  
  obj.intervalAnimation = function(end){
    step = end;
    inRun = false; 
    sortingLog[step](function(a, b, data){drawBarChart(data);});
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
  
  startBarChart(dataset);
  
  return obj;
}

function selectionSort(){
  return function(compare){
    var sLog = [];
    var bufferDataset = dataset.slice(0);

    sLog.push(wraper(1, 2, dataset.length, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));
    
    for(var i = 0; i < dataset.length - 1; i++){
      var p = i;
      sLog.push(wraper(i, j, p, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));
      for(var j = i+1; j < dataset.length; j++){ 
        if(compare(dataset[j].d, dataset[p].d)){
          p = j;
        }
        sLog.push(wraper(i, j, p, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));
      }
      if(p != i){
        sLog.push(wraper(p, i, p, dataset.slice(0), function(a, b, p, data, cb){drawSwap(a, b, p, data, cb);}));
        swap(p, i);
      }
    }
    
    sLog.push(wraper(1, 2, dataset.length, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));
    
    dataset = bufferDataset;
    return sLog;
  }
}

function bubbleSort(){
  return function(compare){
    var sLog = [];
    var bufferDataset = dataset.slice(0);

     sLog.push(wraper(1, 2, dataset.length, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));
    
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
    sLog.push(wraper(j, j+1, dataset.length, dataset.slice(0), function(a, b, p, data){
      updateBarChart(a, b, p, data, drawBarChart(data))
    }));
    
    dataset = bufferDataset;

    return sLog;
  }
}

function cocktailSort(){
  return function(compare){
    var sLog = [];
    var bufferDataset = dataset.slice(0);
    sLog.push(wraper(j, j+1, dataset.length, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));

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
    
    sLog.push(wraper(i, j, dataset.length, dataset.slice(0), function(a, b, p, data){
      updateBarChart(a, b, p, data, drawBarChart(data))
    }));
    
    dataset = bufferDataset;

    return sLog;
    
  }
}

function insertionSort(){
  return function (compare){
  var sLog = [];
  var bufferDataset = dataset.slice(0);
  
  sLog.push(wraper(j, j+1, dataset.length, dataset.slice(0), function(a, b, p, data, cb){updateBarChart(a, b, p, data, cb)}));

  
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
  
      
    sLog.push(wraper(i, j, dataset.length, dataset.slice(0), function(a, b, p, data){
      updateBarChart(a, b, p, data, drawBarChart(data))
    }));
      dataset = bufferDataset;

    return sLog;
  }
}

function swap(a, b){
  var buffer = dataset[a];
  
  dataset[a] = dataset[b];
  dataset[b] = buffer;
}

function reLoop(foo){
  return function (callback){
    if(inRun){
      callback();
       step = foo(step);
        if(step < sortingLog.length && step >= 0)
          sortingLog[step](function(){ 
           reLoop(foo)(callback); 
          });
        else 
          step = 0 > step ?  0 : sortingLog.length - 1;
    }
  } 
}

function stepAnimation(foo){
  return function (){
    inRun = false;
    
    step = foo(step);
    if(sortingLog.length > step && step >= 0)
      sortingLog[step](function(a, b, p, data){drawBarChart(data)});
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
              callback(a, b, p, data);
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
          callback(a, b, p, data);
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
          callback(a, b, p, data);
        });
}



module.exports = SortVis;
	