type ElementRenderFunctionT = (...args: any[]) => any;

import { Element } from "../Interfaces";

export const setAData = (
  dom: HTMLElement | undefined,
  element: Element,
  elementRenderFunction: ElementRenderFunctionT
) => {
  if (typeof dom === undefined) {
    return;
  }

  Object.defineProperty(dom, "__aData", {
    enumerable: false,
    configurable: false,
    writable: true,
    value: {
      dom,
      element,
      elementRenderFunction,
      elementRenderFunctionArgs: element.props.internaldataargs,
    },
  });
};

// value.internalInstance = {
//   dom: dom,
//   element,
//   elementRenderFunction: value,
//   elementRenderFunctionArgs: element.props.internaldataargs,
// };

// element.props.internaldatadom = dom;
