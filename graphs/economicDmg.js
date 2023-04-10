
function economicDmg(data) {
    // set the dimensions and margins of the graph
    const width = 600;
    const height = 600;

    // append the svg object to the body of the page
    const svg = d3.select("#economic-dmg")
      .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "eco-bubble-svg");
    
    // create x scale
    const x = d3.scaleOrdinal()
      .domain([0,d3.max(data, d => d.Cost)])
      .range([3, 20]);

    // create color scale
    const randomColor = d3.scaleOrdinal()
                        .range(d3.schemeCategory10);

    // append circle elements to svg
    const node = svg.append("g")
        .selectAll("circle")
        .data(data)
        .join("circle")
            .attr("r", d => x(d.Cost))
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .style("fill", d => randomColor(Math.random()))
            .style("fill-opacity", 0.8)
            .attr("stroke", "black")
            .style("stroke-width", 4)

    // create force simulation
    const simulation = d3.forceSimulation(data)
    .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
    .force("charge", d3.forceManyBody().strength(1)) // Nodes are attracted one each other of value is > 0
    .force("collide", d3.forceCollide().strength(.1).radius(30).iterations(1)) // Force that avoids circle overlapping

    simulation.on("tick", () => {
      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    });
}