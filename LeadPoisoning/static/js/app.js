function buildBarGraph(year){
  console.log("BuildGraph function triggerred")

    var url=`/states/${year}`;
    console.log("url is"+url);
    
    d3.json(url).then(function(response){
      console.log(response)
      console.log('All States', response.map(stateData => stateData.state))
      console.log('All States: chldrn_confirbill_5ugdl', response.map(stateData => stateData.chldrn_confirbill_5ugdl))
      colors = ['lightslategray',] * 11
      colors[0] = 'crimson'
      color= ['red',]*11
      color[0]='blue'
    
      var trace1 = {
        x: response.map(stateData => stateData.state),
        y: response.map(stateData => stateData.chldrn_confirbill_5ugdl),
        name: '5 Microgram/dl',
        type: 'bar',
        marker:{
          color: colors
        }
      };   

      var trace2 = {
        x: response.map(stateData => stateData.state),
        y: response.map(stateData => stateData.chldrn_confirbill_10ugdl),
        name: '10 Microgram/dl',
        type: 'bar',
        marker:{
          color: color
        }
      };        
      var data = [trace1, trace2];
      
      var layout = {barmode: 'stack'};
      
      Plotly.newPlot('bar', data, layout);       
    })
}

function getColor(feature) {
  return  feature > 500 ? '#990000' :
          feature > 100 ? '#ed2f2f' :
          feature > 50  ? '#ed722f' :
          feature > 30  ? '#edc72f' :
          feature > 20  ? '#e7ed2f' :
          feature > 15  ? '#caed2f' :
          feature > 10  ? '#4ced2f' :
          feature > 5   ? '#2fede7' :
	                         '#2f6eed';
}
function getStyle(feature) {
return {
  fillColor: getColor(feature.properties["confirmed_BLLS_Grtrthan5Mg"]),
  weight: 1,
  opacity: 1,
  color: 'white',
  dashArray: '3',
  fillOpacity: 0.8
};
}
var geoJsonData = null;

const keyBy = (array, key) => (array || []).reduce((r, x) => ({ ...r, [key ? x[key] : x]: x }), {});

function buildGeoJsonMap(year){   
//fetch('http://localhost:8080/posts', { mode: 'no-cors' });
  // Creating map object
  console.log("BuildGeoJsonMap function triggered")
  var map = L.map("map", {
    center: [38.582138, -92.178877],
    zoom: 7
  });
  
  // Adding tile layer
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(map);     
 
  // Grabbing our GeoJSON data..  
  d3.json("/timelineMap").then(function(data) {
    // Creating a GeoJSON layer with the retrieved data
    geoJsonData = data;
    var lead_data_url = `/counties/${year}`;
    console.log('lead_data_url',lead_data_url)
     d3.json(lead_data_url).then(function(lead_data_response){

      const fipsToLeadDataMap = keyBy(lead_data_response.map(row => {
        row.FIPS = row.FIPS.padStart(3, '0') 
        return row
      }), 'FIPS')
      console.log("fipsToLeadDataMap",fipsToLeadDataMap)

      geoJsonData.features.forEach(feature => {
        const county_lead = fipsToLeadDataMap[feature.properties.COUNTYFIPS]  
        feature.properties = { ...feature.properties, ...county_lead}
      })
            
      L.geoJson(geoJsonData, 
        {style: getStyle,
        onEachFeature: function(feature, layer) {
        // Set mouse events to change map styling
        layer.on({
          // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
          mouseover: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 1
            });
          },
          // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
          mouseout: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.8
            });
          },
          
        });
        // Giving each feature a pop-up with information pertinent to it
        layer.bindPopup("<h3>" + feature.properties.county_name + "</h3> <hr> <h4>"
         + feature.properties.total_chldn_tested + "</h4> <hr> <h4>" 
         + feature.properties.confirmed_BLLS_Grtrthan5Mg + "</h4>");
  
      }
      }).addTo(map);

    });

  });

}

function buildMinesMap(year){   
  //fetch('http://localhost:8080/posts', { mode: 'no-cors' });
    // Creating map object
    console.log("BuildGeoJsonMap function triggered")
    var map = L.map("map", {
      center: [38.582138, -92.178877],
      zoom: 7
    });
    
    // Adding tile layer
    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    }).addTo(map);     
   
    // Grabbing our GeoJSON data..  
    
  
  }

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/years").then((yearData) => {
      console.log("Inside init() d3.json", yearData)
      yearData.forEach((year)=>{
        selector
        .append("option")
        .text(year)
        .property("value", year);
      });

    // Use the first year from the list to build the initial graph
    const firstYear = yearData[0];
    console.log(firstYear);
    buildBarGraph(firstYear);
    LatestYear=2017;
    buildGeoJsonMap(LatestYear);
  });
}

function optionChanged(year) {
  // Fetch new data each time a new year is selected
  console.log("New year selected");
 buildBarGraph(year);
}

// Initialize the dashboard
init();
