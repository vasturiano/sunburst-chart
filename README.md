# Sunburst Chart

<p align="center">
     <a href="https://vasturiano.github.io/sunburst-chart/example/flare/"><img width="80%" src="https://vasturiano.github.io/sunburst-chart/example/flare/screenshot.png"></a>
</p>

An interactive sunburst chart for representing hierarchical data, where each data node of a tree is represented by an annular segment within multi-layered rings. 

Clicking on an arc focuses the view on the associated sub-tree, enabling a gradual exploration of the data. Clicking in the chart's center zooms out one level, while clicking on the canvas resets the zoom level to the root view.
The chart also responds to data changes by animating the arcs of each of the nodes into their new positions. 
The arcs areas are linearly proportional to their data values, resulting in a decrease of the thickness of the outer layers in a quadratic fashion.

For improved performance, arcs smaller than a given threshold (`minSliceAngle`) are excluded from the DOM, allowing for representation of large data sets while maintaining a smooth interaction. See [here for an example](https://vasturiano.github.io/sunburst-chart/example/large-data) of a randomly generated large data structure.

[![NPM](https://nodei.co/npm/sunburst-chart.png?compact=true)](https://nodei.co/npm/sunburst-chart/)

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
| <b>data</b>([<i>object</i>]) | Getter/setter for chart data (see below for syntax details). | `[]` |
| <b>width</b>([<i>number</i>]) | Getter/setter for the chart width in px. | *&lt;window width&gt;* |
| <b>height</b>([<i>number</i>]) | Getter/setter for the chart height in px. | *&lt;window height&gt;* |
| <b>children</b>([<i>string</i> or <i>fn</i>]) | Getter/setter for a data node's children accessor, used to establish the hierarchical relationship between nodes. Supports either a <i>string</i> indicating the object's property name, or a `function(node)` which should return an array of nodes. | `children` |
| <b>label</b>([<i>string</i> or <i>fn</i>]) | Getter/setter for a node object label accessor, used to display labels on the arcs and their tooltips. | `name` |
| <b>size</b>([<i>string</i> or <i>fn</i>]) | Getter/setter for a node object size accessor, used to compute the angles of the arcs. | `value` |
| <b>color</b>([<i>string</i> or <i>fn</i>]) | Getter/setter for a node object color accessor, used to color the arcs. | <i>grey</i> |
| <b>minSliceAngle</b>([<i>number</i>]) | Getter/setter for the minimum angle of an arc (in degrees) required for it to be rendered in the DOM. | `0.2` |
| <b>sort</b>([<i>fn</i>]) | Getter/setter for the compare method used to sort sibling arcs. A value of `null` (*default*) maintains the existing order found in the input data structure. This method is equivalent to [d3-hierarchy's sort](https://github.com/d3/d3-hierarchy#node_sort), it receives two arguments representing two sibling arcs and expects a numeric return value (`-1`, `0` or `1`) indicating the order. Each element is an instance of [d3-hierarchy node](https://github.com/d3/d3-hierarchy#hierarchy) and has several useful properties to specify order: `data` (the corresponding data object), `value` (summed value of node and all its descendants), `height` (arc's angle as a full-circle fraction) and `depth` (layer degree). For [example](https://vasturiano.github.io/sunburst-chart/example/sort-by-size/), to order arcs by angular size, use: `(a, b) => b.value - a.value`. | *&lt;existing order*&gt; |
| <b>showLabels</b>([<i>boolean</i>]) | Getter/setter for whether to show labels in the arcs. Regardless of this setting, labels too large to fit within an arc's boundaries are automatically hidden. | `true` |
| <b>tooltipContent</b>([<i>string</i> or <i>fn</i>]) | Getter/setter for a node object tooltip content accessor. Use this to specify extra content in each of the arc's tooltips in addition to the node's full hierarchical name that's included by default. | |
| <b>focusOnNode</b>([<i>object</i>]) | Getter/setter for the data node to focus the chart on. Use this method to retrieve the current node in focus, or to programmatically zoom the chart to a particular node. | |
| <b>onNodeClick</b>([<i>fn</i>]) | Callback function for node click events. Includes the data node object as single argument. A value of `null` (default) automatically focuses on clicked nodes, equivalent to `myChart.onNodeClick(myChart.focusOnNode)`. | `null` |

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