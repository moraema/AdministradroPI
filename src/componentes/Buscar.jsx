import React, { useState } from 'react';
import Texto from '../componentes/texto';
import Boton from '../componentes/Boton.jsx';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Principal from './Prinicipal';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../estilos/buscar.css';

const Buscar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  const [clienteNoEncontrado, setClienteNoEncontrado] = useState(false);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const id = searchQuery;
    axios
      .get(`http://54.172.151.26/Buscar/${id}`)
      .then((response) => {
        const cliente = response.data;
        if (cliente) {
          setResultados([cliente]);
          setClienteNoEncontrado(false);
        } else {
          setResultados([]);
          setClienteNoEncontrado(true);
        }
      })
      .catch((error) => {
        console.error('Error al buscar el cliente:', error);
        alert('El cliente que buscas no fue encontrado');
      });
  };

  return (
    <div >
      <Principal />
     
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Texto text="Buscar Cliente" />
        <form onSubmit={handleSearchSubmit}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              style={{
                padding: '0.5rem',
                fontSize: '1.2rem',
                border: 'none',
                borderRadius: '4px',
                marginRight: '1rem',
                width: '300px',
              }}
              placeholder="Ingrese el ID a buscar"
            />
            <button
              type="submit"
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'rgb(204, 45, 45)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Buscar
            </button>
          </div>
        </form>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <table style={{ width: '83%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ backgroundColor: '#f2f2f2', fontWeight: 'bold', padding: '1rem', border: '1px solid #ddd' }}>ID</th>
                <th style={{ backgroundColor: '#f2f2f2', fontWeight: 'bold', padding: '1rem', border: '1px solid #ddd' }}>Nombre</th>
                <th style={{ backgroundColor: '#f2f2f2', fontWeight: 'bold', padding: '1rem', border: '1px solid #ddd' }}>Apellidos</th>
                <th style={{ backgroundColor: '#f2f2f2', fontWeight: 'bold', padding: '1rem', border: '1px solid #ddd' }}>Teléfono</th>
                <th style={{ backgroundColor: '#f2f2f2', fontWeight: 'bold', padding: '1rem', border: '1px solid #ddd' }}>Correo</th>
                <th style={{ backgroundColor: '#f2f2f2', fontWeight: 'bold', padding: '1rem', border: '1px solid #ddd' }}>Fecha</th>
                <th style={{ backgroundColor: '#f2f2f2', fontWeight: 'bold', padding: '1rem', border: '1px solid #ddd' }}>Paquete</th>
                <th style={{ backgroundColor: '#f2f2f2', fontWeight: 'bold', padding: '1rem', border: '1px solid #ddd' }}>Nombre de Usuario</th>
                <th style={{ backgroundColor: '#f2f2f2', fontWeight: 'bold', padding: '1rem', border: '1px solid #ddd' }}>Contraseña</th>
                <th style={{ backgroundColor: '#f2f2f2', fontWeight: 'bold', padding: '1rem', border: '1px solid #ddd' }}>Status</th>
              </tr>
            </thead>
            <tbody>
             
             {resultados.length > 0 ? (
                resultados.map((cliente) => (
                  <tr key={cliente.ID_Clientes}>
                    <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{cliente.ID_Clientes}</td>
                    <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{cliente.Nombre}</td>
                    <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{`${cliente.Apellido_Paterno} ${cliente.Apellido_Materno}`}</td>
                    <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{cliente.Telefono}</td>
                    <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{cliente.Correo}</td>
                    <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{`${cliente.Dia}-${cliente.Mes}-${cliente.Año}`}</td>
                    <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{cliente.Paquete_ID_Paquetes}</td>
                    <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{cliente.Nombre_Usuario}</td>
                    <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{cliente.Contraseña}</td>
                    <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{cliente.Status}</td>
                  </tr>
                ))
              ) : (
                <tr> 
                    <td colSpan="9" style={{ padding: '1rem', border: '1px solid #ddd', textAlign: 'center' }}>
                    No se encontraron resultados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Link to="/menu">
          <Boton className="button">Regresar</Boton>
        </Link>
      </div>
    </div>
  );
};

export default Buscar;