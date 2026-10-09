const body = document.body;
const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelectorAll(".site-nav a");
const cursor = document.querySelector(".cursor");
const hero = document.querySelector(".hero");
const canvas = document.querySelector("#orbit-canvas");
const chaosButton = document.querySelector(".chaos-button");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

menuButton.addEventListener("click", () => {
  const isOpen = body.classList.toggle("menu-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.querySelector(".menu-label").textContent = isOpen ? "Close" : "Menu";
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.querySelector(".menu-label").textContent = "Menu";
  });
});

function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString("en-GB", { hour12: false });
  document.querySelector(".status-time").textContent = time;
}

updateClock();
setInterval(updateClock, 1000);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

let pointerX = window.innerWidth / 2;
let pointerY = window.innerHeight / 2;
let cursorX = pointerX;
let cursorY = pointerY;

window.addEventListener("pointermove", (event) => {
  pointerX = event.clientX;
  pointerY = event.clientY;
});

document.querySelectorAll("a, button").forEach((element) => {
  element.addEventListener("pointerenter", () => cursor.classList.add("is-active"));
  element.addEventListener("pointerleave", () => cursor.classList.remove("is-active"));
});

function animateCursor() {
  cursorX += (pointerX - cursorX) * 0.18;
  cursorY += (pointerY - cursorY) * 0.18;
  cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
  requestAnimationFrame(animateCursor);
}

if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
  animateCursor();
}

document.querySelectorAll(".magnetic").forEach((element) => {
  element.addEventListener("pointermove", (event) => {
    if (prefersReducedMotion || window.innerWidth < 851) return;
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    element.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px)`;
  });
  element.addEventListener("pointerleave", () => {
    element.style.transform = "";
  });
});

const context = canvas.getContext("2d");
let particles = [];
let canvasWidth = 0;
let canvasHeight = 0;
let frame = 0;

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvasWidth = hero.clientWidth;
  canvasHeight = hero.clientHeight;
  canvas.width = canvasWidth * ratio;
  canvas.height = canvasHeight * ratio;
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function seedParticles(count = 75) {
  particles = Array.from({ length: count }, (_, index) => ({
    angle: Math.random() * Math.PI * 2,
    radius: 45 + Math.random() * Math.min(canvasWidth, canvasHeight) * 0.48,
    speed: 0.001 + Math.random() * 0.004,
    size: Math.random() * 2.5 + 0.4,
    phase: Math.random() * Math.PI * 2,
    color: index % 9 === 0 ? "#ff5c35" : index % 4 === 0 ? "#a87cff" : "#c9ff2f",
    burst: 0,
  }));
}

function drawOrbit() {
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  const centerX = canvasWidth * 0.66;
  const centerY = canvasHeight * 0.42;
  const pointerInfluenceX = (pointerX / window.innerWidth - 0.5) * 45;
  const pointerInfluenceY = (pointerY / window.innerHeight - 0.5) * 35;
  const focusX = centerX + pointerInfluenceX;
  const focusY = centerY + pointerInfluenceY;

  context.save();
  context.globalAlpha = 0.24;
  context.strokeStyle = "#f2efe8";
  context.lineWidth = 1;
  [0.35, 0.55, 0.75, 1].forEach((scale) => {
    context.beginPath();
    context.ellipse(
      focusX,
      focusY,
      canvasWidth * 0.18 * scale,
      canvasHeight * 0.31 * scale,
      frame * 0.0008,
      0,
      Math.PI * 2
    );
    context.stroke();
  });
  context.restore();

  particles.forEach((particle, index) => {
    particle.angle += particle.speed;
    particle.burst *= 0.96;
    const wobble = Math.sin(frame * 0.012 + particle.phase) * 12;
    const radius = particle.radius + wobble + particle.burst;
    const x = focusX + Math.cos(particle.angle) * radius;
    const y = focusY + Math.sin(particle.angle) * radius * 0.54;

    context.beginPath();
    context.fillStyle = particle.color;
    context.globalAlpha = 0.35 + (index % 5) * 0.11;
    context.arc(x, y, particle.size + particle.burst * 0.04, 0, Math.PI * 2);
    context.fill();
  });

  context.globalAlpha = 1;
  frame += 1;
  if (!prefersReducedMotion) requestAnimationFrame(drawOrbit);
}

function detonate() {
  particles.forEach((particle) => {
    particle.burst = 25 + Math.random() * 95;
    particle.speed = 0.002 + Math.random() * 0.01;
  });
  window.setTimeout(() => {
    particles.forEach((particle) => {
      particle.speed = 0.001 + Math.random() * 0.004;
    });
  }, 1000);
}

window.addEventListener("resize", () => {
  resizeCanvas();
  seedParticles();
});

hero.addEventListener("click", detonate);
resizeCanvas();
seedParticles();
drawOrbit();

const palettes = [
  ["#c9ff2f", "#ff5c35", "#a87cff"],
  ["#00f5d4", "#ff3d81", "#ffee32"],
  ["#f7f7f2", "#39ff88", "#4d96ff"],
  ["#ffed4a", "#7b2cbf", "#ff7b00"],
];
let paletteIndex = 0;

chaosButton.addEventListener("click", () => {
  paletteIndex = (paletteIndex + 1) % palettes.length;
  const [acid, orange, purple] = palettes[paletteIndex];
  document.documentElement.style.setProperty("--acid", acid);
  document.documentElement.style.setProperty("--orange", orange);
  document.documentElement.style.setProperty("--purple", purple);
  detonate();
});
