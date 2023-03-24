/** ⬇️ 🌼 Real React Component 🌼 ⬇️ **/
// export interface Element {
//   $$typeof: symbol; // 'react.element' | 'react.component'
//   key: string | null;
//   ref:
//     | {
//         current: any; // HTMLElement | undefined;
//       }
//     | undefined
//     | null;
//   _owner: {
//     flag?: number;
//     index?: number;
//     sibling?: string;
//   } | null;
//   type: string | symbol | any; // | Component
//   props: any;
// }
import { Component } from "./classComponent";

type ElementRenderFunctionT = (...args: any[]) => Element;

/** ⬇️ 🌼 Real React Component 🌼 ⬇️ **/
export interface Element {
  $$typeof: symbol; // 'react.element' | 'react.component'
  key: number | string | null;
  ref:
    | {
        current: any; // HTMLElement | undefined;
      }
    | undefined
    | null;
  _owner: {
    flag?: number;
    index?: number;
    sibling?: string;
  } | null;
  type: string | any; // ElementRenderFunctionT | Component |
  props: any;
}

export interface IComponent {
  render: () => any;

  componentWillUnmount?: () => any;

  componentDidMount?: () => any;

  componentDidCatch?: () => any;
}

export type ReactNode = string | number | boolean | null | undefined | any; // | ReactElement | ReactFragment | ReactPortal;
