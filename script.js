/* =========================================================
   DRINKA by Kai Bobba · tarjeta virtual
   ========================================================= */

/* =========================================================
   ✏️  EDITA AQUÍ: todos los datos de la tarjeta
   ========================================================= */
const DRINKA = {
  nombre: "DRINKA by Kai Bobba",

  // Número de WhatsApp con código de país, sin "+" ni espacios (ej. Ecuador: 5939XXXXXXXX)
  whatsapp: "593900000000",
  mensajeWhatsapp: "¡Hola Drinka! Quiero hacer un pedido 🧋",

  // Enlaces (si dejas uno vacío "", ese botón se oculta)
  instagram: "https://www.instagram.com/TU_USUARIO/",
  tiktok: "https://www.tiktok.com/@TU_USUARIO",
  facebook: "https://www.facebook.com/TU_PAGINA",
  menu: "https://www.instagram.com/TU_USUARIO/",      // carta en PDF, Canva o Instagram
  delivery: "",                                        // vacío = pide a domicilio por WhatsApp
  promos: "https://www.instagram.com/TU_USUARIO/",
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

  // "Arma tu Drinka": cada sabor usa su color de la paleta de sabor
  sabores: [
    { id: "taro",         nombre: "Taro",         linea: "Línea Taro · taro y uva",           color: "#9E86D6" },
    { id: "matcha",       nombre: "Matcha",       linea: "Línea Matcha · tés verdes",         color: "#6F8A3A" },
    { id: "mango",        nombre: "Mango",        linea: "Línea Mango · frozen",              color: "#F4C24F" },
    { id: "maracuya",     nombre: "Maracuyá",     linea: "Línea Maracuyá · cítricos",         color: "#EE8A34" },
    { id: "frutos-rojos", nombre: "Frutos rojos", linea: "Línea Vino · frutos rojos",         color: "#7B2433" },
  ],
  tamanos: ["Mediano", "Grande"],
  tamanoInicial: 1,
  // forma: "perla" (tapioca), "pop" (popping boba) o "jelly"
  toppings: [
    { id: "tapioca", nombre: "Tapioca",      forma: "perla" },
    { id: "popping", nombre: "Popping boba", forma: "pop" },
    { id: "jelly",   nombre: "Jelly",        forma: "jelly" },
  ],
  toppingsIniciales: ["tapioca"],
};
/* ========================================================= */


const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const waLink = text =>
  `https://wa.me/${DRINKA.whatsapp}?text=${encodeURIComponent(text)}`;

/* ---------- Enlaces y textos desde DRINKA ---------- */
const LINKS = {
  whatsapp: waLink(DRINKA.mensajeWhatsapp),
  instagram: DRINKA.instagram,
  tiktok: DRINKA.tiktok,
  facebook: DRINKA.facebook,
  menu: DRINKA.menu,
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
  const status = $("#status");
  status.classList.toggle("is-open", e.abierto);
  $("#status-text").textContent = e.texto;

  const pill = $("#h-pill");
  pill.textContent = e.corto;
  pill.classList.toggle("is-open", e.abierto);

  const list = $("#hours");
  list.replaceChildren(...ORDEN.map(d => {
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
   ARMA TU DRINKA
   ========================================================= */
const builder = $("#builder");
const cupWrap = $("#cup-wrap");
const pedido = {
  sabor: DRINKA.sabores[0].id,
  tamano: DRINKA.tamanoInicial ?? 0,
  toppings: new Set(DRINKA.toppingsIniciales || []),
};

function chip(type, name, value, label, checked) {
  const el = document.createElement("label");
  el.className = "chip";
  const input = document.createElement("input");
  input.type = type;
  input.name = name;
  input.value = value;
  input.checked = checked;
  el.append(input);
  el.classList.toggle("is-on", checked);
  return { el, input, label };
}

// Sabores
const saborWrap = $("#b-sabor");
DRINKA.sabores.forEach(s => {
  const { el, input } = chip("radio", "sabor", s.id, s.nombre, s.id === pedido.sabor);
  el.style.setProperty("--c", s.color);
  const dot = document.createElement("span");
  dot.className = "chip__dot";
  el.append(dot, s.nombre);
  input.addEventListener("change", () => { pedido.sabor = s.id; actualizar(true); });
  saborWrap.append(el);
});

// Tamaños
const seg = $("#b-tam");
seg.style.setProperty("--n", DRINKA.tamanos.length);
DRINKA.tamanos.forEach((t, i) => {
  const label = document.createElement("label");
  const input = document.createElement("input");
  input.type = "radio";
  input.name = "tamano";
  input.value = i;
  input.checked = i === pedido.tamano;
  label.append(input, t);
  input.addEventListener("change", () => { pedido.tamano = i; actualizar(true); });
  seg.append(label);
});

// Toppings
const topWrap = $("#b-top");
DRINKA.toppings.forEach(t => {
  const { el, input } = chip("checkbox", "toppings", t.id, t.nombre, pedido.toppings.has(t.id));
  const mark = document.createElement("span");
  mark.className = "chip__mark";
  mark.setAttribute("aria-hidden", "true");
  el.append(mark, t.nombre);
  input.addEventListener("change", () => {
    input.checked ? pedido.toppings.add(t.id) : pedido.toppings.delete(t.id);
    actualizar(false);
  });
  topWrap.append(el);
});

function actualizar(shake) {
  const sabor = DRINKA.sabores.find(s => s.id === pedido.sabor);
  const tamano = DRINKA.tamanos[pedido.tamano];
  const tops = DRINKA.toppings.filter(t => pedido.toppings.has(t.id));

  builder.style.setProperty("--flavor", sabor.color);
  builder.dataset.size = pedido.tamano === DRINKA.tamanos.length - 1 ? "1" : "0";
  seg.style.setProperty("--k", pedido.tamano);

  // estados visuales de chips
  $$(".chip, .seg label", builder).forEach(l => l.classList.toggle("is-on", $("input", l).checked));

  // toppings dentro del vaso
  const formas = new Set(tops.map(t => t.forma));
  $$(".cup__top", builder).forEach(g => g.classList.toggle("is-on", formas.has(g.dataset.forma)));

  // resumen
  $("#b-line").textContent = sabor.linea;
  $("#b-name").textContent = sabor.nombre;
  $("#b-desc").textContent = `${tamano} · ${tops.length ? tops.map(t => t.nombre).join(", ") : "sin toppings"}`;

  // mensaje de WhatsApp
  const msg = [
    "¡Hola Drinka! 🧋 Quiero pedir:",
    `• 1 ${sabor.nombre} (${tamano})`,
    `• Toppings: ${tops.length ? tops.map(t => t.nombre).join(", ") : "sin toppings"}`,
    "¿Me confirman el total? ¡Gracias!",
  ].join("\n");
  $("#b-cta").href = waLink(msg);

  if (shake && !reduceMotion) {
    cupWrap.classList.remove("is-shake");
    void cupWrap.offsetWidth;
    cupWrap.classList.add("is-shake");
  }
}
cupWrap.addEventListener("animationend", () => cupWrap.classList.remove("is-shake"));
actualizar(false);

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
$$(".btn, .btn-cta").forEach(btn => {
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
    "NOTE:Bubble tea · Pide por WhatsApp",
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
  const data = { title: DRINKA.nombre, text: "Mira DRINKA by Kai Bobba 🧋", url };
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
