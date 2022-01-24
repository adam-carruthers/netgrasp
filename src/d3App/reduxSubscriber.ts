import store from "../redux/reduxStore";
import {
  selectGraphToView,
  selectHighlightedNodeId,
  FullGraphSelectedToView,
  selectSelectedPathNodeIdStepsToView,
} from "../redux/selectGraph/reselectView";
import type NodeSimulation from "./nodeSimulation";

const reduxSubscribe = (simulation: NodeSimulation) => {
  // Section 1 - Track redux store changes to only refresh on necessary updates
  let currentGraphToView: FullGraphSelectedToView;
  let currentHighlightedNodeId: string | null;
  let currentSelectedPathNodeIdSteps: string[] | null;

  function handleStoreEvent() {
    const previousGraphToView = currentGraphToView;
    const previousHighlightedNodeId = currentHighlightedNodeId;
    const previousSelectedPathNodeIdSteps = currentSelectedPathNodeIdSteps;

    const state = store.getState();

    currentGraphToView = selectGraphToView(state);
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
      previousGraphToView === undefined ||
      previousGraphToView.nodes.length !== currentGraphToView.nodes.length ||
      previousGraphToView.fadingNodes.length !==
        currentGraphToView.fadingNodes.length ||
      previousGraphToView.links.length !== currentGraphToView.links.length ||
      previousGraphToView.fadingLinks.length !==
        currentGraphToView.fadingLinks.length ||
      previousGraphToView.nodes.some(
        (node, i) => node.id !== currentGraphToView.nodes[i].id
      ) ||
      previousGraphToView.nodes.some(
        (node, i) => node.id !== currentGraphToView.nodes[i].id
      ) ||
      previousGraphToView.links.some(
        (link, i) =>
          link.source !== currentGraphToView.links[i].source ||
          link.target !== currentGraphToView.links[i].target
      ) ||
      previousGraphToView.fadingLinks.some(
        (link, i) =>
          link.source !== currentGraphToView.fadingLinks[i].source ||
          link.target !== currentGraphToView.fadingLinks[i].target
      )
    ) {
      simulation.updateVisibleGraph(currentGraphToView);
      // If the visible graph is updated
      // Highlighted and path need to be changed as well
      // To bind their SVG elements to the new simulation
      simulation.updateHighlighted(currentHighlightedNodeId);
      simulation.updatePath(currentSelectedPathNodeIdSteps);
    } else {
      if (previousGraphToView !== currentGraphToView) {
        simulation.updateNodeInfo(currentGraphToView);
      }
      if (previousHighlightedNodeId !== currentHighlightedNodeId) {
        simulation.updateHighlighted(currentHighlightedNodeId);
      }
      if (previousSelectedPathNodeIdSteps !== currentSelectedPathNodeIdSteps) {
        simulation.updatePath(currentSelectedPathNodeIdSteps);
      }
      if (
        previousGraphToView.nodes.some(
          (node, i) =>
            node.fx !== currentGraphToView.nodes[i].fx ||
            node.fy !== currentGraphToView.nodes[i].fy
        ) ||
        previousGraphToView.fadingNodes.some(
          (node, i) =>
            node.fx !== currentGraphToView.nodes[i].fx ||
            node.fy !== currentGraphToView.nodes[i].fy
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
