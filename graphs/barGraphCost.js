
function barGraphCost(data) {

    // set the dimensions and margins of the graph
    const barGraphCostMargin = {top: 30, right: 30, bottom: 110, left: 60};
    const barGraphCostWidth = 760 - barGraphCostMargin.left - barGraphCostMargin.right;
    const barGraphCostHeight = 360 - barGraphCostMargin.top - barGraphCostMargin.bottom;
    
    data = data.filter(d => d.Type !== 'Hydro');

    // append the svg object to the body of the page
    const barGraphCostSvg = d3.select("#cost")
    .append("svg")
      .attr("width", barGraphCostWidth + barGraphCostMargin.left + barGraphCostMargin.right)
      .attr("height", barGraphCostHeight + barGraphCostMargin.top + barGraphCostMargin.bottom)
    .append("g")
      .attr("transform", `translate(${barGraphCostMargin.left},${barGraphCostMargin.top})`);
  
    // X axis
    const x = d3.scaleBand()
    .range([ 0, barGraphCostWidth ])
    .domain(data.map(d => d.Type))
    .padding(0.2);
    
    barGraphCostSvg.append("g")
    .attr("transform", `translate(0,${barGraphCostHeight})`)
    .transition()
    .duration(2000)
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");
    
    // Add Y axis
    const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d["Lazard 2021"])])
    .range([ barGraphCostHeight, 0]);
    barGraphCostSvg.append("g")
    .transition()
    .duration(1000)
    .call(d3.axisLeft(y));
  
    var barGraphCostTooltip = d3.select("#cost")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

    const mouseOver = (event, d) => {
      barGraphCostTooltip.style("opacity", 1).style("display", "block");
    };
  
    const mouseMove = (event, d) => {
      barGraphCostTooltip
          .html('<u>' + d.Type + '</u>' + "<br>" + "Cost: $" + d["Lazard 2021"] + " per MWh")
          .style("position", "fixed")
          .style("width","17em")
          .style("left", (event.x + 15) + "px")
          .style("background-color", "lightskyblue")
          .style("top", (event.y - (scrollY/5)) + "px");
    };
  
    const mouseLeave = (event, d) => {
      barGraphCostTooltip.style("opacity", 0).style("display", "none");
    }
  
    // Bars
    barGraphCostSvg.selectAll("mybar")
    .data(data)
    .join("rect")
      .attr("class",d => {
        let typ = d.Type.replace(" ","-")
        return `costs ${typ}`
      })
      .attr("x", d => x(d.Type))
      .attr("width", x.bandwidth())
      .attr("fill", "#d2691e")
      .attr("stroke", "black")
      // no bar at the beginning thus:
      .attr("height", d => barGraphCostHeight - y(0)) // always equal to 0
      .attr("y", d => y(0))
      .on("mouseover", mouseOver) 
      .on("mousemove", mouseMove)
      .on("mouseleave", mouseLeave);
  
    // Animation
    barGraphCostSvg.selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", d => y(d["Lazard 2021"]))
    .attr("height", d => barGraphCostHeight - y(d["Lazard 2021"]))
    .delay((d,i) => {return i*400})
  
    barGraphCostSvg.append("text")
    .attr("x", barGraphCostWidth/2)
    .attr("y", barGraphCostHeight + 104)
    .attr("text-anchor", "middle")
    .style("font-size", "1.2em")
    .style("fill", "black") 
    .text("Cost of producing electricity by different fuel types"); 
  }
    