import type * as d3 from "d3";
import {
  NodeGroupSelectedToView,
  ReduxFadingNodeSelectedToView,
  ReduxNodeSelectedToView,
} from "../redux/selectGraph/reselectView";

export interface SimulatedItem extends Required<d3.SimulationNodeDatum> {
  id: string;
  fading: boolean;
  itemType: "node" | "fadingNode" | "nodeGroup";
}

export interface SimulatedNode extends ReduxNodeSelectedToView, SimulatedItem {
  itemType: "node";
}

export interface SimulatedFadingNode
  extends ReduxFadingNodeSelectedToView,
    SimulatedItem {
  itemType: "fadingNode";
}

export interface SimulatedNodeGroup
  extends NodeGroupSelectedToView,
    SimulatedItem {
  itemType: "nodeGroup";
}

export interface SimulatedLink {
  source: SimulatedItem;
  target: SimulatedItem;
  fading?: boolean;
}

export interface SimulatedPathNode {
  i: number;
  angle: number;
  dataNode: SimulatedItem;
}

export type SimulatedNodeSelection = d3.Selection<
  SVGGElement,
  SimulatedNode,
  any,
  any
>;

export type SimulatedLinkSelection = d3.Selection<
  SVGLineElement,
  SimulatedLink,
  any,
  any
>;

export type SimulatedHighlightedNodeSelection = d3.Selection<
  SVGCircleElement,
  SimulatedItem,
  any,
  any
>;

export type SimulatedPathNodeSelection = d3.Selection<
  SVGGElement,
  SimulatedPathNode,
  any,
  any
>;

export type SimulatedPathLinkSelection = d3.Selection<
  SVGPathElement,
  SimulatedLink,
  any,
  any
>;

export type SimulatedNodeGroupSelection = d3.Selection<
  SVGGElement,
  SimulatedNodeGroup,
  any,
  any
>;
