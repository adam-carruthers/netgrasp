import { createContext } from "react";
import { SimulatedItem } from "../../d3App/common";

const D3FunctionsContext = createContext<{
  centerViewOnHighlighted: () => any;
  getSimulatedNodeById: (nodeId: string) => SimulatedItem | undefined;
}>({
  centerViewOnHighlighted: () => null,
  getSimulatedNodeById: () => undefined,
});

export default D3FunctionsContext;
