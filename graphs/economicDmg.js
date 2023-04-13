
function economicDmg(data) {
    
    const container = document.getElementById("economic-dmg");
    const rect = container.getBoundingClientRect();

    const bubbleSvgHeight = rect.height;
    
    // set the dimensions and margins of the graph
    const bubbleWidth = rect.width;
    const bubbleHeight = rect.height-20;

    // append the svg object to the body of the page
    const bubbleSvg = d3.select("#economic-dmg")
      .append("svg")
        .attr("width", bubbleWidth)
        .attr("height", bubbleSvgHeight)
        .attr("class", "eco-bubble-svg");
    
    data = data.filter(d => parseInt(d.Cost) > 0 && d.Cost !== "" )

    // create x scale
    const x = d3.scaleLinear()
      .domain([d3.min(data, d=>parseInt(d.Cost)),d3.max(data, d => parseInt(d.Cost))])
      .range([12, 60]);
    
    // create a tooltip
    const bubbleTooltip = d3.select("#economic-dmg")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "0.3em");

    bubbleSvg.append("text")
    .attr("x", bubbleWidth/2)
    .attr("y", bubbleSvgHeight-55)
    .attr("text-anchor", "middle")
    .style("font-size", "1.2em")
    .style("fill", "black") 
    .text("Economic Damage caused by Nuclear Power Plant Accidents")    

    const mouseOver = (event, d) => {
      bubbleTooltip.style("opacity", 1).style("display", "block");
      d3.selectAll(".accident")
        .transition()
        .duration(100)
        .style("opacity", .35);
        d3.selectAll(`.${d.Location.split(", ")[1]}`)        
        .transition()
        .duration(100)
        .style("opacity", 1)
        .style("stroke", "black")
    };

    const mouseMove = (event, d) => {
      bubbleTooltip
          .html('<u>' + d.Location + '</u>' + "<br>" + "Economic Cost (in millions): " + parseInt(d.Cost)  + "<br>" + "Description: " + d.Description)
          .style("position", "fixed")
          .style("width","17em")
          .style("background-color", "lightskyblue")
          .style("left", (event.x + 15) + "px")
          .style("top", (event.y - (scrollY/5)) + "px");
    };

    const mouseLeave = (event, d) => {
      bubbleTooltip.style("opacity", 0).style("display", "none");
      d3.selectAll(".accident")
        .transition()
        .duration(100)
        .style("opacity", 1);
    }

    // create color scale
    const randomColor = d3.scaleOrdinal()
                        .range(d3.schemeCategory10);

    // append circle elements to svg
    const node = bubbleSvg.append("g")
        .selectAll("circle")
        .data(data)
        .join("circle")
          .attr("class", d => `accident ${d.Location.split(", ")[1]}`)
            .attr("r", d => x(d.Cost))
            .attr("cx", bubbleWidth / 2)
            .attr("cy", bubbleHeight / 2)
            .style("fill", () => randomColor(Math.random()))
            .style("fill-opacity", 0.8)
            .attr("stroke", "black")
            .style("stroke-width", 4)
            .on("mouseover", mouseOver) 
            .on("mousemove", mouseMove)
            .on("mouseleave", mouseLeave);

    // Features of the forces applied to the nodes:
    // const simulation = d3.forceSimulation()
    //   .force('charge',d3.forceManyBody().strength(-3))
    //   .force('center', d3.forceCenter(bubbleWidth/2,bubbleHeight/2))

      // Features of the forces applied to the nodes:
    const simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(bubbleWidth / 2).y(bubbleHeight / 2)) // Attraction to the center of the svg area
      .force("charge", d3.forceManyBody().strength(0.1)) // Nodes are attracted one each other of value is > 0
      .force("collide", d3.forceCollide().strength(0.2).radius(function(d){return (x(d.Cost)+4) }).iterations(1)) // Force that avoids circle overlapping


    simulation
      .nodes(data)
      .on("tick", (d) => {
        node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);
    });
}