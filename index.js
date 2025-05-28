AOS.init({
  once: true,
});

gsap.registerPlugin(ScrollTrigger);

const tween = gsap.to(".nav-list-item", {
  duration: 0.4,
  y: 0,
  ease: "power1.out",
  paused: true,
});

const menuButtonTween = gsap.to(".menu-btn", {
  duration: 0.2,
  rotation: 180,
  ease: "power1.out",
  paused: true,
});

const bgImgTween = gsap.to(".logo", {
  duration: 0.4,
  backgroundPosition: "75px 50%",
  ease: "power1.out",
  paused: true,
});

const ultween = gsap.to(".nav-list", {
  duration: 0.4,
  height: 290,
  ease: "power1.out",
  paused: true,
});

const menuBtn = document.querySelector(".menu-btn");
const navList = document.querySelector(".nav-list");
const navLinks = document.querySelectorAll(".nav-link");
let menuOpen = false;
let clicked = false;

menuBtn.addEventListener("click", () => {
  if (clicked) {
    tween.reverse();
    menuButtonTween.reverse();
    bgImgTween.reverse();
    ultween.reverse();
  } else {
    tween.play();
    menuButtonTween.play();
    bgImgTween.play();
    ultween.play();
  }

  clicked = !clicked;
  menuOpen = !menuOpen;

  navLinks.forEach((link) => {
    link.setAttribute("tabindex", menuOpen ? "0" : "-1");
  });

  menuBtn.setAttribute("aria-expanded", menuOpen ? "true" : "false");

  if (menuOpen) {
    trapFocus();
  }
});

function updateTabIndexBasedOnScreenSize() {
  const isLargeScreen = window.innerWidth >= 1024;

  navLinks.forEach((link) => {
    if (isLargeScreen) {
      link.setAttribute("tabindex", "0");
      if (menuOpen) {
        navList.style.height = "unset";
        menuOpen = true;
        clicked = true;
      } else {
        document.querySelectorAll(".nav-list-item").forEach((link) => {
          link.style = "none";
          link.style.display = "flex";
          link.style.alignItems = "center";
          link.style.justifyContent = "center";
        });
      }

      console.log(menuOpen, clicked);
    } else {
      link.setAttribute("tabindex", menuOpen ? "0" : "-1");
    }
  });
}

updateTabIndexBasedOnScreenSize();

window.addEventListener("resize", updateTabIndexBasedOnScreenSize);

function handleFirstTab(e) {
  if (e.key === "Tab") {
    document.body.classList.add("user-is-tabbing");
    window.removeEventListener("keydown", handleFirstTab);
    window.addEventListener("mousedown", handleMouseDownOnce);
  }
}

function handleMouseDownOnce() {
  document.body.classList.remove("user-is-tabbing");
  window.removeEventListener("mousedown", handleMouseDownOnce);
  window.addEventListener("keydown", handleFirstTab);
}

window.addEventListener("keydown", handleFirstTab);

const headerTL = gsap.timeline({
  scrollTrigger: {
    trigger: ".hero-section",
    start: "30% 10%",
    end: "+=20px",
    scrub: 0.5,
  },
});

headerTL.to("header", {
  padding: 0,
  ease: "power1.out",
});

headerTL.to(
  ".menu",
  {
    borderRadius: 0,
    ease: "power1.out",
  },
  "<"
);

// Trap Focus

function trapFocus() {
  const focusableEls = [menuBtn, ...navList.querySelectorAll("a.nav-link")];
  let firstEl = focusableEls[0];
  let lastEl = focusableEls[focusableEls.length - 1];

  document.addEventListener("keydown", function handleTab(e) {
    if (!menuOpen) return;

    if (e.key === "Tab") {
      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    } else if (e.key === "Escape") {

      menuOpen = false;
      navLinks.forEach((link) => link.setAttribute("tabindex", "-1"));
      navList.classList.remove("open");
      menuBtn.focus();
    }
  });
}

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
      color: randomStarColor(),
    });
  }
}

// Intersection Observer

const callback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      el.classList.add("visible");
    }
  });
};

const options = {
  root: null,
  rootMargin: "0px",
  threshold: [0.1, 0.9],
};

const observer = new IntersectionObserver(callback, options);

const targets = document.querySelectorAll("blockquote");

targets.forEach((target) => {
  observer.observe(target);
});

window.addEventListener("resize", resizeCanvas);

resizeCanvas();

animate();
