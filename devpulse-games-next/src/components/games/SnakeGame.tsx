/*****************************************************************************
 * SnakeGame.tsx
 * 
 * DevPulse Mini-Game: Snake
 * Static Snake Rendering (No Movement Yet)
 * 
 * This component renders a static snake on a grid for development and visulization.
 * Intended as the first step before implementing movement, food, and collisions.
 ******************************************************************************/

"use client"; // Required for Next.js 14 App Router client-side interactivity

import React, { useState } from "react";

/********************************************
 * TYPES
 ********************************************/
 
// Position type for each segment of the snake
interface Position {
    x: number;
    y: number;
}

/********************************************
 * COMPONENT
 ********************************************/

export default function SnakeGame() {
    /********************************************
    * CONSTANTS
    ********************************************/
    const GRID_SIZE =   10; // Grid dimensions: GRID_SIZE x GRID_SIZE

    /********************************************
    * STATE
    ********************************************/
    // Snake state: array of segments (head is first element)
    const [snake, setSnake] = useState<Position[]>([
        { x: 5, y: 5 }, // Head
        { x: 4, y: 5 }, // Middle
        { x: 3, y: 5 } // Tail
    ]);

    /********************************************
    * FUNCTIONS
    ********************************************/
    
    // Function to render the board as text (S = snake, . = empty)
    const renderBoard = () => {
        const rows = [];
        for (let y = 0; y < GRID_SIZE; y++) {
            let row = "";
            for (let x = 0; x < GRID_SIZE; x++) {
                // Check if current cell is part of the snake
                const isSnake = snake.some(segment => segment.x === x && segment.y === y);
                row += isSnake ? "S" : ".";
            }
            // Add row to JSX output
            rows.push(<div key={y}>{row}</div>);
        }
        return rows;
    };

    /********************************************
    * RENDER
    ********************************************/

    return(
        <div className="font-mono text-neon-green">
            {/* Game Header */}
            <h2 className="text-2xl font-bold mb-2">SnakeGame (Static Snake)</h2>
            
            {/* Grid Display */}
            <div>
                {renderBoard()}
            </div>

            {/* Note for developers */}
            <div className="text-gray-400 mt-2 text-sm">
                {/* This is just a static board. Movement will be added in the next steps. */}
            </div>
        </div>
    );
}