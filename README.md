# 2048 Game - JavaScript Implementation

This repository contains a JavaScript implementation of the classic 2048 puzzle game. The game board is a 4x4 grid where players combine numbered tiles by moving them in one of four directions: left, right, up, or down. When two tiles of the same number collide, they merge into one tile with the sum of their values. The goal of the game is to create a tile with the value of 2048.

## Features

- **Game Board**: A 4x4 grid initialized with two random tiles (either 2 or 4).
- **Move Mechanism**: Players can move tiles in four directions: up, down, left, and right. Tiles will merge when they collide with another tile of the same number.
- **Random Tile Addition**: After each move, a new tile (either 2 or 4) is added to a random empty cell.
- **Win Condition**: The player wins when a tile with the number 2048 is created.
- **Lose Condition**: The game is lost when there are no empty cells and no possible merges left.
- **Score Tracking**: The score is tracked based on the values of merged tiles.

## Installation

To run this game locally:

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/2048-game.git
   cd 2048-game
2. Install the necessary dependencies:
   ```bash
    npm install
3. Run the game in a JavaScript runtime or integrate it into a frontend.

## Running Tests

To ensure that the game logic works correctly, unit tests can be written (currently not included in this version).

## Contributing

Contributions are welcome! If you have suggestions or improvements, please follow these steps:

1. **Fork the Repository**.
2. **Create a New Branch**:
    ```bash
    git checkout -b feature/your-feature-name
    ```
3. **Make Your Changes**.
4. **Commit Your Changes**:
    ```bash
    git commit -am 'Add new feature or fix'
    ```
5. **Push to the Branch**:
    ```bash
    git push origin feature/your-feature-name
    ```
6. **Create a Pull Request**.

## Contact

For any questions or further information, please contact:

- **Author**: Artem Brui
- **Email**: [artembryj@gmail.com](mailto:artembryj@gmail.com)



Enjoy the game! 🎮




