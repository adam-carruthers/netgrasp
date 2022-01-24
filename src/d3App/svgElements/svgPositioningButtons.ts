import type PositionManager from "../positionManager";

const border = 5;
const buttonSize = 25;
const padding = 3;

const createPositioningButton = (
  parent: d3.Selection<SVGSVGElement, any, any, any>,
  x: number,
  y: number,
  insideText: string,
  buttonWidth = buttonSize,
  fontSize = 23
) =>
  parent
    .append("g")
    .style("user-select", "none")
    .attr("transform", `translate(${x}, ${y})`)
    .attr("class", "positioningButton")
    .call((g) =>
      g.append("rect").attr("width", buttonWidth).attr("height", buttonSize)
    )
    .call((g) =>
      g
        .append("text")
        .attr("fill", "white")
        .attr("alignment-baseline", "middle")
        .attr("text-anchor", "middle")
        .attr("font-size", fontSize)
        .text(insideText)
        .attr("x", buttonWidth / 2)
        .attr("y", buttonSize / 2 + 1)
    );

export const createGoToHighlightedNodeButton = (
  parent: d3.Selection<SVGSVGElement, any, any, any>
) =>
  createPositioningButton(
    parent,
    border,
    border + (buttonSize + padding) * 3 + padding,
    "=> Highlighted",
    2 * (buttonSize + padding) + 2 * buttonSize + border * 3,
    15
  );

export const createControlSelectors = (
  parent: d3.Selection<SVGSVGElement, any, any, any>,
  positionManager: PositionManager
) => {
  const Up = createPositioningButton(
    parent,
    border + buttonSize + padding,
    border,
    "↑"
  ).call((button) => positionManager.registerArrowButton("Up", button));
  const Down = createPositioningButton(
    parent,
    border + buttonSize + padding,
    border + buttonSize + padding + buttonSize + padding,
    "↓"
  ).call((button) => positionManager.registerArrowButton("Down", button));
  const Left = createPositioningButton(
    parent,
    border,
    border + buttonSize + padding,
    "←"
  ).call((button) => positionManager.registerArrowButton("Left", button));
  const Right = createPositioningButton(
    parent,
    border + buttonSize + padding + buttonSize + padding,
    border + buttonSize + padding,
    "→"
  ).call((button) => positionManager.registerArrowButton("Right", button));

  const Home = createPositioningButton(
    parent,
    border + buttonSize + padding,
    border + buttonSize + padding,
    "⌂"
  ).on("click", () => positionManager.centerView());

  const ZoomIn = createPositioningButton(
    parent,
    border + 2 * (buttonSize + padding) + buttonSize + border * 3,
    border,
    "+"
  ).on("click", () => positionManager.doZoom(1));
  const ZoomReset = createPositioningButton(
    parent,
    border + 2 * (buttonSize + padding) + buttonSize + border * 3,
    border + buttonSize + padding,
    "0"
  ).on("click", () => positionManager.setZoom(0));
  const ZoomOut = createPositioningButton(
    parent,
    border + 2 * (buttonSize + padding) + buttonSize + border * 3,
    border + 2 * (buttonSize + padding),
    "-"
  ).on("click", () => positionManager.doZoom(-1));

  return {
    Up,
    Down,
    Left,
    Right,
    Home,
    ZoomIn,
    ZoomReset,
    ZoomOut,
  };
};
