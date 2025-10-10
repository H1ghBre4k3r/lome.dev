import { a, AbstractElement } from "@pesca-dev/atomicity";
import "./terminal-typing.css";
import { Component } from "./component";

interface TypingLine {
  text: string;
  delay?: number;
  className?: string;
}

@Component("terminal-typing")
export class TerminalTyping extends AbstractElement {
  private lines: TypingLine[] = [];
  private terminalBody: HTMLElement | null = null;
  private isTyping: boolean = false;

  constructor() {
    super();
  }

  setLines(lines: TypingLine[]) {
    this.lines = lines;
    if (this.terminalBody && !this.isTyping) {
      this.startTyping();
    }
  }

  async startTyping() {
    if (this.isTyping || !this.terminalBody) return;

    this.isTyping = true;
    this.terminalBody.innerHTML = '';

    for (let i = 0; i < this.lines.length; i++) {
      await this.typeLine(this.lines[i]);

      // Add delay before next line if specified
      if (this.lines[i].delay) {
        await this.sleep(this.lines[i].delay!);
      }
    }

    this.isTyping = false;
  }

  async typeLine(line: TypingLine) {
    if (!this.terminalBody) return;

    const lineElement = (
      <div className={`terminal-line ${line.className || ''}`}>
        <span className="terminal-prompt">&gt; </span>
        <span className="terminal-text"></span>
        <span className="terminal-cursor">▊</span>
      </div>
    ) as HTMLElement;

    const textSpan = lineElement.querySelector('.terminal-text') as HTMLSpanElement;
    const cursorSpan = lineElement.querySelector('.terminal-cursor') as HTMLSpanElement;

    this.terminalBody.appendChild(lineElement);

    // Type each character
    for (let i = 0; i < line.text.length; i++) {
      textSpan.textContent += line.text[i];
      await this.sleep(30 + Math.random() * 40); // Variable typing speed
    }

    // Remove cursor after typing
    await this.sleep(200);
    cursorSpan.style.opacity = '0';
  }

  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  connectedCallback() {
    super.connectedCallback();

    // Auto-start if lines were set before mounting
    if (this.lines.length > 0 && !this.isTyping) {
      setTimeout(() => this.startTyping(), 100);
    }
  }

  render() {
    const terminal = (
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-buttons">
            <span className="terminal-button close"></span>
            <span className="terminal-button minimize"></span>
            <span className="terminal-button maximize"></span>
          </div>
          <div className="terminal-title">H1ghBre4k3r@lome.dev ~ %</div>
        </div>
        <div className="terminal-body"></div>
      </div>
    ) as HTMLElement;

    this.terminalBody = terminal.querySelector('.terminal-body');

    return terminal;
  }
}
