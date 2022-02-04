import type { ReduxLink } from "../slices/fullGraphSlice";

export const getNodesLinksDirectlyConnectedToNodeSet = (
  nodeIdSet: Set<string>,
  remainingLinks: ReduxLink[]
) => {
  const directlyConnectedNodes: Set<string> = new Set();
  const directlyConnectedLinks: ReduxLink[] = [];
  const remainingLinksAfter: ReduxLink[] = [];

  remainingLinks.forEach((link) => {
    let nodeToInclude;

    if (nodeIdSet.has(link.source)) {
      nodeToInclude = link.target;
    } else if (nodeIdSet.has(link.target)) {
      nodeToInclude = link.source;
    } else {
      remainingLinksAfter.push(link);
      return;
    }

    directlyConnectedNodes.add(nodeToInclude);
    directlyConnectedLinks.push(link);
  });

  return {
    directlyConnectedNodes,
    directlyConnectedLinks,
    remainingLinksAfter,
  };
};

export const getLinksWithinNodeSet = (
  nodeIdSet: Set<string>,
  remainingLinks: ReduxLink[]
) => {
  const linksWithin: ReduxLink[] = [];
  const remainingLinksAfter: ReduxLink[] = [];

  remainingLinks.forEach((link) => {
    if (nodeIdSet.has(link.source) && nodeIdSet.has(link.target)) {
      linksWithin.push(link);
    } else {
      remainingLinksAfter.push(link);
    }
  });

  return { linksWithin, remainingLinksAfter };
};
