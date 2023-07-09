import React, { useEffect, useRef, useState } from 'react';

const Game = () => {
  const canvasRef = useRef(null);
  const [paddle1Y, setPaddle1Y] = useState(200);
  const [paddle2Y, setPaddle2Y] = useState(200);
  const [ballX, setBallX] = useState(50);
  const [ballY, setBallY] = useState(50);
  const [ballSpeedX, setBallSpeedX] = useState(4);
  const [ballSpeedY, setBallSpeedY] = useState(4);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [showWinScreen, setShowWinScreen] = useState(false);
  const PADDLE_HEIGHT = 80;
  const PADDLE_THICKNESS = 10;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const calculateMousePos = (evt) => {
      const rect = canvas.getBoundingClientRect();
      const root = document.documentElement;
      const mouseX = evt.clientX - rect.left - root.scrollLeft;
      const mouseY = evt.clientY - rect.top - root.scrollTop;
      return { x: mouseX, y: mouseY };
    };

    const handleMouseClick = () => {
      if (showWinScreen) {
        setPlayerScore(0);
        setComputerScore(0);
        setShowWinScreen(false);
      }
    };

    const handleMouseMove = (evt) => {
      const { y } = calculateMousePos(evt);
      setPaddle1Y(y - PADDLE_HEIGHT / 2);
    };

    const computerMovement = () => {
      const paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;
      if (paddle2YCenter < ballY - 35) {
        setPaddle2Y(paddle2Y + 4);
      } else if (paddle2YCenter > ballY + 35) {
        setPaddle2Y(paddle2Y - 4);
      }
    };

    const moveEverything = () => {
      if (showWinScreen) return;

      computerMovement();

      setBallX(ballX + ballSpeedX);
      setBallY(ballY + ballSpeedY);

      if (ballX <= PADDLE_THICKNESS) {
        if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
          setBallSpeedX(-ballSpeedX);

          const deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
          setBallSpeedY(deltaY * 0.35);
        } else {
          setComputerScore(computerScore + 1);
          resetBall();
        }
      }

      if (ballX >= canvas.width - PADDLE_THICKNESS) {
        if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
          setBallSpeedX(-ballSpeedX);

          const deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
          setBallSpeedY(deltaY * 0.35);
        } else {
          setPlayerScore(playerScore + 1);
          resetBall();
        }
      }

      if (ballY >= canvas.height || ballY <= 0) {
        setBallSpeedY(-ballSpeedY);
      }
    };

    const resetBall = () => {
      setBallX(canvas.width / 2);
      setBallY(canvas.height / 2);
      setBallSpeedX(-ballSpeedX);
      setBallSpeedY(4);
    };

    const drawNet = () => {
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.fillRect(canvas.width / 2 - 1, i, 2, 20);
      }
    };

    const drawEverything = () => {
      // Background
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (showWinScreen) {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';

        if (playerScore >= 5) {
          ctx.fillText('Player Wins!', 300, canvas.height / 2 - 50);
        } else if (computerScore >= 5) {
          ctx.fillText('Computer Wins!', 290, canvas.height / 2 - 50);
        }

        ctx.font = '20px Arial';
        ctx.fillText('Click to Continue', 350, canvas.height / 2 + 50);
        return;
      }

      // Draw net
      drawNet();

      // Left paddle (player)
      ctx.fillStyle = 'white';
      ctx.fillRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT);

      // Right paddle (computer)
      ctx.fillStyle = 'white';
      ctx.fillRect(
        canvas.width - PADDLE_THICKNESS,
        paddle2Y,
        PADDLE_THICKNESS,
        PADDLE_HEIGHT
      );

      // Ball
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(ballX, ballY, 8, 0, Math.PI * 2, true);
      ctx.fill();

      // Scores
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.fillText(`Player: ${playerScore}`, 50, 50);
      ctx.fillText(`Computer: ${computerScore}`, canvas.width - 150, 50);
    };

    const framesPerSecond = 60;
    const interval = setInterval(() => {
      moveEverything();
      drawEverything();
    }, 1000 / framesPerSecond);

    return () => clearInterval(interval);
  }, []);

  return (
    <canvas
      id="gameCanvas"
      ref={canvasRef}
      width={800}
      height={400}
      style={{ border: '1px solid #000' }}
    />
  );
};

export default Game;