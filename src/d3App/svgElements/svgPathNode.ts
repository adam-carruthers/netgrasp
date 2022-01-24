import type * as d3 from "d3";
import { SimulatedPathNode, SimulatedPathNodeSelection } from "../common";

export const createPathNodeSelector = (
  parent: d3.Selection<SVGSVGElement, any, any, any>
) =>
  parent
    .append("g")
    .selectAll<SVGGElement, any>("g")
    .data<SimulatedPathNode>([]);

const NODE_R = 70;
const NODE_WIDTH = 0.3;
const NODE_TIP_PROP = 0.2;
const NODE_TEXT_PROP = 1.1;

export const calcStepAngle = (i: number, pathStepsLength: number) =>
  pathStepsLength * NODE_WIDTH > Math.PI * 1.8
    ? (-i * 2 * Math.PI) / pathStepsLength
    : -i * NODE_WIDTH;
const calcTrianglePath = ({ angle }: { angle: number }) =>
  `M ${Math.sin(angle - NODE_WIDTH / 2) * NODE_R * NODE_TIP_PROP} ${
    -Math.cos(angle - NODE_WIDTH / 2) * NODE_R * NODE_TIP_PROP
  } L ${Math.sin(angle) * NODE_R} ${-Math.cos(angle) * NODE_R} L ${
    Math.sin(angle - 0.3) * NODE_R
  } ${-Math.cos(angle - 0.3) * NODE_R} Z`;

export const pathNodeUpdate = (update: SimulatedPathNodeSelection) =>
  update
    .call((g) => g.select("path").attr("d", calcTrianglePath))
    .call((g) =>
      g
        .select("text")
        .text((d) => d.i + 1)
        .attr(
          "x",
          ({ angle }) =>
            Math.sin(angle - NODE_WIDTH / 2) * NODE_R * NODE_TEXT_PROP
        )
        .attr(
          "y",
          ({ angle }) =>
            -Math.cos(angle - NODE_WIDTH / 2) * NODE_R * NODE_TEXT_PROP
        )
    );

export const pathNodeTick = (svgPathNodes: SimulatedPathNodeSelection) =>
  svgPathNodes.attr(
    "transform",
    (d) => `translate(${d.dataNode.x}, ${d.dataNode.y})`
  );

export const pathNodeEnter = (
  enter: d3.Selection<d3.EnterElement, SimulatedPathNode, any, any>
) =>
  enter
    .append("g")
    .call((g) => g.append("path").attr("fill", "url('#pathGradient')"))
    .call((g) =>
      g
        .append("text")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("fill", "red")
    )
    .call((g) => pathNodeUpdate(g));
