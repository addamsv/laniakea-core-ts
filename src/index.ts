import { Component } from "./core/classComponent";
import { useEffect } from "./core/hooks/useEffect";
import { useRef } from "./core/hooks/useRef";
import { useState } from "./core/hooks/useState";
import { Element } from "./core/Interfaces";
import {
  REACT_COMPONENT,
  REACT_ELEMENT,
  REACT_FRAGMENT,
  _owner,
} from "./core/definitions";
import { isFunctionNative } from "./core/validation/validation";
import { getChildren, validateChild } from "./core/getChildren";

const React = {
  Component,

  ReactNode: "", // 👈️ children type

  createElement: (
    type?: any,
    properties?: any,
    ...child: any
  ): Element | null => {
    if (isFunctionNative(type)) {
      return null;
    }

    const { key = null, ref = null, ...props } = properties || {};

    const childs = validateChild(child);

    if (child.length && childs.length) {
      props.children = getChildren(childs);
    }

    let elTypeof: symbol;

    if (type) {
      elTypeof = typeof type === "function" ? REACT_COMPONENT : REACT_ELEMENT;
    } else {
      elTypeof = REACT_FRAGMENT;
    }

    return {
      $$typeof: elTypeof,
      key,
      ref,
      _owner: null,
      type,
      props,
    };
  },
};

export { Component, useState, useRef, useEffect };
export default React;
