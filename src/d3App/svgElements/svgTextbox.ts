import * as d3 from "d3";
import {
  changeTextboxPosition,
  Textbox,
} from "../../redux/slices/textboxesSlice";
import store from "../../redux/reduxStore";

const PADDING = 5;

export const createTextboxSelector = (
  parent: d3.Selection<SVGSVGElement, any, any, any>
) =>
  parent
    .append("g")
    .attr("class", "textbox-g")
    .selectAll<SVGGElement, any>("g")
    .data<Textbox>([]);

export const textboxUpdate = (
  update: d3.Selection<SVGGElement, Textbox, any, any>
) =>
  update
    .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
    .each(function (d) {
      const g = d3.select(this);
      const text = g.select<SVGTextElement>("text");
      const rect = g.select<SVGRectElement>("rect");

      text
        .selectAll("tspan")
        .data(d.text.split("\n").map((s) => (s.length === 0 ? " " : s)))
        .join(
          (enter) =>
            enter
              .append("tspan")
              .text((d) => d)
              .attr("x", 0)
              .attr("dy", "1.2em"),
          (update) => update.text((d) => d)
        );

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { width, height } = text.node()!.getBBox();

      rect
        .attr("width", width + 2 * PADDING)
        .attr("height", height + 2 * PADDING);
    });

export const textboxEnter = (
  enter: d3.Selection<d3.EnterElement, Textbox, any, any>
) =>
  enter
    .append("g")
    .call(
      d3
        .drag<SVGGElement, Textbox>()
        .on("drag", function (event) {
          d3.select(this).attr(
            "transform",
            `translate(${event.x}, ${event.y})`
          );
        })
        .on("end", (event, d) => {
          store.dispatch(
            changeTextboxPosition({ textboxId: d.id, x: event.x, y: event.y })
          );
        })
    )
    .call((g) =>
      g
        .append("rect")
        .attr("x", -PADDING)
        .attr("y", -PADDING + 4)
        .attr("stroke", "black")
        .attr("fill", "white")
        .attr("rx", 5)
    )
    .call((g) =>
      g.append("text").attr("alignment-baseline", "hanging").attr("dy", 0)
    )
    .call(textboxUpdate);
