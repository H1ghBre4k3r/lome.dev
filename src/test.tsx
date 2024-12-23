import {
  AbstractElement,
  ObservedAttributes,
  Transformers,
  a,
} from "@pesca-dev/atomicity";

type Attributes = {
  name: string;
};
const transformers: Transformers<Attributes> = {
  name: [(arg) => arg, ""],
};

export class Test extends AbstractElement<Attributes> {
  constructor() {
    super(transformers);
  }

  public static get observedAttributes(): ObservedAttributes<Attributes> {
    return ["name"];
  }

  render() {
    return <div>Hello, {this.attrs.name}</div>;
  }
}

customElements.define("my-test", Test);
