function buildBarGraph(year){
    console.log("BuildGraph function triggerred")

      var url=`/states/${year}`;
      console.log("url is"+url);
      
      d3.json(url).then(function(response){
        console.log(response)
        console.log('All States', response.map(stateData => stateData.state))
        console.log('All States: chldrn_confirbill_5ugdl', response.map(stateData => stateData.chldrn_confirbill_5ugdl))
        
        var trace1 = {
          x: response.map(stateData => stateData.state),
          y: response.map(stateData => stateData.chldrn_confirbill_5ugdl),
          name: '5 Microgram/dl',
          type: 'bar'
        };        
        var trace2 = {
          x: response.map(stateData => stateData.state),
          y: response.map(stateData => stateData.chldrn_confirbill_10ugdl),
          name: '10 Microgram/dl',
          type: 'bar'
        };        
        var data = [trace1, trace2];
        
        var layout = {barmode: 'stack'};
        
        Plotly.newPlot('bar', data, layout);       
      })
}

//  function fetchJSON(url) {
//     return fetch(url)
//       .then(function(response) {
//         return response.json();
//       });
//   }

  function buildGeoJsonMap(url){   
  //fetch('http://localhost:8080/posts', { mode: 'no-cors' });
    // Creating map object
  var map = L.map("map", {
      center: [38.367965698,-92.477882385],
      zoom: 11
    });
    
    // Adding tile layer
    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    }).addTo(map);    
    //var datafromurl= fetchJSON(url);
    // Grabbing our GeoJSON data..  
    D3.json("/timelineMap").then(function(data) {
      // Creating a GeoJSON layer with the retrieved data
      L.geoJson(data).addTo(map);
    });

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

     // var link = "https://opendata.arcgis.com/datasets/8b9e118f12fd41228aceec02b5e71888_0.geojson"
      //"https://opendata.arcgis.com/datasets/7bdfd2d7880c4a52b765cc1e7192cee8_1.geojsonhttp://data.beta.nyc//dataset/0ff93d2d-90ba-457c-9f7e-39e47bf2ac5f/resource/" +
    //"35dd04fb-81b3-479b-a074-a27a37888ce7/download/d085e2f8d0b54d4590b1e7d1f35594c1pediacitiesnycneighborhoods.geojson";
      buildGeoJsonMap();
    });
  }
  
  function optionChanged(year) {
    // Fetch new data each time a new year is selected
    console.log("New year selected");
   buildBarGraph(year);
  }
  
  // Initialize the dashboard
  init();
  