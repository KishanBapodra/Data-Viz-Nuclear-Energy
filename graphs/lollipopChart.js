function lollipopChart(data) {

    // set the dimensions and margins of the graph
    const lollipopMargin = {top: 40, right: 30, bottom: 50, left: 150},
    lollipopWidth = 660 - lollipopMargin.left - lollipopMargin.right,
    lollipopHeight = 500 - lollipopMargin.top - lollipopMargin.bottom;
    
    data = data.filter(d => d.Technology !== "Hydropower");
    
    // append the svg object to the body of the page
    const lollipopSvg = d3.select("#emission")
    .append("svg")
    .attr("width", lollipopWidth + lollipopMargin.left + lollipopMargin.right)
    .attr("height", lollipopHeight + lollipopMargin.top + lollipopMargin.bottom)
    .append("g")
    .attr("transform", `translate(${lollipopMargin.left}, ${lollipopMargin.top})`);
    
    // Add X axis
    const x = d3.scaleSqrt()
        .domain([0, d3.max(data, d => d["Max."])])
        .range([ 0, lollipopWidth]);
    lollipopSvg.append("g")
        .attr("transform", `translate(0, ${lollipopHeight})`)
        .call(d3.axisBottom(x))

    lollipopSvg
        .append("g")
        .attr("transform", `translate(0, ${lollipopHeight})`)
        .call(d3.axisBottom(x))
        .call(g => g.append("text")
            .attr("x", lollipopWidth)
            .attr("y", lollipopMargin.bottom - 10)
            .attr("fill", "#000")
            .attr("text-anchor", "end")
            .attr("font-size", "1.2em")
            .text("grams of CO2 equivalent/kWh →"));

    // Y axis
    const y = d3.scaleBand()
        .range([ 0, lollipopHeight ])
        .domain(data.map(d => d.Technology))
        .padding(1);
    lollipopSvg.append("g")
        .call(d3.axisLeft(y))

    lollipopSvg.append("g")
        .call(d3.axisLeft(y))
        .call(g => g.append("text")
        .attr("x", -lollipopMargin.left + 40)
        .attr("y", -15)
        .attr("fill", "#000")
        .attr("font-size", "1.2em")
        .attr("text-anchor", "start")
        .text("Fuel Technology"));

    const lollipopTooltip = d3.select("#emission")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")

    const mouseOver = (event, d) => {
        lollipopTooltip.style("opacity", 1).style("display", "block");
    };
    
    const mouseMove = (event, d) => {
        lollipopTooltip
            .html('<u>' + d.Technology + '</u>' + '<br>' + "Median: " + d.Median + " grams of CO2 equivalent/kWh" + '<br>' + "Min: " + d["Min."] + " grams of CO2 equivalent/kWh" + "<br>" + "Max: " + d["Max."] + " grams of CO2 equivalent/kWh")
            .style("position", "fixed")
            .style("width","22em")
            .style("font-size", "0.8em")
            .style("left", (event.x + 15) + "px")
            .style("background-color", "lightskyblue")
            .style("top", (event.y - (scrollY/90)) + "px");
    };
    
    const mouseLeave = (event, d) => {
        lollipopTooltip.style("opacity", 0).style("display", "none");
    }
    
    // Lines
    lollipopSvg.selectAll("myline")
    .data(data)
    .join("line")
        .attr("x1", d => x(d["Min."]))
        .attr("x2", d => x(d["Max."]))
        .attr("y1", d => y(d.Technology))
        .attr("y2", d => y(d.Technology))
        .attr("stroke", "grey")
        .attr("stroke-width", "1px")

    // Circles of variable 1
    lollipopSvg.selectAll("mycircle")
    .data(data)
    .join("circle")
        .attr("cx", d => x(d["Min."]))
        .attr("cy", d => y(d.Technology))
        .attr("r", "6")
        .style("fill", "#54433a")
        .on("mouseover", mouseOver) 
        .on("mousemove", mouseMove)
        .on("mouseleave", mouseLeave)

    // Circles of variable 2
    lollipopSvg.selectAll("mycircle")
    .data(data)
    .join("circle")
        .attr("cx", d => x(d["Max."]))
        .attr("cy", d => y(d.Technology))
        .attr("r", "6")
        .style("fill", "#54433a")
        .on("mouseover", mouseOver) 
        .on("mousemove", mouseMove)
        .on("mouseleave", mouseLeave)

    // Circles of variable 3
    lollipopSvg.selectAll("mycircle")
        .data(data)
        .join("circle")
            .attr("cx", d => x(d["Median"]))
            .attr("cy", d => y(d.Technology))
            .attr("r", "6")
            .style("fill", "#d2691e")
            .on("mouseover", mouseOver) 
            .on("mousemove", mouseMove)
            .on("mouseleave", mouseLeave)
}