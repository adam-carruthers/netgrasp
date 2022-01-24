import * as d3 from "d3";
import { createControlSelectors } from "./svgElements/svgPositioningButtons";

const speed = 1;

class PositionManager {
  zoom = 1;
  xOffset = 0;
  yOffset = 0;

  width = 100;
  height = 100;

  ongoingMovements: Record<string, d3.Timer> = {};
  registeredButtons: Record<string, d3.Selection<SVGGElement, any, any, any>> =
    {};

  baseSvg: d3.Selection<SVGSVGElement, any, any, any>;
  contentSvg: d3.Selection<SVGSVGElement, any, any, any>;
  controlsSvg: d3.Selection<SVGSVGElement, any, any, any>;

  constructor(
    baseSvg: d3.Selection<SVGSVGElement, any, any, any>,
    contentSvg: d3.Selection<SVGSVGElement, any, any, any>,
    controlsSvg: d3.Selection<SVGSVGElement, any, any, any>
  ) {
    this.baseSvg = baseSvg;
    this.contentSvg = contentSvg;
    this.controlsSvg = controlsSvg;

    new ResizeObserver(this.resizeUpdate).observe(
      document.getElementById("svg-container") as Element,
      {
        box: "border-box",
      }
    );

    // Create the movement controls
    createControlSelectors(this.controlsSvg, this);

    d3.select("body")
      .on("keydown", (event) => {
        this.onKeyDown(event.key);
      })
      .on("keyup", (event) => {
        this.onKeyUp(event.key);
      });

    this.bigDrag()(baseSvg);
  }

  onKeyDown = (key: string) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key))
      this.startMove(key.slice(5));
  };

  onKeyUp = (key: string) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key))
      this.endMove(key.slice(5));
  };

  startMove = (key: string) => {
    if (this.ongoingMovements[key]) return; // Movement is already running

    this.registeredButtons[key].attr("data-key-active", true);

    this.ongoingMovements[key] = d3.timer(this.moveDirectionTick(key));
  };

  endMove = (key: string) => {
    this.ongoingMovements[key].stop();
    delete this.ongoingMovements[key];
    this.registeredButtons[key].attr("data-key-active", null);
  };

  moveDirectionTick = (key: string) => {
    let lastElapsed = 0;

    return (elapsed: number) => {
      const deltaT = elapsed - lastElapsed;
      const displacement = (deltaT * speed) / this.zoom;

      if (key === "Up") {
        this.yOffset -= displacement;
      } else if (key === "Down") {
        this.yOffset += displacement;
      } else if (key === "Left") {
        this.xOffset -= displacement;
      } else if (key === "Right") {
        this.xOffset += displacement;
      }

      this.positionUpdate();

      lastElapsed = elapsed;
    };
  };

  registerArrowButton = (
    key: string,
    selector: d3.Selection<SVGGElement, any, any, any>
  ) => {
    this.registeredButtons[key] = selector;
    selector.on("mousedown", () => this.startMove(key));
    selector.on("mouseup", () => this.endMove(key));
  };

  centerView = () => {
    this.xOffset = 0;
    this.yOffset = 0;
    this.positionUpdate();
  };

  setViewCoords = (x: number, y: number) => {
    this.xOffset = x;
    this.yOffset = y;
    this.positionUpdate();
  };

  doZoom = (deltaZoomStrength: number) => {
    this.zoom *= 1.25 ** deltaZoomStrength;
    this.positionUpdate();
  };

  setZoom = (zoomStrength: number) => {
    this.zoom = 1.25 ** zoomStrength;
    this.positionUpdate();
  };

  bigDrag = () =>
    d3.drag<SVGSVGElement, unknown>().on("drag", (event) => {
      this.xOffset -= event.dx / this.zoom;
      this.yOffset -= event.dy / this.zoom;
      this.positionUpdate();
    });

  positionUpdate = () => {
    this.contentSvg.attr("viewBox", [
      -this.width / (2 * this.zoom) + this.xOffset,
      -this.height / (2 * this.zoom) + this.yOffset,
      this.width / this.zoom,
      this.height / this.zoom,
    ]);
  };

  resizeUpdate: ResizeObserverCallback = (entries) => {
    ({ blockSize: this.height, inlineSize: this.width } =
      entries[0].borderBoxSize[0]);
    this.baseSvg
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("viewBox", [0, 0, this.width, this.height]);
    this.contentSvg.attr("width", this.width).attr("height", this.height);
    this.positionUpdate(); // Sets contentSvg's viewbox
    this.controlsSvg
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("viewBox", [0, 0, this.width, this.height]);
  };
}

export default PositionManager;
