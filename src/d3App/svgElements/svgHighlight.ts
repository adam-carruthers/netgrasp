import type * as d3 from "d3";
import { SimulatedHighlightedNodeSelection, SimulatedItem } from "../common";

export const createHighlightSelector = (
  parent: d3.Selection<SVGSVGElement, any, any, any>
) =>
  parent
    .append("g")
    .selectAll<SVGCircleElement, any>("circle")
    .data<SimulatedItem>([]);

export const highlightEnter = (
  enter: d3.Selection<d3.EnterElement, SimulatedItem, any, any>
) =>
  enter.append("circle").attr("r", 100).attr("fill", "url('#selectGradient')");

export const highlightTick = (
  svgHighlight: SimulatedHighlightedNodeSelection
) => svgHighlight.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
