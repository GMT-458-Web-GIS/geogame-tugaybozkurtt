
const GAME_TIME = 60; // saniye
const START_LIVES = 3;
let timer = GAME_TIME;
let score = 0;
let lives = START_LIVES;
let deliveryCount = 0;
let currentTarget = null;
let difficultyStep = { afterDeliveries: 3, reduceBy: 5 };


const map = L.map('map').setView([40.7128, -74.0060], 13); // NYC
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);


let playerLatLng = map.getCenter();
const playerMarker = L.marker(playerLatLng).addTo(map);
const pathLayer = L.layerGroup().addTo(map);


function updateUI() {
    document.getElementById('timer').textContent = `TIME: ${timer}s`;
    document.getElementById('score-lives').textContent = `SCORE: ${score} | LIVES: ${'♥ '.repeat(lives)}`;
}


function spawnRandomTarget() {
    const lat = 40.70 + Math.random() * 0.05;
    const lng = -74.01 + Math.random() * 0.05;
    if (currentTarget) map.removeLayer(currentTarget.marker);
    const marker = L.marker([lat, lng]).addTo(map);
    currentTarget = { marker, lat, lng, radius: 25 };
}


let gameInterval = null;
function startGame() {
    score = 0;
    lives = START_LIVES;
    timer = GAME_TIME;
    deliveryCount = 0;
    updateUI();
    spawnRandomTarget();
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        timer--;
        updateUI();
        if (timer <= 0) endGame();
    }, 1000);
}


function endGame() {
    clearInterval(gameInterval);
    alert(`Game Over! Final score: ${score}`);
}


map.on('click', e => {
    const clickLatLng = e.latlng;
    const dist = map.distance(clickLatLng, L.latLng(currentTarget.lat, currentTarget.lng));
    if (dist <= currentTarget.radius) {
        score++;
        deliveryCount++;
        maybeIncreaseDifficulty();
        updateUI();
        spawnRandomTarget();
    } else {
        lives--;
        updateUI();
        if (lives <= 0) endGame();
    }
});


function maybeIncreaseDifficulty() {
    if(difficultyStep.afterDeliveries>0 && (deliveryCount % difficultyStep.afterDeliveries) === 0){
        currentTarget.radius = Math.max(15, currentTarget.radius - difficultyStep.reduceBy);
    }
}


document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', startGame);


updateUI();
