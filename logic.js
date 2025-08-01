// Funciones puras para lógica de negocio del sistema de estimulación

function calcularDiasPresencia(colaborador, mesConciliacion) {
    const [year, month] = mesConciliacion.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const totalDiasMes = lastDay.getDate();

    const fechaSalida = colaborador['Fecha de Salida'] ? parseDateYMD(colaborador['Fecha de Salida']) : null;
    const fechaEntrada = colaborador['Fecha de Entrada'] ? parseDateYMD(colaborador['Fecha de Entrada']) : null;

    if (!fechaSalida && !fechaEntrada) {
        return totalDiasMes;
    }
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
    if (!fechaSalida && fechaEntrada) {
        if (fechaEntrada > lastDay) return '-';
        if (fechaEntrada < firstDay) return totalDiasMes;
        return Math.floor((lastDay - fechaEntrada) / (1000 * 60 * 60 * 24)) + 1;
    }
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
    return '-';
}

function parseDateYMD(fechaString) {
    if (!fechaString) return null;
    const [year, month, day] = fechaString.split('-').map(Number);
    return new Date(year, month - 1, day);
}

function evaluateStimulation(row, conciliationMonth) {
    if (!row['Fecha de Salida'] || row['Fecha de Salida'].trim() === '') {
        return 'Sí';
    }
    const salida = parseDateYMD(row['Fecha de Salida']);
    if (!salida) return 'No';
    let entrada = null;
    if (row['Fecha de Entrada'] && row['Fecha de Entrada'].trim() !== '') {
        entrada = parseDateYMD(row['Fecha de Entrada']);
        if (!entrada) return 'No';
        if (entrada < salida) return 'No';
    }
    const year = conciliationMonth.year;
    const month = conciliationMonth.month;
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    if (salida < firstDay && (!entrada || entrada < firstDay)) return 'No';
    let presenceStart = firstDay;
    let presenceEnd = lastDay;
    if (salida > firstDay && salida <= lastDay) {
        presenceEnd = salida;
    }
    if (entrada && entrada > firstDay && entrada <= lastDay) {
        presenceStart = entrada;
    }
    if (salida >= firstDay && salida <= lastDay && (!entrada || entrada > lastDay)) {
        presenceEnd = salida;
    }
    if (entrada && entrada >= firstDay && entrada <= lastDay) {
        presenceStart = entrada;
    }
    const daysPresent = Math.max(0, Math.floor((presenceEnd - presenceStart) / (1000 * 60 * 60 * 24)) + 1);
    return daysPresent >= 15 ? 'Sí' : 'No';
}

function evaluateVacaciones(row) {
    if (row['Fecha de Entrada'] && row['Fecha de Entrada'].trim() !== '') {
        return 'No';
    }
    const hasSalida = row['Fecha de Salida'] && row['Fecha de Salida'].trim() !== '';
    const isInFinMision = row['Fin de Misión'] === 'Sí';
    return hasSalida && !isInFinMision ? 'Sí' : 'No';
}

/**
 * Limpia automáticamente las fechas de colaboradores que regresaron al país
 * en el mes anterior al mes de conciliación actual
 * @param {Array} colaboradores - Lista de colaboradores
 * @param {string} mesConciliacion - Mes de conciliación en formato YYYY-MM
 * @returns {Array} - Lista de colaboradores con fechas limpiadas
 */
function limpiarFechasColaboradoresRegresados(colaboradores, mesConciliacion) {
    if (!mesConciliacion || !colaboradores || colaboradores.length === 0) {
        return colaboradores;
    }

    const [year, month] = mesConciliacion.split('-').map(Number);
    const mesActual = new Date(year, month - 1, 1);
    const mesAnterior = new Date(year, month - 2, 1); // Mes anterior al actual

    return colaboradores.map(colaborador => {
        // Solo procesar si tiene fecha de entrada
        if (colaborador['Fecha de Entrada'] && colaborador['Fecha de Entrada'].trim() !== '') {
            const fechaEntrada = parseDateYMD(colaborador['Fecha de Entrada']);
            
            if (fechaEntrada) {
                // Verificar si la fecha de entrada fue en el mes anterior
                const esMesAnterior = fechaEntrada.getFullYear() === mesAnterior.getFullYear() && 
                                    fechaEntrada.getMonth() === mesAnterior.getMonth();
                
                if (esMesAnterior) {
                    // Limpiar fechas y marcar como editado
                    return {
                        ...colaborador,
                        'Fecha de Salida': '',
                        'Fecha de Entrada': '',
                        _edited: true,
                        _fecha_limpiada: true,
                        _fecha_limpiada_timestamp: new Date().toISOString()
                    };
                }
            }
        }
        return colaborador;
    });
}

module.exports = {
    calcularDiasPresencia,
    evaluateStimulation,
    evaluateVacaciones,
    limpiarFechasColaboradoresRegresados
}; 
