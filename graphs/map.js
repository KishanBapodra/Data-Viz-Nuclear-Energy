
function map(energyData) {
        
    // The svg
    const mapWidth = 800
    const mapHeight = 600
    
    const mapSvg = d3.select("#map")
    .append("svg")
    .attr("width", mapWidth)
    .attr("height", mapHeight);
    
    
    const path = d3.geoPath();
    console.log("HELLO");
    const projection = d3.geoMercator()
      .scale(70)
      .center([0,20])
      .translate([mapWidth / 2, mapHeight / 2]);
      
    
    // Data and color scale
    let data = new Map()
    const colorScale = d3.scaleThreshold()
    .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
    .range(d3.schemeBlues[7]);

    // Load external data and boot
    d3.json("https://gist.githubusercontent.com/hrbrmstr/91ea5cc9474286c72838/raw/59421ff9b268ff0929b051ddafafbeb94a4c1910/continents.json", () => data.set()).then(function(loadData) {

        let topo = loadData

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
                // console.log(d.properties.CONTINENT);
                console.log(data);
            d.total = data.get(d.id) || 0;
            return colorScale(d.total);
            })
    })

}