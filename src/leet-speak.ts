/**
 * LeetSpeak transformation utilities
 */

// Classic LeetSpeak character mappings (readable 1337 style)
const LEET_MAPPINGS: Record<string, string[]> = {
  'a': ['4'],
  'e': ['3'],
  'g': ['6'],
  'i': ['1'],
  'o': ['0'],
  's': ['5'],
  't': ['7'],
  'l': ['1'],
  'z': ['2']
};

// Elements to skip during transformation
const SKIP_SELECTORS = [
  'script',
  'style', 
  '[href]',
  '[src]',
  'code',
  'pre',
  '.terminal-text',
  'input',
  'textarea',
  'meta',
  'title',
  'h1', // Preserve main headings for readability
  'nav', // Skip navigation entirely
  '.btn', // Skip button text
  'button', // Skip button elements
  'label' // Skip form labels
];

export interface LeetOptions {
  intensity: number; // 0-1, affects randomness and complexity
  preserveUrls: boolean;
  animations: boolean;
}

class LeetTransformer {
  private originalTexts: Map<Text, string> = new Map();
  private isLeetMode: boolean = false;
  private options: LeetOptions = {
    intensity: 0.4, // Reduced from 0.7 - less aggressive transformation
    preserveUrls: true,
    animations: true
  };

  /**
   * Transform a single character to LeetSpeak
   */
  private transformChar(char: string): string {
    const lowerChar = char.toLowerCase();
    
    // Don't transform spaces, punctuation, or already leet characters
    if (!/[a-z]/i.test(char) || Math.random() > this.options.intensity) {
      return char;
    }

    const mappings = LEET_MAPPINGS[lowerChar];
    if (!mappings || mappings.length === 0) {
      return char;
    }

    // Only transform if it's a common letter and won't hurt readability
    // Be more selective - only transform 40% of eligible characters
    if (Math.random() < 0.4) {
      const leetChar = mappings[0]; // Use only first mapping for consistency
      
      // Preserve original case
      return char === char.toUpperCase() ? leetChar.toUpperCase() : leetChar;
    }
    
    return char; // Return original if random check fails
  }

  /**
   * Check if an element should be skipped
   */
  private shouldSkip(element: Element): boolean {
    return SKIP_SELECTORS.some(selector => {
      try {
        return element.matches(selector) || element.closest(selector);
      } catch {
        return false;
      }
    });
  }

  /**
   * Store original text before transformation
   */
  private storeOriginalText(textNode: Text): void {
    if (!this.originalTexts.has(textNode)) {
      this.originalTexts.set(textNode, textNode.textContent || '');
    }
  }

  /**
   * Transform text content with animation
   */
  private async transformTextWithAnimation(textNode: Text, targetText: string): Promise<void> {
    if (!this.options.animations) {
      textNode.textContent = targetText;
      return;
    }

    const originalText = textNode.textContent || '';
    
    // Subtle effect: brief fade out/in instead of aggressive glitch
    textNode.textContent = originalText;
    
    // Fade out
    await this.sleep(100);
    
    // Transform with minimal glitch
    for (let i = 0; i < 1; i++) { // Just one brief glitch pass
      let glitchText = '';
      for (let j = 0; j < targetText.length; j++) {
        if (Math.random() < 0.1) { // Only 10% chance of glitch
          const chars = '1337';
          glitchText += chars[Math.floor(Math.random() * chars.length)];
        } else {
          glitchText += targetText[j];
        }
      }
      textNode.textContent = glitchText;
      await this.sleep(30);
    }

    // Final transformation
    textNode.textContent = targetText;
  }

  /**
   * Transform all text nodes in an element
   */
  private async transformElement(element: Element): Promise<void> {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (this.shouldSkip(parent)) return NodeFilter.FILTER_REJECT;
          if (node.textContent?.trim() === '') return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const textNodes: Text[] = [];
    let currentNode: Node | null;
    while ((currentNode = walker.nextNode()) !== null) {
      const textNode = currentNode as Text;
      textNodes.push(textNode);
    }

    // Transform with staggered animation
    for (let i = 0; i < textNodes.length; i++) {
      const textNode = textNodes[i];
      this.storeOriginalText(textNode);
      
      const originalText = textNode.textContent || '';
      const transformedText = originalText.split('').map(char => this.transformChar(char)).join('');
      
      if (this.options.animations) {
        setTimeout(() => {
          this.transformTextWithAnimation(textNode, transformedText);
        }, i * 50);
      } else {
        textNode.textContent = transformedText;
      }
    }
  }

  /**
   * Restore all text to original
   */
  private async restoreElement(): Promise<void> {
    for (const [textNode, originalText] of this.originalTexts) {
      if (textNode.parentNode) { // Check if node is still in DOM
        if (this.options.animations) {
          await this.transformTextWithAnimation(textNode, originalText);
        } else {
          textNode.textContent = originalText;
        }
      }
    }
    this.originalTexts.clear();
  }

  /**
   * Enable LeetSpeak mode
   */
  async enable(): Promise<void> {
    if (this.isLeetMode) return;
    
    this.isLeetMode = true;
    const body = document.body;
    if (body) {
      await this.transformElement(body);
    }
    
    // Add visual indicator
    this.addLeetIndicator();
    
    // Trigger particle burst
    this.triggerParticleBurst();
  }

  /**
   * Disable LeetSpeak mode
   */
  async disable(): Promise<void> {
    if (!this.isLeetMode) return;
    
    this.isLeetMode = false;
    await this.restoreElement();
    
    // Remove visual indicator
    this.removeLeetIndicator();
  }

  /**
   * Toggle LeetSpeak mode
   */
  async toggle(): Promise<void> {
    if (this.isLeetMode) {
      await this.disable();
    } else {
      await this.enable();
    }
  }

  /**
   * Add visual indicator
   */
  private addLeetIndicator(): void {
    const indicator = document.createElement('div');
    indicator.id = 'leet-indicator';
    indicator.innerHTML = 'L33T M0D3';
    indicator.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(45deg, #ff00ff, #00ffff);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-family: monospace;
      font-weight: bold;
      font-size: 12px;
      z-index: 9999;
      animation: leetPulse 2s infinite;
      box-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.id = 'leet-indicator-style';
    style.textContent = `
      @keyframes leetPulse {
        0%, 100% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.05); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(indicator);
  }

  /**
   * Remove visual indicator
   */
  private removeLeetIndicator(): void {
    const indicator = document.getElementById('leet-indicator');
    const style = document.getElementById('leet-indicator-style');
    if (indicator) indicator.remove();
    if (style) style.remove();
  }

  /**
   * Trigger particle burst effect
   */
  private triggerParticleBurst(): void {
    const particleBackground = document.querySelector('particle-background');
    if (particleBackground && 'createBurst' in particleBackground) {
      (particleBackground as { createBurst: () => void }).createBurst();
    }
    
    // Screen shake
    document.body.style.animation = 'leetShake 0.3s';
    setTimeout(() => {
      document.body.style.animation = '';
    }, 300);
    
    // Add shake animation if not exists
    if (!document.getElementById('leet-shake-style')) {
      const shakeStyle = document.createElement('style');
      shakeStyle.id = 'leet-shake-style';
      shakeStyle.textContent = `
        @keyframes leetShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
      `;
      document.head.appendChild(shakeStyle);
    }
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if LeetSpeak mode is active
   */
  isActive(): boolean {
    return this.isLeetMode;
  }

  /**
   * Update options
   */
  setOptions(options: Partial<LeetOptions>): void {
    this.options = { ...this.options, ...options };
  }
}

// Global instance
export const leetTransformer = new LeetTransformer();

// Auto-restore on page unload to prevent leaving leet mode
window.addEventListener('beforeunload', () => {
  if (leetTransformer.isActive()) {
    leetTransformer.disable();
  }
});