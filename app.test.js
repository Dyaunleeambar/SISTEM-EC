// Tests unitarios para funciones de lógica pura del sistema de estimulación
const { calcularDiasPresencia, evaluateStimulation, evaluateVacaciones } = require('./logic');

describe('calcularDiasPresencia', () => {
  it('devuelve el total de días del mes si no hay fechas', () => {
    expect(calcularDiasPresencia({}, '2024-06')).toBe(30);
  });
  it('devuelve \'-\' si la fecha de salida es antes del mes', () => {
    expect(calcularDiasPresencia({ 'Fecha de Salida': '2024-05-15' }, '2024-06')).toBe('-');
  });
  it('calcula días correctamente con fecha de salida dentro del mes', () => {
    expect(calcularDiasPresencia({ 'Fecha de Salida': '2024-06-10' }, '2024-06')).toBe(10);
  });
  it('calcula días correctamente con fecha de entrada dentro del mes', () => {
    expect(calcularDiasPresencia({ 'Fecha de Entrada': '2024-06-20' }, '2024-06')).toBe(11);
  });
});

describe('evaluateStimulation', () => {
  it('devuelve "Sí" si días de presencia >= 15', () => {
    const row = { 'Fecha de Salida': '', 'Fecha de Entrada': '' };
    const conciliationMonth = { year: 2024, month: 6 };
    expect(evaluateStimulation(row, conciliationMonth)).toBe('Sí');
  });
  it('devuelve "No" si días de presencia < 15', () => {
    const row = { 'Fecha de Salida': '2024-06-05', 'Fecha de Entrada': '' };
    const conciliationMonth = { year: 2024, month: 6 };
    expect(evaluateStimulation(row, conciliationMonth)).toBe('No');
  });
});

describe('evaluateVacaciones', () => {
  it('devuelve "No" si hay fecha de entrada', () => {
    expect(evaluateVacaciones({ 'Fecha de Entrada': '2024-06-10' })).toBe('No');
  });
  it('devuelve "Sí" si hay fecha de salida y no está en fin de misión', () => {
    expect(evaluateVacaciones({ 'Fecha de Salida': '2024-06-10', 'Fin de Misión': 'No' })).toBe('Sí');
  });
  it('devuelve "No" si está en fin de misión', () => {
    expect(evaluateVacaciones({ 'Fecha de Salida': '2024-06-10', 'Fin de Misión': 'Sí' })).toBe('No');
  });
}); 
