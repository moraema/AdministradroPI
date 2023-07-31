const express = require('express');
const mysql = require('mysql2');
const app = express();
const nodemailer = require('nodemailer');
const cors = require('cors')
const port = 8080; // Elige el puerto que desees para tu API



app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    next();
});


app.use(cors());
// Configuración de la conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: 'bdintegrador.ctafc3zavajx.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'manuel262004uni',
    database: 'BdIntegrador'
});

// Conexión a la base de datos
db.connect((error) => {
    if (error) {
        console.error('Error al conectar a la base de datos:', error);
    } else {
        console.log('Conexión exitosa a la base de datos');
    }
});

app.use(express.json()); // Middleware para procesar JSON en las solicitudes

app.on('error', (err) => {
    console.error('Ocurrió un error en el servidor:', err);
});

// Ruta para el inicio de sesión de un usuario
app.post('/Login', (req, res) => {
    const { Email, password } = req.body;
    const query = `
      SELECT *
      FROM Usuarios
      WHERE Email = ? AND password = ?
    `;

    db.query(query, [Email, password], (error, results) => {
        if (error) {
            console.error('Error al realizar el inicio de sesión:', error);
            res.status(500).json({ error: 'Error al realizar el inicio de sesión' });
        } else if (results.length === 0) {
            // Las credenciales son inválidas
            res.status(401).json({ error: 'Credenciales inválidas' });
        } else {
            // El inicio de sesión es exitoso
            const user = results[0];
            res.json({ success: true, user });
        }
    });
});



//obtener los datos de la tabla Clientes
app.get('/clientes', (req, res) => {
    const query = `
        SELECT Clientes.ID_Clientes, Clientes.Nombre, Clientes.Apellido_Paterno, Clientes.Apellido_Materno, Contacto.Telefono, Contacto.Correo, Fecha.Dia, Fecha.Mes, Fecha.Año, Cuentas.Nombre_Usuario, Cuentas.Contraseña, Clientes.Status, Clientes.Paquete_ID_Paquetes
        FROM Clientes
        JOIN Contacto ON Clientes.Contacto_ID_Contacto = Contacto.ID_Contacto
        JOIN Cuentas ON Clientes.Cuentas_ID_Cuentas = Cuentas.ID_Cuentas
        JOIN Fecha ON Clientes.Fecha_ID_Fecha = Fecha.ID_Fecha
    `;

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener los datos de la tabla Clientes:', error);
            res.status(500).json({ error: 'Error al obtener los datos de la tabla Clientes' });
        } else {
            console.log('Datos de la tabla Clientes:', results);
            res.json(results);
        }
    });
});


// agregar datos

app.post('/Agregar', (req, res) => {
    const {
        ID,
        Nombre,
        Apellido_Paterno,
        Apellido_Materno,
        Telefono,
        Status,
        Paquete,
        Nombre_Usuario,
        Contraseña,
        Dia,
        Mes,
        Año,
        Correo
    } = req.body;

    const queryContacto = `
      INSERT INTO Contacto (ID_Contacto, Telefono, Correo)
      VALUES (?, ?, ?)
    `;

    db.query(queryContacto, [ID, Telefono, Correo], (error, result) => {
        if (error) {
            console.error('Error al guardar los datos en la tabla Contacto:', error);
            res.status(500).json({ error: 'Error al guardar los datos en la tabla Contacto' });
        } else {
            const queryCuentas = `
          INSERT INTO Cuentas (ID_Cuentas, Nombre_Usuario, Contraseña)
          VALUES (?, ?, ?)
        `;

            db.query(queryCuentas, [ID, Nombre_Usuario, Contraseña], (error, result) => {
                if (error) {
                    console.error('Error al guardar los datos en la tabla Cuentas:', error);
                    res.status(500).json({ error: 'Error al guardar los datos en la tabla Cuentas' });
                } else {
                    const queryFecha = `
              INSERT INTO Fecha (ID_Fecha, Dia, Mes, Año)
              VALUES (?, ?, ?, ?)
            `;

                    db.query(queryFecha, [ID, Dia, Mes, Año], (error, result) => {
                        if (error) {
                            console.error('Error al guardar los datos en la tabla Fecha:', error);
                            res.status(500).json({ error: 'Error al guardar los datos en la tabla Fecha' });
                        } else {
                            const queryClientes = `
                  INSERT INTO Clientes (ID_Clientes, Nombre, Apellido_Paterno, Apellido_Materno, Status, Cuentas_ID_Cuentas, Contacto_ID_Contacto, Paquete_ID_Paquetes, Fecha_ID_Fecha)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                  `;

                            db.query(queryClientes, [ID, Nombre, Apellido_Paterno, Apellido_Materno, Status, ID, ID, Paquete, ID], (error, result) => {
                                if (error) {
                                    console.error('Error al guardar los datos en la tabla Clientes:', error);
                                    res.status(500).json({ error: 'Error al guardar los datos en la tabla Clientes' });
                                } else {
                                    console.log('Datos guardados exitosamente');
                                    res.json({ success: true });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

// Eliminar datos

app.delete('/Eliminar/:idToDelete', (req, res) => {
    const idToDelete = req.params.idToDelete;

    // Obtener el nombre de la tabla Clientes
    const getNombreClientesQuery = 'SELECT Nombre FROM Clientes WHERE Contacto_ID_Contacto = ?';
    db.query(getNombreClientesQuery, [idToDelete], (error, resultNombreClientes) => {
        if (error) {
            console.error('Error al obtener el nombre de la tabla Clientes:', error);
            res.status(500).json({ error: 'Error al obtener el nombre de la tabla Clientes' });
        } else {
            const nombreClientes = resultNombreClientes.length > 0 ? resultNombreClientes[0].Nombre : '';

            // Obtener el teléfono de la tabla Contacto
            const getTelefonoContactoQuery = 'SELECT Telefono FROM Contacto WHERE ID_Contacto = ?';
            db.query(getTelefonoContactoQuery, [idToDelete], (error, resultTelefonoContacto) => {
                if (error) {
                    console.error('Error al obtener el teléfono de la tabla Contacto:', error);
                    res.status(500).json({ error: 'Error al obtener el teléfono de la tabla Contacto' });
                } else {
                    const telefonoContacto = resultTelefonoContacto.length > 0 ? resultTelefonoContacto[0].Telefono : '';

                    // Eliminar los registros relacionados en la tabla Clientes
                    const deleteClientesQuery = 'DELETE FROM Clientes WHERE Contacto_ID_Contacto = ?';
                    db.query(deleteClientesQuery, [idToDelete], (error, resultClientes) => {
                        if (error) {
                            console.error('Error al eliminar los registros de la tabla Clientes:', error);
                            res.status(500).json({ error: 'Error al eliminar los registros de la tabla Clientes' });
                        } else {
                            // Eliminar los registros relacionados en la tabla Cuentas
                            const deleteCuentasQuery = 'DELETE FROM Cuentas WHERE ID_Cuentas = ?';
                            db.query(deleteCuentasQuery, [idToDelete], (error, resultCuentas) => {
                                if (error) {
                                    console.error('Error al eliminar los registros de la tabla Cuentas:', error);
                                    res.status(500).json({ error: 'Error al eliminar los registros de la tabla Cuentas' });
                                } else {
                                    // Eliminar el registro en la tabla Contacto
                                    const deleteContactoQuery = 'DELETE FROM Contacto WHERE ID_Contacto = ?';
                                    db.query(deleteContactoQuery, [idToDelete], (error, resultContacto) => {
                                        if (error) {
                                            console.error('Error al eliminar el registro de la tabla Contacto:', error);
                                            res.status(500).json({ error: 'Error al eliminar el registro de la tabla Contacto' });
                                        } else if (resultContacto.affectedRows === 0) {
                                            res.status(404).json({ error: 'Contacto no encontrado' });
                                        } else {
                                            // Eliminar el registro en la tabla Fecha
                                            const deleteFechaQuery = 'DELETE FROM Fecha WHERE ID_Fecha = ?';
                                            db.query(deleteFechaQuery, [idToDelete], (error, resultFecha) => {
                                                if (error) {
                                                    console.error('Error al eliminar el registro de la tabla Fecha:', error);
                                                    res.status(500).json({ error: 'Error al eliminar el registro de la tabla Fecha' });
                                                } else if (resultFecha.affectedRows === 0) {
                                                    res.status(404).json({ error: 'Fecha no encontrada' });
                                                } else {
                                                    console.log('Registros eliminados exitosamente');
                                                    res.json({ success: true, nombreClientes, telefonoContacto });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

app.put('/Modificar/:id', (req, res) => {
    const { id } = req.params;
    const { status, paquete } = req.body;

    const updateQuery = `
    UPDATE Clientes
    SET Status = ? ,
    Paquete_ID_Paquetes = ?
    WHERE ID_Clientes = ?
    `;

    db.query(updateQuery, [status, paquete, id], (error, result) => {
        if (error) {
            console.error('Error al modificar el cliente:', error);
            res.status(500).json({ error: 'Error al modificar el cliente' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Cliente no encontrado' });
        } else {
            console.log('Cliente modificado exitosamente');
            res.json({ success: true });
        }
    });
});


app.get('/Buscar/:id', (req, res) => {
    const id = req.params.id;

    const query = `
SELECT Clientes.ID_Clientes, Clientes.Nombre, Clientes.Apellido_Paterno, Clientes.Apellido_Materno, Contacto.Telefono, Contacto.Correo, Fecha.Dia, Fecha.Mes, Fecha.Año, Cuentas.Nombre_Usuario, Cuentas.Contraseña, Clientes.Status, Clientes.Paquete_ID_Paquetes
FROM Clientes
JOIN Contacto ON Clientes.Contacto_ID_Contacto = Contacto.ID_Contacto
JOIN Cuentas ON Clientes.Cuentas_ID_Cuentas = Cuentas.ID_Cuentas
JOIN Fecha ON Clientes.Fecha_ID_Fecha = Fecha.ID_Fecha
WHERE Clientes.ID_Clientes = ?
                                                                `;

    db.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al obtener los datos del cliente:', error);
            res.status(500).json({ error: 'Error al obtener los datos del cliente' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Cliente no encontrado' });
        } else {
            const cliente = results[0];
            res.json(cliente);
        }
    });
});

app.get('/VerReporte', (req, res) => {
    const query = `
    SELECT *
    FROM Reporte `;

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener los reportes:', error);
            res.status(500).json({ error: 'Error al obtener los reportes' });
        } else {
            res.json(results);
        }
    });
});


app.post('/Reporte', (req, res) => {
    const { nombre, telefono, reason } = req.body;

    const query = `
      INSERT INTO Reporte(Nombre, Telefono, Informe)
      VALUES (?, ?, ?)
    `;

    db.query(query, [nombre, telefono, reason], (error, result) => {
        if (error) {
            console.error('Error al guardar el reporte en la tabla Reporte:', error);
            res.status(500).json({ error: 'Error al guardar el reporte' });
        } else {
            console.log('Reporte guardado exitosamente');
            res.json({ success: true });
        }
    });
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'clientemanagerchtecnologia@gmail.com',
        pass: 'fkokdhsseqkbqzsz',
    },
    tls: {
        rejectUnauthorized: false,
    },
});

// Ruta para enviar notificaciones por correo electrónico
app.post('/Enviarnotificacion', (req, res) => {
    const { to, fechaPago } = req.body;

    // Obtenemos el día actual
    const fechaActual = new Date();
    const diaActual = fechaActual.getDate();

    // Obtenemos el día de pago
    const diaPago = parseInt(fechaPago, 10);

    // Comparamos el día actual con el día de pago
    // Si el día actual es mayor que el día de pago, significa que el pago será en el próximo mes
    let mesPagoReal = fechaActual.getMonth() + 1; // Sumamos 1 ya que los meses en JavaScript son base 0 (0 - Enero, 1 - Febrero, etc.)
    if (diaActual > diaPago) {
        mesPagoReal += 1;
        if (mesPagoReal > 12) {
            mesPagoReal = 1; // Volvemos a enero si el mes actual supera diciembre
        }
    }

    // Obtenemos el nombre del mes de pago en base al número
    const meses = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
    ];
    const mesPagoNombre = meses[mesPagoReal - 1]; // Restamos 1 ya que el array es base 0

    // Verificamos si el mesPagoNombre es undefined
    if (!mesPagoNombre) {
        console.error('Error: Mes de pago no válido');
        res.status(400).json({ error: 'Mes de pago no válido' });
        return;
    }

    const mailOptions = {
        from: 'clientemanagerchtecnologia@gmail.com', // Cambia esto por tu correo electrónico de Gmail
        to: to, // Destinatario del correo, proviene del cuerpo de la solicitud
        subject: 'Notificación de Pago - CHTecnologia', // Asunto del correo
        html: `<div style="font-family: Arial, sans-serif;">
               <h3 style="color: black;">Estimado/a Cliente</h3>
               <p style="color: black;">Por este medio le recordamos el día de su pago de su servicio de internet</p>
               <p style="color: black;">Detalles del pago:</p>
               <ul>
                 <li style="color: black;">Su proxima fecha de pago es el día ${diaPago} de ${mesPagoNombre}</li>
                 <li style="color: black;">Concepto: Pago de servicio de internet</li>
               </ul>
               <p style="color: black;">Gracias por su confianza</p>
               <p style="color: black;">Atentamente</p>
               <p style="color: black;">Equipo de CHTecnologia</p>
             </div>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error enviando notificación:', error);
            res.status(500).json({ error: 'Error enviando notificación' });
        } else {
            console.log('Notificación enviada correctamente:', info.response);
            res.json({ success: true });
        }
    });
});

// Iniciar el servidor
const server = app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
});

// Manejo de errores no capturados en las promesas
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Aquí puedes agregar código adicional para manejar el error de manera adecuada
});