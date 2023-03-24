import { isDeepEqual } from "../../validation/validation";
import { reconcileInstance } from "../reconcile";

/** - - - - - - D I V|I M G - - - - - -*/
export const simpleElement = (curr: any, prev: any, root: any) => {
  const isPropsEqual = isDeepEqual(curr.props, prev.props);

  if (!isPropsEqual) {
    reconcileInstance(curr, root, prev);
    return true;
  }
};
