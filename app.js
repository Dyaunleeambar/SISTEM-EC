// Set global para IDs de filas editadas (persistente en localStorage)

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

function evaluarEstimulaciónPorDiasPresencia(diasPresencia) {
    if (typeof diasPresencia === 'number' && diasPresencia >= 15) {
        return 'Sí';
    }
    return 'No';
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

function filtrarColaboradoresPorFinDeMision(colaboradores, mesConciliacion) {
    // mesConciliacion formato 'YYYY-MM'
    const [year, month] = mesConciliacion.split('-').map(Number);
    const primerDiaMes = new Date(year, month - 1, 1);
    return colaboradores.filter(c => {
        if (c['Fin de Misión'] === 'Sí' && c['Fecha de Salida']) {
            const fechaSalida = parseDateYMD(c['Fecha de Salida']);
            if (fechaSalida && fechaSalida < primerDiaMes) {
                return false;
            }
        }
        return true;
    });
}

/**
 * Renderiza la tabla de colaboradores en el DOM.
 * Aplica el filtro de Fin de Misión según el mes de conciliación.
 * Asigna listeners a los controles de la tabla (checkboxes, fechas, editar, eliminar).
 * Llama a callback opcional tras renderizar.
 */
function updateTable(data, callback) {
    const tbody = document.querySelector('#collaboratorsTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    // Obtener el mes de conciliación actual
    const conciliationInput = document.getElementById('conciliationMonth');
    let mesConciliacion = '';
    if (conciliationInput && conciliationInput.value) {
        mesConciliacion = conciliationInput.value; // formato 'YYYY-MM'
    } else {
        const now = new Date();
        mesConciliacion = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }

    // Filtrar colaboradores según la nueva lógica de Fin de Misión
    data = filtrarColaboradoresPorFinDeMision(data, mesConciliacion);

    data.forEach((row, rowIndex) => {
        // Antes de renderizar la fila, forzar coherencia de Fin de Misión
        if (!row['Fecha de Salida'] || row['Fecha de Salida'].trim() === '') {
            if (row['Fin de Misión'] === 'Sí') {
                row['Fin de Misión'] = 'No';
                // Actualizar en backend si era 'Sí'
                fetch(`http://localhost:3001/api/colaboradores/${row.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(mapFrontendToBackend(row))
                });
            } else {
                row['Fin de Misión'] = 'No';
            }
        }
        // Calcular días de presencia
        let diasPresencia = calcularDiasPresencia({
            'Fecha de Entrada': row['Fecha de Entrada'],
            'Fecha de Salida': row['Fecha de Salida']
        }, mesConciliacion);

        // Calcular estimulación y vacaciones
        const estimulacion = evaluarEstimulaciónPorDiasPresencia(diasPresencia);
        const vacaciones = evaluateVacaciones(row);

        const tr = document.createElement('tr');
        tr.className = 'data-row';
        tr.setAttribute('data-id', row.id);
        tr.setAttribute('draggable', 'true');
        tr.innerHTML = `
            <td class="drag-handle" style="cursor:grab;text-align:center;"><span style="font-size:18px;user-select:none;">&#8942;</span></td>
            <td style="text-align:center;">${rowIndex + 1}</td>
            <td data-field="estado">${row.Estado}</td>
            <td data-field="nombre">${row['Nombre y Apellidos']}</td>
            <td>
                <input type="date" value="${row['Fecha de Salida'] || ''}" 
                       data-id="${row.id}" data-field="Fecha de Salida" class="date-input">
            </td>
            <td>
                <input type="date" value="${row['Fecha de Entrada'] || ''}" 
                       data-id="${row.id}" data-field="Fecha de Entrada" class="date-input">
            </td>
            <td data-field="estimulacion">${estimulacion}</td>
            <td data-field="vacaciones">${vacaciones}</td>
            <td data-field="Fin de Misión">
                <span class="fin-mision-label">${row['Fin de Misión'] === 'Sí' ? 'Sí' : 'No'}</span>
                <input type="checkbox" class="fin-mision-checkbox" data-id="${row.id}" ${row['Fin de Misión'] === 'Sí' ? 'checked' : ''}>
            </td>
            <td data-field="diasPresencia">${diasPresencia}</td>
            <td>
                <button class="edit-btn" data-id="${row.id}">Editar</button>
                <button class="delete-btn" data-id="${row.id}"><i class="fas fa-times"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Drag & Drop visual usando el handle
    let dragSrcEl = null;
    let dragStartIndex = null;
    tbody.querySelectorAll('.data-row').forEach((row, idx) => {
        const handle = row.querySelector('.drag-handle');
        if (handle) {
            handle.addEventListener('mousedown', (e) => {
                row.setAttribute('draggable', 'true');
            });
            handle.addEventListener('mouseup', (e) => {
                row.setAttribute('draggable', 'false');
            });
        }
        row.addEventListener('dragstart', (e) => {
            dragSrcEl = row;
            dragStartIndex = idx;
            row.style.opacity = '0.5';
        });
        row.addEventListener('dragend', (e) => {
            row.style.opacity = '';
            dragSrcEl = null;
            dragStartIndex = null;
        });
        row.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        row.addEventListener('drop', (e) => {
            e.preventDefault();
            if (dragSrcEl && dragSrcEl !== row) {
                const rows = Array.from(tbody.querySelectorAll('.data-row'));
                const from = dragStartIndex;
                const to = idx;
                if (from !== to) {
                    // Reordenar en el DOM
                    if (from < to) {
                        tbody.insertBefore(dragSrcEl, row.nextSibling);
                    } else {
                        tbody.insertBefore(dragSrcEl, row);
                    }
                    // Reordenar en el array de datos y actualizar la tabla
                    const moved = data.splice(from, 1)[0];
                    data.splice(to, 0, moved);
                    // Persistir el nuevo orden en el backend
                    const ordenPayload = data.map((c, i) => ({ id: c.id, orden: i + 1 }));
                    fetch('http://localhost:3001/api/colaboradores/orden', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ orden: ordenPayload })
                    })
                    .then(() => fetchColaboradores())
                    .catch(err => console.error('Error actualizando orden:', err));
                }
            }
        });
    });

    // Evento para el checkbox de Fin de Misión
    document.querySelectorAll('.fin-mision-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
    });

    // Deshabilitar input de fecha de entrada si la fecha de salida está vacía o si el mes de conciliación no está seleccionado
    setTimeout(() => {
        const entradaInput = tbody.querySelectorAll('input[data-field="Fecha de Entrada"]');
        const salidaInput = tbody.querySelectorAll('input[data-field="Fecha de Salida"]');
        const mesSeleccionado = isConciliationMonthSelected();
        if (entradaInput) {
            if (!mesSeleccionado || !salidaInput.length || Array.from(salidaInput).some(input => input.value.trim() === '')) {
                entradaInput.forEach(input => input.disabled = true);
                entradaInput.forEach(input => input.style.cursor = 'not-allowed');
            } else {
                entradaInput.forEach(input => input.disabled = false);
                entradaInput.forEach(input => input.style.cursor = 'pointer');
            }
        }
        // Al cambiar la fecha de salida, habilitar/deshabilitar la de entrada según el mes
        if (salidaInput && entradaInput) {
            salidaInput.forEach(input => {
                input.addEventListener('change', function() {
                    const mesSeleccionado = isConciliationMonthSelected();
                    if (!mesSeleccionado || !this.value || this.value.trim() === '') {
                        input.disabled = true;
                        input.value = '';
                        input.style.cursor = 'not-allowed';
                    } else {
                        input.disabled = false;
                        input.style.cursor = 'pointer';
                    }
                });
            });
        }
    }, 0);

    // Evento eliminar
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

    // Evento editar (abre el modal)
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            const colaborador = data.find(c => c.id == id);
            openEditModal(colaborador);
        });
    });

    // Evento para actualizar fechas directamente en la tabla
    tbody.querySelectorAll('.date-input').forEach(input => {
        input.addEventListener('change', function(e) {
            const id = this.dataset.id;
            const field = this.dataset.field;
            const value = this.value;
            const colaborador = allCollaborators.find(c => c.id == id);
            if (colaborador) {
                colaborador[field] = value;
                // Validar fechas antes de actualizar
                if (colaborador['Fecha de Entrada'] && colaborador['Fecha de Salida'] &&
                    !validarFechas(colaborador['Fecha de Entrada'], colaborador['Fecha de Salida'])) {
                    showMessage('La fecha de entrada no puede ser anterior a la fecha de salida.', 'error');
                    // Limpia el campo de fecha de entrada en el DOM
                    const entradaInput = document.querySelector(
                        `.data-row[data-id="${colaborador.id}"] input[data-field="Fecha de Entrada"]`
                    );
                    if (entradaInput) entradaInput.value = '';
                    colaborador['Fecha de Entrada'] = '';
                    return;
                }
                // Si la fecha de salida queda vacía, forzar Fin de Misión a 'No'
                if (field === 'Fecha de Salida' && (!value || value.trim() === '')) {
                    colaborador['Fin de Misión'] = 'No';
                    // Actualizar en backend
                    fetch(`http://localhost:3001/api/colaboradores/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(mapFrontendToBackend(colaborador))
                    });
                }
                // Actualizar en backend
                fetch(`http://localhost:3001/api/colaboradores/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(mapFrontendToBackend(colaborador))
                })
                .then(res => res.json())
                .then(() => fetchColaboradores())
                .catch(err => {
                    showMessage('Error al actualizar colaborador.', 'error');
                    console.error(err);
                });
            }
        });
    });
    
    // Aplicar estilos a celdas con valor "Si"
    applySiCellStyles();
    
    checkConciliationMonth();
    if (typeof callback === 'function') callback();
}

// Función para aplicar estilos a celdas con valor "Si" y "No"
function applySiCellStyles() {
    const tableCells = document.querySelectorAll('#collaboratorsTable tbody td');
    tableCells.forEach(cell => {
        cell.classList.remove('cell-si', 'cell-no');
        // Buscar el texto principal de la celda (si hay span, usar su texto)
        let cellText = cell.innerText || cell.textContent || '';
        cellText = cellText.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        if (cellText === 'si') {
            cell.classList.add('cell-si');
        } else if (cellText === 'no') {
            cell.classList.add('cell-no');
        }
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
        Estimulacion: 'Sí',
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
                // Calcular días de presencia para esta fila
                const fechaSalida = row.querySelector('[data-field="Fecha de Salida"]')?.value || '';
                const fechaEntrada = row.querySelector('[data-field="Fecha de Entrada"]')?.value || '';
                // Necesitas el mes de conciliación actual
                const conciliationInput = document.getElementById('conciliationMonth');
                let mesConciliacion = '';
                if (conciliationInput && conciliationInput.value) {
                    mesConciliacion = conciliationInput.value; // formato 'YYYY-MM'
                } else {
                    const now = new Date();
                    mesConciliacion = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                }
                const diasPresencia = calcularDiasPresencia({
                    'Fecha de Entrada': fechaEntrada,
                    'Fecha de Salida': fechaSalida
                }, mesConciliacion);

                rowData[field] = evaluarEstimulaciónPorDiasPresencia(diasPresencia);
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
    } else if (field === 'nombre') {
                rowData['Nombre y Apellidos'] = element.textContent || '';
            } else if (field === 'estado') {
                rowData['Estado'] = element.textContent || '';
            } else {
                // Para otros campos, usar value si existe, sino textContent
                rowData[field] = element.value || element.textContent || '';
            }
        });
        data.push(rowData);
    });
    
    return data;
}

/**
 * Maneja el cambio del checkbox de Fin de Misión.
 * Valida reglas de negocio y sincroniza el cambio con el backend.
 * Actualiza la UI y los contadores tras la confirmación del backend.
 */
function handleCheckboxChange(event) {
    const checkbox = event.target;
    const dataId = checkbox.dataset.id;
    const dataField = checkbox.dataset.field;
    
    // Validar que se haya escogido un mes de conciliación
    if (!isConciliationMonthSelected()) {
        showMessage('Debe seleccionar el mes de conciliación antes de marcar Fin de Misión.', 'error');
        checkbox.checked = false;
        return;
    }
    
    // Validar que tenemos el ID necesario
    if (!dataId) {
        console.error('ID no encontrado en el checkbox');
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
        return;
    }

    // Verificar si hay fecha de salida
    const fechaSalida = row['Fecha de Salida'];
    
    // Verificar si el valor está vacío o es una cadena vacía
    if (!fechaSalida || fechaSalida.trim() === '') {
        showMessage('No se puede marcar Fin de Misión: La fecha de salida está vacía', 'error');
        return;
    }

    // Intentar parsear la fecha
    const salidaDate = parseDate(fechaSalida);
    if (!salidaDate) {
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
        // Actualizar solo el texto del label y el estado del checkbox, sin reemplazar el innerHTML
        const finMisionLabel = rowElement.querySelector('.fin-mision-label');
        if (finMisionLabel) finMisionLabel.textContent = row['Fin de Misión'];
        const finMisionCheckbox = rowElement.querySelector('.fin-mision-checkbox');
        if (finMisionCheckbox) finMisionCheckbox.checked = row['Fin de Misión'] === 'Sí';

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

    // Sincronizar con el backend y refrescar solo cuando termine
    fetch(`http://localhost:3001/api/colaboradores/${row.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mapFrontendToBackend(row))
    })
    .then(res => res.json())
    .then(() => fetchColaboradores())
    .catch(err => {
        showMessage('Error al actualizar colaborador.', 'error');
        console.error(err);
    });
}

/**
 * Maneja el cambio de fechas en la tabla (salida/entrada).
 * Valida reglas de negocio y sincroniza el cambio con el backend.
 * Actualiza la UI y los contadores tras la confirmación del backend.
 */
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
                finMisionField.textContent = row
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

    // Sincronizar con el backend y resaltar la fila tras éxito
    updateColaboradorInBackend(row).then(() => {
        // No hay resaltado de filas editadas permanentemente
    });
}

function validateDates(row) {
    const salida = parseDate(row['Fecha de Salida']);
    const entrada = parseDate(row['Fecha de Entrada']);
    if (salida && entrada && entrada < salida) {
        showMessage('La fecha de entrada no puede ser anterior a la fecha de salida.', 'error');
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
    const withoutStimulation = totalCollaborators - withStimulation;

    // Actualizar cada contador
    const totalElement = document.getElementById('totalCollaborators');
    if (totalElement) totalElement.textContent = totalCollaborators;

    const stimElement = document.getElementById('withStimulation');
    if (stimElement) stimElement.textContent = withStimulation;

    const withoutStimElement = document.getElementById('withoutStimulation');
    if (withoutStimElement) withoutStimElement.textContent = withoutStimulation;

    const vacElement = document.getElementById('onVacation');
    if (vacElement) vacElement.textContent = onVacation;

    const endElement = document.getElementById('endOfMission');
    if (endElement) endElement.textContent = endOfMission;
}

/**
 * Actualiza los contadores por ubicación/estado en la UI.
 * Genera los botones de filtro dinámicamente y restaura el botón activo.
 * Usa los valores actuales del DOM para máxima precisión.
 */
function updateLocationCounters(data) {
    // Nuevo diseño: header y grid
    const grid = document.getElementById('stateCountersGrid');
    const allBtn = document.getElementById('stateFilterAllBtn');
    if (!grid || !allBtn) return;
    grid.innerHTML = '';

    // Contadores por ubicación y por estimulación
    const countersByLocation = {};
    const stimByLocation = {};
    if (data && Array.isArray(data)) {
        data.forEach(row => {
            const location = row.Estado || 'Sin Ubicación';
            if (!countersByLocation[location]) countersByLocation[location] = 0;
            countersByLocation[location]++;
            if (!stimByLocation[location]) stimByLocation[location] = 0;
            if (row.Estimulacion === 'Sí') stimByLocation[location]++;
        });
    }
    // Ordenar ubicaciones por cantidad descendente y luego alfabético
    const sortedLocations = Object.entries(countersByLocation)
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([loc]) => loc);
    // Botón Todos
    allBtn.textContent = `Todos (${data.length})`;
    allBtn.onclick = () => {
        activeFilter = 'Todos';
        updateTable(allCollaborators);
        setActiveButton(allBtn);
    };
    // Generar botones de estado en el grid (máx 6, dos filas de 3)
    sortedLocations.forEach((location, idx) => {
        const btn = document.createElement('button');
        btn.className = 'location-button';
        const total = countersByLocation[location] || 0;
        const stim = stimByLocation[location] || 0;
        btn.innerHTML = `${location} (${total}) <span class='stim-count'><i class='fas fa-star'></i> ${stim}</span>`;
        btn.onclick = () => {
            activeFilter = location;
            const filtrados = allCollaborators.filter(c => (c.Estado || 'Sin Ubicación') === location);
            updateTable(filtrados);
            setActiveButton(btn);
        };
        grid.appendChild(btn);
    });
    // Restaurar el botón activo
    setTimeout(() => {
        setActiveButton(activeFilter === 'Todos' ? allBtn : Array.from(grid.children).find(btn => btn.textContent.includes(activeFilter)));
    }, 0);
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
// Reemplazar el evento del botón Exportar para mostrar el modal
const exportButton = document.getElementById('exportButton');
const exportModal = document.getElementById('exportModal');
const closeExportModal = document.getElementById('closeExportModal');
const exportAllBtn = document.getElementById('exportAllBtn');
const exportFilteredBtn = document.getElementById('exportFilteredBtn');

if (exportButton && exportModal) {
    exportButton.addEventListener('click', function(e) {
        e.preventDefault();
        exportModal.style.display = 'block';
    });
}
if (closeExportModal && exportModal) {
    closeExportModal.onclick = function() {
        exportModal.style.display = 'none';
    };
    window.onclick = function(event) {
        if (event.target == exportModal) {
            exportModal.style.display = 'none';
        }
    };
}
if (exportAllBtn) {
    exportAllBtn.onclick = function() {
        exportarDatos('all');
        exportModal.style.display = 'none';
    };
}
if (exportFilteredBtn) {
    exportFilteredBtn.onclick = function() {
        exportarDatos('filtered');
        exportModal.style.display = 'none';
    };
}

function exportarDatos(tipo) {
    let data;
    if (tipo === 'all') {
        data = allCollaborators;
    } else {
        data = getData();
    }
    if (!data || data.length === 0) {
        showMessage('No hay datos para exportar.', 'error');
        return;
    }
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Colaboradores');
    XLSX.writeFile(wb, 'colaboradores_exportados.xlsx');
}

let allCollaborators = []; // Guarda todos los colaboradores para filtrar
let activeFilter = 'Todos'; // Variable global para mantener el filtro activo

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
        activeFilter = 'Todos';
        updateTable(allCollaborators);
        setActiveButton(allBtn);
    };
    container.appendChild(allBtn);

    // Botones por estado
    Object.entries(stateCounts).forEach(([estado, count]) => {
        // Calcular cantidad con estímulo en este estado
        const stimCount = data.filter(c => (c.Estado || 'Sin Ubicación') === estado && c.Estimulacion === 'Sí').length;
        const btn = document.createElement('button');
        btn.className = 'location-button';
        btn.innerHTML = `${estado} (${count}) <span class='stim-count'><i class='fas fa-star'></i> ${stimCount}</span>`;
        btn.onclick = () => {
            activeFilter = estado;
            const filtrados = allCollaborators.filter(c => (c.Estado || 'Sin Ubicación') === estado);
            updateTable(filtrados);
            setActiveButton(btn);
            // Aplicar estilos después de filtrar
            setTimeout(() => {
                applySiCellStyles();
            }, 100);
        };
        container.appendChild(btn);
    });
    
    // Restaurar el botón activo después de regenerar los botones
    restoreActiveButton();
}

// Marca el botón activo
function setActiveButton(activeBtn) {
    document.querySelectorAll('.location-button').forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

// Centraliza la lógica de filtrado
function getFilteredCollaborators({ estado = null, search = '' } = {}) {
    let filtered = allCollaborators;
    if (estado && estado !== 'Todos') {
        filtered = filtered.filter(c => (c.Estado || 'Sin Ubicación') === estado);
    }
    if (search && search.trim() !== '') {
        const q = search.trim().toLowerCase();
        filtered = filtered.filter(c =>
            (c['Nombre y Apellidos'] && c['Nombre y Apellidos'].toLowerCase().includes(q)) ||
            (c.Estado && c.Estado.toLowerCase().includes(q))
        );
    }
    return filtered;
}

/**
 * Obtiene la lista de colaboradores desde el backend y actualiza la UI.
 * Normaliza los datos y aplica el filtro activo.
 * Maneja errores de red o backend.
 */
async function fetchColaboradores() {
    try {
        const data = await fetchWithHandling('http://localhost:3001/api/colaboradores', {}, 'Error al cargar colaboradores del servidor.');
        const normalized = data.map(normalizeBackendRow);
        allCollaborators = normalized;
        applyActiveFilter();
        updateCounters(normalized);
        updateLocationCounters(normalized);
        checkConciliationMonth();
    } catch (err) {
        showMessage(err.message, 'error');
        console.error(err);
    }
}

/**
 * Aplica el filtro activo (por estado/ubicación) y actualiza la tabla.
 * Restaura el botón activo visualmente tras filtrar.
 */
function applyActiveFilter() {
    const filtered = getFilteredCollaborators({ estado: activeFilter });
    updateTable(filtered, () => {
        restoreActiveButton();
    });
}

// Buscador usa la función centralizada
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        const filtered = getFilteredCollaborators({ estado: activeFilter, search: query });
        updateTable(filtered, () => {
            restoreActiveButton();
        });
    });
}

/**
 * Restaura el botón de filtro activo en la UI tras actualizar los botones.
 * Busca el botón correspondiente al filtro actual y lo marca como activo.
 */
function restoreActiveButton() {
    const buttons = document.querySelectorAll('.location-button');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        const btnText = btn.textContent;
        
        if (activeFilter === 'Todos' && btnText.includes('Todos')) {
            btn.classList.add('active');
        } else if (btnText.includes(activeFilter)) {
            btn.classList.add('active');
        }
    });
}

// Llama a esta función al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    fetchColaboradores();
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            if (!query) {
                updateTable(allCollaborators);
                return;
            }
            const filtrados = allCollaborators.filter(c =>
                (c['Nombre y Apellidos'] && c['Nombre y Apellidos'].toLowerCase().includes(query)) ||
                (c.Estado && c.Estado.toLowerCase().includes(query))
            );
            updateTable(filtrados);
        });
    }
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

// updateColaboradorInBackend usa async/await y fetchWithHandling
async function updateColaboradorInBackend(colaborador) {
    if (!colaborador['Nombre y Apellidos'] || !colaborador.Estado) {
        showMessage('El colaborador debe tener nombre y estado para guardar cambios.', 'error');
        return;
    }
    const safeColaborador = {
        id: colaborador.id,
        'Nombre y Apellidos': colaborador['Nombre y Apellidos'] || '',
        Estado: colaborador.Estado || '',
        'Fecha de Salida': colaborador['Fecha de Salida'] || '',
        'Fecha de Entrada': colaborador['Fecha de Entrada'] || '',
        'Fin de Misión': colaborador['Fin de Misión'] || 'No',
        Estimulacion: colaborador.Estimulacion || 'No',
        Vacaciones: colaborador.Vacaciones || 'No'
    };
    const backendColaborador = mapFrontendToBackend(safeColaborador);
    try {
        await fetchWithHandling(`http://localhost:3001/api/colaboradores/${backendColaborador.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(backendColaborador)
        }, 'Error al actualizar colaborador.');
    } catch (err) {
        showMessage(err.message, 'error');
        console.error(err);
    }
}

function normalizeBackendRow(row) {
    // Normaliza Fin de Misión
    let finMision = 'No';
    if (row.fin_mision === 1 || row.fin_mision === 'Sí' || row.fin_mision === true) {
        finMision = 'Sí';
    }

    // Calcula estimulación y vacaciones usando tus funciones
    const conciliationMonth = getConciliationMonth();
    const estimulacion = evaluateStimulation({
        'Fecha de Salida': row.fecha_salida,
        'Fecha de Entrada': row.fecha_entrada
    }, conciliationMonth);

    const vacaciones = evaluateVacaciones({
        'Fecha de Salida': row.fecha_salida,
        'Fecha de Entrada': row.fecha_entrada,
        'Fin de Misión': finMision
    });

    return {
        'Nombre y Apellidos': row.nombre || '',
        Estado: row.estado || '',
        'Fecha de Salida': row.fecha_salida || '',
        'Fecha de Entrada': row.fecha_entrada || '',
        'Fin de Misión': finMision,
        Estimulacion: estimulacion,
        Vacaciones: vacaciones,
        id: row.id
    };
}

// --- Mensajes de error inline para el formulario de agregar colaborador ---
function setInlineError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const errorDiv = document.getElementById(errorId);
    if (errorDiv) errorDiv.textContent = message || '';
    if (input && message) input.classList.add('input-error');
    else if (input) input.classList.remove('input-error');
}

// Limpiar mensajes inline al escribir
['nombreInput', 'estadoInput'].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
        input.addEventListener('input', () => {
            setInlineError(id, id + 'Error', '');
        });
    }
});

// Modificar el submit del formulario para mostrar errores inline
const addCollaboratorForm = document.getElementById('addCollaboratorForm');
if (addCollaboratorForm) {
    addCollaboratorForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const nombre = document.getElementById('nombreInput').value.trim();
        const estado = document.getElementById('estadoInput').value.trim();
        let hasError = false;
        if (!estado) {
            setInlineError('estadoInput', 'estadoInputError', 'La ubicación/estado es obligatoria.');
            hasError = true;
        }
        if (!nombre) {
            setInlineError('nombreInput', 'nombreInputError', 'El nombre es obligatorio.');
            hasError = true;
        }
        if (hasError) return;
        setInlineError('estadoInput', 'estadoInputError', '');
        setInlineError('nombreInput', 'nombreInputError', '');
        // Validación de duplicados en frontend
        const exists = allCollaborators.some(c =>
            (c['Nombre y Apellidos'] || '').trim().toLowerCase() === nombre.toLowerCase() &&
            (c.Estado || '').trim().toLowerCase() === estado.toLowerCase()
        );
        if (exists) {
            showMessage('Ya existe un colaborador con el mismo nombre y ubicación.', 'error');
            return;
        }
        // Construye el objeto colaborador solo con los campos requeridos
        const nuevoColaborador = {
            nombre: nombre,
            estado: estado,
            fecha_salida: '',
            fecha_entrada: '',
            fin_mision: 0,
            ubicacion: estado
        };
        try {
            await fetchWithHandling('http://localhost:3001/api/colaboradores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoColaborador)
            }, 'Error al agregar colaborador.');
            addCollaboratorForm.reset();
            await fetchColaboradores();
        } catch (err) {
            showMessage(err.message, 'error');
            console.error(err);
        }
    });
}

// Modificar el submit del formulario de edición
const editCollaboratorForm = document.getElementById('editCollaboratorForm');
if (editCollaboratorForm) {
    editCollaboratorForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const nombre = document.getElementById('editNombre').value.trim();
        const estado = document.getElementById('editEstado').value.trim();
        let hasError = false;
        if (!nombre) {
            setEditInlineError('editNombre', 'editNombreError', 'El nombre es obligatorio.');
            hasError = true;
        }
        if (!estado) {
            setEditInlineError('editEstado', 'editEstadoError', 'La ubicación/estado es obligatoria.');
            hasError = true;
        }
        if (hasError) return;
        setEditInlineError('editNombre', 'editNombreError', '');
        setEditInlineError('editEstado', 'editEstadoError', '');
        const id = document.getElementById('editId').value;
        const fechaSalida = document.getElementById('editFechaSalida').value;
        const fechaEntrada = document.getElementById('editFechaEntrada').value;
        const colaboradorEditado = {
            id: parseInt(id),
            'Nombre y Apellidos': nombre,
            Estado: estado,
            'Fecha de Salida': fechaSalida,
            'Fecha de Entrada': fechaEntrada,
            'Fin de Misión': 'No',
            Estimulacion: 'Sí',
            Vacaciones: 'No'
        };
        try {
            await fetchWithHandling(`http://localhost:3001/api/colaboradores/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mapFrontendToBackend(colaboradorEditado))
            }, 'Error al actualizar colaborador.');
            document.getElementById('editModal').style.display = 'none';
            await fetchColaboradores();
        } catch (err) {
            showMessage(err.message, 'error');
            console.error(err);
        }
    });
}

function validarFechas(row) {
    const salida = parseDate(row['Fecha de Salida']);
    const entrada = parseDate(row['Fecha de Entrada']);
    if (salida && entrada && entrada < salida) {
        showMessage('La fecha de entrada no puede ser anterior a la fecha de salida.', 'error');
        return false;
    }
    return true;
}

function showMessage(msg, type = 'info') {
    const box = document.getElementById('messageBox');
    if (!box) return;
    box.textContent = msg;
    box.className = 'message-box ' + type;
    setTimeout(() => {
        box.textContent = '';
        box.className = 'message-box';
    }, 4000);
}

// Mueve la función parseDateYMD aquí para que esté antes de calcularDiasPresencia
function parseDateYMD(fechaString) {
    if (!fechaString) return null;
    const [year, month, day] = fechaString.split('-').map(Number);
    return new Date(year, month - 1, day);
}

function calcularDiasPresencia(colaborador, mesConciliacion) {
    const [year, month] = mesConciliacion.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const totalDiasMes = lastDay.getDate();

    // Usar parseDateYMD para evitar problemas de zona horaria
    const fechaSalida = colaborador['Fecha de Salida'] ? parseDateYMD(colaborador['Fecha de Salida']) : null;
    const fechaEntrada = colaborador['Fecha de Entrada'] ? parseDateYMD(colaborador['Fecha de Entrada']) : null;

    // Caso 1: Sin fechas
    if (!fechaSalida && !fechaEntrada) {
        return totalDiasMes;
    }

    // Caso 2: Solo salida
    if (fechaSalida && !fechaEntrada) {
        if (fechaSalida < firstDay) return '-';
        if (fechaSalida > lastDay) return totalDiasMes;
        if (
            fechaSalida.getFullYear() === firstDay.getFullYear() &&
            fechaSalida.getMonth() === firstDay.getMonth() &&
            fechaSalida.getDate() === firstDay.getDate()
        ) return 1;
        const dias = Math.floor((fechaSalida - firstDay) / (1000 * 60 * 60 * 24)) + 1;
        return dias > 0 ? dias : '-';
    }

    // Caso 3: Solo entrada
    if (!fechaSalida && fechaEntrada) {
        if (fechaEntrada > lastDay) return '-';
        if (fechaEntrada < firstDay) return totalDiasMes;
        return Math.floor((lastDay - fechaEntrada) / (1000 * 60 * 60 * 24)) + 1;
    }

    // Caso 4: Ambas fechas
    if (fechaSalida && fechaEntrada) {
        let dias = 0;
        if (fechaSalida >= firstDay && fechaSalida <= lastDay) {
            if (
                fechaSalida.getFullYear() === firstDay.getFullYear() &&
                fechaSalida.getMonth() === firstDay.getMonth() &&
                fechaSalida.getDate() === firstDay.getDate()
            ) {
                dias += 1;
            } else {
                dias += Math.floor((fechaSalida - firstDay) / (1000 * 60 * 60 * 24)) + 1;
            }
        } else if (fechaSalida > lastDay) {
            dias += totalDiasMes;
        }
        if (fechaEntrada >= firstDay && fechaEntrada <= lastDay) {
            dias += Math.floor((lastDay - fechaEntrada) / (1000 * 60 * 60 * 24)) + 1;
        } else if (fechaEntrada < firstDay) {
            dias += totalDiasMes;
        }
        if (dias === 0) return '-';
        return dias;
    }

    // Caso 5: Fechas fuera del mes
    return '-';
}

// Validación de mes de conciliación antes de editar o cambiar fechas
function isConciliationMonthSelected() {
    const conciliationInput = document.getElementById('conciliationMonth');
    return conciliationInput && conciliationInput.value && conciliationInput.value.trim() !== '';
}

// Ejemplo para el evento de cambio de fechas en la tabla
const tbody = document.querySelector('#collaboratorsTable tbody');
if (tbody) {
    tbody.querySelectorAll('.date-input').forEach(input => {
        input.addEventListener('change', function(e) {
            if (!isConciliationMonthSelected()) {
                showMessage('Debe seleccionar el mes de conciliación antes de editar cualquier campo.', 'error');
                this.value = '';
                return;
            }
            // ...resto del código de edición...
        });
    });
}

// Ejemplo para el submit del formulario de edición
document.getElementById('editCollaboratorForm').addEventListener('submit', function(event) {
    if (!isConciliationMonthSelected()) {
        showMessage('Debe seleccionar el mes de conciliación antes de editar cualquier campo.', 'error');
        event.preventDefault();
        return;
    }
    // ...resto del código de edición...
});

// Función para habilitar/deshabilitar campos de edición según el mes de conciliación
function toggleEditFields(enabled) {
    document.querySelectorAll('.date-input, .edit-btn, .delete-btn').forEach(el => {
        el.disabled = !enabled;
        el.style.cursor = enabled ? 'pointer' : 'not-allowed';
    });
}

function checkConciliationMonth() {
    const enabled = isConciliationMonthSelected();
    toggleEditFields(enabled);

    // Resalta el input si no está seleccionado
    const conciliationInput = document.getElementById('conciliationMonth');
    if (conciliationInput) {
        if (!enabled) {
            conciliationInput.classList.add('highlight');
        } else {
            conciliationInput.classList.remove('highlight');
        }
    }
}

// Ejecutar al cargar la página y cuando cambie el input de mes
window.addEventListener('DOMContentLoaded', checkConciliationMonth);
const conciliationInput = document.getElementById('conciliationMonth');
if (conciliationInput) {
    conciliationInput.addEventListener('change', () => {
        const selected = conciliationInput.value;
        if (selected) {
            const [year, month] = selected.split('-').map(Number);
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth() + 1;
            if (year > currentYear || (year === currentYear && month > currentMonth)) {
                showMessage('No se puede seleccionar un mes de conciliación mayor al actual.', 'error');
                conciliationInput.value = '';
                return;
            }
        }
        fetchColaboradores();
    });
}

// --- BOTÓN LIMPIAR FIN DE MISIÓN ANTIGUOS (MODAL PERSONALIZADO) ---
const cleanOldEndMissionButton = document.getElementById('cleanOldEndMissionButton');
const cleanEndMissionModal = document.getElementById('cleanEndMissionModal');
const cleanEndMissionList = document.getElementById('cleanEndMissionList');
const cleanEndMissionWarning = document.getElementById('cleanEndMissionWarning');
const confirmCleanEndMissionBtn = document.getElementById('confirmCleanEndMissionBtn');
const cancelCleanEndMissionBtn = document.getElementById('cancelCleanEndMissionBtn');
const closeCleanEndMissionModal = document.getElementById('closeCleanEndMissionModal');

let toDeleteEndMission = [];

if (cleanOldEndMissionButton) {
    cleanOldEndMissionButton.addEventListener('click', function() {
        const conciliationInput = document.getElementById('conciliationMonth');
        if (!conciliationInput || !conciliationInput.value) {
            showMessage('Debe seleccionar el mes de conciliación antes de limpiar.', 'error');
            return;
        }
        const [year, month] = conciliationInput.value.split('-').map(Number);
        const firstDayOfMonth = new Date(year, month - 1, 1);
        // Filtrar colaboradores a eliminar
        toDeleteEndMission = allCollaborators.filter(c => {
            if (c['Fin de Misión'] !== 'Sí' || !c['Fecha de Salida']) return false;
            const salida = parseDateYMD(c['Fecha de Salida']);
            return salida && salida < firstDayOfMonth;
        });
        if (toDeleteEndMission.length === 0) {
            showMessage('No hay colaboradores para eliminar según la regla.', 'info');
            return;
        }
        // Mostrar lista con checkboxes en el modal
        cleanEndMissionList.innerHTML = `<form id='cleanEndMissionForm'><ul style='padding-left:0;list-style:none;'>` +
            toDeleteEndMission.map((c, idx) =>
                `<li style='margin-bottom:6px;display:flex;align-items:center;gap:8px;'>
                    <input type='checkbox' class='clean-end-mission-checkbox' id='cemc_${idx}' data-id='${c.id}' checked>
                    <label for='cemc_${idx}' style='cursor:pointer;'><b>${c['Nombre y Apellidos']}</b> (${c.Estado}) - Salida: ${c['Fecha de Salida']}</label>
                </li>`
            ).join('') +
            `</ul></form>`;
        cleanEndMissionWarning.textContent = `Seleccione los colaboradores a eliminar. Se eliminarán los seleccionados (${toDeleteEndMission.length} propuestos) de Fin de Misión con fecha de salida anterior a ${conciliationInput.value}. Esta acción no se puede deshacer.`;
        cleanEndMissionModal.style.display = 'block';
    });
}

if (cancelCleanEndMissionBtn) {
    cancelCleanEndMissionBtn.onclick = function() {
        cleanEndMissionModal.style.display = 'none';
    };
}
if (closeCleanEndMissionModal) {
    closeCleanEndMissionModal.onclick = function() {
        cleanEndMissionModal.style.display = 'none';
    };
}
if (confirmCleanEndMissionBtn) {
    confirmCleanEndMissionBtn.onclick = async function() {
        const checkboxes = document.querySelectorAll('.clean-end-mission-checkbox');
        const idsToDelete = Array.from(checkboxes).filter(cb => cb.checked).map(cb => parseInt(cb.dataset.id));
        if (!idsToDelete.length) {
            showMessage('No ha seleccionado ningún colaborador para eliminar.', 'error');
            cleanEndMissionModal.style.display = 'none';
            return;
        }
        for (const id of idsToDelete) {
            try {
                await fetch(`http://localhost:3001/api/colaboradores/${id}`, { method: 'DELETE' });
            } catch (err) {
                console.error('Error eliminando colaborador:', id, err);
            }
        }
        showMessage(`${idsToDelete.length} colaborador(es) eliminados.`, 'success');
        cleanEndMissionModal.style.display = 'none';
        fetchColaboradores();
    };
}
// Cerrar modal si se hace clic fuera del contenido
window.addEventListener('click', function(event) {
    if (event.target === cleanEndMissionModal) {
        cleanEndMissionModal.style.display = 'none';
    }
});

// Exportar funciones puras para testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calcularDiasPresencia,
    evaluateStimulation,
    evaluateVacaciones
  };
}

/**
 * Utilidad para fetch con manejo de errores centralizado
 */
async function fetchWithHandling(url, options = {}, errorMsg = 'Error de red') {
    try {
        const res = await fetch(url, options);
        if (!res.ok) {
            let msg = errorMsg;
            try {
                const data = await res.json();
                if (data && data.error) msg = data.error;
            } catch {}
            throw new Error(msg);
        }
        if (options.method && options.method.toUpperCase() === 'DELETE') return true;
        return await res.json();
    } catch (err) {
        throw new Error(err.message || errorMsg);
    }
}
