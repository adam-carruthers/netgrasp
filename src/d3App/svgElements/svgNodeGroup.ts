import * as d3 from "d3";
import { SimulatedNodeGroup, SimulatedNodeGroupSelection } from "../common";

export const nodeGroupTick = (svgNodeGroups: SimulatedNodeGroupSelection) =>
  svgNodeGroups.attr("transform", (d) => `translate(${d.x}, ${d.y})`);

export const createNodeGroupSelector = (
  parent: d3.Selection<SVGSVGElement, any, any, any>
) =>
  parent
    .append("g")
    .attr("class", "node-group-g")
    .selectAll<SVGGElement, any>("g")
    .data<SimulatedNodeGroup>([]);

export const nodeGroupUpdate = (update: SimulatedNodeGroupSelection) =>
  update
    .call((g) => g.select("text:nth-of-type(1)").text((d) => d.name))
    .call((g) => g.select("text:nth-of-type(2)").text((d) => d.name));

const color = d3.scaleOrdinal(d3.schemeTableau10);

export const nodeGroupEnter = (
  enter: d3.Selection<d3.EnterElement, SimulatedNodeGroup, any, any>,
  drag: d3.DragBehavior<SVGGElement, SimulatedNodeGroup, unknown>
) =>
  enter
    .append("g")
    .call((g) => drag(g))
    .call((g) =>
      g
        .append("circle")
        .attr("r", 30)
        .attr("fill", (d) => color(d.id))
        .attr("stroke", "#fff")
        .attr("stroke-width", 5)
    )
    .call((g) =>
      g
        .append("text")
        .attr("y", -10)
        .attr("alignment-baseline", "middle")
        .style("stroke", "white")
        .style("stroke-width", "0.4em")
        .style("stroke-opacity", "50%")
        .style("font-size", 30)
    )
    .call((g) =>
      g
        .append("text")
        .attr("y", -10)
        .attr("alignment-baseline", "middle")
        .style("font-size", 30)
    )
    .call((g) => nodeGroupUpdate(g));