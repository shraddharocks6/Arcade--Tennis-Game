# Arcade--Tennis-Game
# The native application for play...
* The branch consists of 'tennis.c' and 'tennis.cpp' which could be executed by the terminal by entering
```
gcc tennis.c -o tennis
```
and
```
g++ tennis.cpp -o tennis

```
This command will generate an executable file named "tennis" (or "tennis.exe" on Windows).

Run the compiled program by executing the generated file:
```
./tennis
```
On Windows, use tennis.exe instead:

    The tennis game should start running in the terminal. Use the 'w' and 's' keys to move the paddle up and down, respectively. The game will continue until one player reaches a score of 5, at which point the game will display the winner and end.

Please note that this code uses Windows-specific functions like conio.h and windows.h for console manipulation. If you are using a different operating system, the code may need modifications to work properly.