'use client';
import React, { useEffect, useState } from 'react';

const BOARD_SIZE = 20;

export default function GameBoard() {
  const [snake, setSnake] = useState<number[]>([210, 211, 212]);
  const [direction, setDirection] = useState<number>(1);
  const [fruit, setFruit] = useState<number>(0);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const generateFruit = (snakeBody: number[]) => {
    let newFruit;
    do {
      newFruit = Math.floor(Math.random() * BOARD_SIZE * BOARD_SIZE);
    } while (snakeBody.includes(newFruit));
    return newFruit;
  };

  useEffect(() => {
    setFruit(generateFruit(snake));
  }, []); // Cette dépendance est correcte car on veut juste générer le fruit au début

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setSnake(prev => {
        const newHead = prev[prev.length - 1] + direction;

        if (
          newHead < 0 ||
          newHead >= BOARD_SIZE * BOARD_SIZE ||
          (direction === 1 && newHead % BOARD_SIZE === 0) ||
          (direction === -1 && (newHead + 1) % BOARD_SIZE === 0)
        ) {
          setGameOver(true);
          clearInterval(interval);
          return prev;
        }

        if (prev.includes(newHead)) {
          setGameOver(true);
          clearInterval(interval);
          return prev;
        }

        if (newHead === fruit) {
          const newSnake = [...prev, newHead];
          setFruit(generateFruit(newSnake));
          setScore(prevScore => prevScore + 0.5); // Increment score only when fruit is eaten
          return newSnake;
        }

        return [...prev.slice(1), newHead];
      });
    }, 200);

    return () => clearInterval(interval);
  }, [direction, fruit, gameOver, snake]);  // Ajoute snake ici

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && direction !== BOARD_SIZE) {
        setDirection(-BOARD_SIZE);
      } else if (e.key === 'ArrowDown' && direction !== -BOARD_SIZE) {
        setDirection(BOARD_SIZE);
      } else if (e.key === 'ArrowLeft' && direction !== 1) {
        setDirection(-1);
      } else if (e.key === 'ArrowRight' && direction !== -1) {
        setDirection(1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [direction]);

  const resetGame = () => {
    const initialSnake = [210, 211, 212];
    setSnake(initialSnake);
    setDirection(1);
    setFruit(generateFruit(initialSnake));
    setGameOver(false);
    setScore(0); // Ensure the score starts at 0
  };

  const grid = Array.from({ length: BOARD_SIZE * BOARD_SIZE });

  return (
    <div className="text-center">
      <div className="mt-4 text-lg font-semibold text-gray-700">Score : {score}</div>

      <div
        className="grid w-fit mx-auto mt-10"
        style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}
      >
        {grid.map((_, i) => {
          const isSnake = snake.includes(i);
          const isFruit = fruit === i;
          return (
            <div
              key={i}
              className={`w-5 h-5 border border-gray-300 ${
                isSnake ? 'bg-green-500' : isFruit ? 'bg-red-500' : 'bg-white'
              }`}
            />
          );
        })}
      </div>

      {gameOver && (
        <div className="mt-5">
          <div className="text-2xl text-red-500 mb-2">Game Over! 🐍💥</div>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Rejouer
          </button>
        </div>
      )}
    </div>
  );
}
