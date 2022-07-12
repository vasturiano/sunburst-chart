import { select as d3Select } from 'd3-selection';
import { scaleLinear, scalePow } from 'd3-scale';
import { hierarchy as d3Hierarchy, partition as d3Partition } from 'd3-hierarchy';
import { arc as d3Arc } from 'd3-shape';
import { path as d3Path } from 'd3-path';
import { interpolate as d3Interpolate } from 'd3-interpolate';
import { transition as d3Transition } from 'd3-transition';
import Kapsule from 'kapsule';
import accessorFn from 'accessor-fn';
import Tooltip from 'float-tooltip';

const CHAR_PX_WIDTH = 7;
const CHAR_PX_HEIGHT = 14;

export default Kapsule({

  props: {
    width: { default: window.innerWidth },
    height: { default: window.innerHeight },
    data: { onChange(_, state) { state.needsReparse = true }},
    children: { default: 'children', onChange(_, state) { state.needsReparse = true }},
    sort: { onChange(_, state) { state.needsReparse = true }},
    label: { default: d => d.name },
    labelOrientation: { default: 'auto' }, // angular, radial, auto
    size: { default: 'value', onChange(_, state) { state.needsReparse = true }},
    color: { default: d => 'lightgrey' },
    strokeColor: { default: d => 'white' },
    nodeClassName: {}, // Additional css classes to add on each slice node
    minSliceAngle: { default: .2 },
    maxLevels: {},
    excludeRoot: { default: false, onChange(_, state) { state.needsReparse = true }},
    centerRadius: { default: 0.1 },
    radiusScaleExponent: { default: 0.5 }, // radius decreases quadratically outwards to preserve area
    showLabels: { default: true },
    tooltipContent: { default: d => '', triggerUpdate: false },
    tooltipTitle: { default: null, triggerUpdate: false },
    showTooltip: { default: d => true, triggerUpdate: false},
    focusOnNode: {
      onChange: function(d, state) {
        if (d && state.initialised) {
          moveStackToFront(d.__dataNode);
        }

        function moveStackToFront(elD) {
          state.svg.selectAll('.slice').filter(d => d === elD)
            .each(function(d) {
              this.parentNode.appendChild(this);
              if (d.parent) { moveStackToFront(d.parent); }
            })
        }
      }
    },
    onClick: { triggerUpdate: false },
    onHover: { triggerUpdate: false },
    transitionDuration: { default: 750, triggerUpdate: false }
  },

  methods: {
    _parseData: function(state) {
      if (state.data) {
        const hierData = d3Hierarchy(state.data, accessorFn(state.children))
          .sum(accessorFn(state.size));

        if (state.sort) {
          hierData.sort(state.sort);
        }

        d3Partition().padding(0)(hierData);

        if (state.excludeRoot) {
          // re-scale y values if excluding root
          const yScale = scaleLinear()
            .domain([hierData.y1 - hierData.y0, 1]);

          hierData.descendants().forEach(d => {
            d.y0 = yScale(d.y0);
            d.y1 = yScale(d.y1);
          });
        }

        hierData.descendants().forEach((d, i) => {
          d.id = i; // Mark each node with a unique ID
          d.data.__dataNode = d; // Dual-link data nodes
        });

        state.layoutData = hierData.descendants();
      }
    }
  },

  aliases: {
    onNodeClick: 'onClick'
  },

  init: function(domNode, state) {
    state.chartId = Math.round(Math.random() * 1e12); // Unique ID for DOM elems

    state.radiusScale = scalePow();
    state.angleScale = scaleLinear()
      .domain([0, 10]) // For initial build-in animation
      .range([0, 2 * Math.PI])
      .clamp(true);

    state.arc = d3Arc()
      .startAngle(d => state.angleScale(d.x0))
      .endAngle(d => state.angleScale(d.x1))
      .innerRadius(d => Math.max(0, state.radiusScale(d.y0)))
      .outerRadius(d => Math.max(0, state.radiusScale(d.y1)));

    const el = d3Select(domNode)
      .append('div').attr('class', 'sunburst-viz');

    state.svg = el.append('svg');
    state.canvas = state.svg.append('g');

    state.tooltip = Tooltip()(el);

    // Reset focus by clicking on canvas
    state.svg
      .on('click', () => (state.onClick || this.focusOnNode)(null)) // By default reset zoom when clicking on canvas
      .on('mouseover', () => state.onHover && state.onHover(null));

  },

  update: function(state) {
    if (state.needsReparse) {
      this._parseData();
      state.needsReparse = false;
    }

    const maxRadius = (Math.min(state.width, state.height) / 2);
    state.radiusScale.range([maxRadius * Math.max(0, Math.min(1, state.centerRadius)), maxRadius]);

    state.radiusScaleExponent > 0 && state.radiusScale.exponent(state.radiusScaleExponent);

    state.svg
      .style('width', state.width + 'px')
      .style('height', state.height + 'px')
      .attr('viewBox', `${-state.width/2} ${-state.height/2} ${state.width} ${state.height}`);

    if (!state.layoutData) return;

    const focusD =
      (state.focusOnNode && state.focusOnNode.__dataNode.y0 >= 0 && state.focusOnNode.__dataNode)
      || { x0: 0, x1: 1, y0: 0, y1: 1 };

    const slice = state.canvas.selectAll('.slice')
      .data(
        state.layoutData
          .filter(d => // Show only slices with a large enough angle and within the max levels
            d.x1 > focusD.x0
            && d.x0 < focusD.x1
            && (d.x1-d.x0)/(focusD.x1-focusD.x0) > state.minSliceAngle/360
            && (!state.maxLevels || d.depth - (focusD.depth || (state.excludeRoot ? 1 : 0)) < state.maxLevels)
            && (d.y0 >=0 || focusD.parent) // hide negative layers on top level
          ),
        d => d.id
      );

    const nameOf = accessorFn(state.label);
    const colorOf = accessorFn(state.color);
    const strokeColorOf = accessorFn(state.strokeColor);
    const nodeClassNameOf = accessorFn(state.nodeClassName);
    const transition = d3Transition().duration(state.transitionDuration);

    const levelYDelta = state.layoutData[0].y1 - state.layoutData[0].y0;
    const maxY = Math.min(1, focusD.y0 + levelYDelta * Math.min(
      focusD.hasOwnProperty('height') ? focusD.height + 1 : Infinity,
      state.maxLevels || Infinity
    ));

    // Apply zoom
    state.svg.transition(transition)
      .tween('scale', () => {
        const xd = d3Interpolate(state.angleScale.domain(), [focusD.x0, focusD.x1]);
        const yd = d3Interpolate(state.radiusScale.domain(), [focusD.y0, maxY]);
        return t => {
          state.angleScale.domain(xd(t));
          state.radiusScale.domain(yd(t));
        };
      });

    // Exiting
    const oldSlice = slice.exit().transition(transition).remove();
    oldSlice.select('path.main-arc').attrTween('d', d => () => state.arc(d));
    oldSlice.select('path.hidden-arc').attrTween('d', d => () => middleArcLine(d));

    // Entering
    const newSlice = slice.enter().append('g')
      .style('opacity', 0)
      .on('click', (ev, d) => {
        ev.stopPropagation();
        (state.onClick || this.focusOnNode)(d.data);
      })
      .on('mouseover', (ev, d) => {
        ev.stopPropagation();
        state.onHover && state.onHover(d.data);

        state.tooltip.content(!!state.showTooltip(d.data, d) && `<div class="tooltip-title">${
          state.tooltipTitle
            ? state.tooltipTitle(d.data, d)
            : getNodeStack(d)
              .slice(state.excludeRoot ? 1 : 0)
              .map(d => nameOf(d.data))
              .join(' &rarr; ')
        }</div>${state.tooltipContent(d.data, d)}`);
      })
      .on('mouseout', () => state.tooltip.content(false));

    newSlice.append('path')
      .attr('class', 'main-arc')
      .style('stroke', d => strokeColorOf(d.data, d.parent))
      .style('fill', d => colorOf(d.data, d.parent));

    newSlice.append('path')
      .attr('class', 'hidden-arc')
      .attr('id', d => `hidden-arc-${state.chartId}-${d.id}`);

    // angular label
    const angularLabel = newSlice.append('text')
        .attr('class', 'angular-label');

    // Add white contour
    angularLabel.append('textPath')
      .attr('class', 'text-contour')
      .attr('startOffset','50%')
      .attr('xlink:href', d => `#hidden-arc-${state.chartId}-${d.id}` );

    angularLabel.append('textPath')
      .attr('class', 'text-stroke')
      .attr('startOffset','50%')
      .attr('xlink:href', d => `#hidden-arc-${state.chartId}-${d.id}` );

    // radial label
    const radialLabel = newSlice.append('g').attr('class', 'radial-label');
    radialLabel.append('text').attr('class', 'text-contour'); // white contour
    radialLabel.append('text').attr('class', 'text-stroke');

    // Entering + Updating
    const allSlices = slice.merge(newSlice);

    allSlices
      .style('opacity', 1)
      .attr('class', d => [
        'slice',
        ...(`${nodeClassNameOf(d.data) || ''}`.split(' ').map(str => str.trim()))
      ].filter(s => s).join(' '));

    allSlices.select('path.main-arc').transition(transition)
      .attrTween('d', d => () => state.arc(d))
      .style('stroke', d => strokeColorOf(d.data, d.parent))
      .style('fill', d => colorOf(d.data, d.parent));

    const computeAngularLabels = state.showLabels && ['angular', 'auto'].includes(state.labelOrientation.toLowerCase());
    const computeRadialLabels = state.showLabels && ['radial', 'auto'].includes(state.labelOrientation.toLowerCase());

    if (computeAngularLabels) {
      allSlices.select('path.hidden-arc').transition(transition)
        .attrTween('d', d => () => middleArcLine(d));
    }

    // Ensure propagation of data to labels children
    allSlices.select('text.angular-label').select('textPath.text-contour');
    allSlices.select('text.angular-label').select('textPath.text-stroke');
    allSlices.select('g.radial-label').select('text.text-contour');
    allSlices.select('g.radial-label').select('text.text-stroke');

    // Show/hide labels
    allSlices.select('.angular-label')
      .transition(transition)
        .styleTween('display', d => () => computeAngularLabels
          && (state.labelOrientation === 'auto' ? autoPickLabelOrientation(d) === 'angular' : angularTextFits(d))
          ? null : 'none'
        );

    allSlices.select('.radial-label')
      .transition(transition)
        .styleTween('display', d => () => computeRadialLabels
          && (state.labelOrientation === 'auto' ? autoPickLabelOrientation(d) === 'radial' : radialTextFits(d))
          ? null : 'none'
        );

    // Set labels
    computeAngularLabels && allSlices.selectAll('text.angular-label').selectAll('textPath')
      .text(d => nameOf(d.data));

    computeRadialLabels && allSlices.selectAll('g.radial-label').selectAll('text')
      .text(d => nameOf(d.data))
      .transition(transition)
        .attrTween('transform', d => () => radialTextTransform(d));

    //

    function middleArcLine(d) {
      const halfPi = Math.PI/2;
      const angles = [state.angleScale(d.x0) - halfPi, state.angleScale(d.x1) - halfPi];
      const r = Math.max(0, (state.radiusScale(d.y0) + state.radiusScale(d.y1)) / 2);

      if (!r || !(angles[1] - angles[0])) return '';

      const middleAngle = (angles[1] + angles[0]) / 2;
      const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
      if (invertDirection) { angles.reverse(); }

      const path = d3Path();
      path.arc(0, 0, r, angles[0], angles[1], invertDirection);
      return path.toString();
    }

    function radialTextTransform(d) {
      const middleAngle = (state.angleScale(d.x0) + state.angleScale(d.x1) - Math.PI) / 2;
      const r = Math.max(0, (state.radiusScale(d.y0) + state.radiusScale(d.y1)) / 2);

      const x = r * Math.cos(middleAngle);
      const y = r * Math.sin(middleAngle);
      let rot = middleAngle * 180 / Math.PI;

      middleAngle > Math.PI / 2 && middleAngle < Math.PI * 3/2 && (rot += 180); // prevent upside down text

      return `translate(${x}, ${y}) rotate(${rot})`;
    }

    function angularTextFits(d) {
      const deltaAngle = state.angleScale(d.x1) - state.angleScale(d.x0);
      const r = Math.max(0, (state.radiusScale(d.y0) + state.radiusScale(d.y1)) / 2);
      const perimeter = r * deltaAngle;
      return nameOf(d.data).toString().length * CHAR_PX_WIDTH < perimeter;
    }

    function radialTextFits(d) {
      const availableHeight = state.radiusScale(d.y0) * (state.angleScale(d.x1) - state.angleScale(d.x0));
      if (availableHeight < CHAR_PX_HEIGHT) return false; // not enough angular space

      const availableLength = state.radiusScale(d.y1) - state.radiusScale(d.y0);
      return nameOf(d.data).toString().length * CHAR_PX_WIDTH < availableLength;
    }

    function autoPickLabelOrientation(d) {
      // prefer mode that keeps text most horizontal
      const angle = ((state.angleScale(d.x0) + state.angleScale(d.x1)) / 2)%Math.PI;
      const preferRadial = angle > Math.PI / 4 && angle < Math.PI * 3/4;

      return preferRadial
        ? (radialTextFits(d) ? 'radial' : angularTextFits(d) ? 'angular' : null)
        : (angularTextFits(d) ? 'angular' : radialTextFits(d) ? 'radial' : null)
    }

    function getNodeStack(d) {
      const stack = [];
      let curNode = d;
      while (curNode) {
        stack.unshift(curNode);
        curNode = curNode.parent;
      }
      return stack;
    }
  }
});
