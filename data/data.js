const accData = d3.csv("/data/accidents.csv").then(data => data);
const nrgData = d3.csv("/data/energy-generation.csv").then(data => data)
const yrlyData = d3.csv("/data/yearly_full_data.csv").then(data => data)
const cstData = d3.csv("/data/cost-of-electricity.csv").then(data => data)
const emsnData = d3.csv("/data/Life-cycle-greenhouse-emission.csv").then(data => data)

var accidentsData;
var energyData;
var costData;
var emissionData;
var fullData;
var filteredCostData;

const loadData = async () => {
    accidentsData = await accData;
    energyData = await nrgData;
    costData = await cstData;
    emissionData = await emsnData;
    fullData = await yrlyData;
}

const sources = ['Coal power','Natural gas', 'Wind power', 'Nuclear', 'Biomass','Geothermal power', 'Battery storage', 'Fuel cells', 'Solar PV with storage', 'Solar photovoltaic']

loadData().then(() => {

    // filter the energy sources
    filteredCostData = costData.filter(data => sources.includes(data.Type))
    // avg for sources with range of costs
    filteredCostData = filteredCostData.map(element => {
        if(element["US-EIA"].includes('-')) {
            const dollarRemove = element["US-EIA"].split("$");
            const vals = dollarRemove[1].split("-");
            const avg = (parseFloat(vals[0].replace(/[^0-9.-]+/g,"")) + parseFloat(vals[1].replace(/[^0-9.-]+/g,""))) / 2;
            return {...element, "US-EIA": `$${avg.toString()}`}
        }
        return element
    })

    // fullData.forEach(element => {
    //     if(element.Category === 'Electricity generation' && element.Variable === 'Nuclear' && element.Year === '2015' && element["Area type"] !== 'Country' ) {
    //         // future reference    
    //     }
    // })

    console.log(emissionData);
});