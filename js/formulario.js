
        // Funciones de JavaScript para la interactividad condicional

        /**
         * Alterna la visibilidad del campo de texto de 'Otras condiciones'
         * @param {HTMLInputElement} checkbox - La casilla de verificación de 'Otras condiciones'.
         */
        function toggleOtherConditionField(checkbox) {
            const field = document.getElementById('otras_condiciones_field');
            if (checkbox.checked) {
                // Si la casilla está marcada, muestra el campo de texto.
                field.style.display = 'block';
                field.querySelector('input').focus();
            } else {
                // Si la casilla está desmarcada, oculta el campo de texto y lo limpia.
                field.style.display = 'none';
                field.querySelector('input').value = '';
            }
        }

        /**
         * Muestra u oculta la lista desplegable de convenios/seguros.
         * @param {boolean} show - Verdadero para mostrar, Falso para ocultar.
         */
        function showInsuranceDetails(show) {
            const detailsDiv = document.getElementById('seguro_details');
            const selectField = document.getElementById('convenio');

            if (show) {
                // Muestra el campo de selección
                detailsDiv.style.display = 'block';
                selectField.focus();
            } else {
                // Oculta el campo de selección y resetea su valor
                detailsDiv.style.display = 'none';
                selectField.value = ''; // Resetea la selección al valor por defecto
            }
        }
  