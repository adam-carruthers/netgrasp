import * as d3 from "d3";
import createDefs from "./svgDefs";

export const createBaseSvgs = () => {
  // Create the selectors
  const baseSvg = d3
    .select("#svg-container")
    .html("")
    .append("svg")
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("preserveAspectRatio", "none");

  const contentSvg = baseSvg.append("svg").attr("x", 0).attr("y", 0);

  const controlsSvg = baseSvg.append("svg").attr("x", 0).attr("y", 0);

  createDefs(baseSvg);

  return { baseSvg, contentSvg, controlsSvg };
};
