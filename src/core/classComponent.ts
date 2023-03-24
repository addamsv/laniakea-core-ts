import { Element, IComponent } from "./Interfaces";
import { reconcileInstance } from "./reconcile/reconcile";

export class ElementClass {
  public context: any;

  public forceUpdate: any;

  public refs: any;

  public internalInstance: any;
}

export class Component<P = {}> extends ElementClass implements IComponent {
  public state: any = {};

  public props: P;

  constructor(props: P) {
    super();
    this.props = props;
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    return { prevProps, prevState };
  }

  // componentDidCatch?: () => {};

  setState(partialState: any) {
    if (typeof partialState === "function") {
      this.state = Object.assign({}, this.state, partialState(this.state));
    } else {
      this.state = Object.assign({}, this.state, partialState);
    }
    // try {
    reconcileInstance(
      this.render(),
      this.internalInstance.dom,
      this.internalInstance.element
    );
    // } catch {
    //   console.log("aha");
    // }
  }

  render() {}
}
