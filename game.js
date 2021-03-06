var canvas;
var context;

var ballX = 50;
var ballY = 50;
var ballSpeedX = 8;
var ballSpeedY = 4;

var playerOneScore = 0;
var playerTwoScore = 0;
const WINNING_SCORE = 5;

var showWinScreen = false;

var paddleOneY = 200;
var paddleTwoY = 250;
const PADDLE_HEIGHT = 75;
const PADDLE_THICKNESS = 5;

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
}

function handelMouseClick(evt) {
  if (showWinScreen) {
    playerOneScore = 0;
    playerTwoScore = 0;
    showWinScreen = false;
  }
}

window.onload = () => {
  canvas = document.getElementById("gameCanvas");
  context = canvas.getContext("2d");

  var framesPerSecond = 30;
  drawEverything();
  setInterval(() => {
    moveEverything();
    drawEverything();
  }, 1000 / framesPerSecond);

  canvas.addEventListener("mousedown", handelMouseClick);

  canvas.addEventListener("mousemove", function (evt) {
    var mousePos = calculateMousePos(evt);
    paddleOneY = mousePos.y - PADDLE_HEIGHT / 2;
  });
};

function ballReset() {
  if (playerOneScore >= WINNING_SCORE || playerTwoScore >= WINNING_SCORE) {
    showWinScreen = true;
  }
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
}

function computerMovement() {
  var paddleTwoYCenter = paddleTwoY + PADDLE_HEIGHT / 2;
  if (paddleTwoYCenter < ballY - PADDLE_HEIGHT / 3) {
    paddleTwoY += 6;
  } else if (paddleTwoYCenter > ballY + PADDLE_HEIGHT / 3) {
    paddleTwoY -= 6;
  }
}

function moveEverything() {
  if (showWinScreen == true) {
    return;
  }
  computerMovement();
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX >= canvas.width - 10) {
    if (ballY > paddleTwoY && ballY < paddleTwoY + PADDLE_HEIGHT) {
      ballSpeedX *= -1;

      let deltaY = ballY - (paddleTwoY + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.4;
    } else {
      playerOneScore++;
      ballReset();
    }
  }
  if (ballX < 10) {
    if (ballY > paddleOneY && ballY < paddleOneY + PADDLE_HEIGHT) {
      ballSpeedX *= -1;

      let deltaY = ballY - (paddleOneY + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.4;
    } else {
      playerTwoScore++;
      ballReset();
    }
  }
  if (ballY >= canvas.height || ballY <= 0) {
    ballSpeedY *= -1;
  }
}

function drawNet() {
  for (let i = 0; i < canvas.height; i += 40)
    colorRect(canvas.width / 2 - 1, i, 2, 20, "white");
}

function drawEverything() {
  if (showWinScreen == true) {
    context.font = "18pt Ariel";

    for (let i = 0; i < canvas.height; i += 40)
      colorRect(canvas.width / 2 - 1, i, 2, 20, "black");

    context.fillStyle = "white";

    if (playerOneScore >= WINNING_SCORE) {
      context.fillText("P L A Y E R  W O N !!", 270, 250);
    } else if (playerTwoScore >= WINNING_SCORE) {
      context.fillText("C O M P U T E R  W O N !!", 255, 250);
    }
    context.fillText("C L I C K  T O  C O N T I N U E", 235, 300);
    return;
  }
  //THE BLACK SCREEN
  colorRect(0, 0, canvas.width, canvas.height, "black");

  //THE NET
  drawNet();

  //LEFT PLAYER PADDLE
  colorRect(2, paddleOneY, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");

  //RIGHT PLAYER PADDLE
  colorRect(
    canvas.width - 7,
    paddleTwoY,
    PADDLE_THICKNESS,
    PADDLE_HEIGHT,
    "white"
  );

  //THE BALL
  colorCircle(ballX, ballY, 10, "white");

  //SCORING
  context.font = "12pt Ariel";
  context.fillText("PLAYER : " + playerOneScore, 50, 50);
  context.fillText("COMPUTER : " + playerTwoScore, canvas.width - 150, 50);
}

function colorRect(leftX, topY, width, height, drawColor) {
  context.fillStyle = drawColor;
  context.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX, centerY, radius, color) {
  context.fillStyle = color;
  context.beginPath();
  context.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  context.fill();
}
