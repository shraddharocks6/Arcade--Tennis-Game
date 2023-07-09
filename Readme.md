# Arcade--Tennis-Game
# The native application for play...
The branch consists of tennis game in Java which could be used for building and playing with the Jar application.
The following command could be used for building the jar.
```
javac -cp lib/* src/com/tennisgame/*.java -d build
jar cfm TennisGame.jar Manifest.txt -C build .
```
Run the following command to start the game:
```
java -jar TennisGame.jar
```