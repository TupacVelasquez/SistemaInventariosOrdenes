import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Productos from './pages/Productos';
import Proveedores from './pages/Proveedores'; 
import Inventario from './pages/Inventario';
import Compras from './pages/Compras';
import Ventas from './pages/Ventas';
import Inicio from './pages/Inicio';


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/proveedores" element={<Proveedores />} /> 
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/compras" element={<Compras />} />
        <Route path="/ventas" element={<Ventas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;