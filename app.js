function showLoader() {
    document.getElementById('loader').style.display = 'flex';
}
function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

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

function evaluateStimulation(row, conciliationMonth) {
    // conciliationMonth: {year: 2025, month: 7} (mes 1-based)
    // Si no hay fecha de salida, se asume presencia todo el mes    
    if (!row['Fecha de Salida'] || row['Fecha de Salida'].trim() === '') {
        return 'Sí';
    }

    const salida = parseDate(row['Fecha de Salida']);
    if (!salida) return 'No';

    // Si no hay fecha de entrada, se asume que no regresó ese mes
    let entrada = null;
    if (row['Fecha de Entrada'] && row['Fecha de Entrada'].trim() !== '') {
        entrada = parseDate(row['Fecha de Entrada']);
        if (!entrada) return 'No';
        if (entrada < salida) return 'No'; // Fecha de entrada inválida
    }

    // Calcular rango de días en el país durante el mes de conciliación
    const year = conciliationMonth.year;
    const month = conciliationMonth.month; // 1-based
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    // Si salió antes del mes, no estuvo presente
    if (salida < firstDay && (!entrada || entrada < firstDay)) return 'No';

    // Si salió durante el mes, calcular días hasta salida o entrada
    let presenceStart = firstDay;
    let presenceEnd = lastDay;

    if (salida > firstDay && salida <= lastDay) {
        presenceEnd = salida;
    }
    if (entrada && entrada > firstDay && entrada <= lastDay) {
        presenceStart = entrada;
    }

    // Si salió y no regresó, presencia hasta salida
    if (salida >= firstDay && salida <= lastDay && (!entrada || entrada > lastDay)) {
        presenceEnd = salida;
    }

    // Si regresó después de salir, presencia desde entrada hasta fin de mes
    if (entrada && entrada >= firstDay && entrada <= lastDay) {
        presenceStart = entrada;
    }

    // Calcular días de presencia
    const daysPresent = Math.max(0, Math.floor((presenceEnd - presenceStart) / (1000 * 60 * 60 * 24)) + 1);

    return daysPresent >= 15 ? 'Sí' : 'No';
}

function getConciliationMonth() {
    const input = document.getElementById('conciliationMonth');
    let date = new Date();
    if (input && input.value) {
        const [year, month] = input.value.split('-');
        return { year: parseInt(year), month: parseInt(month) };
    }
    return { year: date.getFullYear(), month: date.getMonth() + 1 };
}

// Función para calcular el estado de vacaciones
function evaluateVacaciones(row) {
    // Si tiene fecha de entrada, no está de vacaciones
    if (row['Fecha de Entrada'] && row['Fecha de Entrada'].trim() !== '') {
        return 'No';
    }
    // Reglas de vacaciones:
    // 1. Debe tener fecha de salida
    // 2. No debe estar en fin de misión
    const hasSalida = row['Fecha de Salida'] && row['Fecha de Salida'].trim() !== '';
    const isInFinMision = row['Fin de Misión'] === 'Sí';

    return hasSalida && !isInFinMision ? 'Sí' : 'No';
}

// Función para manejar el cambio de fecha
function updateTable(data) {
    const tbody = document.querySelector('#collaboratorsTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.className = 'data-row';
        tr.innerHTML = `
            <td>${row.Estado}</td>
            <td>${row['Nombre y Apellidos']}</td>
            <td>${row['Fecha de Salida'] || ''}</td>
            <td>${row['Fecha de Entrada'] || ''}</td>
            <td>${row['Fin de Misión'] || ''}</td>
            <td>${row.Estimulacion || ''}</td>
            <td>${row.Vacaciones || ''}</td>
            <td>
                <button class="edit-btn" data-id="${row.id}">Editar</button>
                <button class="delete-btn" data-id="${row.id}">Eliminar</button>
            </td>
        `;
        
        // Primero agregar la fila al DOM
        tbody.appendChild(tr);
    });

    // Asigna eventos a los botones de eliminar
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            if (confirm('¿Seguro que deseas eliminar este colaborador?')) {
                fetch(`http://localhost:3001/api/colaboradores/${id}`, {
                    method: 'DELETE'
                })
                .then(res => res.json())
                .then(() => fetchColaboradores());
            }
        });
    });

    // Asigna eventos a los botones de editar
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            const colaborador = data.find(c => c.id == id);
            openEditModal(colaborador);
        });
    });
}

// Mostrar el modal y rellenar los datos
function openEditModal(colaborador) {
    document.getElementById('editId').value = colaborador.id;
    document.getElementById('editNombre').value = colaborador['Nombre y Apellidos'];
    document.getElementById('editEstado').value = colaborador.Estado;
    document.getElementById('editFechaSalida').value = colaborador['Fecha de Salida'] || '';
    document.getElementById('editFechaEntrada').value = colaborador['Fecha de Entrada'] || '';
    document.getElementById('editModal').style.display = 'block';
}

// Cerrar el modal
document.getElementById('closeEditModal').onclick = function() {
    document.getElementById('editModal').style.display = 'none';
};
window.onclick = function(event) {
    if (event.target == document.getElementById('editModal')) {
        document.getElementById('editModal').style.display = 'none';
    }
};

// Enviar cambios de edición
document.getElementById('editCollaboratorForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const id = document.getElementById('editId').value;
    const nombre = document.getElementById('editNombre').value.trim();
    const estado = document.getElementById('editEstado').value.trim();
    const fechaSalida = document.getElementById('editFechaSalida').value;
    const fechaEntrada = document.getElementById('editFechaEntrada').value;

    const colaboradorEditado = {
        id: parseInt(id),
        'Nombre y Apellidos': nombre,
        Estado: estado,
        'Fecha de Salida': fechaSalida,
        'Fecha de Entrada': fechaEntrada,
        'Fin de Misión': 'No', // Puedes ajustar según tu lógica
        Estimulacion: 'No',
        Vacaciones: 'No'
    };

    fetch(`http://localhost:3001/api/colaboradores/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mapFrontendToBackend(colaboradorEditado))
    })
    .then(res => res.json())
    .then(() => {
        document.getElementById('editModal').style.display = 'none';
        fetchColaboradores();
    })
    .catch(err => {
        alert('Error al actualizar colaborador.');
        console.error(err);
    });
});

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
                }, getConciliationMonth());
            } else if (field === 'vacaciones') {
                // Construir el objeto row para evaluar correctamente
                const fechaSalida = row.querySelector('[data-field="Fecha de Salida"]')?.value || '';
                const fechaEntrada = row.querySelector('[data-field="Fecha de Entrada"]')?.value || '';
                const finMision = row.querySelector('[data-field="Fin de Misión"]')?.textContent || '';

                const vacacionesValue = evaluateVacaciones({
                    'Fecha de Salida': fechaSalida,
                    'Fecha de Entrada': fechaEntrada,
                    'Fin de Misión': finMision
                });

                rowData[field] = vacacionesValue;

                // Actualizar el DOM solo si ha cambiado
                const vacacionesElement = row.querySelector('[data-field="vacaciones"]');
                if (vacacionesElement && vacacionesElement.textContent !== vacacionesValue) {
                    vacacionesElement.textContent = vacacionesValue;
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
    const conciliationMonth = getConciliationMonth();
    row.Estimulacion = evaluateStimulation(row, conciliationMonth);
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
            const conciliationMonth = getConciliationMonth();
            row.Estimulacion = evaluateStimulation(row, conciliationMonth);
            row.Vacaciones = evaluateVacaciones(row);
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

    // Sincronizar con el backend
    updateColaboradorInBackend(row);
}

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
    const conciliationMonth = getConciliationMonth();
    row.Estimulacion = evaluateStimulation(row, conciliationMonth);
    row.Vacaciones = evaluateVacaciones(row);
    
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
            estimacionElement.textContent = row.Estimulacion;
            // También actualizar el value si es un input
            if (estimacionElement.tagName === 'INPUT') {
                estimacionElement.value = row.Estimulacion;
            }
        }

        // Actualizar el estado de vacaciones en el DOM
        const vacacionesElement = rowElement.querySelector('[data-field="vacaciones"]');
        if (vacacionesElement) {
            vacacionesElement.textContent = row.Vacaciones;
        }
    }

    // Actualizar los contadores después de que el DOM se haya actualizado
    requestAnimationFrame(() => {
        // Obtener los datos actualizados
        const updatedData = getData();
        
        // Recalcular la estimulación y vacaciones para todas las filas
        updatedData.forEach(row => {
            const conciliationMonth = getConciliationMonth();
            row.Estimulacion = evaluateStimulation(row, conciliationMonth);
            row.Vacaciones = evaluateVacaciones(row);

            // Actualizar el DOM de nuevo con los valores calculados
            const rowElement = document.querySelector(`.data-row[data-id="${row.id}"]`);
            if (rowElement) {
                // Actualizar estimulación
                const estimulacionCell = rowElement.querySelector('[data-field="estimulacion"]');
                if (estimulacionCell) {
                    // Asegurarnos de que el texto esté en mayúscula inicial
                    const estimulacionValue = row.Estimulacion.charAt(0).toUpperCase() + row.Estimulacion.slice(1);
                    estimulacionCell.textContent = estimulacionValue;
                }

                // Actualizar vacaciones
                const vacacionesCell = rowElement.querySelector('[data-field="vacaciones"]');
                if (vacacionesCell) {
                    vacacionesCell.textContent = row.Vacaciones;
                }
            }
        });

        // Actualizar los contadores
        updateCounters(updatedData);
        updateLocationCounters(updatedData); 
    });

    // Sincronizar con el backend
    updateColaboradorInBackend(row);
}

function validateDates(row) {
    const salida = parseDate(row['Fecha de Salida']);
    const entrada = parseDate(row['Fecha de Entrada']);
    if (salida && entrada && entrada < salida) {
        showMessage('La fecha de entrada no puede ser anterior a la de salida.', 'error');
        return false;
    }
    return true;
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

// Evento para exportar a Excel
document.getElementById('exportButton').addEventListener('click', exportarDatos);

function exportarDatos() {
    // Obtén los datos actuales de la tabla
    const data = getData();
    if (!data || data.length === 0) {
        showMessage('No hay datos para exportar.', 'error');
        return;
    }

    // Opcional: puedes filtrar los datos según el botón de ubicación activo
    // const activeBtn = document.querySelector('.location-button.active');
    // if (activeBtn && activeBtn.querySelector('span:first-child').textContent !== 'Todos') {
    //     const location = activeBtn.querySelector('span:first-child').textContent;
    //     data = data.filter(row => row.Estado === location);
    // }

    // Convierte los datos a una hoja de Excel
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Colaboradores');

    // Descarga el archivo
    XLSX.writeFile(wb, 'colaboradores_exportados.xlsx');
}

let allCollaborators = []; // Guarda todos los colaboradores para filtrar

function updateStateCounters(data) {
    // Agrupa por Estado/Ubiación
    const stateCounts = {};
    data.forEach(row => {
        const estado = row.Estado || 'Sin Ubicación';
        stateCounts[estado] = (stateCounts[estado] || 0) + 1;
    });

    const container = document.getElementById('stateCountersContent');
    container.innerHTML = '';

    // Botón para mostrar todos
    const allBtn = document.createElement('button');
    allBtn.className = 'location-button';
    allBtn.textContent = `Todos (${data.length})`;
    allBtn.onclick = () => {
        updateTable(allCollaborators);
        setActiveButton(allBtn);
    };
    container.appendChild(allBtn);

    // Botones por estado
    Object.entries(stateCounts).forEach(([estado, count]) => {
        const btn = document.createElement('button');
        btn.className = 'location-button';
        btn.textContent = `${estado} (${count})`;
        btn.onclick = () => {
            const filtrados = allCollaborators.filter(c => (c.Estado || 'Sin Ubicación') === estado);
            updateTable(filtrados);
            setActiveButton(btn);
        };
        container.appendChild(btn);
    });
}

// Marca el botón activo
function setActiveButton(activeBtn) {
    document.querySelectorAll('.location-button').forEach(btn => {
        btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
}

// Modifica fetchColaboradores para guardar todos los colaboradores y actualizar los contadores por estado
function fetchColaboradores() {
    fetch('http://localhost:3001/api/colaboradores')
        .then(res => res.json())
        .then(data => {
            // Normaliza los datos antes de pasarlos a la UI
            const normalized = data.map(normalizeBackendRow);
            allCollaborators = normalized;
            updateTable(normalized);
            updateCounters(normalized);
            updateStateCounters(normalized);
        })
        .catch(err => {
            showMessage('Error al cargar colaboradores del servidor.', 'error');
            console.error(err);
        });
}

// Llama a esta función al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    fetchColaboradores();
    // ...resto de tu código...
});

function mapFrontendToBackend(colaborador) {
    return {
        id: colaborador.id,
        nombre: colaborador['Nombre y Apellidos'],
        estado: colaborador.Estado,
        fecha_salida: colaborador['Fecha de Salida'],
        fecha_entrada: colaborador['Fecha de Entrada'],
        fin_mision: colaborador['Fin de Misión'] === 'Sí' ? 1 : 0,
        ubicacion: colaborador.Estado // O usa otro campo si corresponde
    };
}

function updateColaboradorInBackend(colaborador) {
    const backendColaborador = mapFrontendToBackend(colaborador);
    fetch(`http://localhost:3001/api/colaboradores/${backendColaborador.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backendColaborador)
    })
    .catch(err => console.error('Error al actualizar colaborador:', err));
}

function normalizeBackendRow(row) {
    return {
        'Nombre y Apellidos': row.nombre || '',
        Estado: row.estado || '',
        'Fecha de Salida': row.fecha_salida || '',
        'Fecha de Entrada': row.fecha_entrada || '',
        'Fin de Misión': row.fin_mision === 1 || row.fin_mision === 'Sí' ? 'Sí' : 'No',
        Estimulacion: row.Estimulacion || 'No',
        Vacaciones: row.Vacaciones || 'No',
        id: row.id
    };
}

// Evento para limpiar la base de datos
document.getElementById('clearDatabaseButton').addEventListener('click', function() {
    if (confirm('¿Estás seguro de que deseas eliminar todos los colaboradores? Esta acción no se puede deshacer.')) {
        fetch('http://localhost:3001/api/colaboradores', { method: 'DELETE' })
            .then(res => res.json())
            .then(() => {
                showMessage('Base de datos limpiada correctamente.', 'success');
                fetchColaboradores();                
            })
            .catch(err => {
                showMessage('Error al limpiar la base de datos.', 'error');
                console.error(err);                
            });
    }
});

document.getElementById('addCollaboratorForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtén los valores del formulario
    const nombre = document.getElementById('nombreInput').value.trim();
    const estado = document.getElementById('estadoInput').value.trim();
    const fechaSalida = document.getElementById('fechaSalidaInput').value;
    const fechaEntrada = document.getElementById('fechaEntradaInput').value;

    if (!nombre || !estado) {
        alert('Por favor, complete al menos el nombre y la ubicación.');
        return;
    }

    // Construye el objeto colaborador
    const nuevoColaborador = {
        'Nombre y Apellidos': nombre,
        Estado: estado,
        'Fecha de Salida': fechaSalida,
        'Fecha de Entrada': fechaEntrada,
        'Fin de Misión': 'No',
        Estimulacion: 'Si',
        Vacaciones: 'No'
    };

    // Envía al backend
    fetch('http://localhost:3001/api/colaboradores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mapFrontendToBackend(nuevoColaborador))
    })
    .then(res => res.json())
    .then(() => {
        // Limpia el formulario
        document.getElementById('addCollaboratorForm').reset();
        // Recarga la tabla
        fetchColaboradores();
    })
    .catch(err => {
        alert('Error al agregar colaborador.');
        console.error(err);
    });
});

// document.getElementById('fileInput').addEventListener('change', ...);
// document.getElementById('importButton').addEventListener('click', ...);
// Funciones de FileReader, XLSX, etc.
