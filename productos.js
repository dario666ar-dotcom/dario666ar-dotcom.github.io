/* ============================================================
   productos.js  ·  LumenStore
   - Catálogo local de productos con colores.
   - Guarda en localStorage (con reparación de versiones viejas).
   - Menú por consola para ver, agregar, modificar y eliminar.
   ============================================================ */

const CLAVE_PRODUCTOS = "productosLumenStore";

// Catálogo original (solo se usa la primera vez, o si restauramos)
const PRODUCTOS_DEFAULT = [
  {
    id: 1,
    nombre: "Lámpara Colgante Nórdica",
    categoria: "Colgantes",
    descripcion: "Estructura de metal negro mate con pantalla de madera natural.",
    precio: 45900,
    textoImagen: "Lámpara Colgante",
    colorFondo: "#1E1E2C",
    colorTexto: "#F2A83B"
  },
  {
    id: 2,
    nombre: "Tira LED RGB 5m",
    categoria: "Tiras LED",
    descripcion: "16 millones de colores, control por app y control remoto incluido.",
    precio: 18500,
    textoImagen: "Tira LED RGB",
    colorFondo: "#E91E63",
    colorTexto: "#FFFFFF"
  },
  {
    id: 3,
    nombre: "Foco LED Inteligente WiFi",
    categoria: "Focos",
    descripcion: "Compatible con Alexa y Google Home. 9W RGB + CCT.",
    precio: 12900,
    textoImagen: "Foco Inteligente",
    colorFondo: "#2196F3",
    colorTexto: "#FFFFFF"
  },
  {
    id: 4,
    nombre: "Plafón LED 24W",
    categoria: "Plafones",
    descripcion: "Luz cálida, neutra o fría. Ideal para living o dormitorio.",
    precio: 22300,
    textoImagen: "Plafón LED",
    colorFondo: "#F5F5F5",
    colorTexto: "#1E1E2C"
  },
  {
    id: 5,
    nombre: "Lámpara de Escritorio Flexible",
    categoria: "Escritorio",
    descripcion: "Cuello de ganso, 3 temperaturas de color y puerto USB.",
    precio: 28700,
    textoImagen: "Lámpara Escritorio",
    colorFondo: "#F2A83B",
    colorTexto: "#1E1E2C"
  },
  {
    id: 6,
    nombre: "Guirnalda Cálida 10m",
    categoria: "Decoración",
    descripcion: "20 luces estilo Edison para interior y exterior.",
    precio: 9800,
    textoImagen: "Guirnalda",
    colorFondo: "#FFC857",
    colorTexto: "#1E1E2C"
  }
];

let productos = [];

/* ---------- Persistencia en localStorage ---------- */

function guardarProductos() {
  localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos));
}

function cargarProductos() {
  const guardado = localStorage.getItem(CLAVE_PRODUCTOS);

  if (guardado === null) {
    // Primera vez que entra: guarda los originales
    productos = PRODUCTOS_DEFAULT.map(function(p) { return Object.assign({}, p); });
    guardarProductos();
  } else {
    try {
      productos = JSON.parse(guardado);
      
      // REPARACION: Si el producto no tiene colorFondo (porque venia de una version vieja),
      // se lo asignamos desde el default o le ponemos uno bonito.
      productos.forEach(function(p) {
        if (!p.colorFondo) {
          const original = PRODUCTOS_DEFAULT.find(function(def) { return def.id === p.id; });
          if (original) {
            p.colorFondo = original.colorFondo;
            p.colorTexto = original.colorTexto;
            p.textoImagen = original.textoImagen;
          } else {
            // Si es un producto creado por el usuario, le ponemos un color gris azulado
            p.colorFondo = "#2C3E50";
            p.colorTexto = "#FFFFFF";
            p.textoImagen = p.nombre;
          }
        }
      });
      
      guardarProductos(); // Guardamos la reparación
    } catch (e) {
      productos = PRODUCTOS_DEFAULT.map(function(p) { return Object.assign({}, p); });
      guardarProductos();
    }
  }
}

// Cargamos los productos INMEDIATAMENTE
cargarProductos();

/* ---------- Utilidades ---------- */

function formatearPrecio(valor) {
  return "$" + Number(valor).toLocaleString("es-AR");
}

function refrescarVista() {
  if (typeof mostrarProductos !== "function") return;
  if (!document.getElementById("grilla-productos")) return;
  mostrarProductos();
}

/* ---------- 1) Ver productos ---------- */

function listarProductos() {
  if (productos.length === 0) {
    alert("No hay productos cargados.");
    return;
  }
  let mensaje = "=== PRODUCTOS (" + productos.length + ") ===\n\n";
  productos.forEach(function (p) {
    mensaje += "[ID " + p.id + "] " + p.nombre + "\n";
    mensaje += "   Categoria:   " + p.categoria + "\n";
    mensaje += "   Descripcion: " + p.descripcion + "\n";
    mensaje += "   Precio:      " + formatearPrecio(p.precio) + "\n\n";
  });
  alert(mensaje);
  console.log(mensaje);
}

/* ---------- 2) Agregar producto ---------- */

function agregarProductoMenu() {
  const nombre = prompt("Nuevo producto - Nombre:\n(Cancelar para salir)");
  if (!nombre) return;

  const categoria = prompt("Categoria:");
  if (!categoria) return;

  const descripcion = prompt("Descripcion:");
  if (!descripcion) return;

  const precioTexto = prompt("Precio (solo numeros):");
  if (!precioTexto) return;

  const precio = Number(precioTexto);
  if (isNaN(precio) || precio < 0) {
    alert("Precio invalido. Volve a intentarlo.");
    return;
  }

  const nuevoId = productos.length
    ? Math.max.apply(null, productos.map(function (p) { return p.id; })) + 1
    : 1;

  // Generamos un color de fondo aleatorio lindo para el nuevo producto
  const colores = ["#9C27B0", "#4CAF50", "#FF5722", "#607D8B", "#00BCD4"];
  const colorRandom = colores[Math.floor(Math.random() * colores.length)];

  productos.push({
    id: nuevoId,
    nombre: nombre,
    categoria: categoria,
    descripcion: descripcion,
    precio: precio,
    textoImagen: nombre,
    colorFondo: colorRandom,
    colorTexto: "#FFFFFF"
  });

  guardarProductos();
  alert("Producto agregado (ID " + nuevoId + ").");
  refrescarVista();
}

/* ---------- 3) Modificar producto ---------- */

function modificarProductoMenu() {
  if (productos.length === 0) {
    alert("No hay productos.");
    return;
  }

  const listado = productos
    .map(function (p) { return "[ID " + p.id + "] " + p.nombre + " - " + formatearPrecio(p.precio); })
    .join("\n");

  const idTexto = prompt("Modificar producto - Ingresa el ID:\n\n" + listado);
  if (!idTexto) return;

  const id = Number(idTexto);
  const producto = productos.find(function (p) { return p.id === id; });

  if (!producto) {
    alert("No existe un producto con ID " + id + ".");
    return;
  }

  const nuevoNombre = prompt("Nombre actual: " + producto.nombre, producto.nombre);
  if (nuevoNombre !== null) {
    producto.nombre = nuevoNombre || producto.nombre;
    producto.textoImagen = producto.nombre; // Actualizamos el texto de la caja
  }

  const nuevaCategoria = prompt("Categoria actual: " + producto.categoria, producto.categoria);
  if (nuevaCategoria !== null) producto.categoria = nuevaCategoria || producto.categoria;

  const nuevaDescripcion = prompt("Descripcion actual: " + producto.descripcion, producto.descripcion);
  if (nuevaDescripcion !== null) producto.descripcion = nuevaDescripcion || producto.descripcion;

  const nuevoPrecioTexto = prompt("Precio actual: " + producto.precio, String(producto.precio));
  if (nuevoPrecioTexto !== null && nuevoPrecioTexto !== "") {
    const nuevoPrecio = Number(nuevoPrecioTexto);
    if (!isNaN(nuevoPrecio) && nuevoPrecio >= 0) {
      producto.precio = nuevoPrecio;
    }
  }

  guardarProductos();
  alert("Producto modificado.");
  refrescarVista();
}

/* ---------- 4) Eliminar producto ---------- */

function eliminarProductoMenu() {
  if (productos.length === 0) {
    alert("No hay productos.");
    return;
  }
  const listado = productos.map(function (p) { return "[ID " + p.id + "] " + p.nombre; }).join("\n");
  const idTexto = prompt("Eliminar producto - Ingresa el ID:\n\n" + listado);
  if (!idTexto) return;

  const id = Number(idTexto);
  const producto = productos.find(function (p) { return p.id === id; });

  if (!producto) {
    alert("No existe un producto con ID " + id + ".");
    return;
  }

  if (!confirm("Seguro que queres eliminar '" + producto.nombre + "'?")) return;

  const idx = productos.findIndex(function (p) { return p.id === id; });
  productos.splice(idx, 1);

  guardarProductos();
  alert("Producto eliminado.");
  refrescarVista();
}

/* ---------- 5) Restaurar catálogo original ---------- */

function restaurarProductosMenu() {
  if (!confirm("Esto borrara tus cambios y volvera a los 6 productos originales. Estas seguro?")) return;
  
  productos = PRODUCTOS_DEFAULT.map(function(p) { return Object.assign({}, p); });
  guardarProductos();
  alert("Catalogo restaurado.");
  refrescarVista();
}

/* ---------- Menú principal ---------- */

function menu() {
  let salir = false;
  while (!salir) {
    const opcion = prompt(
      "===== LUMENSTORE - ADMIN MENU =====\n" +
      "1. Ver productos\n" +
      "2. Agregar producto\n" +
      "3. Modificar producto\n" +
      "4. Eliminar producto\n" +
      "5. Restaurar originales\n" +
      "6. Salir\n" +
      "===================================\n\n" +
      "Elegi una opcion (1-6):"
    );

    if (opcion === null) {
      salir = true;
      break;
    }

    switch (opcion.trim()) {
      case "1": listarProductos(); break;
      case "2": agregarProductoMenu(); break;
      case "3": modificarProductoMenu(); break;
      case "4": eliminarProductoMenu(); break;
      case "5": restaurarProductosMenu(); break;
      case "6": salir = true; alert("Menu cerrado."); break;
      default: alert("Opcion invalida. Ingresa un numero del 1 al 6.");
    }
  }
}

/* ---------- Exponer en window (solo si estamos en el navegador) ---------- */

if (typeof window !== "undefined") {
  window.menu = menu;
  window.listarProductos = listarProductos;
  window.agregarProductoMenu = agregarProductoMenu;
  window.modificarProductoMenu = modificarProductoMenu;
  window.eliminarProductoMenu = eliminarProductoMenu;
  window.restaurarProductosMenu = restaurarProductosMenu;
}