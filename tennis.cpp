#include <iostream>
#include <conio.h>
#include <windows.h>

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

    while (!gameOver) {
        system("cls");

        gotoxy(ballX, ballY);
        std::cout << "O";

        for (int i = paddle1Y - 2; i <= paddle1Y + 2; i++) {
            gotoxy(2, i);
            std::cout << "|";
        }

        for (int i = paddle2Y - 2; i <= paddle2Y + 2; i++) {
            gotoxy(77, i);
            std::cout << "|";
        }

        gotoxy(35, 2);
        std::cout << "Player Score: " << playerScore;

        gotoxy(35, 3);
        std::cout << "Computer Score: " << computerScore;

        ballX += ballSpeedX;
        ballY += ballSpeedY;

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

        if (_kbhit()) {
            char key = _getch();
            if (key == 'w' && paddle1Y > 3)
                paddle1Y--;
            if (key == 's' && paddle1Y < 20)
                paddle1Y++;
        }

        if (paddle2Y < ballY && paddle2Y < 20)
            paddle2Y++;
        if (paddle2Y > ballY && paddle2Y > 3)
            paddle2Y--;

        if (playerScore == 5 || computerScore == 5)
            gameOver = 1;

        Sleep(50);
    }

    system("cls");
    gotoxy(35, 12);
    std::cout << "GAME OVER";

    if (playerScore == 5) {
        gotoxy(35, 14);
        std::cout << "You win!";
    } else {
        gotoxy(35, 14);
        std::cout << "Computer wins!";
    }

    return 0;
}
