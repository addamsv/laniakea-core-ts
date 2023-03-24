import { reconsile } from "../reconcile/reconcile";
import { isArray, isFunction, isObject } from "../validation/validation";

/* current */
const currentPublicDom = {
  dom: null as any,
  didUnmounted: false,
  willRemounted: false,
  renderFn: null as any,
  currStateFn: null as any,
};
interface Rt extends HTMLElement {
  __aData: any;
  aStateData: any;
}

export const useState = (initialState?: any) => {
  let root = null as Rt | null;

  const setRoot = (el: Rt) => (root = el);

  const stateValue = () => {
    const { dom } = currentPublicDom;

    return !dom || dom.aStateData === "undefined"
      ? initialState
      : dom.aStateData;
  };

  const setState = (newState?: any): any => {
    if (!root && setState.innerPublicDom) {
      root = setState.innerPublicDom;
    }
    if (!root) {
      return;
    }

    const prevState = root.aStateData;

    const newStateValue = isFunction(newState)
      ? newState(prevState || initialState)
      : newState;

    currentPublicDom.dom = root;

    /* Set New State Data */
    if (prevState === undefined) {
      Object.defineProperty(root, "aStateData", {
        enumerable: false,
        configurable: false,
        writable: true,
        value: newStateValue,
      });
    }

    if (
      typeof prevState === "object" &&
      typeof newStateValue === "object" &&
      !isArray(prevState)
    ) {
      root.aStateData = Object.assign({}, prevState, newStateValue);
    }

    if (
      typeof prevState === "string" ||
      typeof prevState === "number" ||
      typeof prevState === "boolean" ||
      isArray(prevState)
    ) {
      root.aStateData = newStateValue;
    }

    /* Start Reconciliation Algorithm */

    if (prevState !== newStateValue) {
      // const temp = { ...currentPublicDom };
      // const temp2 = { ...root };

      reconsile(root.__aData);

      if (!currentPublicDom.didUnmounted) {
        try {
          useState.setRoot(root);
          if (!currentPublicDom.dom) {
            currentPublicDom.dom = root;
          }
        } catch (error) {}
      }

      if (currentPublicDom.willRemounted) {
        currentPublicDom.willRemounted = false;
        currentPublicDom.dom = root;
        // useState.setRoot(root);
      }
      // currentPublicDom.dom = temp.dom;
      // useState.setRoot(temp.dom);
      // console.log(temp.dom, root);
      currentPublicDom.didUnmounted = false;
    }
  };

  setState.innerPublicDom = root;
  useState.setRoot = setRoot;
  useState.ownerIndefication++;
  currentPublicDom.currStateFn = setState;
  // console.log(setState.innerPublicDom);

  return [stateValue(), setState];
};

useState.setRoot = null as any;

// useState.clearSetRootPublicDomFn = () => {
//   useState.setRoot = null;
// };

useState.didUnmounted = () => {
  currentPublicDom.didUnmounted = true;
  // return currentPublicDom.dom;
};

useState.willRemounted = (el: HTMLElement) => {
  // useState.setRoot = null;
  currentPublicDom.willRemounted = true;
  // currentPublicDom.dom = el;
};

useState.getCurrentPublicDom = () => currentPublicDom;

useState.clearCurrentPublicDom = () => {
  // useState.setRoot(null);
  // useState.setRoot = null;
  currentPublicDom.dom = null;
};

useState.ownerIndefication = 0;
