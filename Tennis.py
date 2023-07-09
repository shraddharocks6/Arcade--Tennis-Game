import pygame
import sys

# Pygame initialization
pygame.init()
screen_width, screen_height = 800, 600
screen = pygame.display.set_mode((screen_width, screen_height))
clock = pygame.time.Clock()
font = pygame.font.Font(None, 18)

# Game variables
ball_x = 50
ball_y = 50
ball_speed_x = 8
ball_speed_y = 4

player_one_score = 0
player_two_score = 0
winning_score = 5

show_win_screen = False

paddle_one_y = 200
paddle_two_y = 250
paddle_height = 75
paddle_thickness = 5

# Game loop
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Clear the screen
    screen.fill((0, 0, 0))

    if show_win_screen:
        # Display win screen
        win_text = "PLAYER WON!!" if player_one_score >= winning_score else "COMPUTER WON!!"
        continue_text = "CLICK TO CONTINUE"
        win_surface = font.render(win_text, True, (255, 255, 255))
        continue_surface = font.render(continue_text, True, (255, 255, 255))
        screen.blit(win_surface, (270, 250))
        screen.blit(continue_surface, (235, 300))

        if event.type == pygame.MOUSEBUTTONDOWN:
            # Reset scores and continue the game
            player_one_score = 0
            player_two_score = 0
            show_win_screen = False
    else:
        # Handle paddle movement
        mouse_pos = pygame.mouse.get_pos()
        paddle_one_y = mouse_pos[1] - paddle_height // 2

        # Update ball position
        ball_x += ball_speed_x
        ball_y += ball_speed_y

        # Check for paddle collisions
        if ball_x >= screen_width - 10:
            if paddle_two_y < ball_y < paddle_two_y + paddle_height:
                ball_speed_x *= -1
                delta_y = ball_y - (paddle_two_y + paddle_height // 2)
                ball_speed_y = delta_y * 0.4
            else:
                player_one_score += 1
                ball_x, ball_y = screen_width // 2, screen_height // 2
                ball_speed_x = -ball_speed_x
        elif ball_x < 10:
            if paddle_one_y < ball_y < paddle_one_y + paddle_height:
                ball_speed_x *= -1
                delta_y = ball_y - (paddle_one_y + paddle_height // 2)
                ball_speed_y = delta_y * 0.4
            else:
                player_two_score += 1
                ball_x, ball_y = screen_width // 2, screen_height // 2
                ball_speed_x = -ball_speed_x

        # Check for ball collision with top/bottom walls
        if ball_y >= screen_height or ball_y <= 0:
            ball_speed_y *= -1

        # Draw paddles
        pygame.draw.rect(screen, (255, 255, 255), (2, paddle_one_y, paddle_thickness, paddle_height))
        pygame.draw.rect(screen, (255, 255, 255), (screen_width - paddle_thickness - 7, paddle_two_y, paddle_thickness, paddle_height))

        # Draw ball
        pygame.draw.circle(screen, (255, 255, 255), (ball_x, ball_y), 10)

        # Draw net
        for i in range(0, screen_height, 40):
            pygame.draw.rect(screen, (255, 255, 255), (screen_width // 2 - 1, i, 2, 20))

        # Draw scores
        player_one_text = f"PLAYER: {player_one_score}"
        player_two_text = f"COMPUTER: {player_two_score}"
        player_one_surface = font.render(player_one_text, True, (255, 255, 255))
        player_two_surface = font.render(player_two_text, True, (255, 255, 255))
        screen.blit(player_one_surface, (50, 50))
        screen.blit(player_two_surface, (screen_width - 150, 50))

    pygame.display.flip()
    clock.tick(30)

pygame.quit()
sys.exit()
