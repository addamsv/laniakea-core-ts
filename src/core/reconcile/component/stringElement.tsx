export const stringElement = (curr: any, prev: any, root: any) => {
  if (curr !== prev) {
    root.nodeValue = curr.toString();
    return true;
  }
};
