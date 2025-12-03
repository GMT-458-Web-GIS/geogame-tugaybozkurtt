document.addEventListener('DOMContentLoaded', function () {
  // Oyun Ayarları
  const GAME_TIME = 60;
  const START_LIVES = 3;
  const INITIAL_RADIUS = 50;
  const LEVEL_STEP = 1;
  const MIN_RADIUS = 15;

  // Oyun durumu
  let timer = GAME_TIME;
  let score = 0;
  let lives = START_LIVES;
  let level = 1;
  let playing = false;
  let intervalId = null;
  let currentTarget = null;
  let deliveryCount = 0;
  let currentRadius = INITIAL_RADIUS;

  // Harita
  const map = L.map('map', { zoomControl: true }).setView([40.7128, -74.0060], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  // Layerlar
  const targetLayer = L.layerGroup().addTo(map);
  const playerLayer = L.layerGroup().addTo(map);
  const pathLayer = L.layerGroup().addTo(map);
  const obstacleLayer = L.layerGroup().addTo(map);
  const bonusLayer = L.layerGroup().addTo(map);

  // Oyuncu işareti
  let playerMarker = L.circleMarker(map.getCenter(), {
    radius: 8,
    color: '#0284c7',
    fillColor: '#06b6d4',
    fillOpacity: 1
  }).addTo(playerLayer);

  // Hedef oluştur
  function spawnTarget() {
    targetLayer.clearLayers();
    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const lat = Math.random() * (ne.lat - sw.lat) + sw.lat;
    const lng = Math.random() * (ne.lng - sw.lng) + sw.lng;
    currentTarget = { lat, lng, radius: currentRadius };
    L.circle([lat, lng], { radius: currentTarget.radius, color: '#ef4444', fillColor: '#fb7185', fillOpacity: 0.3 }).addTo(targetLayer);
    L.marker([lat, lng], { title: 'Delivery Target' }).addTo(targetLayer);
    document.getElementById('bottombar').textContent = `New target: approx ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }

  // Engel oluştur
  function spawnObstacles(count = 2 + level) {
    obstacleLayer.clearLayers();
    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    for (let i = 0; i < count; i++) {
      const lat = Math.random() * (ne.lat - sw.lat) + sw.lat;
      const lng = Math.random() * (ne.lng - sw.lng) + sw.lng;
      const circle = L.circle([lat, lng], { radius: 20, color: '#f59e0b', fillColor: '#fcd34d', fillOpacity: 0.4 }).addTo(obstacleLayer);
      circle.isObstacle = true;
    }
  }

  // Bonus oluştur
  function spawnBonus() {
    bonusLayer.clearLayers();
    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const lat = Math.random() * (ne.lat - sw.lat) + sw.lat;
    const lng = Math.random() * (ne.lng - sw.lng) + sw.lng;
    const circle = L.circle([lat, lng], { radius: 20, color: '#10b981', fillColor: '#6ee7b7', fillOpacity: 0.6 }).addTo(bonusLayer);
    circle.isBonus = true;
  }

  // UI Güncelle
  function updateUI() {
    document.getElementById('timer').textContent = timer;
    document.getElementById('score').textContent = score;
    document.getElementById('lives').textContent = (lives > 0) ? '♥ '.repeat(lives).trim() : '';
    document.getElementById('level').textContent = level;
  }

  // Zamanlayıcı
  function startTimer() {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(() => {
      timer--;
      if (timer <= 0) { timer = 0; endGame(); }
      updateUI();
    }, 1000);
  }
  function stopTimer() { if (intervalId) clearInterval(intervalId); intervalId = null; }

  // Oyun Başlat
  function startGame() {
    timer = GAME_TIME; score = 0; lives = START_LIVES; level = 1;
    deliveryCount = 0; currentRadius = INITIAL_RADIUS; playing = true;
    document.getElementById('startOverlay').style.display = 'none';
    document.getElementById('gameOverOverlay').style.display = 'none';
    spawnTarget(); spawnObstacles(); spawnBonus(); updateUI(); startTimer();
  }

  // Oyun Bitti
  function endGame() {
    playing = false; stopTimer();
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOverOverlay').style.display = 'flex';
  }

  // Mesafe hesapla
  function distanceMeters(a, b) { return map.distance(a, b); }

  // Oyuncu animasyonu
  function animatePlayerTo(destLatLng, cb) {
    const start = playerMarker.getLatLng();
    const end = destLatLng;
    const steps = 30;
    let i = 0;
    const latStep = (end.lat - start.lat) / steps;
    const lngStep = (end.lng - start.lng) / steps;
    const pathCoords = [start];
    const anim = setInterval(() => {
      i++;
      const next = L.latLng(start.lat + latStep * i, start.lng + lngStep * i);
      playerMarker.setLatLng(next);
      pathCoords.push(next);
      if (i >= steps) { clearInterval(anim); drawPath(pathCoords); if (cb) cb(); }
    }, 12);
  }

  function drawPath(coords) {
    pathLayer.clearLayers();
    L.polyline(coords, { color: '#06b6d4', weight: 3, opacity: 0.9 }).addTo(pathLayer);
    setTimeout(() => { pathLayer.clearLayers(); }, 3000);
  }

  // Zorluk artır
  function increaseDifficulty() {
    deliveryCount++;
    level = Math.floor(deliveryCount / LEVEL_STEP) + 1;
    currentRadius = Math.max(MIN_RADIUS, INITIAL_RADIUS - (level - 1) * 5);
  }

  // Harita tıklama
  map.on('click', function (e) {
    if (!playing) return;
    const clickLatLng = e.latlng;

    // Engel kontrolü
    let hitObstacle = false;
    obstacleLayer.eachLayer(l => {
      if (distanceMeters(clickLatLng, l.getLatLng()) <= l.getRadius()) { lives--; hitObstacle = true; }
    });

    // Bonus kontrolü
    bonusLayer.eachLayer(l => {
      if (distanceMeters(clickLatLng, l.getLatLng()) <= l.getRadius()) { timer += 5; }
    });

    if (hitObstacle) { updateUI(); animatePlayerTo(clickLatLng); if (lives <= 0) endGame(); return; }

    // Hedef kontrolü
    if (currentTarget) {
      const d = distanceMeters(clickLatLng, L.latLng(currentTarget.lat, currentTarget.lng));
      if (d <= currentTarget.radius) {
        score++; increaseDifficulty();
        animatePlayerTo(clickLatLng, () => { spawnTarget(); spawnObstacles(); spawnBonus(); updateUI(); });
        return;
      }
    }

    // Yanlış tık
    lives--; updateUI(); animatePlayerTo(clickLatLng);
    if (lives <= 0) endGame();
  });

  // Butonlar
  document.getElementById('startBtn').addEventListener('click', startGame);
  document.getElementById('restartBtn').addEventListener('click', startGame);

  // Geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude, lng = pos.coords.longitude;
      playerMarker.setLatLng([lat, lng]);
      map.setView([lat, lng], 14);
    }, () => { /* izin verilmezse sessiz geç */ });
  }
});

