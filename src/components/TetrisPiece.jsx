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

const TetrisPiece = ({ type = 'T', color = 'bg-blue-500' }) => {
  const shape = TETRIS_SHAPES[type];

  return (
    <div className="inline-block">
      {shape.map((row, rowIndex) => (
        <div key={rowIndex} className="flex" style={{ height: `${blockSize}px` }}>
          {row.map((cell, colIndex) =>
            cell ? (
              <div
                key={colIndex}
                className={`flex items-center justify-center ${color} rounded-full`}
                style={{ width: `${blockSize}px`, height: `${blockSize}px`, lineHeight: 0, padding: 0, margin: 0 }}
              >
                <GiBrickWall size={blockSize - 4} className="text-white" />
              </div>
            ) : (
              <div
                key={colIndex}
                style={{ width: `${blockSize}px`, height: `${blockSize}px` }}
              />
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default TetrisPiece;
