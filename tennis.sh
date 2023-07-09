#!/bin/bash

# Tennis Game in Bash

# Terminal dimensions
WIDTH=$(tput cols)
HEIGHT=$(tput lines)

# Paddle variables
PADDLE_WIDTH=10
PADDLE_HEIGHT=4
PADDLE1_X=5
PADDLE2_X=$((WIDTH - PADDLE_WIDTH - 5))
PADDLE1_Y=$((HEIGHT / 2 - PADDLE_HEIGHT / 2))
PADDLE2_Y=$((HEIGHT / 2 - PADDLE_HEIGHT / 2))
PADDLE_SPEED=2

# Ball variables
BALL_X=$((WIDTH / 2))
BALL_Y=$((HEIGHT / 2))
BALL_X_SPEED=-1
BALL_Y_SPEED=-1

# Game loop
while true; do
    clear

    # Draw paddles
    for ((i = 0; i < PADDLE_HEIGHT; i++)); do
        tput cup $((PADDLE1_Y + i)) $PADDLE1_X
        printf "=========="
        tput cup $((PADDLE2_Y + i)) $PADDLE2_X
        printf "=========="
    done

    # Draw ball
    tput cup $BALL_Y $BALL_X
    printf "O"

    # Check keyboard input
    read -s -n 1 key
    case "$key" in
        "w")
            if ((PADDLE1_Y > 1)); then
                PADDLE1_Y=$((PADDLE1_Y - PADDLE_SPEED))
            fi
            ;;
        "s")
            if ((PADDLE1_Y + PADDLE_HEIGHT < HEIGHT - 1)); then
                PADDLE1_Y=$((PADDLE1_Y + PADDLE_SPEED))
            fi
            ;;
        "i")
            if ((PADDLE2_Y > 1)); then
                PADDLE2_Y=$((PADDLE2_Y - PADDLE_SPEED))
            fi
            ;;
        "k")
            if ((PADDLE2_Y + PADDLE_HEIGHT < HEIGHT - 1)); then
                PADDLE2_Y=$((PADDLE2_Y + PADDLE_SPEED))
            fi
            ;;
        "x")
            exit 0
            ;;
    esac

    # Update ball position
    BALL_X=$((BALL_X + BALL_X_SPEED))
    BALL_Y=$((BALL_Y + BALL_Y_SPEED))

    # Ball collision with paddles
    if ((BALL_X <= PADDLE1_X + PADDLE_WIDTH && BALL_Y >= PADDLE1_Y && BALL_Y < PADDLE1_Y + PADDLE_HEIGHT)); then
        BALL_X_SPEED=1
    elif ((BALL_X >= PADDLE2_X && BALL_Y >= PADDLE2_Y && BALL_Y < PADDLE2_Y + PADDLE_HEIGHT)); then
        BALL_X_SPEED=-1
    fi

    # Ball collision with top/bottom walls
    if ((BALL_Y <= 0 || BALL_Y >= HEIGHT - 1)); then
        BALL_Y_SPEED=$((BALL_Y_SPEED * -1))
    fi

    # Ball goes out of bounds (score point)
    if ((BALL_X <= 0 || BALL_X >= WIDTH - 1)); then
        BALL_X=$((WIDTH / 2))
        BALL_Y=$((HEIGHT / 2))
    fi

    sleep 0.02
done
