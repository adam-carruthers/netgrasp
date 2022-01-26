import store from "../redux/reduxStore";
import {
  selectGraphToView,
  selectHighlightedNodeId,
  FullGraphSelectedToView,
  selectSelectedPathNodeIdStepsToView,
} from "../redux/selectGraph/reselectView";
import { ReduxLink } from "../redux/slices/fullGraphSlice";
import type NodeSimulation from "./nodeSimulation";

const isNodeRefreshNeeded = (
  oldNodes: { id: string }[],
  newNodes: { id: string }[]
) =>
  oldNodes.length !== newNodes.length ||
  oldNodes.some(({ id }, i) => id !== newNodes[i].id);

const isLinkRefreshNeeded = (oldLinks: ReduxLink[], newLinks: ReduxLink[]) =>
  oldLinks.length !== newLinks.length ||
  oldLinks.some(
    ({ source, target }, i) =>
      source !== newLinks[i].source || target !== newLinks[i].target
  );

const reduxSubscribe = (simulation: NodeSimulation) => {
  // Section 1 - Track redux store changes to only refresh on necessary updates
  let currentViewGraph: FullGraphSelectedToView;
  let currentHighlightedNodeId: string | null;
  let currentSelectedPathNodeIdSteps: string[] | null;

  function handleStoreEvent() {
    const previousViewGraph = currentViewGraph;
    const previousHighlightedNodeId = currentHighlightedNodeId;
    const previousSelectedPathNodeIdSteps = currentSelectedPathNodeIdSteps;

    const state = store.getState();

    currentViewGraph = selectGraphToView(state);
    currentHighlightedNodeId = selectHighlightedNodeId(state);
    currentSelectedPathNodeIdSteps = selectSelectedPathNodeIdStepsToView(state);

    // if (previousGraphToView !== undefined) {
    //   console.log(
    //     previousGraphToView === undefined,
    //     previousGraphToView.nodes.length !== currentGraphToView.nodes.length,
    //     previousGraphToView.fadingNodes.length
    //     !== currentGraphToView.fadingNodes.length,
    //     previousGraphToView.links.length !== currentGraphToView.links.length,
    //     previousGraphToView.fadingLinks.length !== currentGraphToView.fadingLinks.length,
    //     previousGraphToView.nodes.some(
    //       (node, i) => node.id !== currentGraphToView.nodes[i].id,
    //     ),
    //     previousGraphToView.nodes.some(
    //       (node, i) => node.id !== currentGraphToView.nodes[i].id,
    //     ),
    //     previousGraphToView.links.some(
    //       (link, i) => link.source !== currentGraphToView.links[i].source
    //       || link.target !== currentGraphToView.links[i].target,
    //     ),
    //     previousGraphToView.fadingLinks.some(
    //       (link, i) => (link.source !== currentGraphToView.fadingLinks[i].source)
    //       || link.target !== currentGraphToView.fadingLinks[i].target,
    //     ),
    //   );
    // }

    if (
      // Triggers that change the nodes or links present on the svg
      // This will need to cause a full rerender and a change of the simulation, etc
      previousViewGraph === undefined ||
      isNodeRefreshNeeded(previousViewGraph.nodes, currentViewGraph.nodes) ||
      isNodeRefreshNeeded(
        previousViewGraph.fadingNodes,
        currentViewGraph.fadingNodes
      ) ||
      isNodeRefreshNeeded(
        previousViewGraph.nodeGroups,
        currentViewGraph.nodeGroups
      ) ||
      isNodeRefreshNeeded(
        previousViewGraph.fadingNodeGroups,
        currentViewGraph.fadingNodeGroups
      ) ||
      isLinkRefreshNeeded(previousViewGraph.links, currentViewGraph.links) ||
      isLinkRefreshNeeded(
        previousViewGraph.fadingLinks,
        currentViewGraph.fadingLinks
      )
    ) {
      simulation.updateVisibleGraph(currentViewGraph);
      // If the visible graph is updated
      // Highlighted and path need to be changed as well
      // To bind their SVG elements to the new simulation
      simulation.updateHighlighted(currentHighlightedNodeId);
      simulation.updatePath(currentSelectedPathNodeIdSteps);
    } else {
      if (previousViewGraph !== currentViewGraph) {
        simulation.updateNodeInfo(currentViewGraph);
      }
      if (previousHighlightedNodeId !== currentHighlightedNodeId) {
        simulation.updateHighlighted(currentHighlightedNodeId);
      }
      if (previousSelectedPathNodeIdSteps !== currentSelectedPathNodeIdSteps) {
        simulation.updatePath(currentSelectedPathNodeIdSteps);
      }
      if (
        previousViewGraph.nodes.some(
          (node, i) =>
            node.fx !== currentViewGraph.nodes[i].fx ||
            node.fy !== currentViewGraph.nodes[i].fy
        ) ||
        previousViewGraph.fadingNodes.some(
          (node, i) =>
            node.fx !== currentViewGraph.nodes[i].fx ||
            node.fy !== currentViewGraph.nodes[i].fy
        )
      ) {
        simulation.jigSimulation();
      }
    }
  }

  // Section 3 - Actually subscribe, and run the update once!
  store.subscribe(handleStoreEvent);
  handleStoreEvent();
};

export default reduxSubscribe;
