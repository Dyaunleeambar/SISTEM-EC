const request = require('supertest');
const express = require('express');
let server;

beforeAll(() => {
  // Importar el servidor Express real
  server = require('./server');
});

describe('API de Colaboradores', () => {
  let createdId;

  it('POST /api/colaboradores - debe crear un colaborador', async () => {
    const res = await request('http://localhost:3001')
      .post('/api/colaboradores')
      .send({
        nombre: 'Test User',
        estado: 'Test Estado',
        fecha_salida: '',
        fecha_entrada: '',
        fin_mision: 0,
        ubicacion: 'Test Estado'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
    createdId = res.body.id;
  });

  it('GET /api/colaboradores - debe devolver la lista de colaboradores', async () => {
    const res = await request('http://localhost:3001').get('/api/colaboradores');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some(c => c.id === createdId)).toBe(true);
  });

  it('PUT /api/colaboradores/:id - debe actualizar un colaborador', async () => {
    const res = await request('http://localhost:3001')
      .put(`/api/colaboradores/${createdId}`)
      .send({
        nombre: 'Test User Modificado',
        estado: 'Test Estado',
        fecha_salida: '',
        fecha_entrada: '',
        fin_mision: 0,
        ubicacion: 'Test Estado'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe('Test User Modificado');
  });

  it('DELETE /api/colaboradores/:id - debe eliminar un colaborador', async () => {
    const res = await request('http://localhost:3001')
      .delete(`/api/colaboradores/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('DELETE /api/colaboradores/clean-old-mission/:id - debe eliminar colaborador en fin de misión', async () => {
    // Crear un colaborador en fin de misión para el test
    const colaboradorFinMision = await request('http://localhost:3001')
      .post('/api/colaboradores')
      .send({
        nombre: 'Test Fin Mision',
        estado: 'Fin de Misión',
        fecha_salida: '2024-01-15',
        fecha_entrada: '',
        fin_mision: 1,
        ubicacion: 'Test Estado'
      });
    
    const finMisionId = colaboradorFinMision.body.id;
    
    const res = await request('http://localhost:3001')
      .delete(`/api/colaboradores/clean-old-mission/${finMisionId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('eliminado');
  });
}); 