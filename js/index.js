//Función que inicializa el elemento Slider
function inicializarSlider(){
  $("#rangoPrecio").ionRangeSlider({
    type: "double",
    grid: false,
    min: 0,
    max: 100000,
    from: 200,
    to: 80000,
    prefix: "$"
  });
}
inicializarSlider();

//Document ready para ejecutar código cuando el DOM está listo
$(document).ready(function() {

  //TODO | Tarea 1 - Mostrar todos los registros
  // Evento click para el botón "Mostrar Todos"
  $('#mostrarTodos').click( () => {
      // Realizar una solicitud AJAX para obtener todos los registros del archivo JSON "data-1.json"
      $.getJSON('./data-1.json', function(data) {
          // Llamar a la función que muestra los registros
          mostrarRegistros(data);
      });
  });

  function mostrarRegistros(data) {
      // Seleccionar el contenedor donde se mostrarán los resultados y vaciarlo
      let resultadosContenedor = $('.cardResultados');
      resultadosContenedor.empty();

      // Iterar sobre cada registro en los datos JSON
      $.each(data, function(index, registro) {
          // Crear un elemento de tarjeta para mostrar el registro
          const tarjeta = `
              <div class="card card-flex">
                <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1373&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" width="300" heigth="200">
                <div class="card-content">
                  <p><strong>Dirección:</strong>${registro.Direccion}</p>
                  <p><strong>Ciudad:</strong>${registro.Ciudad}</p>
                  <p><strong>Teléfono:</strong>${registro.Telefono}</p>
                  <p><strong>Código Postal:</strong>${registro.Codigo_Postal}</p>
                  <p><strong>Tipo:</strong>${registro.Tipo}</p>
                  <p><strong>Precio:</strong>${registro.Precio}</p>
                </div>
              </div>`
          // Agregar la tarjeta al contenedor de resultados
          resultadosContenedor.append(tarjeta);
      });
  }

  //TODO | Tarea 2 - Filtrar registros por ciudad y tipo de vivienda seleccionados sin repetir
  $.getJSON('./data-1.json', function(data) {
      // Obtener todas las ciudades únicas y todos los tipos únicos
      var ciudadesUnicas = obtenerValoresUnicos(data, 'Ciudad');
      var tiposUnicos = obtenerValoresUnicos(data, 'Tipo');

      // Llenar el menú desplegable de ciudad con las ciudades únicas
      const selectCiudad = $('#selectCiudad');
      $.each(ciudadesUnicas, function(index, ciudad) {
          selectCiudad.append($('<option>', {
              value: ciudad,
              text: ciudad
          }));
      });

      // Llenar el menú desplegable de tipo de vivienda con los tipos únicos
      var selectTipo = $('#selectTipo');
      $.each(tiposUnicos, function(index, tipo) {
          selectTipo.append($('<option>', {
              value: tipo,
              text: tipo
          }));
      });

      // Inicializar los menús desplegables
      $('select').formSelect();
  });
    // Función para obtener valores únicos de una propiedad en los datos
  function obtenerValoresUnicos(data, propiedad) {
    var valoresUnicos = [];
    $.each(data, function(index, item) {
        if (valoresUnicos.indexOf(item[propiedad]) === -1) {
            valoresUnicos.push(item[propiedad]);
        }
    });
    return valoresUnicos;
  }

  // Todo | Tarea 3 - Filtrar registros por ciudad, tipo y rangos de precio seleccionados
    // Cargar el archivo JSON
    fetch('./data-1.json')
    .then(response => response.json())
    .then(data => {
        // Agregar opciones de ciudad y tipo al formulario
        const selectCiudad = document.getElementById('selectCiudad');
        const selectTipo = document.getElementById('selectTipo');
        const ciudades = new Set();
        const tipos = new Set();

        data.forEach(property => {
            ciudades.add(property.Ciudad);
            tipos.add(property.Tipo);
        });

        ciudades.forEach(ciudad => {
            const option = document.createElement('option');
            option.textContent = ciudad;
            selectCiudad.appendChild(option);
        });

        tipos.forEach(tipo => {
            const option = document.createElement('option');
            option.textContent = tipo;
            selectTipo.appendChild(option);
        });

        // Manejar la búsqueda
        document.getElementById('formulario').addEventListener('submit', function(event) {
            event.preventDefault();

            const ciudadSeleccionada = selectCiudad.value;
            const tipoSeleccionado = selectTipo.value;
            const slider = $("#rangoPrecio").data("ionRangeSlider");
            const precioMinimo = slider.result.from;
            const precioMaximo = slider.result.to;

            const resultadosFiltrados = data.filter(property => {
                const precioProperty = parseInt(property.Precio.replace('$', '').replace(',', ''));
                return (ciudadSeleccionada === '' || property.Ciudad === ciudadSeleccionada) &&
                       (tipoSeleccionado === '' || property.Tipo === tipoSeleccionado) &&
                       (precioProperty >= precioMinimo) &&
                       (precioProperty <= precioMaximo);
            });

            mostrarResultados(resultadosFiltrados);
        });

        // Función para mostrar los resultados
        function mostrarResultados(resultados) {
            const resultadosDiv = document.querySelector('.cardResultados');
            resultadosDiv.innerHTML = '';

            resultados.forEach(registro => {
              const cardDiv = document.createElement('div');
              cardDiv.classList.add('card', 'card-flex');
      
              const img = document.createElement('img');
              img.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1373&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
              img.width = '300';
              img.height = '200';
      
              const cardContentDiv = document.createElement('div');
              cardContentDiv.classList.add('card-content');
      
              const direccion = document.createElement('p');
              direccion.innerHTML = `<strong>Dirección:</strong> ${registro.Direccion}`;
      
              const ciudad = document.createElement('p');
              ciudad.innerHTML = `<strong>Ciudad:</strong> ${registro.Ciudad}`;
      
              const telefono = document.createElement('p');
              telefono.innerHTML = `<strong>Teléfono:</strong> ${registro.Telefono}`;
      
              const codigoPostal = document.createElement('p');
              codigoPostal.innerHTML = `<strong>Código Postal:</strong> ${registro.Codigo_Postal}`;
      
              const tipo = document.createElement('p');
              tipo.innerHTML = `<strong>Tipo:</strong> ${registro.Tipo}`;
      
              const precio = document.createElement('p');
              precio.innerHTML = `<strong>Precio:</strong> ${registro.Precio}`;
      
              cardContentDiv.appendChild(direccion);
              cardContentDiv.appendChild(ciudad);
              cardContentDiv.appendChild(telefono);
              cardContentDiv.appendChild(codigoPostal);
              cardContentDiv.appendChild(tipo);
              cardContentDiv.appendChild(precio);
      
              cardDiv.appendChild(img);
              cardDiv.appendChild(cardContentDiv);
      
              resultadosDiv.appendChild(cardDiv);
          });
        }
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));
});
