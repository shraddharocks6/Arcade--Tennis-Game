var canvas;
var canvasContext;

var ballX = 50;
var ballY = 50;
var ballSpeedX = 8;
var ballSpeedY = 4;

var playerOneScore = 0;
var playerTwoScore = 0;
const WINNING_SCORE = 1;

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

window.onload = () => {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");

  var framesPerSecond = 30;
  drawEverything();
  setInterval(() => {
    moveEverything();
    drawEverything();
  }, 1000 / framesPerSecond);

  canvas.addEventListener("mousemove", function (evt) {
    var mousePos = calculateMousePos(evt);
    paddleOneY = mousePos.y - PADDLE_HEIGHT / 2;
  });
};

function ballReset() {
  if (playerOneScore >= WINNING_SCORE || playerTwoScore >= WINNING_SCORE) {
    showWinScreen = true;
    playerOneScore = 0;
    playerTwoScore = 0;
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

function drawEverything() {
  if (showWinScreen == true) {
    canvasContext.fillText("CLICK TO CONTINUE", 350, 250);
    return;
  }
  //THE BLACK SCREEN
  colorRect(0, 0, canvas.width, canvas.height, "black");

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
  canvasContext.fillText(playerOneScore, 50, 50);
  canvasContext.fillText(playerTwoScore, canvas.width - 150, 50);
}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX, centerY, radius, color) {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}
