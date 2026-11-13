/* ============================================================
   carrito.js  ·  LumenStore
   - Render de las cards con cajas de color superior.
   - Carrito con persistencia en localStorage.
   ============================================================ */

let carrito = [];
const CLAVE_CARRITO = "carritoLumenStore";

function guardarCarrito() {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function cargarCarrito() {
  const guardado = localStorage.getItem(CLAVE_CARRITO);
  if (!guardado) return;
  try {
    carrito = JSON.parse(guardado) || [];
  } catch (e) {
    carrito = [];
  }
}

function formatearPrecioCarrito(valor) {
  return "$" + Number(valor).toLocaleString("es-AR");
}

function calcularTotal() {
  return carrito.reduce(function (acc, p) { return acc + p.precio; }, 0);
}

function agregarProducto(producto) {
  carrito.push({
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.precio
  });
  actualizarCarrito();

  Swal.fire({
    icon: "success",
    title: "Agregado",
    text: producto.nombre + " se sumo al carrito.",
    timer: 1300,
    showConfirmButton: false
  });
}

function quitarProducto(indice) {
  carrito.splice(indice, 1);
  actualizarCarrito();
}

function vaciarCarrito() {
  if (carrito.length === 0) return;
  carrito = [];
  actualizarCarrito();
}

/* ---------- Render de las cards ---------- */

function mostrarProductos() {
  const grilla = document.getElementById("grilla-productos");
  grilla.innerHTML = "";

  productos.forEach(function (producto, indice) {
    const article = document.createElement("article");
    article.className = "card";

    // Si el producto no tiene color (porque se creó desde consola), usamos defaults
    const bgColor = producto.colorFondo || "#1E1E2C";
    const txtColor = producto.colorTexto || "#FFFFFF";
    const txtImg = producto.textoImagen || producto.nombre;

    article.innerHTML =
      // Agregamos esta caja de color superior
      '<div class="card-imagen" style="background-color: ' + bgColor + '; color: ' + txtColor + ';">' +
        '<span>' + txtImg + '</span>' +
      '</div>' +
      '<div class="card-info">' +
        '<span class="categoria">' + producto.categoria + "</span>" +
        "<h3>" + producto.nombre + "</h3>" +
        "<p>" + producto.descripcion + "</p>" +
        '<span class="precio">' + formatearPrecioCarrito(producto.precio) + "</span>" +
        '<button class="btn-agregar" data-indice="' + indice + '">' +
          '<i class="fa-solid fa-cart-plus"></i> Agregar al carrito' +
        "</button>" +
      "</div>";

    grilla.appendChild(article);
  });

  document.querySelectorAll(".btn-agregar").forEach(function (boton) {
    boton.addEventListener("click", function () {
      const indice = Number(boton.dataset.indice);
      agregarProducto(productos[indice]);
    });
  });
}

/* ---------- Render del carrito ---------- */

function actualizarCarrito() {
  const listaCarrito = document.getElementById("items-carrito");
  const totalTexto = document.getElementById("total-carrito");
  const cantidadTexto = document.getElementById("cantidad-carrito");
  const contador = document.getElementById("contador-carrito");

  listaCarrito.innerHTML = "";

  if (carrito.length === 0) {
    listaCarrito.innerHTML = '<li class="carrito-vacio">Tu carrito esta vacio.</li>';
  } else {
    carrito.forEach(function (producto, i) {
      const item = document.createElement("li");
      item.className = "carrito-item";
      item.innerHTML =
        '<span class="carrito-nombre">' + producto.nombre + "</span>" +
        '<span class="carrito-precio">' + formatearPrecioCarrito(producto.precio) + "</span>" +
        '<button class="btn-quitar" data-indice="' + i + '" title="Quitar">' +
          '<i class="fa-solid fa-xmark"></i>' +
        "</button>";
      listaCarrito.appendChild(item);
    });

    listaCarrito.querySelectorAll(".btn-quitar").forEach(function (boton) {
      boton.addEventListener("click", function () {
        quitarProducto(Number(boton.dataset.indice));
      });
    });
  }

  totalTexto.textContent = formatearPrecioCarrito(calcularTotal());
  cantidadTexto.textContent = carrito.length;

  if (contador) {
    contador.textContent = carrito.length;
    contador.style.display = carrito.length > 0 ? "inline-flex" : "none";
  }

  guardarCarrito();
}

/* ---------- Finalizar compra (demo) ---------- */

function finalizarCompra() {
  if (carrito.length === 0) {
    Swal.fire({
      icon: "info",
      title: "Tu carrito esta vacio",
      text: "Agrega productos antes de pagar.",
      confirmButtonColor: "#F2A83B"
    });
    return;
  }

  Swal.fire({
    icon: "success",
    title: "Gracias por tu compra",
    html: "Total a pagar: <strong>" + formatearPrecioCarrito(calcularTotal()) + "</strong><br><br>" +
          "<small>El pago es solo una demostracion, no se procesa ningun cobro.</small>",
    confirmButtonText: "Cerrar",
    confirmButtonColor: "#F2A83B"
  });

  carrito = [];
  actualizarCarrito();
}

/* ---------- Arranque ---------- */

document.addEventListener("DOMContentLoaded", function () {
  cargarCarrito();
  mostrarProductos();
  actualizarCarrito();

  const modal = document.getElementById("modal-carrito");

  document.getElementById("abrir-carrito").addEventListener("click", function (e) {
    e.preventDefault();
    modal.classList.remove("oculto");
  });

  document.getElementById("cerrar-carrito").addEventListener("click", function () {
    modal.classList.add("oculto");
  });

  modal.addEventListener("click", function (e) {
    if (e.target === modal) modal.classList.add("oculto");
  });

  document.getElementById("btn-vaciar").addEventListener("click", vaciarCarrito);
  document.getElementById("btn-pagar").addEventListener("click", finalizarCompra);
});