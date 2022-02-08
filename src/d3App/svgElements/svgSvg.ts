import * as d3 from "d3";
import createDefs from "./svgDefs";
import store from "../../redux/reduxStore";
import { clearHighlightedNode } from "../../redux/slices/highlightedSlice";

export const createBaseSvgs = () => {
  // Create the selectors
  const baseSvg = d3
    .select("#svg-container")
    .html("")
    .append("svg")
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("preserveAspectRatio", "none")
    .on("click", () => store.dispatch(clearHighlightedNode()));

  const contentSvg = baseSvg.append("svg").attr("x", 0).attr("y", 0);

  const controlsSvg = baseSvg.append("svg").attr("x", 0).attr("y", 0);

  createDefs(baseSvg);

  return { baseSvg, contentSvg, controlsSvg };
};
