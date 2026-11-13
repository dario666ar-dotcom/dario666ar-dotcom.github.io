/* ============================================================
   extras.js  ·  LumenStore
   1) Banner de clima de La Plata (API Open-Meteo, sin API key).
   2) Envio del formulario de contacto con fetch + SweetAlert2.
   ============================================================ */

/* ---------- 1) Clima ---------- */

const CLIMA_URL =
  "https://api.open-meteo.com/v1/forecast" +
  "?latitude=-34.921&longitude=-57.954" +
  "&current_weather=true" +
  "&timezone=America%2FArgentina%2FBuenos_Aires";

const CLIMA_CODIGOS = {
  0:  { texto: "Despejado",                    icono: "fa-sun" },
  1:  { texto: "Mayormente despejado",         icono: "fa-sun" },
  2:  { texto: "Parcialmente nublado",         icono: "fa-cloud-sun" },
  3:  { texto: "Nublado",                      icono: "fa-cloud" },
  45: { texto: "Niebla",                       icono: "fa-smog" },
  48: { texto: "Niebla con escarcha",          icono: "fa-smog" },
  51: { texto: "Llovizna ligera",              icono: "fa-cloud-rain" },
  53: { texto: "Llovizna moderada",            icono: "fa-cloud-rain" },
  55: { texto: "Llovizna intensa",             icono: "fa-cloud-rain" },
  61: { texto: "Lluvia ligera",                icono: "fa-cloud-rain" },
  63: { texto: "Lluvia moderada",              icono: "fa-cloud-showers-heavy" },
  65: { texto: "Lluvia intensa",               icono: "fa-cloud-showers-heavy" },
  71: { texto: "Nieve ligera",                 icono: "fa-snowflake" },
  73: { texto: "Nieve moderada",               icono: "fa-snowflake" },
  75: { texto: "Nieve intensa",                icono: "fa-snowflake" },
  80: { texto: "Chaparrones ligeros",          icono: "fa-cloud-rain" },
  81: { texto: "Chaparrones moderados",        icono: "fa-cloud-rain" },
  82: { texto: "Chaparrones intensos",         icono: "fa-cloud-showers-heavy" },
  95: { texto: "Tormenta",                     icono: "fa-bolt" },
  96: { texto: "Tormenta con granizo",         icono: "fa-bolt" },
  99: { texto: "Tormenta fuerte con granizo",  icono: "fa-bolt" }
};

async function cargarClima() {
  const widget = document.getElementById("clima-la-plata");
  const texto  = document.getElementById("clima-texto");
  const icono  = document.getElementById("clima-icono");

  if (!widget || !texto || !icono) return;

  try {
    const res = await fetch(CLIMA_URL);
    if (!res.ok) throw new Error("HTTP " + res.status);

    const data = await res.json();
    const cw = data && data.current_weather;
    if (!cw) throw new Error("Respuesta sin datos de clima");

    const info = CLIMA_CODIGOS[cw.weathercode] || {
      texto: "Clima variable",
      icono: "fa-cloud"
    };
    const temp = Math.round(cw.temperature);
    const viento = Math.round(cw.windspeed);

    icono.className = "fa-solid " + info.icono + " clima-icono";
    texto.textContent =
      "La Plata: " + temp + " C - " + info.texto + " (viento " + viento + " km/h)";

    console.log("Clima cargado correctamente.");
  } catch (error) {
    widget.style.display = "none";
    console.log("Clima no disponible: " + error.message);
  }
}

/* ---------- 2) Formulario de contacto con fetch ---------- */

async function manejarEnvioFormulario(evento) {
  evento.preventDefault();

  const form = evento.target;
  const boton = form.querySelector("button[type='submit']");
  if (!boton) return;

  const htmlOriginal = boton.innerHTML;
  boton.disabled = true;
  boton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

  try {
    const respuesta = await fetch(form.action, {
      method: form.method || "POST",
      body: new FormData(form),
      headers: { "Accept": "application/json" }
    });

    if (!respuesta.ok) throw new Error("HTTP " + respuesta.status);

    Swal.fire({
      icon: "success",
      title: "Mensaje enviado",
      text: "Gracias por escribirnos. Te responderemos a la brevedad.",
      confirmButtonColor: "#F2A83B"
    });

    form.reset();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "No se pudo enviar",
      text: "Hubo un problema al enviar el mensaje. Intenta de nuevo en unos minutos.",
      confirmButtonColor: "#F2A83B"
    });

    console.log("Error al enviar formulario: " + error.message);
  } finally {
    boton.disabled = false;
    boton.innerHTML = htmlOriginal;
  }
}

/* ---------- Arranque ---------- */

document.addEventListener("DOMContentLoaded", function () {
  cargarClima();

  const formContacto = document.getElementById("form-contacto");
  if (formContacto) {
    formContacto.addEventListener("submit", manejarEnvioFormulario);
  }
});