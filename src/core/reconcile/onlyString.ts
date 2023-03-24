export const onlyString = (curr: any, prev: any, root: any) => {
  if (curr !== prev) {
    root.innerText = curr;
    return true;
  }
};
