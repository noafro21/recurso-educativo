// Funciones de JavaScript para la interactividad condicional

/**
 * Alterna la visibilidad del campo de texto de 'Otras condiciones'
 * @param {HTMLInputElement} checkbox - La casilla de verificación de 'Otras condiciones'.
 */
function toggleOtherConditionField(checkbox) {
  const $field = $("#otras_condiciones_field");
  if (checkbox.checked) {
    // Si la casilla está marcada, muestra el campo de texto.
    $field.show();
    $field.find("input").focus();
  } else {
    // Si la casilla está desmarcada, oculta el campo de texto y lo limpia.
    $field.hide();
    $field.find("input").val("");
  }
}

/**
 * Muestra u oculta la lista desplegable de convenios/seguros.
 * @param {boolean} show - Verdadero para mostrar, Falso para ocultar.
 */
function showInsuranceDetails(show) {
  const $detailsDiv = $("#seguro_details");
  const $selectField = $("#convenio");

  if (show) {
    // Muestra el campo de selección
    $detailsDiv.show();
    $selectField.focus();
  } else {
    // Oculta el campo de selección y resetea su valor
    $detailsDiv.hide();
    $selectField.val(""); // Resetea la selección al valor por defecto
  }
}

// Obtención de Elementos del DOM y Variables Globales

// El formulario tiene el id `registroFormulario` en HTML (usar jQuery)
const $registroFormulario = $("#registroFormulario");

// Campos de formulario y sus SPAN de error (jQuery objects)
const $nombre_completo = $("#nombre_completo");
const $error_nombre_completo = $("#error_nombre_completo");

const $identificacion = $("#identificacion");
const $error_identificacion = $("#error_identificacion");

const $fecha_nacimiento = $("#fecha_nacimiento");
const $error_fecha_nacimiento = $("#error_fecha_nacimiento");

const $email = $("#email");
const $error_email = $("#error_email");

const $telefono = $("#telefono");
const $error_telefono = $("#error_telefono");

// Campos adicionales usados en el envío
const $peso = $("#peso");
const $altura = $("#altura");
const $medicamentos = $("#medicamentos");
const $alergias = $("#alergias");

// Variables Globales de Estado
let Errores = false;
let Actualizando = false;

// --- Funciones de Validación ---
function muestrarOcultarError($campo, $campospan) {
  // Si el campo no existe en el DOM, salir sin intentar validar
  if (!$campo || $campo.length === 0) {
    if ($campospan && $campospan.length) $campospan.html("");
    return;
  }

  // Evita validar el campo de especificación si está oculto
  if (
    $campo.attr("id") === "otras_condiciones_text" &&
    $campo.closest("#otras_condiciones_field").is(":hidden")
  ) {
    if ($campospan && $campospan.length) $campospan.html("");
    return;
  }

  const campo = $campo[0];

  if (!campo.validity.valid) {
    Errores = true;

    // Determinación del mensaje de error más específico
    if (campo.validity.valueMissing) {
      $campospan.text("Debe introducir la información del campo");
    } else if (campo.validity.badInput) {
      $campospan.text("El campo no cumple con el tipo de campo");
    } else if (campo.validity.typeMismatch || campo.validity.patternMismatch) {
      // Este caso atrapa la validación de SOLO LETRAS y SOLO NÚMEROS
      $campospan.text("El campo no cumple con el formato.");
    } else if (campo.validity.tooShort) {
      $campospan.text(
        "El campo no cumple con la longitud mínima: " + campo.minLength
      );
    } else if (campo.validity.tooLong) {
      $campospan.text(
        "El campo no cumple con la longitud máxima: " + campo.maxLength
      );
    } else if (campo.validity.rangeUnderflow) {
      $campospan.text("El campo no cumple con el valor mínimo: " + campo.min);
    } else if (campo.validity.rangeOverflow) {
      $campospan.text("El campo no cumple con el valor máximo: " + campo.max);
    } else {
      $campospan.text("El campo no cumple con validación");
    }

    // Añadir clase visual de error (Bootstrap)
    $campo.addClass("is-invalid");
  } else {
    // Ocultar el error si es válido
    if ($campospan && $campospan.length) $campospan.html("");
    $campo.removeClass("is-invalid");
  }
}

/**
 * Función principal para ejecutar todas las validaciones (Solo llamadas directas).
 */
function ValidarFormulario() {
  // Llamadas individuales para cada campo obligatorio
  muestrarOcultarError($nombre_completo, $error_nombre_completo);
  muestrarOcultarError($identificacion, $error_identificacion);
  muestrarOcultarError($fecha_nacimiento, $error_fecha_nacimiento);
  muestrarOcultarError($email, $error_email);
  muestrarOcultarError($telefono, $error_telefono);
}

// --- Manejadores de Eventos ---

// Manejador de Submit (usando jQuery)
if ($registroFormulario.length) {
  $registroFormulario.on("submit", function (event) {
    event.preventDefault();
    // Reiniciar la bandera global de errores
    Errores = false;
    ValidarFormulario();

    if (Errores) {
      // Llevar el foco al primer error visible
      const $primerError = $(".form-text.text-danger")
        .filter(function () {
          return $(this).text().trim() !== "";
        })
        .first();
      if ($primerError.length) {
        const $inputRelacionado = $primerError.prev("input, select, textarea");
        if ($inputRelacionado.length) $inputRelacionado.focus();
      }
      alert("Se encontraron errores. Revise los campos marcados.");
    } else {
      alert("Formulario Enviado. Enviando datos al servidor...");
      // Log de ejemplo
      console.log(
        "Nombre completo: " +
          ($nombre_completo.length ? $nombre_completo.val() : "")
      );
      console.log("Correo electrónico: " + ($email.length ? $email.val() : ""));

      // **IMPORTANTE: Ahora llamamos a fetchPost() directamente aquí.**
      fetchPost();
    }
  });
}

// Agregar Event Listeners para validación en tiempo real (al escribir/cambiar)
// Llamadas individuales para cada campo de input
// Añadir listeners solo si los campos existen (evita errores si faltan en el HTML)
if ($nombre_completo.length) {
  $nombre_completo.on("input", function () {
    muestrarOcultarError($nombre_completo, $error_nombre_completo);
  });
}

if ($identificacion.length) {
  $identificacion.on("input", function () {
    muestrarOcultarError($identificacion, $error_identificacion);
  });
}

if ($fecha_nacimiento.length) {
  $fecha_nacimiento.on("input", function () {
    muestrarOcultarError($fecha_nacimiento, $error_fecha_nacimiento);
  });
}

if ($email.length) {
  $email.on("input", function () {
    muestrarOcultarError($email, $error_email);
  });
}

if ($telefono.length) {
  $telefono.on("input", function () {
    muestrarOcultarError($telefono, $error_telefono);
  });
}

// Registrar nuevo usuario
async function fetchPost() {
  try {
    // Construir objeto de usuario usando .val() de jQuery
    const usuario = {
      identificacion: $identificacion.length ? $identificacion.val() : "",
      nombre_completo: $nombre_completo.length ? $nombre_completo.val() : "",
      email: $email.length ? $email.val() : "",
      telefono: $telefono.length ? $telefono.val() : "",
      peso: $peso.length ? $peso.val() : "",
      altura: $altura.length ? $altura.val() : "",
      medicamentos: $medicamentos.length ? $medicamentos.val() : "",
      alergias: $alergias.length ? $alergias.val() : "",
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    };
    const response = await fetch("http://localhost:3000/usuarios", options);
    if (response.ok) {
      const responseData = await response.json();
      console.log("Respuesta API:", responseData);
      alert("Registro guardado correctamente.");
    } else {
      let text = await response.text();
      console.error("Error en API:", response.status, text);
      alert("Error al guardar: " + response.status + "\n" + text);
    }
  } catch (error) {
    console.error("Error ejecutando la petición Get:", error);
    alert(
      "Error de conexión o CORS al intentar guardar el registro. Revisa la consola para más detalles."
    );
  }
}
