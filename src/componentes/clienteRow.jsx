import React from 'react';


class ClienteRow extends React.Component {
  render() {
    const { cliente } = this.props;
    return (
      <tr>
        <td>{cliente.nombre}</td>
        <td>{cliente.apellidos}</td>
        <td>{cliente.telefono}</td>
        <td>{cliente.direccion}</td>
        <td>{cliente.estatusPago}</td>
        <td className="modificar-button">
          <button onClick={() => this.modificarEstatus(cliente.id)}>Modificar</button>
        </td>
      </tr>
    );
  }

  modificarEstatus(clienteId) {
    // Aquí se implementara la lógica para modificar el estatus del cliente con el ID "clienteId"
    // Puedes realizar una llamada a tu API para actualizar el estatus en la base de datos
  }
}

export default ClienteRow;