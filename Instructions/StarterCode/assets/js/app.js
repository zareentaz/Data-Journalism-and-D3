function makeResponsive() {
//// set the dimensions and margins of the graph
var svgWidth =660;
var svgHeight = 500;
var margin = {
 top: 20,
 right: 40,
 bottom: 60,
 left: 100
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
 .append("svg")
 .attr("width", svgWidth)
 .attr("height", svgHeight);
var chartGroup = svg.append("g")
 .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv")
 .then(function(data) {
    // Print the healthData
    console.log(data);

   // Step 1: Parse Data/Cast as numbers
   // ==============================
   data.forEach(function(data) {
     data.poverty = +data.poverty;
     data.healthcare = +data.healthcare;
   });

   // Step 2: Create scale functions
   // ==============================
   var xLinearScale = d3.scaleLinear()
     //.domain([d3.extent(data, d => d.poverty)])
     .domain([d3.min(data, d=>d.poverty)*0.8,
      d3.max(data, d => d.poverty)*1.2])
     .range([0, width]);

   var yLinearScale = d3.scaleLinear()
    // .domain([d3.extent(data, d => d.healthcare)])
     .domain([0, d3.max(data, d => d.healthcare)*1.2])
     .range([height, 0]);


   // Step 3: Create axis functions
   // ==============================
   var bottomAxis = d3.axisBottom(xLinearScale);
   var leftAxis = d3.axisLeft(yLinearScale);


   // Step 4: Append Axes to the chart
   // ==============================
   chartGroup.append("g")
     .attr("transform",`translate(0, ${height})`)
     .call(bottomAxis);
   chartGroup.append("g")
     .call(leftAxis);


   // Step 5: Create Circles
   // ==============================
   var circlesGroup = chartGroup.selectAll("circle")
   .data(data)
   .enter()
   .append("circle")
     .attr("cx", function (d) { return xLinearScale(d.poverty); } )
     .attr("cy", function (d) { return yLinearScale(d.healthcare); } )
   //.attr("cx", d => xLinearScale(d.poverty))
   //.attr("cy", d => yLinearScale(d.healthcare))
     .attr("r", "12")
     .style("fill", "#69b3a2" )
     .attr("opacity", ".5");


   // Step 6: Initialize tool tip
   // ==============================
   var toolTip = d3.tip()
     .attr("class", "tooltip")
     .offset([80, -60])
     .html(function(d) {
       return (`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}%`);
     });

   // Step 7: Create tooltip in the chart
   // ==============================
   chartGroup.call(toolTip);

   // Step 8: Create event listeners to display and hide the tooltip
   // ==============================
   // Create "mouseover" event listener to display tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // Create "mouseout" event listener to hide tooltip
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
      
   // Create axes labels
   chartGroup.append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 0 - margin.left + 40)
     .attr("x", 0 - (height / 2))
     .attr("dy", "1em")
     .attr("class", "axisText")
     .text("Lacks Healthcare(%)");
   chartGroup.append("text")
     .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
     .attr("class", "axisText")
     .text("In poverty(%)");

     // Appending a label to each data point
    chartGroup.append("text")
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .selectAll("tspan")
    .data(data)
    .enter()
    .append("tspan")
        .attr("x", function(data) {
            return xLinearScale(data.poverty - 0);
        })
        .attr("y", function(data) {
            return yLinearScale(data.healthcare - 0.2);
        })
        .text(function(data) {
            return data.abbr
        })
    
   })
  }
  // When the browser loads, makeResponsive() is called.
  makeResponsive();
// When the browser window is resized, makeResponsive() is called.
  d3.select(window).on("resize", makeResponsive);
