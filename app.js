// Funciones auxiliares
function parseDate(dateString) {
    if (!dateString) {
        // Si no hay fecha, retornamos null
        return null;
    }
    
    // Eliminar espacios en blanco
    const trimmedDate = dateString.trim();
    
    if (trimmedDate === '') {
        // Si la fecha está vacía después de trim, retornamos null
        return null;
    }
    
    try {
        // Intentar parsear como MM/DD/YYYY
        const parts = trimmedDate.split('/');
        if (parts.length === 3) {
            const month = parseInt(parts[0], 10) - 1; // Los meses en JavaScript son 0-based
            const day = parseInt(parts[1], 10);
            const year = parseInt(parts[2], 10);
            const date = new Date(year, month, day);
            
            // Verificar si el parseo fue exitoso
            if (isNaN(date.getTime())) {
                console.warn('Fecha inválida (MM/DD/YYYY):', dateString);
                return null;
            }
            return date;
        }

        // Si no es MM/DD/YYYY, intentar parsear como YYYY-MM-DD
        const date = new Date(trimmedDate);
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
    // 1. Si está en el país o no tiene fecha de salida
    if (row.Estado === 'En país' || !row['Fecha de Salida'] || row['Fecha de Salida'].trim() === '') {
        return 'Sí';
    }

    // 2. Si tiene fecha de salida, verificar el día
    const salidaDate = parseDate(row['Fecha de Salida']);
    if (!salidaDate) {
        // Si no se puede parsear la fecha, asumimos que no tiene fecha de salida
        return 'Sí';
    }

    const salidaDay = getDayOfMonth(salidaDate);
    if (salidaDay >= 15) {
        return 'Sí';
    }

    return 'No';
}

// Función para mostrar mensajes
function showMessage(message, type) {
    const importMessage = document.getElementById('importMessage');
    if (importMessage) {
        importMessage.textContent = message;
        importMessage.className = `import-message ${type}`;
        // Ocultar el mensaje después de 5 segundos
        setTimeout(() => {
            importMessage.textContent = '';
            importMessage.className = 'import-message';
        }, 5000);
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
        // Ocultar el mensaje después de 5 segundos
        setTimeout(() => {
            importMessage.textContent = '';
            importMessage.className = 'import-message';
        }, 5000);
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

        // Calcular la estimulación basada en los datos
        const estimulacion = evaluateStimulation({
            Estado: estado,
            'Fecha de Salida': salidaFormatted
        });

        return {
            ...row,
            'Nombre y Apellidos': nombre,
            Estado: estado,
            'Fecha de Salida': salidaFormatted,
            'Fin de Misión': finMision,
            Estimulacion: estimulacion
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
        const estimulacion = evaluateStimulation(row);
        row.Estimulacion = estimulacion;
        
        const tr = document.createElement('tr');
        tr.className = 'data-row';
        tr.innerHTML = `
            <td data-field="estado">${row.Estado}</td>
            <td data-field="nombre">${row['Nombre y Apellidos']}</td>
            <td><input type="date" class="date-input" value="${salidaFormatted}" data-id="${row.id}" data-field="Fecha de Salida"></td>
            <td data-field="estimulacion">${estimulacion}</td>
            <td>
                <div class="date-control">
                    <input type="checkbox" class="disable-date" data-id="${row.id}" data-field="fin_mision">
                    <label>Fin de Misi</label>
                    <input type="date" class="date-input" value="${entradaFormatted}" data-id="${row.id}" data-field="Fecha de Entrada">
                </div>
            </td>
            <td data-field="vacaciones">${row.Vacaciones}</td>
            <td data-field="Fin de Misión">${row['Fin de Misión'] || 'No'}</td>
        `;
        
        // Primero agregar la fila al DOM
        tbody.appendChild(tr);

        // Luego actualizar los contadores
        updateCounters(data);
        updateLocationCounters(data);
    });

    // Agregar event listeners a todos los inputs de fecha
    const dateInputs = document.querySelectorAll('.date-input');
    if (dateInputs && dateInputs.length > 0) {
        dateInputs.forEach(input => {
            input.addEventListener('change', handleDateChange);
            
            // Si es el input de Fin de Misión, agregar el listener del checkbox
            const isFinMisionInput = input.dataset.field === 'Fecha de Entrada';
            if (isFinMisionInput) {
                const checkbox = input.parentElement.querySelector('.disable-date');
                if (checkbox) {
                    checkbox.addEventListener('change', handleCheckboxChange);
                    
                    // Establecer el estado inicial del input basado en el checkbox
                    input.disabled = checkbox.checked;
                    input.style.cursor = checkbox.checked ? 'not-allowed' : 'auto';
                }
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
        
        row.querySelectorAll('[data-field]').forEach(element => {
            const field = element.dataset.field;
            // Para campos de fecha, usar el valor directamente
            if (field.includes('fecha')) {
                rowData[field] = element.value;
            } else if (field === 'Fin de Misión') {
                rowData[field] = element.textContent || '';
            } else if (field === 'estimulacion') {
                // Para el campo de estimulación, calculamos el valor basado en los datos
                const estadoElement = row.querySelector('[data-field="estado"]');
                const fechaSalidaElement = row.querySelector('[data-field="Fecha de Salida"]');
                
                const estado = estadoElement.textContent || '';
                const fechaSalida = fechaSalidaElement.value || '';
                
                rowData[field] = evaluateStimulation({
                    Estado: estado,
                    'Fecha de Salida': fechaSalida
                });
            } else if (field === 'vacaciones') {
                // Para el campo de vacaciones, usar textContent
                rowData[field] = element.textContent || '';
            } else {
                // Para otros campos, usar value si existe, sino textContent
                rowData[field] = element.value || element.textContent || '';
            }
        });
        data.push(rowData);
    });
    
    return data;
}

// Función para manejar cambios en los checkboxes
function handleCheckboxChange(event) {
    const checkbox = event.target;
    const dataId = checkbox.dataset.id;
    const dataField = checkbox.dataset.field;
    
    // Validar que tenemos el ID necesario
    if (!dataId) {
        console.error('ID no encontrado en el checkbox');
        console.log('Checkbox:', checkbox);
        return;
    }
    
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
    const fechaSalida = row['Fecha de Salida'];
    console.log('Fecha de salida en row:', fechaSalida);
    console.log('Tipo de fecha:', typeof fechaSalida);
    
    // Verificar si el valor está vacío o es una cadena vacía
    if (!fechaSalida || fechaSalida.trim() === '') {
        console.log('Fecha considerada vacía:', fechaSalida);
        showMessage('No se puede marcar Fin de Misión: La fecha de salida está vacía', 'error');
        return;
    }

    // Intentar parsear la fecha
    const salidaDate = parseDate(fechaSalida);
    if (!salidaDate) {
        console.log('Fecha de salida:', fechaSalida);
        showMessage(`No se puede marcar Fin de Misión: La fecha de salida '${fechaSalida}' no es válida`, 'error');
        return;
    }

    // Verificar que la fecha no sea futura
    const today = new Date();
    if (salidaDate > today) {
        showMessage('No se puede marcar Fin de Misión: La fecha de salida es futura', 'error');
        return;
    }

    // Actualizar el estado de Fin de Misión
    row['Fin de Misión'] = checkbox.checked ? 'Sí' : 'No';

    // Actualizar la estimulación basada en el nuevo estado
    row.Estimulacion = evaluateStimulation(row);

    // Actualizar los contadores
    updateCounters(data);
    updateLocationCounters(data);

    // Obtener la fila y actualizar los elementos
    const rowElement = checkbox.closest('.data-row');
    if (rowElement) {
        // Actualizar el valor visible en la tabla
        const finMisionCell = rowElement.querySelector('[data-field="Fin de Misión"]');
        if (finMisionCell) {
            finMisionCell.textContent = row['Fin de Misión'];
        }

        // Deshabilitar/habilitar el input de Fecha de Entrada
        const entradaInput = rowElement.querySelector('[data-field="Fecha de Entrada"]');
        if (entradaInput) {
            entradaInput.disabled = checkbox.checked;
            entradaInput.style.cursor = checkbox.checked ? 'not-allowed' : 'auto';
        }
    }
}

// Función para manejar cambios en las fechas
function handleDateChange(event) {
    const input = event.target;
    const collaboratorId = input.dataset.id;
    const field = input.dataset.field;
    const value = input.value;

    // Obtener los datos actuales
    const data = getData();
    if (!data || data.length === 0) {
        console.error('No hay datos disponibles');
        return;
    }

    // Encontrar y actualizar la fila correspondiente
    const row = data.find(r => r.id === parseInt(collaboratorId));
    if (!row) {
        console.error('Row no encontrado para ID:', collaboratorId);
        return;
    }

    // Actualizar el valor de la fecha
    row[field] = value;
    
    // Recalcular la estimulación basada en la nueva fecha
    const newEstimulacion = evaluateStimulation(row);
    row.Estimulacion = newEstimulacion;
    
    // Actualizar el DOM
    const rowElement = input.closest('.data-row');
    if (rowElement) {
        // Actualizar la estimulación en el DOM
        const estimacionElement = rowElement.querySelector('[data-field="estimulacion"]');
        if (estimacionElement) {
            // Asegurarnos de que el texto esté en mayúsculas
            const estimulacionText = newEstimulacion.toUpperCase();
            estimacionElement.textContent = estimulacionText;
            // También actualizar el value si es un input
            if (estimacionElement.tagName === 'INPUT') {
                estimacionElement.value = estimulacionText;
            }
        }

        // Actualizar el valor de la fecha en el DOM
        const dateElement = rowElement.querySelector(`[data-field="${field}"]`);
        if (dateElement && dateElement.type === 'date') {
            dateElement.value = value;
        }

        // Actualizar el estado de Fin de Misión si es necesario
        if (field === 'Fecha de Salida') {
            const finMisionCheckbox = rowElement.querySelector('.disable-date');
            if (finMisionCheckbox) {
                const finMisionField = rowElement.querySelector('[data-field="fin_mision"]');
                if (finMisionField) {
                    finMisionField.textContent = row['Fin de Misión'];
                }
            }
        }
    }

    // Actualizar los contadores después de que el DOM se haya actualizado
    // Usamos requestAnimationFrame para asegurar que el DOM se actualice primero
    requestAnimationFrame(() => {
        // Obtener los datos actualizados
        const updatedData = getData();
        
        // Recalcular la estimulación para cada fila
        updatedData.forEach(row => {
            const newEstimulacion = evaluateStimulation(row);
            row.Estimulacion = newEstimulacion;
        });

        // Actualizar los contadores
        updateCounters(updatedData);
        updateLocationCounters(updatedData);
    });
}

function updateCounters(data) {
    // Contadores generales
    const totalCollaborators = data.length;
    const withStimulation = data.filter(row => row.Estimulacion === 'Sí').length;
    const onVacation = data.filter(row => row.Vacaciones === 'Sí').length;
    const endOfMission = data.filter(row => row['Fin de Misión'] === 'Sí').length;

    // Logs de depuración más detallados
    console.log('Total de colaboradores:', totalCollaborators);
    console.log('Con estimulación:', withStimulation);
    console.log('En vacaciones:', onVacation);
    console.log('Fin de misión:', endOfMission);

    // Actualizar todos los contadores de una vez
    const counters = {
        totalCollaborators,
        withStimulation,
        onVacation,
        endOfMission
    };

    // Actualizar cada contador
    Object.entries(counters).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            const oldValue = element.textContent;
            element.textContent = value;
            console.log(`Actualizando ${id} de ${oldValue} a ${value}`);
        } else {
            console.error(`Elemento ${id} no encontrado en el DOM`);
        }
    });

    // Actualizar contadores por ubicación
    updateLocationCounters(data);
}

function updateLocationCounters(data) {
    // Verificar si el contenedor existe
    const locationButtonsContainer = document.querySelector('.location-buttons');
    if (!locationButtonsContainer) {
        console.error('Contenedor de botones de ubicación no encontrado');
        return;
    }

    // Limpiar los botones existentes
    locationButtonsContainer.innerHTML = '';

    // Crear un objeto para almacenar los datos por estado
    const stateData = {};
    
    // Contar los datos por estado
    if (data && Array.isArray(data)) {
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
    }

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
            if (details) {
                details.style.display = 'block';
                
                // Actualizar los valores de los contadores
                const counters = details.querySelectorAll('.counter-value');
                if (counters.length === 4) {
                    counters[0].textContent = counts.total;
                    counters[1].textContent = counts.stimulation;
                    counters[2].textContent = counts.vacation;
                    counters[3].textContent = counts.mission;
                }
            }
        });

        // Agregar el botón al DOM
        locationButtonsContainer.appendChild(button);
    });
}
