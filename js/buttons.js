var d3 = require('d3')

function buttons(size, container, foo){
    
  d3.select(container)
            .append("svg")
            .attr("id", "guiButtons")
            .attr("width", 7 * size)
            .attr("height", size);
  
  d3.select('#guiButtons').selectAll("rect")
    .remove()
    .data(foo)
    .enter()
    .append("rect")
    .attr("id", "button")
    .attr("x", function(d, i) {
        return i * (size * 7 / foo.length);
    })
    .attr("y", 0)				   
    .attr("width", size)
    .attr("height", size)
    .attr("fill", '#000')
    .on('click', function(){alert('test');});
}

module.exports = buttons