document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registro-form");
  const mensajeDiv = document.getElementById("registro-mensaje");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const fechaNacimiento = document.getElementById("fecha-nacimiento").value;
    const codigo = document.getElementById("codigo").value.trim().toUpperCase();

    let beneficios = [];

    // Calcular edad
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    const edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    // Beneficio 1: Mayores de 50 años
    if (edad >= 50) {
      beneficios.push("🎉 50% de descuento en todos los productos.");
    }

    // Beneficio 2: Código FELICES50
    if (codigo === "FELICES50") {
      beneficios.push("🎁 10% de descuento de por vida.");
    }

    // Beneficio 3: Estudiantes Duoc
    if (email.endsWith("@duocuc.cl")) {
      beneficios.push("🎂 Una torta gratis en tu cumpleaños.");
    }

    // Mostrar resultados
    if (beneficios.length > 0) {
      mensajeDiv.innerHTML = `
        <p>✅ Registro exitoso, ${nombre}.</p>
        <ul>${beneficios.map((b) => `<li>${b}</li>`).join("")}</ul>
      `;
      mensajeDiv.style.color = "green";
    } else {
      mensajeDiv.innerHTML = `<p>✅ Registro exitoso, ${nombre}. (No se aplicaron descuentos especiales)</p>`;
      mensajeDiv.style.color = "blue";
    }

    // Reset form (opcional)
    form.reset();
  });

// ===================== CATÁLOGO Y CARRITO DINÁMICOS =====================
const productos = [
  { id: "TC001", nombre: "Torta Cuadrada de Chocolate", precio: 45000, categoria: "Tortas Cuadradas", descripcion: "Deliciosa torta de chocolate con capas de ganache y un toque de avellanas.", img: "Imagenes/TortaChocolate.png" },
  { id: "TC002", nombre: "Torta Cuadrada de Frutas", precio: 50000, categoria: "Tortas Cuadradas", descripcion: "Mezcla de frutas frescas y crema chantilly sobre bizcocho de vainilla.", img: "Imagenes/TortaFrutas.png" },
  { id: "TT001", nombre: "Torta Circular de Vainilla", precio: 40000, categoria: "Tortas Circulares", descripcion: "Bizcocho de vainilla clásico relleno con crema pastelera.", img: "Imagenes/TortaVainilla.png" },
  { id: "TT002", nombre: "Torta Circular de Manjar", precio: 42000, categoria: "Tortas Circulares", descripcion: "Torta tradicional chilena con manjar y nueces.", img: "Imagenes/TortaManjar.png" },
  { id: "PI001", nombre: "Mousse de Chocolate", precio: 5000, categoria: "Postres Individuales", descripcion: "Postre individual cremoso y suave, hecho con chocolate de alta calidad.", img: "Imagenes/MousseChocolate.png" },
  { id: "PI002", nombre: "Tiramisú Clásico", precio: 5500, categoria: "Postres Individuales", descripcion: "Postre italiano con capas de café, mascarpone y cacao.", img: "Imagenes/Tiramisu.png" },
  // ...agrega más productos según tu catálogo
];

let carrito = [];

function renderCatalogo(filtrar = "all", buscar = "") {
  const grid = document.getElementById("product-grid");
  if (!grid) return;
  let filtrados = productos.filter(p =>
    (filtrar === "all" || p.categoria === filtrar) &&
    (p.nombre.toLowerCase().includes(buscar.toLowerCase()) || p.descripcion.toLowerCase().includes(buscar.toLowerCase()))
  );
  grid.innerHTML = filtrados.length === 0 ? '<p class="text-center">No hay productos para mostrar.</p>' :
    `<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      ${filtrados.map(prod => `
        <div class="col">
          <div class="card h-100">
            <img src="${prod.img}" class="card-img-top img-fluid" alt="${prod.nombre}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${prod.nombre}</h5>
              <p class="card-text">${prod.descripcion}</p>
              <strong class="mb-2">$${prod.precio.toLocaleString()} CLP</strong>
              <button class="btn btn-primary mt-auto w-100" onclick="agregarAlCarrito('${prod.id}')">Agregar al carrito</button>
            </div>
          </div>
        </div>
      `).join("")}
    </div>`;
}

window.agregarAlCarrito = function(id) {
  const prod = productos.find(p => p.id === id);
  if (!prod) return;
  const item = carrito.find(i => i.id === id);
  if (item) {
    item.cantidad++;
  } else {
    carrito.push({ ...prod, cantidad: 1 });
  }
  renderCarrito();
};

function renderCarrito() {
  const panel = document.getElementById("cart-panel");
  const itemsDiv = document.getElementById("cart-items");
  const totalSpan = document.getElementById("cart-total");
  const countSpan = document.getElementById("cart-count");
  if (!itemsDiv || !totalSpan || !countSpan) return;
  if (carrito.length === 0) {
    itemsDiv.innerHTML = '<p class="text-center">El carrito está vacío.</p>';
    totalSpan.textContent = "$0";
    countSpan.textContent = "0";
    return;
  }
  let total = 0;
  itemsDiv.innerHTML = `<ul class="list-group mb-2">
    ${carrito.map(item => {
      total += item.precio * item.cantidad;
      return `<li class="list-group-item d-flex justify-content-between align-items-center">
        <span>${item.nombre} <span class="badge bg-secondary">x${item.cantidad}</span></span>
        <span>$${(item.precio * item.cantidad).toLocaleString()}</span>
        <button class="btn btn-sm btn-danger ms-2" onclick="eliminarDelCarrito('${item.id}')">Eliminar</button>
      </li>`;
    }).join("")}
  </ul>`;
  totalSpan.textContent = "$" + total.toLocaleString();
  countSpan.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
}

window.eliminarDelCarrito = function(id) {
  carrito = carrito.filter(item => item.id !== id);
  renderCarrito();
};

// Mostrar/ocultar panel carrito
document.getElementById("cart-btn")?.addEventListener("click", () => {
  document.getElementById("cart-panel").style.display = "block";
});
document.getElementById("close-cart")?.addEventListener("click", () => {
  document.getElementById("cart-panel").style.display = "none";
});

// Filtros y búsqueda
document.getElementById("filter-category")?.addEventListener("change", e => {
  renderCatalogo(e.target.value, document.getElementById("search").value);
});
document.getElementById("search")?.addEventListener("input", e => {
  renderCatalogo(document.getElementById("filter-category").value, e.target.value);
});

// Inicialización
renderCatalogo();
renderCarrito();
// Responsividad: el catálogo usa Bootstrap grid, las tarjetas se adaptan automáticamente.
