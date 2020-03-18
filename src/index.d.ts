export interface ConfigOptions {}

type Accessor<In, Out> = Out | string | ((obj: In) => Out);
type NodeAccessor<T> = Accessor<Node, T>;

export interface Node {
  __dataNode?: DataNode;
  name?: string;
  children?: Node[];
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

type CompareFn<ItemType> = (a: ItemType, b: ItemType) => number;

type TooltipFn = (node: Node, dataNode: DataNode) => string;

export interface SunburstChartGenericInstance<ChainableInstance> {
  (element: HTMLElement): ChainableInstance;

  width(): number;
  width(width: number): ChainableInstance;
  height(): number;
  height(height: number): ChainableInstance;

  data(): Node;
  data(rootNode: Node): ChainableInstance;
  children(): NodeAccessor<Node[]>;
  children(childrenAccessor: NodeAccessor<Node[]>): ChainableInstance;
  label(): NodeAccessor<string>;
  label(textAccessor: NodeAccessor<string>): ChainableInstance;
  size(): NodeAccessor<string>;
  size(sizeAccessor: NodeAccessor<string>): ChainableInstance;
  color(): NodeAccessor<string>;
  color(colorAccessor: NodeAccessor<string>): ChainableInstance;

  minSliceAngle(): number;
  minSliceAngle(degrees: number): ChainableInstance;
  maxLevels(): number;
  maxLevels(degrees: number): ChainableInstance;
  excludeRoot(): boolean;
  excludeRoot(exclude: boolean): ChainableInstance;

  sort(): CompareFn<Node> | null;
  sort(cmpFn: CompareFn<Node> | null);

  showLabels(): boolean;
  showLabels(show: boolean): ChainableInstance;
  showTooltip(): boolean;
  showTooltip(show: boolean): ChainableInstance;
  tooltipTitle(): TooltipFn;
  tooltipTitle(fn: TooltipFn): ChainableInstance;
  tooltipContent(): TooltipFn;
  tooltipContent(fn: TooltipFn): ChainableInstance;

  onClick(cb: ((node: Node) => void) | null): ChainableInstance;
  onHover(cb: ((node: Node | null) => void) | null): ChainableInstance;

  focusOnNode(): Node | null;
  focusOnNode(node: Node | null): ChainableInstance;
}

export type SunburstChartInstance = SunburstChartGenericInstance<SunburstChartInstance>;

declare function SunburstChart(configOptions?: ConfigOptions): SunburstChartInstance;

export default SunburstChart;
