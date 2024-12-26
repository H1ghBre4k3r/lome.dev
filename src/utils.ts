/**
 * Function to create an SVG element from a given source code.
 */
export function svg(content: string): SVGSVGElement {
  const elem = document.createElement("div");
  elem.innerHTML = content;

  return elem.firstElementChild as SVGSVGElement;
}
