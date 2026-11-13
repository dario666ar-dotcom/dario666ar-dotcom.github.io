# Documentación Técnica - LumenStore

## 1. Descripción General
LumenStore es una Single Page Application (SPA) desarrollada con HTML5, CSS3 y JavaScript Vanilla (sin frameworks). Simula un e-commerce de iluminación con renderizado dinámico de productos, carrito de compras persistente, integración de APIs y un panel de administración por consola.

## 2. Detalles del Desarrollo
*   **Arquitectura de archivos:**
    *   `index.html`: Estructura semántica y puntos de anclaje (IDs) para la inyección de JS.
    *   `style.css`: Hoja de estilos centralizada con variables CSS (Custom Properties) para la paleta de colores.
    *   `productos.js`: Módulo de datos. Contiene el array de productos y el CRUD (Crear, Leer, Actualizar, Borrar) mediante el objeto `window`.
    *   `carrito.js`: Módulo de renderizado e interacción. Manipula el DOM para pintar las tarjetas y gestiona la lógica del carrito.
    *   `extras.js`: Módulo de servicios externos (Fetch API).
*   **Consumo de APIs:**
    *   **Open-Meteo (Clima):** Petición GET sin API Key para obtener el clima actual en La Plata y reflejarlo en el Hero.
    *   **Formspree (Formulario):** Envío de datos POST mediante Fetch, manejando la respuesta con SweetAlert2.

## 3. Mejores Prácticas Implementadas
*   **Uso estricto del DOM:** Uso de `document.getElementById`, `querySelector`, y creación de elementos con `createElement` en lugar de usar `document.write` o inyecciones masivas de HTML.
*   **Manejo de Estado:** El carrito y los productos editados se serializan con `JSON.stringify()` y se guardan en `localStorage`. Al iniciar, se recuperan con `JSON.parse()` previniendo la pérdida de datos.
*   **Validación y UX:** El formulario de contacto bloquea el botón de envío (`disabled`) y muestra un spinner mientras espera la respuesta de la API, evitando múltiples envíos duplicados.
*   **Código Defensivo:** Si la API del clima falla (por ejemplo, sin internet), la interfaz no se rompe; simplemente el widget desaparece silenciosamente (`display: none`).
*   **Accesibilidad (a11y):** Uso de etiquetas semánticas (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`), atributos `alt` en imágenes (cuando las había), `labels` vinculados a los `inputs` y `title` en los botones de acción.

## 4. Cómo ejecutar el proyecto
1. Clonar o descargar los 5 archivos en una misma carpeta.
2. Abrir el archivo `index.html` en cualquier navegador moderno.
3. Para acceder al panel de administración de productos, abrir la consola de desarrollador (F12), ir a la pestaña "Consola" y escribir el comando: `menu()`.