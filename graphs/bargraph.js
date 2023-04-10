const data = [
    { disaster: "Chernobyl", fatalities: 4000, damage_cost: 2350 },
    { disaster: "Fukushima", fatalities: 0, damage_cost: 221.6 },
    { disaster: "Three Mile Island", fatalities: 0, damage_cost: 2.4 },
    // add more data as needed
  ];
  
  const margin = { top: 50, right: 20, bottom: 30, left: 90 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;
  
  const x = d3.scaleLinear()
    .range([0, width])
    .domain([0, d3.max(data, d => d.damage_cost)]);
  
  const y = d3.scaleBand()
    .range([0, height])
    .padding(0.1)
    .domain(data.map(d => d.disaster));
  
  const svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("width", d => x(d.damage_cost))
    .attr("height", y.bandwidth())
    .attr("y", d => y(d.disaster))
    .attr("fill", "steelblue");
  
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(10, "s"));
  
  svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(y));

    svg.selectAll(".text")
  .data(data)
  .enter().append("text")
  .attr("class", "label")
  .attr("x", d => x(d.damage_cost) + 5)
  .attr("y", d => y(d.disaster) + y.bandwidth() / 2 + 5)
  .text(d => d.damage_cost + "M")
  .attr("fill", "white");

// Adding a title to the chart
svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 0 - (margin.top / 2))
  .attr("text-anchor", "middle")
  .style("font-size", "18px")
  .text("Nuclear Disasters by Fatalities and Damage Cost");

// Adding a legend to the chart
const legend = svg.append("g")
  .attr("font-family", "sans-serif")
  .attr("font-size", 12)
  .attr("text-anchor", "end")
  .selectAll("g")
  .data(["Damage Cost (in millions)"])
  .enter().append("g")
  .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

legend.append("rect")
  .attr("x", width - 19)
  .attr("width", 19)
  .attr("height", 19)
  .attr("fill", "steelblue");

legend.append("text")
  .attr("x", width - 24)
  .attr("y", 9.5)
  .attr("dy", "0.32em")
  .text(d => d);