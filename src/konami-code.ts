/**
 * Konami Code Easter Egg Implementation
 */

import { leetTransformer } from './leet-speak';

class KonamiCode {
  private sequence: string[] = [];
  private konamiCode: string[] = [
    'ArrowUp',
    'ArrowUp', 
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a'
  ];
  private isActive: boolean = false;
  private timeoutHandle: number | null = null;
  private lastKeyTime: number = 0;
  private readonly TIMEOUT_DURATION = 5000; // 5 seconds to complete the code

  constructor() {
    this.init();
  }

  /**
   * Initialize the Konami code listener
   */
  private init(): void {
    document.addEventListener('keydown', this.handleKeyPress.bind(this));
    
    // Check for URL parameter
    this.checkUrlParameter();
  }

  /**
   * Handle individual key press
   */
  private handleKeyPress(event: KeyboardEvent): void {
    // Ignore if typing in input fields
    const target = event.target as Element;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || (target as HTMLElement).contentEditable === 'true') {
      return;
    }

    const key = event.key.toLowerCase();
    const currentTime = Date.now();

    // Reset if too much time has passed
    if (currentTime - this.lastKeyTime > this.TIMEOUT_DURATION) {
      this.resetSequence();
    }

    this.lastKeyTime = currentTime;
    this.sequence.push(key);

    // Check if the sequence matches so far
    const currentSequenceStr = this.sequence.join('');
    const konamiCodeStr = this.konamiCode.join('').toLowerCase();

    if (currentSequenceStr === konamiCodeStr) {
      this.activate();
      this.resetSequence();
    } else if (!konamiCodeStr.startsWith(currentSequenceStr)) {
      // Reset if sequence doesn't match prefix
      this.resetSequence();
    }

    // Visual feedback for correct keypresses
    if (this.konamiCode[this.sequence.length - 1]?.toLowerCase() === key) {
      this.showKeyFeedback(key);
    }
  }

  /**
   * Show visual feedback for correct keypresses
   */
  private showKeyFeedback(key: string): void {
    const indicator = document.createElement('div');
    indicator.textContent = key.toUpperCase();
    indicator.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(102, 126, 234, 0.8);
      color: white;
      padding: 20px 30px;
      border-radius: 10px;
      font-family: 'FliegeMono', monospace;
      font-size: 24px;
      font-weight: bold;
      z-index: 10000;
      animation: konamiKeyPulse 0.3s ease-out;
      pointer-events: none;
    `;

    // Add animation
    if (!document.getElementById('konami-key-style')) {
      const style = document.createElement('style');
      style.id = 'konami-key-style';
      style.textContent = `
        @keyframes konamiKeyPulse {
          0% { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.5);
          }
          50% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1.1);
          }
          100% { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(indicator);
    setTimeout(() => indicator.remove(), 300);
  }

  /**
   * Reset the key sequence
   */
  private resetSequence(): void {
    this.sequence = [];
    this.lastKeyTime = 0;
  }

  /**
   * Activate the Easter egg
   */
  private async activate(): Promise<void> {
    if (this.isActive) return;

    this.isActive = true;
    console.log('🎮 Konami Code Activated! Transforming to LeetSpeak...');

    // Show activation message
    this.showActivationMessage();

    // Toggle LeetSpeak mode
    await leetTransformer.toggle();

    // Set auto-timeout to revert after 30 seconds
    this.setAutorevertTimeout();
  }

  /**
   * Show activation message
   */
  private showActivationMessage(): void {
    const message = document.createElement('div');
    message.innerHTML = `
      <div style="text-align: center; margin-bottom: 10px;">🎮 KONAMI CODE ACTIVATED! 🎮</div>
      <div style="font-size: 14px; opacity: 0.8;">Press again to revert • Auto-revert in 30s</div>
    `;
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px 40px;
      border-radius: 15px;
      font-family: 'FliegeMono', monospace;
      font-size: 18px;
      font-weight: bold;
      z-index: 10001;
      animation: konamiActivation 0.5s ease-out;
      text-align: center;
      box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
      pointer-events: none;
    `;

    // Add activation animation
    if (!document.getElementById('konami-activation-style')) {
      const style = document.createElement('style');
      style.id = 'konami-activation-style';
      style.textContent = `
        @keyframes konamiActivation {
          0% { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.8) rotate(-5deg);
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.05) rotate(2deg);
          }
          100% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
          }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(message);
    setTimeout(() => message.remove(), 2000);
  }

  /**
   * Set auto-revert timeout
   */
  private setAutorevertTimeout(): void {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }

    this.timeoutHandle = window.setTimeout(() => {
      this.revert();
    }, 30000); // 30 seconds
  }

  /**
   * Revert the Easter egg
   */
  private async revert(): Promise<void> {
    if (!this.isActive) return;

    this.isActive = false;
    console.log('Reverting from LeetSpeak mode...');

    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
    }

    await leetTransformer.disable();

    // Show revert message
    this.showRevertMessage();
  }

  /**
   * Show revert message
   */
  private showRevertMessage(): void {
    const message = document.createElement('div');
    message.textContent = 'LeetSpeak mode deactivated';
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(156, 163, 175, 0.9);
      color: white;
      padding: 20px 30px;
      border-radius: 10px;
      font-family: 'FliegeMono', monospace;
      font-size: 16px;
      font-weight: bold;
      z-index: 10001;
      animation: konamiRevert 0.5s ease-out;
      pointer-events: none;
    `;

    // Add revert animation
    if (!document.getElementById('konami-revert-style')) {
      const style = document.createElement('style');
      style.id = 'konami-revert-style';
      style.textContent = `
        @keyframes konamiRevert {
          0% { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.9);
          }
          100% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(message);
    setTimeout(() => message.remove(), 1500);
  }

  /**
   * Check for URL parameter to auto-activate
   */
  private checkUrlParameter(): void {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('leet') === 'true') {
      setTimeout(() => {
        this.activate();
      }, 1000); // Delay to ensure page is loaded
    }
  }

  /**
   * Public method to toggle the Easter egg
   */
  public toggle(): void {
    if (this.isActive) {
      this.revert();
    } else {
      this.activate();
    }
  }

  /**
   * Public method to check if active
   */
  public isActivated(): boolean {
    return this.isActive;
  }
}

// Create and export global instance
export const konamiCode = new KonamiCode();

// Also add escape key listener for quick exit
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && konamiCode.isActivated()) {
    konamiCode.toggle();
  }
});