# Nebula Maze: Fog of War (PreVersion 1.0)

An educational dungeon crawler game built with React, Vite, and TypeScript.

## Features

*   **Procedural Mazes**: Infinite variations with different shapes (Circle, Diamond, Pineapple).
*   **Fog of War**: Explore the unknown; visibility is limited.
*   **Smart Progression**: The exit is hidden until 90% of the maze is explored.
*   **Hazard System**: Survive Fire, Snakes, and Toxic Fumes using your inventory.
*   **Academic Encounters**: Answer questions to gain bonuses or avoid penalties.
*   **Operator Mode**: Built-in editor to manage the question repository (`questions.json`).

## Tech Stack

*   **Framework**: React 18
*   **Build Tool**: Vite
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **Charts**: Recharts

## How to Run Locally

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```
    The output will be in the `dist/` folder.

## Operator Mode

To add or edit questions:
1.  Click the **Gear Icon** in the game dashboard.
2.  Use the interface to Add/Edit questions.
3.  Click **Download JSON** to save your changes.
4.  Replace the `public/questions.json` file with your downloaded file to make changes permanent.

## License

Proprietary - PreVersion 1.0
