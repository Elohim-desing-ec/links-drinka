/* =========================================================
   DRINKA by Kai Bobba · tarjeta virtual
   ========================================================= */

/* =========================================================
   ✏️  EDITA AQUÍ: todos los datos de la tarjeta
   ========================================================= */
const DRINKA = {
  nombre: "DRINKA by Kai Bobba",

  // ⚠️ Número de WhatsApp con código de país, sin "+" ni espacios (ej. Ecuador: 5939XXXXXXXX)
  whatsapp: "593900000000",
  mensajeWhatsapp: "¡Hola Drinka! Quiero hacer un pedido 🧋",

  // Enlaces (si dejas uno vacío "", ese botón se oculta)
  instagram: "https://www.instagram.com/drinka.ec/",
  tiktok: "https://www.tiktok.com/@drinka.ec",
  delivery: "",                                        // vacío = pide a domicilio por WhatsApp
  promos: "https://www.instagram.com/drinka.ec/",
  mapa: "https://maps.google.com/?q=DRINKA+by+Kai+Bobba",
  direccion: "Escribe aquí la dirección del local",

  // Horario (24 h). null = cerrado ese día
  zonaHoraria: "America/Guayaquil",
  horario: {
    lunes:     ["14:00", "21:00"],
    martes:    ["14:00", "21:00"],
    miercoles: ["14:00", "21:00"],
    jueves:    ["14:00", "21:00"],
    viernes:   ["14:00", "22:00"],
    sabado:    ["12:00", "22:00"],
    domingo:   ["12:00", "20:00"],
  },

  // Menú. color = color de la línea; textoBanda = color del título sobre esa franja
  // capas = colores del vaso de arriba hacia abajo. favorito = la bebida destacada
  menu: [
    {
      id: "matcha", nombre: "Matcha", color: "#6F8A3A", textoBanda: "#FFFFFF",
      bebidas: [
        { nombre: "Matcha Latte",      precio: 3.00, favorito: true, capas: ["#7FA650", "#EEE5D0"] },
        { nombre: "Matcha Strawberry", precio: 3.50, capas: ["#7FA650", "#EEE5D0", "#D93A4A"] },
        { nombre: "Matcha & Café",     precio: 3.50, capas: ["#7FA650", "#EEE5D0", "#4A2A1C"] },
        { nombre: "Matcha Oreo",       precio: 3.50, capas: ["#7FA650", "#EEE5D0", "#2B2422"] },
        { nombre: "Matcha & Taro",     precio: 4.50, capas: ["#7FA650", "#EEE5D0", "#9E86D6"] },
      ],
    },
    {
      id: "taro", nombre: "Taro", color: "#9E86D6", textoBanda: "#2B1D4D",
      bebidas: [
        { nombre: "Taro Latte",       precio: 3.00, favorito: true, capas: ["#9E86D6", "#DCD3F2"] },
        { nombre: "Taro & Matcha",    precio: 4.50, capas: ["#7FA650", "#DCD3F2", "#9E86D6"] },
        { nombre: "Taro & Café",      precio: 3.50, capas: ["#4A2A1C", "#DCD3F2", "#9E86D6"] },
        { nombre: "Taro & Chocolate", precio: 3.50, capas: ["#9E86D6", "#DCD3F2", "#5B3A2B"] },
      ],
    },
    {
      id: "tes", nombre: "Tés", color: "#EE8A34", textoBanda: "#1F2A4D",
      bebidas: [
        { nombre: "Drinka Tea",      precio: 2.00, favorito: true, limon: true, capas: ["#E7A04B", "#D2692A"] },
        { nombre: "Té Negro",        precio: 2.00, capas: ["#3B2417"] },
        { nombre: "Té de Jengibre",  precio: 2.00, capas: ["#C47A2C"] },
        { nombre: "Flor de Jamaica", precio: 2.00, capas: ["#B21F37"] },
      ],
    },
    {
      id: "cafe", nombre: "Café", color: "#1F2A4D", textoBanda: "#FBEBDD",
      bebidas: [
        { nombre: "Ice Latte",      precio: 2.50, favorito: true, capas: ["#3B2417", "#EEE5D0"] },
        { nombre: "Caramel Latte",  precio: 3.50, capas: ["#C98A4B", "#EEE5D0"] },
        { nombre: "Mocca",          precio: 3.50, capas: ["#5A3424", "#A26B4B"] },
        { nombre: "Capuchino",      precio: 3.50, capas: ["#EEE5D0", "#4A2A1C"] },
        { nombre: "Café Americano", precio: 2.00, capas: ["#2A1912"] },
      ],
    },
  ],
};
/* ========================================================= */


const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const html = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = n => `$${n.toFixed(2)}`;

const waLink = text =>
  `https://wa.me/${DRINKA.whatsapp}?text=${encodeURIComponent(text)}`;

/* ---------- Enlaces y textos desde DRINKA ---------- */
const LINKS = {
  whatsapp: waLink(DRINKA.mensajeWhatsapp),
  instagram: DRINKA.instagram,
  tiktok: DRINKA.tiktok,
  delivery: DRINKA.delivery || waLink("¡Hola Drinka! Quiero pedir a domicilio 🛵"),
  promos: DRINKA.promos,
  mapa: DRINKA.mapa,
};

$$("[data-link]").forEach(a => {
  const url = LINKS[a.dataset.link];
  if (url) a.href = url;
  else a.hidden = true;
});
$$("[data-text]").forEach(el => {
  const value = DRINKA[el.dataset.text];
  if (value) el.textContent = value;
});
$("#year").textContent = new Date().getFullYear();

/* =========================================================
   HORARIO EN VIVO
   ========================================================= */
const KEYS = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
const NOMBRES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const ORDEN = [1, 2, 3, 4, 5, 6, 0]; // la semana empieza el lunes

const toMin = t => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const fmt = t => {
  const [h, m] = t.split(":").map(Number);
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
};
const art = t => ((toMin(t) / 60 | 0) % 12 === 1 ? "la" : "las"); // "la 1:00", "las 2:00"
const aLas = t => `a ${art(t)} ${fmt(t)}`;

function ahora() {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: DRINKA.zonaHoraria,
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      hourCycle: "h23",
    }).formatToParts(new Date());
    const get = type => parts.find(p => p.type === type).value;
    const dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { dia: dias[get("weekday")], min: (+get("hour") % 24) * 60 + +get("minute") };
  } catch {
    const d = new Date();
    return { dia: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
  }
}

function estado() {
  const { dia, min } = ahora();
  const hoy = DRINKA.horario[KEYS[dia]];
  if (hoy) {
    const [abre, cierra] = hoy.map(toMin);
    if (min >= abre && min < cierra) {
      const pronto = cierra - min <= 30;
      return {
        dia,
        abierto: true,
        texto: `${pronto ? "Cierra pronto" : "Abierto ahora"} · hasta ${art(hoy[1])} ${fmt(hoy[1])}`,
        corto: pronto ? "Cierra pronto" : "Abierto ahora",
      };
    }
    if (min < abre) {
      return { dia, abierto: false, texto: `Cerrado · abre hoy ${aLas(hoy[0])}`, corto: "Cerrado" };
    }
  }
  for (let i = 1; i <= 7; i++) {
    const d = (dia + i) % 7;
    const h = DRINKA.horario[KEYS[d]];
    if (h) {
      const cuando = i === 1 ? "mañana" : `el ${NOMBRES[d].toLowerCase()}`;
      return { dia, abierto: false, texto: `Cerrado · abre ${cuando} ${aLas(h[0])}`, corto: "Cerrado" };
    }
  }
  return { dia, abierto: false, texto: "Cerrado por ahora", corto: "Cerrado" };
}

function pintarHorario() {
  const e = estado();
  $("#status").classList.toggle("is-open", e.abierto);
  $("#status-text").textContent = e.texto;

  const pill = $("#h-pill");
  pill.textContent = e.corto;
  pill.classList.toggle("is-open", e.abierto);

  $("#hours").replaceChildren(...ORDEN.map(d => {
    const h = DRINKA.horario[KEYS[d]];
    const li = document.createElement("li");
    li.classList.toggle("is-today", d === e.dia);
    li.classList.toggle("is-closed", !h);

    const name = document.createElement("span");
    name.textContent = NOMBRES[d];
    if (d === e.dia) {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = "Hoy";
      name.append(tag);
    }
    const hours = document.createElement("span");
    hours.textContent = h ? `${fmt(h[0])} – ${fmt(h[1])}` : "Cerrado";
    li.append(name, hours);
    return li;
  }));
}
pintarHorario();
setInterval(pintarHorario, 60_000);

/* =========================================================
   MENÚ + PEDIDO
   ========================================================= */
const catalog = new Map();   // id → bebida
const cart = new Map();      // id → cantidad
const slug = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");

DRINKA.menu.forEach(cat => cat.bebidas.forEach(b => {
  b.id = slug(`${cat.id}-${b.nombre}`);
  catalog.set(b.id, b);
}));

// Vaso ilustrado como en el menú impreso
let cupCount = 0;
function cupSVG(bebida, grande = false) {
  const id = `cup${++cupCount}`;
  const body = "M16,28 L23,122 Q23.4,126 27,126 H73 Q76.6,126 77,122 L84,28 Z";
  const top = 33, bottom = 126;
  const h = (bottom - top) / bebida.capas.length;
  const stroke = grande ? 2.6 : 6;
  const layers = bebida.capas
    .map((c, i) => `<rect x="0" y="${(top + i * h).toFixed(1)}" width="100" height="${(h + .8).toFixed(1)}" fill="${c}"/>`)
    .join("");
  const ice = grande
    ? `<g class="ice" fill="rgba(200,229,245,.85)" stroke="rgba(255,255,255,.95)" stroke-width="1.6">
         <rect x="46" y="36" width="19" height="19" rx="5"/>
         <rect x="59" y="45" width="17" height="17" rx="5"/>
         <rect x="41" y="52" width="16" height="16" rx="5"/>
       </g>`
    : "";
  const lemon = grande && bebida.limon
    ? `<g><circle cx="36" cy="48" r="13" fill="#F6D24A" stroke="#F2B937" stroke-width="2.5"/>
         <path d="M36,37 V59 M25,48 H47 M28.2,40.2 L43.8,55.8 M43.8,40.2 L28.2,55.8" stroke="#fff" stroke-width="1.6"/></g>`
    : "";
  const perla = grande ? `<circle cx="58" cy="76" r="45" fill="url(#g-perla)"/>` : "";
  const straw = grande
    ? `<line x1="32" y1="6" x2="35" y2="118" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/>`
    : `<line x1="33" y1="36" x2="35" y2="116" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".9"/>`;
  return `<svg viewBox="0 0 100 132" aria-hidden="true">
    <defs><clipPath id="${id}"><path d="${body}"/></clipPath></defs>
    ${perla}
    <path d="${body}" fill="rgba(255,255,255,.75)"/>
    <g clip-path="url(#${id})">${layers}${ice}${lemon}</g>
    ${straw}
    <path d="${body}" fill="none" stroke="#CFCBE0" stroke-width="${stroke}" stroke-linejoin="round"/>
    <path d="M13,25 Q50,4 87,25" fill="none" stroke="#CFCBE0" stroke-width="${stroke}" stroke-linecap="round"/>
    <line x1="10" y1="27" x2="90" y2="27" stroke="#CFCBE0" stroke-width="${stroke}" stroke-linecap="round"/>
  </svg>`;
}

const qtyHTML = b => {
  const n = cart.get(b.id) || 0;
  return `<div class="qty" data-id="${b.id}" data-n="${n}">
    <button type="button" class="qty__btn qty__minus" data-step="-1" aria-label="Quitar un ${html(b.nombre)}">−</button>
    <span class="qty__n">${n}</span>
    <button type="button" class="qty__btn qty__plus" data-step="1" aria-label="Agregar ${html(b.nombre)}">+</button>
  </div>`;
};

const tabs = $("#m-tabs");
const panel = $("#m-panel");
let catActual = 0;

function pintarPanel() {
  const cat = DRINKA.menu[catActual];
  const fav = cat.bebidas.find(b => b.favorito) || cat.bebidas[0];
  const resto = cat.bebidas.filter(b => b !== fav);

  panel.style.setProperty("--c", cat.color);
  panel.style.setProperty("--on", cat.textoBanda);
  panel.setAttribute("aria-labelledby", `tab-${cat.id}`);
  panel.innerHTML = `
    <div class="band">${html(cat.nombre)}</div>
    <div class="feat">
      <div>
        <p class="feat__name">${html(fav.nombre)}</p>
        <p class="feat__price">${money(fav.precio)}</p>
        <p class="feat__fav">El favorito de la casa</p>
        ${qtyHTML(fav)}
      </div>
      <div class="feat__cup">${cupSVG(fav, true)}</div>
    </div>
    <ul class="items">
      ${resto.map(b => `<li class="item">
        <span class="item__cup">${cupSVG(b)}</span>
        <span class="item__name">${html(b.nombre)}</span>
        <span class="item__price">${money(b.precio)}</span>
        ${qtyHTML(b)}
      </li>`).join("")}
    </ul>`;
}

DRINKA.menu.forEach((cat, i) => {
  const tab = document.createElement("button");
  tab.type = "button";
  tab.className = "tab";
  tab.id = `tab-${cat.id}`;
  tab.setAttribute("role", "tab");
  tab.setAttribute("aria-controls", "m-panel");
  tab.style.setProperty("--c", cat.color);
  tab.textContent = cat.nombre;
  tab.addEventListener("click", () => elegir(i));
  tabs.append(tab);
});

function elegir(i, foco = false) {
  catActual = (i + DRINKA.menu.length) % DRINKA.menu.length;
  $$(".tab", tabs).forEach((t, k) => {
    const on = k === catActual;
    t.setAttribute("aria-selected", on);
    t.tabIndex = on ? 0 : -1;
    if (on && foco) t.focus();
    if (on) t.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
  });
  pintarPanel();
}
tabs.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") { e.preventDefault(); elegir(catActual + 1, true); }
  if (e.key === "ArrowLeft") { e.preventDefault(); elegir(catActual - 1, true); }
});

// Pedido
const cartEl = $("#cart");

function pintarCantidad(id) {
  const n = cart.get(id) || 0;
  $$(`.qty[data-id="${id}"]`).forEach(q => {
    q.dataset.n = n;
    $(".qty__n", q).textContent = n;
    q.classList.remove("is-bump");
    void q.offsetWidth;
    q.classList.add("is-bump");
  });
}

function pintarPedido(bump) {
  let count = 0, total = 0;
  const lines = [];
  for (const [id, n] of cart) {
    const b = catalog.get(id);
    count += n;
    total += n * b.precio;
    lines.push(`• ${n} × ${b.nombre} (${money(n * b.precio)})`);
  }
  const on = count > 0;
  cartEl.classList.toggle("is-on", on);
  cartEl.inert = !on;
  document.body.classList.toggle("has-cart", on);
  $("#cart-count").textContent = `${count} ${count === 1 ? "bebida" : "bebidas"}`;
  $("#cart-total").textContent = money(total);
  $("#cart-go").href = waLink([
    "¡Hola Drinka! 🧋 Quiero pedir:",
    ...lines,
    `Total: ${money(total)}`,
    "¿Me confirman? ¡Gracias!",
  ].join("\n"));
  if (bump && on && !reduceMotion) {
    cartEl.classList.remove("is-bump");
    void cartEl.offsetWidth;
    cartEl.classList.add("is-bump");
  }
}

panel.addEventListener("click", e => {
  const btn = e.target.closest("[data-step]");
  if (!btn) return;
  const id = btn.closest(".qty").dataset.id;
  const n = Math.max(0, Math.min(20, (cart.get(id) || 0) + Number(btn.dataset.step)));
  n ? cart.set(id, n) : cart.delete(id);
  pintarCantidad(id);
  pintarPedido(true);
});

$("#cart-clear").addEventListener("click", () => {
  const ids = [...cart.keys()];
  cart.clear();
  ids.forEach(pintarCantidad);
  pintarPedido(false);
  toast("Pedido vaciado");
});

elegir(0);
pintarPedido(false);

/* =========================================================
   HUB: resalta la línea al pasar por una red
   ========================================================= */
$$(".hub__tile").forEach(tile => {
  const line = $(`.hub__base [data-line="${tile.dataset.link}"]`);
  if (!line) return;
  const on = () => line.classList.add("is-hot");
  const off = () => line.classList.remove("is-hot");
  tile.addEventListener("pointerenter", on);
  tile.addEventListener("pointerleave", off);
  tile.addEventListener("focus", on);
  tile.addEventListener("blur", off);
});

/* =========================================================
   ONDA AL TOCAR
   ========================================================= */
$$(".btn").forEach(btn => {
  btn.addEventListener("pointerdown", e => {
    const r = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 2.2;
    const dot = document.createElement("span");
    dot.className = "ripple";
    dot.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
    btn.append(dot);
    dot.addEventListener("animationend", () => dot.remove());
  });
});

/* =========================================================
   AVISO FLOTANTE
   ========================================================= */
let toastTimer;
function toast(text) {
  const el = $("#toast");
  el.textContent = text;
  el.classList.add("is-on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-on"), 2400);
}

/* =========================================================
   GUARDAR CONTACTO (vCard) Y COMPARTIR
   ========================================================= */
const esc = v => String(v).replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");

$("#save-contact").addEventListener("click", () => {
  const url = location.href.split("#")[0];
  const card = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:;${esc(DRINKA.nombre)};;;`,
    `FN:${esc(DRINKA.nombre)}`,
    `ORG:${esc(DRINKA.nombre)}`,
    `TEL;TYPE=CELL,VOICE:+${DRINKA.whatsapp}`,
    DRINKA.direccion ? `ADR;TYPE=WORK:;;${esc(DRINKA.direccion)};;;;` : "",
    url.startsWith("http") ? `URL:${url}` : "",
    DRINKA.instagram ? `X-SOCIALPROFILE;TYPE=instagram:${DRINKA.instagram}` : "",
    "NOTE:Matcha · Taro · Tés · Café",
    "END:VCARD",
  ].filter(Boolean).join("\r\n");

  const blob = new Blob([card], { type: "text/vcard;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "drinka.vcf";
  document.body.append(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  toast("Contacto listo para guardar");
});

$("#share").addEventListener("click", async () => {
  const url = location.href.split("#")[0];
  const data = { title: DRINKA.nombre, text: "Mira el menú de DRINKA by Kai Bobba 🧋", url };
  try {
    if (navigator.share) { await navigator.share(data); return; }
    await navigator.clipboard.writeText(url);
    toast("Enlace copiado");
  } catch (err) {
    if (err && err.name === "AbortError") return;
    toast("Copia el enlace desde la barra del navegador");
  }
});

/* =========================================================
   APARICIÓN AL HACER SCROLL
   ========================================================= */
function startReveals() {
  const els = $$(".reveal, .reveal-pop");
  if (!("IntersectionObserver" in window)) {
    els.forEach(el => el.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      io.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -6% 0px" });
  els.forEach(el => io.observe(el));
}

/* =========================================================
   BIENVENIDA: burbujas de boba interactivas
   ========================================================= */
function bubbles(canvas) {
  const ctx = canvas.getContext("2d");
  const COLORS = ["209,231,207", "178,218,237", "152,179,224", "255,255,255"];
  const rand = (a, b) => Math.random() * (b - a) + a;
  const pick = arr => arr[(Math.random() * arr.length) | 0];
  const pointer = { x: -9999, y: -9999 };
  let w, h, parts = [], raf, running = true;

  const make = (init, x, y) => {
    const r = rand(3, 15);
    return {
      x: x ?? rand(0, w),
      y: y ?? (init ? rand(0, h) : h + r + rand(0, 60)),
      r,
      vy: rand(.25, .75) * (r < 8 ? 1.25 : .85),
      vx: 0,
      ph: rand(0, Math.PI * 2),
      amp: rand(.15, .6),
      c: pick(COLORS),
      a: rand(.12, .38),
      ring: Math.random() < .45,
    };
  };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(80, Math.round((w * h) / 11000));
    parts = Array.from({ length: n }, () => make(true));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const p of parts) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      if (p.ring) {
        ctx.strokeStyle = `rgba(${p.c},${p.a})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      } else {
        ctx.fillStyle = `rgba(${p.c},${p.a * .75})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x - p.r * .35, p.y - p.r * .35, p.r * .26, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.a * .7})`;
        ctx.fill();
      }
    }
  }

  function step() {
    for (const p of parts) {
      p.ph += .016;
      p.y -= p.vy;
      p.x += Math.sin(p.ph) * p.amp + p.vx;
      p.vx *= .93;
      const dx = p.x - pointer.x, dy = p.y - pointer.y;
      const d2 = dx * dx + dy * dy, R = 120;
      if (d2 < R * R) {
        const d = Math.sqrt(d2) || 1, f = (1 - d / R) * 1.6;
        p.vx += (dx / d) * f;
        p.y += (dy / d) * f;
      }
      if (p.y < -p.r - 20 || p.x < -60 || p.x > w + 60) Object.assign(p, make(false));
    }
    draw();
    if (running) raf = requestAnimationFrame(step);
  }

  const move = e => { pointer.x = e.clientX; pointer.y = e.clientY; };
  const leave = () => { pointer.x = pointer.y = -9999; };
  const burst = e => {
    if (e.target.closest("button")) return;
    for (let i = 0; i < 7; i++) {
      const p = make(false, e.clientX + rand(-14, 14), e.clientY + rand(-14, 14));
      p.r = rand(3, 9);
      p.vy = rand(1, 2.2);
      p.a = rand(.3, .55);
      parts.push(p);
    }
    if (parts.length > 140) parts.splice(0, parts.length - 140);
  };

  resize();
  window.addEventListener("resize", resize);
  if (reduceMotion) {
    draw();
  } else {
    canvas.parentElement.addEventListener("pointermove", move);
    canvas.parentElement.addEventListener("pointerleave", leave);
    canvas.parentElement.addEventListener("pointerdown", burst);
    raf = requestAnimationFrame(step);
  }

  return {
    stop() {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    },
  };
}

/* =========================================================
   BIENVENIDA: entrar
   ========================================================= */
const welcome = $("#welcome");
const page = $("#page");
const iso = $("#iso");
const enterBtn = $("#enter");
let entered = false;

document.body.classList.add("is-welcome");
page.inert = true;
const bubbleFx = bubbles($("#bubbles"));

// El círculo de salida se cierra sobre la perla del logo
function centrarEnPerla() {
  const r = iso.getBoundingClientRect();
  welcome.style.setProperty("--cx", `${r.left + r.width * (391 / 545)}px`);
  welcome.style.setProperty("--cy", `${r.top + r.height * (154 / 805)}px`);
}
centrarEnPerla();
window.addEventListener("resize", centrarEnPerla);

function enter() {
  if (entered) return;
  entered = true;
  centrarEnPerla();
  iso.classList.add("is-pop");
  page.inert = false;
  document.body.classList.remove("is-welcome");

  const close = () => {
    welcome.classList.add("is-closing");
    startReveals();
    setTimeout(() => {
      welcome.hidden = true;
      bubbleFx.stop();
      window.removeEventListener("resize", centrarEnPerla);
    }, reduceMotion ? 0 : 1000);
  };
  reduceMotion ? close() : setTimeout(close, 180);
}

enterBtn.addEventListener("click", enter);
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !entered) enter();
});
enterBtn.focus({ preventScroll: true });
