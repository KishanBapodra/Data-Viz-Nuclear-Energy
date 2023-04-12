
function barGraphDeaths(data) {
    
    console.log(data["Deaths per TWh of electricity production"]);   
    // set the dimensions and margins of the graph
    const deathMargin = {top: 20, right: 30, bottom: 50, left: 110},
    deathWidth = 660 - deathMargin.left - deathMargin.right,
    deathHeight = 600 - deathMargin.top - deathMargin.bottom;

    // append the svg object to the body of the page
    const deathSvg = d3.select("#deathBarGraph")
    .append("svg")
    .attr("width", deathWidth + deathMargin.left + deathMargin.right)
    .attr("height", deathHeight + deathMargin.top + deathMargin.bottom)
    .append("g")
    .attr("transform", `translate(${deathMargin.left}, ${deathMargin.top})`);

    // Add X axis
    const x = d3.scaleSqrt()
    .domain([0, d3.max(data, d => parseInt(d["Deaths per TWh of electricity production"]))])
    .range([ 0, deathWidth]);
    deathSvg.append("g")
    .style("font-size", "0.9em")
    .attr("transform", `translate(0, ${deathHeight})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

    // Y axis
    const y = d3.scaleBand()
    .range([ 0, deathHeight ])
    .domain(data.map(d => d.Entity))
    .padding(.1);
    deathSvg.append("g")
    .style("font-size", "0.9em")
    .call(d3.axisLeft(y))

    const barGraphDeathTooltip = d3.select("#fatalities")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
  
    const mouseOver = (event, d) => {
      barGraphDeathTooltip.style("opacity", 1).style("display", "block");
    };
  
    const mouseMove = (event, d) => {
      barGraphDeathTooltip
          .html('<u>' + d.Entity + '</u>' + "<br>" + "Deaths per terawatt-hour of energy production: " + parseFloat(d["Deaths per TWh of electricity production"]))
          .style("position", "fixed")
          .style("width","17em")
          .style("left", (event.x + 15) + "px")
          .style("background-color", "lightskyblue")
          .style("top", (event.y - (scrollY/50) + "px"))
    };
  
    const mouseLeave = (event, d) => {
      barGraphDeathTooltip.style("opacity", 0).style("display", "none");
    }
  
    //Bars
    deathSvg.selectAll("myRect")
    .data(data)
    .join("rect")
    .attr("x", x(0) )
    .attr("y", d => y(d.Entity))
    .attr("width", d => x(d["Deaths per TWh of electricity production"]))
    .attr("height", y.bandwidth())
    .attr("fill", "#d2691e")
    .on("mouseover", mouseOver) 
    .on("mousemove", mouseMove)
    .on("mouseleave", mouseLeave);

}