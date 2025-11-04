/*****************************************************************************
 * SnakeGame.tsx
 * * DevPulse Mini-Game: Snake
 * Simple Snake Rendering & Movement
 *
 * This component renders a snake on a grid and allows movement via
 * arrow keys or WASD.
 *****************************************************************************/

"use client"; // Required for Next.js App Router client-side interactivity

import { Rowdies } from "next/font/google";
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
    const GRID_SIZE = 20; // Grid dimensions: 20x20

    /********************************************
     * STATE
     ********************************************/
    // Snake state: array of segments (head is first element)
    const [snake, setSnake] = useState<Position[]>([
        { x: 5, y: 5 }, // Head
        { x: 4, y: 5 }, // Middle
        { x: 3, y: 5 }  // Tail
    ]);

    // Food state: single position for the food pellet
    const [food, setFood] = useState<Position>({ x: 15, y: 15 });

    const [isGameOver, setIsGameOver] = useState(false);
    // Track current movement direction
    const [direction, setDirection] = useState<"up" | "down" | "left" | "right">("right");

    /********************************************
     * MOVEMENT LOGIC
     ********************************************/

    // Handle keyboard input to change direction
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // New: Prevent direction change if game is over
            if (isGameOver) return; 
            
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
    }, [direction, isGameOver]); // FIXED: Added isGameOver dependency

    // Game loop: move snake at regular interval
    useEffect(() => {
        if (isGameOver) return;

        // Interval moves snake every 500ms
        const interval = setInterval(() => {
            setSnake(prevSnake => {
                // Copy current head position
                const newHead = { ...prevSnake[0] };

                // Update head position based on current direction
                switch (direction) {
                    case "up":    newHead.y -= 1; break;
                    case "down":  newHead.y += 1; break;
                    case "left":  newHead.x -= 1; break;
                    case "right": newHead.x += 1; break;
                }

                // Wall Collision Check
                const isWallCollision = 
                    newHead.x < 0 || 
                    newHead.x >= GRID_SIZE || 
                    newHead.y < 0 || 
                    newHead.y >= GRID_SIZE;

                if (isWallCollision) {
                    setIsGameOver(true); // Stop the game!
                    return prevSnake; // Don't update the snake position
                }
                
                // NEW: Self-Collision Check
                const isSelfCollision = prevSnake.some((segment, index) => {
                    // Check if the new head position overlaps with any body segment (index > 0)
                    return index > 0 && newHead.x === segment.x && newHead.y === segment.y;
                });

                if (isSelfCollision) {
                    setIsGameOver(true);
                    return prevSnake; 
                }

                // Check for eating food
                const isEating = newHead.x === food.x && newHead.y === food.y;

                // Start with the new head and the rest of the body
                let nextSnake: Position[] = [newHead, ...prevSnake];

                if (isEating) {
                    // If eating, the snake grows (by not dropping the tail)
                    setFood(generateNewFoodPosition(nextSnake));
                } else {
                    // Normal move: drop the last segment
                    nextSnake = nextSnake.slice(0, -1);
                }  

                return nextSnake
            });
        }, 500); // FIXED SYNTAX: Removed stray semicolon and incomplete block

        // Cleanup interval on unmount or direction change
        return () => clearInterval(interval);
    }, [direction, food, isGameOver]); // FIXED: Added isGameOver dependency

    /********************************************
     * FUNCTIONS
     ********************************************/

    // Helper function to generate new food position that doesn't overlap the snake
    const generateNewFoodPosition = (currentSnake: Position[]): Position => {
        let newFood: Position;
        do {
            // Generate random coordinates within the grid size (0 to GRID_SIZE -1)
            newFood = {
                x: Math.floor(Math.random() * GRID_SIZE), 
                y: Math.floor(Math.random() * GRID_SIZE),
            };
        } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        
        return newFood; 
    };
    
    // Render the board as text grid (S = snake, . = empty)
    const renderBoard = () => {
        const rows =[];
        
        // --- OUTER LOOP over Y ---
        for (let y = 0; y < GRID_SIZE; y++) {
            const rowCells = [];
            
            // --- INNER LOOP over X ---
            for (let x = 0; x < GRID_SIZE; x++) {
                const isSnake = snake.some(segment => segment.x === x && segment.y === y);
            
                const isFood = food.x === x && food.y === y; 

            rowCells.push(
                <div
                    key={`${x}-${y}`}
                    className={`w-6 h-6 border border-gray-800 ${
                        isSnake 
                                ? "bg-neon-green" 
                                : isFood 
                                ? "bg-red-500" // Food color (let's use red)
                                : "bg-dark-bg"
                        }`}
                    />
                ); // FIXED: Closed rowCells.push
            } // FIXED: Added missing closing brace for inner loop
            
        // Make each row a flex container
        rows.push(
            <div key={y} className="flex">
                {rowCells}
            </div>
        );
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
            <div className="flex flex-col items-center justify-center min-h-screen bg-dark-bg">
                <h2 className="text-2xl font-bold text-neon-green mb-4">SnakeGame</h2>
                
                {/* NEW: Conditional rendering for Game Over screen */}
                {isGameOver ? ( // <--- Conditional check
                    <div className="text-4xl text-red-600 font-extrabold mb-8 p-4 border-4 border-red-600">
                        GAME OVER!
                    </div>
                ) : (
                    renderBoard()
                )}
                
            </div>

            {/* Developer note */}
            <div className="text-gray-400 mt-2 text-sm">
                Use arrow keys or WASD to move the snake. Food and collisions are now working!
            </div>
        </div>
    );
}
