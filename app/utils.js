/**
 * Calculates the maximum number of characters in an array of strings.
 * 
 * @param {Array} strings An array of strings.
 * @returns {number} The maximum number of characters in the array of strings.
 */
export function maxCharacters(strings) {
    if (!Array.isArray(strings) || strings.length === 0) {
      return 0; // If the input is not an array or empty, return 0
    }
  
    const maxLength = strings.reduce((max, str) => {
      const length = str.length;
      return length > max ? length : max;
    }, 0);
  
    return maxLength;
  }
  
  /**
   * Returns the string with the greatest length from an array of strings.
   * 
   * @param {Array} arr An array of strings.
   * @returns {string} The string with the greatest length.
   */
  export function longestString(arr) {
    let longest = "";
    for (let str of arr) {
      if (str.length > longest.length) {
        longest = str;
      }
    }
    return longest;
  }
  
  /**
   * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
   * 
   * @param {String} text The text to be rendered.
   * @param {String} font The CSS font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
   * @returns {number} The width of the given text in pixels.
   * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
   */
  export function getTextWidth(text, font) {
    // re-use canvas object for better performance
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  }
  
  /**
   * Retrieves the computed CSS style property for a given element.
   * 
   * @param {Element} element The HTML element.
   * @param {String} prop The CSS property to retrieve.
   * @returns {String} The computed CSS style property.
   */
  function getCssStyle(element, prop) {
    return window.getComputedStyle(element, null).getPropertyValue(prop);
  }
  
  /**
   * Retrieves the font style of a canvas element.
   * 
   * @param {Element} el The canvas element.
   * @returns {String} The font style of the canvas element.
   */
  export function getCanvasFont(el) {
    const fontWeight = getCssStyle(el, 'font-weight') || 'normal';
    const fontSize = getCssStyle(el, 'font-size') || '16px';
    const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman';
    
    return `${fontWeight} ${fontSize} ${fontFamily}`;
  }
  

// Computes Various X intercepts important for determining where we should place y Axes
export function yAxisLayout() {
    
    // Properties
    let facets,
    domain,
    margin, 
    windowWidth,
    geneBarPadding,
    geneBarWidth,
    fontSizeFacet = 14,
    fontSizeDomain = 14,
    tickMarkAndTextPadding,
    tickLength,
    metrics = {};

    const my = function(){
        return my;
    }

    my.margin = function (_) {
        return arguments.length ? ((margin = _), my) : margin;
    };

    my.facets = function (_) {
        return arguments.length ? ((facets = _), my) : facets;
    };

    my.domain = function (_) {
        return arguments.length ? ((domain = _), my) : domain;
    };

    my.tickWidth = function (_) {
        return arguments.length ? ((tickWidth = _), my) : tickWidth;
    };

    my.geneBarPadding = function (_) {
        return arguments.length ? ((geneBarPadding = _), my) : geneBarPadding;
    };
    
    my.geneBarWidth = function (_) {
        return arguments.length ? ((geneBarWidth = _), my) : geneBarWidth;
    };

    my.windowWidth = function (_) {
        return arguments.length ? ((windowWidth = _), my) : windowWidth;
    };

    my.tickMarkAndTextPadding = function (_) {
        return arguments.length ? ((tickMarkAndTextPadding = _), my) : tickMarkAndTextPadding;
    };

    my.tickLength = function (_) {
        return arguments.length ? ((tickLength = _), my) : tickLength;
    };

    my.fontSizeFacet = function (_) {
        return arguments.length ? ((fontSizeFacet = _), my) : fontSizeFacet;
    };
    
    my.fontSizeDomain = function (_) {
        return arguments.length ? ((fontSizeDomain = _), my) : fontSizeDomain;
    };

    my.computeLayout = function(){
        if (margin === undefined) throw new Error('margin is undefined');
        if (windowWidth === undefined) throw new Error('windowWidth is undefined');
        if (geneBarPadding === undefined) throw new Error('geneBarPadding is undefined');
        if (geneBarWidth === undefined) throw new Error('geneBarWidth is undefined');
        if (tickMarkAndTextPadding === undefined) throw new Error('tickMarkAndTextPadding is undefined');
        if (tickLength === undefined) throw new Error('tickLength is undefined');
        if (facets === undefined) throw new Error('facets is undefined');
        if (domain === undefined) throw new Error('domain is undefined');

        // const leftMargin = margin.left
        const tickWidth = tickLength + tickMarkAndTextPadding

        // Calculate the maximum number of characters in facets and domains
        const maxCharactersFacet = maxCharacters(facets);
        const maxCharactersDomain = maxCharacters(domain);
        

        
        // Calculate facet width and Y-axis text and tick width
        metrics.facetPosX = margin.left
        metrics.facetWidth = maxCharactersFacet * fontSizeFacet
        metrics.yTextAndTickWidth = maxCharactersDomain * fontSizeDomain + Math.abs(tickWidth);
        
        // Calculate X pixel position of Y axis
        metrics.oncoplotPosStartX = margin.left + metrics.facetWidth + metrics.yTextAndTickWidth;
        metrics.oncoplotWidth = windowWidth - margin.left - margin.right -metrics.facetWidth - metrics.yTextAndTickWidth - geneBarWidth - geneBarPadding
        metrics.oncoplotPosEndX = metrics.oncoplotPosStartX + metrics.oncoplotWidth
        metrics.geneBarPosX = metrics.oncoplotPosStartX + metrics.oncoplotWidth + geneBarPadding

        return(metrics)
    }

   
    
    return my;
  }

// Computes Various Y intercepts important for determining where we should x Axes
export function xAxisLayout() {
    
    // Properties
    let
    domain, // sample names
    showSampleNames,
    fontsizeX,
    margin, 
    windowHeight,
    tmbBarPadding,
    tmbBarHeight,
    tickMarkAndTextPadding,
    oncoplotClinicalPadding = 10,
    clinicalRowHeight,
    clinicalRowPadding,
    clinicalRowNumber, 
    tickLength,
    metrics = {};

    const my = function(){
        return my;
    }

    my.margin = function (_) {
        return arguments.length ? ((margin = _), my) : margin;
    };

    my.domain = function (_) {
        return arguments.length ? ((domain = _), my) : domain;
    };


    my.tmbBarPadding = function (_) {
        return arguments.length ? ((tmbBarPadding = _), my) : tmbBarPadding;
    };
    
    my.tmbBarHeight = function (_) {
        return arguments.length ? ((tmbBarHeight = _), my) : tmbBarHeight;
    };

    my.windowHeight = function (_) {
        return arguments.length ? ((windowHeight = _), my) : windowHeight;
    };

    my.tickMarkAndTextPadding = function (_) {
        return arguments.length ? ((tickMarkAndTextPadding = _), my) : tickMarkAndTextPadding;
    };

    my.tickLength = function (_) {
        return arguments.length ? ((tickLength = _), my) : tickLength;
    };
    
    my.fontsizeX = function (_) {
        return arguments.length ? ((fontsizeX = _), my) : fontsizeX;
    };

    my.oncoplotClinicalPadding = function (_) {
        return arguments.length ? ((oncoplotClinicalPadding = _), my) : oncoplotClinicalPadding;
    };

    my.clinicalRowHeight = function (_) {
        return arguments.length ? ((clinicalRowHeight = _), my) : clinicalRowHeight;
    };

    my.clinicalRowPadding = function (_) {
        return arguments.length ? ((clinicalRowPadding = _), my) : clinicalRowPadding;
    };

    my.clinicalRowNumber = function (_) {
        return arguments.length ? ((clinicalRowNumber = _), my) : clinicalRowNumber;
    };

    my.showSampleNames = function (_) {
        return arguments.length ? ((showSampleNames = _), my) : showSampleNames;
    };
    my.computeLayout = function(){
        // Ensure all variables used in this function are defined
        if (margin === undefined) throw new Error('margin is undefined');
        if (windowHeight === undefined) throw new Error('windowHeight is undefined');
        if (tmbBarPadding === undefined) throw new Error('tmbBarPadding is undefined');
        if (tmbBarHeight === undefined) throw new Error('tmbBarHeight is undefined');
        if (tickMarkAndTextPadding === undefined) throw new Error('tickMarkAndTextPadding is undefined');
        if (tickLength === undefined) throw new Error('tickLength is undefined');
        if (domain === undefined) throw new Error('domain is undefined');
    
        // Calculate the maximum number of characters in domain (sample Names)
        const maxCharactersDomain = maxCharacters(domain);
    
        // Extract fontsize so we can figure out how wide to make facet + gene names (need to move these to scale)
        if(!showSampleNames){
            metrics.maxSampleLabelsHeight = 0
        }
        else{
            metrics.maxSampleLabelsHeight = fontsizeX * maxCharactersDomain + Math.abs(tickLength + tickMarkAndTextPadding)
        }
    
        metrics.tmbBarPosStartY = margin.top
        metrics.tmbBarHeight = tmbBarHeight
        metrics.tmbBarPosEndY = margin.top + tmbBarHeight
        metrics.oncoplotPosStartY = metrics.tmbBarPosStartY + metrics.tmbBarHeight  + tmbBarPadding
        metrics.clinicalHeight = clinicalRowHeight * clinicalRowNumber + clinicalRowPadding * (clinicalRowNumber-1)
        metrics.oncoplotHeight = windowHeight - tmbBarHeight - metrics.clinicalHeight - metrics.maxSampleLabelsHeight - tmbBarPadding - oncoplotClinicalPadding - margin.top - margin.bottom
        metrics.oncoplotPosEndY = metrics.oncoplotPosStartY + metrics.oncoplotHeight
        metrics.clinicalStartY = metrics.oncoplotPosEndY + oncoplotClinicalPadding
        metrics.clinicalEndY = metrics.clinicalStartY + metrics.clinicalHeight

        return metrics;
    }
    

   
    
    return my;
  }