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
});
