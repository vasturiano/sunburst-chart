Sunburst Chart
==============

[![NPM package][npm-img]][npm-url]
[![Build Size][build-size-img]][build-size-url]
[![Dependencies][dependencies-img]][dependencies-url]

<p align="center">
     <a href="https://vasturiano.github.io/sunburst-chart/example/flare/"><img width="80%" src="https://vasturiano.github.io/sunburst-chart/example/flare/screenshot.png"></a>
</p>

An interactive sunburst chart for representing hierarchical data, where each data node of a tree is represented by an annular segment within multi-layered rings. 

Clicking on an arc focuses the view on the associated sub-tree, enabling a gradual exploration of the data. Clicking in the chart's center zooms out one level, while clicking on the canvas resets the zoom level to the root view.
The chart also responds to data changes by animating the arcs of each of the nodes into their new positions. 
The arcs areas are linearly proportional to their data values, resulting in a decrease of the thickness of the outer layers in a quadratic fashion.

For improved performance, arcs smaller than a given threshold (`minSliceAngle`) are excluded from the DOM, allowing for representation of large data sets while maintaining a smooth interaction. See [here for an example](https://vasturiano.github.io/sunburst-chart/example/large-data) of a randomly generated large data structure.

See also the [Icicle](https://github.com/vasturiano/icicle-chart), [Circle Pack](https://github.com/vasturiano/circlepack-chart) and [Treemap](https://github.com/vasturiano/treemap-chart) charts.

## Quick start

```
import Sunburst from 'sunburst-chart';
```
or
```
Sunburst = require('sunburst-chart');
```
or even
```
<script src="//unpkg.com/sunburst-chart"></script>
```
then
```
const myChart = Sunburst();
myChart
    .data(<myData>)
    (<myDOMElement>);
```

## API reference

| Method | Description | Default |
| --- | --- | --- |
| <b>data</b>([<i>object</i>]) | Getter/setter for chart data (see below for syntax details). | |
| <b>width</b>([<i>number</i>]) | Getter/setter for the chart width in px. | *&lt;window width&gt;* |
| <b>height</b>([<i>number</i>]) | Getter/setter for the chart height in px. | *&lt;window height&gt;* |
| <b>children</b>([<i>string</i> or <i>fn</i>]) | Getter/setter for a data node's children accessor, used to establish the hierarchical relationship between nodes. Supports either a <i>string</i> indicating the object's property name, or a `function(node)` which should return an array of nodes. | `children` |
| <b>label</b>([<i>string</i> or <i>fn</i>]) | Getter/setter for a node object label accessor, used to display labels on the arcs and their tooltips. | `name` |
| <b>size</b>([<i>string</i> or <i>fn</i>]) | Getter/setter for a node object size accessor, used to compute the angles of the arcs. | `value` |
| <b>color</b>([<i>string</i> or <i>fn</i>]) | Getter/setter for a node object color accessor, used to color the arcs. | <i>grey</i> |
| <b>minSliceAngle</b>([<i>number</i>]) | Getter/setter for the minimum angle of an arc (in degrees) required for it to be rendered in the DOM. | `0.2` |
| <b>maxLevels</b>([<i>number</i>]) | Getter/setter for the maximum number of layers to show at any given time. | - |
| <b>excludeRoot</b>([<i>boolean</i>]) | Getter/setter for whether to exclude the root node from the top level representation, to maximize the available radial space. | `false` |
| <b>sort</b>([<i>fn</i>]) | Getter/setter for the compare method used to sort sibling arcs. A value of `null` (*default*) maintains the existing order found in the input data structure. This method is equivalent to [d3-hierarchy's sort](https://github.com/d3/d3-hierarchy#node_sort), it receives two arguments representing two sibling arcs and expects a numeric return value (`-1`, `0` or `1`) indicating the order. Each element is an instance of [d3-hierarchy node](https://github.com/d3/d3-hierarchy#hierarchy) and has several useful properties to specify order: `data` (the corresponding data object), `value` (summed value of node and all its descendants) and `depth` (layer degree). For [example](https://vasturiano.github.io/sunburst-chart/example/sort-by-size/), to order arcs by angular size, use: `(a, b) => b.value - a.value`. | *&lt;existing order*&gt; |
| <b>showLabels</b>([<i>boolean</i>]) | Getter/setter for whether to show labels in the arcs. Regardless of this setting, labels too large to fit within an arc's boundaries are automatically hidden. | `true` |
| <b>showTooltip</b>([<i>fn</i>]) | Getter/setter to specify a node object tooltip's visibility. If this function returns `false` for a particular node, that node's tooltip will not display at all. If unspecified, all nodes' tooltips will display. | `() => true` |
| <b>tooltipTitle</b>([<i>fn</i>]) | Getter/setter for a node object tooltip title. The function should return a string to be displayed in bold in the first line of the tooltip. If unspecified, the full hierarchical name will be displayed. | |
| <b>tooltipContent</b>([<i>string</i> or <i>fn</i>]) | Getter/setter for a node object tooltip content accessor. Use this to specify extra content in each of the arc's tooltips in addition to the title set in `tooltipTitle`. | |
| <b>focusOnNode</b>([<i>object</i>]) | Getter/setter for the data node to focus the chart on. Use this method to retrieve the current node in focus, or to programmatically zoom the chart to a particular node. | |
| <b>onHover</b>([<i>fn</i>]) | Callback function for mouse hover events. Includes the data node object (or `null` if hovering on background) as single argument. | |
| <b>onClick</b>([<i>fn</i>]) | Callback function for click events. Includes the data node object (or `null` if clicking on background) as single argument. A falsy value (default) automatically focuses on clicked nodes, equivalent to `myChart.onClick(myChart.focusOnNode)`. | |

## Data syntax

```
{
  name: "root"
  children: [
    {
      name: "leafA",
      value: 3
    },
    {
      name: "nodeB",
      children: [
        {
          name: "leafBA",
          value: 5
        },
        {
          name: "leafBB",
          value: 1
        }
      ]
    }
  ]
}
```

## Giving Back

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=L398E7PKP47E8&currency_code=USD&source=url) If this project has helped you and you'd like to contribute back, you can always [buy me a ☕](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=L398E7PKP47E8&currency_code=USD&source=url)!

[npm-img]: https://img.shields.io/npm/v/sunburst-chart.svg
[npm-url]: https://npmjs.org/package/sunburst-chart
[build-size-img]: https://img.shields.io/bundlephobia/minzip/sunburst-chart.svg
[build-size-url]: https://bundlephobia.com/result?p=sunburst-chart
[dependencies-img]: https://img.shields.io/david/vasturiano/sunburst-chart.svg
[dependencies-url]: https://david-dm.org/vasturiano/sunburst-chart
