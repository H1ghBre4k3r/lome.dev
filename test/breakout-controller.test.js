import { test } from 'node:test';
import assert from 'node:assert/strict';

class FakeTarget {
  constructor(dataset = {}) {
    this.dataset = dataset;
    this.listeners = new Map();
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) ?? [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  removeEventListener(type, listener) {
    this.listeners.set(type, (this.listeners.get(type) ?? []).filter((item) => item !== listener));
  }

  dispatch(type, event = {}) {
    const next = { ...event, type, currentTarget: this, preventDefault() { this.defaultPrevented = true; } };
    for (const listener of this.listeners.get(type) ?? []) listener(next);
    return next;
  }
}

function createFixture({ reducedMotion = false } = {}) {
  const context = {
    clearRect() {},
    fillRect() {},
    beginPath() {},
    arc() {},
    fill() {},
  };
  const canvas = new FakeTarget();
  canvas.getContext = () => context;
  const status = new FakeTarget();
  const score = new FakeTarget();
  const lives = new FakeTarget();
  const best = new FakeTarget();
  const start = new FakeTarget({ breakoutAction: 'start' });
  const pause = new FakeTarget({ breakoutAction: 'pause' });
  const restart = new FakeTarget({ breakoutAction: 'restart' });
  const left = new FakeTarget({ breakoutMove: 'left' });
  const right = new FakeTarget({ breakoutMove: 'right' });
  const document = new FakeTarget();
  document.hidden = false;
  document.activeElement = null;
  const callbacks = [];
  const cancelledFrames = new Set();
  let nextFrameId = 0;
  const view = {
    localStorage: new MapStorage(),
    matchMedia: () => ({ matches: reducedMotion }),
    requestAnimationFrame(callback) {
      const id = ++nextFrameId;
      callbacks.push((timestamp) => {
        if (!cancelledFrames.has(id)) callback(timestamp);
      });
      return id;
    },
    cancelAnimationFrame(id) {
      cancelledFrames.add(id);
    },
  };
  document.defaultView = view;
  const root = new FakeTarget();
  root.ownerDocument = document;
  root.contains = () => true;
  root.querySelector = (selector) => ({
    '[data-breakout-canvas]': canvas,
    '[data-breakout-status]': status,
    '[data-breakout-score]': score,
    '[data-breakout-lives]': lives,
    '[data-breakout-best]': best,
  }[selector]);
  root.querySelectorAll = (selector) => ({
    '[data-breakout-action]': [start, pause, restart],
    '[data-breakout-move]': [left, right],
  }[selector] ?? []);
  return { root, document, view, canvas, status, score, lives, best, start, pause, restart, left, right, callbacks };
}

class MapStorage {
  #values = new Map();
  getItem(key) { return this.#values.get(key) ?? null; }
  setItem(key, value) { this.#values.set(key, value); }
}

test('mountBreakout binds the canvas and reports an initial game state', async () => {
  const { mountBreakout } = await import('../src/lib/breakout/controller.js');
  assert.equal(typeof mountBreakout, 'function');
});

test('mountBreakout renders ready state and fixed canvas dimensions', async () => {
  const { mountBreakout } = await import('../src/lib/breakout/controller.js');
  const fixture = createFixture();
  const controller = mountBreakout(fixture.root);

  assert.equal(fixture.canvas.width, 640);
  assert.equal(fixture.canvas.height, 420);
  assert.equal(fixture.status.textContent, 'ready');
  assert.equal(fixture.score.textContent, '0');
  assert.equal(fixture.lives.textContent, '3');
  assert.equal(fixture.best.textContent, '0');
  controller.destroy();
});

test('reduced motion keeps the engine ready with an accessible status', async () => {
  const { mountBreakout } = await import('../src/lib/breakout/controller.js');
  const fixture = createFixture({ reducedMotion: true });
  const controller = mountBreakout(fixture.root);

  fixture.start.dispatch('click');

  assert.equal(controller.state.status, 'ready');
  assert.equal(fixture.status.textContent, 'motion reduced');
  assert.equal(fixture.callbacks.length, 0);
  controller.destroy();
});

test('focused arrows and held touch movement move the paddle', async () => {
  const { mountBreakout } = await import('../src/lib/breakout/controller.js');
  const fixture = createFixture();
  fixture.document.activeElement = fixture.root;
  const controller = mountBreakout(fixture.root);
  const initialX = controller.state.paddle.x;

  fixture.start.dispatch('click');
  fixture.callbacks.shift()(0);
  fixture.root.dispatch('keydown', { key: 'ArrowLeft' });
  fixture.left.dispatch('pointerdown');
  fixture.callbacks.shift()(100);

  assert.ok(controller.state.paddle.x < initialX);
  fixture.left.dispatch('pointerup');
  fixture.root.dispatch('keyup', { key: 'ArrowLeft' });
  controller.destroy();
});

test('document visibility loss pauses a running game', async () => {
  const { mountBreakout } = await import('../src/lib/breakout/controller.js');
  const fixture = createFixture();
  const controller = mountBreakout(fixture.root);

  fixture.start.dispatch('click');
  fixture.document.hidden = true;
  fixture.document.dispatch('visibilitychange');

  assert.equal(controller.state.status, 'paused');
  assert.equal(fixture.status.textContent, 'paused');
  controller.destroy();
});

test('visibility pause clears held movement before a later resume', async () => {
  const { mountBreakout } = await import('../src/lib/breakout/controller.js');
  const fixture = createFixture();
  const controller = mountBreakout(fixture.root);
  const initialX = controller.state.paddle.x;

  controller.start();
  fixture.callbacks.shift()(0);
  fixture.left.dispatch('pointerdown');
  fixture.document.hidden = true;
  fixture.document.dispatch('visibilitychange');
  fixture.document.hidden = false;
  controller.start();

  fixture.callbacks.shift()(100); // cancelled frame from before the visibility pause
  fixture.callbacks.shift()(100); // resumed frame, zero elapsed time
  fixture.callbacks.shift()(200); // resumed frame with elapsed time

  assert.equal(controller.state.paddle.x, initialX);
  fixture.left.dispatch('pointerdown');
  fixture.callbacks.shift()(300);
  assert.ok(controller.state.paddle.x < initialX);
  controller.destroy();
});
