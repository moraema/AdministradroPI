import React from 'react';
import { Link } from 'react-router-dom';
import "../estilos/clientesStatus.css";
import "../estilos/buton.css";
import Texto from "./texto";
import Boton from './Boton.jsx';
import Principal from './Prinicipal';

class Reporte extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportes: [],
    };
  }

  componentDidMount() {
    // Realizar la solicitud a la API para obtener los reportes
    fetch('http://54.172.151.26/VerReporte')
      .then(response => response.json())
      .then(data => {
        this.setState({ reportes: data });
      })
      .catch(error => {
        console.error('Error al obtener los reportes:', error);
      });
  }

  render() {
    return (
      <div>
        <Principal />
        <div className="ClienteTableView">
          <Texto text="Reporte" />
          <table className="ReporteTable">
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>Nombre</th>
                <th style={{ textAlign: 'center' }}>Teléfono</th>
                <th style={{ textAlign: 'center' }}>Informe</th>
              </tr>
            </thead>
            <tbody>
              {this.state.reportes.map(reporte => (
                <tr key={reporte.ID}>
                  <td style={{ textAlign: 'center' }}>{reporte.Nombre}</td>
                  <td style={{ textAlign: 'center' }}>{reporte.Telefono}</td>
                  <td style={{ textAlign: 'center' }}>{reporte.Informe}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/menu">
            <Boton className='button'>Regresar</Boton>
          </Link>
        </div>
      </div>
    );
  }
}

export default Reporte;
