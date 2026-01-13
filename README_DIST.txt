NEBULA MAZE - PROJECT DOCUMENTATION & DEPLOYMENT GUIDE
======================================================

1. TECHNOLOGY STACK
-------------------
- Type: Web Application (Frontend)
- Framework: React 18
- Language: TypeScript
- Build Tool: Vite
- Styling: Tailwind CSS
- Runtime: Node.js (for development and building)

2. SYSTEM REQUIREMENTS
----------------------
- Node.js (Version 18 or higher recommended)
- npm (Node Package Manager, usually comes with Node.js)
- A code editor (VS Code recommended) or Command Prompt/Terminal

3. INSTALLATION & EXECUTION COMMANDS
------------------------------------
1. Unzip the downloaded file to a folder.
2. Open your Command Prompt (CMD) or Terminal in that folder.
3. Install Dependencies:
   Command: npm install
   (This downloads all necessary libraries)

4. Start Local Development Server (to play locally):
   Command: npm run dev
   (Open the URL shown, usually http://localhost:5173)

5. Build for Production (to publish):
   Command: npm run build
   (This creates a 'dist' folder with the optimized game files)

6. Preview Production Build:
   Command: npm run preview

4. COMPATIBLE PLATFORMS TO PUBLISH
----------------------------------
This is a static web application. It can be hosted on ANY web server.
Recommended platforms (Free & Paid):
- Vercel (Highly recommended for React/Vite)
- Netlify
- GitHub Pages
- Cloudflare Pages
- AWS S3 / CloudFront
- Firebase Hosting
- Itch.io (Upload the contents of the 'dist' folder as a HTML5 game)

5. PROCESS TO MARKET
--------------------
- Target Audience: Students, Puzzle Lovers, RPG Fans.
- Unique Selling Points (USP):
  - "Fog of War" mechanic (Mystery & Exploration).
  - Educational/Academic Trivia integration.
  - Procedural Generation (Infinite replayability).
- Channels:
  - Game Portals: Itch.io, Newgrounds, Kongregate.
  - Social Media: Twitter/X, Reddit (r/webgames, r/reactjs), TikTok (gameplay clips).
  - Educational Forums: Share as a learning tool.

6. PROFIT SHARING
-----------------
I do accept payments or profit shares.
This code is generated for you to use. You retain the rights to your creation
subject to Youware's terms of service. Go forth and succeed!

7. FILE STRUCTURE
-----------------
- src/          : Source code (React components, logic)
- public/       : Static assets (questions.json, manifest)
- dist/         : Production build (created after 'npm run build')
- index.html    : Entry point
- package.json  : Project configuration
