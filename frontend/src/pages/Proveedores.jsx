import { useState, useEffect } from 'react';
import { apiProveedores } from '../services/api';

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [nuevoProv, setNuevoProv] = useState({ 
    razonSocial: '', 
    ruc: '', 
    direccion: '',
    telefono: '', 
    email: '' 
  });

  const [editandoId, setEditandoId] = useState(null);
  const [provEditado, setProvEditado] = useState({});

  useEffect(() => {
    recargarTabla();
  }, []);

  const recargarTabla = async () => {
    try {
      const response = await apiProveedores.get(''); 
      setProveedores(response.data);
    } catch (error) {
      console.error("Error cargando proveedores:", error);
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      await apiProveedores.post('', nuevoProv);
      setNuevoProv({ razonSocial: '', ruc: '', direccion: '', telefono: '', email: '' });
      recargarTabla();
      alert('Proveedor registrado exitosamente');
    } catch (error) {
      alert('Error al guardar: ' + (error.response?.data || error.message));
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm(`¿Está seguro de eliminar el proveedor con ID: ${id}?`)) {
      try {
        await apiProveedores.delete(`/${id}`);
        alert('Proveedor eliminado');
        recargarTabla();
      } catch (error) {
        alert('Error al eliminar: ' + error.message);
      }
    }
  };

  const handleActualizar = async (id) => {
    try {
      await apiProveedores.put(`/${id}`, provEditado);
      setEditandoId(null);
      recargarTabla();
      alert('Cambios guardados correctamente');
    } catch (error) {
      alert('Error al actualizar: ' + (error.response?.data || error.message));
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary">Directorio de Proveedores</h2>
      
      {/* Formulario de Registro */}
      <div className="card p-3 mb-4 shadow-sm border-0 bg-light">
        <h5 className="mb-3">Nuevo Proveedor</h5>
        <form onSubmit={handleGuardar}>
          <div className="row g-2">
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Razón Social" required
                value={nuevoProv.razonSocial} onChange={e => setNuevoProv({...nuevoProv, razonSocial: e.target.value})} />
            </div>
            <div className="col-md-2">
              <input type="text" className="form-control" placeholder="RUC" required
                value={nuevoProv.ruc} onChange={e => setNuevoProv({...nuevoProv, ruc: e.target.value})} />
            </div>
            <div className="col-md-2">
              <input type="email" className="form-control" placeholder="Email"
                value={nuevoProv.email} onChange={e => setNuevoProv({...nuevoProv, email: e.target.value})} />
            </div>
            <div className="col-md-2">
              <input type="text" className="form-control" placeholder="Teléfono" 
                value={nuevoProv.telefono} onChange={e => setNuevoProv({...nuevoProv, telefono: e.target.value})} />
            </div>
            <div className="col-md-2">
                <input type="text" className="form-control" placeholder="Dirección" 
                value={nuevoProv.direccion} onChange={e => setNuevoProv({...nuevoProv, direccion: e.target.value})} />
            </div>
            <div className="col-md-1">
              <button type="submit" className="btn btn-success w-100">Add</button>
            </div>
          </div>
        </form>
      </div>

      {/* Tabla INCLUYENDO ID */}
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle bg-white">
            <thead className="table-dark text-center">
              <tr>
                  <th style={{width: '50px'}}>ID</th>
                  <th>Razón Social</th>
                  <th>RUC</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Dirección</th>
                  <th style={{width: '180px'}}>Acciones</th>
              </tr>
            </thead>
            <tbody>
            {proveedores.map(prov => (
                <tr key={prov.id}>
                  {editandoId === prov.id ? (
                    <>
                      <td className="text-center fw-bold text-muted">{prov.id}</td>
                      <td><input type="text" className="form-control form-control-sm" value={provEditado.razonSocial} 
                        onChange={e => setProvEditado({...provEditado, razonSocial: e.target.value})} /></td>
                      <td><input type="text" className="form-control form-control-sm" value={provEditado.ruc} 
                        onChange={e => setProvEditado({...provEditado, ruc: e.target.value})} /></td>
                      <td><input type="email" className="form-control form-control-sm" value={provEditado.email} 
                        onChange={e => setProvEditado({...provEditado, email: e.target.value})} /></td>
                      <td><input type="text" className="form-control form-control-sm" value={provEditado.telefono} 
                        onChange={e => setProvEditado({...provEditado, telefono: e.target.value})} /></td>
                      <td><input type="text" className="form-control form-control-sm" value={provEditado.direccion} 
                        onChange={e => setProvEditado({...provEditado, direccion: e.target.value})} /></td>
                      <td className="text-center">
                        <button className="btn btn-primary btn-sm me-1" onClick={() => handleActualizar(prov.id)}>Save</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setEditandoId(null)}>X</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="text-center text-muted small">{prov.id}</td>
                      <td className="fw-bold">{prov.razonSocial}</td>
                      <td className="text-center"><span className="badge bg-secondary">{prov.ruc}</span></td>
                      <td>{prov.email}</td>
                      <td>{prov.telefono}</td>
                      <td><small className="text-muted">{prov.direccion}</small></td>
                      <td className="text-center">
                        <button className="btn btn-outline-warning btn-sm me-2" onClick={() => { setEditandoId(prov.id); setProvEditado(prov); }}>Editar</button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleEliminar(prov.id)}>Borrar</button>
                      </td>
                    </>
                  )}
                </tr>
            ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default Proveedores;