import type * as d3 from "d3";
import { ReduxNodeSelectedToView } from "../redux/selectGraph/reselectView";

export interface SimulatedNode
  extends ReduxNodeSelectedToView,
    Required<d3.SimulationNodeDatum> {
  fading: boolean;
}

export interface SimulatedLink {
  source: SimulatedNode;
  target: SimulatedNode;
  fading?: boolean;
}

export interface SimulatedPathNode {
  i: number;
  angle: number;
  dataNode: SimulatedNode;
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
  SimulatedNode,
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
