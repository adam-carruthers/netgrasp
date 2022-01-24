import type * as d3 from "d3";
import { SimulatedLink, SimulatedPathLinkSelection } from "../common";

export const createPathLinkSelector = (
  parent: d3.Selection<SVGSVGElement, any, any, any>
) =>
  parent
    .append("g")
    .attr("stroke", "red")
    .attr("stroke-width", 6)
    .attr("stroke-dasharray", 10)
    .attr("fill", "none")
    .selectAll<SVGPathElement, any>("path")
    .data<SimulatedLink>([]);

export const pathLinkEnter = (
  enter: d3.Selection<d3.EnterElement, SimulatedLink, any, any>
) => enter.append("path");

export const pathLinkTick = (svgPathLinks: SimulatedPathLinkSelection) =>
  svgPathLinks.attr("d", ({ source, target }) => {
    const [Mx, My] = [(source.x + target.x) / 2, (source.y + target.y) / 2];
    let [dx, dy] = [target.x - source.x, target.y - source.y];
    const magnitude = (dx ** 2 + dy ** 2) ** 0.5;
    if (magnitude > 0.001) {
      dx *= 30 / magnitude;
      dy *= 30 / magnitude;
    }
    const [sx, sy] = [Mx + dy, My - dx];
    return `M ${source.x} ${source.y} Q ${sx} ${sy} ${target.x} ${target.y}`;
  });
