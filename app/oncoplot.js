import * as d3 from "d3";

import { scaleBandFacet, renderAxisX, renderAxisY } from "./scaleBandFacet.js";

const data = [
  { x: "Patient5", y: "BRCA2", type: "missense" },
  { x: "Patient6", y: "BRCA2", type: "missense" },
  { x: "Patient7", y: "BRCA2", type: "missense" },
  { x: "Patient8", y: "BRCA2", type: "missense" },
  { x: "Patient9", y: "BRCA2", type: "missense" },
  { x: "Patient1", y: "BRCA1", type: "missense" },
  { x: "Patient2", y: "BRCA1", type: "missense" },
  { x: "Patient3", y: "BRCA1", type: "nonsense" },
  { x: "Patient4", y: "BRCA1", type: "nonsense" },
  { x: "Patient5", y: "BRCA1", type: "multiple" },
  { x: "Patient1", y: "RAD51", type: "missense" },
  { x: "Patient2", y: "RAD51", type: "missense" },
  { x: "Patient3", y: "RAD51", type: "missense" },
  { x: "Patient4", y: "RAD51", type: "missense" },
  { x: "Patient5", y: "RAD51", type: "missense" },
  { x: "Patient6", y: "RAD51", type: "missense" },
  { x: "Patient7", y: "RAD51", type: "missense" },
  { x: "Patient8", y: "RAD51", type: "missense" },
  { x: "Patient1", y: "TP53", type: "missense" },
  { x: "Patient2", y: "TP53", type: "missense" },
  { x: "Patient3", y: "TP53", type: "missense" },
  { x: "Patient4", y: "TP53", type: "missense" },
  { x: "Patient5", y: "TP53", type: "missense" },
  { x: "Patient6", y: "TP53", type: "missense" },
  { x: "Patient7", y: "TP53", type: "missense" },
  { x: "Patient8", y: "TP53", type: "missense" },
  { x: "Patient9", y: "TP53", type: "missense" },
];

const xOrder = [
  "Patient1",
  "Patient2",
  "Patient3",
  "Patient4",
  "Patient5",
  "Patient6",
  "Patient7",
  "Patient8",
  "Patient9",
];

const yOrder = ["TP53", "RAD51", "BRCA1", "BRCA2"];
const yFacets = ["TP53", "HRD", "HRD", "HRD"];

// Create accessors
const xAccessor = (d) => d.x;
const yAccessor = (d) => d.y;
const typeAccessor = (d) => d.type;

// Tweakable Constants
const xPadding = 0.05;
const xPaddingOuter = 0.05;
const yPadding = 0.05;
const facetPaddingMultiplier = 5;

// Colour
const colors = new Map([
  ["missense", "darkgreen"],
  ["nonsense", "black"],
]);

// Define function for getting colour (could use d3 scales to do this instead)
const otherColor = "grey";
const getColor = (val) => {
  const col = colors.get(val);
  //if undefined return "grey"
  return typeof col === "undefined" ? otherColor : col;
};

// Define Colour mappings to type

//colors = new Map(data)

// Get Window Dimensions
const width = window.innerWidth;
const height = window.innerHeight;

//! Constant
// Tooltip
  const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)

const mousemove = function (event, d) {
  const x = event.pageX;
  const y = event.pageY;
  
  tooltip.style("left", x + "px")
    .style("top", y + "px")
    .style("opacity", 1)
    .html("The exact value of<br>this cell is: " + d.value);
    tooltip.classed("active", true)
};

const mouseleave = function () {
  tooltip.style("opacity", 0);
  tooltip.classed("active", false)
};

// Create SVG
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Create Margin Object
const margin = {
  top: 20,
  right: 20,
  bottom: 60,
  left: 200,
};

const xScale = scaleBandFacet()
  .range([margin.left, width - margin.right])
  .domain(xOrder)
  .paddingInner(xPadding)
  .paddingOuter(xPaddingOuter);
//.buildDomainRangeMap();

console.log(xScale());

const yScale = scaleBandFacet()
  .range([height - margin.bottom, margin.top])
  .domain(yOrder)
  .facet(yFacets)
  .paddingInner(yPadding)
  .facetPaddingMultiplier(facetPaddingMultiplier);

// const yScale = d3
//   .scaleBand()
//   .range([height - margin.bottom, margin.top])
//   .domain(yOrder.reverse())
//   .padding(yPadding);

// ////////////////////////////////////////////////////////////////////////
// // Create Marks Array
const marks = data.map((d) => ({
  xpos: xScale(xAccessor(d)),
  ypos: yScale(yAccessor(d)),
  color: getColor(typeAccessor(d)),
}));

console.log(marks);

// Render axes
// // Create Axes From scales (e.g. using d3.scaleLinear())
// const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

// Render Axes
renderAxisX(svg, xScale, height - margin.bottom, true, true);
renderAxisY(svg, yScale, margin.left, true);

// svg
//   .selectAll(".y-axis")
//   .data([null])
//   .join("g")
//   .attr("class", "y-axis")
//   .attr("transform", `translate(${margin.left}, 0)`)
//   .call(yAxis);

// draw marks
svg
  .selectAll(".oncoplot-tiles")
  .data([null])
  .join("g")
  .attr("class", "oncoplot-tiles")
  .selectAll("rect")
  .data(marks)
  .join("rect")
  .attr("class", "oncoplot-rect")
  .attr("x", (d) => d.xpos)
  .attr("y", (d) => d.ypos)
  .attr("width", xScale.bandwidth)
  .attr("height", yScale.bandwidth)
  .attr("fill", (d) => d.color)
  .attr("originalColor", (d) => d.color)
  .attr("rx", 15)
  // .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave);

// svg
//   .selectAll(".debugcircle")
//   .data(marks)
//   .join("circle")
//   .attr("class", "debugcircle")
//   .attr("cx", (d) => d.xpos)
//   .attr("cy", (d) => d.ypos)
//   .attr("r", 10);
