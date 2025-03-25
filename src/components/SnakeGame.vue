<template>
  <div class="game-container">
    <div class="game-area">
      <canvas ref="gameCanvas" width="600" height="600"></canvas>

      <div class="game-controls">
        <div class="score-container">
          <div class="current-score">分数: <span>{{ score }}</span></div>
          <div class="high-score">最高分: <span>{{ highScore }}</span></div>
        </div>
        <div class="button-group">
          <button @click="startGame" :disabled="isGameRunning" class="btn primary-btn">开始游戏 (空格)</button>
          <button @click="pauseGame" :disabled="!isGameRunning || isPaused" class="btn secondary-btn">暂停 (V)</button>
          <button @click="resumeGame" :disabled="!isPaused" class="btn secondary-btn">继续 (B)</button>
          <button @click="restartGame" class="btn secondary-btn">重新开始</button>
          <button @click="showInstructions" class="btn secondary-btn">游戏说明</button>
        </div>

        <div class="control-group">
          <h3>难度模式</h3>
          <div class="radio-group">
            <label>
              <input type="radio" v-model="gameMode" value="easy" @change="handleModeChange">
              简单 (可穿墙)
            </label>
            <label>
              <input type="radio" v-model="gameMode" value="hard" @change="handleModeChange">
              困难 (不可穿墙)
            </label>
          </div>
        </div>

        <div class="control-group">
          <h3>速度模式</h3>
          <div class="radio-group">
            <label>
              <input type="radio" v-model="speedMode" value="slow" @change="handleSpeedChange">
              慢速
            </label>
            <label>
              <input type="radio" v-model="speedMode" value="medium" @change="handleSpeedChange">
              中速
            </label>
            <label>
              <input type="radio" v-model="speedMode" value="fast" @change="handleSpeedChange">
              快速
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- 游戏结束弹窗 -->
    <div v-if="showGameOverModal" class="modal">
      <div class="modal-content">
        <h2>游戏结束!</h2>
        <p>你的分数: <span>{{ score }}</span></p>
        <button @click="playAgain" class="btn primary-btn">再玩一次</button>
      </div>
    </div>

    <!-- 游戏说明弹窗 -->
    <div v-if="showInstructionsModal" class="modal">
      <div class="modal-content">
        <h2>游戏说明</h2>
        <ul>
          <li>使用方向键或WASD控制蛇的移动</li>
          <li>按空格键开始游戏</li>
          <li>按V键暂停游戏</li>
          <li>按B键继续游戏</li>
          <li>吃到食物得分</li>
          <li>简单模式可以穿墙，困难模式撞墙游戏结束</li>
        </ul>
        <button @click="closeInstructions" class="btn primary-btn">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

// 游戏常量
const GRID_SIZE = 20; // 网格大小
const GRID_COLOR = '#e0e0e0'; // 网格线颜色
const SNAKE_COLOR = '#4CAF50'; // 蛇身体颜色
const SNAKE_HEAD_COLOR = '#388E3C'; // 蛇头颜色
const FOOD_COLOR = '#F44336'; // 食物颜色
const WALL_COLOR = '#333333'; // 墙壁颜色

// 游戏变量
const gameCanvas = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let snake: { x: number, y: number }[] = [];
let food: { x: number, y: number } | null = null;
let direction = 'right';
let nextDirection = 'right';
let gameInterval: number | null = null;
const score = ref(0);
const highScore = ref(localStorage.getItem('snakeHighScore') || '0');
const gameSpeed = ref(150); // 默认速度 (毫秒)
const gameMode = ref('easy'); // 默认模式
const speedMode = ref('slow'); // 默认速度模式
const isGameRunning = ref(false);
const isPaused = ref(false);
const showGameOverModal = ref(false);
const showInstructionsModal = ref(false);

// 初始化游戏
onMounted(() => {
  if (gameCanvas.value) {
    ctx = gameCanvas.value.getContext('2d');

    // 设置画布实际大小
    const gridCount = Math.floor(500 / GRID_SIZE);
    const canvasSize = gridCount * GRID_SIZE;
    gameCanvas.value.width = canvasSize;
    gameCanvas.value.height = canvasSize;

    // 初始化事件监听
    document.addEventListener('keydown', handleKeyPress);

    // 绘制初始画面
    drawGrid();
    drawWalls();
    drawInstructions();
  }
});

// 组件卸载时清除事件监听和定时器
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyPress);
  if (gameInterval) {
    clearInterval(gameInterval);
  }
});

// 监听游戏模式变化
watch(gameMode, (newMode) => {
  if (isGameRunning.value) {
    restartGame();
  }
});

// 处理键盘按键
function handleKeyPress(e: KeyboardEvent) {
  // 方向控制
  switch (e.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      if (direction !== 'down') nextDirection = 'up';
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      if (direction !== 'up') nextDirection = 'down';
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      if (direction !== 'right') nextDirection = 'left';
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      if (direction !== 'left') nextDirection = 'right';
      break;
    case ' ': // 空格键
      if (!isGameRunning.value) startGame();
      break;
    case 'v':
    case 'V':
      if (isGameRunning.value && !isPaused.value) pauseGame();
      break;
    case 'b':
    case 'B':
      if (isPaused.value) resumeGame();
      break;
  }
}

// 处理难度模式变化
function handleModeChange() {
  if (isGameRunning.value) {
    restartGame();
  }
}

// 处理速度模式变化
function handleSpeedChange() {
  switch (speedMode.value) {
    case 'slow':
      gameSpeed.value = 150;
      break;
    case 'medium':
      gameSpeed.value = 100;
      break;
    case 'fast':
      gameSpeed.value = 60;
      break;
  }

  if (isGameRunning.value) {
    if (gameInterval) {
      clearInterval(gameInterval);
    }
    gameInterval = setInterval(gameLoop, gameSpeed.value);

  }
}

// 开始游戏
function startGame() {
  if (isGameRunning.value) return;

  // 初始化蛇
  if (gameCanvas.value) {
    const gridCount = Math.floor(gameCanvas.value.width / GRID_SIZE);
    const startX = Math.floor(gridCount / 4);
    const startY = Math.floor(gridCount / 2);

    snake = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY }
    ];
  }

  // 初始方向
  direction = 'right';
  nextDirection = 'right';

  // 生成食物
  generateFood();

  // 重置分数
  score.value = 0;

  // 开始游戏循环
  isGameRunning.value = true;
  isPaused.value = false;
  showGameOverModal.value = false;
  gameInterval = setInterval(gameLoop, gameSpeed.value);
}

// 暂停游戏
function pauseGame() {
  if (!isGameRunning.value || isPaused.value) return;

  if (gameInterval) {
    clearInterval(gameInterval);
  }
  isPaused.value = true;

  // 绘制暂停提示
  if (ctx && gameCanvas.value) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, gameCanvas.value.width, gameCanvas.value.height);

    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('游戏已暂停', gameCanvas.value.width / 2, gameCanvas.value.height / 2);
  }
}

// 继续游戏
function resumeGame() {
  if (!isPaused.value) return;

  isPaused.value = false;
  gameInterval = setInterval(gameLoop, gameSpeed.value);
}

// 重新开始游戏
function restartGame() {
  if (gameInterval) {
    clearInterval(gameInterval);
  }

  isGameRunning.value = false;
  isPaused.value = false;
  showGameOverModal.value = false;

  // 清空画布
  if (ctx && gameCanvas.value) {
    ctx.clearRect(0, 0, gameCanvas.value.width, gameCanvas.value.height);
    drawGrid();
    drawWalls();
  }

  startGame();
}

// 游戏结束
function gameOver() {
  if (gameInterval) {
    clearInterval(gameInterval);
  }

  isGameRunning.value = false;

  // 更新最高分
  if (score.value > parseInt(highScore.value)) {
    highScore.value = score.value.toString();
    localStorage.setItem('snakeHighScore', highScore.value);
  }

  // 显示游戏结束弹窗
  showGameOverModal.value = true;
}

// 再玩一次
function playAgain() {
  showGameOverModal.value = false;
  restartGame();
}

// 显示游戏说明
function showInstructions() {
  showInstructionsModal.value = true;
}

// 关闭游戏说明
function closeInstructions() {
  showInstructionsModal.value = false;
}

// 游戏主循环
function gameLoop() {
  // 更新蛇的方向
  direction = nextDirection;

  // 移动蛇
  moveSnake();

  // 检查碰撞
  if (checkCollision()) {
    gameOver();
    return;
  }

  // 检查是否吃到食物
  if (food && snake[0].x === food.x && snake[0].y === food.y) {
    // 增加分数
    score.value += 10;

    // 不移除蛇尾，让蛇变长
    generateFood();
  } else {
    // 移除蛇尾
    snake.pop();
  }

  // 绘制游戏
  if (ctx && gameCanvas.value) {
    ctx.clearRect(0, 0, gameCanvas.value.width, gameCanvas.value.height);
    drawGrid();
    drawWalls();
    drawSnake();
    if (food) drawFood();
  }
}

// 移动蛇
function moveSnake() {
  // 获取蛇头位置
  const head = { x: snake[0].x, y: snake[0].y };

  // 根据方向移动蛇头
  switch (direction) {
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
    case 'left':
      head.x--;
      break;
    case 'right':
      head.x++;
      break;
  }

  // 处理穿墙
  if (gameCanvas.value) {
    const gridCount = Math.floor(gameCanvas.value.width / GRID_SIZE);

    if (head.x < 0) head.x = gridCount - 1;
    if (head.x >= gridCount) head.x = 0;
    if (head.y < 0) head.y = gridCount - 1;
    if (head.y >= gridCount) head.y = 0;
  }

  // 将新头部添加到蛇身体前面
  snake.unshift(head);
}

// 检查碰撞
function checkCollision() {
  const head = snake[0];

  // 检查是否撞到墙壁（仅在困难模式下）
  if (gameMode.value === 'hard' && gameCanvas.value) {
    const gridCount = Math.floor(gameCanvas.value.width / GRID_SIZE);
    if (head.x < 0 || head.x >= gridCount || head.y < 0 || head.y >= gridCount) {
      return true;
    }
  }

  // 检查是否撞到自己（从第二个身体部分开始检查）
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false;
}

// 生成食物
function generateFood() {
  if (!gameCanvas.value) return;

  const gridCount = Math.floor(gameCanvas.value.width / GRID_SIZE);
  let newFood;
  let foodOnSnake;

  // 确保食物不会生成在蛇身上
  do {
    foodOnSnake = false;
    newFood = {
      x: Math.floor(Math.random() * gridCount),
      y: Math.floor(Math.random() * gridCount)
    };

    // 检查食物是否在蛇身上
    for (const segment of snake) {
      if (segment.x === newFood.x && segment.y === newFood.y) {
        foodOnSnake = true;
        break;
      }
    }
  } while (foodOnSnake);

  food = newFood;
}

// 绘制网格
function drawGrid() {
  if (!ctx || !gameCanvas.value) return;

  ctx.strokeStyle = GRID_COLOR;
  ctx.lineWidth = 0.5;

  const gridCount = Math.floor(gameCanvas.value.width / GRID_SIZE);

  // 绘制垂直线
  for (let i = 0; i <= gridCount; i++) {
    ctx.beginPath();
    ctx.moveTo(i * GRID_SIZE, 0);
    ctx.lineTo(i * GRID_SIZE, gameCanvas.value.height);
    ctx.stroke();
  }

  // 绘制水平线
  for (let i = 0; i <= gridCount; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * GRID_SIZE);
    ctx.lineTo(gameCanvas.value.width, i * GRID_SIZE);
    ctx.stroke();
  }
}

// 绘制墙壁
function drawWalls() {
  if (!ctx || !gameCanvas.value) return;

  // 仅在困难模式下绘制墙壁
  if (gameMode.value === 'hard') {
    ctx.strokeStyle = WALL_COLOR;
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, gameCanvas.value.width, gameCanvas.value.height);
  }
}

// 绘制蛇
function drawSnake() {
  if (!ctx) return;

  // 绘制蛇身
  for (let i = 1; i < snake.length; i++) {
    ctx.fillStyle = SNAKE_COLOR;
    ctx.fillRect(snake[i].x * GRID_SIZE, snake[i].y * GRID_SIZE, GRID_SIZE, GRID_SIZE);

    // 绘制蛇身边框
    ctx.strokeStyle = '#388E3C';
    ctx.lineWidth = 1;
    ctx.strokeRect(snake[i].x * GRID_SIZE, snake[i].y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
  }

  // 绘制蛇头
  ctx.fillStyle = SNAKE_HEAD_COLOR;
  ctx.fillRect(snake[0].x * GRID_SIZE, snake[0].y * GRID_SIZE, GRID_SIZE, GRID_SIZE);

  // 绘制蛇头边框
  ctx.strokeStyle = '#1B5E20';
  ctx.lineWidth = 1;
  ctx.strokeRect(snake[0].x * GRID_SIZE, snake[0].y * GRID_SIZE, GRID_SIZE, GRID_SIZE);

  // 绘制蛇眼睛
  ctx.fillStyle = 'white';

  // 根据方向绘制眼睛
  const eyeSize = GRID_SIZE / 5;
  const eyeOffset = GRID_SIZE / 4;

  let leftEyeX, leftEyeY, rightEyeX, rightEyeY;

  switch (direction) {
    case 'up':
      leftEyeX = snake[0].x * GRID_SIZE + eyeOffset;
      leftEyeY = snake[0].y * GRID_SIZE + eyeOffset;
      rightEyeX = snake[0].x * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize;
      rightEyeY = snake[0].y * GRID_SIZE + eyeOffset;
      break;
    case 'down':
      leftEyeX = snake[0].x * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize;
      leftEyeY = snake[0].y * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize;
      rightEyeX = snake[0].x * GRID_SIZE + eyeOffset;
      rightEyeY = snake[0].y * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize;
      break;
    case 'left':
      leftEyeX = snake[0].x * GRID_SIZE + eyeOffset;
      leftEyeY = snake[0].y * GRID_SIZE + eyeOffset;
      rightEyeX = snake[0].x * GRID_SIZE + eyeOffset;
      rightEyeY = snake[0].y * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize;
      break;
    case 'right':
      leftEyeX = snake[0].x * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize;
      leftEyeY = snake[0].y * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize;
      rightEyeX = snake[0].x * GRID_SIZE + GRID_SIZE - eyeOffset - eyeSize;
      rightEyeY = snake[0].y * GRID_SIZE + eyeOffset;
      break;
  }

  ctx.fillRect(leftEyeX, leftEyeY, eyeSize, eyeSize);
  ctx.fillRect(rightEyeX, rightEyeY, eyeSize, eyeSize);
}

// 绘制食物
function drawFood() {
  if (!ctx || !food) return;

  // 绘制食物
  ctx.fillStyle = FOOD_COLOR;
  ctx.beginPath();
  ctx.arc(
    food.x * GRID_SIZE + GRID_SIZE / 2,
    food.y * GRID_SIZE + GRID_SIZE / 2,
    GRID_SIZE / 2 - 2,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // 绘制食物高光
  ctx.fillStyle = '#FFCDD2';
  ctx.beginPath();
  ctx.arc(
    food.x * GRID_SIZE + GRID_SIZE / 3,
    food.y * GRID_SIZE + GRID_SIZE / 3,
    GRID_SIZE / 6,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

// 绘制游戏说明
function drawInstructions() {
  if (!ctx || !gameCanvas.value) return;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, gameCanvas.value.width, gameCanvas.value.height);

  ctx.fillStyle = 'white';
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('按空格键开始游戏', gameCanvas.value.width / 2, gameCanvas.value.height / 2);

  ctx.font = '16px Arial';
  ctx.fillText('使用方向键或WASD控制蛇的移动', gameCanvas.value.width / 2, gameCanvas.value.height / 2 + 40);
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
}

.game-container {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 15px;
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
}

.game-header h1 {
  color: #333;
  font-size: 28px;
}

.score-container {
  display: flex;
  gap: 20px;
}

.current-score,
.high-score {
  background-color: #f8f8f8;
  padding: 10px 15px;
  border-radius: 5px;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.current-score {
  color: #4CAF50;
}

.high-score {
  color: #2196F3;
}

.game-area {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
  position: relative;
}

canvas {
  background-color: #f0f0f0;
  border-radius: 5px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  height: auto;
}

.game-controls {
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.control-group {
  background-color: #f8f8f8;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.control-group h3 {
  margin-bottom: 10px;
  color: #333;
  font-size: 18px;
}

.radio-group {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.radio-group label {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px 0;
}

.radio-group input[type="radio"] {
  margin-right: 10px;
}

.button-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.btn {
  padding: 12px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.primary-btn {
  background-color: #4CAF50;
  color: white;
  grid-column: span 2;
}

.primary-btn:hover {
  background-color: #45a049;
}

.secondary-btn {
  background-color: #f1f1f1;
  color: #333;
}

.secondary-btn:hover {
  background-color: #e0e0e0;
}

.secondary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.modal-content h2 {
  margin-bottom: 20px;
  color: #333;
}

.modal-content p {
  margin-bottom: 20px;
  font-size: 18px;
}

.modal-content ul {
  text-align: left;
  margin-bottom: 20px;
  padding-left: 20px;
}

.modal-content li {
  margin-bottom: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .game-area {
    flex-direction: column;
  }

  .game-controls {
    min-width: 100%;
  }

  .button-group {
    grid-template-columns: 1fr;
  }

  .primary-btn {
    grid-column: span 1;
  }
}
</style>