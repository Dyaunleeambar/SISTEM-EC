// Función para manejar la importación del archivo Excel
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const importButton = document.getElementById('importButton');
    const importMessage = document.createElement('div');
    importMessage.className = 'import-message';
    importButton.parentNode.appendChild(importMessage);
    
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
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Procesar los datos y actualizar la UI
    updateTable(data);
    updateCounters(data);
}

function updateTable(data) {
    const tbody = document.querySelector('#collaboratorsTable tbody');
    tbody.innerHTML = '';

    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.Estado}</td>
            <td>${row.Nombre}</td>
            <td><input type="date" class="date-input" value="${row['Fecha de Salida']}" data-id="${row.id}" data-field="fecha_salida"></td>
            <td>${row.Estimulacion}</td>
            <td>
                <div class="date-control">
                    <input type="checkbox" class="disable-date" ${row['Fecha de Entrada'] ? '' : 'checked'}>
                    <label>Deshabilitar fecha</label>
                    <input type="date" class="date-input" value="${row['Fecha de Entrada']}" data-id="${row.id}" data-field="fecha_entrada">
                </div>
            </td>
            <td>${row.Vacaciones}</td>
            <td>${row['Fin de Misión']}</td>
        `;
        tbody.appendChild(tr);
    });

    // Agregar eventos para los checkboxes y los inputs de fecha
    const dateControls = document.querySelectorAll('.date-control');
    dateControls.forEach(control => {
        const checkbox = control.querySelector('.disable-date');
        const input = control.querySelector('.date-input');
        
        // Evento para el checkbox
        checkbox.addEventListener('change', () => {
            input.disabled = checkbox.checked;
            input.style.cursor = checkbox.checked ? 'not-allowed' : 'auto';
        });

        // Evento para el input de fecha
        input.addEventListener('change', handleDateChange);
    });

    // Agregar evento de cambio para los inputs de fecha de salida
    const dateInputs = document.querySelectorAll('.date-input:not(.date-control .date-input)');
    dateInputs.forEach(input => {
        input.addEventListener('change', handleDateChange);
    });
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
