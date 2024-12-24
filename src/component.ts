import { AbstractElement } from "@pesca-dev/atomicity";

export const Component = (tag: string) =>
  function <C extends AbstractElement>(clazz: { new (): C }) {
    customElements.define(tag, clazz);
    return clazz;
  };
