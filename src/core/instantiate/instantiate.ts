import { isFunction, isReactElementOutOfClass } from "../validation/validation";
import { setProps } from "../setProps";
import { useState } from "../hooks/useState";
import { useEffectFnArr } from "../hooks/useEffect";
import { setRef } from "../hooks/useRef";
import { REACT_FRAGMENT } from "../definitions";
import { Element } from "../Interfaces";
import { setAData } from "./setAData";

type makeInstanceT = { dom: Array<HTMLElement | undefined>; element: Element };

export const instantiate = (element: Element, container?: HTMLElement) => {
  const { dom } = makeInstance(element, container);

  dom.forEach((node: any) => {
    container?.appendChild(node);
  });

  useEffectFnArr.some((fn) => {
    fn();
  });

  useEffectFnArr.length = 0;
};

export const makeInstance = (
  element: Element,
  topNode?: HTMLElement,
  isContainsUseState?: boolean
): makeInstanceT => {
  const { type, props } = element;

  let compositeComponentCounter = 0;

  /* FRAGMENT */
  if (element["$$typeof"] === REACT_FRAGMENT) {
    if (props && props.children) {
      const fragmentArray: any = [];
      if (!Array.isArray(props.children)) {
        fragmentArray.push(document.createTextNode(props.children as string));
      } else {
        props.children.forEach((childrenElement: Element) => {
          const inst = makeInstance(childrenElement);

          fragmentArray.push(inst.dom[0]);
        });
      }

      return { dom: fragmentArray, element };
    }

    return { dom: [], element };
  }

  /* <div> */
  if (typeof type === "string") {
    topNode = topNode || document.createElement(type);

    setRef(topNode, element);

    setProps(topNode, element);

    if (isContainsUseState) {
      setAData(topNode, element, element.props.internaldata);

      useState.setRoot(topNode);
    }

    if (props && props.children) {
      /* only one item */
      if (!Array.isArray(props.children)) {
        topNode.appendChild(document.createTextNode(props.children.toString()));

        return { dom: [topNode], element };
      }

      /* Components */
      props.children.forEach((childrenElement: Element) => {
        if (childrenElement && typeof childrenElement === "object") {
          if (typeof childrenElement.type === "function") {
            compositeComponentCounter++;
            // console.log(83, topNode, element.type);

            if (childrenElement._owner) {
              // setAData(topNode, element, element.type);

              childrenElement._owner.index = compositeComponentCounter;
            } else {
              childrenElement._owner = { index: compositeComponentCounter };
            }
            // console.log(topNode, childrenElement);
          }

          const inst = makeInstance(childrenElement, undefined, false);

          inst.dom.forEach((elementToAppend: any) => {
            if (elementToAppend) {
              topNode?.appendChild(elementToAppend);
            }
          });

          return;
        }

        /* string | number */
        topNode?.appendChild(
          document.createTextNode(childrenElement as string)
        );
      });
    }

    return { dom: [topNode], element };
  }

  /* class */
  if (type && isReactElementOutOfClass(type)) {
    if (props.children && props.children.length === 1) {
      props.children = props.children[0];
    }

    const classComponent = new type(props);
    const element = classComponent.render();

    element.props.internaldata = classComponent;
    element.props.internaldataargs = props;

    const inst = makeInstance(element, topNode);

    return inst;
  }

  /* () => {} */
  if (type && isFunction(type)) {
    if (props.children && props.children.length === 1) {
      props.children = props.children[0];
    }

    const temp = { ...useState.getCurrentPublicDom() };
    // console.log(temp);
    useState.clearCurrentPublicDom();

    const beforeOID = useState.ownerIndefication;
    const element = type(props);
    const afterOID = useState.ownerIndefication;

    const isUseSateTrigered = beforeOID !== afterOID;

    element.props.internaldata = type;
    element.props.internaldataargs = props;

    const inst = makeInstance(element, undefined, isUseSateTrigered);

    // console.log(temp, useState.getCurrentPublicDom());

    // if (useState.setRootPublicDom) {
    // console.log("setRootPublicDom", temp);

    // useState.setRootPublicDom(temp.dom);
    // }

    return inst;
  }

  return { dom: [topNode], element };
};
