export const CANVAS_WIDTH = 640;
export const CANVAS_HEIGHT = 420;
export const MAX_DELTA_SECONDS = 0.05;
export const INITIAL_LIVES = 3;

const PADDLE_WIDTH = 96;
const PADDLE_HEIGHT = 12;
const PADDLE_Y = CANVAS_HEIGHT - 30;
const PADDLE_SPEED = 420;
const BALL_RADIUS = 7;
const BALL_SPEED = 240;
const BRICK_COLUMNS = 10;
const BRICK_ROWS = 5;
const BRICK_GAP = 4;
const BRICK_LEFT = 24;
const BRICK_TOP = 36;
const BRICK_HEIGHT = 18;
const BRICK_WIDTH =
  (CANVAS_WIDTH - BRICK_LEFT * 2 - BRICK_GAP * (BRICK_COLUMNS - 1)) /
  BRICK_COLUMNS;

function createPaddle() {
  return {
    x: (CANVAS_WIDTH - PADDLE_WIDTH) / 2,
    y: PADDLE_Y,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    speed: PADDLE_SPEED,
  };
}

function createBall() {
  return {
    x: CANVAS_WIDTH / 2,
    y: PADDLE_Y - BALL_RADIUS - 2,
    radius: BALL_RADIUS,
    dx: BALL_SPEED * 0.7,
    dy: -BALL_SPEED,
  };
}

function createBricks() {
  return Array.from({ length: BRICK_ROWS * BRICK_COLUMNS }, (_, index) => {
    const row = Math.floor(index / BRICK_COLUMNS);
    const column = index % BRICK_COLUMNS;

    return {
      x: BRICK_LEFT + column * (BRICK_WIDTH + BRICK_GAP),
      y: BRICK_TOP + row * (BRICK_HEIGHT + BRICK_GAP),
      width: BRICK_WIDTH,
      height: BRICK_HEIGHT,
      row,
      column,
      alive: true,
    };
  });
}

export function createInitialState() {
  return {
    status: 'ready',
    score: 0,
    lives: INITIAL_LIVES,
    paddle: createPaddle(),
    ball: createBall(),
    bricks: createBricks(),
  };
}

export function resetGame() {
  return createInitialState();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function isAction(input, action) {
  return input === action || input?.action === action || input?.[action] === true;
}

function clampDelta(deltaSeconds) {
  const delta = Number(deltaSeconds);
  return Number.isFinite(delta) ? clamp(delta, 0, MAX_DELTA_SECONDS) : 0;
}

function intersects(ball, rectangle) {
  return (
    ball.x + ball.radius >= rectangle.x &&
    ball.x - ball.radius <= rectangle.x + rectangle.width &&
    ball.y + ball.radius >= rectangle.y &&
    ball.y - ball.radius <= rectangle.y + rectangle.height
  );
}

function resetBall() {
  return createBall();
}

export function stepGame(state, input = {}, deltaSeconds = 0) {
  if (!state || typeof state !== 'object') return createInitialState();
  if (isAction(input, 'restart')) return resetGame();

  const next = {
    ...state,
    paddle: { ...state.paddle },
    ball: { ...state.ball },
    bricks: state.bricks.map((brick) => ({ ...brick })),
  };

  if (next.bricks.every((brick) => !brick.alive)) {
    next.status = 'won';
    return next;
  }

  if (isAction(input, 'pause') && next.status === 'running') {
    next.status = 'paused';
    return next;
  }

  if (isAction(input, 'start') && (next.status === 'ready' || next.status === 'paused')) {
    next.status = 'running';
  }

  if (next.status !== 'running') return next;

  const delta = clampDelta(deltaSeconds);
  const move = input?.move;
  const direction =
    (input?.right || move === 'right' ? 1 : 0) -
    (input?.left || move === 'left' ? 1 : 0);
  next.paddle.x = clamp(
    next.paddle.x + direction * next.paddle.speed * delta,
    0,
    CANVAS_WIDTH - next.paddle.width,
  );

  const previousBall = { ...next.ball };
  next.ball.x += next.ball.dx * delta;
  next.ball.y += next.ball.dy * delta;

  if (next.ball.x - next.ball.radius < 0) {
    next.ball.x = next.ball.radius;
    next.ball.dx = Math.abs(next.ball.dx);
  } else if (next.ball.x + next.ball.radius > CANVAS_WIDTH) {
    next.ball.x = CANVAS_WIDTH - next.ball.radius;
    next.ball.dx = -Math.abs(next.ball.dx);
  }

  if (next.ball.y - next.ball.radius < 0) {
    next.ball.y = next.ball.radius;
    next.ball.dy = Math.abs(next.ball.dy);
  }

  const hitBrick = next.bricks.find(
    (brick) => brick.alive && intersects(next.ball, brick),
  );
  if (hitBrick) {
    hitBrick.alive = false;
    next.score += 10;
    if (
      previousBall.y + next.ball.radius <= hitBrick.y ||
      previousBall.y - next.ball.radius >= hitBrick.y + hitBrick.height
    ) {
      next.ball.dy *= -1;
    } else {
      next.ball.dx *= -1;
    }
  }

  const hitPaddle =
    next.ball.dy > 0 && intersects(next.ball, next.paddle) && previousBall.y <= next.paddle.y;
  if (hitPaddle) {
    next.ball.y = next.paddle.y - next.ball.radius;
    next.ball.dy = -Math.abs(next.ball.dy);
    const offset = (next.ball.x - (next.paddle.x + next.paddle.width / 2)) / (next.paddle.width / 2);
    next.ball.dx = clamp(next.ball.dx + offset * 80, -BALL_SPEED * 1.5, BALL_SPEED * 1.5);
  }

  if (next.bricks.every((brick) => !brick.alive)) next.status = 'won';
  if (next.ball.y - next.ball.radius > CANVAS_HEIGHT) {
    next.lives -= 1;
    next.ball = resetBall();
    if (next.lives <= 0) next.status = 'lost';
  }

  return next;
}
