export default class Game {
  constructor(
    initialState = [
      [
        { value: 0, merged: false },
        { value: 0, merged: false },
        { value: 0, merged: false },
        { value: 0, merged: false },
      ],
      [
        { value: 0, merged: false },
        { value: 0, merged: false },
        { value: 0, merged: false },
        { value: 0, merged: false },
      ],
      [
        { value: 0, merged: false },
        { value: 0, merged: false },
        { value: 0, merged: false },
        { value: 0, merged: false },
      ],
      [
        { value: 0, merged: false },
        { value: 0, merged: false },
        { value: 0, merged: false },
        { value: 0, merged: false },
      ],
    ]
  ) {
    this.directions = {
      right: "right",
      left: "left",
      up: "up",
      down: "down",
    };

    this.status = {
      idle: "idle",
      playing: "playing",
      win: "win",
      lose: "lose",
    };
    this.copyBoard = (board) => {
      const copy = JSON.stringify(board);
      return JSON.parse(copy);
    };

    this.initialState = this.copyBoard(initialState);
    this.state = this.copyBoard(initialState);
    this.currentStatus = this.status.idle;
    this.lastRandomZeroIndex = 0;
    this.score = 0;
    this.storageKey = "game2048score";

    this.goThroughCells = (board, callback) =>
      board.map((row) =>
        row.map((n) => {
          return {
            ...n,
            value: callback(n),
          };
        })
      );

    this.getRandomZeroSerialNumber = (zeros) => {
      let randomNumber;

      if (zeros > 1) {
        const getRandomNumber = () => Math.floor(Math.random() * zeros + 1);

        do {
          randomNumber = getRandomNumber();
        } while (randomNumber === this.lastRandomZeroIndex);
      }

      this.lastRandomZeroIndex = randomNumber;

      return zeros === 1 ? 1 : randomNumber;
    };

    this.getNumberToAdd = (ProbabilityOfFour) => {
      const random = Math.random() * 100 + 1;

      return random < ProbabilityOfFour ? 4 : 2;
    };

    this.getZerosAmount = (board) => {
      return board.flat().filter((number) => number.value === 0).length;
    };

    this.addNumbersToBoard = (numbersAmount = 1) => {
      let updatedBoard = this.copyBoard(this.state);

      const addOneNumber = (board) => {
        if (this.getZerosAmount(board) > 0) {
          const numberToAdd = this.getNumberToAdd(10);
          const zerosAmount = this.getZerosAmount(board);

          const randomIndex = this.getRandomZeroSerialNumber(zerosAmount);
          let indexCounter = 0;

          updatedBoard = this.goThroughCells(board, (n) => {
            if (n.value === 0) {
              indexCounter++;
            }

            return randomIndex === indexCounter && n.value === 0
              ? numberToAdd
              : n.value;
          });

          return updatedBoard;
        }
      };

      for (let i = 0; i < numbersAmount; i++) {
        const updatedBoardCopy = this.copyBoard(updatedBoard);

        updatedBoard = addOneNumber(updatedBoardCopy);
      }

      return updatedBoard;
    };

    this.moveValues = (direction) => {
      const turnDirection = (arr) => {
        return arr[0].map((_n, rowIndex) => arr.map((num) => num[rowIndex]));
      };

      const isVertical =
        direction === this.directions.up || direction === this.directions.down;
      const isRightDownDirection =
        direction === this.directions.right ||
        direction === this.directions.down;

      const arrayToMove = isVertical
        ? turnDirection(this.copyBoard(this.state))
        : this.copyBoard(this.state);

      const movedArray = arrayToMove.map((row) => {
        const values = isRightDownDirection
          ? row.filter((cell) => cell.value !== 0).reverse()
          : row.filter((cell) => cell.value !== 0);

        for (let i = 0; i < values.length; i++) {
          if (
            values[i + 1] !== undefined &&
            values[i].value === values[i + 1].value &&
            values[i].value !== 0
          ) {
            values[i + 1].value = 0;
            values[i].value *= 2;
            values[i].merged = true;

            this.score += values[i].value;
          }
        }

        const mergedValues = isRightDownDirection
          ? values.filter((cell) => cell.value !== 0).reverse()
          : values.filter((cell) => cell.value !== 0);

        const zeros = new Array(4 - mergedValues.length).fill({
          value: 0,
          merged: false,
        });

        return isRightDownDirection
          ? [...zeros, ...mergedValues]
          : [...mergedValues, ...zeros];
      });

      return isVertical ? turnDirection(movedArray) : movedArray;
    };

    this.canVerticalMerge = () => {
      let isPossible = false;

      this.state.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
          let canVerticalMerge;

          if (rowIndex < this.state.length - 1) {
            canVerticalMerge =
              cell.value === this.state[rowIndex + 1][cellIndex].value;
          }

          if (canVerticalMerge) {
            isPossible = true;
          }
        });
      });

      return isPossible;
    };

    this.canHorizontalMerge = () => {
      let isPossible = false;

      this.state.forEach((row) => {
        row.forEach((cell, cellIndex) => {
          let canHorizontalMerge;

          if (cellIndex < row.length - 1) {
            canHorizontalMerge = cell.value === row[cellIndex + 1].value;
          }

          if (canHorizontalMerge) {
            isPossible = true;
          }
        });
      });

      return isPossible;
    };

    this.isEquelToState = (board) => {
      const currentBoard = this.state;

      return currentBoard.every((row, rowIndex) => {
        return row.every((cell, cellIndex) => {
          return cell.value === board[rowIndex][cellIndex].value;
        });
      });
    };
  }

  moveLeft() {
    const boardAfterMoving = this.moveValues(this.directions.left);

    const canMove =
      this.currentStatus === "playing" &&
      !this.isEquelToState(boardAfterMoving);

    if (canMove) {
      this.state = boardAfterMoving;
      this.state = this.addNumbersToBoard(1);
    }
  }
  moveRight() {
    const boardAfterMoving = this.moveValues(this.directions.right);

    const canMove =
      this.currentStatus === "playing" &&
      !this.isEquelToState(boardAfterMoving);

    if (canMove) {
      this.state = boardAfterMoving;
      this.state = this.addNumbersToBoard(1);
    }
  }

  moveUp() {
    const boardAfterMoving = this.moveValues(this.directions.up);

    const canMove =
      this.currentStatus === "playing" &&
      !this.isEquelToState(boardAfterMoving);

    if (canMove) {
      this.state = boardAfterMoving;
      this.state = this.addNumbersToBoard(1);
    }
  }
  moveDown() {
    const boardAfterMoving = this.moveValues(this.directions.down);

    const canMove =
      this.currentStatus === "playing" &&
      !this.isEquelToState(boardAfterMoving);

    if (canMove) {
      this.state = boardAfterMoving;
      this.state = this.addNumbersToBoard(1);
    }
  }
  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    let isWin = false;
    let currentStatus = this.currentStatus;
    const zerosAmount = this.getZerosAmount(this.state);
    const isMovementExist =
      this.canVerticalMerge() || this.canHorizontalMerge();

    this.state.forEach((row) => {
      row.forEach((cell) => {
        if (cell.value === 2048) {
          isWin = true;
        }
      });
    });

    const isLose = zerosAmount === 0 && !isMovementExist;

    if (isWin) {
      currentStatus = this.status.win;
    } else if (isLose) {
      currentStatus = this.status.lose;
    }

    return currentStatus;
  }

  start() {
    this.currentStatus = "playing";
    this.state = this.addNumbersToBoard(2);
  }

  restart() {
    this.currentStatus = "idle";
    this.state = this.initialState;

    if (localStorage.getItem(this.storageKey) < this.score) {
      localStorage.setItem(this.storageKey, this.score);
    }

    this.score = 0;
  }

  resetRecord() {
    localStorage.setItem(this.storageKey, 0);
  }
}
