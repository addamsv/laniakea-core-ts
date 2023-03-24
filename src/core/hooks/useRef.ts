import { Element } from "../Interfaces";
type UseRefT = { current: any };

const refObjArr: UseRefT[] = [];

export const setRef = (root: any, obj: Element) => {
  if (obj && obj.ref) {
    setRootPublicDom(root, obj.ref);
  }
};

export const setRootPublicDom = (el: any, obj: UseRefT) => {
  refObjArr.some((currObj: UseRefT) => {
    if (currObj === obj) {
      obj.current = el;
      return true;
    }
  });
};

export const useRef = <T>(initValue: T | null) => {
  const innerObj = { current: initValue as T };

  refObjArr.push(innerObj);

  return innerObj;
};
