import * as d3 from "d3";

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
    paddingFacet = 0.5,
    bandwidth,
    domainRangeMap = new Map(),
    domainRangeCenterMap = new Map(),
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
      console.log("Function called without value supplied. Returning function");
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

    console.log(facet);
    console.log(facetChangeFromPrevious);

    return my;
  };

  my.paddingInner = function (_) {
    return arguments.length ? ((paddingInner = _), my) : paddingInner;
  };

  my.paddingOuter = function (_) {
    return arguments.length ? ((paddingOuter = _), my) : paddingOuter;
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

    const rangePixelWidth = stop - start,
      n = domain.length;

    const paddingInnerPixels = (paddingInner * rangePixelWidth) / (n - 1);
    const paddingOuterPixels = (paddingOuter * rangePixelWidth) / 2;

    bandwidth =
      (rangePixelWidth -
        2 * paddingOuterPixels -
        (n - 1) * paddingInnerPixels) /
      n;

    step = bandwidth + paddingInnerPixels;

    const pixelValues = d3
      .range(n)
      .map((i) => start + paddingOuterPixels + step * i);

    const pixelValuesCentered = d3
      .range(n)
      .map((i) => start + paddingOuterPixels + step * i + bandwidth / 2);

    //prettier-ignore
    d3.range(n).map((i) => domainRangeMap.set(domain[i], pixelValues[i]));
    //prettier-ignore
    d3.range(n).map((i) => domainRangeCenterMap.set(domain[i], pixelValuesCentered[i]));

    // console.log("rangePixelWidth:" + rangePixelWidth);
    // console.log("paddingInnerPixels:" + paddingInnerPixels);
    // console.log("paddingOuterPixels:" + paddingOuterPixels);
    // console.log("bandwidth:" + bandwidth);
    // console.log("Step:" + step);
    // console.log("n:" + n);
    // console.log("pixelValues:" + pixelValues);
    return my;
  };

  my.buildDomainRangeMap = function () {
    if (domain === undefined || range === undefined) {
      return my;
    }

    const rangePixelWidth = stop - start,
      n = domain.length;

    const paddingInnerPixels = (paddingInner * rangePixelWidth) / (n - 1);
    const paddingOuterPixels = (paddingOuter * rangePixelWidth) / 2;
    bandwidth =
      (rangePixelWidth -
        2 * paddingOuterPixels -
        (n - 1) * paddingInnerPixels) /
      n;

    step = bandwidth + paddingInnerPixels;

    const pixelValues = d3
      .range(n)
      .map((i) => start + paddingOuterPixels + step * i);

    const pixelValuesCentered = d3
      .range(n)
      .map((i) => start + paddingOuterPixels + step * i + bandwidth / 2);

    //prettier-ignore
    d3.range(n).map((i) => domainRangeMap.set(domain[i], pixelValues[i]));
    //prettier-ignore
    d3.range(n).map((i) => domainRangeCenterMap.set(domain[i], pixelValuesCentered[i]));

    // console.log("rangePixelWidth:" + rangePixelWidth);
    // console.log("paddingInnerPixels:" + paddingInnerPixels);
    // console.log("paddingOuterPixels:" + paddingOuterPixels);
    // console.log("bandwidth:" + bandwidth);
    // console.log("Step:" + step);
    // console.log("n:" + n);
    // console.log("pixelValues:" + pixelValues);
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
    .attr("fill", "currentColor")
    .attr("text-anchor", textAnchor)
    .attr("dominant-baseline", "middle")
    .attr("x", tickTextNudgeAmount)
    .text((d) => d.key);

  return yAxis;
}
