import { useState, useEffect } from 'react';
import { apiCompras, apiProductos, apiProveedores } from '../services/api';

const Compras = () => {
  // Estado para las listas de datos
  const [compras, setCompras] = useState([]);
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  // Estado para el formulario
  const [nuevaCompra, setNuevaCompra] = useState({
    productoId: '',
    cantidad: 1,
    proveedor: '' // Aquí guardaremos el Nombre o Razón Social
  });

  // 1. Carga Inicial de Datos (Catálogos e Historial)
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Ejecutamos las 3 peticiones en paralelo para que cargue más rápido
        const [resProd, resProv, resComp] = await Promise.all([
          apiProductos.get(''),
          apiProveedores.get(''),
          apiCompras.get('')
        ]);

        setProductos(resProd.data);
        setProveedores(resProv.data);
        setCompras(resComp.data);
      } catch (error) {
        console.error("Error cargando datos iniciales:", error);
      }
    };

    cargarDatos();
  }, []);

  // Función para recargar solo la tabla de compras después de guardar
  const recargarCompras = async () => {
    try {
      const response = await apiCompras.get('');
      setCompras(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // 2. Manejar el Envío del Formulario (Crear Orden)
  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!nuevaCompra.productoId || !nuevaCompra.proveedor) {
      alert("Por favor seleccione un producto y un proveedor");
      return;
    }

    try {
      // Enviamos la compra al MS-COMPRAS
      // El backend se encargará de hablar con MS-INVENTARIO automáticamente
      await apiCompras.post('', nuevaCompra);
      
      alert('Orden de Compra generada exitosamente!\nEl inventario ha sido actualizado.');
      
      // Limpiamos y recargamos
      setNuevaCompra({ productoId: '', cantidad: 1, proveedor: '' });
      recargarCompras();
    } catch (error) {
      alert('Error al procesar la compra: ' + error.message);
    }
  };

  // Helper para mostrar el nombre del producto en la tabla (tenemos el ID, queremos el Nombre)
  const getNombreProducto = (id) => {
    const prod = productos.find(p => p.id === id);
    return prod ? prod.nombre : 'Producto desconocido';
  };

  return (
    <div className="container mt-4">
      <h2>Gestión de Órdenes de Compra</h2>
      
      {/* Formulario de Nueva Orden */}
      <div className="card p-4 mb-4 shadow-sm border-primary">
        <h4 className="text-primary">Nueva Orden de Compra</h4>
        <p className="text-muted small">Al registrar la compra, el stock se sumará automáticamente al inventario.</p>
        
        <form onSubmit={handleGuardar}>
          <div className="row g-3">
            
            {/* Dropdown Productos */}
            <div className="col-md-4">
              <label className="form-label">Producto</label>
              <select className="form-select" required
                value={nuevaCompra.productoId}
                onChange={e => setNuevaCompra({...nuevaCompra, productoId: parseInt(e.target.value)})}>
                <option value="">-- Seleccione Producto --</option>
                {productos.map(p => (
                  <option key={p.id} value={p.id}>{p.sku} - {p.nombre}</option>
                ))}
              </select>
            </div>

            {/* Dropdown Proveedores */}
            <div className="col-md-4">
              <label className="form-label">Proveedor</label>
              <select className="form-select" required
                value={nuevaCompra.proveedor}
                onChange={e => setNuevaCompra({...nuevaCompra, proveedor: e.target.value})}>
                <option value="">-- Seleccione Proveedor --</option>
                {proveedores.map(prov => (
                  <option key={prov.id} value={prov.razonSocial}>{prov.razonSocial}</option>
                ))}
              </select>
            </div>

            {/* Cantidad */}
            <div className="col-md-2">
              <label className="form-label">Cantidad</label>
              <input type="number" className="form-control" min="1" required
                value={nuevaCompra.cantidad}
                onChange={e => setNuevaCompra({...nuevaCompra, cantidad: parseInt(e.target.value)})} />
            </div>

            {/* Botón */}
            <div className="col-md-2 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100">
                Generar Orden
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Historial de Compras */}
      <h3>Historial de Órdenes</h3>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID Orden</th>
              <th>Producto (ID)</th>
              <th>Proveedor</th>
              <th>Cantidad</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {compras.map(compra => (
              <tr key={compra.id}>
                <td>#{compra.id}</td>
                <td>
                  <strong>{getNombreProducto(compra.productoId)}</strong> 
                  <span className="text-muted small ms-2">(ID: {compra.productoId})</span>
                </td>
                <td>{compra.proveedor}</td>
                <td className="fw-bold text-success">+{compra.cantidad}</td>
                <td>{new Date(compra.fechaCompra).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Compras;