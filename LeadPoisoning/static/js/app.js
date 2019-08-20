
function buildBarGraph(year){
    console.log("BuildGraph function triggerred")

      var url=`/states/${year}`;
      console.log("url is"+url);
      
      d3.json(url).then(function(response){
        console.log(response)
        console.log('All States', response.map(stateData => stateData.state))
        console.log('All States: chldrn_confirbill_5ugdl', response.map(stateData => stateData.chldrn_confirbill_5ugdl))

        // var trace1 = {
        //   x: response.map(stateData => stateData.state),
        //   y: response.map(stateData => stateData.chldrn_confirbill_5ugdl),
        //   type: "bar"
        // };
        
        // var data = [trace1];
        
        // var layout = {
        //   title: "'Bar' Chart"
        // };
  
        // Plotly.newPlot("bar", data, layout);
        var trace1 = {
          x: response.map(stateData => stateData.state),
          y: response.map(stateData => stateData.chldrn_confirbill_5ugdl),
          name: '5Mg',
          type: 'bar'
        };
        
        var trace2 = {
          x: response.map(stateData => stateData.state),
          y: response.map(stateData => stateData.chldrn_confirbill_10ugdl),
          name: '10Mg',
          type: 'bar'
        };
        
        var data = [trace1, trace2];
        
        var layout = {barmode: 'stack'};
        
        Plotly.newPlot('bar', data, layout);
       

      })


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
    });
  }
  
  function optionChanged(year) {
    // Fetch new data each time a new year is selected
    console.log("New year selected");
   buildBarGraph(year);
  }
  
  // Initialize the dashboard
  init();
  