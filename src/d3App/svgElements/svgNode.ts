import * as d3 from "d3";
import icons from "../../icons/icons";
import handleNodeClickThunk from "../../redux/thunks/handleNodeClickThunk";
import store from "../../redux/reduxStore";
import type { SimulatedNode, SimulatedNodeSelection } from "../common";
import handleNodeDblClickThunk from "../../redux/thunks/handleNodeDblClickThunk";

export const nodeTick = (svgNodes: SimulatedNodeSelection) =>
  svgNodes.attr("transform", (d) => `translate(${d.x}, ${d.y})`);

const onNodeClick = (_: any, clickedDataNode: SimulatedNode) => {
  store.dispatch(handleNodeClickThunk(clickedDataNode));
};

const onNodeDblClick = (_: any, clickedDataNode: SimulatedNode) => {
  store.dispatch(handleNodeDblClickThunk(clickedDataNode));
};

export const createNodeSelector = (
  parent: d3.Selection<SVGSVGElement, any, any, any>
) =>
  parent
    .append("g")
    .attr("class", "node-g")
    .selectAll<SVGGElement, any>("g")
    .data<SimulatedNode>([]);

const nodeLabel = (text: d3.Selection<d3.BaseType, SimulatedNode, any, any>) =>
  text
    .call((text) => text.select("tspan:nth-child(1)").text((d) => d.name))
    .call((text) =>
      text.select("tspan:nth-child(2)").text((d) => {
        if (d.hasCombinedChildren)
          return `(${d.logicalChildren.length} child${
            d.logicalChildren.length > 1 ? "ren" : ""
          })`;
        if (d.alreadyInLogicalGroupWarning)
          return "⚠ Already member of other logical group";
        return "";
      })
    )
    .call((text) =>
      text.select("tspan:nth-child(3)").text((d) => {
        if (d.hasCombinedChildren && d.alreadyInLogicalGroupWarning)
          return "⚠ Already member of other logical group";
        return "";
      })
    );

export const nodeUpdate = (update: SimulatedNodeSelection) =>
  update
    .call((g) => g.select("text:nth-of-type(1)").call(nodeLabel))
    .call((g) => g.select("text:nth-of-type(2)").call(nodeLabel))
    .call((g) =>
      g
        .select("image")
        .attr("href", (d) => (d.icon && icons[d.icon]) || icons.circle)
        .attr("opacity", (d) => (d.ongoingEditIsTransparent ? 0.5 : 1))
    );

const createTSpan = (text: d3.Selection<SVGTextElement, any, any, any>) =>
  text.append("tspan").attr("x", 0).attr("dy", "1.2em");

export const nodeEnter = (
  enter: d3.Selection<d3.EnterElement, SimulatedNode, any, any>,
  drag: d3.DragBehavior<SVGGElement, SimulatedNode, unknown>
) =>
  enter
    .append("g")
    .on("click", onNodeClick)
    .on("dblclick", onNodeDblClick)
    .call((g) => {
      drag(g);
    })
    .call((g) =>
      g
        .append("image")
        .attr("width", 80)
        .attr("transform", "translate(-30, -30)")
    )
    .call((g) =>
      g
        .append("text")
        .attr("y", -10)
        .attr("alignment-baseline", "middle")
        .style("stroke", "white")
        .style("stroke-width", "0.4em")
        .style("stroke-opacity", "50%")
        .call(createTSpan)
        .call(createTSpan)
        .call(createTSpan)
    )
    .call((g) =>
      g
        .append("text")
        .attr("y", -10)
        .attr("alignment-baseline", "middle")
        .call(createTSpan)
        .call(createTSpan)
        .call(createTSpan)
    )
    .call((g) => nodeUpdate(g));
