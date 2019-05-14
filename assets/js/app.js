// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create SVG, append SVG group for chart, shift by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv")
  .then(function(censusData) {
        console.log(censusData);
    // parse and cast data
    censusData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    // scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d.poverty)-1, d3.max(censusData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d.healthcare)-1, d3.max(censusData, d => d.healthcare)])
      .range([height, 0]);

    // axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append to chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // create circles
    var circlesGroup = chartGroup.append("g").attr("class","circle-group");
    var circle = circlesGroup
    .selectAll("circle")
    .data(censusData)
    .enter()
    .append("g")
    .attr("class","circle")
    .append("circle")
    .attr("class","shape")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "10")
    .attr("fill", "CornflowerBlue")
    .attr("opacity", ".5");

    // Add text to circles
    var circleText = circlesGroup.selectAll(".circle")
    .data(censusData)
    .append("text")
    .text(function(d){return d.abbr})
    .attr("text-anchor", "middle")
    .attr('alignment-baseline', 'middle')
    .attr('font-size','10px')
    .style('fill', 'white')
    .attr('font-weight','bold')
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare));


    // tool tip stuuf
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .style("background", "lightgrey")
      .style("padding","10px")
      .style("border-radius", "10px")
      .style("text-align","center")
      .offset([100, -100])
      .html(function(d) {
        return (`${d.state}<br>In Poverty %: ${d.poverty}<br>Lacks Healthcare %: ${d.healthcare}`);
        
      });

    // put tool tip in chart
    chartGroup.call(toolTip);

    // event listener for tool tip
    circleText.on("mouseover", function(data) {
      toolTip.show(data, this);
      d3.select(this.parentNode).select(".shape").style('stroke', 'DarkBlue').style("stroke-width","3");
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
        d3.select(this.parentNode).select(".shape").style("stroke-width","0");
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare %");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty %");
  });
