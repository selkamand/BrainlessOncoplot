import * as d3 from "d3";
import { cumSum } from "./arrayFunctions";

// facetBandScale returns a function that maps domain values + faceting values to pixel positions
// Works different to typical scales in that total paddingInner is relative to the range

/**
 * A D3-like band scale that supports scaling.
 * @date 8/5/2023 - 3:07:16 PM
 *
 * @export
 * @returns A function that takes single domain values and maps them to pixel positions on the screen
 * @example
 * const xscale = scaleBandFacet()
 * .domain(['Ford', 'Toyota', 'Tesla'])
 * .range([0, 500])
 * .buildDomainRangeMap()
 */
export function scaleBandFacet() {
  var domain,
    range,
    facet,
    facetChangeFromPrevious,
    paddingInner = 0.05,
    paddingOuter = 0.05,
    facetPaddingMultiplier = 5,
    nFacetChanges = 0,
    bandwidth,
    domainRangeMap = new Map(),
    domainRangeCenterMap = new Map(),
    facetRangeArray, //  facet, startPosition, endPosition, rectHeight,
    // facetRangeMap = new Map(),
    step,
    start,
    stop;

  /**
   * Take a single domain value and return a matched pixel position based on range and padding settings.
   * @date 8/5/2023 - 3:04:24 PM
   *
   * @param {*} value a single value matching the domain input
   * @param {boolean} [center=false] should you return a left-aligned pixel point or one in the middle of each band (left is better for making rectangles, center is better for axis ticks or circles)
   * @returns
   */
  function my(value, center = false) {
    if (!value) {
      return my;
      //throw new Error("Both 'values' and 'facets' must be supplied.");
    }

    let pixelValue;
    if (center) {
      pixelValue = domainRangeCenterMap.get(value);
    } else {
      pixelValue = domainRangeMap.get(value);
    }

    return pixelValue;
  }

  my.domain = function (_) {
    if (!arguments.length) return domain;
    domain = _;
    my.buildDomainRangeMap();
    return my;
  };

  my.range = function (_) {
    if (!arguments.length) return range;
    range = _;

    const r0 = range[0];
    const r1 = range[1];

    const reverse = r1 < r0;

    start = reverse ? r1 : r0;
    stop = reverse ? r0 : r1;

    my.buildDomainRangeMap();
    return my;
  };

  my.facet = function (_) {
    if (!arguments.length) return facet;
    if (domain === undefined)
      throw new Error("Please set domain before setting the facet");

    facet = _;
    if (facet.length != domain.length)
      throw new Error(
        "There must be one facet for each domain. Found " +
          facet.length +
          " facets and " +
          domain.length +
          " domain values"
      );

    facetChangeFromPrevious = facet.map((currentElement, index) =>
      index === 0 ? false : currentElement !== facet[index - 1]
    );

    nFacetChanges = facetChangeFromPrevious.filter(
      (value) => value === true
    ).length;

    my.buildDomainRangeMap();


    return my;
  };

  my.paddingInner = function (_) {
    if (!arguments.length) return paddingInner;
    paddingInner = _;
    my.buildDomainRangeMap();
    return my;
  };

  my.paddingOuter = function (_) {
    if (!arguments.length) return paddingOuter;
    paddingOuter = _;
    my.buildDomainRangeMap();
    return my;
  };

  my.facetPaddingMultiplier = function (_) {
    if (!arguments.length) return facetPaddingMultiplier;
    facetPaddingMultiplier = _;
    my.buildDomainRangeMap();
    return my;
  };

  // Read only
  my.bandwidth = function () {
    return bandwidth;
  };

  my.step = function () {
    return step;
  };

  my.buildDomainRangeMap = function () {
    if (domain === undefined || range === undefined) {
      return my;
    }

    const rangeWidthPixels = stop - start,
      nDomains = domain.length;

    const paddingInnerPixels =
      (paddingInner * rangeWidthPixels) / (nDomains - 1);
    const paddingOuterPixels = (paddingOuter * rangeWidthPixels) / 2;
    const paddingFacetPixels = facetPaddingMultiplier * paddingInnerPixels;

    bandwidth =
      (rangeWidthPixels -
        2 * paddingOuterPixels -
        paddingInnerPixels * (nDomains - 1 - nFacetChanges) -
        nFacetChanges * paddingFacetPixels) /
      nDomains;

    let paddingInnerFacetIncluded;

    if (nFacetChanges > 0) {
      paddingInnerFacetIncluded = facetChangeFromPrevious.map((facetChanged) =>
        facetChanged ? paddingFacetPixels : paddingInnerPixels
      );
    } else {
      paddingInnerFacetIncluded = d3
        .range(nDomains)
        .map((d) => paddingInnerPixels);
    }

    step = d3
      .range(nDomains)
      .map((i) => (i == 0 ? 0 : bandwidth + paddingInnerFacetIncluded[i]));

    // Since step is different can't just multiply step by i, need to

    const stepCumSum = cumSum(step);

    const pixelValues = d3
      .range(nDomains)
      .map((i) => start + paddingOuterPixels + stepCumSum[i]);

    const pixelValuesCentered = d3
      .range(nDomains)
      .map((i) => start + paddingOuterPixels + stepCumSum[i] + bandwidth / 2);

    // Create
    if (facet !== undefined) {
      facetRangeArray = new Array();

      for (var currentFacet of [...new Set(facet)]) {
        let facetStartPosition = pixelValues[facet.indexOf(currentFacet)];
        let facetEndPosition =
          pixelValues[facet.lastIndexOf(currentFacet)] + bandwidth;
        facetRangeArray.push({
          facet: currentFacet,
          startPosition: facetStartPosition,
          endPosition: facetEndPosition,
          rectHeight: facetEndPosition - facetStartPosition,
        });
      }
    }

    //prettier-ignore
    d3.range(nDomains).map((i) => domainRangeMap.set(domain[i], pixelValues[i]));
    //prettier-ignore
    d3.range(nDomains).map((i) => domainRangeCenterMap.set(domain[i], pixelValuesCentered[i]));

    return my;
  };

  my.start = function () {
    return start;
  };

  my.stop = function () {
    return stop;
  };

  my.axisPathX = function () {
    const pathD = getAxisPathString(start, stop, 0, 0);
    return pathD;
  };

  my.axisPathY = function () {
    const pathD = getAxisPathString(0, 0, start, stop);
    return pathD;
  };

  my.domainRangeCenterMap = function (asArray = true) {
    let ret = domainRangeCenterMap;
    if (asArray) {
      ret = Array.from(domainRangeCenterMap, ([key, value]) => ({
        key,
        value,
      }));
    }
    return ret;
  };

  my.facetRangeArray = function () {
    return facetRangeArray;
  };
  // Return 'my' function which contains all the getter and setter methods that in turn return the my function.
  // This allows method chaining and is only possible because in javascript functions are objects
  return my;
}

const scaleBandFacetAxis = function () {
  function my(selection) {
    // render charts
  }
};

export function getAxisPathString(x1, x2, y1, y2) {
  const path = d3.path();
  path.moveTo(x1, y1);
  path.lineTo(x2, y2);
  path.closePath();

  return path;
}

/**
 * Renders the X-axis for a given selection using the provided scale.
 *
 * @param {d3.Selection} selection - The selection to append the X-axis to.
 * @param {Function} xScale - The scale function for the X-axis.
 * @param {number} yPos - The y-coordinate position of the X-axis.
 * @param {boolean} [bottom=true] - Whether the axis should be at the bottom (default) or top.
 * @param {boolean} [rotateLabels=false] - Whether to rotate the tick labels by 90 degrees.
 * @returns {d3.Selection} - The X-axis selection.
 */
export function renderAxisX(
  selection,
  xScale,
  yPos,
  bottom = true,
  rotateLabels = false
) {
  const tickLengthBase = 6;
  const tickMarkAndTextPadding = 4;
  let tickLength = bottom ? tickLengthBase : -tickLengthBase;
  let dominantBaseline;
  let textAnchor;
  let rotate = 0;
  let tickNudgeAxis = "y";
  let tickTextNudgeAmount =
    tickLength + Math.sign(tickLength) * tickMarkAndTextPadding;

  // Configure text anchor and dominant baseline based on rotation settings
  if (!rotateLabels) {
    dominantBaseline = bottom ? "text-before-edge" : "text-after-edge";
    textAnchor = "middle";
  } else {
    textAnchor = bottom ? "end" : "start";
    dominantBaseline = "middle";
    rotate = -90;
    tickNudgeAxis = "x";
    tickTextNudgeAmount = -tickTextNudgeAmount;
  }

  // Select or create the X-axis group element
  const xAxis = selection
    .selectAll(".x-axis")
    .data([null])
    .join("g")
    .attr("class", "x-axis");

  // Append the X-axis path (axis line) to the group
  xAxis
    .append("path")
    .attr("class", "domain")
    .attr("d", xScale().axisPathX())
    .style("stroke", "black");

  // Translate the X-axis group to the specified yPos if provided
  if (yPos !== undefined) {
    xAxis.attr("transform", `translate(0, ${yPos})`);
  }

  // Bind data to ticks, create the tick group, and translate them to their positions
  const ticks = xAxis
    .selectAll(".tick")
    .data(xScale.domainRangeCenterMap())
    .join("g")
    .attr("class", "tick")
    .attr("transform", (d) => `translate( ${d.value},0)`);

  // Append the tick marks (lines) to the ticks
  const tickMarks = ticks.append("line").attr("stroke", "currentColor");
  tickMarks.attr("y2", tickLength);

  // Append the tick labels (text) to the ticks and configure rotation and position
  const tickText = ticks
    .append("text")
    .attr("class", "x-axis-tick-text")
    .attr("fill", "currentColor")
    .attr("text-anchor", textAnchor)
    .attr("dominant-baseline", dominantBaseline)
    .attr("transform", `rotate(${rotate}, 0, 0)`)
    .attr(tickNudgeAxis, tickTextNudgeAmount)
    .text((d) => d.key);

  return xAxis;
}

/**
 * Renders the Y-axis for a given selection using the provided scale.
 *
 * @param {d3.Selection} selection - The selection to append the Y-axis to.
 * @param {Function} yScale - The scale function for the Y-axis.
 * @param {number} xPos - The x-coordinate position of the Y-axis.
 * @param {boolean} [left=true] - Whether the axis should be at the left (default) or right.
 * @returns {d3.Selection} - The Y-axis selection.
 */
export function renderAxisY(selection, yScale, xPos, left = true) {
  const tickLengthBase = 6;
  const tickMarkAndTextPadding = 4;
  const facetNudgeX = -100;
  let tickLength = left ? -tickLengthBase : tickLengthBase;
  let textAnchor = left ? "end" : "start"; // Updated textAnchor based on left parameter
  let tickTextNudgeAmount =
    tickLength + Math.sign(tickLength) * tickMarkAndTextPadding;

  // Select or create the Y-axis group element
  const yAxis = selection
    .selectAll(".y-axis")
    .data([null])
    .join("g")
    .attr("class", "y-axis");

  // Append the Y-axis path (axis line) to the group
  yAxis
    .append("path")
    .attr("class", "domain")
    .attr("d", yScale().axisPathY())
    .style("stroke", "black");

  // Translate the Y-axis group to the specified xPos if provided
  if (xPos !== undefined) {
    yAxis.attr("transform", `translate(${xPos}, 0)`);
  }

  // Bind data to ticks, create the tick group, and translate them to their positions
  const ticks = yAxis
    .selectAll(".tick")
    .data(yScale.domainRangeCenterMap())
    .join("g")
    .attr("class", "tick")
    .attr("transform", (d) => `translate(0, ${d.value})`);

  // Append the tick marks (lines) to the ticks
  const tickMarks = ticks.append("line").attr("stroke", "currentColor");
  tickMarks.attr("x2", tickLength);

  // Append the tick labels (text) to the ticks and configure position
  const tickText = ticks
    .append("text")
    .attr("class", "y-axis-tick-text")
    .attr("fill", "currentColor")
    .attr("text-anchor", textAnchor)
    .attr("dominant-baseline", "middle")
    .attr("x", tickTextNudgeAmount)
    .text((d) => d.key);

  // Add facet rectangles and text
  const tickBoundingBoxWidth = ticks.node().getBBox().width;
  const facetRectWidth = 100;
  const facetLeftNudge = -tickBoundingBoxWidth - facetRectWidth - 30;
  // console.log("width: " + tickBoundingBoxWidth);
  const facetGroup = yAxis
    .selectAll(".facet")
    .data(yScale.facetRangeArray())
    .join("g")
    .attr("class", "facet")
    .attr(
      "transform",
      (d) => `translate(${facetLeftNudge}, ${d.startPosition})`
    );

  const facetRect = facetGroup
    .append("rect")
    .attr("class", "facet-rect")
    .attr("x", 0) // You might need to adjust the x-position based on your needs
    .attr("y", 0) // You might need to adjust the y-position based on your needs
    .attr("width", facetRectWidth) // Adjust the width of the rectangle
    .attr("height", (d) => d.rectHeight);

  const facetText = facetGroup
    .append("text")
    .text((d) => d.facet) // Set the text content
    .attr("class", "facet-text")
    .attr("x", facetRectWidth / 2) // Set x-coordinate to the middle
    .attr("y", (d) => d.rectHeight / 2) // Set y-coordinate to the middle
    // .attr("x", 0) // Set x-coordinate to the middle
    // .attr("y", 0) // Set y-coordinate to the middle
    .attr("text-anchor", "middle") // Align text in the middle
    .attr("dominant-baseline", "middle"); // Align text vertically in the middle
  return yAxis;
}
