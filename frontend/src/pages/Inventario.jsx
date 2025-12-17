import { useState, useEffect } from 'react';
import { apiProductos, apiInventario } from '../services/api';

const Inventario = () => {
  // Estados principales
  const [productos, setProductos] = useState([]);
  const [inventario, setInventario] = useState([]);
  
  // Estado para el Kardex
  const [historial, setHistorial] = useState([]);
  const [prodKardexNombre, setProdKardexNombre] = useState(null);

  // Estado para el Formulario
  const [formAjuste, setFormAjuste] = useState({
    productoId: '',
    cantidad: 0
  });

  // Helper para traducir ID -> Nombre (Lo necesitamos definir antes de usarlo en cargarDatos o render)
  const getNombreProducto = (id) => {
    const prod = productos.find(p => p.id === id);
    return prod ? prod.nombre : 'Producto Desconocido';
  };

  // --- 1. DEFINIR la función de carga PRIMERO ---
  const cargarDatos = async () => {
    try {
      const [resProd, resInv] = await Promise.all([
        apiProductos.get(''),
        apiInventario.get('') 
      ]);
      setProductos(resProd.data);
      setInventario(resInv.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  // --- 2. USARLA en el useEffect DESPUÉS ---
  useEffect(() => {
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Función para Ver el Kardex
  const verKardex = async (productoId) => {
    try {
      const nombreProd = getNombreProducto(productoId);
      setProdKardexNombre(nombreProd);
      
      const response = await apiInventario.get(`/${productoId}/kardex`);
      setHistorial(response.data);
    } catch (error) {
      // AQUÍ CORREGIMOS EL SEGUNDO ERROR: Usamos la variable 'error'
      console.error("Error al obtener kardex:", error);
      alert("Error cargando historial del producto");
    }
  };

  // Función para Agregar Stock
  const handleAgregarStock = async (e) => {
    e.preventDefault();
    if (!formAjuste.productoId || formAjuste.cantidad <= 0) {
      alert("Datos inválidos");
      return;
    }

    try {
      const datos = {
        productoId: parseInt(formAjuste.productoId),
        cantidad: parseInt(formAjuste.cantidad)
      };

      await apiInventario.post('/agregar', datos);
      
      alert('Stock ajustado correctamente');
      setFormAjuste({ productoId: '', cantidad: 0 }); 
      
      // Reutilizamos la función que ya definimos arriba
      cargarDatos(); 
      
      if (prodKardexNombre === getNombreProducto(datos.productoId)) {
        verKardex(datos.productoId);
      }

    } catch (error) {
      console.error(error); // Usamos el error para que no salga warning
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gestión de Almacén y Kardex</h2>

      {/* SECCIÓN 1: FORMULARIO DE AJUSTE MANUAL */}
      <div className="card p-4 shadow-sm mb-5 border-primary">
        <h5 className="text-primary">Ajuste Manual / Entrada Inicial</h5>
        <form onSubmit={handleAgregarStock}>
          <div className="row g-3 align-items-end">
            <div className="col-md-5">
              <label className="form-label">Producto</label>
              <select className="form-select" 
                value={formAjuste.productoId}
                onChange={e => setFormAjuste({...formAjuste, productoId: e.target.value})}>
                <option value="">-- Seleccione --</option>
                {productos.map(p => (
                  <option key={p.id} value={p.id}>{p.sku} - {p.nombre}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Cantidad a Sumar</label>
              <input type="number" className="form-control" min="1" 
                value={formAjuste.cantidad}
                onChange={e => setFormAjuste({...formAjuste, cantidad: e.target.value})} />
            </div>
            <div className="col-md-4">
              <button type="submit" className="btn btn-primary w-100">Actualizar Inventario</button>
            </div>
          </div>
        </form>
      </div>

      {/* SECCIÓN 2: TABLA GENERAL DE INVENTARIO */}
      <h4 className="mb-3">Existencias Actuales</h4>
      <div className="table-responsive shadow-sm mb-5">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Producto</th>
              <th>Ubicación</th>
              <th className="text-center">Stock Total</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inventario.map(item => (
              <tr key={item.id}>
                <td>
                    <span className="fw-bold">{getNombreProducto(item.productoId)}</span>
                    <br/>
                    <small className="text-muted">ID Ref: {item.productoId}</small>
                </td>
                <td>{item.ubicacionBodega || 'Bodega Central'}</td>
                <td className="text-center">
                    <span className={`badge fs-6 ${item.cantidad < 5 ? 'bg-danger' : 'bg-success'}`}>
                        {item.cantidad}
                    </span>
                </td>
                <td className="text-center">
                  <button className="btn btn-outline-info btn-sm" 
                    onClick={() => verKardex(item.productoId)}>
                    Ver Historial
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SECCIÓN 3: KARDEX */}
      {prodKardexNombre && (
        <div className="card border-info shadow">
            <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Historial de Movimientos: <strong>{prodKardexNombre}</strong></h5>
                <button className="btn btn-sm btn-light text-info fw-bold" onClick={() => setProdKardexNombre(null)}>X Cerrar</button>
            </div>
            <div className="card-body p-0">
                <table className="table table-striped mb-0">
                    <thead className="table-secondary">
                        <tr>
                            <th>Fecha</th>
                            <th>Tipo de Movimiento</th>
                            <th>Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historial.length === 0 ? (
                            <tr><td colSpan="3" className="text-center p-3">No hay movimientos registrados.</td></tr>
                        ) : (
                            historial.map(mov => (
                                <tr key={mov.id}>
                                    <td>{new Date(mov.fecha).toLocaleString()}</td>
                                    <td>
                                        {mov.tipo === 'ENTRADA_COMPRA' && <span className="badge bg-success">COMPRA (+Stock)</span>}
                                        {mov.tipo === 'SALIDA_VENTA' && <span className="badge bg-danger">VENTA (-Stock)</span>}
                                        {/* Ajustamos el nombre manual para que se vea bonito */}
                                        {(!['ENTRADA_COMPRA', 'SALIDA_VENTA'].includes(mov.tipo)) && <span className="badge bg-warning text-dark">{mov.tipo}</span>}
                                    </td>
                                    <td className="fw-bold">
                                        {mov.tipo.includes('SALIDA') ? '-' : '+'}{mov.cantidad}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      )}
    </div>
  );
};

export default Inventario;