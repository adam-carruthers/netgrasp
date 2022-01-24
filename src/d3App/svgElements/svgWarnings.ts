export const createNoNodesWarning = (
  parent: d3.Selection<SVGSVGElement, any, any, any>
) =>
  parent
    .append("text")
    .attr("x", 150)
    .attr("y", 23)
    .text("⚠ There are no nodes in the current view!")
    .style("visibility", "visible");

export const createPathNotAllVisibleWarning = (
  parent: d3.Selection<SVGSVGElement, any, any, any>
) =>
  parent
    .append("text")
    .attr("x", 150)
    .attr("y", 50) // Not really good to keep different warnings out the way with different y positions but life is short
    .text("⚠ Not all nodes in the path are visible in this view!")
    .style("visibility", "visible");
