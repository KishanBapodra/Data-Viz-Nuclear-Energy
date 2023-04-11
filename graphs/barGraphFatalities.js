
function barGraphAccidents(data) {

  // set the dimensions and margins of the graph
  const barGraphAccidentMargin = {top: 30, right: 30, bottom: 110, left: 60};
  const barGraphAccidentWidth = 460 - barGraphAccidentMargin.left - barGraphAccidentMargin.right;
  const barGraphAccidentHeight = 450 - barGraphAccidentMargin.top - barGraphAccidentMargin.bottom;

  data = data.filter(d => d.Fatalities > 10).map(d => {return {...d, "Location": d.Location.split(", ")[1]}})
  
  // append the svg object to the body of the page
  const barGraphAccidentSvg = d3.select("#fatalities")
  .append("svg")
    .attr("width", barGraphAccidentWidth + barGraphAccidentMargin.left + barGraphAccidentMargin.right)
    .attr("height", barGraphAccidentHeight + barGraphAccidentMargin.top + barGraphAccidentMargin.bottom)
  .append("g")
    .attr("transform", `translate(${barGraphAccidentMargin.left},${barGraphAccidentMargin.top})`);

  // X axis
  const x = d3.scaleBand()
  .range([ 0, barGraphAccidentWidth ])
  .domain(data.map(d => d.Location))
  .padding(0.2);
  
  barGraphAccidentSvg.append("g")
  .attr("transform", `translate(0,${barGraphAccidentHeight})`)
  .transition()
  .duration(1000)
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
  const y = d3.scaleLinear()
  .domain([0, d3.max(data, d => parseInt(d.Fatalities))])
  .range([ barGraphAccidentHeight, 0]);

  barGraphAccidentSvg.append("g")
  .transition()
  .duration(1000)
  .call(d3.axisLeft(y));

  const barGraphAccidentTooltip = d3.select("#fatalities")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "10px")

  const mouseOver = (event, d) => {
    barGraphAccidentTooltip.style("opacity", 1).style("display", "block");
  };

  const mouseMove = (event, d) => {
    barGraphAccidentTooltip
        .html('<u>' + d.Location + '</u>' + "<br>" + "Fatalities: " + parseInt(d.Fatalities) + "<br>" + d.Description)
        .style("position", "fixed")
        .style("width","17em")
        .style("left", (event.x + 15) + "px")
        .style("background-color", "lightskyblue")
        .style("top", (event.y - (scrollY/5)) + "px");
  };

  const mouseLeave = (event, d) => {
    barGraphAccidentTooltip.style("opacity", 0).style("display", "none");
  }

  // Bars
  barGraphAccidentSvg.selectAll("mybar")
  .data(data)
  .join("rect")
    .attr("x", d => x(d.Location))
    .attr("width", x.bandwidth())
    .attr("fill", "#d2691e")
    .attr("stroke", "black")
    // no bar at the beginning thus:
    .attr("height", d => barGraphAccidentHeight - y(0)) // always equal to 0
    .attr("y", d => y(0))
    .on("mouseover", mouseOver) 
    .on("mousemove", mouseMove)
    .on("mouseleave", mouseLeave);

  // Animation
  barGraphAccidentSvg.selectAll("rect")
  .transition()
  .duration(800)
  .attr("y", d => y(parseInt(d.Fatalities)))
  .attr("height", d => barGraphAccidentHeight - y(parseInt(d.Fatalities)))
  .delay((d,i) => {return i*400})

  barGraphAccidentSvg.append("text")
  .attr("x", barGraphAccidentWidth/2)
  .attr("y", barGraphAccidentHeight + 90)
  .attr("text-anchor", "middle")
  .style("font-size", "1.2em")
  .style("fill", "black") 
  .text("Number of Fatalities of the major accidents") 
  
}
  