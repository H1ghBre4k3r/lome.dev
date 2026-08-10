import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  createInitialState,
  stepGame,
  resetGame,
} from './engine.js';
import { readBestScore, writeBestScore } from './storage.js';

export const BREAKOUT_COLORS = Object.freeze({
  paper: '#DED8C9',
  ink: '#171611',
  rust: '#B66A20',
  burgundy: '#7B1F29',
  moss: '#182B26',
});

const ACTION_SELECTOR = '[data-breakout-action]';
const MOVE_SELECTOR = '[data-breakout-move]';

function controls(root, selector) {
  return [...(root.querySelectorAll?.(selector) ?? [])];
}

function keyDirection(key) {
  if (key === 'ArrowLeft' || key.toLowerCase() === 'a') return 'left';
  if (key === 'ArrowRight' || key.toLowerCase() === 'd') return 'right';
  return null;
}

function getWindow(root, document) {
  return document?.defaultView ?? root.ownerDocument?.defaultView ?? globalThis;
}

function getStorage(view) {
  try {
    return view?.localStorage;
  } catch {
    return undefined;
  }
}

function drawGame(context, state) {
  if (!context) return;
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.fillStyle = BREAKOUT_COLORS.paper;
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  for (const brick of state.bricks) {
    if (!brick.alive) continue;
    context.fillStyle = [
      BREAKOUT_COLORS.rust,
      BREAKOUT_COLORS.burgundy,
      BREAKOUT_COLORS.moss,
    ][brick.row % 3];
    context.fillRect(brick.x, brick.y, brick.width, brick.height);
  }

  context.fillStyle = BREAKOUT_COLORS.ink;
  context.fillRect(state.paddle.x, state.paddle.y, state.paddle.width, state.paddle.height);
  context.beginPath();
  context.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2);
  context.fill();
}

export function mountBreakout(root) {
  if (!root?.querySelector) throw new TypeError('mountBreakout requires a root element');

  const canvas = root.querySelector('[data-breakout-canvas]');
  if (!canvas) return null;

  const document = root.ownerDocument ?? globalThis.document;
  const view = getWindow(root, document);
  const context = canvas.getContext?.('2d');
  const statusOutput = root.querySelector('[data-breakout-status]');
  const scoreOutput = root.querySelector('[data-breakout-score]');
  const livesOutput = root.querySelector('[data-breakout-lives]');
  const bestOutput = root.querySelector('[data-breakout-best]');
  const actionControls = controls(root, ACTION_SELECTOR);
  const moveControls = controls(root, MOVE_SELECTOR);
  const held = new Set();
  const listeners = [];
  const storage = getStorage(view);
  const reducedMotion = view?.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;
  const requestFrame = view?.requestAnimationFrame?.bind(view);
  const cancelFrame = view?.cancelAnimationFrame?.bind(view);
  let state = createInitialState();
  let bestScore = readBestScore(storage);
  let frameId = null;
  let lastTime = null;
  let destroyed = false;
  let motionReducedNotice = false;

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  function listen(target, type, listener, options) {
    if (!target?.addEventListener) return;
    target.addEventListener(type, listener, options);
    listeners.push(() => target.removeEventListener?.(type, listener, options));
  }

  function render() {
    if (statusOutput) statusOutput.textContent = motionReducedNotice ? 'motion reduced' : state.status;
    if (scoreOutput) scoreOutput.textContent = String(state.score);
    if (livesOutput) livesOutput.textContent = String(state.lives);
    if (bestOutput) bestOutput.textContent = String(bestScore);
    drawGame(context, state);
  }

  function update(nextState) {
    state = nextState;
    if (state.score > bestScore) {
      bestScore = state.score;
      writeBestScore(storage, bestScore);
    }
    render();
  }

  function stopLoop() {
    if (frameId !== null) cancelFrame?.(frameId);
    frameId = null;
    lastTime = null;
  }

  function input() {
    return { left: held.has('left'), right: held.has('right') };
  }

  function tick(timestamp) {
    frameId = null;
    if (destroyed || state.status !== 'running') return;
    const delta = lastTime === null ? 0 : (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    update(stepGame(state, input(), delta));
    if (state.status === 'running' && !reducedMotion) {
      frameId = requestFrame?.(tick) ?? null;
    } else {
      lastTime = null;
    }
  }

  function startLoop() {
    if (reducedMotion || frameId !== null || !requestFrame || state.status !== 'running') return;
    lastTime = null;
    frameId = requestFrame(tick);
  }

  function action(name) {
    if (name === 'restart') {
      stopLoop();
      motionReducedNotice = false;
      update(resetGame());
      return;
    }
    if (name === 'start' && reducedMotion) {
      stopLoop();
      motionReducedNotice = true;
      update({ ...state, status: 'ready' });
      return;
    }
    if (name === 'pause') held.clear();
    motionReducedNotice = false;
    update(stepGame(state, { [name]: true }, 0));
    if (name === 'pause') stopLoop();
    if (name === 'start') startLoop();
  }

  function focused(event) {
    const active = document?.activeElement;
    return !active || active === root || active === canvas || root.contains?.(active) || event.currentTarget === root;
  }

  function keyboardDown(event) {
    if (!focused(event)) return;
    const direction = keyDirection(event.key ?? '');
    if (!direction) return;
    held.add(direction);
    event.preventDefault?.();
  }

  function keyboardUp(event) {
    const direction = keyDirection(event.key ?? '');
    if (direction) held.delete(direction);
  }

  function setHeld(direction, value, event) {
    if (value) held.add(direction);
    else held.delete(direction);
    if (value) event?.preventDefault?.();
  }

  for (const control of actionControls) {
    listen(control, 'click', () => action(control.dataset?.breakoutAction));
  }
  for (const control of moveControls) {
    const direction = control.dataset?.breakoutMove;
    if (direction !== 'left' && direction !== 'right') continue;
    listen(control, 'pointerdown', (event) => setHeld(direction, true, event));
    listen(control, 'pointerup', (event) => setHeld(direction, false, event));
    listen(control, 'pointercancel', (event) => setHeld(direction, false, event));
    listen(control, 'pointerleave', (event) => setHeld(direction, false, event));
    listen(control, 'touchstart', (event) => setHeld(direction, true, event), { passive: false });
    listen(control, 'touchend', (event) => setHeld(direction, false, event));
    listen(control, 'touchcancel', (event) => setHeld(direction, false, event));
  }

  listen(root, 'keydown', keyboardDown);
  listen(root, 'keyup', keyboardUp);
  listen(canvas, 'keydown', keyboardDown);
  listen(canvas, 'keyup', keyboardUp);
  listen(document, 'keydown', keyboardDown);
  listen(document, 'keyup', keyboardUp);
  listen(document, 'visibilitychange', () => {
    if (document.hidden && state.status === 'running') action('pause');
  });

  render();

  return {
    get state() {
      return state;
    },
    get bestScore() {
      return bestScore;
    },
    start: () => action('start'),
    pause: () => action('pause'),
    restart: () => action('restart'),
    destroy() {
      destroyed = true;
      stopLoop();
      held.clear();
      for (const remove of listeners.splice(0)) remove();
    },
  };
}
