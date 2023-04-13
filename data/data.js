const accData = d3.csv("./data/accidents.csv").then(data => data);
const nrgData = d3.csv("./data/energy-generation.csv").then(data => data)
const yrlyData = d3.csv("./data/yearly_full_data.csv").then(data => data)
const cstData = d3.csv("./data/cost-of-electricity.csv").then(data => data)
const dthData = d3.csv("./data/death-rates-from-energy-production-per-twh.csv").then(data => data)
const emsnData = d3.csv("./data/life-cycle-greenhouse-emission.csv").then(data => data)
const costCompData = d3.csv("./data/cost-of-electricity-compare.csv").then(data => data)

var accidentsData;
var energyData;
var costData;
var emissionData;
var fullData;
var deathData;
var filteredCostData;
var compareCostData;

const loadData = async () => {
    accidentsData = await accData;
    energyData = await nrgData;
    costData = await cstData;
    emissionData = await emsnData;
    deathData = await dthData;
    compareCostData = await costCompData;
    fullData = await yrlyData;
}

const sources = ['Coal power','Natural gas', 'Wind power','Biomass', 'Solar thermal/concentrated', 'Nuclear', 'Turbine (industrial)', 'Geothermal power','Fuel cells', 'Solar photovoltaic', 'Battery storage']
const filterLCOECosts = ["PV (residential)","PV (utility, fixed-axis)","PV (utility, tracking)"]
const continents = ["North America", "South America", "Europe", "Africa", "Asia", "Oceania"]

loadData().then(() => {

    // filter the energy sources
    filteredCostData = costData.filter(data => sources.includes(data.Type))
    // avg for sources with range of costs and change string value with comma to number
    filteredCostData = filteredCostData.map(element => {
        
        const dollarRemove = element["US-EIA"].split("$");
        if(element["US-EIA"].includes('-')) {
            const vals = dollarRemove[1].split("-");
            const avg = (parseFloat(vals[0].replace(/[^0-9.-]+/g,"")) + parseFloat(vals[1].replace(/[^0-9.-]+/g,""))) / 2;
            return {...element, "US-EIA": avg}
        }
        return {...element, "US-EIA": parseFloat(element["US-EIA"].replace(/[^0-9.-]+/g,""))}
    })
    compareCostData = compareCostData
                            .filter(data => !filterLCOECosts.includes(data.Type))
                            .map(data => {
                                    if(data["Lazard 2021"].includes('-')) {
                                        const val = data["Lazard 2021"].split('-')
                                        const average = (parseInt(val[0]) + parseInt(val[1]))/2
                                        return {...data, "Lazard 2021": average}
                                    }
                                    return data
                                })

    filteredEnergyData = energyData.filter(data => continents.includes(data.Entity) && data.Year === '2021')
    energyData = energyData.filter(data => continents.includes(data.Entity))

    barGraphAccidents(accidentsData);
    economicDmg(accidentsData);
    barGraphCost(compareCostData);
    barGraphCostComparison(compareCostData);
    lollipopChart(emissionData);
    barGraphDeaths(deathData);
    map(filteredEnergyData);
    update(energyData.filter(d => d.Entity === 'Europe'));
});