import { test } from 'node:test';
import assert from 'node:assert/strict';

test('creates a ready three-life board with 10 by 5 bricks', async () => {
  const { createInitialState } = await import('../src/lib/breakout/engine.js');
  const state = createInitialState();

  assert.equal(state.status, 'ready');
  assert.equal(state.score, 0);
  assert.equal(state.lives, 3);
  assert.equal(state.bricks.length, 50);
  assert.equal(state.bricks.filter((brick) => brick.alive).length, 50);
});

test('clamps held paddle movement to both canvas bounds', async () => {
  const { createInitialState, stepGame } = await import('../src/lib/breakout/engine.js');
  const started = stepGame(createInitialState(), { start: true }, 0);
  const leftState = stepGame(
    { ...started, paddle: { ...started.paddle, x: 2 } },
    { move: 'left' },
    0.05,
  );
  const rightState = stepGame(
    { ...started, paddle: { ...started.paddle, x: 638 } },
    { move: 'right' },
    0.05,
  );

  assert.equal(leftState.paddle.x, 0);
  assert.equal(rightState.paddle.x, 640 - rightState.paddle.width);
});

test('removes a brick and awards ten points on collision', async () => {
  const { createInitialState, stepGame } = await import('../src/lib/breakout/engine.js');
  const ready = createInitialState();
  const running = stepGame(
    {
      ...ready,
      ball: { ...ready.ball, x: ready.bricks[0].x + 10, y: ready.bricks[0].y - 8, dx: 0, dy: 240 },
    },
    { start: true },
    0,
  );
  const next = stepGame(running, {}, 0.05);

  assert.equal(next.score, 10);
  assert.equal(next.bricks[0].alive, false);
  assert.ok(next.ball.dy < 0);
});

test('losing the ball spends one life and ends after the last life', async () => {
  const { createInitialState, stepGame } = await import('../src/lib/breakout/engine.js');
  const ready = createInitialState();
  const running = stepGame(
    { ...ready, lives: 2, ball: { ...ready.ball, y: 500 } },
    { start: true },
    0,
  );
  const remaining = stepGame(running, {}, 0);

  assert.equal(remaining.lives, 1);
  assert.equal(remaining.status, 'running');
  assert.ok(remaining.ball.y < 420);

  const lost = stepGame(
    { ...remaining, ball: { ...remaining.ball, y: 500 } },
    {},
    0,
  );
  assert.equal(lost.lives, 0);
  assert.equal(lost.status, 'lost');
});

test('clearing the final brick wins the board', async () => {
  const { createInitialState, stepGame } = await import('../src/lib/breakout/engine.js');
  const ready = createInitialState();
  const finalBrick = ready.bricks[0];
  const running = stepGame(
    {
      ...ready,
      bricks: ready.bricks.map((brick, index) => ({ ...brick, alive: index === 0 })),
      ball: { ...ready.ball, x: finalBrick.x + 10, y: finalBrick.y - 8, dx: 0, dy: 240 },
    },
    { start: true },
    0,
  );
  const won = stepGame(running, {}, 0.05);

  assert.equal(won.score, 10);
  assert.equal(won.status, 'won');
  assert.equal(won.bricks.filter((brick) => brick.alive).length, 0);
});

test('resetGame returns a fresh ready board', async () => {
  const { createInitialState, resetGame, stepGame } = await import('../src/lib/breakout/engine.js');
  const initial = createInitialState();
  const running = stepGame(initial, { start: true, right: true }, 0.05);
  const reset = resetGame(running);

  assert.notEqual(reset, running);
  assert.equal(reset.status, 'ready');
  assert.equal(reset.score, 0);
  assert.equal(reset.lives, 3);
  assert.equal(reset.bricks.filter((brick) => brick.alive).length, 50);
});

test('best-score storage is safe for valid, corrupt, and unavailable storage', async () => {
  const { readBestScore, writeBestScore, BEST_SCORE_KEY } = await import('../src/lib/breakout/storage.js');
  const values = new Map();
  const storage = {
    getItem(key) {
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      values.set(key, value);
    },
  };

  assert.equal(readBestScore(storage), 0);
  writeBestScore(storage, 120);
  assert.equal(values.get(BEST_SCORE_KEY), '120');
  assert.equal(readBestScore(storage), 120);

  values.set(BEST_SCORE_KEY, 'not-a-score');
  assert.equal(readBestScore(storage), 0);
  values.set(BEST_SCORE_KEY, '9'.repeat(400));
  assert.equal(readBestScore(storage), 0);
  assert.equal(readBestScore(undefined), 0);
  assert.doesNotThrow(() => writeBestScore(undefined, 42));
});
