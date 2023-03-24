export const validateChild = (child: any) =>
  child.flat().filter((container: any) => {
    if (
      container &&
      typeof container !== "string" &&
      typeof container !== "number"
    ) {
      // console.log(container);
      /* if Object or Array */
      // Object.entries(container).forEach(([key, value]: [string, any]) => {
      //   if (!isEntriesValid(key, value)) {
      //     console.log(key);

      //     delete container[key];
      //   }
      // });

      if (Object.getOwnPropertyNames(container).length === 0) {
        return false;
      }
    }

    if (typeof container === "number") {
      return container.toString();
    }

    return container || false;
  });

export const getChildren = (validChild: any) => {
  /**
   *  Child Can be Any of types:
   * string,
   * number,
   * Array,
   * boolean,
   * null,
   * undefined,
   * NaN,
   * Function,
   * React.ReactNode
   */
  // const validChild = validateChild(child);
  // if (validChild.length === 0) {
  //   return null;
  // }

  if (validChild.length === 1) {
    const [child] = validChild;

    if (typeof child === "string") {
      return child;
    }

    if (typeof child === "number") {
      return child.toString();
    }

    /* see instantiate */
    // if (isFunction(child)) {
    //   return child;
    // }
  }
  /* see getInstance */
  return validChild;
};

// const isEntriesValid = (key: string, value: any) => {
//   return ["$$typeof", "type", "props", "ref", "key", "_owner"].some(
//     (currKey: string) => currKey === key
//   );
// };
