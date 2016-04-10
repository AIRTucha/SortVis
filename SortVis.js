"use strict"
var dataset;
var comparator;
var width;
var height;
var iColor;
var jColor;
var trueColor;
var falseColor;
var scale;
var duration;

var mainColor = "#AAAAAA";

function SortVis(size, comp, w, h, du, iColor, jColor, trueColor, falseColor, mColor){
  dataset = randomArray(size);
  comparator = comp;
  width = w * 0.99;
  height = h * 0.99;
  duration = du;
  mainColor = mColor;

  this.randomArray = randomArray;
  this.drawBarChart = drawBarChart;
  this.trueBarChart = updateBarChart(trueColor, trueColor);
  this.falseBarChar = updateBarChart(falseColor, falseColor);
  this.updateBarChart = updateBarChart(mainColor, mainColor);
  this.updateBarChartIJ = updateBarChart(iColor, jColor);
  this.compare = compare;
  this.forArea = forArea;
  this.swap = swap;
  this.moveTo = moveTo;
  
  d3.select("#chart")
            .append("svg")
            .attr("id", "barChart")
            .attr("width", width)
            .attr("height", height)
            .selectAll("*").remove();
  
  scale = d3.scale.linear()
            .domain([0, 1])
            .range([0, height]);
  

  return this;
}

function randomArray(sizeOfArray){
  var a = [];
  
  for(var i = 0; i < sizeOfArray; i++)
    a.push(Math.random()%100);
  
  return a;
}
          
function drawBarChart(){
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
  return function(fIndex, sIndex){
    console.log("called");
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
        if(i == fIndex)
          return firstColor;
        else if(i == sIndex)
          return secondColor;
        else 
          return mainColor;
      });
  }
}

function compare(a, b, trueCallback, falseCallback){

}

function forArea(iStart, iFinish, callback){
  
}

function swap(){
  
  console.log(dataset);

}

function moveTo(){
  
}

	