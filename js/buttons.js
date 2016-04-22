var d3 = require('d3')

function buttons(size, container, goBack, stepBack, stopReset, stepForward,  goForward){
  d3.select(container)
            .append("svg")
            .attr("id", "menuButtons")
            .attr("width", size*7)
            .attr("height", size);
  size *=0.9;
  
  var obj = {};
  
  obj.setStop = function(){
    stopButton(size, obj, stopReset);
  };
  
  obj.setReset = function(){
    resetButton(size, obj, stopReset);
  };
  
  obj.reDraw = function(){
      d3.select(container).selectAll('*').remove();
      d3.select(container)
            .append("svg")
            .attr("id", "menuButtons")
            .attr("width", size*7)
            .attr("height", size);
      
      goBackButton(size, obj, goBack);
      stepBackButton(size, obj, stepBack);
      resetButton(size, obj, stopReset);
      stepForwardButton(size, obj, stepForward);
      goForwardButton(size, obj, goForward);
  }
  
  goBackButton(size, obj, goBack);
  stepBackButton(size, obj, stepBack);
  resetButton(size, obj, stopReset);
  stepForwardButton(size, obj, stepForward);
  goForwardButton(size, obj, goForward);
  
  return obj;
}

function goBackButton(size, obj, callback){
  var points = [
        {"x":size/10,"y":size/2 + size/40},
        {"x":size,"y":size},
        {"x":size,"y":2*size/3 + 2 * size/30},
        {"x":size*1.5,"y":size},
        {"x":size*1.5,"y":size/10},
        {"x":size,"y":size/3},
        {"x":size,"y":size/10}
  ];
  
  d3.selectAll('#backGoButton').remove();
  
  d3.select('#menuButtons')
    .append("polygon")
    .attr('id', 'backGoButton')
    .attr('class', 'element')
    .attr("points",function() { 
        return points.map(function(d) {
            return [d.x,d.y].join(",");
        }).join(" ");
    })
    .attr("stroke", "#AAAAAA")
    .attr("stroke-width", size/10)
    .attr("fill", "#FFFFFF")
    .on('click', function(){
      d3.select('#backGoButton').attr('stroke','#AA0077');
      callback(obj);
    })
    .on("mouseout", function(){
      d3.select('#backGoButton').attr('stroke','#AAAAAA');
    });;
}

function stepBackButton(size, obj, callback){
  var offset = size * 1.7
  var points = [
        {"x":offset + size/10,"y":size/2 + size/20},
        {"x":size+offset,"y":size},
        {"x":size+offset,"y":size/10}
  ];
  
  d3.selectAll('#backStepButton').remove();
  
  d3.select('#menuButtons')
    .append("polygon")
    .attr('id', 'backStepButton')
    .attr('class', 'element')
    .attr("points",function() { 
        return points.map(function(d) {
            return [d.x,d.y].join(",");
        }).join(" ");
    })
    .attr("stroke", "#AAAAAA")
    .attr("stroke-width", size/10)
    .attr("fill", "#FFFFFF")
    .on('click', function(){
      d3.select('#backStepButton').attr('stroke','#AA0077');
      callback(obj);
    })
    .on("mouseout", function(){
      d3.select('#backStepButton').attr('stroke','#AAAAAA');
    });;
}

function stopButton(size, obj, callback){
  var offset = size * 2.9
  var stopPoints1 = [
        {"x":offset + size/10,"y": size/10},
        {"x":2*size/5 + offset,"y": size/10},
        {"x":2*size/5 + offset,"y": size},
        {"x":offset + size/10,"y": size},  
  ];
  
    var stopPoints2 = [
        {"x":3*size/5 + offset + size/10,"y": size/10},
        {"x":size + offset,"y": size/10},
        {"x":size + offset,"y": size},
        {"x":3*size/5 + offset + size/10,"y": size},  
  ];
  
  var backgound = [
     {"x":offset + size/10,"y": size/10},
     {"x":offset + size/10,"y": size},  
     {"x":size + offset,"y": size},
     {"x":size + offset,"y": size/10},
    
  ]
  
  d3.selectAll('#srButton').remove();
  
  d3.select('#menuButtons')
    .append('g')
    .attr('id', 'srButton')
    .attr('class', 'element')
    .on('click', function(){
       callback(obj);
       resetButton(size, obj, callback);
    });
  
    d3.select('#srButton')
    .append("polygon")
    .attr("points",function() { 
        return backgound.map(function(d) {
            return [d.x,d.y].join(",");
        }).join(" ");
    })
    .attr("stroke-width", 0)
    .attr("fill", "#FFFFFF");
  
    d3.select('#srButton')
    .append("polygon")
    .attr("points",function() { 
        return stopPoints1.map(function(d) {
            return [d.x,d.y].join(",");
        }).join(" ");
    })
    .attr("stroke", "#AAAAAA")
    .attr("stroke-width", size/10)
    .attr("fill", "#FFFFFF");  
  
  d3.select('#srButton')
    .append("polygon")
    .attr("points",function() { 
        return stopPoints1.map(function(d) {
            return [d.x,d.y].join(",");
        }).join(" ");
    })
    .attr("stroke", "#AAAAAA")
    .attr("stroke-width", size/10)
    .attr("fill", "#FFFFFF");
  
  d3.select('#srButton')
    .append("polygon")
    .attr("points",function() { 
        return stopPoints2.map(function(d) {
            return [d.x,d.y].join(",");
        }).join(" ");
    })
    .attr("stroke", "#AAAAAA")
    .attr("stroke-width", size/10)
    .attr("fill", "#FFFFFF");
}

function resetButton(size, obj, callback){
  var offset = size * 2.9
  
  var resetPoints = [
        {"x":offset + size/10,"y": size/10},
        {"x":size + offset,"y": size/10},
        {"x":size+offset,"y": size},
        {"x":offset + size/10,"y": size},
  ];
  
  d3.selectAll('#srButton').remove();
  
  d3.select('#menuButtons')
    .append("polygon")
    .attr('id', 'srButton')
    .attr('class', 'element')
    .attr("points",function() { 
        return resetPoints.map(function(d) {
            return [d.x,d.y].join(",");
        }).join(" ");
    })
    .attr("stroke", "#AAAAAA")
    .attr("stroke-width", size/10)
    .attr("fill", "#AAAAAA")
    .on('click', function(){
      callback(obj);
      resetButton(size, obj, callback);
    });
}

function stepForwardButton(size, obj, callback){
  var offset = size * 4.2;
  
  var points = [
        {"x":offset + size,"y":size/2 + size/20},
        {"x":offset + size/10,"y":size},
        {"x":offset + size/10,"y":size/10}
  ];
  
  d3.selectAll('#forwardStepButton').remove();
  
  d3.select('#menuButtons')
    .append("polygon")
    .attr('id', 'forwardStepButton')
    .attr('class', 'element')
    .attr("points",function() { 
        return points.map(function(d) {
            return [d.x,d.y].join(",");
        }).join(" ");
    })
    .attr("stroke", "#AAAAAA")
    .attr("stroke-width", size/10)
    .attr("fill", "#FFFFFF")
    .on('click', function(){
      callback(obj);
      d3.select('#forwardStepButton').attr('stroke','#AA0077');
      
    })
    .on("mouseout", function(){
      d3.select('#forwardStepButton').attr('stroke','#AAAAAA');
    });
}

function goForwardButton(size, obj, callback){
  var offset = size * 5.5;
  
  var points = [
        {"x":offset + size*1.5,"y":size/2 + size/40},
        {"x":offset + size*0.5 +size/10,"y":size},
        {"x":offset + size*0.5 +size/10,"y":2*size/3 + 2 * size/30},
        {"x":offset + size/10,"y":size},
        {"x":offset + size/10,"y":size/10},
        {"x":offset + size*0.5 +size/10,"y":size/3},
        {"x":offset + size*0.5 +size/10,"y":size/10}
  ];
  
  d3.selectAll('#forwardGoButton').remove();
  
  d3.select('#menuButtons')
    .append("polygon")
    .attr('id', 'forwardGoButton')
    .attr('class', 'element')
    .attr("points",function() { 
        return points.map(function(d) {
            return [d.x,d.y].join(",");
        }).join(" ");
    })
    .attr("stroke", "#AAAAAA")
    .attr("stroke-width", size/10)
    .attr("fill", "#FFFFFF")
    .on('click', function(){
      callback(obj);
      d3.select('#forwardGoButton').attr('stroke','#AA0077');
      
    })
    .on("mouseout", function(){
      d3.select('#forwardGoButton').attr('stroke','#AAAAAA');
    });
}

module.exports = buttons