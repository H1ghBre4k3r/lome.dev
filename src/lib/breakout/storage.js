export const BEST_SCORE_KEY = 'lome.dev.breakout.best.v1';

export function readBestScore(storage) {
  try {
    const value = storage?.getItem(BEST_SCORE_KEY);
    const score = typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : 0;
    return Number.isSafeInteger(score) ? score : 0;
  } catch {
    return 0;
  }
}

export function writeBestScore(storage, score) {
  try {
    const value = Number(score);
    if (Number.isFinite(value) && value >= 0) {
      storage?.setItem(BEST_SCORE_KEY, String(Math.floor(value)));
    }
  } catch {
    // Storage can be disabled or full; the game remains playable without it.
  }
}
