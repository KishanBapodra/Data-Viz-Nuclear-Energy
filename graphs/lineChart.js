
// set the dimensions and margins of the graph
    const lineMargin = {top: 50, right: 30, bottom: 80, left: 50},
        lineWidth = 660 - lineMargin.left - lineMargin.right,
        lineHeight = 660 - lineMargin.top - lineMargin.bottom;

    // append the svg object to the body of the page
    const lineSvg = d3.select("#line")
    .append("svg")
        .attr("width", lineWidth + lineMargin.left + lineMargin.right)
        .attr("height", lineHeight + lineMargin.top + lineMargin.bottom)
    .append("g")
        .attr("transform", `translate(${lineMargin.left},${lineMargin.top})`);

    // Initialise a X axis:
    const x = d3.scaleLinear().range([0,lineWidth]);
    
    const xAxis = d3.axisBottom().scale(x);
    
    lineSvg.append("g")
    .attr("transform", `translate(0, ${lineHeight})`)
    .attr("class","myXaxis")
    .call(g => g.append("text")
        .attr("x", lineWidth)
        .attr("y", lineMargin.bottom -45)
        .attr("fill", "black")
        .attr("text-anchor", "end")
        .text("Timeline →"));

    // Initialize an Y axis
    const y = d3.scaleLinear().range([lineHeight, 0]);
    
    const yAxis = d3.axisLeft().scale(y);
    
    lineSvg.append("g")
    .attr("class","myYaxis")
    .call(g => g.append("text")
    .attr("x", -lineMargin.left + 20)
    .attr("y", -15)
    .attr("fill", "black")
    .attr("text-anchor", "start")
    .text(d => "↑ Electricity from Nuclear Energy (TWh)"));

    const timeFormat = d3.timeFormat("%Y")

    lineSvg.append('text')
        .attr("x", lineWidth/2)
        .attr("y", lineHeight + 65)
        .attr("text-anchor", "middle")
        .style("font-size", "1.2em")
        .style("fill", "black") 
        .text(() => {
          return "Timeline of Nuclear Energy Generation from 1965-2021.";
        })
    
    // Create a function that takes a dataset as input and update the plot:
    function update(data) {

        d3.select('#text-line').remove();
        // Create the X axis:
        x.domain([timeFormat(new Date(1965, 0, 1)), timeFormat(new Date(2021, 0, 1))]);
        lineSvg.selectAll(".myXaxis").transition()
            .duration(3000)
            .call(xAxis);

        // create the Y axis
        y.domain([0, d3.max(data, function(d) { return parseInt(d["Electricity from nuclear (TWh)"])  })*1.1 ]);
        lineSvg.selectAll(".myYaxis")
            .transition()
            .duration(3000)
            .call(yAxis);

        // Create a update selection: bind to the new data
        const u = lineSvg.selectAll(".lineTest")
            .data([data], function(d){ return d.Year });

        // Updata the line
        u
            .join("path")
            .attr("class","lineTest")
            .transition()
            .duration(3000)
            .attr("d", d3.line()
            .x(function(d) { return x(d.Year); })
            .y(function(d) { return y(d["Electricity from nuclear (TWh)"]); }))
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2.5)
        
        const lineText = lineSvg.append('text')
            .attr("id", "text-line")
            .attr("x", lineWidth)
            .attr("y", -15)
            .attr("text-anchor", "end")
            .style("font-size", "1.2em")
            .style("fill", "black") 
            .text(() => {
              return data[0].Entity;
            })
        
    }

