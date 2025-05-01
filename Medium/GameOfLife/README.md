# Game of Life in Nim

This is a simple implementation of Conway's Game of Life using Nim. The simulation creates a grid of cells where each cell may be alive or dead, and it updates the grid based on the rules of Conway's Game of Life.

## Files

- **GameOfLife.nim**: The main source code file located in the `src` folder.
- **GameOfLife.nimble**: The Nimble package file that defines the project metadata and build settings.

## Prerequisites

- [Nim](https://nim-lang.org/) installed on your Mac (version 2.2.4 or later).
- A terminal or Visual Studio Code with Nim support.

## Building and Running

There are two primary ways to build and run this project:

### Using Nimble

1. **Open Terminal** and navigate to your project directory, for example:

   ```sh
   cd /Users/nick/Documents/PersonalProjects/Medium/GameOfLife
   ```

2. **Build and run** the project with Nimble:

   ```sh
   nimble run
   ```

   This command compiles the project and runs the resulting executable.

### Using Nim Compiler Directly

1. **Open Terminal** and navigate to the `src` directory:

   ```sh
   cd /Users/nick/Documents/PersonalProjects/Medium/GameOfLife/src
   ```

2. **Compile and run** the code with Nim:

   ```sh
   nim compile --run GameOfLife.nim
   ```

## How It Works

- **Initialization**: The `initGrid` proc randomly sets each cell as alive or dead.
- **Neighbour Counting**: The `neighbours` proc counts the live neighbours for each cell, using a toroidal arrangement (the grid wraps around).
- **Simulation Step**: The `step` proc applies the Game of Life rules to compute the next generation.
- **Drawing**: The `draw` proc outputs the grid to the terminal using special characters for live and dead cells.
- **Main Loop**: The `main` proc sets up and continuously updates the simulation.

## Precompiled Code

If you have access to a precompiled version, you can run the executable directly without compiling. Simply execute the binary from your terminal. `./GameOfLife`
