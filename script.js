/* =========================================================
   UBAH BAGIAN INI SAJA
   ========================================================= */
const CONFIG = {
  nama: "Irfani",                // nama panggilan dia
  dari: "Rahmannuaji", // tanda tangan di akhir surat
  tanggalLahir: "2002-11-10",    // tanggal lahir dia, format TAHUN-BULAN-TANGGAL

  // Maksimal 8 buah. Taruh foto di folder images/ lalu tulis namanya di sini.
  // Kalau fotonya belum ada, buahnya tetap tampil dengan nomor.
  buah: [
    { foto: "images/WhatsApp Image 2026-10-05 at 22.40.20.jpeg", kata: "Dari semua hal baik yang pernah terjadi padaku, kamu yang paling aku syukuri." },
    { foto: "images/WhatsApp Image 2026-11-09 at 14.14.01 (1).jpeg", kata: "Senyummu itu cara paling sederhana untuk membuat hariku jadi baik." },
    { foto: "images/WhatsApp Image 2026-11-09 at 14.14.01 (2).jpeg", kata: "Terima kasih sudah hadir di dunia ini dan menjadi salah satu alasan hari-hariku terasa lebih menyenangkan" },
    { foto: "images/WhatsApp Image 2026-11-09 at 14.14.01 (3).jpeg", kata: "Aku suka caramu tertawa, apalagi saat menertawakan leluconku yang garing." },
    { foto: "images/WhatsApp Image 2026-11-09 at 14.14.01 (4).jpeg", kata: "Semoga kamu selalu menemukan alasan untuk tersenyum, bahkan di hari-hari yang terasa berat." },
    { foto: "images/WhatsApp Image 2026-11-09 at 14.14.01 (5).jpeg", kata: "Semoga tahun ini lembut padamu, selembut caramu memperlakukan orang lain." },
    { foto: "images/WhatsApp Image 2026-11-09 at 14.14.01 (6).jpeg", kata: "Semoga semua hal yang sedang kamu usahakan menemukan jalan terbaiknya." },
    { foto: "images/WhatsApp Image 2026-11-09 at 14.14.01 (7).jpeg", kata: "Semoga di tahun ini semakin banyak hal baik datang menghampirimu" },
  ],

  surat: {
    salam: "Bee,",
    isi: [
      "Selamat ulang tahun. Semoga hari ini terasa hangat, seperti caramu membuat orang-orang di sekitarmu merasa nyaman.",
      "Terima kasih untuk sabarmu, untuk tawamu, untuk caramu membuat hal-hal kecil terasa berarti. Halaman ini sederhana, tapi setiap buah di pohon itu adalah rasa sayangku untukmu.",
      "Semoga di umur yang baru ini kamu selalu sehat, dimudahkan langkahnya, dan dikelilingi orang-orang yang sayang sama kamu.",
      "Wish You All The Best",
    ],
  },
};
/* ========================================================= */

// Posisi buah di pohon (% dari kiri, % dari atas), dalam ruang gambar pohon 600x600.
const SPOTS = [[50, 15.8], [35.8, 26.7], [64.2, 25.8], [25, 42.5], [50, 35.8], [75, 41.7], [38.3, 50], [61.7, 50.8]];

// Umur dalam tahun + hari sejak ulang tahun terakhir + hari menuju ulang tahun berikutnya.
// Lahir 29 Feb: di tahun bukan kabisat dihitung 1 Maret (perilaku bawaan Date).
function ageInfo(birth, now) {
  const [by, bm, bd] = birth.split("-").map(Number);
  const DAY = 864e5;
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  let year = now.getFullYear();
  if (Date.UTC(year, bm - 1, bd) > today) year--;
  const last = Date.UTC(year, bm - 1, bd);
  const next = Date.UTC(year + 1, bm - 1, bd);
  return {
    years: year - by,
    days: Math.round((today - last) / DAY),
    untilNext: Math.round((next - today) / DAY),
  };
}

// Tengah malam (waktu lokal) ulang tahun berikutnya yang masih di depan `now`.
function nextBirthday(birth, now) {
  const [, m, d] = birth.split("-").map(Number);
  const t = new Date(now.getFullYear(), m - 1, d);
  return t > now ? t : new Date(now.getFullYear() + 1, m - 1, d);
}

/* ---------------- Pohon (digambar sekali, selalu sama bentuknya) ---------------- */

function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GREENS = ["#222c17", "#2f3c1d", "#425326", "#586c31", "#71873f", "#8fa352", "#b2c374", "#d0dc98"];
const LIGHT = [-0.55, -0.83]; // cahaya datang dari kiri atas

function buildTree() {
  const R = rng(20021110);
  const env = (x, y) => ((x - 300) / 272) ** 2 + ((y - 196) / 184) ** 2; // <1 = di dalam tajuk
  const branches = [];
  const tips = [];

  function grow(x, y, ang, len, w, depth) {
    let x1 = x + Math.cos(ang) * len;
    let y1 = y + Math.sin(ang) * len;
    if (env(x1, y1) > 1) {
      len *= 0.55;
      x1 = x + Math.cos(ang) * len;
      y1 = y + Math.sin(ang) * len;
      depth = Math.min(depth, 1);
    }
    const bend = (R() - 0.5) * 0.6;
    branches.push({ x0: x, y0: y, cx: x + Math.cos(ang + bend) * len * 0.5, cy: y + Math.sin(ang + bend) * len * 0.5, x1, y1, w0: w, w1: w * 0.68 });
    if (!depth) { tips.push([x1, y1]); return; }
    const n = depth > 3 ? 2 : R() < 0.45 ? 3 : 2;
    for (let i = 0; i < n; i++) {
      const side = n === 2 ? (i ? 1 : -1) : i - 1;
      let a = ang + side * (0.32 + R() * 0.3) + (R() - 0.5) * 0.2 + (-Math.PI / 2 - ang) * 0.1;
      a = Math.min(-0.12, Math.max(-Math.PI + 0.12, a));
      grow(x1, y1, a, len * (0.7 + R() * 0.12), w * 0.68, depth - 1);
    }
  }
  [[-2.5, 92, 19], [-1.95, 104, 23], [-1.2, 104, 23], [-0.64, 92, 19]].forEach(([a, l, w], i) => grow(288 + i * 8, 392, a, l, w, 5));

  // gumpalan daun: di ujung ranting, di belakang tiap buah, dan pengisi supaya tajuk rimbun
  const clumps = tips.map(([x, y]) => ({ x, y, r: 20 + R() * 12 }));
  SPOTS.forEach(([px, py]) => clumps.push({ x: px * 6, y: py * 6, r: 34 }));
  for (let y = 40; y < 380; y += 40) {
    for (let x = 40; x < 580; x += 40) {
      const jx = x + (R() - 0.5) * 30, jy = y + (R() - 0.5) * 30;
      if (env(jx, jy) > 0.82) continue;
      if (clumps.some((c) => (c.x - jx) ** 2 + (c.y - jy) ** 2 < 900)) continue;
      clumps.push({ x: jx, y: jy, r: 26 + R() * 10 });
    }
  }
  clumps.sort((a, b) => a.y - b.y); // yang lebih bawah menimpa yang di atas, terlihat berlapis

  for (const c of clumps) {
    c.levels = GREENS.map(() => []);
    const g = 1 - (c.y - 20) / 370;           // makin atas makin terang
    const e = Math.sqrt(env(c.x, c.y));        // makin ke tepi makin kena cahaya
    const count = Math.round(c.r * c.r * 0.075);
    for (let i = 0; i < count; i++) {
      const ang = R() * Math.PI * 2, d = Math.sqrt(R()) * c.r;
      const dx = Math.cos(ang) * d, dy = Math.sin(ang) * d;
      const t = (dx * LIGHT[0] + dy * LIGHT[1]) / c.r;
      const s = 0.5 + t * 0.34 + (g - 0.5) * 0.36 + (e - 0.5) * 0.2 + (R() - 0.5) * 0.26;
      const lv = Math.max(0, Math.min(GREENS.length - 1, Math.round(s * (GREENS.length - 1))));
      const rx = 4 + R() * 3.6;
      c.levels[lv].push(c.x + dx, c.y + dy, rx, rx * (0.4 + R() * 0.16), R() * Math.PI);
    }
  }

  // bunga kecil di sisi tajuk yang terkena cahaya
  const blossoms = [];
  while (blossoms.length < 75 * 3) {
    const c = clumps[Math.floor(R() * clumps.length)];
    const ang = -2.2 + (R() - 0.5) * 2, d = R() * c.r * 0.9;
    blossoms.push(c.x + Math.cos(ang) * d, c.y + Math.sin(ang) * d, 2 + R() * 1.4);
  }
  return { branches, clumps, blossoms, seed: R };
}

function drawBranch(ctx, b) {
  const steps = b.w0 > 6 ? 6 : 3;
  // sisi ranting yang menghadap cahaya diberi garis terang supaya terlihat silinder
  let nx = -(b.y1 - b.y0), ny = b.x1 - b.x0;
  const nl = Math.hypot(nx, ny) || 1;
  nx /= nl; ny /= nl;
  if (nx * LIGHT[0] + ny * LIGHT[1] < 0) { nx = -nx; ny = -ny; }
  let px = b.x0, py = b.y0;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps, u = 1 - t;
    const x = u * u * b.x0 + 2 * u * t * b.cx + t * t * b.x1;
    const y = u * u * b.y0 + 2 * u * t * b.cy + t * t * b.y1;
    const w = b.w0 + (b.w1 - b.w0) * t;
    ctx.strokeStyle = "#3a271e";
    ctx.lineWidth = w;
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke();
    if (w > 2.5) {
      const o = w * 0.2;
      ctx.strokeStyle = "rgba(160, 120, 95, .5)";
      ctx.lineWidth = w * 0.3;
      ctx.beginPath(); ctx.moveTo(px + nx * o, py + ny * o); ctx.lineTo(x + nx * o, y + ny * o); ctx.stroke();
    }
    px = x; py = y;
  }
}

function drawCrown(ctx, T) {
  ctx.lineCap = "round";
  T.branches.forEach((b) => drawBranch(ctx, b));

  // massa gelap di bawah daun = kedalaman tajuk
  ctx.fillStyle = "#1f2814";
  ctx.beginPath();
  for (const c of T.clumps) { ctx.moveTo(c.x + c.r * 0.72, c.y); ctx.arc(c.x, c.y, c.r * 0.72, 0, Math.PI * 2); }
  ctx.fill();

  for (const c of T.clumps) {
    c.levels.forEach((pts, lv) => {
      if (!pts.length) return;
      ctx.fillStyle = GREENS[lv];
      ctx.beginPath();
      for (let i = 0; i < pts.length; i += 5) {
        const [x, y, rx, ry, rot] = [pts[i], pts[i + 1], pts[i + 2], pts[i + 3], pts[i + 4]];
        ctx.moveTo(x + rx * Math.cos(rot), y + rx * Math.sin(rot));
        ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
      }
      ctx.fill();
    });
  }

  // bunga: 5 kelopak + putik
  const B = T.blossoms;
  [["#f4d3ca", 0], ["#e3a395", 1]].forEach(([col, k]) => {
    ctx.fillStyle = col;
    ctx.beginPath();
    for (let i = k * 3; i < B.length; i += 6) {
      for (let p = 0; p < 5; p++) {
        const a = p * 1.2566 + i;
        const x = B[i] + Math.cos(a) * B[i + 2], y = B[i + 1] + Math.sin(a) * B[i + 2];
        ctx.moveTo(x + B[i + 2] * 0.8, y);
        ctx.arc(x, y, B[i + 2] * 0.8, 0, Math.PI * 2);
      }
    }
    ctx.fill();
  });
  ctx.fillStyle = "#f2d590";
  ctx.beginPath();
  for (let i = 0; i < B.length; i += 3) { ctx.moveTo(B[i] + 1.1, B[i + 1]); ctx.arc(B[i], B[i + 1], 1.1, 0, Math.PI * 2); }
  ctx.fill();

  // cahaya matahari hangat dari kiri atas, bayangan di bagian bawah tajuk
  ctx.globalCompositeOperation = "source-atop";
  const sun = ctx.createRadialGradient(170, 60, 10, 170, 60, 430);
  sun.addColorStop(0, "rgba(255, 236, 190, .3)");
  sun.addColorStop(1, "rgba(255, 236, 190, 0)");
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, 600, 600);
  const shade = ctx.createLinearGradient(0, 220, 0, 400);
  shade.addColorStop(0, "rgba(20, 22, 10, 0)");
  shade.addColorStop(1, "rgba(20, 22, 10, .4)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, 600, 600);
  ctx.globalCompositeOperation = "source-over";
}

function drawBase(ctx) {
  const R = rng(1110);
  // bayangan tanah
  ctx.save();
  ctx.translate(300, 574);
  ctx.scale(1, 0.09);
  const sh = ctx.createRadialGradient(0, 0, 0, 0, 0, 240);
  sh.addColorStop(0, "rgba(40, 28, 20, .38)");
  sh.addColorStop(1, "rgba(40, 28, 20, 0)");
  ctx.fillStyle = sh;
  ctx.beginPath(); ctx.arc(0, 0, 240, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // batang + akar
  const trunk = new Path2D("M214 576C252 570 266 548 270 512C274 474 277 432 275 380L325 380C323 432 326 474 330 512C334 548 348 570 386 576Z");
  const roots = new Path2D("M240 574C226 577 202 580 184 582C208 571 232 565 254 559Z M360 574C374 577 398 580 416 582C392 571 368 565 346 559Z M290 570C287 577 282 583 274 587C291 585 301 580 308 571Z");
  const bark = ctx.createLinearGradient(262, 0, 338, 0);
  bark.addColorStop(0, "#4d3529");
  bark.addColorStop(0.3, "#8a634f");
  bark.addColorStop(0.55, "#6b4b3c");
  bark.addColorStop(1, "#2b1c16");
  ctx.fillStyle = bark;
  ctx.fill(roots);
  ctx.fill(trunk);

  // serat kulit kayu mengikuti lekuk batang
  ctx.save();
  ctx.clip(trunk);
  const hw = (y) => (y < 512 ? 25 + ((y - 380) / 132) * 5 : 30 + ((y - 512) / 64) ** 2 * 56);
  for (let i = 0; i < 44; i++) {
    const u = (i + R() * 0.6) / 44;
    ctx.beginPath();
    for (let y = 378; y <= 580; y += 8) {
      const x = 300 + (u - 0.5) * 2 * hw(y) + Math.sin(y * 0.05 + i * 1.7) * 1.8;
      y === 378 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = i % 3 ? "rgba(28, 16, 10, .38)" : "rgba(205, 165, 135, .2)";
    ctx.lineWidth = 0.8 + R() * 1.6;
    ctx.stroke();
  }
  // mata kayu
  ctx.fillStyle = "rgba(25, 14, 9, .55)";
  ctx.beginPath(); ctx.ellipse(291, 468, 4, 8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "rgba(205, 165, 135, .35)";
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.ellipse(291, 468, 6.5, 11, 0, 0, Math.PI * 2); ctx.stroke();
  const side = ctx.createLinearGradient(214, 0, 386, 0);
  side.addColorStop(0.25, "rgba(255, 230, 200, .14)");
  side.addColorStop(0.5, "rgba(0, 0, 0, 0)");
  side.addColorStop(1, "rgba(0, 0, 0, .35)");
  ctx.fillStyle = side;
  ctx.fillRect(200, 370, 200, 220);
  ctx.restore();

  // rumput
  ctx.lineCap = "round";
  ctx.lineWidth = 1.5;
  ["#4f6230", "#6d8240", "#93a65d"].forEach((col, k) => {
    ctx.strokeStyle = col;
    ctx.beginPath();
    for (let i = 0; i < 70; i++) {
      const x = 130 + R() * 340;
      const y = 575 + (R() - 0.5) * 9;
      const h = (5 + R() * 13) * (1 - Math.abs(x - 300) / 230) + 3 - k;
      const lean = (R() - 0.5) * 9;
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + lean * 0.3, y - h * 0.6, x + lean, y - h);
    }
    ctx.stroke();
  });
  // kelopak yang jatuh di tanah
  ctx.fillStyle = "#e3a99b";
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const x = 170 + R() * 260, y = 574 + (R() - 0.5) * 10;
    ctx.moveTo(x + 2.6, y);
    ctx.ellipse(x, y, 2.6, 1.3, R() * 3, 0, Math.PI * 2);
  }
  ctx.fill();
}

// gambar ulang sesuai ukuran layar (tajam di layar retina)
function paintCanvas(canvas, draw) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const px = Math.round(canvas.clientWidth * dpr);
  if (!px || canvas.width === px) return;
  canvas.width = canvas.height = px;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(px / 600, 0, 0, px / 600, 0, 0);
  draw(ctx);
}

/* ---------------- Efek: kelopak berjatuhan & lampu ---------------- */

function startPetals(canvas) {
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const COLORS = ["#e2b6a9", "#d99a8c", "#f1cdc4", "#c98a7e", "#efc2b5", "#a9b77f"];
  let W, H;
  const fit = () => {
    W = innerWidth; H = innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  fit();
  addEventListener("resize", fit);
  const spawn = (anywhere) => ({
    x: Math.random() * W,
    y: anywhere ? Math.random() * H : -20,
    s: 5 + Math.random() * 6,
    vy: 22 + Math.random() * 34,
    sw: 18 + Math.random() * 40,
    ph: Math.random() * 6.28,
    rot: Math.random() * 6.28,
    vr: (Math.random() - 0.5) * 1.6,
    c: COLORS[Math.floor(Math.random() * COLORS.length)],
  });
  const P = Array.from({ length: W < 600 ? 16 : 30 }, () => spawn(true));
  let last = performance.now();
  (function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    ctx.clearRect(0, 0, W, H);
    for (const p of P) {
      p.y += p.vy * dt; p.ph += dt * 1.3; p.rot += p.vr * dt;
      if (p.y > H + 20) Object.assign(p, spawn(false));
      ctx.save();
      ctx.translate(p.x + Math.sin(p.ph) * p.sw, p.y);
      ctx.rotate(p.rot);
      ctx.scale(Math.cos(p.ph * 1.7), 1);
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.moveTo(0, -p.s);
      ctx.quadraticCurveTo(p.s * 0.95, -p.s * 0.2, 0, p.s);
      ctx.quadraticCurveTo(-p.s * 0.95, -p.s * 0.2, 0, -p.s);
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(frame);
  })(last);
}

function buildLights() {
  const COLORS = ["#ffd98a", "#f5ad9c", "#fff0c4"];
  document.querySelectorAll(".strand").forEach((s, k) => {
    const sag = +s.dataset.sag, n = 22, h = sag + 12;
    const svg = s.querySelector("svg");
    svg.setAttribute("viewBox", `0 0 100 ${h}`);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.style.height = h + "px";
    const path = s.querySelector("path");
    path.setAttribute("d", `M0,4 Q50,${4 + 2 * sag} 100,4`);
    path.setAttribute("vector-effect", "non-scaling-stroke");
    for (let i = 1; i < n; i++) {
      const t = i / n;
      const b = document.createElement("span");
      b.className = "bulb";
      b.style.left = t * 100 + "%";
      b.style.top = 4 + sag * (1 - (2 * t - 1) ** 2) + "px";
      b.style.setProperty("--c", COLORS[(i + k) % 3]);
      b.style.setProperty("--tw", 1.4 + Math.random() * 2.4 + "s");
      b.style.setProperty("--td", -Math.random() * 4 + "s");
      s.append(b);
    }
  });
}

/* ---------------- Kuis statistika ---------------- */

// Paradoks ulang tahun: peluang minimal dua dari n orang berulang tahun sama (365 hari, seragam).
function birthdayP(n) {
  let q = 1;
  for (let k = 0; k < n; k++) q *= (365 - k) / 365;
  return 1 - q;
}

const pct = (p, d = 1) => (p * 100).toLocaleString("id-ID", { minimumFractionDigits: d, maximumFractionDigits: d }) + "%";
const dec = (v, d = 2) => v.toLocaleString("id-ID", { minimumFractionDigits: d, maximumFractionDigits: d });

function chartBday(svg, tip) {
  const W = 400, H = 210, L = 44, R = 12, T = 16, B = 38, N = 60;
  const x = (n) => L + ((n - 1) / (N - 1)) * (W - L - R);
  const y = (p) => T + (1 - p) * (H - T - B);
  let d = "";
  for (let n = 1; n <= N; n++) d += (n > 1 ? "L" : "M") + x(n).toFixed(1) + "," + y(birthdayP(n)).toFixed(1);
  const ticks = [10, 20, 30, 40, 50, 60].map((n) => `<text x="${x(n)}" y="${H - B + 18}" text-anchor="middle">${n}</text>`).join("");
  const p23 = birthdayP(23);
  svg.innerHTML = `
    <line class="grid" x1="${L}" x2="${W - R}" y1="${y(0)}" y2="${y(0)}"/>
    <line class="grid" x1="${L}" x2="${W - R}" y1="${y(1)}" y2="${y(1)}"/>
    <line class="ref" x1="${L}" x2="${W - R}" y1="${y(0.5)}" y2="${y(0.5)}"/>
    <text x="${L - 8}" y="${y(0) + 4}" text-anchor="end">0%</text>
    <text x="${L - 8}" y="${y(0.5) + 4}" text-anchor="end">50%</text>
    <text x="${L - 8}" y="${y(1) + 4}" text-anchor="end">100%</text>
    ${ticks}
    <text x="${(L + W - R) / 2}" y="${H - 2}" text-anchor="middle">jumlah orang</text>
    <path class="line" d="${d}"/>
    <line class="ref" x1="${x(23)}" x2="${x(23)}" y1="${y(p23)}" y2="${y(0)}"/>
    <circle class="dot" cx="${x(23)}" cy="${y(p23)}" r="5"/>
    <text class="lbl" x="${x(23) + 10}" y="${y(p23) + 18}">23 orang · ${pct(p23)}</text>
    <g class="cross" visibility="hidden"><line class="grid" y1="${T}" y2="${y(0)}"/><circle class="dot" r="5"/></g>
    <rect class="hit" x="${L}" y="${T}" width="${W - L - R}" height="${H - T - B}"/>`;
  const cross = svg.querySelector(".cross");
  let cur = 23;
  const show = (n) => {
    cur = Math.max(1, Math.min(N, n));
    const p = birthdayP(cur);
    cross.setAttribute("visibility", "visible");
    cross.querySelector("line").setAttribute("x1", x(cur));
    cross.querySelector("line").setAttribute("x2", x(cur));
    cross.querySelector("circle").setAttribute("cx", x(cur));
    cross.querySelector("circle").setAttribute("cy", y(p));
    tip.hidden = false;
    tip.textContent = `${cur} orang · ${pct(p)}`;
    tip.style.left = (x(cur) / W) * 100 + "%";
    tip.style.top = (y(p) / H) * 100 + "%";
  };
  const hide = () => { cross.setAttribute("visibility", "hidden"); tip.hidden = true; };
  svg.addEventListener("pointermove", (e) => {
    const r = svg.getBoundingClientRect();
    const sx = ((e.clientX - r.left) / r.width) * W;
    show(Math.round(1 + ((sx - L) / (W - L - R)) * (N - 1)));
  });
  svg.addEventListener("pointerleave", hide);
  svg.addEventListener("focus", () => show(cur));
  svg.addEventListener("blur", hide);
  svg.addEventListener("keydown", (e) => {
    const step = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
    if (step) { e.preventDefault(); show(cur + step); }
  });
}

function chartNormal(svg) {
  const W = 400, H = 190, L = 16, R = 16, T = 20, B = 40;
  const pdf = (z) => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
  const x = (z) => L + ((z + 4) / 8) * (W - L - R);
  const y = (v) => T + (1 - v / pdf(0)) * (H - T - B);
  const curve = (a, b) => {
    let d = `M${x(a)},${y(0)}`;
    for (let z = a; z <= b + 1e-9; z += 0.05) d += `L${x(z).toFixed(1)},${y(pdf(z)).toFixed(1)}`;
    return d + `L${x(b)},${y(0)}Z`;
  };
  const ticks = [-3, -2, -1, 0, 1, 2, 3].map((z) =>
    `<text x="${x(z)}" y="${H - B + 18}" text-anchor="middle">${z === 0 ? "μ" : (z > 0 ? "+" : "−") + Math.abs(z) + "σ"}</text>`).join("");
  svg.innerHTML = `
    <path d="${curve(-4, 4)}" fill="#f1d5cb"/>
    <path d="${curve(-4, -3)}" fill="var(--rose-deep)"/>
    <path d="${curve(3, 4)}" fill="var(--rose-deep)"/>
    <path class="line" d="${curve(-4, 4).replace(/Z$/, "")}"/>
    <line class="grid" x1="${L}" x2="${W - R}" y1="${y(0)}" y2="${y(0)}"/>
    <line class="ref" x1="${x(-3)}" x2="${x(-3)}" y1="${y(0)}" y2="${T + 40}"/>
    <line class="ref" x1="${x(3)}" x2="${x(3)}" y1="${y(0)}" y2="${T + 40}"/>
    ${ticks}
    <text x="${(L + W - R) / 2}" y="${H - 2}" text-anchor="middle">jarak dari rata-rata</text>
    <use href="#i-heart" x="${x(3.5) - 9}" y="${y(0) - 26}" width="18" height="18"/>
    <text class="lbl" x="${x(3)}" y="${T + 32}" text-anchor="middle">kamu</text>
    <text x="${x(-3)}" y="${T + 32}" text-anchor="middle">luar ±3σ: 0,27%</text>`;
}

function chartLLN(svg, reduce) {
  const W = 400, H = 200, L = 40, R = 12, T = 14, B = 38, N = 400;
  const x = (n) => L + ((n - 1) / (N - 1)) * (W - L - R);
  const y = (p) => T + (1 - p) * (H - T - B);
  let heads = 0, d = "";
  for (let n = 1; n <= N; n++) {
    heads += Math.random() < 0.5 ? 1 : 0;
    d += (n > 1 ? "L" : "M") + x(n).toFixed(1) + "," + y(heads / n).toFixed(1);
  }
  const ticks = [1, 100, 200, 300, 400].map((n) => `<text x="${x(n)}" y="${H - B + 18}" text-anchor="middle">${n}</text>`).join("");
  svg.innerHTML = `
    <line class="grid" x1="${L}" x2="${W - R}" y1="${y(0)}" y2="${y(0)}"/>
    <line class="grid" x1="${L}" x2="${W - R}" y1="${y(1)}" y2="${y(1)}"/>
    <line class="ref" x1="${L}" x2="${W - R}" y1="${y(0.5)}" y2="${y(0.5)}"/>
    <text x="${L - 8}" y="${y(0) + 4}" text-anchor="end">0</text>
    <text x="${L - 8}" y="${y(0.5) + 4}" text-anchor="end">0,5</text>
    <text x="${L - 8}" y="${y(1) + 4}" text-anchor="end">1</text>
    ${ticks}
    <text x="${(L + W - R) / 2}" y="${H - 2}" text-anchor="middle">banyak lemparan</text>
    <path class="line" d="${d}" pathLength="1"/>
    <circle class="dot" cx="${x(N)}" cy="${y(heads / N)}" r="5"/>
    <text class="lbl" x="${W - R}" y="${y(heads / N) + (heads / N > 0.5 ? -12 : 22)}" text-anchor="end">${dec(heads / N)}</text>`;
  if (!reduce) {
    svg.querySelector(".line").animate([{ strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDasharray: 1, strokeDashoffset: 0 }], { duration: 1600, easing: "cubic-bezier(.16,1,.3,1)" });
  }
}

function initQuiz({ $, reduce, fire, heart, prevAge }) {
  document.querySelectorAll(".quiz-name").forEach((el) => (el.textContent = CONFIG.nama));
  $("q2-age").hidden = prevAge !== 23;

  // persamaan dirender KaTeX; kalau CDN gagal, teks biasa di dalam elemen tetap terbaca
  if (window.katex) {
    document.querySelectorAll("[data-tex]").forEach((el) =>
      katex.render(el.dataset.tex, el, { displayMode: true, throwOnError: false }));
  }

  chartBday($("chart-bday"), $("tip-bday"));
  chartNormal($("chart-normal"));

  const opened = new Set();
  const all = document.querySelectorAll(".q details");
  all.forEach((d, i) => d.addEventListener("toggle", () => {
    if (!d.open) return;
    if (d.id === "q-lln" && !opened.has(i)) chartLLN($("chart-lln"), reduce);
    opened.add(i);
    if (opened.size === all.length && !$("grade").classList.contains("done")) {
      $("grade-num").textContent = "100";
      $("grade").classList.add("done");
      const r = $("grade").getBoundingClientRect();
      fire({ particleCount: 50, spread: 70, startVelocity: 30, shapes: [heart], scalar: 1.4, origin: { x: (r.left + r.width / 2) / innerWidth, y: (r.top + r.height / 2) / innerHeight } });
    }
  }));
  $("rerun").addEventListener("click", () => chartLLN($("chart-lln"), reduce));
}

/* ---------------- Halaman ---------------- */

function init() {
  const $ = (id) => document.getElementById(id);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fruits = CONFIG.buah.slice(0, SPOTS.length);
  const picked = new Set();
  const [by, bm, bd] = CONFIG.tanggalLahir.split("-").map(Number);
  const longDate = (d) => d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  // --- confetti (library dari CDN; halaman tetap jalan kalau gagal dimuat) ---
  const PALETTE = ["#934535", "#c98a7e", "#e2b6a9", "#f6cabf", "#a9b77f", "#ffd98a"];
  const heart = window.confetti && confetti.shapeFromPath
    ? confetti.shapeFromPath({ path: "M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z" })
    : "circle";
  const fire = (opts, inst = window.confetti) => inst && !reduce && inst({ colors: PALETTE, disableForReducedMotion: true, ...opts });
  function celebrate(big) {
    fire({ particleCount: big ? 130 : 70, angle: 60, spread: 70, startVelocity: big ? 62 : 48, origin: { x: 0, y: 0.75 } });
    fire({ particleCount: big ? 130 : 70, angle: 120, spread: 70, startVelocity: big ? 62 : 48, origin: { x: 1, y: 0.75 } });
    if (big) setTimeout(() => fire({ particleCount: 90, spread: 130, startVelocity: 38, origin: { y: 0.35 }, shapes: [heart], scalar: 1.6 }), 450);
  }

  // --- umur & hitung mundur ---
  let isToday = false;
  function renderAge() {
    const a = ageInfo(CONFIG.tanggalLahir, new Date());
    isToday = a.days === 0;
    const soon = !isToday && a.untilNext <= 7;
    const ord = soon ? a.years + 1 : a.years; // menjelang hari-H, judul sudah memakai umur barunya
    $("ord").textContent = `ke-${ord}`;
    $("stamp-ord").textContent = `ke-${ord}`;
    document.title = `Selamat ulang tahun ke-${ord}, ${CONFIG.nama}`;
    if (isToday) {
      $("age").innerHTML = `Hari ini kamu genap <b>${ord}</b> tahun.`;
      $("age-sub").textContent = "Selamat datang di umur yang baru. Aku senang bisa merayakannya bersamamu.";
    } else if (soon) {
      $("age").innerHTML = `${a.untilNext === 1 ? "Besok" : `${a.untilNext} hari lagi`} kamu genap <b>${ord}</b> tahun.`;
      $("age-sub").textContent = "Aku ingin jadi orang pertama yang mengucapkannya.";
    } else {
      $("age").innerHTML = `Hari ini kamu sudah <b>${a.years}</b> tahun <b>${a.days}</b> hari.`;
      $("age-sub").textContent = `${a.untilNext} hari lagi menuju ${a.years + 1}, dan aku ingin menemanimu di setiap harinya.`;
    }
    $("cd-wrap").hidden = isToday;
    $("dateline").textContent = longDate(new Date(by + ord, bm - 1, bd));
  }

  const dayMonth = new Date(2000, bm - 1, bd).toLocaleDateString("id-ID", { day: "numeric", month: "long" });
  $("cd-title").textContent = `Menuju ${dayMonth}`;
  $("pm-text").textContent = `${dayMonth.toUpperCase()} ${by} · HARI LAHIRMU ·`;
  $("pm-center").textContent = `${bd}·${bm}`;
  $("name").textContent = CONFIG.nama;
  renderAge();
  setInterval(renderAge, 60_000);
  document.addEventListener("visibilitychange", () => document.hidden || renderAge());

  const cells = {};
  document.querySelectorAll(".cd-num").forEach((el) => (cells[el.dataset.k] = el));
  let target = nextBirthday(CONFIG.tanggalLahir, new Date());
  function tick() {
    const ms = target - Date.now();
    if (ms <= 0) {
      target = nextBirthday(CONFIG.tanggalLahir, new Date());
      renderAge();
      celebrate(true);
      return;
    }
    const s = Math.floor(ms / 1000);
    const vals = { d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24, m: Math.floor(s / 60) % 60, s: s % 60 };
    for (const k in vals) {
      const v = String(vals[k]).padStart(2, "0");
      if (cells[k].textContent === v) continue;
      cells[k].textContent = v;
      if (!reduce) cells[k].animate([{ transform: "translateY(-45%)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 380, easing: "cubic-bezier(.16,1,.3,1)" });
    }
  }
  tick();
  setInterval(tick, 1000);

  $("party").addEventListener("click", () => celebrate(true));
  setTimeout(() => celebrate(isToday), 900);

  initQuiz({ $, reduce, fire, heart, prevAge: Number($("ord").textContent.slice(3)) - 1 });

  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    io.unobserve(e.target);
  }), { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // --- surat dalam amplop ---
  const body = $("letter-body");
  [CONFIG.surat.salam, ...CONFIG.surat.isi].forEach((text, i) => {
    const p = document.createElement("p");
    p.textContent = text;
    p.style.setProperty("--i", i);
    if (i === 0) p.className = "greet";
    body.append(p);
  });
  $("sign").textContent = CONFIG.dari;
  $("sign").style.setProperty("--i", CONFIG.surat.isi.length + 1);

  const envwrap = $("envwrap"), envelope = $("envelope"), paper = $("paper");
  envelope.addEventListener("click", () => {
    if (envwrap.classList.contains("opening")) return;
    envwrap.classList.add("opening");
    envelope.setAttribute("aria-expanded", "true");
    const r = envelope.getBoundingClientRect();
    setTimeout(() => fire({ particleCount: 60, spread: 90, startVelocity: 34, shapes: [heart], scalar: 1.5, origin: { x: (r.left + r.width / 2) / innerWidth, y: r.top / innerHeight } }), 500);
    setTimeout(() => {
      envwrap.hidden = true;
      paper.hidden = false;
      paper.classList.add("unfold");
      paper.focus({ preventScroll: true });
    }, reduce ? 0 : 1600);
  });

  // --- petunjuk & progres ---
  function renderHint() {
    const hint = $("hint");
    if (picked.size === fruits.length) {
      hint.innerHTML = 'Semua buah sudah kamu petik. Satu hal terakhir ada di <a href="#surat">suratku di bawah</a>.';
    } else {
      hint.textContent = `Ketuk buahnya satu per satu. ${picked.size} dari ${fruits.length} sudah dipetik.`;
    }
  }
  renderHint();

  // --- pohon ---
  const T = buildTree();
  const paintTree = () => {
    paintCanvas($("tree-base"), drawBase);
    paintCanvas($("tree-crown"), (ctx) => drawCrown(ctx, T));
  };
  let raf;
  new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(paintTree); }).observe($("tree"));

  const crown = $("crown");
  let celebrateOnClose = false;
  fruits.forEach((f, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "fruit";
    b.setAttribute("aria-label", `Petik buah ${i + 1}`);
    b.style.left = SPOTS[i][0] + "%";
    b.style.top = SPOTS[i][1] + "%";
    b.style.setProperty("--i", i);
    b.style.setProperty("--d", 2.8 + (i % 3) * 0.6 + "s");
    b.style.setProperty("--sd", -i * 0.7 + "s");
    b.innerHTML =
      '<span class="stem" aria-hidden="true"><svg><use href="#i-stem"/></svg></span>' +
      `<span class="num" aria-hidden="true">${i + 1}</span>` +
      '<span class="badge" aria-hidden="true"><svg><use href="#i-heart"/></svg></span>';
    const img = new Image();
    img.alt = "";
    img.decoding = "async";
    img.onerror = () => { img.remove(); b.classList.add("empty"); };
    img.src = f.foto;
    b.prepend(img);
    b.addEventListener("click", () => {
      const before = picked.size;
      picked.add(i);
      b.classList.add("picked");
      if (before < fruits.length && picked.size === fruits.length) celebrateOnClose = true;
      renderHint();
      openCard(i);
    });
    crown.append(b);
  });

  // --- kartu flip (confetti di dalam dialog karena dialog selalu di lapisan teratas) ---
  const viewer = $("viewer");
  const card = $("card");
  const front = $("front");
  const frontImg = $("front-img");
  const dlgFx = window.confetti && confetti.create($("fx"), { resize: true });
  const hearts = () => fire({ particleCount: 36, spread: 100, startVelocity: 28, gravity: 0.7, ticks: 170, shapes: [heart], scalar: 1.7, origin: { x: 0.5, y: 0.45 } }, dlgFx);
  let flipTimer;

  frontImg.onerror = () => front.classList.add("empty");

  function openCard(i) {
    front.classList.remove("empty");
    frontImg.alt = `Foto kenangan ${i + 1}`;
    frontImg.src = fruits[i].foto;
    $("words").textContent = fruits[i].kata;
    $("count").textContent = `Kenangan ${i + 1} dari ${fruits.length}`;
    card.classList.remove("flipped");
    viewer.showModal();
    // tampilkan fotonya sebentar, lalu balik ke kata-katanya
    flipTimer = setTimeout(() => { card.classList.add("flipped"); hearts(); }, 900);
  }

  card.addEventListener("click", () => {
    clearTimeout(flipTimer);
    if (card.classList.toggle("flipped")) hearts();
  });
  $("close").addEventListener("click", () => viewer.close());
  viewer.addEventListener("click", (e) => e.target === viewer && viewer.close());
  viewer.addEventListener("close", () => {
    clearTimeout(flipTimer);
    if (celebrateOnClose) { celebrateOnClose = false; celebrate(true); }
  });

  // --- efek sekitar ---
  buildLights();
  if (!reduce) startPetals($("petals"));
}

if (typeof document !== "undefined") init();
if (typeof module !== "undefined") module.exports = { ageInfo, nextBirthday, birthdayP };
