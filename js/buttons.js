var d3 = require('d3')

function buttons(size, container){//, stepBack, stepForward, goBack, goForward, stop, reset){
  d3.select(container)
            .append("svg")
            .attr("id", "menuButtons")
            .attr("width", size*10)
            .attr("height", size);

  
  goBackButton(size, function(){});
}

function stepBackButton(size, callback){
  size -=2;
  var points = [
        {"x":size*1.1 + 2,"y":size/2},
        {"x":size*2.1,"y":size},
        {"x":size*2.1,"y":2}
  ];
  
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
    .attr("stroke-width",2)
    .attr("fill", "#FFFFFF")
    .on('click', function(){
      d3.select('#backStepButton').attr('fill','#AAAAAA');
      
      d3.select('#backStepButton').attr('fill','#FFFFFF')
    })
    .on("mouseout", function(){
      d3.select('#backStepButton').attr('fill','#FFFFFF');
    });;
}

function goBackButton(size, callback){
  size -= size/10;
  var points = [
        {"x":size/10,"y":size/2 + size/40},
        {"x":size,"y":size},
        {"x":size,"y":2*size/3 + 2 * size/30},
        {"x":size*1.5,"y":size},
        {"x":size*1.5,"y":size/10},
        {"x":size,"y":size/3},
        {"x":size,"y":size/10}
  ];
  
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
      d3.select('#backGoButton').attr('fill','#AAAAAA');
      
      d3.select('#backStepButton').attr('fill','#FFFFFF')
    })
    .on("mouseout", function(){
      d3.select('#backGoButton').attr('fill','#FFFFFF');
    });;
}

module.exports = buttons