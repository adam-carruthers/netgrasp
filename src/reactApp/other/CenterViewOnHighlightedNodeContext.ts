import { createContext } from "react";

const CenterViewOnHighlightedNodeContext = createContext<() => any>(() => null);

export default CenterViewOnHighlightedNodeContext;
