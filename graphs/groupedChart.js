
function barGraphCostComparison(data) {
  // set the dimensions and margins of the graph
  const CompMargin = {top: 90, right: 210, bottom: 40, left: 50},
  CompWidth = 1200 - CompMargin.left - CompMargin.right,
  CompHeight = 600 - CompMargin.top - CompMargin.bottom;
      
  const filteredData = data.map(obj => {
    const {"Lazard 2021": ageRange, ...rest} = obj;
    return rest;
  });

  // append the svg object to the body of the page
  const GroupedSvg = d3.select("#comparison")
  .append("svg")
    .attr("width", CompWidth + CompMargin.left + CompMargin.right)
    .attr("height", CompHeight + CompMargin.top + CompMargin.bottom)
  .append("g")
    .attr("transform",`translate(${CompMargin.left},${CompMargin.top})`);

  // List of subgroups = header of the csv files = soil condition here
  const subgroups = Object.keys(filteredData[0]).slice(1)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  const groups = filteredData.map(d => d.Type)

  // Add X axis
  const x = d3.scaleBand()
      .domain(groups)
      .range([0, CompWidth])
      .padding([0.3])
  GroupedSvg.append("g")
    .style("font-size", "0.9em")
    .attr("transform", `translate(0, ${CompHeight})`)
    .call(d3.axisBottom(x).tickSize(0))
    .selectAll("text")
    .attr("dy", "1.3em");
    
  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 190])
    .range([ CompHeight, 0 ]);
  GroupedSvg.append("g")
    .call(d3.axisLeft(y));

  // Another scale for subgroup position?
  const xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

  // color palette = one color per subgroup
  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(d3.schemeCategory10)

  const barGraphGroupedTooltip = d3.select("#comparison")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
  
    const mouseOver = (event, d) => {
      barGraphGroupedTooltip.style("opacity", 1).style("display", "block");
    };
  
    const mouseMove = (event, d) => {
      barGraphGroupedTooltip
          .html('<u>' + d.key + '</u>' + "<br>" + "Levelized Cost of energy (LCOE): " + parseInt(d.value) + " US$ per MWh")
          .style("position", "fixed")
          .style("width","17em")
          .style("left", (event.x + 15) + "px")
          .style("background-color", "lightskyblue")
          .style("top", (event.y - (scrollY/20)) + "px");
    };
  
    const mouseLeave = (event, d) => {
      barGraphGroupedTooltip.style("opacity", 0).style("display", "none");
    }

  // Show the bars
  const bars = GroupedSvg.append("g")
    .selectAll("g")
    .data(filteredData)
    .join("g")
      .attr("transform", d => `translate(${x(d.Type)}, 0)`)
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .join("rect")
      .attr("x", d => xSubgroup(d.key))
      .attr("width", xSubgroup.bandwidth())
      .attr("y", d=> y(0))
      .attr("height", d => CompHeight - y(0))
    .on("mouseover", mouseOver) 
    .on("mousemove", mouseMove)
    .on("mouseleave", mouseLeave)
      .transition()
      .duration(3000)
      .delay(2500)
      .attr("y", d => y(d.value))
      .attr("height", d => CompHeight - y(d.value))
      .attr("fill", d => color(d.key));

  GroupedSvg.append('text')
    .attr("x", 0)
    .attr("y", -45)
    .attr("text-anchor", "start")
    .style("font-size", "1.2em")
    .style("fill", "black") 
    .text( "Levelized Cost of Energy by different sources (measured in US$ per MWh)");


  // Define legend items
  const legendItems = subgroups.map(subgroup => ({
    name: subgroup,
    color: color(subgroup)
  }));
  
  // Add legend
  const legend = GroupedSvg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${CompWidth},10)`);
  
  legend.selectAll("rect")
    .data(legendItems)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", (d, i) => i * 20)
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", d => d.color);
  
  legend.selectAll("text")
    .data(legendItems)
    .enter()
    .append("text")
    .attr("x", 15)
    .attr("y", (d, i) => i * 20 + 9)
    .text(d => d.name)
    .attr("text-anchor", "left")
    .style("font-size", "12px")
    .style("font-family", "Arial, sans-serif");

}