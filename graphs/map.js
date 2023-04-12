
function map(filteredEnergyData) {
        
    const mapMargin = {top: 10, right: 10, bottom: 70, left: 10}
    // The svg
    const mapWidth = 800
    const mapHeight = 800 - mapMargin.top - mapMargin.bottom;
    
    const mapSvg = d3.select("#map")
    .append("svg")
    .attr("width", mapWidth)
    .attr("height", mapHeight + mapMargin.top + mapMargin.bottom);
    
    const path = d3.geoPath();
    const projection = d3.geoMercator()
      .scale(140)
      .center([0,20])
      .translate([mapWidth / 2, mapHeight / 2]);
      
    // Data and color scale
    let data = new Map()
    const colorScale = d3.scaleThreshold()
    .domain([1, 5, 10, 20, 100, 750, 1000,1500])
    .range(d3.schemeReds[8]);

    filteredEnergyData.forEach(d => {
        data.set(d.Entity,d["Electricity from nuclear (TWh)"])
    });

    // Load external data and boot
    d3.json("https://gist.githubusercontent.com/hrbrmstr/91ea5cc9474286c72838/raw/59421ff9b268ff0929b051ddafafbeb94a4c1910/continents.json").then(function(loadData) {

        let topo = loadData
        topo.features = topo.features.filter(d => d.properties.CONTINENT !== 'Antarctica')
       
        let mouseOver = function(event, d) {
            mapTooltip.style("opacity", 1).style("display","block");
        }

        const mouseMove = (event, d) => {
            mapTooltip
                .html('<u>' + d.properties.CONTINENT + '</u>' + '<br>' + d.total + " TWh")
                .style("position", "fixed")
                .style("left", (event.x + 15) + "px")
                .style("top", (event.y - (scrollY/100)) + "px");
        };
    
        let mouseLeave = function(event, d) {
            mapTooltip.style("opacity", 0).style("display","none");
        }

        let mouseClick = function(event, d) {
            newData = energyData.filter(data => data.Entity === d.properties.CONTINENT);
            update(newData);
        }

        // create a tooltip
        const mapTooltip = d3.select("#map")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "0.3em");


        // Draw the map
        mapSvg.append("g")
        .selectAll("path")
        .data(topo.features)
        .join("path")
            // draw each country
            .attr("d", d3.geoPath()
            .projection(projection)
            )
            // set the color of each country
            .attr("fill", function (d) {
                d.total = data.get(d.properties.CONTINENT) || 0;
                return colorScale(d.total);
            })
        .on("mouseover", mouseOver )
        .on("mousemove", mouseMove)
        .on("mouseleave", mouseLeave )
        .on("click", mouseClick );
        
        mapSvg.append('text')
        .attr("x", mapWidth/2)
        .attr("y", mapHeight + 10)
        .attr("text-anchor", "middle")
        .style("font-size", "1.2em")
        .style("fill", "black") 
        .text("Nuclear Energy produced by each continent in 2021 (in TWh)")
    })

}