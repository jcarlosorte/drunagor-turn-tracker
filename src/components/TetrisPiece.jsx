// src/components/TetrisPiece.jsx
import React from 'react';
import { GiBrickWall } from 'react-icons/gi';

const blockSize = 24; // tamaño del icono (en px)

const TETRIS_SHAPES = {
  II: [
    [1, 1, 1, 1],
  ],
  I: [
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  L: [
    [1, 0],
    [1, 1],
  ],
  J: [
    [0, 1],
    [0, 1],
    [1, 1],
  ],
  S: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ],
  U: [
    [1, 0, 1],
    [1, 1, 1],
  ],
  Y: [
    [1, 0, 1],
    [1, 1, 1],
    [0, 1, 0],
  ]
};

const TetrisPiece = ({ type = 'T', color = 'text-blue-500' }) => {
  const shape = TETRIS_SHAPES[type];

  return (
    <div className="inline-block">
      {shape.map((row, rowIndex) => (
        <div key={rowIndex} className="flex h-[24px]">
          {row.map((cell, colIndex) =>
            cell ? (
              <div
                key={colIndex}
                className={`w-[${blockSize}px] h-[${blockSize}px] flex items-center justify-center ${color}`}
              >
                <GiBrickWall size={blockSize} />
              </div>
            ) : (
              <div
                key={colIndex}
                className={`w-[${blockSize}px] h-[${blockSize}px]`}
              />
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default TetrisPiece;
