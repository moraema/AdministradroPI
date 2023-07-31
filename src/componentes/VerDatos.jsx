import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Texto from '../componentes/texto';
import Boton from '../componentes/Boton';
import Principal from './Prinicipal';
import '../estilos/dialogo.css';

class ClienteTableView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientes: [],
      selectedClienteId: null,
      selectedClienteNombre: '',
      isDialogOpen: false,
      selectedStatus: '',
      selectedPaquete: '',
    };
  }

  componentDidMount() {
    this.fetchClientes();
  }

  fetchClientes = () => {
    axios
      .get('http://54.172.151.26/clientes')
      .then((response) => {
        const clientes = response.data;
        this.setState({ clientes });
      })
      .catch((error) => {
        console.error('Error al obtener los datos de los clientes:', error);
      });
  };

  handleModificarCliente = (clienteId, clienteNombre) => {
    console.log('Modificar cliente con ID:', clienteId);
    this.setState({
      selectedClienteId: clienteId,
      selectedClienteNombre: clienteNombre,
      isDialogOpen: true,
    });
  };

  handleNotificar = (correo, fechaPago) => {
    axios
      .post('http://54.172.151.26/Enviarnotificacion', { to: correo, fechaPago: fechaPago })
      .then((response) => {
        console.log('Notificacion en suceso');
        alert("Notificacion hecha al correo:  " + correo);
      })
      .catch((error) => {
        console.error('Error en la notificacion:', error);
       
      });
  };

  handleVerNotificaciones = (clienteId, correo, fechaPago) => {
    console.log('Ver notificaciones para el cliente con ID:', clienteId);

    // Obtenemos solo el día de la fecha
    const fechaArray = fechaPago.split('/');
    const dia = fechaArray[0];

    this.handleNotificar(correo, dia);
    
  };

  handleStatusChange = (e) => {
    this.setState({ selectedStatus: e.target.value });
  };

  handlePaqueteChange = (e) => {
    this.setState({ selectedPaquete: e.target.value });
  };

  closeDialog = () => {
    this.setState({ isDialogOpen: false });
  };

  modificarCliente = () => {
    const { selectedClienteId, selectedStatus, selectedPaquete } = this.state;

    axios
      .put(`http://54.172.151.26/Modificar/${selectedClienteId}`, {
        status: selectedStatus,
        paquete: selectedPaquete,
      })
      .then((response) => {
        console.log('Cliente modificado exitosamente');
        this.closeDialog();
        this.fetchClientes(); // actualiza tablas
      })
      .catch((error) => {
        console.error('Error al modificar el cliente:', error);
      });
  };

  render() {
    const { clientes, isDialogOpen, selectedClienteId, selectedClienteNombre, selectedStatus, selectedPaquete } = this.state;

    return (
      <div>
        <Principal />
        <div className="ClienteTableView">
          <Texto text="Tabla de clientes" />
          <table>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>ID</th>
                <th style={{ textAlign: 'center' }}>Nombre</th>
                <th style={{ textAlign: 'center' }}>Apellidos</th>
                <th style={{ textAlign: 'center' }}>Teléfono</th>
                <th style={{ textAlign: 'center' }}>Correo</th>
                <th style={{ textAlign: 'center' }}>Fecha</th>
                <th style={{ textAlign: 'center' }}>Paquete</th>
                <th style={{ textAlign: 'center' }}>Usuario</th>
                <th style={{ textAlign: 'center' }}>Contraseña</th>
                <th style={{ textAlign: 'center' }}>Estatus de Pago</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.ID_Clientes}>
                  <td>{cliente.ID_Clientes}</td>
                  <td>{cliente.Nombre}</td>
                  <td>{`${cliente.Apellido_Paterno} ${cliente.Apellido_Materno}`}</td>
                  <td>{cliente.Telefono}</td>
                  <td>{cliente.Correo}</td>
                  <td>{`${cliente.Dia}/${cliente.Mes}/${cliente.Año}`}</td>
                  <td>{cliente.Paquete_ID_Paquetes}</td>
                  <td>{cliente.Nombre_Usuario}</td>
                  <td>{cliente.Contraseña}</td>
                  <td>{cliente.Status}</td>
                  <td>
                    <div style={{ display: 'flex' }}>
                      <button
                        onClick={() => this.handleModificarCliente(cliente.ID_Clientes, cliente.Nombre)}
                        style={{ backgroundColor: '#1E90FF', color: 'white', borderRadius: '5px', marginRight: '5px', flex: 0 }}
                      >
                        Modificar
                      </button>
                      <button
                        onClick={() => this.handleVerNotificaciones(cliente.ID_Clientes, cliente.Correo, `${cliente.Dia}`)}
                        style={{ backgroundColor: '#1E90FF', color: 'white', borderRadius: '5px', flex: 0 }}
                      >
                        Notificar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Link to="/menu">
            <Boton className="button">Regresar</Boton>
          </Link>

          {isDialogOpen && (
            <div className="dialog-overlay">
              <div className="dialog-content">
                <h4>Modificar Cliente (ID: {selectedClienteId})</h4>
                <h5>Nombre: {selectedClienteNombre}</h5>
                <label htmlFor="status">Estatus de Pago:</label>
                <select id="status" value={selectedStatus} onChange={this.handleStatusChange}>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
                <label htmlFor="paquete">Paquete:</label>
                <select id="paquete" value={selectedPaquete} onChange={this.handlePaqueteChange}>
                  <option value="1">Paquete 1</option>
                  <option value="2">Paquete 2</option>
                  <option value="3">Paquete 3</option>
                  <option value="4">Paquete 4</option>
                </select>
                <button onClick={this.closeDialog} className="dialog-button">
                  Cancelar
                </button>
                <button onClick={this.modificarCliente} className="dialog-button">
                  Guardar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ClienteTableView;
