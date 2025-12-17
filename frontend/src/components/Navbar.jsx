import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">Sistema Inventario</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/inicio">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/productos">Productos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/proveedores">Proveedores</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/inventario">Inventario</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/compras">Compras</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ventas">Ventas</Link> 
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;