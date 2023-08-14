
#

## Key Formula

![Alt text](CodeCogsEqn(1).png)

Above is in in pixel space (paddingInner is really paddingInnerPixels)

```{latex}
Bandiwdth  = \frac{RangeWidth - 2 \times outerPadding - (nDomains - 1 - nFacetChanges) \times innerPadding  - nFacetChanges \times facetPaddingMultiplier \times innerPadding}{nDomains} 
```


To transform proportional padding values to pixel widths of padding:

```
paddingInnerPixels = (paddingInner * rangePixelWidth) / (n - 1)
paddingFacetPixels = facetPaddingMultipler * paddingInnerPixels
paddingOuterPixels = (paddingOuter * rangePixelWidth) / 2
```


Although we may need to change this based based on nFacetChanges

Then calculating **step** is pretty simple. Just an array of size = nDomains, where each value corresponds to the distance between: the top of element n and the top of the previous(n-1) element. 

First value in the array doesn't matter cos the full calculation will be multiplied by zero.

examplar input to create this step array is as follows:

facetChangeFromPrevious

step = bandwidth + { if facet-change  paddingInnerPixels or if not-facetchange paddingFacetPixels }

Then we need to cumulatively sum step, 
