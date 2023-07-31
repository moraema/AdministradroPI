import 'bootstrap/dist/css/bootstrap.css';
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import eliminar from "../imagenes/121113.png";
import axios from 'axios';

const opcionesEliminar = [
  "Mal servicio",
  "Cambio de necesidades",
  "Competencia",
  "Problemas de seguridad",
  "Costo alto del servicio",
  "Falta de atención al cliente",
  "Problemas técnicos",
  "Cambio de domicilio",
  "Falta de pago",
  "El cliente no cumple con los requisitos",
  "El cliente ha solicitado la eliminación",
  "Otra razón",
];

const Eliminar = () => {
  const [showModal, setShowModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState('');
  const [deleteReason, setDeleteReason] = useState('');
  const [reporteEnviado, setReporteEnviado] = useState(false);

  const handleInputChange = (e) => {
    if (e.target.name === 'id') {
      setIdToDelete(e.target.value);
    } else if (e.target.name === 'reason') {
      setDeleteReason(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Realizar la llamada a la API para eliminar el ID del cliente
      const response =  await axios.delete(`http://54.172.151.26/Eliminar/${idToDelete}`);
      const { nombreClientes, telefonoContacto } = response.data;
      // Enviar el informe a la API "reporte"
      await axios.post('http://54.172.151.26/Reporte', {
        id: idToDelete,
        reason: deleteReason,
        nombre: nombreClientes,
        telefono: telefonoContacto
      });

      // Actualizar el estado de reporteEnviado
      setReporteEnviado(true);

      // Cerrar el modal y reiniciar los campos
      handleClose();
      alert("Cliente eliminado con exito");
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
      alert("El cliente a eliminar no fue encontrado");
      // Manejar el error de eliminación del cliente
    }
  };

  const handleClose = () => {
    setIdToDelete('');
    setDeleteReason('');
    setShowModal(false);
  };

  return (
    <>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Eliminar
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reporteEnviado && (
            <div style={{ color: 'green', marginBottom: '10px' }}>Informe enviado correctamente</div>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{ border: '2px solid orange', padding: '10px', borderRadius: '5px' }}>
              <img
                src={eliminar}
                alt="Logo de cliente"
                style={{ width: '100px', height: '100px' }}
              />
            </div>
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formId">
              <Form.Label>ID del cliente a eliminar</Form.Label>
              <Form.Control
                type="text"
                name="id"
                value={idToDelete}
                onChange={handleInputChange}
                required
                style={{ marginBottom: '10px' }}
              />
            </Form.Group>
            <Form.Group controlId="formReason">
          <Form.Label>¿Por qué se está eliminando al cliente?</Form.Label>
          <Form.Control
            as="select" // Usa "select" para crear el combo box
            name="reason"
            value={deleteReason}
            onChange={handleInputChange}
            required
            style={{ marginBottom: '10px' }}
          >
            {/* Mapea el arreglo opcionesEliminar para crear las opciones */}
            {opcionesEliminar.map((razon, index) => (
              <option key={index} value={razon}>
                {razon}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={handleClose} style={{ marginRight: '10px' }}>
                Cerrar
              </Button>{' '}
              <Button
                variant="danger"
                type="submit"
                disabled={!idToDelete}
                style={{ backgroundColor: 'blue', color: 'white' }}
                className="btn-primary"
              >
                Eliminar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Eliminar;

