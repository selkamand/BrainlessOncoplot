import * as d3 from "d3";
import { scaleBandFacet, renderAxisX, renderAxisY, renderFacetsY } from "./scaleBandFacet.js";
import { yAxisLayout, xAxisLayout, summariseMutationsByGene } from "./utils.js";

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

console.log(summariseMutationsByGene(data))
// debugger;
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

const tmb = [
  { x: "Patient1", tmb: 1.2 },
  { x: "Patient2", tmb: 3.5 },
  { x: "Patient3", tmb: 2.0 },
  { x: "Patient4", tmb: 4.8 },
  { x: "Patient5", tmb: 5.3 },
  { x: "Patient6", tmb: 2.7 },
  { x: "Patient7", tmb: 1.5 },
  { x: "Patient8", tmb: 3.9 },
  { x: "Patient9", tmb: 6.2 },
];


const annotations = [
  { x: "Patient1", annotationType1: "Annotation A", annotationType2: "Annotation X", numericAnnotation: 3.5 },
  { x: "Patient2", annotationType1: "Annotation B", annotationType2: "Annotation Y", numericAnnotation: 2.1 },
  { x: "Patient3", annotationType1: "Annotation A", annotationType2: "Annotation Z", numericAnnotation: 4.7 },
  { x: "Patient4", annotationType1: "Annotation C", annotationType2: "Annotation W", numericAnnotation: 1.9 },
  { x: "Patient5", annotationType1: "Annotation B", annotationType2: "Annotation V", numericAnnotation: 6.3 },
  { x: "Patient6", annotationType1: "Annotation D", annotationType2: "Annotation U", numericAnnotation: 2.8 },
  { x: "Patient7", annotationType1: "Annotation A", annotationType2: "Annotation T", numericAnnotation: 5.2 },
  { x: "Patient8", annotationType1: "Annotation E", annotationType2: "Annotation S", numericAnnotation: 3.0 },
  { x: "Patient9", annotationType1: "Annotation D", annotationType2: "Annotation R", numericAnnotation: 7.1 },
];

// Confidence level: high


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

// Other tweakables
const geneBarPadding = 0
const geneBarWidth = 0
const tickLength = 6
const tickMarkAndTextPadding = 4
const fontsizeFacet = 18
const fontsizeY = 18
const fontsizeX = 18
const tmbBarPadding = 10
const tmbBarHeight = 100
const oncoplotClinicalPadding = 20
const clinicalRowHeight = 30
const clinicalRowPadding = 5
const clinicalRowNumber = 5
const showSampleNames = true


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
    .html(d.tooltip);
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
  left: 20,
};

// Create Layout Objects
const yLayout = yAxisLayout()
.facets(yFacets)
.domain(yOrder)
.margin(margin)
.windowWidth(width)
.geneBarPadding(geneBarPadding)
.geneBarWidth(geneBarWidth)
.tickMarkAndTextPadding(tickMarkAndTextPadding)
.tickLength(tickLength)
.fontSizeFacet(fontsizeFacet)
.fontSizeDomain(fontsizeY)
.computeLayout()

const xLayout = xAxisLayout()
.domain(xOrder)
.fontsizeX(fontsizeX)
.showSampleNames(showSampleNames)
.margin(margin)
.windowHeight(height)
.tmbBarPadding(tmbBarPadding)
.tmbBarHeight(tmbBarHeight)
.tickMarkAndTextPadding(tickMarkAndTextPadding)
.oncoplotClinicalPadding(oncoplotClinicalPadding)
.clinicalRowHeight(clinicalRowHeight)
.clinicalRowPadding(clinicalRowPadding)
.clinicalRowNumber(clinicalRowNumber)
.tickLength(tickLength)
.computeLayout()

console.log(xLayout)
console.log(yLayout)


const yScale = scaleBandFacet()
.range([xLayout.oncoplotPosStartY,xLayout.oncoplotPosEndY])
  .domain(yOrder)
  .facet(yFacets)
  .paddingInner(yPadding)
  .facetPaddingMultiplier(facetPaddingMultiplier);

  const xScale = scaleBandFacet()
  .range([yLayout.oncoplotPosStartX, yLayout.oncoplotPosEndX])
  .domain(xOrder)
  .paddingInner(xPadding)
  .paddingOuter(xPaddingOuter);

const yScaleTMB = d3.scaleLinear()
  .range([xLayout.tmbBarPosEndY, xLayout.tmbBarPosStartY])
  .domain([0, d3.max(tmb.map(d => d.tmb))])

// ////////////////////////////////////////////////////////////////////////
// // Create Marks Array
const marksOncoplot = data.map((d) => ({
  xpos: xScale(xAccessor(d)),
  ypos: yScale(yAccessor(d)),
  color: getColor(typeAccessor(d)),
  // sample: xAccessor(d),
  // gene: yAccessor(d)
  tooltip: [xAccessor(d), yAccessor(d)].join(" - "),
}));

const marksTMB = tmb.map((d) => ({
  xpos: xScale(xAccessor(d)),
  ypos: yScaleTMB(d.tmb),
  height: xLayout.tmbBarPosEndY - yScaleTMB(d.tmb),
  // color: getColor(typeAccessor(d)),
  // sample: xAccessor(d),
  // gene: yAccessor(d)
  tooltip:  xAccessor(d) + "<br>" + "TMB: " + d.tmb ,
}));

const marksGeneBar = tmb.map((d) => ({
  // xpos: xScale(d.),
  ypos: yScale(yAccessor(d)),
  height: xLayout.tmbBarPosEndY - yScaleTMB(d.tmb),
  // color: getColor(typeAccessor(d)),
  // sample: xAccessor(d),
  // gene: yAccessor(d)
  tooltip:  xAccessor(d) + "<br>" + "TMB: " + d.tmb ,
}));



// Render axes: Oncoplot
renderAxisX(svg, xScale, xLayout.oncoplotPosEndY, showSampleNames, true, true);
renderAxisY(svg, yScale, yLayout.oncoplotPosStartX, yLayout.facetWidth, yLayout.yTextAndTickWidth, true);

// Render axes: TMB
const axisTMB = d3.axisLeft(yScaleTMB.nice(1)).ticks(1);
svg
.selectAll('.y-axis-tmb')
.data([null])
.join('g')
.attr('class', 'y-axis-tmb')
// .attr("transform", `translate(10, 10)`)
.attr("transform", `translate(${yLayout.oncoplotPosStartX}, 0)`)
.call(axisTMB)


// Render Marks: TMB
svg
.selectAll('.tmb-barplot')
.data([null])
.join("g")
.attr('class', 'tmb-barplot')
.selectAll("rect")
.data(marksTMB)
.join("rect")
.attr("class", 'tmb-rect')
.attr("x", (d) => d.xpos)
.attr("y", (d) => d.ypos)
.attr("width", xScale.bandwidth)
.attr("height", (d) => d.height)
.on("mousemove", mousemove)
.on("mouseleave", mouseleave)

// Render Marks: Oncoplot
svg
  .selectAll(".oncoplot-tiles")
  .data([null])
  .join("g")
  .attr("class", "oncoplot-tiles")
  .selectAll("rect")
  .data(marksOncoplot)
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


// draw Oncoplot

// Enforce fontsize

// Font Size Enforcement
svg.selectAll(".y-axis-tick-text")
.style('font-size', fontsizeY + 'px')

svg.selectAll(".x-axis-tick-text")
.style('font-size', fontsizeX + 'px')

svg.selectAll(".facet-text")
.style('font-size', fontsizeFacet + 'px')
