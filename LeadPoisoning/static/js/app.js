// @TODO: YOUR CODE HERE!
// Store width and height parameters to be used in later in the canvas
var svgWidth = 900;
var svgHeight = 600;

// Set svg margins 
var margin = {
  top: 40,
  right: 40,
  bottom: 80,
  left: 90
};

// Create the width and height based svg margins and parameters to fit chart group within the canvas
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#bar")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)



  //******************************************************
  
  //  d3.json('/barGraph'), function(error,data) {
  //         if(error) throw error;
  //         console.log("I am in bar graph d3");
  //         data.forEach(function(d){
  //            d.prct_chldrn_confirbill_5ugdl =+ d.prct_chldrn_confirbill_5ugdl;
  //         });

  //      }

  // var xBandScale = d3.scaleBand()
  //   .domain(data.map(d => d.state ))
  //   .range([0, chartWidth])
  //   .padding(0.1);

  // Create a linear scale for the vertical axis.
  // var yLinearScale = d3.scaleLinear()
  //   .domain([0, d3.max(data, d => d.prct_chldrn_confirbill_5ugdl)])
  //   .range([chartHeight, 0]);

  // Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
  // var bottomAxis = d3.axisBottom(xBandScale);
  // var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  // chartGroup.append("g")
  //   .call(leftAxis);

  // chartGroup.append("g")
  //   .attr("transform", `translate(0, ${chartHeight})`)
  //   .call(bottomAxis);

  // Create one SVG rectangle per piece of tvData
  // Use the linear and band scales to position each rectangle within the chart
  // chartGroup.selectAll(".bar")
  //   .data(data)
  //   .enter()
  //   .append("rect")
  //   .attr("class", "bar")
  //   .attr("x", d => xBandScale(d.state))
  //   .attr("y", d => yLinearScale(d.prct_chldrn_confirbill_5ugdl))
  //   .attr("width", xBandScale.bandwidth())
  //   .attr("height", d => chartHeight - yLinearScale(d.prct_chldrn_confirbill_5ugdl));
  
  function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("/year").then((CountiyNames) => {

      console.log(CountiyNames)

      return

      CountiyNames.forEach((county) => {
        selector
          .append("option")
          .text(county)
          .property("value", county);
      });
  
      // Use the first sample from the list to build the initial plots
      const firstSelector = CountiyNames[0];
      console.log(firstSelector);
      buildCharts(firstSelector);
      buildMetadata(firstSelector);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    console.log("New Data selected");
    buildCharts(newSample);
    buildGeoJsonMap(newSample);
  }
  
  // Initialize the dashboard
  init();
  