import { useState, useEffect } from 'react';
import { apiProductos } from '../services/api';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', sku: '', descripcion: '', precio: 0, categoria: '', stockMinimo: 5 });
  const [editandoId, setEditandoId] = useState(null);
  const [productoEditado, setProductoEditado] = useState({});

  useEffect(() => { recargarProductos(); }, []);

  const recargarProductos = async () => {
    try {
      const response = await apiProductos.get('');
      setProductos(response.data);
    } catch (error) { console.error("Error cargando productos:", error); }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      await apiProductos.post('', nuevoProducto);
      setNuevoProducto({ nombre: '', sku: '', descripcion: '', precio: 0, categoria: '', stockMinimo: 5 });
      recargarProductos();
      alert('✅ Producto guardado');
    } catch (error) { alert('❌ Error: ' + error.message); }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Eliminar producto?')) {
      try {
        await apiProductos.delete(`/${id}`);
        recargarProductos();
      } catch (error) { alert('Error al eliminar'); }
    }
  };

  const handleActualizar = async (id) => {
    try {
      await apiProductos.put(`/${id}`, productoEditado);
      setEditandoId(null);
      recargarProductos();
    } catch (error) { alert('Error al actualizar'); }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary">Catálogo de Productos</h2>
      
      {/* Formulario */}
      <div className="card p-3 mb-4 shadow-sm border-0 bg-light">
        <form onSubmit={handleGuardar}>
          <div className="row g-2">
            <div className="col-md-2"><input type="text" className="form-control" placeholder="Nombre" required value={nuevoProducto.nombre} onChange={e => setNuevoProducto({...nuevoProducto, nombre: e.target.value})} /></div>
            <div className="col-md-2"><input type="text" className="form-control" placeholder="SKU" required value={nuevoProducto.sku} onChange={e => setNuevoProducto({...nuevoProducto, sku: e.target.value})} /></div>
            <div className="col-md-2"><input type="text" className="form-control" placeholder="Descripción" value={nuevoProducto.descripcion} onChange={e => setNuevoProducto({...nuevoProducto, descripcion: e.target.value})} /></div>
            <div className="col-md-2"><input type="text" className="form-control" placeholder="Categoría" value={nuevoProducto.categoria} onChange={e => setNuevoProducto({...nuevoProducto, categoria: e.target.value})} /></div>
            <div className="col-md-1"><input type="number" className="form-control" placeholder="Precio" required value={nuevoProducto.precio} onChange={e => setNuevoProducto({...nuevoProducto, precio: parseFloat(e.target.value)})} /></div>
            <div className="col-md-1"><input type="number" className="form-control" placeholder="Stock Min" required value={nuevoProducto.stockMinimo} onChange={e => setNuevoProducto({...nuevoProducto, stockMinimo: parseInt(e.target.value)})} /></div>
            <div className="col-md-2"><button type="submit" className="btn btn-primary w-100">Añadir</button></div>
          </div>
        </form>
      </div>

      <table className="table table-hover align-middle shadow-sm bg-white">
        <thead className="table-dark">
          <tr>
            <th>SKU</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock Mín.</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(prod => (
            <tr key={prod.id}>
              {editandoId === prod.id ? (
                <>
                  <td><input type="text" className="form-control form-control-sm" value={productoEditado.sku} onChange={e => setProductoEditado({...productoEditado, sku: e.target.value})} /></td>
                  <td><input type="text" className="form-control form-control-sm" value={productoEditado.nombre} onChange={e => setProductoEditado({...productoEditado, nombre: e.target.value})} /></td>
                  <td><input type="text" className="form-control form-control-sm" value={productoEditado.descripcion} onChange={e => setProductoEditado({...productoEditado, descripcion: e.target.value})} /></td>
                  <td><input type="text" className="form-control form-control-sm" value={productoEditado.categoria} onChange={e => setProductoEditado({...productoEditado, categoria: e.target.value})} /></td>
                  <td><input type="number" className="form-control form-control-sm" value={productoEditado.precio} onChange={e => setProductoEditado({...productoEditado, precio: parseFloat(e.target.value)})} /></td>
                  <td><input type="number" className="form-control form-control-sm" value={productoEditado.stockMinimo} onChange={e => setProductoEditado({...productoEditado, stockMinimo: parseInt(e.target.value)})} /></td>
                  <td className="text-center">
                    <button className="btn btn-success btn-sm me-1" onClick={() => handleActualizar(prod.id)}>Guardar</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditandoId(null)}>X</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="fw-bold">{prod.sku}</td>
                  <td>{prod.nombre}</td>
                  <td><small>{prod.descripcion}</small></td>
                  <td>{prod.categoria}</td>
                  <td>${prod.precio}</td>
                  <td className="text-center"><span className="badge bg-secondary">{prod.stockMinimo}</span></td>
                  <td className="text-center">
                    <button className="btn btn-outline-warning btn-sm me-2" onClick={() => { setEditandoId(prod.id); setProductoEditado(prod); }}>Editar</button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleEliminar(prod.id)}>Borrar</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Productos;