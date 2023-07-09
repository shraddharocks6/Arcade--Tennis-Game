<?php
// Handle score update
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $score = $_POST['score'];
    // Save the score data or perform any desired action
    // ...
    exit();
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Tennis Game</title>
    <style>
        #game {
            border: 1px solid #000;
            display: block;
            margin: 20px auto;
        }
    </style>
</head>
<body>
    <canvas id="game" width="800" height="400"></canvas>
    <script>
        // JavaScript game logic
        var canvas = document.getElementById('game');
        var context = canvas.getContext('2d');
        var paddleWidth = 10;
        var paddleHeight = 60;
        var paddleSpeed = 5;
        var ballRadius = 10;
        var ballSpeedX = 3;
        var ballSpeedY = 3;
        var paddle1Y = canvas.height / 2 - paddleHeight / 2;
        var paddle2Y = canvas.height / 2 - paddleHeight / 2;
        var ballX = canvas.width / 2;
        var ballY = canvas.height / 2;
        var score = 0;

        function update() {
            // Clear the canvas
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Update paddle positions
            if (paddle1UpPressed) {
                paddle1Y -= paddleSpeed;
            } else if (paddle1DownPressed) {
                paddle1Y += paddleSpeed;
            }

            // Update ball position
            ballX += ballSpeedX;
            ballY += ballSpeedY;

            // Check for collision with paddles
            if (ballX <= paddleWidth && paddle1Y <= ballY && ballY <= paddle1Y + paddleHeight) {
                ballSpeedX *= -1;
                score++;
            } else if (ballX >= canvas.width - paddleWidth - ballRadius && paddle2Y <= ballY && ballY <= paddle2Y + paddleHeight) {
                ballSpeedX *= -1;
                score++;
            }

            // Check for collision with walls
            if (ballY <= 0 || ballY >= canvas.height - ballRadius) {
                ballSpeedY *= -1;
            }

            // Draw paddles
            context.fillRect(paddleWidth, paddle1Y, paddleWidth, paddleHeight);
            context.fillRect(canvas.width - 2 * paddleWidth, paddle2Y, paddleWidth, paddleHeight);

            // Draw ball
            context.beginPath();
            context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
            context.fill();
            context.closePath();

            // Update score
            document.getElementById('score').innerHTML = 'Score: ' + score;

            requestAnimationFrame(update);
        }

        // Keyboard event listeners
        var paddle1UpPressed = false;
        var paddle1DownPressed = false;

        document.addEventListener('keydown', function (event) {
            if (event.key === 'w') {
                paddle1UpPressed = true;
            } else if (event.key === 's') {
                paddle1DownPressed = true;
            }
        });

        document.addEventListener('keyup', function (event) {
            if (event.key === 'w') {
                paddle1UpPressed = false;
            } else if (event.key === 's') {
                paddle1DownPressed = false;
            }
        });

        // Start the game
        update();
    </script>
    <div id="score">Score: 0</div>
</body>
</html>
