import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../imagenes/whatsapp_image_2023_07_08_at_1_27_1.png';
import logo2 from '../imagenes/logo-client-manager.png'; // Ruta de la nueva imagen
import '../estilos/menuestilos.css';

const Principal = () => {
  return (
    <div className="App">
      <div className="red-box">
        <Container>
          <Row className="service-row">
            <Col className="text-center white-text">
              <h2>Gestor de Clientes</h2>
            </Col>
          </Row>
        </Container>
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
          <img src={logo2} alt="logo2" className="logo2" />
        </div>
      </div>
    </div>
  );
}

export default Principal;
