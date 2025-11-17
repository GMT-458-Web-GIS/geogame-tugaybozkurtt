GeoGame Design – Courier Game

1. Game Concept
The Courier Game is a browser-based geographic game in which the player tries to deliver packages to designated locations on the map within a limited time. The goal is to complete as many deliveries as possible within 1 minute. The game measures speed, navigation skills, and map awareness.

2. Frontend Requirements
Mandatory Components
- Map display (using Leaflet or an advanced JS mapping library)
- Start screen (Play button)
- Countdown timer (60 seconds)
- Score display (number of successful deliveries)
- Lives indicator (losing 1 life for wrong delivery location)
- Delivery target marker on the map
- Player location or simulated movement marker
- Game over screen with final score and restart option

Functional Requirements
- When the game begins, a random delivery point will be generated.
- When the player clicks or reaches the target, the delivery is completed.
- A new target is automatically generated after each delivery.
- Clicking a wrong location results in losing 1 life.
- The game ends when time runs out or all lives are lost.

Technical Requirements
- User interface built using HTML + CSS
- Game logic, timer, random location generation handled with JavaScript
- Map library (Leaflet.js or other advanced packages)
- Hosted on GitHub Pages as a static web application

3. Interface Layout (Frontend Layout)

Main Screen Layout
Top Bar:
- Timer
- “Courier Game” title
- Score + Lives

Main Area:
- Fullscreen map view
- Delivery target marker
- Player marker or simulated position

Bottom Bar:
- Instruction text or next delivery hint

Start Screen:
- Large Play / Start Game button
- Transparent map background

Game Over Screen:
- Final score display
- Play Again button

4. Game Progress Details
How will the game progress?
- The player has 60 seconds to complete as many deliveries as possible.
- Each successful delivery generates a new random delivery point.
- Wrong clicks or wrong delivery attempts reduce 1 life.
- The game ends when the time expires or all lives are lost.

How many tasks will there be?
- The number of tasks is unlimited within the 1-minute time limit.

How many lives will the user have?
- The player starts with 3 lives. Each wrong action reduces 1 life.

Which JS library will be used?
- Leaflet.js as the main mapping library
- Optional: D3.js for path visualization or heatmaps

┌───────────────────────────────────────────────────────────┐
│ TIME: 60s             COURIER GAME            SCORE: 0    │
│                               LIVES: ♥ ♥ ♥                │
├───────────────────────────────────────────────────────────┤
│                                                           │
│                         [ MAP AREA ]                      │
│                                                           │
│    • Delivery Target (Marker)                             │
│    • Player Position (Marker)                             │
│                                                           │
├───────────────────────────────────────────────────────────┤
│        The next delivery target will be displayed here    │
└───────────────────────────────────────────────────────────┘






