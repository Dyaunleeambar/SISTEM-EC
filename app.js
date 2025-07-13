// Funciones auxiliares
function parseDate(dateString) {
    if (!dateString) return null;
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            console.warn('Fecha inválida:', dateString);
            return null;
        }
        return date;
    } catch (error) {
        console.error('Error parsing date:', error);
        return null;
    }
}

function formatDate(date) {
    if (!date) return '';
    return date.toISOString().split('T')[0];
}

function getDayOfMonth(date) {
    if (!date) return null;
    return date.getDate();
}

function evaluateStimulation(row) {
    // 1. Verificar si está en el país
    if (row.Estado === 'En país') {
        return 'Sí';
    }

    // 2. Verificar si no tiene fecha de salida
    const salidaDate = parseDate(row['Fecha de Salida']);
    if (!salidaDate) {
        return 'Sí';
    }

    // 3. Verificar si sale después del día 15
    const salidaDay = getDayOfMonth(salidaDate);
    if (salidaDay >= 15) {
        return 'Sí';
    }

    // 4. Si sale antes del día 15
    if (row['Fin de Misión'] === 'Sí') {
        return 'No';
    }

    // Si sale antes del día 15 y no es fin de misión, está en vacaciones
    return 'No';
}

// Función para mostrar mensajes
function showMessage(message, type) {
    const importMessage = document.getElementById('importMessage');
    if (importMessage) {
        importMessage.textContent = message;
        importMessage.className = `import-message ${type}`;
    }
}

// Función para manejar la importación del archivo Excel
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const importButton = document.getElementById('importButton');
    const importMessage = document.getElementById('importMessage');
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            importButton.disabled = false;
            importMessage.textContent = '';
            importMessage.className = 'import-message';
        } else {
            importButton.disabled = true;
        }
    });

    importButton.addEventListener('click', importarDatos);

    function importarDatos() {
        const file = fileInput.files[0];
        if (!file) {
            showMessage('Por favor, seleccione un archivo Excel primero.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                
                updateTable(jsonData);
                updateCounters(jsonData);
                updateLocationCounters(jsonData);
                
                showMessage(`Importación exitosa! Total de colaboradores: ${jsonData.length}`, 'success');
                importButton.disabled = true;
            } catch (error) {
                showMessage('Error al procesar el archivo Excel. Por favor, verifique el formato.', 'error');
                console.error('Error:', error);
            }
        };
        
        reader.onerror = () => {
            showMessage('Error al leer el archivo. Por favor, intente nuevamente.', 'error');
        };
        
        reader.readAsArrayBuffer(file);
    }

    function showMessage(message, type) {
        importMessage.textContent = message;
        importMessage.className = `import-message ${type}`;
    }
});

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Leer el archivo
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Procesar los datos
        processExcelData(workbook);
    };
    reader.readAsArrayBuffer(file);
}

function processExcelData(workbook) {
    // Obtener la primera hoja
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet);

    // Validar y procesar los datos
    const processedData = rawData.map(row => {
        // Validar y limpiar el nombre
        const nombre = row['Nombre y Apellidos'] ? row['Nombre y Apellidos'].trim() : '';
        if (!nombre) {
            console.warn('Fila sin nombre:', row);
        }

        // Validar otros campos importantes
        const estado = row.Estado ? row.Estado.trim() : '';
        const fechaSalida = parseDate(row['Fecha de Salida']);
        const fechaEntrada = parseDate(row['Fecha de Entrada']);
        const finMision = row['Fin de Misión'] ? row['Fin de Misión'].trim() : '';

        // Formatear fechas como yyyy-MM-dd
        const salidaFormatted = formatDate(fechaSalida);
        const entradaFormatted = formatDate(fechaEntrada);

        return {
            ...row,
            'Nombre y Apellidos': nombre,
            Estado: estado,
            'Fecha de Salida': salidaFormatted,
            'Fin de Misión': finMision
        };
    });

    // Procesar los datos y actualizar la UI
    updateTable(processedData);
    updateCounters(processedData);
}

function updateTable(data) {
    const tbody = document.querySelector('#collaboratorsTable tbody');
    if (!tbody) {
        console.error('No se encontró el tbody de la tabla');
        return;
    }
    tbody.innerHTML = '';

    let idCounter = 0;
    data.forEach(row => {
        if (!row['Nombre y Apellidos']) {
            console.error('Fila sin nombre:', row);
            return;
        }

        // Asignar un ID único si no existe
        if (!row.id) {
            row.id = idCounter++;
        }

        // Formatear fechas
        const salidaFormatted = formatDate(row['Fecha de Salida']);
        const entradaFormatted = formatDate(row['Fecha de Entrada']);

        // Actualizar el estado de estimulación basado en las reglas
        row.Estimulacion = evaluateStimulation(row);
        
        const tr = document.createElement('tr');
        tr.className = 'data-row';
        tr.innerHTML = `
            <td data-field="estado">${row.Estado}</td>
            <td data-field="nombre">${row['Nombre y Apellidos']}</td>
            <td><input type="date" class="date-input" value="${salidaFormatted}" data-id="${row.id}" data-field="fecha_salida"></td>
            <td data-field="estimulacion">${row.Estimulacion}</td>
            <td>
                <div class="date-control">
                    <input type="checkbox" class="disable-date" data-id="${row.id}" data-field="fin_mision">
                    <label>Deshabilitar fecha</label>
                    <input type="date" class="date-input" value="${entradaFormatted}" data-id="${row.id}" data-field="fecha_entrada">
                </div>
            </td>
            <td data-field="vacaciones">${row.Vacaciones}</td>
            <td data-field="fin_mision">${row['Fin de Misión']}</td>
        `;
        tbody.appendChild(tr);
    });

    // Agregar event listeners después de que todos los elementos estén en el DOM
    const dateControls = document.querySelectorAll('.date-control');
    if (dateControls && dateControls.length > 0) {
        dateControls.forEach(control => {
            const checkbox = control.querySelector('.disable-date');
            const input = control.querySelector('.date-input');
            
            if (checkbox && input) {
                // Asegurarse de que el checkbox tenga el ID correcto
                checkbox.dataset.id = checkbox.dataset.id || input.dataset.id;
                
                checkbox.addEventListener('change', handleCheckboxChange);
                input.addEventListener('change', handleDateChange);
                
                // Establecer el estado inicial del input basado en el checkbox
                input.disabled = checkbox.checked;
                input.style.cursor = checkbox.checked ? 'not-allowed' : 'auto';
            }
        });
    }
}

// Función para obtener los datos almacenados en el DOM
function getData() {
    const table = document.getElementById('collaboratorsTable');
    if (!table) {
        console.error('Tabla no encontrada');
        return [];
    }
    const tbody = table.querySelector('tbody');
    if (!tbody) {
        console.error('tbody no encontrado');
        return [];
    }
    const rows = tbody.querySelectorAll('.data-row');
    const data = [];
    
    rows.forEach(row => {
        const rowData = {};
        // Obtener el ID del input de fecha
        const dateInput = row.querySelector('.date-input');
        if (dateInput) {
            rowData.id = parseInt(dateInput.dataset.id);
        }
        
        row.querySelectorAll('[data-field]').forEach(input => {
            const field = input.dataset.field;
            rowData[field] = input.value || input.textContent;
        });
        data.push(rowData);
    });
    
    return data;
}

// Función para manejar cambios en los checkboxes
function handleCheckboxChange(event) {
    const checkbox = event.target;
    const dateInput = checkbox.closest('.date-control').querySelector('.date-input');
    const dataId = checkbox.dataset.id || checkbox.closest('.date-control').querySelector('.date-input').dataset.id;
    const dataField = checkbox.dataset.field;
    
    // Validar que tenemos todos los datos necesarios
    if (!dataId) {
        console.error('ID no encontrado en el checkbox');
        console.log('Checkbox:', checkbox);
        console.log('Date input:', dateInput);
        return;
    }
    if (!dateInput) {
        console.error('Input de fecha no encontrado');
        return;
    }
    
    // Actualizar el estado del input
    dateInput.disabled = checkbox.checked;
    dateInput.style.cursor = checkbox.checked ? 'not-allowed' : 'auto';
    
    // Obtener el row correspondiente
    const data = getData();
    if (!data || data.length === 0) {
        console.error('No hay datos disponibles');
        return;
    }
    
    const row = data.find(r => r.id === parseInt(dataId));
    if (!row) {
        console.error('Row no encontrado para ID:', dataId);
        console.log('Datos disponibles:', data);
        return;
    }

    // Verificar si hay fecha de salida
    const salidaDate = parseDate(row['Fecha de Salida']);
    if (!salidaDate) {
        checkbox.checked = false;
        showMessage('No se puede marcar Fin de Misión sin fecha de salida', 'error');
        return;
    }

    // Actualizar el estado de Fin de Misión
    row['Fin de Misión'] = checkbox.checked ? 'Sí' : 'No';

    // Actualizar la estimulación basada en el nuevo estado
    row.Estimulacion = evaluateStimulation(row);

    // Actualizar los contadores
    updateCounters(data);
    updateLocationCounters(data);
}

// Función para manejar cambios en las fechas
function handleDateChange(event) {
    const input = event.target;
    const collaboratorId = input.dataset.id;
    const field = input.dataset.field;
    const value = input.value;

    // Aquí podríamos actualizar el estado del colaborador basado en la fecha
    // Por ahora solo actualizamos el valor en la UI
    console.log(`Fecha cambiada para colaborador ${collaboradorId}: ${field} = ${value}`);
}

function updateCounters(data) {
    // Contadores generales
    const totalCollaborators = data.length;
    const withStimulation = data.filter(row => row.Estimulacion === 'Sí').length;
    const onVacation = data.filter(row => row.Vacaciones === 'Sí').length;
    const endOfMission = data.filter(row => row['Fin de Misión'] === 'Sí').length;

    // Actualizar contadores generales
    document.getElementById('totalCollaborators').textContent = totalCollaborators;
    document.getElementById('withStimulation').textContent = withStimulation;
    document.getElementById('onVacation').textContent = onVacation;
    document.getElementById('endOfMission').textContent = endOfMission;

    // Actualizar contadores por ubicación
    updateLocationCounters(data);
}

function updateLocationCounters(data) {
    // Limpiar los botones existentes
    const locationButtons = document.querySelector('.location-buttons');
    locationButtons.innerHTML = '';

    // Crear un objeto para almacenar los datos por estado
    const stateData = {};
    
    // Contar los datos por estado
    data.forEach(row => {
        const state = row.Estado;
        if (!stateData[state]) {
            stateData[state] = { total: 0, stimulation: 0, vacation: 0, mission: 0 };
        }
        stateData[state].total++;
        if (row.Estimulacion === 'Sí') stateData[state].stimulation++;
        if (row.Vacaciones === 'Sí') stateData[state].vacation++;
        if (row['Fin de Misión'] === 'Sí') stateData[state].mission++;
    });

    // Crear botones para cada estado
    Object.entries(stateData).forEach(([state, counts]) => {
        const button = document.createElement('div');
        button.className = 'location-button';
        button.innerHTML = `
            <span>${state}</span>
            <span class="state-total">${counts.total}</span>
        `;
        
        // Agregar evento click
        button.addEventListener('click', () => {
            // Desactivar el botón anterior activo
            const activeButton = document.querySelector('.location-button.active');
            if (activeButton) activeButton.classList.remove('active');
            
            // Activar el nuevo botón
            button.classList.add('active');
            
            // Actualizar los contadores de detalles
            const details = document.querySelector('.location-details');
            details.style.display = 'block';
            
            // Actualizar los valores de los contadores
            const counters = details.querySelectorAll('.counter-value');
            counters[0].textContent = counts.total;
            counters[1].textContent = counts.stimulation;
            counters[2].textContent = counts.vacation;
            counters[3].textContent = counts.mission;
        });

        // Agregar el botón al DOM
        locationButtons.appendChild(button);
    });
}
