#include <stdio.h>
#include <stdlib.h>
#include <conio.h>
#include <windows.h>

// Function to set the position of the cursor in the console window
void gotoxy(int x, int y) {
    COORD coord;
    coord.X = x;
    coord.Y = y;
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), coord);
}

int main() {
    int ballX = 30;
    int ballY = 15;
    int ballSpeedX = -1;
    int ballSpeedY = -1;

    int paddle1Y = 12;
    int paddle2Y = 12;

    int playerScore = 0;
    int computerScore = 0;

    int gameOver = 0;

    // Infinite loop for game logic
    while (!gameOver) {
        // Clear the console
        system("cls");

        // Draw the game elements
        // Draw the ball
        gotoxy(ballX, ballY);
        printf("O");

        // Draw the paddles
        for (int i = paddle1Y - 2; i <= paddle1Y + 2; i++) {
            gotoxy(2, i);
            printf("|");
        }

        for (int i = paddle2Y - 2; i <= paddle2Y + 2; i++) {
            gotoxy(77, i);
            printf("|");
        }

        // Print the scores
        gotoxy(35, 2);
        printf("Player Score: %d", playerScore);

        gotoxy(35, 3);
        printf("Computer Score: %d", computerScore);

        // Move the ball
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // Collision detection
        if (ballY <= 0 || ballY >= 23)
            ballSpeedY = -ballSpeedY;

        if (ballX <= 2 && (ballY >= paddle1Y - 2 && ballY <= paddle1Y + 2)) {
            ballSpeedX = -ballSpeedX;
            playerScore++;
        }

        if (ballX >= 77 && (ballY >= paddle2Y - 2 && ballY <= paddle2Y + 2)) {
            ballSpeedX = -ballSpeedX;
            computerScore++;
        }

        // Move the paddle
        if (_kbhit()) {
            char key = _getch();
            if (key == 'w' && paddle1Y > 3)
                paddle1Y--;
            if (key == 's' && paddle1Y < 20)
                paddle1Y++;
        }

        // AI for computer paddle
        if (paddle2Y < ballY && paddle2Y < 20)
            paddle2Y++;
        if (paddle2Y > ballY && paddle2Y > 3)
            paddle2Y--;

        // Check for game over condition
        if (playerScore == 5 || computerScore == 5)
            gameOver = 1;

        // Delay to control the game speed
        Sleep(50);
    }

    // Print the winner
    system("cls");
    gotoxy(35, 12);
    printf("GAME OVER");

    if (playerScore == 5) {
        gotoxy(35, 14);
        printf("You win!");
    } else {
        gotoxy(35, 14);
        printf("Computer wins!");
    }

    return 0;
}
