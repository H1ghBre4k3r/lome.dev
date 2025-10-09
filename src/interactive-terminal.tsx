import { a, AbstractElement } from "@pesca-dev/atomicity";
import "./terminal-typing.css";
import { Component } from "./component";
import { executeCommand, commands } from "./terminal-commands";

interface TerminalLine {
  text: string;
  className?: string;
  isCommand?: boolean;
}

interface TypingLine {
  text: string;
  delay?: number;
  className?: string;
}

@Component("interactive-terminal")
export class InteractiveTerminal extends AbstractElement {
  private terminalBody: HTMLElement | null = null;
  private inputLine: HTMLElement | null = null;
  private inputField: HTMLSpanElement | null = null;
  private currentInput: string = '';
  private history: string[] = [];
  private historyIndex: number = -1;
  private isInteractive: boolean = false;
  private introLines: TypingLine[] = [];
  private outputLines: TerminalLine[] = [];

  constructor() {
    super();
  }

  setIntroLines(lines: TypingLine[]) {
    this.introLines = lines;
    // If already connected to DOM, start the intro animation
    if (this.terminalBody) {
      this.playIntroAnimation().then(() => {
        this.enableInteractiveMode();
      });
    }
  }

  async connectedCallback() {
    super.connectedCallback();

    // connectedCallback fires when component is added to DOM
    // If intro lines were already set before connection, play them now
    if (this.introLines.length > 0) {
      await this.playIntroAnimation();
      this.enableInteractiveMode();
    }
    // Otherwise, wait for setIntroLines() to be called
    // (or enableInteractiveMode() can be called directly if no intro needed)
  }

  async playIntroAnimation() {
    if (!this.terminalBody) return;

    for (let i = 0; i < this.introLines.length; i++) {
      await this.typeIntroLine(this.introLines[i]);

      if (this.introLines[i].delay) {
        await this.sleep(this.introLines[i].delay!);
      }
    }
  }

  async typeIntroLine(line: TypingLine) {
    if (!this.terminalBody) return;

    const lineElement = document.createElement('div');
    lineElement.className = `terminal-line ${line.className || ''}`;

    const promptSpan = document.createElement('span');
    promptSpan.className = 'terminal-prompt';
    promptSpan.textContent = '> ';

    const textSpan = document.createElement('span');
    textSpan.className = 'terminal-text';

    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'terminal-cursor';
    cursorSpan.textContent = '▊';

    lineElement.appendChild(promptSpan);
    lineElement.appendChild(textSpan);
    lineElement.appendChild(cursorSpan);

    this.terminalBody.appendChild(lineElement);

    // Type each character
    for (let i = 0; i < line.text.length; i++) {
      textSpan.textContent += line.text[i];
      await this.sleep(30 + Math.random() * 40);
    }

    await this.sleep(200);
    cursorSpan.style.opacity = '0';
    this.scrollToBottom();
  }

  enableInteractiveMode() {
    if (this.isInteractive || !this.terminalBody) return;

    this.isInteractive = true;

    // Add welcome message
    this.addOutputLine('', '');
    this.addOutputLine('Terminal ready. Type "help" for available commands.', 'success');
    this.addOutputLine('', '');

    // Create interactive input line
    this.createInputLine();

    // Focus on terminal
    this.focus();
  }

  createInputLine() {
    if (!this.terminalBody) return;

    const lineElement = document.createElement('div');
    lineElement.className = 'terminal-line terminal-input-line';

    const promptSpan = document.createElement('span');
    promptSpan.className = 'terminal-prompt';
    promptSpan.textContent = '> ';

    // Use standard input element for reliable text input
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'terminal-input';
    input.spellcheck = false;
    input.autocomplete = 'off';
    input.autocapitalize = 'off';

    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'terminal-cursor active';
    cursorSpan.textContent = '▊';

    input.placeholder = 'Type a command (Tab to autocomplete, help to list)';
    input.setAttribute('aria-label', 'Terminal input');

    lineElement.appendChild(promptSpan);
    lineElement.appendChild(input);
    lineElement.appendChild(cursorSpan);

    this.terminalBody.appendChild(lineElement);
    this.inputLine = lineElement;
    this.inputField = input as unknown as HTMLSpanElement;
    this.scrollToBottom();

    // Add event listeners AFTER element is in DOM
    input.addEventListener('keydown', (e) => this.handleKeyDown(e));
    input.addEventListener('input', () => this.handleInput());

    // Focus the input
    setTimeout(() => {
      input.focus();
    }, 100);
  }

  handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.executeCurrentCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.navigateHistory(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.navigateHistory(1);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      this.autocomplete();
    } else if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      this.cancelCommand();
    } else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      this.clearScreen();
    }
  }

  handleInput() {
    if (!this.inputField) return;
    this.currentInput = (this.inputField as HTMLInputElement).value || '';
  }


  async executeCurrentCommand() {
    const command = this.currentInput.trim();

    if (!command) {
      this.createInputLine();
      return;
    }

    // Add command to history
    this.history.push(command);
    this.historyIndex = this.history.length;

    // Display the command
    this.addOutputLine(command, '', true);

    // Remove current input line
    if (this.inputLine) {
      this.inputLine.remove();
    }

    // Execute command
    try {
      const result = await executeCommand(command);

      // Handle special commands
      if (result.lines[0] === 'CLEAR_SCREEN') {
        this.clearScreen();
        this.createInputLine();
        this.currentInput = '';
        this.scrollToBottom();
        return;
      }

      if (result.lines[0] === 'SHOW_HISTORY') {
        this.showHistory();
        this.createInputLine();
        this.currentInput = '';
        this.scrollToBottom();
        return;
      }

      // Display output
      result.lines.forEach(line => {
        this.addOutputLine(line, result.className || '');
      });
    } catch (error) {
      this.addOutputLine(`Error: ${error}`, 'error');
    }

    // Create new input line
    this.createInputLine();
    this.currentInput = '';

    // Scroll to bottom
    this.scrollToBottom();

    // Focus input
    this.inputField?.focus();
  }

  navigateHistory(direction: number) {
    if (this.history.length === 0) return;

    this.historyIndex += direction;

    if (this.historyIndex < 0) {
      this.historyIndex = 0;
    } else if (this.historyIndex >= this.history.length) {
      this.historyIndex = this.history.length;
      this.currentInput = '';
      if (this.inputField) {
        (this.inputField as HTMLInputElement).value = '';
      }
      return;
    }

    this.currentInput = this.history[this.historyIndex];
    if (this.inputField) {
      (this.inputField as HTMLInputElement).value = this.currentInput;
    }
  }

  cancelCommand() {
    this.currentInput = '';
    if (this.inputField) {
      (this.inputField as HTMLInputElement).value = '';
    }
  }

  clearScreen() {
    if (!this.terminalBody) return;
    this.terminalBody.innerHTML = '';
    this.outputLines = [];
  }

  showHistory() {
    if (this.history.length === 0) {
      this.addOutputLine('No commands in history', '');
      return;
    }

    this.addOutputLine('Command History:', '');
    this.history.forEach((cmd, index) => {
      this.addOutputLine(`  ${index + 1}  ${cmd}`, '');
    });
  }

  addOutputLine(text: string, className: string = '', isCommand: boolean = false) {
    if (!this.terminalBody) return;

    const lineElement = document.createElement('div');
    lineElement.className = `terminal-line ${className}`;

    if (isCommand) {
      const promptSpan = document.createElement('span');
      promptSpan.className = 'terminal-prompt';
      promptSpan.textContent = '> ';
      lineElement.appendChild(promptSpan);
    }

    const textSpan = document.createElement('span');
    textSpan.className = 'terminal-text';
    textSpan.textContent = text;

    lineElement.appendChild(textSpan);
    this.terminalBody.appendChild(lineElement);

    this.outputLines.push({ text, className, isCommand });
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (!this.terminalBody) return;
    this.terminalBody.scrollTop = this.terminalBody.scrollHeight;
  }

  focus() {
    if (this.inputField) {
      this.inputField.focus();
    }
  }
  autocomplete() {
    if (!this.inputField) return;
    const inputEl = this.inputField as HTMLInputElement;
    const value = inputEl.value;
    const parts = value.trim().split(/\s+/);

    // Only autocomplete the command name (first token)
    const prefix = parts[0] || '';
    const visible = commands.filter(c => !c.hidden).map(c => c.name);

    if (!prefix) {
      this.addOutputLine(visible.join('  '), 'info');
      this.scrollToBottom();
      return;
    }

    const matches = visible.filter(name => name.startsWith(prefix));

    if (matches.length === 1) {
      inputEl.value = matches[0] + ' ';
      this.currentInput = inputEl.value;
    } else if (matches.length > 1) {
      this.addOutputLine(matches.join('  '), 'info');
      this.scrollToBottom();
    }
  }


  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
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

    // Click anywhere in terminal to focus
    terminal.addEventListener('click', (e) => {
      // Don't refocus if clicking on the input itself
      if (e.target !== this.inputField) {
        this.focus();
      }
    });

    return terminal;
  }
}
