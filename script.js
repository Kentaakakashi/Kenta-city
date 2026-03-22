/* ============================================================
   KENTA.CITY — script.js
   ============================================================ */

'use strict';

/* ---- PARTICLE CANVAS ---- */
(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function spawnParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.5 - 0.1,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      color: ['#00d4ff','#ff2d78','#ff8c00','#bf5fff','#ffffff'][Math.floor(Math.random() * 5)]
    };
  }

  for (let i = 0; i < 80; i++) particles.push(spawnParticle());

  function tick() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      p.alpha -= 0.0008;
      if (p.alpha <= 0 || p.y < -5) { particles[i] = spawnParticle(); return; }
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ---- LOADER ---- */
window.addEventListener('DOMContentLoaded', function () {
  const loader = document.getElementById('loader');
  setTimeout(function () {
    loader.classList.add('fade-out');
    setTimeout(function () { loader.style.display = 'none'; }, 800);
  }, 2400);
});

/* ---- LIVE CLOCK ---- */
(function initClock() {
  const el = document.getElementById('hud-time');
  function tick() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2,'0');
    const m = String(now.getMinutes()).padStart(2,'0');
    const s = String(now.getSeconds()).padStart(2,'0');
    el.textContent = h + ':' + m + ':' + s;
  }
  tick();
  setInterval(tick, 1000);
})();

/* ---- ZONE DATA ---- */
const ZONES = JSON.parse(document.getElementById('zone-data').textContent);

/* ---- BUILDING INTERACTIONS ---- */
const buildings = document.querySelectorAll('.building');
const tooltip   = document.getElementById('city-tooltip');
let tooltipTimer = null;

buildings.forEach(function (b) {
  const zone = b.dataset.zone;
  const data = ZONES[zone];

  /* Hover tooltip */
  b.addEventListener('mouseenter', function () {
    clearTimeout(tooltipTimer);
    tooltip.textContent = '[ ' + (data ? data.title : '???') + ' ]  — TAP TO ENTER';
    tooltip.classList.add('visible');
  });
  b.addEventListener('mouseleave', function () {
    tooltipTimer = setTimeout(function () { tooltip.classList.remove('visible'); }, 600);
  });

  /* Click / tap → open interior */
  b.addEventListener('click', function (e) {
    e.stopPropagation();
    if (data) openInterior(zone);
  });
  b.addEventListener('touchend', function (e) {
    e.preventDefault();
    if (data) openInterior(zone);
  }, { passive: false });
});

/* ---- OPEN INTERIOR ---- */
function openInterior(zoneKey) {
  const data = ZONES[zoneKey];
  if (!data) return;

  const view      = document.getElementById('interior-view');
  const bg        = document.getElementById('interior-bg');
  const container = document.getElementById('interior-container');
  const content   = document.getElementById('interior-content');

  /* Apply theme */
  view.className = 'theme-' + data.theme;
  bg.className   = 'interior-bg'; // reset classes via parent

  /* Build HTML */
  let cardsHTML = data.cards.map(function (c, i) {
    const span = data.cards.length === 5 && i === 4 ? ' style="grid-column:1/-1"' : '';
    return '<div class="int-card"' + span + '>' +
      '<div class="card-icon">' + c.icon + '</div>' +
      '<div class="card-title">' + c.title + '</div>' +
      '<div class="card-body">'  + c.body  + '</div>' +
      '</div>';
  }).join('');

  content.innerHTML =
    '<div class="int-header">' +
      '<div class="int-title-jp">' + data.titleJp + '</div>' +
      '<div class="int-title">'    + data.title   + '</div>' +
      '<div class="int-desc">'     + data.desc    + '</div>' +
    '</div>' +
    '<div class="int-cards">' + cardsHTML + '</div>';

  /* Spawn interior particles */
  const pContainer = document.getElementById('interior-particles');
  pContainer.innerHTML = '';
  const colors = { home:'#ffb347', office:'#00d4ff', cafe:'#ff2d78', arcade:'#bf5fff', music:'#ff8c00', secret:'#ff2020' };
  const col = colors[data.theme] || '#ffffff';
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'int-particle';
    p.style.cssText =
      'left:' + Math.random() * 100 + '%;' +
      'background:' + col + ';' +
      'box-shadow: 0 0 4px ' + col + ';' +
      'animation-duration:' + (6 + Math.random() * 8) + 's;' +
      'animation-delay:-' + (Math.random() * 10) + 's;';
    pContainer.appendChild(p);
  }

  /* Show */
  view.classList.remove('hidden');
  requestAnimationFrame(function () { view.classList.add('visible'); });
  container.scrollTop = 0;
}

/* ---- CLOSE INTERIOR ---- */
document.getElementById('back-btn').addEventListener('click', closeInterior);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeInterior();
});

function closeInterior() {
  const view = document.getElementById('interior-view');
  view.classList.remove('visible');
  setTimeout(function () { view.classList.add('hidden'); }, 500);
}

/* ---- HUD BUTTONS ---- */
document.getElementById('btn-info').addEventListener('click', function () {
  alert('🏙️ KENTA.CITY\n\nTap any building to explore.\nFind the secret Back Alley in the top-right corner.\n\nTip: Try the Konami code ↑↑↓↓←→←→BA');
});
document.getElementById('btn-map').addEventListener('click', function () {
  alert('🗺 CITY MAP\n\n• ABOUT AVENUE — Kenta\'s House (top-left)\n• MY PROJECTS — Project Tower (center)\n• SOCIAL STREET — Social Café (right)\n• OTAKU LANE — Anime Arcade (bottom-left)\n• MUSIC SPOT — Music Shop (bottom-right)\n• ??? BACK ALLEY — Hidden (top-right)\n\nTap any glowing building to enter.');
});

let vibeOn = false;
document.getElementById('btn-music-toggle').addEventListener('click', function () {
  vibeOn = !vibeOn;
  this.style.color = vibeOn ? 'var(--neon-green)' : '';
  this.style.boxShadow = vibeOn ? '0 0 12px rgba(57,255,20,0.4)' : '';
  // Oscillator-based ambient city hum (Web Audio API, no files needed)
  if (vibeOn) startAmbient();
  else stopAmbient();
});

/* ---- AMBIENT SOUND (Web Audio API) ---- */
let audioCtx = null, gainNode = null, oscNodes = [];
function startAmbient() {
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 2);
    gainNode.connect(audioCtx.destination);

    [[80,0],[120,0.03],[160,0.02],[200,0.01],[300,0.008]].forEach(function([freq, detune]) {
      const osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.detune.value = detune * 100;
      osc.connect(gainNode);
      osc.start();
      oscNodes.push(osc);
    });
    // Rain-like noise
    const bufLen = audioCtx.sampleRate * 2;
    const buffer = audioCtx.createBuffer(1, bufLen, audioCtx.sampleRate);
    const data   = buffer.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * 0.015;
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer; noise.loop = true;
    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'lowpass'; noiseFilter.frequency.value = 600;
    noise.connect(noiseFilter); noiseFilter.connect(gainNode);
    noise.start(); oscNodes.push(noise);
  } catch(e) { /* audio not supported */ }
}
function stopAmbient() {
  if (gainNode) {
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
    setTimeout(function () {
      oscNodes.forEach(function (o) { try { o.stop(); } catch(e){} });
      oscNodes = [];
      if (audioCtx) { audioCtx.close(); audioCtx = null; }
    }, 1600);
  }
}

/* ---- KONAMI CODE ---- */
(function initKonami() {
  const code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let pos = 0;
  document.addEventListener('keydown', function (e) {
    if (e.key === code[pos]) {
      pos++;
      if (pos === code.length) { pos = 0; triggerKonami(); }
    } else { pos = 0; }
  });
})();

function triggerKonami() {
  const el = document.createElement('div');
  el.className = 'konami-flash';
  el.innerHTML =
    '<div class="konami-text">✦ CHEAT CODE ACTIVATED ✦</div>' +
    '<div class="konami-sub">you found the back alley.<br>we were always watching.</div>';
  document.body.appendChild(el);
  setTimeout(function () {
    el.classList.add('gone');
    setTimeout(function () { el.remove(); }, 500);
  }, 3500);
}

/* ---- BUILDING HOVER PARALLAX (desktop only) ---- */
(function initParallax() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch
  const scene = document.getElementById('iso-scene');
  document.addEventListener('mousemove', function (e) {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    scene.style.transform = 'translate(' + (-dx * 8) + 'px, ' + (-dy * 5) + 'px)';
  });
})();

/* ---- RANDOM WINDOW FLICKER (adds life to the city) ---- */
(function initWindowFlicker() {
  const windows = document.querySelectorAll('.b-window');
  setInterval(function () {
    const w = windows[Math.floor(Math.random() * windows.length)];
    const orig = w.style.opacity;
    w.style.opacity = '0.1';
    setTimeout(function () { w.style.opacity = orig || '1'; }, 80 + Math.random() * 120);
  }, 800);
})();

/* ---- RESPONSIVE TOUCH SCALE ---- */
(function initTouchScale() {
  const scene = document.getElementById('iso-scene');
  let startDist = null;
  let currentScale = 1;

  document.addEventListener('touchstart', function (e) {
    if (e.touches.length === 2) {
      startDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  }, { passive: true });

  document.addEventListener('touchmove', function (e) {
    if (e.touches.length === 2 && startDist) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / startDist;
      const newScale = Math.min(Math.max(currentScale * ratio, 0.6), 1.8);
      scene.style.transform = 'scale(' + newScale + ')';
    }
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    if (e.touches.length < 2) startDist = null;
  });
})();

/* ---- CAR HEADLIGHTS (dynamic glow as they move) ---- */
(function initCarGlow() {
  const cars = document.querySelectorAll('.car');
  cars.forEach(function (c) {
    c.style.textShadow = '0 0 8px rgba(255,220,100,0.8), 0 0 16px rgba(255,180,50,0.4)';
  });
})();

/* ---- AMBIENT SHIMMER ON ROADS ---- */
(function initRoadShimmer() {
  const roads = document.querySelectorAll('.road');
  let t = 0;
  function shimmer() {
    t += 0.02;
    roads.forEach(function (r) {
      const v = 0.92 + Math.sin(t) * 0.04;
      r.style.opacity = v;
    });
    requestAnimationFrame(shimmer);
  }
  shimmer();
})();
