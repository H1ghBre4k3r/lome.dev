import { a, AbstractElement } from "@pesca-dev/atomicity";
import "./code-showcase.css";
import { Component } from "./component";
// Use modular imports to reduce bundle size
import hljs from "highlight.js/lib/core";
import rust from "highlight.js/lib/languages/rust";
import typescript from "highlight.js/lib/languages/typescript";

// Register only the languages we need
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript); // Alias for typescript

const SNIPPETS = [
  { lang: "rust", code: `fn main() {\n    println!("Hello from Y-Lang compiler backend!" );\n}` },
  { lang: "ts", code: `@Injectable()\nclass Service {\n  constructor(private dep: Dep) {}\n}` },
  { lang: "rust", code: `#[derive(Lexer)]\nenum Token {\n  #[terminal(r"[a-zA-Z_][a-zA-Z0-9_]*")] Ident,\n}` },
];

@Component("code-showcase")
export class CodeShowcase extends AbstractElement {
  private idx = 0;
  private codeEl: HTMLElement | null = null;
  private titleEl: HTMLElement | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.rotate();
    setInterval(() => this.rotate(), 4000);
  }

  rotate() {
    if (!this.codeEl) return;
    const snip = SNIPPETS[this.idx % SNIPPETS.length];
    const { value } = hljs.highlight(snip.code, { language: snip.lang });
    this.codeEl.innerHTML = value;
    if (this.titleEl) this.titleEl.textContent = snip.lang.toUpperCase();
    this.idx++;
  }

  render() {
    const el = (
      <section className="code-showcase">
        <div className="code-card">
          <div className="code-card-header">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
            <span className="code-title"></span>
          </div>
          <pre><code className="hljs"></code></pre>
        </div>
      </section>
    );

    this.codeEl = el.querySelector("code.hljs");
    this.titleEl = el.querySelector(".code-title");

    return el;
  }
}
