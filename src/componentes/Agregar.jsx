import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import AgregarCliente from "../imagenes/cliente.jpg";
import axios from 'axios';
import '../estilos/modal.css';

const Agregar = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    ID: '',
    Nombre: '',
    Apellido_Paterno: '',
    Apellido_Materno: '',
    Telefono: '',
    Dia: '',
    Mes: '',
    Año: '',
    Status: 'Activo',
    Paquete: '',
    Nombre_Usuario: '',
    Contraseña: '',
    Correo: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const usernameRegex = /^[A-Z0-9]{8}$/;
    if (!usernameRegex.test(formData.Nombre_Usuario)) {
      alert("El nombre de usuario debe tener 8 dígitos entre letras mayúsculas y números.");
      return;
    }

    const passwordRegex = /^[A-Z0-9]{8}$/;
    if (!passwordRegex.test(formData.Contraseña)) {
      alert("La contraseña debe tener 8 dígitos entre letras mayúsculas y números.");
      return;
    }

    // Hacer la solicitud POST a tu API
    axios.post('http://54.172.151.26/Agregar', formData)
      .then((response) => {
        console.log('Datos guardados exitosamente:', response.data);
        handleClose(); // Cerrar el modal y reiniciar los campos
        alert("Cliente agregado con éxito");
      })
      .catch((error) => {
        console.error('Error al guardar los datos:', error);
        // Agregar manejo de errores adecuado aquí
      });
  };

  const esAnioBisiesto = (anio) => {
    return (anio % 4 === 0 && anio % 100 !== 0) || anio % 400 === 0;
  };

  const obtenerMaxDiasMes = (mes, anio) => {
    if (mes === 'Febrero') {
      return esAnioBisiesto(anio) ? 29 : 28;
    } else if (['Abril', 'Junio', 'Septiembre', 'Noviembre'].includes(mes)) {
      return 30;
    } else {
      return 31;
    }
  };

  const handleClose = () => {
    setFormData({
      ID: '',
      Nombre: '',
      Apellido_Paterno: '',
      Apellido_Materno: '',
      Telefono: '',
      Dia: '',
      Mes: '',
      Año: '',
      Status: 'Activo',
      Paquete: '',
      Nombre_Usuario: '',
      Contraseña: '',
      Correo: '',
    });
    setShowModal(false);
  };

  return (
    <>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Agregar
      </Button>

      <Modal show={showModal} onHide={handleClose} dialogClassName="modal-small">
        <Modal.Header closeButton>
          <Modal.Title>Agregar nuevo cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{ border: '2px solid orange', padding: '10px', display: 'inline-block' }}>
              <img
                src={AgregarCliente}
                alt="Logo de cliente"
                style={{ width: '80px', height: '80px' }}
              />
            </div>
          </div>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col>
                <Form.Group controlId="formIp">
                  <Form.Label style={{ fontSize: '14px', margin: '0' }}>IP</Form.Label>
                  <Form.Control
                    type="text"
                    name="ID"
                    value={formData.ID}
                    onChange={handleInputChange}
                    required
                    style={{ fontSize: '14px', border: formData.ID ? '2px solid green' : '', margin: '0' }}
                  />
                </Form.Group>
                <Form.Group controlId="formNombre">
                  <Form.Label style={{ fontSize: '14px', margin: '0' }}>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="Nombre"
                    value={formData.Nombre}
                    onChange={handleInputChange}
                    required
                    style={{ fontSize: '14px', border: formData.Nombre ? '2px solid green' : '', margin: '0' }}
                  />
                </Form.Group>
                <Form.Group controlId="formApellidoPaterno">
                  <Form.Label style={{ fontSize: '14px', margin: '0' }}>Apellido Paterno</Form.Label>
                  <Form.Control
                    type="text"
                    name="Apellido_Paterno"
                    value={formData.Apellido_Paterno}
                    onChange={handleInputChange}
                    required
                    style={{ fontSize: '14px', border: formData.Apellido_Paterno ? '2px solid green' : '', margin: '0' }}
                  />
                </Form.Group>
                <Form.Group controlId="formApellidoMaterno">
                  <Form.Label style={{ fontSize: '14px', margin: '0' }}>Apellido Materno</Form.Label>
                  <Form.Control
                    type="text"
                    name="Apellido_Materno"
                    value={formData.Apellido_Materno}
                    onChange={handleInputChange}
                    required
                    style={{ fontSize: '14px', border: formData.Apellido_Materno ? '2px solid green' : '', margin: '0' }}
                  />
                </Form.Group>
                <Form.Group controlId="formTelefono">
                  <Form.Label style={{ fontSize: '14px', margin: '0' }}>Número de teléfono</Form.Label>
                  <Form.Control
                    type="tel"
                    name="Telefono"
                    value={formData.Telefono}
                    onChange={handleInputChange}
                    required
                    style={{ fontSize: '14px', border: formData.Telefono ? '2px solid green' : '', margin: '0' }}
                  />
                </Form.Group>
                <Form.Group controlId="formCorreo">
                  <Form.Label style={{ fontSize: '14px', margin: '0' }}>Correo</Form.Label>
                  <Form.Control
                    type="email"
                    name="Correo"
                    value={formData.Correo}
                    onChange={handleInputChange}
                    required
                    style={{ fontSize: '14px', border: formData.Correo ? '2px solid green' : '', margin: '0' }}
                  />
                </Form.Group>
              </Col>
              <Col>
              <Form.Group controlId="formFecha">
                  <Form.Label style={{ fontSize: '14px', margin: '0' }}>Fecha</Form.Label>
                  <div style={{ display: 'flex', marginBottom: '10px' }}>
                    <Form.Control
                      type="number"
                      name="Dia"
                      value={formData.Dia}
                      onChange={handleInputChange}
                      min="1"
                      max={formData.Mes ? obtenerMaxDiasMes(formData.Mes, formData.Año) : 31}
                      required
                      style={{ fontSize: '14px', border: formData.Dia ? '2px solid green' : '', margin: '0', width: '30%' }}
                    />
                     <Form.Control
                      as="select"
                      name="Mes"
                      value={formData.Mes}
                      onChange={handleInputChange}
                      required
                      style={{ fontSize: '10px', border: formData.Mes ? '2px solid green' : '', margin: '0', width: '55%', marginLeft: '10px' }}
                    >
                      <option value="">Selecciona un mes</option>
                      <option value="Enero">Enero</option>
                      <option value="Febrero">Febrero</option>
                      <option value="Marzo">Marzo</option>
                      <option value="Abril">Abril</option>
                      <option value="Mayo">Mayo</option>
                      <option value="Junio">Junio</option>
                      <option value="Julio">Julio</option>
                      <option value="Agosto">Agosto</option>
                      <option value="Septiembre">Septiembre</option>
                      <option value="Octubre">Octubre</option>
                      <option value="Noviembre">Noviembre</option>
                      <option value="Diciembre">Diciembre</option>
                    </Form.Control>
                    <Form.Control
                      type="number"
                      name="Año"
                      value={formData.Año}
                      onChange={handleInputChange}
                      min="2022"
                      max="2099"
                      required
                      style={{ fontSize: '14px', border: formData.Año ? '2px solid green' : '', margin: '0', width: '40%', marginLeft: '10px' }}
                    />
                  </div>
                </Form.Group>
                <Form.Group controlId="formStatus">
                  <Form.Label style={{ fontSize: '14px', margin: '0' }}>Status</Form.Label>
                  <Form.Control
                    as="select"
                    name="Status"
                    value={formData.Status}
                    onChange={handleInputChange}
                    style={{ fontSize: '14px', border: formData.Status ? '2px solid green' : '', margin: '0' }}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formPaquete">
                  <Form.Label style={{ fontSize: '14px', margin: '0' }}>Tipo de paquete</Form.Label>
                  <Form.Control
                    as="select"
                    name="Paquete"
                    value={formData.Paquete}
                    onChange={handleInputChange}
                    required
                    style={{ fontSize: '14px', border: formData.Paquete ? '2px solid green' : '', margin: '0' }}
                  >
                    <option value="">Selecciona un paquete</option>
                    <option value="1">3GB</option>
                    <option value="2">5GB</option>
                    <option value="3">10GB</option>
                    <option value="4">20GB</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formNombreUsuario">
                  <Form.Label style={{ fontSize: '14px', margin: '0' }}>Nombre de usuario</Form.Label>
                  <Form.Control
                    type="text"
                    name="Nombre_Usuario"
                    value={formData.Nombre_Usuario}
                    onChange={handleInputChange}
                    required
                    style={{ fontSize: '14px', border: formData.Nombre_Usuario ? '2px solid green' : '', margin: '0' }}
                  />
                </Form.Group>
                <Form.Group controlId="formContraseña">
                  <Form.Label style={{ fontSize: '14px', margin: '0' }}>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="Contraseña"
                    value={formData.Contraseña}
                    onChange={handleInputChange}
                    required
                    style={{ fontSize: '14px', border: formData.Contraseña ? '2px solid green' : '', margin: '0' }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="secondary" onClick={handleClose} style={{ marginRight: '10px', fontSize: '14px' }}>
                Cerrar
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={
                  !formData.ID ||
                  !formData.Nombre ||
                  !formData.Apellido_Paterno ||
                  !formData.Apellido_Materno ||
                  !formData.Telefono ||
                  !formData.Dia ||
                  !formData.Mes ||
                  !formData.Año ||
                  !formData.Paquete ||
                  !formData.Nombre_Usuario ||
                  !formData.Contraseña ||
                  !formData.Correo
                }
                style={{ backgroundColor: 'orange', color: 'white', fontSize: '14px' }}
              >
                Agregar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Agregar;
