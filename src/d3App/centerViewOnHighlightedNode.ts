import { NotificationManager } from "react-notifications";
import NodeSimulation from "./nodeSimulation";
import PositionManager from "./positionManager";

const centerViewOnHighlightedNode = (
  simulation: NodeSimulation,
  positionManager: PositionManager
) => {
  const highlightedNode = simulation.svgHighlight.data()[0];

  if (highlightedNode) {
    positionManager.setViewCoords(highlightedNode.x, highlightedNode.y);
  } else {
    NotificationManager.warning(
      "The node could not be found in the view",
      "Could not center view on highlighted node"
    );
  }
};

export default centerViewOnHighlightedNode;
