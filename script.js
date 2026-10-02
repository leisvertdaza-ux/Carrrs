/* ====== PERSONALIZA AQUÍ ====== */
const TITULO = "Feliz día de los Carritos Hot Wheels 🏎️💙";
// foto: nombre del archivo dentro de la carpeta "imagenes"
const CARRITOS = [
  { nombre: "Mi favorito",   foto: "carro1.jpg", mensaje: "Haces que cada día sea mejor que el anterior." },
  { nombre: "Edición amor",  foto: "carro2.jpg", mensaje: "Aceleraste mi corazón desde el primer día." },
  { nombre: "Velocidad",     foto: "carro3.jpg", mensaje: "Contigo me gusta el camino, no solo la meta." },
  { nombre: "Coleccionable", foto: "carro4.jpg", mensaje: "Eres mi pieza más especial." },
  { nombre: "Turbo",         foto: "carro5.jpg", mensaje: "Contigo todo va a máxima velocidad." },
  { nombre: "Clásico",       foto: "carro6.jpg", mensaje: "Algunas cosas nunca pasan de moda: tú." },
  { nombre: "Pista libre",   foto: "carro7.jpg", mensaje: "Quiero recorrer todas las pistas contigo." },
  { nombre: "Meta",          foto: "carro8.jpg", mensaje: "Contigo llegué a mi lugar favorito." }
];
const FRASES = ["Mi mejor amor", "Siempre serás mi destino", "Hot Wheels, no tienes frenos", "Contigo, a toda velocidad", "Eres mi pista favorita", "Mi mejor carrera"];
const RAMOS = ["ramo1.png", "ramo2.png"];   // dentro de "imagenes"
const CANTIDAD_RAMOS = 16;
const GIRO_AUTOMATICO = 4;                  // grados por segundo (0 = no gira solo)
/* ================================ */
const COLORES = [["#0a4fd6","#061f5c"],["#e4162b","#7a0b17"],["#ff7a00","#a13d00"],["#0aa5b8","#055a66"]];
const $ = id => document.getElementById(id);
const limitar = (v, a, b) => Math.max(a, Math.min(b, v));
$("titulo").textContent = TITULO;
document.querySelector(".pista").textContent = "Arrastra para girar, usa la rueda para acercar y toca una foto para abrir su mensaje";

/* ---------- Estrellas de fondo ---------- */
const cv = $("estrellas"), cx = cv.getContext("2d");
let estrellas = [];
function iniciarEstrellas(){
  cv.width = innerWidth; cv.height = innerHeight;
  estrellas = Array.from({ length: Math.floor(innerWidth * innerHeight / 4500) }, () => ({
    x: Math.random() * cv.width, y: Math.random() * cv.height,
    r: Math.random() * 1.3 + .3, f: Math.random() * 6.28, v: Math.random() * .02 + .01
  }));
}
function dibujarEstrellas(t){
  cx.clearRect(0, 0, cv.width, cv.height);
  cx.fillStyle = "#fff";
  estrellas.forEach(s => {
    cx.globalAlpha = Math.max(0, Math.min(1, .65 + Math.sin(t * s.v + s.f) * .35));
    cx.beginPath(); cx.arc(s.x, s.y, s.r, 0, 7); cx.fill();
  });
  requestAnimationFrame(dibujarEstrellas);
}
addEventListener("resize", iniciarEstrellas);
iniciarEstrellas(); requestAnimationFrame(dibujarEstrellas);

/* ---------- Suelo: galaxia de puntitos blancos ---------- */
function dibujarSuelo(){
  const g = $("suelo").getContext("2d"), R = 500;
  g.clearRect(0, 0, 2 * R, 2 * R);
  const halo = g.createRadialGradient(R, R, 100, R, R, R);
  halo.addColorStop(0, "rgba(40,90,200,.28)"); halo.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = halo; g.fillRect(0, 0, 2 * R, 2 * R);
  g.fillStyle = "#fff";
  for (let i = 0; i < 6500; i++) {
    const r = 110 + Math.pow(Math.random(), .85) * 385;
    const a = (i % 3) * 2.094 + r * .011 + (Math.random() - .5) * (Math.random() < .35 ? 6.28 : .8);
    g.globalAlpha = .25 + Math.random() * .75;
    g.beginPath(); g.arc(R + r * Math.cos(a), R + r * Math.sin(a), Math.random() * 1.5 + .4, 0, 7); g.fill();
  }
}

/* ---------- Quitar el fondo blanco de los ramos ---------- */
// Pinta de transparente el blanco conectado con los bordes de la imagen.
// Si el navegador lo bloquea (por ejemplo al abrir con doble clic), se usa la imagen original.
const ramosUrl = {};
function quitarFondo(ruta){
  return new Promise(ok => {
    const img = new Image();
    img.onerror = () => ok(null);
    img.onload = () => {
      try {
        const e = Math.min(1, 360 / Math.max(img.width, img.height));
        const w = Math.round(img.width * e), h = Math.round(img.height * e);
        const c = document.createElement("canvas"); c.width = w; c.height = h;
        const g = c.getContext("2d"); g.drawImage(img, 0, 0, w, h);
        const d = g.getImageData(0, 0, w, h), p = d.data;
        const vis = new Uint8Array(w * h), pila = [];
        const mira = (x, y) => {
          const k = y * w + x, i = k * 4;
          if (!vis[k] && p[i] > 215 && p[i + 1] > 215 && p[i + 2] > 215) { vis[k] = 1; pila.push(k); }
        };
        for (let x = 0; x < w; x++) { mira(x, 0); mira(x, h - 1); }
        for (let y = 0; y < h; y++) { mira(0, y); mira(w - 1, y); }
        while (pila.length) {
          const k = pila.pop(), x = k % w, y = (k / w) | 0;
          p[k * 4 + 3] = 0;
          if (x > 0) mira(x - 1, y); if (x < w - 1) mira(x + 1, y);
          if (y > 0) mira(x, y - 1); if (y < h - 1) mira(x, y + 1);
        }
        g.putImageData(d, 0, 0);
        ok(c.toDataURL("image/png"));
      } catch (err) { ok(null); }
    };
    img.src = ruta;
  });
}
RAMOS.forEach(n => quitarFondo("imagenes/" + n).then(u => { if (u) ramosUrl[n] = u; }));

/* ---------- Portada ---------- */
let arrancado = false;
const musica = $("musica"), controlMusica = $("controlMusica");
function actualizarControlMusica(){
  const activa = !musica.paused;
  controlMusica.textContent = activa ? "♫ Música: activa" : "♫ Música: silenciada";
  controlMusica.setAttribute("aria-label", activa ? "Silenciar música" : "Activar música");
  controlMusica.setAttribute("aria-pressed", String(activa));
}
function iniciarMusica(){
  musica.volume = .35;
  musica.play().then(() => {
    controlMusica.hidden = false;
    actualizarControlMusica();
  }).catch(() => {});
}
controlMusica.addEventListener("click", () => {
  if (musica.paused) musica.play().then(actualizarControlMusica).catch(() => {});
  else { musica.pause(); actualizarControlMusica(); }
});
$("pistaInicio").addEventListener("click", () => {
  if (arrancado) return; arrancado = true;
  iniciarMusica();
  $("portada").classList.add("arrancando");
  $("textoInicio").textContent = "Arrancando motor...";
  $("pistaInicio").disabled = true;
  const inicio = performance.now();
  const duracion = 2600;
  let velocidadAnterior = -1;
  function cargarMotor(t){
    const progreso = limitar((t - inicio) / duracion, 0, 1);
    const avance = 1 - Math.pow(1 - progreso, 3);
    const velocidad = Math.round(avance * 100);
    $("arcoCarga").style.strokeDashoffset = String(100 - velocidad);
    $("carroInicio").style.left = `${12 + avance * 76}%`;
    if (velocidad !== velocidadAnterior) {
      $("velocidad").textContent = velocidad;
      $("medidor").setAttribute("aria-valuenow", String(velocidad));
      velocidadAnterior = velocidad;
    }
    if (progreso < 1) requestAnimationFrame(cargarMotor);
    else setTimeout(entrarGalaxia, 350);
  }
  requestAnimationFrame(cargarMotor);
});
function entrarGalaxia(){
  $("portada").classList.add("salir");
  construir();
  $("galaxia").hidden = false;
  requestAnimationFrame(() => $("galaxia").classList.add("entrar"));
  setTimeout(() => { $("portada").hidden = true; }, 650);
}

/* ---------- Cámara: giro, inclinación y zoom ---------- */
const kBase = () => innerWidth < 700 ? innerWidth / 850 : Math.min(innerWidth / 1500, .95);
const vista = { rz: 0, orbita: 0, tilt: 68, k: kBase(), vz: 0 };
let arrastrando = false, movido = false, pausado = false, acum = 0, ultimo = 0;

function bucle(t){
  const dt = Math.min(.05, (t - ultimo) / 1000 || 0); ultimo = t;
  if (!arrastrando) {
    vista.rz += vista.vz; vista.vz *= .94;                 // inercia al soltar
    if (!pausado) {
      const giro = GIRO_AUTOMATICO * dt;
      vista.rz += giro;
      vista.orbita += giro;
    }
  }
  const s = $("escena").style;
  s.setProperty("--rz", vista.rz.toFixed(2));
  s.setProperty("--orbita", vista.orbita.toFixed(2));
  s.setProperty("--tilt", vista.tilt.toFixed(2));
  s.setProperty("--k", vista.k.toFixed(3));
  requestAnimationFrame(bucle);
}
requestAnimationFrame(bucle);

const esc = $("escena"), punteros = new Map();
let dist0 = 1, k00 = 1;
const distancia = () => { const [a, b] = [...punteros.values()]; return Math.hypot(a.x - b.x, a.y - b.y) || 1; };

esc.addEventListener("pointerdown", e => {
  if (pausado) return;
  punteros.set(e.pointerId, { x: e.clientX, y: e.clientY });
  arrastrando = true; vista.vz = 0;
  if (punteros.size === 1) { movido = false; acum = 0; }
  if (punteros.size === 2) { dist0 = distancia(); k00 = vista.k; movido = true; }
});
addEventListener("pointermove", e => {
  const p = punteros.get(e.pointerId); if (!p) return;
  const dx = e.clientX - p.x, dy = e.clientY - p.y;
  p.x = e.clientX; p.y = e.clientY;
  if (punteros.size === 2) { vista.k = limitar(k00 * distancia() / dist0, .3, 2.6); return; }
  acum += Math.abs(dx) + Math.abs(dy);
  if (acum > 8) movido = true;
  if (!movido) return;
  vista.rz -= dx * .3; vista.vz = -dx * .3;
  vista.tilt = limitar(vista.tilt + dy * .25, 20, 82);
});
const soltar = e => { punteros.delete(e.pointerId); if (!punteros.size) arrastrando = false; };
addEventListener("pointerup", soltar);
addEventListener("pointercancel", soltar);
esc.addEventListener("wheel", e => {
  e.preventDefault();
  vista.k = limitar(vista.k * Math.exp(-e.deltaY * .0012), .3, 2.6);
}, { passive: false });
esc.addEventListener("dblclick", () => { vista.tilt = 68; vista.k = kBase(); vista.vz = 0; });
esc.addEventListener("dragstart", e => e.preventDefault());
addEventListener("resize", () => { vista.k = kBase(); });

/* ---------- Escena 3D ---------- */
function punto(x, y, z, html){
  const d = document.createElement("div");
  d.className = "punto";
  d.style.transform = `translate3d(${x}px,${y}px,${z || 0}px)`;
  d.innerHTML = html;
  $("mundo").appendChild(d);
  return d;
}
const dePie = (clase, estilo, interior) =>
  `<div class="contra"><div class="de-pie ${clase}" style="${estilo || ""}">${interior || ""}</div></div>`;
const polar = (r, a) => [r * Math.cos(a), r * Math.sin(a)];

function florRespaldo(){
  let p = "";
  for (let i = 0; i < 6; i++) p += `<ellipse cx="40" cy="22" rx="10" ry="19" fill="#e8f4ff" transform="rotate(${i * 60} 40 40)"/>`;
  return `<svg viewBox="0 0 80 80" width="60" height="60" style="position:absolute;bottom:0;left:-30px;filter:drop-shadow(0 0 8px #35e8ff)">${p}<circle cx="40" cy="40" r="7" fill="#35a6ff"/></svg>`;
}

function construir(){
  $("mundo").querySelectorAll(".punto").forEach(n => n.remove());
  dibujarSuelo();

  punto(0, 0, 0, '<div class="contra"><div class="planeta-centro"><div class="anillo-planeta atras secundario"></div><div class="anillo-planeta atras"></div><div class="portador-esfera"><div class="esfera-negra"></div></div><div class="anillo-planeta delante"></div><div class="anillo-planeta delante secundario"></div></div></div>');

  FRASES.forEach((t, i) => {
    const a = i * 1.05 + .5, [x, y] = polar(i % 2 ? 200 : 400, a);
    punto(x, y, 0, `<div class="frase" style="transform:translate(-50%,-50%) rotateZ(${a * 57.3 + 90}deg)">${t}</div>`);
  });

  [[300,.2,38,"#ff9a3c"],[440,1.5,52,"#7a5cff"],[270,2.6,30,"#ff4fa3"],[450,3.7,44,"#35e8c8"],[310,4.9,34,"#ffd400"],[430,5.8,28,"#4fa3ff"]]
  .forEach(([r, a, s, c]) => {
    const [x, y] = polar(r, a);
    punto(x, y, 20, dePie("planeta", `width:${s}px;height:${s}px;left:${-s / 2}px;top:${-s}px;--glow:${c};background:radial-gradient(circle at 35% 30%,#fff9,${c} 45%,#000)`));
  });

  // Ramos repartidos por toda la galaxia
  for (let i = 0; i < CANTIDAD_RAMOS; i++) {
    const a = i * 2.39996 + .4, r = 170 + ((i * 97) % 300), ancho = 55 + ((i * 37) % 45);
    const nombre = RAMOS[i % RAMOS.length], [x, y] = polar(r, a);
    const d = punto(x, y, 0, dePie("", "",
      `<img class="ramo" src="${ramosUrl[nombre] || "imagenes/" + nombre}" style="width:${ancho}px;left:${-ancho / 2}px" alt="ramo" draggable="false">`));
    d.querySelector("img").onerror = e => { e.target.outerHTML = florRespaldo(); };
  }

  // Fotos alrededor
  CARRITOS.forEach((c, i) => {
    const [c1, c2] = COLORES[i % COLORES.length];
    const [x, y] = polar(i % 2 ? 330 : 235, i * (6.283 / CARRITOS.length) + .3);
    const d = punto(x, y, 0, dePie("", "",
      `<button class="tarjeta" style="--c1:${c1};--c2:${c2}"><div class="marca">HOT WHEELS</div><div class="foto"><img src="imagenes/${c.foto}" alt="${c.nombre}" draggable="false"></div><div class="pie">${c.nombre}</div></button>`));
    d.querySelector(".foto img").onerror = e => e.target.replaceWith("🏎️");
    d.querySelector(".tarjeta").onclick = () => { if (!movido) abrir(i, c1); };
  });
}

/* ---------- Mensaje ---------- */
function abrir(i, color){
  $("mensaje").textContent = CARRITOS[i].mensaje;
  $("paquete").style.setProperty("--fondo-t", color);
  pausado = true; arrastrando = false; punteros.clear();
  $("modal").hidden = false;
}
$("modal").onclick = () => { $("modal").hidden = true; pausado = false; };