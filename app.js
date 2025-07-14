// Funciones auxiliares
function parseDate(dateString) {
    if (!dateString) {
        return null;
    }
    
    const trimmedDate = dateString.trim();
    if (trimmedDate === '') {
        return null;
    }
    
    try {
        // Intentar parsear como YYYY-MM-DD (formato más común)
        const parts = trimmedDate.split('-');
        if (parts.length === 3) {
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Los meses en JavaScript son 0-based
            const day = parseInt(parts[2], 10);
            const date = new Date(year, month, day);
            
            if (isNaN(date.getTime())) {
                console.warn('Fecha inválida (YYYY-MM-DD):', dateString);
                return null;
            }
            return date;
        }

        // Intentar parsear como MM/DD/YYYY
        const partsSlash = trimmedDate.split('/');
        if (partsSlash.length === 3) {
            const month = parseInt(partsSlash[0], 10) - 1; // Los meses en JavaScript son 0-based
            const day = parseInt(partsSlash[1], 10);
            const year = parseInt(partsSlash[2], 10);
            const date = new Date(year, month, day);
            
            if (isNaN(date.getTime())) {
                console.warn('Fecha inválida (MM/DD/YYYY):', dateString);
                return null;
            }
            return date;
        }

        // Intentar parsear como fecha ISO
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
        console.warn('Fecha no válida:', row['Fecha de Salida']);
        return 'No'; // Si la fecha no es válida, no tiene estimulación
    }

    // Obtener el día del mes (1-31)
    const salidaDay = salidaDate.getDate();
    
    // Regla: Si sale después del día 15, tiene estimulación
    if (salidaDay >= 15) {
        return 'Sí';
    }

    return 'No';
}

// Función para calcular el estado de vacaciones
function evaluateVacaciones(row) {
    // Reglas de vacaciones:
    // 1. Debe tener fecha de salida
    // 2. No debe estar en fin de misión
    const hasSalida = row['Fecha de Salida'] && row['Fecha de Salida'].trim() !== '';
    const isInFinMision = row['Fin de Misión'] === 'Sí';

    return hasSalida && !isInFinMision ? 'Sí' : 'No';
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

        // Calcular el estado de vacaciones
        const vacaciones = evaluateVacaciones({
            'Fecha de Salida': salidaFormatted,
            'Fin de Misión': finMision
        });

        return {
            ...row,
            'Nombre y Apellidos': nombre,
            Estado: estado,
            'Fecha de Salida': salidaFormatted,
            'Fecha de Entrada': entradaFormatted,
            'Fin de Misión': finMision,
            Estimulacion: estimulacion,
            Vacaciones: vacaciones
        };

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
            <td data-field="vacaciones">${row['Vacaciones'] || 'No'}</td>
            <td data-field="Fin de Misión">${row['Fin de Misión'] || 'No'}</td>
        `;
        
        // Primero agregar la fila al DOM
        tbody.appendChild(tr);
    });

    // Actualizar los contadores después de que todas las filas hayan sido creadas
    updateCounters(data);
    updateLocationCounters(data);

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
                // Obtener el valor directamente del DOM
                rowData[field] = element.textContent || '';
                
                // Actualizar el estado de vacaciones basado en las reglas
                const estado = row.querySelector('[data-field="estado"]').textContent || '';
                const finMision = row.querySelector('[data-field="Fin de Misión"]').textContent || '';
                const fechaSalida = row.querySelector('[data-field="Fecha de Salida"]').value || '';

                // Reglas de vacaciones:
                // 1. Debe tener fecha de salida
                // 2. No debe estar en fin de misión
                const hasSalida = fechaSalida && fechaSalida.trim() !== '';
                const isInFinMision = finMision === "Sí";

                const nuevoEstado = hasSalida && !isInFinMision ? "Sí" : "No";
                
                // Actualizar el DOM con el nuevo valor solo si ha cambiado
                const vacacionesElement = row.querySelector('[data-field="vacaciones"]');
                if (vacacionesElement && vacacionesElement.textContent !== nuevoEstado) {
                    vacacionesElement.textContent = nuevoEstado;
                }
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

    // Recalcular la estimulación y vacaciones basadas en el nuevo estado
    row.Estimulacion = evaluateStimulation(row);
    row.Vacaciones = evaluateVacaciones(row);

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

        // Actualizar la estimulación y vacaciones en el DOM
        const estimulacionCell = rowElement.querySelector('[data-field="estimulacion"]');
        if (estimulacionCell) {
            estimulacionCell.textContent = row.Estimulacion;
        }

        const vacacionesCell = rowElement.querySelector('[data-field="vacaciones"]');
        if (vacacionesCell) {
            vacacionesCell.textContent = row.Vacaciones;
        }
    }

    // Actualizar los contadores después de que el DOM se haya actualizado
    requestAnimationFrame(() => {
        // Obtener los datos actualizados
        const updatedData = getData();
        
        // Recalcular la estimulación y vacaciones para todas las filas
        updatedData.forEach(row => {
            const newEstimulacion = evaluateStimulation(row);
            const newVacaciones = evaluateVacaciones(row);
            row.Estimulacion = newEstimulacion;
            row.Vacaciones = newVacaciones;
        });

        // Actualizar los contadores
        updateCounters(updatedData);
        updateLocationCounters(updatedData);
        
        // Mantener el estado activo del botón de ubicación
        const activeButton = document.querySelector('.location-button.active');
        const activeState = activeButton ? activeButton.querySelector('span:first-child').textContent : null;
        
        // Si había un botón activo, restaurarlo
        if (activeState) {
            // Encontrar el botón que tiene el mismo texto
            const locationButtons = document.querySelectorAll('.location-button');
            let newActiveButton = null;
            locationButtons.forEach(button => {
                const buttonState = button.querySelector('span:first-child').textContent;
                if (buttonState === activeState) {
                    newActiveButton = button;
                }
            });
            
            if (newActiveButton) {
                newActiveButton.classList.add('active');
                const details = document.querySelector('.location-details');
                if (details) {
                    details.style.display = 'block';
                }
            }
        }
    });
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
    
    // Recalcular la estimulación y vacaciones basadas en la nueva fecha
    const newEstimulacion = evaluateStimulation(row);
    const newVacaciones = evaluateVacaciones(row);
    
    // Actualizar los valores en el objeto de datos
    row.Estimulacion = newEstimulacion;
    row.Vacaciones = newVacaciones;
    
    // Actualizar el DOM
    const rowElement = input.closest('.data-row');
    if (rowElement) {
        // Actualizar el valor de la fecha en el DOM primero
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

        // Actualizar la estimulación y vacaciones en el DOM
        const estimacionElement = rowElement.querySelector('[data-field="estimulacion"]');
        if (estimacionElement) {
            // Usar el valor directamente sin convertir a mayúsculas
            estimacionElement.textContent = newEstimulacion;
            // También actualizar el value si es un input
            if (estimacionElement.tagName === 'INPUT') {
                estimacionElement.value = newEstimulacion;
            }
        }

        // Actualizar el estado de vacaciones en el DOM
        const vacacionesElement = rowElement.querySelector('[data-field="vacaciones"]');
        if (vacacionesElement) {
            vacacionesElement.textContent = newVacaciones;
        }
    }

    // Actualizar los contadores después de que el DOM se haya actualizado
    requestAnimationFrame(() => {
        // Obtener los datos actualizados
        const updatedData = getData();
        
        // Recalcular la estimulación y vacaciones para todas las filas
        updatedData.forEach(row => {
            const newEstimulacion = evaluateStimulation(row);
            const newVacaciones = evaluateVacaciones(row);
            row.Estimulacion = newEstimulacion;
            row.Vacaciones = newVacaciones;

            // Actualizar el DOM de nuevo con los valores calculados
            const rowElement = document.querySelector(`.data-row[data-id="${row.id}"]`);
            if (rowElement) {
                // Actualizar estimulación
                const estimulacionCell = rowElement.querySelector('[data-field="estimulacion"]');
                if (estimulacionCell) {
                    // Asegurarnos de que el texto esté en mayúscula inicial
                    const estimulacionValue = newEstimulacion.charAt(0).toUpperCase() + newEstimulacion.slice(1);
                    estimulacionCell.textContent = estimulacionValue;
                }

                // Actualizar vacaciones
                const vacacionesCell = rowElement.querySelector('[data-field="vacaciones"]');
                if (vacacionesCell) {
                    vacacionesCell.textContent = newVacaciones;
                }
            }
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

    // Actualizar cada contador
    Object.entries({
        totalCollaborators,
        withStimulation,
        onVacation,
        endOfMission
    }).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

function updateLocationCounters(data) {
    // Verificar si el contenedor existe
    const container = document.querySelector('.location-buttons');
    if (!container) {
        console.error('Contenedor de botones de ubicación no encontrado');
        return;
    }
    // --- GUARDAR el botón activo ANTES de limpiar ---
    const prevActive = document.querySelector('.location-button.active');
    const prevLocation = prevActive ? prevActive.querySelector('span:first-child').textContent : 'Todos';
    // Limpiar los botones existentes
    container.innerHTML = '';

    // Contadores por ubicación
    const countersByLocation = {};
    
    // Contar los datos por ubicación usando el mismo método que los contadores generales
    if (data && Array.isArray(data)) {
        // Obtener los valores del DOM
        const tbody = document.querySelector('#collaboratorsTable tbody');
        if (!tbody) {
            console.error('No se encontró el tbody de la tabla');
            return;
        }

        // Obtener todas las filas
        const rows = tbody.querySelectorAll('.data-row');
        
        // Procesar cada fila usando los valores del DOM
        rows.forEach(row => {
            const location = row.querySelector('[data-field="estado"]')?.textContent || '';
            if (!location) return;

            if (!countersByLocation[location]) {
                countersByLocation[location] = {
                    total: 0,
                    stimulation: 0,
                    vacation: 0,
                    mission: 0
                };
            }
            
            // Contar total
            countersByLocation[location].total++;
            
            // Obtener los valores directamente de las celdas del DOM
            const vacacionesCell = row.querySelector('[data-field="vacaciones"]');
            const finMisionCell = row.querySelector('[data-field="Fin de Misión"]');
            const estimulacionCell = row.querySelector('[data-field="estimulacion"]');

            // Contar con estimulación
            const estimulacion = estimulacionCell?.textContent?.trim() || 'No';
            if (estimulacion === 'Sí') {
                countersByLocation[location].stimulation++;
            }
            
            // Contar en vacaciones
            const vacaciones = vacacionesCell?.textContent?.trim() || 'No';
            if (vacaciones === 'Sí') {
                countersByLocation[location].vacation++;
            } else {
                console.log('Valor de vacaciones:', vacaciones);
            }
            
            // Contar fin de misión
            const finMision = finMisionCell?.textContent?.trim() || 'No';
            if (finMision === 'Sí') {
                countersByLocation[location].mission++;
            } else {
                console.log('Valor de fin de misión:', finMision);
            }
            
            // Logs para depuración
            console.log('Procesando fila para ubicación:', location);
            console.log('Vacaciones:', vacaciones);
            console.log('Fin de Misión:', finMision);
            console.log('Contadores:', countersByLocation[location]);
        });
    }
    
    // Log final de contadores por ubicación
    console.log('Contadores por ubicación:', countersByLocation);

    // Crear botón "Todos"
    const allBtn = document.createElement('div');
    allBtn.className = 'location-button';
    allBtn.innerHTML = `
        <span>Todos</span>
        <span class="state-total">${data.length}</span>
    `;
    allBtn.addEventListener('click', () => {
    const currentActive = document.querySelector('.location-button.active');
    if (currentActive) currentActive.classList.remove('active');
    allBtn.classList.add('active');
    filterTableByLocation('Todos');

    // Mostrar la tarjeta de detalles y poner los valores generales
    const details = document.querySelector('.location-details');
    if (details) {
        details.style.display = 'block';
        const counterElements = details.querySelectorAll('.counter-value');
        if (counterElements.length === 4) {
            // Obtén los valores generales
            const total = data.length;
            const stimulation = data.filter(row => row.Estimulacion === 'Sí').length;
            const vacation = data.filter(row => row.Vacaciones === 'Sí').length;
            const mission = data.filter(row => row['Fin de Misión'] === 'Sí').length;
            const values = [total, stimulation, vacation, mission];
            counterElements.forEach((element, idx) => {
                element.textContent = values[idx];
            });
        }
    }
});
    container.appendChild(allBtn);

    // Crear botones para cada ubicación
    Object.entries(countersByLocation).forEach(([location, counters]) => {
        const button = document.createElement('div');
        button.className = 'location-button';
        button.innerHTML = `
            <span>${location}</span>
            <span class="state-total">${counters.total}</span>
        `;
        
        // Agregar evento click
        button.addEventListener('click', () => {
            // Desactivar el botón anterior activo
            const currentActive = document.querySelector('.location-button.active');
            if (currentActive) currentActive.classList.remove('active');
            
            // Activar el nuevo botón
            button.classList.add('active');
            
            // Mostrar detalles
            const details = document.querySelector('.location-details');
            if (details) {
                details.style.display = 'block';
                const counterElements = details.querySelectorAll('.counter-value');
                if (counterElements.length === 4) {
                    counterElements.forEach(element => {
                        const label = element.previousElementSibling.textContent;
                        console.log('Actualizando contador:', label);
                        console.log('Valor actual:', element.textContent);

                        const propertyMap = {
                            'Total': 'total',
                            'Con Estímulo': 'stimulation',
                            'Vacaciones': 'vacation',
                            'Fin de Misión': 'mission'
                        };

                        const propertyName = propertyMap[label];

                        if (propertyName && counters.hasOwnProperty(propertyName)) {
                            element.textContent = counters[propertyName];
                        } else {
                            console.warn('Propiedad no encontrada para label:', label);
                            element.textContent = '0';
                        }

                        console.log('Valor final:', element.textContent);
                    });
                }
            }

            // ...
            filterTableByLocation(location);
        });
        container.appendChild(button);
    });

    // --- NUEVO BLOQUE PARA RESTAURAR EL BOTÓN ACTIVO ---
    // Buscar cuál era el botón activo antes de limpiar
    const activeButton = document.querySelector('.location-button.active');
    const activeLocation = activeButton ? activeButton.querySelector('span:first-child').textContent : null;

    // Después de crear los botones, restaurar el activo
    const buttons = container.querySelectorAll('.location-button');
    let restored = false;
    buttons.forEach(btn => {
        const btnLocation = btn.querySelector('span:first-child').textContent;
        if (btnLocation === prevLocation) {
            btn.classList.add('active');
            filterTableByLocation(prevLocation);
            restored = true;
            // ...después de btn.classList.add('active'); filterTableByLocation(prevLocation); restored = true;

            // Actualizar los contadores de la tarjeta de detalles en tiempo real
            const details = document.querySelector('.location-details');
            if (details && countersByLocation[prevLocation]) {
                const counterElements = details.querySelectorAll('.counter-value');
                const counters = countersByLocation[prevLocation];
                if (counterElements.length === 4) {
                    const propertyMap = ['total', 'stimulation', 'vacation', 'mission'];
                    counterElements.forEach((element, idx) => {
                        element.textContent = counters[propertyMap[idx]] ?? '0';
                    });
                }
            }
        }
    });
    if (!restored) {
        // Si no se restauró, activar "Todos"
        const allBtn = container.querySelector('.location-button');
        if (allBtn) {
            allBtn.classList.add('active');
            filterTableByLocation('Todos');
        }
    }

    // Si el botón activo es "Todos", actualiza la tarjeta de detalles con los valores generales
    const activeBtn = container.querySelector('.location-button.active');
    if (activeBtn && activeBtn.querySelector('span:first-child').textContent === 'Todos') {
        const details = document.querySelector('.location-details');
        if (details) {
            details.style.display = 'block';
            const counterElements = details.querySelectorAll('.counter-value');
            if (counterElements.length === 4) {
                const total = data.length;
                const stimulation = data.filter(row => row.Estimulacion === 'Sí').length;
                const vacation = data.filter(row => row.Vacaciones === 'Sí').length;
                const mission = data.filter(row => row['Fin de Misión'] === 'Sí').length;
                const values = [total, stimulation, vacation, mission];
                counterElements.forEach((element, idx) => {
                    element.textContent = values[idx];
                });
            }
        }
    }
}

// Función para filtrar la tabla por ubicación
function filterTableByLocation(location) {
    const tbody = document.querySelector('#collaboratorsTable tbody');
    if (!tbody) return;

    const rows = tbody.querySelectorAll('.data-row');
    rows.forEach(row => {
        const estado = row.querySelector('[data-field="estado"]')?.textContent || '';
        if (location === 'Todos') {
            row.style.display = '';
        } else {
            row.style.display = estado === location ? '' : 'none';
        }
    });
}
