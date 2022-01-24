import type * as d3 from "d3";
import handleLinkClickThunk from "../../redux/thunks/handleLinkClickThunk";
import store from "../../redux/reduxStore";
import type { SimulatedLink, SimulatedLinkSelection } from "../common";

const linkOnClick = (_: any, dataLink: SimulatedLink) => {
  store.dispatch(handleLinkClickThunk(dataLink));
};

export const createLinkSelector = (
  parent: d3.Selection<SVGSVGElement, any, any, any>
) =>
  parent
    .append("g")
    .attr("stroke", "#000")
    .attr("stroke-width", 2)
    .attr("class", "link-g")
    .selectAll<SVGLineElement, any>("line")
    .data<SimulatedLink>([]);

export const linkUpdate = (update: SimulatedLinkSelection) =>
  update.style("stroke-dasharray", (d) => (d.fading ? "15,15" : ""));

export const linkEnter = (
  enter: d3.Selection<d3.EnterElement, SimulatedLink, any, any>
) =>
  enter
    .append("line")
    .on("click", linkOnClick)
    .call((line) => linkUpdate(line));

export const linkTick = (svgLink: SimulatedLinkSelection) =>
  svgLink
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);
