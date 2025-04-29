AOS.init({
  once: true
});

// Starry Sky

const canvas = document.getElementById("starry-sky");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];

for (let i = 0; i < 300; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.5,
    alpha: Math.random(),
    delta: Math.random() * 0.02,
    vx: (Math.random() - 0.5) * 0.1,
    vy: (Math.random() - 0.5) * 0.1,
    color: randomStarColor(),
  });
}

function randomStarColor() {
  const colors = ["#ffffff", "#ffe9c4", "#d4fbff", "#f9d7ff"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function hexToRGBA(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const shootingStars = [];

function createShootingStar() {
  shootingStars.push({
    x: Math.random() * canvas.width,
    y: (Math.random() * canvas.height) / 2,
    length: Math.random() * 250 + 250,
    speed: Math.random() * 7 + 10,
    size: Math.random() * 1 + 0.5,
    opacity: 0.8,
  });

  console.log("shooting");
}

setInterval(createShootingStar, 10000);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const star of stars) {
    star.alpha += star.delta;
    if (star.alpha <= 0 || star.alpha >= 1) star.delta = -star.delta;

    star.x += star.vx;
    star.y += star.vy;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = hexToRGBA(star.color, star.alpha);
    ctx.fill();

    if (star.x < 0) star.x = canvas.width;
    if (star.x > canvas.width) star.x = 0;
    if (star.y < 0) star.y = canvas.height;
    if (star.y > canvas.height) star.y = 0;
  }

  for (const shootingStar of shootingStars) {
    ctx.beginPath();
    ctx.moveTo(shootingStar.x, shootingStar.y);
    ctx.lineTo(
      shootingStar.x + shootingStar.length,
      shootingStar.y + shootingStar.length
    );
    ctx.strokeStyle = "purple";
    ctx.lineWidth = shootingStar.size;
    ctx.stroke();

    shootingStar.x += shootingStar.speed;
    shootingStar.y += shootingStar.speed;

    shootingStar.opacity -= 0.01;
    shootingStar.length *= 0.98;
  }

  requestAnimationFrame(animate);
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Clear existing stars
  stars.length = 0;
  shootingStars.length = 0;

  // Recreate stars
  for (let i = 0; i < 300; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      alpha: Math.random(),
      delta: Math.random() * 0.02,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      color: randomStarColor() // if you're using colored stars
    });
  }
}

window.addEventListener('resize', resizeCanvas);

resizeCanvas();

animate();
