function toggleLanguage(lang) {
  localStorage.setItem("preferredLanguage", lang);
  const enBtn = document.getElementById("enBtn");
  const deBtn = document.getElementById("deBtn");
  const enElements = document.querySelectorAll("[data-en]");
  const deElements = document.querySelectorAll("[data-de]");

  if (lang === "en") {
    enBtn.classList.add("active");
    deBtn.classList.remove("active");
    enElements.forEach((el) => (el.style.display = "block"));
    deElements.forEach((el) => (el.style.display = "none"));
  } else {
    deBtn.classList.add("active");
    enBtn.classList.remove("active");
    enElements.forEach((el) => (el.style.display = "none"));
    deElements.forEach((el) => (el.style.display = "block"));
  }
}

const canvas = document.getElementById("interactive-bg");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let mouseX = 0;
let mouseY = 0;
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const radius = 80;
  const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, radius);
  gradient.addColorStop(0, "rgba(255, 200, 200, 0.5)");
  gradient.addColorStop(1, "rgba(255, 200, 200, 0)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
  ctx.fill();

  requestAnimationFrame(draw);
}
draw();

// Create and initialize custom cursor
document.addEventListener("DOMContentLoaded", () => {
  // Use existing cursor element
  const customCursor = document.querySelector(".custom-cursor");

  // Update cursor position
  let cursorX = 0;
  let cursorY = 0;
  document.addEventListener("mousemove", (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    customCursor.style.left = cursorX + "px";
    customCursor.style.top = cursorY + "px";
  });

  // Grow on hover for interactive elements
  const interactiveElements = document.querySelectorAll("a, button, .hover-target, input, textarea, select");
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      customCursor.classList.add("hovered");
    });
    el.addEventListener("mouseleave", () => {
      customCursor.classList.remove("hovered");
    });
  });

  const savedLang = localStorage.getItem("preferredLanguage") || "en";
  toggleLanguage(savedLang);
});

document.addEventListener("mousemove", function (e) {
  document.documentElement.style.setProperty("--mouse-x", e.clientX + "px");
  document.documentElement.style.setProperty("--mouse-y", e.clientY + "px");
});

// --- ANIMATED DIAGONAL LINES BACKGROUND (Pilates page only) ---
document.addEventListener("DOMContentLoaded", function () {
  const bgCanvas = document.getElementById("bg-canvas");
  if (bgCanvas) {
    const ctx = bgCanvas.getContext("2d");
    function resizeBGCanvas() {
      bgCanvas.width = window.innerWidth;
      bgCanvas.height = window.innerHeight;
    }
    resizeBGCanvas();
    window.addEventListener("resize", resizeBGCanvas);

    // Four truly separate diagonal lines
    const lineDefs = [
      {
        color: "#fff9b2",
        width: 140,
        start: (w, h) => [w, 100],
        end: (w, h) => [0, w],
      },
      {
        color: "#b2f7ff",
        width: 140,
        start: (w, h) => [w, 0],
        end: (w, h) => [0, h],
      },
      {
        color: "#ff69b4",
        width: 140,
        start: (w, h) => [w, 0],
        end: (w, h) => [0, h - 350],
      },
      {
        color: "#baffc9",
        width: 110,
        start: (w, h) => [w, 0],
        end: (w, h) => [0, h - 700],
      },
    ];
    let progress = 0;
    const maxProgress = 1.1; // 1 = full diagonal, >1 for overshoot
    const speed = 0.012;

    function drawLines() {
      ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      lineDefs.forEach((line) => {
        ctx.save();
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.width;
        ctx.lineCap = "round";
        const [x0, y0] = line.start(bgCanvas.width, bgCanvas.height);
        const [x1, y1] = line.end(bgCanvas.width, bgCanvas.height);
        const dx = x1 - x0;
        const dy = y1 - y0;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x0 + dx * progress, y0 + dy * progress);
        ctx.stroke();
        ctx.restore();
      });
    }

    function animate() {
      if (progress < maxProgress) {
        progress += speed;
      } else {
        progress = maxProgress;
      }
      drawLines();
      if (progress < maxProgress) {
        requestAnimationFrame(animate);
      }
    }
    animate();
  }

  // --- Custom Cursor Logic (shared) ---
  const cursor = document.querySelector(".custom-cursor");
  if (cursor) {
    document.addEventListener("mousemove", (e) => {
      cursor.style.left = e.clientX - 8 + "px";
      cursor.style.top = e.clientY - 8 + "px";
      cursor.style.opacity = 1;
    });
    document.addEventListener("mouseleave", () => {
      cursor.style.opacity = 0;
    });
    document.addEventListener("mouseenter", () => {
      cursor.style.opacity = 1;
    });
    document.querySelectorAll("a, button").forEach((link) => {
      link.addEventListener("mouseenter", () => cursor.classList.add("active"));
      link.addEventListener("mouseleave", () => cursor.classList.remove("active"));
    });
  }
});

/* --- CONTACT PAGE BUBBLE GENERATION & BLOB POP INTERACTION --- */
document.addEventListener("DOMContentLoaded", function () {
  const accent = document.querySelector(".contact-bg-accent");
  if (accent) {
    const bubbleStyles = [
      { bg: "rgba( 255, 105, 180, 0.55 )", border: "#ff69b4", glow: "#ff69b4" },
      { bg: "rgba( 255, 249, 178, 0.55 )", border: "#fff9b2", glow: "#fff9b2" },
      { bg: "rgba( 178, 247, 255, 0.55 )", border: "#b2f7ff", glow: "#b2f7ff" },
      { bg: "rgba( 186, 104, 255, 0.55 )", border: "#ba68ff", glow: "#ba68ff" },
      { bg: "rgba( 255, 183, 77, 0.55 )", border: "#ffb74d", glow: "#ffb74d" },
    ];
    const blobCount = 22;
    for (let i = 0; i < blobCount; i++) {
      const blob = document.createElement("div");
      blob.className = "blob";
      let size;
      if (Math.random() < 0.18) {
        // 18% chance to be a giant bubble
        size = Math.random() * 80 + 140; // 140px to 220px
      } else {
        size = Math.random() * 70 + 40; // 40px to 110px
      }
      blob.style.width = `${size}px`;
      blob.style.height = `${size}px`;
      const style = bubbleStyles[Math.floor(Math.random() * bubbleStyles.length)];
      blob.style.setProperty("--bubble-bg", style.bg);
      blob.style.setProperty("--bubble-border", style.border);
      blob.style.setProperty("--bubble-glow", style.glow + "99");
      blob.style.left = `${Math.random() * 90}vw`;
      blob.style.top = `${Math.random() * 80}vh`;
      blob.style.animationDelay = `${Math.random() * 0.7}s`;
      accent.appendChild(blob);
    }

    // Blob pop interaction
    accent.querySelectorAll(".blob").forEach((blob) => {
      blob.addEventListener("mouseenter", () => {
        blob.classList.add("blob-pop");
      });
      blob.addEventListener("animationend", (e) => {
        if (e.animationName === "blobPop") {
          blob.classList.remove("blob-pop");
          // Move to a new random position, size, and color
          let size;
          if (Math.random() < 0.18) {
            size = Math.random() * 80 + 140;
          } else {
            size = Math.random() * 70 + 40;
          }
          blob.style.width = `${size}px`;
          blob.style.height = `${size}px`;
          const style = bubbleStyles[Math.floor(Math.random() * bubbleStyles.length)];
          blob.style.setProperty("--bubble-bg", style.bg);
          blob.style.setProperty("--bubble-border", style.border);
          blob.style.setProperty("--bubble-glow", style.glow + "99");
          blob.style.left = `${Math.random() * 90}vw`;
          blob.style.top = `${Math.random() * 80}vh`;
          setTimeout(() => {
            blob.style.opacity = 0.13;
            blob.style.transform = "scale(1)";
          }, 10);
        }
      });
    });
  }
});

/* --- INDEX PAGE SPECIFIC EFFECTS --- */
document.addEventListener("DOMContentLoaded", function () {
  // Check if we're on the index page by looking for specific elements
  const name = document.querySelector(".name");
  const subtitle = document.querySelector(".subtitle[data-en]");
  const sparkleContainer = document.getElementById("sparkle-container");
  const staticSparkleField = document.getElementById("static-sparkle-field");

  if (name && subtitle) {
    // Only run on index page
    // Playful wiggle effect for name and subtitle
    document.addEventListener("mousemove", (e) => {
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      name.style.transform = `translateY(${y * 12}px)`;
      subtitle.style.transform = `translateY(${y * 10}px)`;
    });
    document.addEventListener("mouseleave", () => {
      name.style.transform = "";
      subtitle.style.transform = "";
    });

    // Dynamic sparkle effect
    if (sparkleContainer) {
      function createSparkle(x, y) {
        const sparkle = document.createElement("div");
        const size = Math.random() * 8 + 6;
        const colors = ["#FFD700", "#FF69B4", "#87CEEB", "#fff", "#FFB347"];
        sparkle.style.position = "absolute";
        sparkle.style.left = `${x - size / 2}px`;
        sparkle.style.top = `${y - size / 2}px`;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.pointerEvents = "none";
        sparkle.style.borderRadius = "50%";
        sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
        sparkle.style.opacity = "0.85";
        sparkle.style.boxShadow = `0 0 16px 4px ${sparkle.style.background}55`;
        sparkle.style.transform = `scale(${Math.random() * 0.7 + 0.7}) rotate(${Math.random() * 360}deg)`;
        sparkle.style.transition = "opacity 0.7s, transform 0.7s";
        sparkleContainer.appendChild(sparkle);
        setTimeout(() => {
          sparkle.style.opacity = "0";
          sparkle.style.transform += " scale(1.7)";
        }, 10);
        setTimeout(() => {
          sparkle.remove();
        }, 700);
      }

      let sparkleThrottle = 0;
      document.addEventListener("mousemove", (e) => {
        sparkleThrottle++;
        if (sparkleThrottle % 2 === 0) {
          createSparkle(e.clientX, e.clientY);
        }
      });
    }

    // Static sparkle field
    if (staticSparkleField) {
      const staticSparkleCount = 400;
      const staticSparkles = [];
      const sandColors = ["#FFD700", "#FFB347", "#FFF8DC", "#EEDC82", "#F5DEB3"];

      for (let i = 0; i < staticSparkleCount; i++) {
        const grain = document.createElement("div");
        const color = sandColors[Math.floor(Math.random() * sandColors.length)];
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        grain.style.position = "absolute";
        grain.style.left = `${x}px`;
        grain.style.top = `${y}px`;
        grain.style.width = "4px";
        grain.style.height = "4px";
        grain.style.borderRadius = "50%";
        grain.style.background = color;
        grain.style.opacity = "0.8";
        grain.style.transition = "left 0.22s cubic-bezier(.4,2,.6,1), top 0.22s cubic-bezier(.4,2,.6,1)";
        staticSparkleField.appendChild(grain);
        staticSparkles.push({ el: grain, x: x, y: y });
      }

      document.addEventListener("mousemove", (e) => {
        staticSparkles.forEach((grain) => {
          const dx = e.clientX - grain.x;
          const dy = e.clientY - grain.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 60) {
            // Move away from cursor and update position
            const angle = Math.atan2(dy, dx);
            const moveDist = 30 * (1 - dist / 60);
            grain.x = grain.x - Math.cos(angle) * moveDist;
            grain.y = grain.y - Math.sin(angle) * moveDist;
            grain.el.style.left = `${grain.x}px`;
            grain.el.style.top = `${grain.y}px`;
          }
        });
      });
    }
  }
});
