<script>
  const destacados = [
    { id: "TC001", nombre: "Torta Cuadrada de Chocolate", desc: "Deliciosa torta...", link: "#detalles" },
    { id: "PI001", nombre: "Mousse de Chocolate", desc: "Postre individual cremoso...", link: "#detalles" },
    { id: "PSA001", nombre: "Torta Sin Azúcar de Naranja", desc: "Torta ligera y deliciosa...", link: "#detalles" },
    { id: "PV001", nombre: "Torta Vegana de Chocolate", desc: "Húmeda y deliciosa...", link: "#detalles" }
  ];

  const ul = document.querySelector('[data-testid="home-destacados"]');
  ul.innerHTML = destacados.map(prod => `
    <li>
      <article>
        <h4>${prod.nombre}</h4>
        <p>${prod.desc}</p>
        <a href="${prod.link}" data-id="${prod.id}">Ver detalles</a>
      </article>
    </li>
  `).join('');
</script>

<script>
  const form = document.querySelector('[data-screen="catalogo-filtro"]');
  form.addEventListener('change', () => {
    const categorias = [...form.querySelectorAll('input[name="cat"]:checked')].map(el => el.id);
    const tipo = form.querySelector('#tipo-pastel').value;

    console.log("Categorías seleccionadas:", categorias);
    console.log("Tipo seleccionado:", tipo);

    // Aquí filtrarías los productos del catálogo
  });
</script>

<table id="tabla-productos">
  <thead>
    <tr>
      <th>Código</th>
      <th>Categoría</th>
      <th>Nombre</th>
      <th>Precio</th>
    </tr>
  </thead>
  <tbody>
    <tr data-categoria="tortas-cuadradas">
      <td>TC001</td>
      <td>Tortas Cuadradas</td>
      <td>Torta Cuadrada de Chocolate</td>
      <td>$45.000 CLP</td>
    </tr>
    <tr data-categoria="tortas-circulares">
      <td>TT001</td>
      <td>Tortas Circulares</td>
      <td>Torta Circular de Vainilla</td>
      <td>$40.000 CLP</td>
    </tr>
    <!-- ... resto de productos -->
  </tbody>
</table>

<script>
  const formFiltros = document.querySelector('[data-screen="catalogo-filtro"]');
  const filas = document.querySelectorAll('#tabla-productos tbody tr');

  formFiltros.addEventListener('change', () => {
    // Obtener categorías seleccionadas
    const categoriasSeleccionadas = [...formFiltros.querySelectorAll('input[name="categoria"]:checked')]
      .map(el => el.value);

    // Obtener tipo seleccionado
    const tipoSeleccionado = formFiltros.querySelector('#tipo-pastel').value;

    filas.forEach(fila => {
      const categoria = fila.dataset.categoria;

      // Condiciones de filtrado
      const coincideCategoria = categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(categoria);
      const coincideTipo = tipoSeleccionado === "" || categoria === tipoSeleccionado;

      // Mostrar u ocultar fila
      if (coincideCategoria && coincideTipo) {
        fila.style.display = "";
      } else {
        fila.style.display = "none";
      }
    });
  });
</script>

<script>
  const formFiltros = document.querySelector('[data-screen="catalogo-filtro"]');
  const productos = document.querySelectorAll('#lista-productos li');

  formFiltros.addEventListener('change', () => {
    const categoriasSeleccionadas = [...formFiltros.querySelectorAll('input[name="categoria"]:checked')]
      .map(el => el.value);

    const tipoSeleccionado = formFiltros.querySelector('#tipo-pastel').value;

    productos.forEach(item => {
      const categoria = item.dataset.categoria;

      const coincideCategoria = categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(categoria);
      const coincideTipo = tipoSeleccionado === "" || categoria === tipoSeleccionado;

      if (coincideCategoria && coincideTipo) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  });
</script>

<script>
  const listaCarrito = document.getElementById("lista-carrito");
  const totalTexto = document.querySelector(".total");
  let total = 0;

  // 🧁 Productos de ejemplo
  const productos = [
    { nombre: "Torta Cuadrada de Chocolate", precio: 45000 },
    { nombre: "Mousse de Chocolate", precio: 5000 }
  ];

  // 🧩 Función para agregar producto
  function agregarProducto(producto) {
    const li = document.createElement("li");
    li.innerHTML = `${producto.nombre} - $${producto.precio.toLocaleString()} CLP 
      <button onclick="eliminarProducto(this, ${producto.precio})">Eliminar</button>`;
    listaCarrito.appendChild(li);
    total += producto.precio;
    actualizarTotal();
  }

  // 🧹 Eliminar producto
  function eliminarProducto(boton, precio) {
    boton.parentElement.remove();
    total -= precio;
    actualizarTotal();
  }

  // 💰 Actualizar total
  function actualizarTotal() {
    totalTexto.textContent = `Total: $${total.toLocaleString()} CLP`;
  }

  // 🧪 Simulación de carga inicial
  productos.forEach(p => agregarProducto(p));
</script>

<script>
  // 🧾 Captura el formulario por su ID
  const formPerfil = document.getElementById("form-perfil");

  // 🧠 Escucha el evento de envío
  formPerfil.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que se recargue la página

    // 📦 Obtiene los valores de los campos
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const direccion = document.getElementById("direccion").value.trim();

    // ✅ Validación básica
    if (!nombre || !correo || !direccion) {
      alert("Por favor completa todos los campos.");
      return;
    }

    // 🧾 Simulación de guardado (puedes conectar con backend o localStorage)
    const perfil = {
      nombre,
      correo,
      direccion
    };

    console.log("Perfil guardado:", perfil); // Para auditoría en consola
    alert("¡Cambios guardados correctamente!");
  });
</script>

