// Interactive cloth hero: a spring-mass graph you can grab.
// Nodes + edges are drawn in the site's theme colors; pinned nodes are "actuators".
(function () {
  const canvas = document.getElementById("cloth-hero-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const PIN_COLOR = "#e63946";
  let nodeColor = "#0c8f87";
  let edgeColor = "#000000";

  function readThemeColors() {
    const style = getComputedStyle(document.documentElement);
    nodeColor = style.getPropertyValue("--global-theme-color").trim() || nodeColor;
    edgeColor = style.getPropertyValue("--global-text-color").trim() || edgeColor;
  }
  readThemeColors();
  new MutationObserver(readThemeColors).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  const GRAVITY = 0.32;
  const DAMPING = 0.985;
  const ITERATIONS = 3;
  const ROWS = 9;

  let nodes = [];
  let springs = [];
  let spacing = 24;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let running = false;
  let visible = true;
  let frame = 0;

  function build() {
    dpr = window.devicePixelRatio || 1;
    width = canvas.clientWidth || (canvas.parentElement ? canvas.parentElement.clientWidth : 600);
    height = canvas.clientHeight || 220;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    nodes = [];
    springs = [];
    const cols = Math.max(10, Math.floor(width / 26));
    spacing = (width - 16) / cols;
    const topY = 10;

    for (let r = 0; r <= ROWS; r++) {
      for (let c = 0; c <= cols; c++) {
        const x = 8 + c * spacing;
        const y = topY + r * spacing * 0.8;
        nodes.push({
          x: x,
          y: y,
          px: x,
          py: y,
          pinned: r === 0 && (c % 6 === 0 || c === cols),
        });
      }
    }
    for (let r = 0; r <= ROWS; r++) {
      for (let c = 0; c <= cols; c++) {
        const i = r * (cols + 1) + c;
        if (c < cols) springs.push([i, i + 1, spacing]);
        if (r < ROWS) springs.push([i, i + cols + 1, spacing * 0.8]);
      }
    }
  }

  function step() {
    frame++;
    const breeze = Math.sin(frame * 0.01) * 0.02;
    for (const n of nodes) {
      if (n.pinned || n === dragged) continue;
      const vx = (n.x - n.px) * DAMPING;
      const vy = (n.y - n.py) * DAMPING;
      n.px = n.x;
      n.py = n.y;
      n.x += vx + breeze + Math.sin(frame * 0.02 + n.y * 0.05) * 0.02;
      n.y += vy + GRAVITY;
    }
    for (let k = 0; k < ITERATIONS; k++) {
      for (const [a, b, rest] of springs) {
        const na = nodes[a];
        const nb = nodes[b];
        const dx = nb.x - na.x;
        const dy = nb.y - na.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
        const diff = ((dist - rest) / dist) * 0.5;
        const ox = dx * diff;
        const oy = dy * diff;
        if (!na.pinned && na !== dragged) {
          na.x += ox;
          na.y += oy;
        }
        if (!nb.pinned && nb !== dragged) {
          nb.x -= ox;
          nb.y -= oy;
        }
      }
      for (const n of nodes) {
        if (n.pinned || n === dragged) continue;
        if (n.y > height - 4) n.y = height - 4;
        if (n.x < 2) n.x = 2;
        if (n.x > width - 2) n.x = width - 2;
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = 0.16;
    ctx.strokeStyle = edgeColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (const [a, b] of springs) {
      ctx.moveTo(nodes[a].x, nodes[a].y);
      ctx.lineTo(nodes[b].x, nodes[b].y);
    }
    ctx.stroke();

    ctx.globalAlpha = 0.85;
    ctx.fillStyle = nodeColor;
    ctx.beginPath();
    for (const n of nodes) {
      if (n.pinned) continue;
      ctx.moveTo(n.x + 1.6, n.y);
      ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
    }
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.fillStyle = PIN_COLOR;
    ctx.beginPath();
    for (const n of nodes) {
      if (!n.pinned) continue;
      ctx.moveTo(n.x + 3.2, n.y);
      ctx.arc(n.x, n.y, 3.2, 0, Math.PI * 2);
    }
    ctx.fill();
  }

  function loop() {
    if (!running) return;
    step();
    draw();
    requestAnimationFrame(loop);
  }

  function start() {
    if (!running && visible && !reducedMotion) {
      running = true;
      requestAnimationFrame(loop);
    }
  }

  function stop() {
    running = false;
  }

  // Interaction: drag any node; brush the cloth by moving the pointer over it.
  let dragged = null;
  let lastPointer = null;

  function pointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function nearestNode(p, radius) {
    let best = null;
    let bestDist = radius * radius;
    for (const n of nodes) {
      const dx = n.x - p.x;
      const dy = n.y - p.y;
      const d = dx * dx + dy * dy;
      if (d < bestDist) {
        bestDist = d;
        best = n;
      }
    }
    return best;
  }

  canvas.addEventListener("pointerdown", (e) => {
    const p = pointerPos(e);
    dragged = nearestNode(p, 48);
    if (dragged) {
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    }
  });

  canvas.addEventListener("pointermove", (e) => {
    const p = pointerPos(e);
    if (dragged) {
      dragged.x = Math.min(Math.max(p.x, 2), width - 2);
      dragged.y = Math.min(Math.max(p.y, 2), height - 2);
      dragged.px = dragged.x;
      dragged.py = dragged.y;
    } else if (lastPointer) {
      const mvx = p.x - lastPointer.x;
      const mvy = p.y - lastPointer.y;
      for (const n of nodes) {
        if (n.pinned) continue;
        const dx = n.x - p.x;
        const dy = n.y - p.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 36) {
          const s = (1 - d / 36) * 0.4;
          n.x += mvx * s;
          n.y += mvy * s;
        }
      }
    }
    lastPointer = p;
  });

  function release(e) {
    if (dragged) {
      canvas.releasePointerCapture && e.pointerId != null && canvas.hasPointerCapture(e.pointerId) && canvas.releasePointerCapture(e.pointerId);
      dragged = null;
      canvas.style.cursor = "";
    }
  }
  canvas.addEventListener("pointerup", release);
  canvas.addEventListener("pointercancel", release);
  canvas.addEventListener("pointerleave", () => {
    lastPointer = null;
  });
  canvas.addEventListener("dblclick", () => {
    build();
  });

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      build();
      if (reducedMotion) settleAndDraw();
    }, 200);
  });

  new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      if (visible) start();
      else stop();
    },
    { threshold: 0 }
  ).observe(canvas);

  function settleAndDraw() {
    for (let i = 0; i < 180; i++) step();
    draw();
  }

  build();
  if (reducedMotion) {
    settleAndDraw();
  } else {
    start();
  }
})();
