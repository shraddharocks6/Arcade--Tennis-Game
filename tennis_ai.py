import gym
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.optimizers import Adam
import tensorflow as tf

# Set TensorFlow GPU memory growth to optimize GPU memory allocation
gpus = tf.config.experimental.list_physical_devices('GPU')
if gpus:
    try:
        for gpu in gpus:
            tf.config.experimental.set_memory_growth(gpu, True)
    except RuntimeError as e:
        print(e)

# Define the tennis game environment
env = gym.make("tennis-v0")
num_actions = env.action_space.n

# Define the DQN model
model = Sequential([
    Dense(16, activation='relu', input_shape=(env.observation_space.shape[0],)),
    Dense(16, activation='relu'),
    Dense(num_actions, activation='linear')
])
model.compile(loss="mse", optimizer=Adam(learning_rate=0.0001))

# Define the opponent model
opponent_model = Sequential([
    Dense(16, activation='relu', input_shape=(env.observation_space.shape[0],)),
    Dense(16, activation='relu'),
    Dense(num_actions, activation='linear')
])
opponent_model.compile(loss="mse", optimizer=Adam(learning_rate=0.0001))

# Define the replay memory
replay_memory_size = 10000
replay_memory = []

# Define hyperparameters
num_episodes = 1000
epsilon = 1.0
epsilon_decay = 0.995
epsilon_min = 0.01
batch_size = 32
gamma = 0.99

# Define variables for lightweight resource usage
target_network_update_freq = 10
target_network_counter = 0

# Define the training loop
for episode in range(num_episodes):
    state = env.reset()
    done = False
    total_reward = 0

    while not done:
        if np.random.rand() <= epsilon:
            action = np.random.randint(num_actions)
        else:
            q_values = model.predict_on_batch(np.expand_dims(state, axis=0))
            action = np.argmax(q_values[0])

        next_state, reward, done, _ = env.step(action)
        total_reward += reward

        replay_memory.append((state, action, reward, next_state, done))
        if len(replay_memory) > replay_memory_size:
            replay_memory.pop(0)

        if len(replay_memory) > batch_size:
            batch_indices = np.random.choice(len(replay_memory), size=batch_size, replace=False)
            batch = [replay_memory[i] for i in batch_indices]

            states = np.array([transition[0] for transition in batch])
            actions = np.array([transition[1] for transition in batch])
            rewards = np.array([transition[2] for transition in batch])
            next_states = np.array([transition[3] for transition in batch])
            dones = np.array([transition[4] for transition in batch])

            q_values_next = opponent_model.predict_on_batch(next_states)
            targets = rewards + gamma * np.max(q_values_next, axis=1) * (1 - dones)

            q_values = model.predict_on_batch(states)
            q_values[np.arange(len(actions)), actions] = targets

            model.train_on_batch(states, q_values)

        state = next_state

        # Update the target network with the model's weights
        target_network_counter += 1
        if target_network_counter % target_network_update_freq == 0:
            opponent_model.set_weights(model.get_weights())

    epsilon *= epsilon_decay
    epsilon = max(epsilon, epsilon_min)

    print(f"Episode: {episode+1}, Total Reward: {total_reward}")

# Save the trained model
model.save("tennis_ai_model.h5")
