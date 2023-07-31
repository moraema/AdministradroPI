import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from "./componentes/menu";
import Inicio from './componentes/inicio';
import Reporte from './componentes/Reporte';
import VerInformacionCliente from './componentes/VerDatos';
import BuscarCliente from './componentes/Buscar';
import  Principal from './componentes/Prinicipal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/Principal" element={<Principal />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/reporte" element={<Reporte />} />
        <Route path="/ver-informacion" element={<VerInformacionCliente />} />
        <Route path="/buscar-cliente" element={<BuscarCliente />} />
       
      </Routes>
    </Router>
  );
}

export default App;