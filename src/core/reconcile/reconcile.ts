import { useState } from "../..";
import { REACT_COMPONENT, REACT_ELEMENT } from "../definitions";
import { setRef } from "../hooks/useRef";
import { makeInstance } from "../instantiate/instantiate";
import { setAData } from "../instantiate/setAData";
// import { Element } from "../Interfaces";
import { setProps } from "../setProps";
import { isDeepEqual, isStringOrNumber } from "../validation/validation";
import { onlyString } from "./onlyString";

/**
 *  Create instance
 *  Remove instance
 *  Replace instance
 *  Update instance
 *  Update composite instance
 */

const reconcileChild = (
  currRE: Array<any | string> | string,
  root: any,
  prevRE?: any
) => {
  if (!root) return;

  /* ONLY_STRING */
  if (!currRE || isStringOrNumber(currRE)) {
    const currValue = currRE || "";
    const prevValue = prevRE || "";
    const isUpdated = onlyString(currValue, prevValue, root);
    // if (isUpdated) {
    //   console.log(`STRING
    //       [${typeof currRE}] ${prevRE} -> ${currRE}`);
    // }
    return;
  }

  if (typeof currRE === "string") return;

  let shiftIndxOfRemEl = 0;

  currRE.some((childRE: any, indx: number) => {
    /**
     * - - - - - - S T R I N G S or number inside (down of tree) - - - - - -
     */
    if (typeof childRE !== "object") {
      if (childRE !== prevRE[indx]) {
        // console.log(`INNER_STRING_${indx}
        //   [${typeof childRE}] ${
        //   prevRE[indx]
        // } -> ${childRE}`);

        root.childNodes[indx - shiftIndxOfRemEl].nodeValue = childRE.toString();
      }

      return;
    }

    /**
     * - - - - - - D I V|I M G - - - - - -
     */
    if (childRE.$$typeof === REACT_ELEMENT) {
      const isPropsEqual = isDeepEqual(childRE, prevRE[indx]);

      if (!isPropsEqual) {
        // console.log(
        //   `ELEMENT_${indx - shiftIndxOfRemEl}
        //   <${childRE.type} />`
        // );
        const currRoot = root.childNodes[indx - shiftIndxOfRemEl];

        reconcileChild(
          childRE.props.children,
          currRoot,
          prevRE[indx].props.children
        );

        setRef(currRoot, childRE);

        setProps(currRoot, childRE, prevRE[indx]);
      }

      return;
    }

    /**
     *  - - - - - - C L A S S E S  &  F U N C T T I O N S - - - - - -
     */
    if (childRE.$$typeof === REACT_COMPONENT) {
      if (childRE.type !== prevRE[indx].type) {
        // console.log(
        //   `CHANGE_COMPONENT_${indx}
        //   from:    <${prevRE[indx].type.name} />
        //   to:      <${childRE.type.name} />`
        // );

        const { dom: domNodes } = makeInstance(childRE);
        const [rootNode] = domNodes;

        root.children[0].remove();
        root.appendChild(rootNode);

        setAData(rootNode, childRE, childRE.type);

        useState.didUnmounted();

        return;
      }

      const isPropsEqual = isDeepEqual(childRE.props, prevRE[indx].props);

      if (isPropsEqual) {
        return;
      }

      const newElement = childRE.type(childRE.props);
      const prevElement = prevRE[indx].type(prevRE[indx].props);

      if (!newElement && !prevElement) {
        // console.log(`SKIP_COMPONENT_${indx}`);
        shiftIndxOfRemEl++;
        return;
      }

      if (newElement && !prevElement) {
        // console.log(`MAKE_COMPONENT_${indx - shiftIndxOfRemEl}
        //   <${childRE.type.name} ${JSON.stringify(
        //   childRE.props
        // )} />`);

        const domik = { ...useState.getCurrentPublicDom() };
        useState.didUnmounted();
        useState.willRemounted(domik.dom);

        const { dom: domNodes } = makeInstance(newElement);
        const [rootNode] = domNodes;

        root.insertBefore(rootNode, root.childNodes[indx - shiftIndxOfRemEl]);

        domik.currStateFn.innerPublicDom = domik.dom;

        setAData(
          root.childNodes[indx - shiftIndxOfRemEl],
          newElement,
          newElement.type
        );

        Object.assign(domik.dom.__aData.element, newElement);

        return;
      }

      if (!newElement && prevElement) {
        // console.log(`REMOVE_COMPONENT_${indx - shiftIndxOfRemEl}
        //   <${childRE.type.name} ${JSON.stringify(
        //   childRE.props
        // )} />`);

        root.childNodes[indx - shiftIndxOfRemEl].remove();

        shiftIndxOfRemEl++;

        return;
      }

      if (newElement && prevElement) {
        const isPropsEqual = isDeepEqual(newElement, prevElement);

        if (!isPropsEqual) {
          // console.log(`COMPONENT_${indx - shiftIndxOfRemEl}
          // <${childRE.type.name} ${JSON.stringify(
          //   childRE.props
          // )} />`);

          reconcileChild(
            newElement.props.children,
            root.childNodes[indx - shiftIndxOfRemEl],
            root.childNodes[indx - shiftIndxOfRemEl].__aData.element.props
              .children
          );

          setAData(
            root.childNodes[indx - shiftIndxOfRemEl],
            newElement,
            newElement.type
          );
          // Object.assign(
          //   root.childNodes[indx - shiftIndxOfRemEl].__aData.element,
          //   newElement
          // );
        }
      }
    }
  });
};

export const reconcileInstance = (currRE: any, root: any, prevRE: any) => {
  if (!currRE && prevRE && root) {
    root.remove();
    return;
  }

  if (!root) {
    return;
  }

  const isPropsEqual = isDeepEqual(currRE.props, prevRE.props);

  if (!isPropsEqual) {
    reconcileChild(currRE.props.children, root, prevRE.props.children);
    setRef(root, currRE);
    setProps(root, currRE, prevRE);
  }

  /* for composite instance */
  if (root && root.__aData && root.__aData.element) {
    // console.log("ASSIGN_A_DATA");

    Object.assign(root.__aData.element, currRE);
  }
};

export const reconsile = (reconcileElement: any) => {
  const {
    elementRenderFunction: render,
    elementRenderFunctionArgs: args = undefined,
    dom: root,
    element: prevRE,
  } = reconcileElement;

  const currRE = render(args);

  reconcileInstance(currRE, root, prevRE);
};
