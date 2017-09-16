var width = window.innerWidth, height = window.innerHeight, sizeDivisor = 300, nodePadding = 0;

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var simulation = d3.forceSimulation()
    // .force("forceX", d3.forceX().strength(.1).x(width * .5))
    // .force("forceY", d3.forceY().strength(.1).y(height * .5))
    // .force("center", d3.forceCenter().x(width * .5).y(height * .5))
    // .force("charge", d3.forceManyBody().strength(-15));
    .force("forceX", d3.forceX().strength(.1).x(width * .5))
    .force("forceY", d3.forceY().strength(.1).y(height))
    .force("center", d3.forceCenter().x(width * .5).y(175))
    .force("charge", d3.forceManyBody().strength(-15));

d3.csv("assets/name_data.csv", types, function(error, graph){
  if (error) throw error;

  // sort the nodes so that the bigger ones are at the back
  graph = graph.sort(function(a,b){ return b.size - a.size; });

  //update the simulation based on the data
  simulation
    .nodes(graph)
    .force("collide", d3.forceCollide().strength(1).radius(function(d){ return d.radius + nodePadding; }).iterations(1));
    // .on("tick", function(d){
    //   node
    //   .attr("cx", function(d){ return d.x; })
    //   .attr("cy", function(d){ return d.y; })
    // });

  var circle = svg.append("g").selectAll("circle")
   .data(graph)
   .enter().append("circle")
    .attr("r", 500)
    .attr("cx", 500)
    .attr("cy", 500)
    .attr("class", "node");
  //     .call(simulation.drag);

  var text = svg.append("g").selectAll("text")
    .data(graph)
  .enter().append("text")
    .attr("x", 8)
    .attr("y", ".31em")
    .text(function(d) { return d.name; });

});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(.03).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(.03);
  d.fx = null;
  d.fy = null;
}

function types(d){
  d.occurrences = +d.occurrences;
  d.size = +d.occurrences / sizeDivisor;
  d.size < 3 ? d.radius = 3 : d.radius = d.size;
  return d;
}
