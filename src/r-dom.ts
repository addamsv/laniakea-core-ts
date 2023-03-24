import { instantiate } from "./core/instantiate/instantiate";

export const ReactDOM = {
  /* react@^18.0.0 */
  createRoot: (container: HTMLElement) => {
    return {
      render: (element: any) => {
        ReactDOM.render(element, container);
      },

      unmount: () => true,
    };
  },

  render: (element: any, container: HTMLElement | null) => {
    if (!container) return;

    if (container.children.length !== 0) {
      container.innerHTML = "";
    }

    /* Element has JSX.Element type */
    instantiate(element, container);
  },
};
