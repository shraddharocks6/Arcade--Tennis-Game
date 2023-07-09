import pygame
import numpy as np

# Define constants for the game
SCREEN_WIDTH = 640
SCREEN_HEIGHT = 480
PADDLE_WIDTH = 10
PADDLE_HEIGHT = 60
BALL_RADIUS = 10
PADDLE_SPEED = 5
BALL_SPEED_X = 3
BALL_SPEED_Y = 3
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

class TennisEnvironment:
    def __init__(self):
        self.state_dim = 4
        self.action_dim = 2
        self.max_steps = 1000  # Maximum number of steps per episode
        self.ball_speed_x = BALL_SPEED_X
        self.ball_speed_y = BALL_SPEED_Y
        self.paddle1_y = None
        self.paddle2_y = None
        self.ball_x = None
        self.ball_y = None
        self.steps = None

    def reset(self):
        # Initialize the environment and return the initial state
        self.paddle1_y = SCREEN_HEIGHT // 2 - PADDLE_HEIGHT // 2
        self.paddle2_y = SCREEN_HEIGHT // 2 - PADDLE_HEIGHT // 2
        self.ball_x = SCREEN_WIDTH // 2
        self.ball_y = SCREEN_HEIGHT // 2
        self.steps = 0
        return np.array([self.paddle1_y, self.paddle2_y, self.ball_x, self.ball_y])

    def step(self, action):
        # Take a step in the environment based on the given action and return the next state, reward, and done flag
        self.steps += 1

        # Update the paddle position based on the action
        if action == 0:  # Move up
            self.paddle1_y -= PADDLE_SPEED
        elif action == 1:  # Move down
            self.paddle1_y += PADDLE_SPEED

        # Update the paddle position based on the user's action
        # ...

        # Update the ball position
        self.ball_x += self.ball_speed_x
        self.ball_y += self.ball_speed_y

        # Check for collision with paddles
        # ...

        # Check for collision with walls
        # ...

        # Calculate reward based on the game state
        reward = self.calculate_reward()

        # Check if the episode is done
        done = self.check_done()

        # Return the next state, reward, and done flag
        next_state = np.array([self.paddle1_y, self.paddle2_y, self.ball_x, self.ball_y])
        return next_state, reward, done

    def calculate_reward(self):
        reward = 0
        if (
            PADDLE_WIDTH < self.ball_x < SCREEN_WIDTH - 2 * PADDLE_WIDTH
            and self.paddle1_y <= self.ball_y <= self.paddle1_y + PADDLE_HEIGHT
        ):
            reward = 1  # Positive reward for hitting the ball
        elif (
            self.ball_x < PADDLE_WIDTH
            and (self.paddle1_y > self.ball_y or self.ball_y > self.paddle1_y + PADDLE_HEIGHT)
        ):
            reward = -1  # Negative reward for missing the ball
        return reward

    def check_done(self):
        # Check if the episode is done
        # Implement the logic to check if the game is over
        # For example, you can end the episode after a certain number of steps
        return self.steps >= self.max_steps

class RLAgent:
    def __init__(self, state_dim, action_dim):
        self.state_dim = state_dim
        self.action_dim = action_dim
        self.q_values = np.zeros((state_dim, action_dim))
        self.learning_rate = 0.1  # Learning rate
        self.discount_factor = 0.99  # Discount factor
        self.epsilon = 0.1  # Epsilon-greedy exploration factor

    def select_action(self, state):
        # Select an action based on the current state using an epsilon-greedy exploration strategy
        if np.random.rand() < self.epsilon:
            return np.random.randint(self.action_dim)
        else:
            q_values_state = self.q_values[state]
            return np.argmax(q_values_state)

    def update(self, state, action, reward, next_state):
        # Update the agent's internal state and parameters based on the received state, action, reward, and next state
        # Update the Q-values using the Q-learning update rule
        q_value = self.q_values[state, action]
        max_q_value = np.max(self.q_values[next_state])
        td_target = reward + self.discount_factor * max_q_value
        td_error = td_target - q_value
        self.q_values[state, action] += self.learning_rate * td_error

# Create the tennis environment and RL agent
env = TennisEnvironment()
agent = RLAgent(env.state_dim, env.action_dim)

# Initialize the game
pygame.init()
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
clock = pygame.time.Clock()

# Game loop
running = True
episode_reward = 0
episode_steps = 0
user_action = None
state = env.reset()
paddle1_y, paddle2_y, ball_x, ball_y = state
ball_speed_x = BALL_SPEED_X
ball_speed_y = BALL_SPEED_Y

while running:
    # Handle events
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_UP:
                user_action = 0  # User action: Move up
            elif event.key == pygame.K_DOWN:
                user_action = 1  # User action: Move down

    # Select an action based on the current state
    agent_action = agent.select_action(state)

    # Update the paddle position based on the agent's action
    if agent_action == 0:  # Move up
        paddle1_y -= PADDLE_SPEED
    elif agent_action == 1:  # Move down
        paddle1_y += PADDLE_SPEED

    # Update the paddle position based on the user's action
    if user_action == 0:  # Move up
        paddle1_y -= PADDLE_SPEED
    elif user_action == 1:  # Move down
        paddle1_y += PADDLE_SPEED
    user_action = None

    # Update the ball position
    ball_x += ball_speed_x
    ball_y += ball_speed_y

    # Check for collision with paddles
    if ball_x <= PADDLE_WIDTH and paddle1_y <= ball_y <= paddle1_y + PADDLE_HEIGHT:
        ball_speed_x *= -1
    elif ball_x >= SCREEN_WIDTH - PADDLE_WIDTH - BALL_RADIUS and paddle2_y <= ball_y <= paddle2_y + PADDLE_HEIGHT:
        ball_speed_x *= -1

    # Check for collision with walls
    if ball_y <= 0 or ball_y >= SCREEN_HEIGHT - BALL_RADIUS:
        ball_speed_y *= -1

    # Calculate reward based on the game state
    reward = env.calculate_reward()

    #Update the agent with the reward and next state
    next_state, _, done = env.step(agent_action)
    agent.update(state, agent_action, reward, next_state)

    # Update the episode reward and steps
    episode_reward += reward
    episode_steps += 1

    # Check if the episode is done
    if done:
        # Print the episode stats
        print(f"Episode Reward: {episode_reward}, Episode Steps: {episode_steps}")

        # Reset the game and episode stats
        state = env.reset()
        paddle1_y, paddle2_y, ball_x, ball_y = state
        ball_speed_x = BALL_SPEED_X
        ball_speed_y = BALL_SPEED_Y
        episode_reward = 0
        episode_steps = 0

    # Update the screen
    screen.fill(BLACK)
    pygame.draw.rect(screen, WHITE, (PADDLE_WIDTH, paddle1_y, PADDLE_WIDTH, PADDLE_HEIGHT))
    pygame.draw.rect(screen, WHITE, (SCREEN_WIDTH - 2 * PADDLE_WIDTH, paddle2_y, PADDLE_WIDTH, PADDLE_HEIGHT))
    pygame.draw.circle(screen, WHITE, (ball_x, ball_y), BALL_RADIUS)
    pygame.display.flip()
    clock.tick(60)

pygame.quit()
