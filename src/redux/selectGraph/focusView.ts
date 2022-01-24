import { ReduxLink } from "../slices/fullGraphSlice";
import {
  getLinksWithinNodeSet,
  getNodesLinksDirectlyConnectedToNodeSet,
} from "./networkOperations";

const focusViewGetSubgraph = (
  fullGraphLinks: ReduxLink[],
  focusNodeId: string,
  viewDistance = 1
) => {
  const nodeIdsToView = [focusNodeId];
  let nodesAddedLastIteration = new Set([focusNodeId]);
  const linksToView = [];
  let remainingLinks = fullGraphLinks;

  for (let iteration = 0; iteration < viewDistance; iteration += 1) {
    let directlyConnectedNodes;
    let directlyConnectedLinks;
    let betweenDirectlyConnectedLinks;

    [directlyConnectedNodes, directlyConnectedLinks, remainingLinks] =
      getNodesLinksDirectlyConnectedToNodeSet(
        nodesAddedLastIteration,
        remainingLinks
      );

    [betweenDirectlyConnectedLinks, remainingLinks] = getLinksWithinNodeSet(
      directlyConnectedNodes,
      remainingLinks
    );

    nodeIdsToView.push(...directlyConnectedNodes);
    linksToView.push(
      ...directlyConnectedLinks,
      ...betweenDirectlyConnectedLinks
    );

    nodesAddedLastIteration = directlyConnectedNodes;
  }

  const [fadingNodeIdsSet, fadingLinks] =
    getNodesLinksDirectlyConnectedToNodeSet(
      nodesAddedLastIteration,
      remainingLinks
    );

  return {
    nodeIds: nodeIdsToView,
    links: linksToView,
    fadingNodeIds: Array.from(fadingNodeIdsSet),
    fadingLinks,
  };
};

export default focusViewGetSubgraph;
