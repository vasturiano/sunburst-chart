export interface ConfigOptions { }

type Accessor<In, Out> = Out | string | ((obj: In) => Out);
type NodeAccessor<T> = Accessor<Node, T>;

export interface Node {
  __dataNode?: DataNode;
  name?: string;
  children?: Node[];
  [key: string]: any;
}

export interface DataNode {
  data: Node;
  id: number;
  value: number;
  depth: number;
  height: number;
  parent: DataNode | null;
  children?: DataNode[];
  x0?: number;
  y0?: number;
  x1?: number;
  y1?: number;
}

type Orientation = 'angular' | 'radial' | 'auto';

type CompareFn<ItemType> = (a: ItemType, b: ItemType) => number;

type TooltipFn = (node: Node, dataNode: DataNode) => string;

type NonFittingLabelFn = (label: string, availablePx: number, node: DataNode) => string | null | undefined | false;

declare class SunburstChart {
  constructor(element: HTMLElement, configOptions?: ConfigOptions);

  width(): number;
  width(width: number): SunburstChart;
  height(): number;
  height(height: number): SunburstChart;

  data(): Node;
  data(rootNode: Node): SunburstChart;
  children(): NodeAccessor<Node[]>;
  children(childrenAccessor: NodeAccessor<Node[]>): SunburstChart;
  label(): NodeAccessor<string>;
  label(textAccessor: NodeAccessor<string>): SunburstChart;
  size(): NodeAccessor<string>;
  size(sizeAccessor: NodeAccessor<string>): SunburstChart;
  color(): NodeAccessor<string>;
  color(colorAccessor: NodeAccessor<string>): SunburstChart;
  strokeColor(): NodeAccessor<string>;
  strokeColor(colorAccessor: NodeAccessor<string>): SunburstChart;
  nodeClassName(): NodeAccessor<string>;
  nodeClassName(nodeAccessor: NodeAccessor<string>): SunburstChart;

  minSliceAngle(): number;
  minSliceAngle(degrees: number): SunburstChart;
  maxLevels(): number;
  maxLevels(degrees: number): SunburstChart;
  excludeRoot(): boolean;
  excludeRoot(exclude: boolean): SunburstChart;
  centerRadius(): number;
  centerRadius(radiusRatio: number): SunburstChart;
  radiusScaleExponent(): number;
  radiusScaleExponent(exponent: number): SunburstChart;

  sort(): CompareFn<Node> | null;
  sort(cmpFn: CompareFn<Node> | null): SunburstChart;

  showLabels(): boolean;
  showLabels(show: boolean): SunburstChart;
  labelOrientation(): Orientation;
  labelOrientation(orientation: Orientation): SunburstChart;
  handleNonFittingLabel(): NonFittingLabelFn | null;
  handleNonFittingLabel(handleFn: NonFittingLabelFn | null): SunburstChart;
  showTooltip(): (node: Node) => boolean;
  showTooltip(showTooltipFn: (node: Node) => boolean): SunburstChart;
  tooltipTitle(): TooltipFn;
  tooltipTitle(fn: TooltipFn): SunburstChart;
  tooltipContent(): TooltipFn;
  tooltipContent(fn: TooltipFn): SunburstChart;

  onClick(cb: ((node: Node, event: MouseEvent) => void) | null): SunburstChart;
  onRightClick(cb: ((node: Node, event: MouseEvent) => void) | null): SunburstChart;
  onHover(cb: ((node: Node | null, event: MouseEvent) => void) | null): SunburstChart;

  focusOnNode(): Node | null;
  focusOnNode(node: Node | null): SunburstChart;

  transitionDuration(): number;
  transitionDuration(duration: number): SunburstChart;
}

export default SunburstChart;
