// ==============================
//  DESTACADOS EN HOME
// ==============================
const destacados = [
  {
    id: "TC001",
    nombre: "Torta Cuadrada de Chocolate",
    desc: "Deliciosa torta con ganache y avellanas.",
    link: "#detalles",
    img: "img/productos/TC001.jpg",
    categoria: "tortas-cuadradas"
  },
  {
    id: "PI001",
    nombre: "Mousse de Chocolate",
    desc: "Postre individual cremoso con textura suave.",
    link: "#detalles",
    img: "img/productos/PI001.jpg",
    categoria: "postres-individuales"
  },
  {
    id: "PSA001",
    nombre: "Torta Sin Azúcar de Naranja",
    desc: "Torta ligera y deliciosa para diabéticos.",
    link: "#detalles",
    img: "img/productos/PSA001.jpg",
    categoria: "tortas-sin-azucar"
  },
  {
    id: "PV001",
    nombre: "Torta Vegana de Chocolate",
    desc: "Húmeda y deliciosa sin ingredientes animales.",
    link: "#detalles",
    img: "img/productos/PV001.jpg",
    categoria: "tortas-veganas"
  }
];

const ulDestacados = document.querySelector('[data-testid="home-destacados"]');
if (ulDestacados) {
  ulDestacados.classList.add("grid-productos");
  ulDestacados.innerHTML = destacados.map(prod => `
    <li data-categoria="${prod.categoria}">
      <article>
        <img src="${prod.img}" alt="${prod.nombre}" loading="lazy">
        <h4>${prod.nombre}</h4>
        <p>${prod.desc}</p>
        <a href="${prod.link}" data-id="${prod.id}" aria-label="Ver detalles de ${prod.nombre}">Ver detalles</a>
      </article>
    </li>
  `).join('');
}

 
//  FILTROS DE CATÁLOGO
 
const formFiltros = document.querySelector('[data-screen="catalogo-filtro"]');
const filasTabla = document.querySelectorAll('#tabla-productos tbody tr');
const productosLista = document.querySelectorAll('#lista-productos li');

if (formFiltros) {
  formFiltros.addEventListener('change', () => {
    const categoriasSeleccionadas = [...formFiltros.querySelectorAll('input[name="categoria"]:checked')]
      .map(el => el.value);
    const tipoSeleccionado = formFiltros.querySelector('#tipo-pastel')?.value || "";

    // Filtrar tabla
    filasTabla.forEach(fila => {
      const categoria = fila.dataset.categoria;
      const coincideCategoria = categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(categoria);
      const coincideTipo = tipoSeleccionado === "" || categoria === tipoSeleccionado;
      fila.style.display = (coincideCategoria && coincideTipo) ? "" : "none";
    });

    // Filtrar lista
    productosLista.forEach(item => {
      const categoria = item.dataset.categoria;
      const coincideCategoria = categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(categoria);
      const coincideTipo = tipoSeleccionado === "" || categoria === tipoSeleccionado;
      item.style.display = (coincideCategoria && coincideTipo) ? "" : "none";
    });
  });
}

 
/*CARRITO DE COMPRAS*/

const listaCarrito = document.getElementById("lista-carrito");
const totalTexto = document.querySelector(".total");
let total = 0;

const productosCarrito = [
  { nombre: "Torta Cuadrada de Chocolate", precio: 45000 },
  { nombre: "Mousse de Chocolate", precio: 5000 }
];

function agregarProducto(producto) {
  const li = document.createElement("li");
  li.innerHTML = `${producto.nombre} - $${producto.precio.toLocaleString()} CLP 
    <button onclick="eliminarProducto(this, ${producto.precio})">Eliminar</button>`;
  listaCarrito.appendChild(li);
  total += producto.precio;
  actualizarTotal();
}

function eliminarProducto(boton, precio) {
  boton.parentElement.remove();
  total -= precio;
  actualizarTotal();
}

function actualizarTotal() {
  totalTexto.textContent = `Total: $${total.toLocaleString()} CLP`;
}

/*Simulación de carga inicial*/
productosCarrito.forEach(p => agregarProducto(p));

/*FORMULARIO DE PERFIL*/
const formPerfil = document.getElementById("form-perfil");

if (formPerfil) {
  formPerfil.addEventListener("submit", function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const direccion = document.getElementById("direccion").value.trim();

    if (!nombre || !correo || !direccion) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const perfil = { nombre, correo, direccion };
    console.log("Perfil guardado:", perfil);
    alert("¡Cambios guardados correctamente!");
  });
}

/*FORMULARIO DE INGRESO */
const formIngresar = document.getElementById("form-ingresar");

if (formIngresar) {
  formIngresar.addEventListener("submit", function (event) {
    event.preventDefault();

    const correo = document.getElementById("correo").value.trim();
    const clave = document.getElementById("clave").value.trim();

    if (!correo || !clave) {
      alert("Por favor completa ambos campos.");
      return;
    }

    /*Simulación de autenticación (puedes conectar con backend o localStorage)*/
    const usuario = { correo, clave };
    console.log("Usuario autenticado:", usuario);
    alert("¡Bienvenido! Has ingresado correctamente.");
  });
}
