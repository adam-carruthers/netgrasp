import * as d3 from "d3";
import type {
  NodeGroupSelectedToView,
  ReduxFadingNodeSelectedToView,
  ReduxNodeSelectedToView,
} from "../redux/selectGraph/reselectView";
import type { ReduxLink } from "../redux/slices/fullGraphSlice";
import {
  SimulatedFadingNode,
  SimulatedHighlightedNodeSelection,
  SimulatedItem,
  SimulatedLink,
  SimulatedLinkSelection,
  SimulatedNode,
  SimulatedNodeGroup,
  SimulatedNodeGroupSelection,
  SimulatedNodeSelection,
  SimulatedPathLinkSelection,
  SimulatedPathNodeSelection,
} from "./common";
import {
  createHighlightSelector,
  highlightEnter,
  highlightTick,
} from "./svgElements/svgHighlight";
import {
  createLinkSelector,
  linkEnter,
  linkTick,
  linkUpdate,
} from "./svgElements/svgLink";
import {
  createNodeSelector,
  nodeEnter,
  nodeTick,
  nodeUpdate,
} from "./svgElements/svgNode";
import {
  createPathLinkSelector,
  pathLinkEnter,
  pathLinkTick,
} from "./svgElements/svgPathLink";
import {
  calcStepAngle,
  createPathNodeSelector,
  pathNodeEnter,
  pathNodeTick,
  pathNodeUpdate,
} from "./svgElements/svgPathNode";
import store from "../redux/reduxStore";
import { fixNodeInPinGroup } from "../redux/slices/pinGroupsSlice";
import {
  createNoNodesWarning,
  createPathNotAllVisibleWarning,
} from "./svgElements/svgWarnings";
import { NodeGroup } from "../redux/slices/nodeGroupsSlice";
import {
  createNodeGroupSelector,
  nodeGroupEnter,
  nodeGroupTick,
  nodeGroupUpdate,
} from "./svgElements/svgNodeGroup";

class NodeSimulation {
  svgNodes: SimulatedNodeSelection;
  svgLinks: SimulatedLinkSelection;

  svgNodeGroups: SimulatedNodeGroupSelection;

  svgPathNodes: SimulatedPathNodeSelection;
  svgPathLinks: SimulatedPathLinkSelection;

  svgHighlight: SimulatedHighlightedNodeSelection;

  noNodesWarning: d3.Selection<SVGTextElement, any, any, any>;
  pathNotAllVisibleWarning: d3.Selection<SVGTextElement, any, any, any>;

  // Need this to be able to set visibility when hNode visible
  goToHighlightedNodeButton: d3.Selection<SVGGElement, any, any, any>;

  simulation: d3.Simulation<SimulatedItem, SimulatedLink>;

  constructor(
    contentSvg: d3.Selection<SVGSVGElement, any, any, any>,
    controlsSvg: d3.Selection<SVGSVGElement, any, any, any>,
    goToHighlightedNodeButton: d3.Selection<SVGGElement, any, any, any>
  ) {
    this.svgHighlight = createHighlightSelector(contentSvg);
    this.svgLinks = createLinkSelector(contentSvg);
    this.svgPathLinks = createPathLinkSelector(contentSvg);
    this.svgPathNodes = createPathNodeSelector(contentSvg);
    this.svgNodes = createNodeSelector(contentSvg);
    this.svgNodeGroups = createNodeGroupSelector(contentSvg);

    this.goToHighlightedNodeButton = goToHighlightedNodeButton;

    this.noNodesWarning = createNoNodesWarning(controlsSvg);
    this.pathNotAllVisibleWarning = createPathNotAllVisibleWarning(controlsSvg);

    this.simulation = d3
      .forceSimulation<SimulatedItem>()
      .force("charge", d3.forceManyBody().strength(-1800))
      .force(
        "link",
        d3
          .forceLink<SimulatedItem, SimulatedLink>()
          .id((d) => d.id)
          .distance(150)
      )
      .force("x", d3.forceX().x(0))
      .force("y", d3.forceY().y(0))
      .velocityDecay(0.6)
      .on("tick", this.ticked);
  }

  ticked = () => {
    nodeTick(this.svgNodes);
    highlightTick(this.svgHighlight);
    linkTick(this.svgLinks);
    pathNodeTick(this.svgPathNodes);
    pathLinkTick(this.svgPathLinks);
    nodeGroupTick(this.svgNodeGroups);
  };

  updateVisibleGraph = ({
    nodes: dataNodesToShow,
    links: dataLinksToShow,
    nodeGroups: dataNodeGroupsToShow,
    fadingNodes: dataFadingNodesToShow,
    fadingLinks: dataFadingLinksToShow,
    fadingNodeGroups: dataFadingNodeGroupsToShow,
  }: {
    nodes: ReduxNodeSelectedToView[];
    links: ReduxLink[];
    nodeGroups: NodeGroup[];
    fadingNodes: ReduxFadingNodeSelectedToView[];
    fadingLinks: ReduxLink[];
    fadingNodeGroups: NodeGroup[];
  }) => {
    // The this.simulation.nodes() data has:
    // - the old nodes dataNodes info, which we don't care about
    // - the old nodes simulation info, like velocity and position, which we wish to keep
    // The lines below retrieve that wanted simulation data, and write it into the incoming nodes
    // They also make deep copies of the incoming data so that it doesn't get modified elsewhere
    // cos d3 likes to mutate existing data >:(
    const oldNodesById = Object.fromEntries(
      this.simulation.nodes().map((d) => [d.id, d])
    );

    // The type is actually wrong.
    // It is not guaranteed that the nodes in the list will have simulation properties
    // aka x, y, vx, vy, index
    // But that will be true immediately after the first tick.
    const dataNodesToShowWithSimData: SimulatedNode[] = dataNodesToShow.map(
      (d) => ({
        ...oldNodesById[d.id],
        ...d,
        fading: false,
        itemType: "node",
      })
    );
    const dataFadingNodesToShowWithSimData: SimulatedFadingNode[] =
      dataFadingNodesToShow.map((d) => ({
        ...oldNodesById[d.id],
        ...d,
        fading: true,
        itemType: "fadingNode",
      }));
    const dataNodeGroupsToShowWithSimData: SimulatedNodeGroup[] =
      dataNodeGroupsToShow.map((d) => ({
        ...oldNodesById[d.id],
        ...d,
        fading: false,
        itemType: "nodeGroup",
      }));
    const dataFadingNodeGroupsToShowWithSimData: SimulatedNodeGroup[] =
      dataFadingNodeGroupsToShow.map((d) => ({
        ...oldNodesById[d.id],
        ...d,
        fading: true,
        itemType: "nodeGroup",
      }));

    const allNewNodes: SimulatedItem[] = [
      ...dataNodesToShowWithSimData,
      ...dataNodeGroupsToShowWithSimData,
      ...dataFadingNodesToShowWithSimData,
      ...dataFadingNodeGroupsToShowWithSimData,
    ];
    const allNewItemsById = Object.fromEntries(
      allNewNodes.map((d) => [d.id, d])
    );

    const dataLinksToShowWithSimData: SimulatedLink[] = dataLinksToShow.map(
      (d) => ({
        ...d,
        fading: false,
        source: allNewItemsById[d.source],
        target: allNewItemsById[d.target],
      })
    );
    const dataFadingLinksToShowWithSimData = dataFadingLinksToShow.map((d) => ({
      ...d,
      fading: true,
      source: allNewItemsById[d.source],
      target: allNewItemsById[d.target],
    }));
    const dataAllLinksToShow = [
      ...dataLinksToShowWithSimData,
      ...dataFadingLinksToShowWithSimData,
    ];

    this.svgNodes = this.svgNodes
      .data(dataNodesToShowWithSimData, (d) => d.id)
      .join(
        (enter) => nodeEnter(enter, this.drag()),
        (update) => nodeUpdate(update)
      );

    this.svgLinks = this.svgLinks
      .data(dataAllLinksToShow, (d) =>
        JSON.stringify([d.source.id, d.target.id])
      )
      .join(
        (enter) => linkEnter(enter),
        (update) => linkUpdate(update)
      );

    this.svgNodeGroups = this.svgNodeGroups
      .data(dataNodeGroupsToShowWithSimData, (d) => d.id)
      .join(
        (enter) => nodeGroupEnter(enter, this.dragNodeGroup()),
        (update) => nodeGroupUpdate(update)
      );

    this.simulation.nodes(allNewNodes);
    (
      this.simulation.force("link") as d3.ForceLink<
        SimulatedItem,
        SimulatedLink
      >
    ).links(dataAllLinksToShow);
    this.simulation.alpha(1).restart();

    this.noNodesWarning.style(
      "visibility",
      dataNodesToShow.length ? "hidden" : "visible"
    );
  };

  updateNodeInfo = (graphToView: {
    nodes: ReduxNodeSelectedToView[];
    nodeGroups: NodeGroupSelectedToView[];
  }) => {
    const fullGraphNodesById = Object.fromEntries(
      [...graphToView.nodes, ...graphToView.nodeGroups].map((d) => [d.id, d])
    );
    this.simulation.nodes().forEach((d) => {
      Object.assign(d, fullGraphNodesById[d.id]);
    });

    nodeUpdate(this.svgNodes);
    nodeGroupUpdate(this.svgNodeGroups);
  };

  updateHighlighted = (highlighted: string | null) => {
    const dataNodesToHighlight =
      highlighted === null
        ? []
        : this.simulation.nodes().filter((d) => d.id === highlighted);

    this.goToHighlightedNodeButton.style(
      "visibility",
      dataNodesToHighlight.length ? "visible" : "hidden"
    );

    this.svgHighlight = this.svgHighlight
      .data(dataNodesToHighlight, (d) => d.id)
      .join((enter) => highlightEnter(enter));

    this.ticked();
  };

  updatePath = (pathSteps: null | string[]) => {
    const simDataNodesById = Object.fromEntries(
      this.simulation.nodes().map((d) => [d.id, d])
    );

    // First deal with the nodes
    const relevantDataNodes =
      pathSteps === null ? [] : pathSteps.map((step) => simDataNodesById[step]);
    const dataNodesForSteps = relevantDataNodes.map((d, i) => ({
      i,
      dataNode: d,
      angle: calcStepAngle(i, relevantDataNodes.length),
    }));

    // Now deal with all the links between the steps
    const dataLinksForSteps = [];

    let someOfPathInvisible = false;
    for (let i = 0; i < dataNodesForSteps.length - 1; i += 1) {
      if (
        !dataNodesForSteps[i].dataNode ||
        !dataNodesForSteps[i + 1].dataNode
      ) {
        someOfPathInvisible = true;
        continue;
      }
      dataLinksForSteps.push({
        source: dataNodesForSteps[i].dataNode,
        target: dataNodesForSteps[i + 1].dataNode,
      });
    }

    this.pathNotAllVisibleWarning.style(
      "visibility",
      someOfPathInvisible ? "visible" : "hidden"
    );

    this.svgPathNodes = this.svgPathNodes
      .data(
        dataNodesForSteps.filter(
          (stepDataNode) =>
            stepDataNode.dataNode && !stepDataNode.dataNode.fading
        ),
        (d) => d.dataNode.id
      )
      .join(
        (enter) => pathNodeEnter(enter),
        (update) => pathNodeUpdate(update)
      );

    this.svgPathLinks = this.svgPathLinks
      .data(dataLinksForSteps, (d) =>
        JSON.stringify([d.source.id, d.target.id])
      )
      .join((enter) => pathLinkEnter(enter));

    this.ticked();
  };

  jigSimulation = () => {
    this.simulation.alpha(0.8).restart();
  };

  getSimulatedNodeById = (nodeId: string) =>
    this.simulation.nodes().find(({ id }) => id === nodeId);

  drag = () =>
    d3
      .drag<SVGGElement, SimulatedNode>()
      .on("start", (event) => {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      })
      .on("drag", (event) => {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) this.simulation.alphaTarget(0);

        if (d.pinSourceGroupId) {
          store.dispatch(
            fixNodeInPinGroup({
              pinGroupId: d.pinSourceGroupId,
              nodeId: d.id,
              fx: event.x,
              fy: event.y,
            })
          );
        } else {
          event.subject.fx = null;
          event.subject.fy = null;
        }
      });

  dragNodeGroup = () =>
    d3
      .drag<SVGGElement, SimulatedNodeGroup>()
      .on("start", (event) => {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      })
      .on("drag", (event) => {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) this.simulation.alphaTarget(0);

        event.subject.fx = null;
        event.subject.fy = null;
      });
}

export default NodeSimulation;
