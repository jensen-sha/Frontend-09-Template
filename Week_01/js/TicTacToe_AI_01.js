// 棋盘
let pattern = [
  [2, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
];

let chess = 1;

/** 渲染棋盘 */
function build() {
  // 获取棋盘元素
  let board = document.getElementById("board");

  board.innerHTML = "";

  // 填充棋盘
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");

      // 创建圆圈棋子
      let circle = document.createElement("i");
      circle.classList.add("iconfont", "icon-circle", "blue");
      // 创建叉叉棋子
      let cross = document.createElement("i");
      cross.classList.add("iconfont", "icon-cross", "purple");
      // 创建空棋子
      let empty = document.createElement("i");

      let chessIcon =
        pattern[y][x] == 2 ? cross : pattern[y][x] == 1 ? circle : empty;
      cell.appendChild(chessIcon);
      cell.addEventListener("click", () => move(x, y)); // 《 == 这里加入监听事件
      board.appendChild(cell);
    }
  }
}

/** 全局变量 —— 是否有赢家了 */
let hasWinner = false;

/**
 * 把棋子放入棋盘
 *
 *   - 先把当前棋子代号给予当前 x，y 位置的元素
 *   - 检测是否有棋子已经赢了
 *   - 反转上一个棋子的代号，并且重新渲染棋盘
 *
 * @param {Number} x x轴
 * @param {Number} y y轴
 */
function move(x, y) {
  if (hasWinner || pattern[y][x]) return;

  pattern[y][x] = chess;

  hasWinner = check(pattern, chess);
  if (hasWinner) {
    tips(chess == 2 ? "❌ is the winner!" : "⭕️ is the winner!");
  }

  chess = 3 - chess;

  build();

  if (hasWinner) return;

  // 这里加入了输赢预判
  if (willWin(pattern, chess)) {
    tips(chess == 2 ? "❌ is going to win!" : "⭕️ is going to win!");
  }
}

/**
 * 检查棋盘中的所有棋子
 *
 *  - 找出是否已经有棋子获胜了
 *  - 有三个棋子连成一线就属于赢了
 *
 * @param {Array} pattern 棋盘数据
 * @param {Number} chess 棋子代号
 * @return {Boolean}
 */
function check(pattern, chess) {
  // 首先检查所有横行
  for (let i = 0; i < 3; i++) {
    let win = true;
    for (let j = 0; j < 3; j++) {
      if (pattern[i][j] !== chess) win = false;
    }
    if (win) return true;
  }

  // 检查竖行
  for (let i = 0; i < 3; i++) {
    let win = true;
    for (let j = 0; j < 3; j++) {
      if (pattern[j][i] !== chess) win = false;
    }
    if (win) return true;
  }

  // 检查交叉行
  // 这里用花括号 "{}" 可以让 win 变量
  // 变成独立作用域的变量，不受外面的
  // win 变量影响

  // "反斜行 \ 检测"
  {
    let win = true;
    for (let j = 0; j < 3; j++) {
      if (pattern[j][j] !== chess) win = false;
    }
    if (win) return true;
  }

  // "正斜行 / 检测"
  {
    let win = true;
    for (let j = 0; j < 3; j++) {
      if (pattern[j][2 - j] !== chess) win = false;
    }
    if (win) return true;
  }

  return false;
}

/**
 * 插入提示
 * @param {String} message 提示文案
 */
function tips(message) {
  let tips = document.getElementById("tips");

  tips.innerHTML = "";

  let text = document.createElement("p");
  text.innerText = message;
  tips.appendChild(text);
}

/**
 * 检测当前棋子是否要赢了
 *
 *   - 循环整个棋盘
 *   - 跳过所有已经有棋子的格子
 *   - 克隆棋盘数据（因为我们要让下一个棋子都走一遍所有空位的地方
 *     看看会不会赢，如果直接在原来的棋盘上模拟，就会弄脏了数据）
 *   - 让当前棋子模拟走一下当前循环到的空位子
 *   - 然后检测是否会赢了
 *
 * @param {Array} pattern 棋盘数据
 * @param {Number} chess 棋子代号
 * @return {boolean}
 */
function willWin(pattern, chess) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (pattern[i][j]) continue;
      let tmp = clone(pattern);
      tmp[i][j] = chess;
      if (check(tmp, chess)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * 克隆棋盘数据
 * @param {Array} pattern 棋盘数据
 * @return {Array} 克隆出来的棋盘数据
 */
function clone(pattern) {
  return JSON.parse(JSON.stringify(pattern));
}

build();
