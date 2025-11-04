/*****************************************************************************
 * SnakeGame.tsx
 * 
 * DevPulse Mini-Game: Snake
 * Simple Snake Rendering & Movement
 *
 * This component renders a snake on a grid and allows movement via
 * arrow keys or WASD. Still no food or collisions yet.
 *****************************************************************************/

"use client"; // Required for Next.js App Router client-side interactivity

import React, { useState, useEffect } from "react";

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
    const GRID_SIZE = 10; // Grid dimensions: 10x10

    /********************************************
     * STATE
     ********************************************/
    // Snake state: array of segments (head is first element)
    const [snake, setSnake] = useState<Position[]>([
        { x: 5, y: 5 }, // Head
        { x: 4, y: 5 }, // Middle
        { x: 3, y: 5 }  // Tail
    ]);

    // Track current movement direction
    const [direction, setDirection] = useState<"up" | "down" | "left" | "right">("right");

    /********************************************
     * MOVEMENT LOGIC
     ********************************************/

    // Handle keyboard input to change direction
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowUp":
                case "w":
                case "W":
                    if (direction !== "down") setDirection("up"); // Prevent reversing
                    break;
                case "ArrowDown":
                case "s":
                case "S":
                    if (direction !== "up") setDirection("down");
                    break;
                case "ArrowLeft":
                case "a":
                case "A":
                    if (direction !== "right") setDirection("left");
                    break;
                case "ArrowRight":
                case "d":
                case "D":
                    if (direction !== "left") setDirection("right");
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        // Cleanup listener on unmount
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [direction]); // Effect depends on current direction

    // Game loop: move snake at regular interval
    useEffect(() => {
        // Interval moves snake every 500ms
        const interval = setInterval(() => {
            setSnake(prevSnake => {
                // Copy current head position
                const newHead = { ...prevSnake[0] };

                // Update head position based on current direction
                switch (direction) {
                    case "up":    newHead.y -= 1; break;
                    case "down":  newHead.y += 1; break;
                    case "left":  newHead.x -= 1; break;
                    case "right": newHead.x += 1; break;
                }

                // Build new snake array: add new head, drop last segment
                return [newHead, ...prevSnake.slice(0, -1)];
            });
        }, 500); // 500ms = 0.5s per move

        // Cleanup interval on unmount or direction change
        return () => clearInterval(interval);
    }, [direction]);

    /********************************************
     * FUNCTIONS
     ********************************************/

    // Render the board as text grid (S = snake, . = empty)
    const renderBoard = () => {
        const rows = [];
        for (let y = 0; y < GRID_SIZE; y++) {
            let row = "";
            for (let x = 0; x < GRID_SIZE; x++) {
                const isSnake = snake.some(segment => segment.x === x && segment.y === y);
                row += isSnake ? "S" : ".";
            }
            rows.push(<div key={y}>{row}</div>);
        }
        return rows;
    };

    /********************************************
     * RENDER
     ********************************************/

    return (
        <div className="font-mono text-neon-green">
            {/* Game Header */}
            <h2 className="text-2xl font-bold mb-2">SnakeGame</h2>

            {/* Grid Display */}
            <div>
                {renderBoard()}
            </div>

            {/* Developer note */}
            <div className="text-gray-400 mt-2 text-sm">
                Use arrow keys or WASD to move the snake. Food and collisions coming next!
            </div>
        </div>
    );
}
