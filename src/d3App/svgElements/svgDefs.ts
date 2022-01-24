import type * as d3 from "d3";

const createDefs = (parent: d3.Selection<SVGSVGElement, any, any, any>) =>
  parent.append("defs").html(`
      <radialGradient id="selectGradient">
        <stop offset="0%" stop-color="blue" />
        <stop offset="100%" stop-color="white" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="pathGradient" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="70">
        <stop offset="50%" stop-color="white" stop-opacity="0" />
        <stop offset="100%" stop-color="red" stop-opacity="1" />
      </radialGradient>
    `);

export default createDefs;
