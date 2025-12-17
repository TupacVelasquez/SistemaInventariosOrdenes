import { useState, useEffect } from 'react';
import { apiVentas, apiProductos } from '../services/api';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  
  // Estado del formulario
  const [nuevaVenta, setNuevaVenta] = useState({
    productoId: '',
    cantidad: 1,
    cliente: ''
  });

  // --- SOLUCIÓN: Definimos y ejecutamos la carga inicial DENTRO del useEffect ---
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const [resProd, resVentas] = await Promise.all([
          apiProductos.get(''),
          apiVentas.get('')
        ]);
        setProductos(resProd.data);
        setVentas(resVentas.data);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    cargarDatosIniciales();
  }, []); // Array vacío = Se ejecuta solo una vez al montar

  // --- Función auxiliar para recargar SOLO la tabla de ventas después de vender ---
  const recargarHistorial = async () => {
    try {
      const response = await apiVentas.get('');
      setVentas(response.data);
    } catch (error) {
      console.error("Error recargando historial:", error);
    }
  };

  const handleVender = async (e) => {
    e.preventDefault();
    if (!nuevaVenta.productoId || !nuevaVenta.cliente) {
      alert("Complete todos los campos");
      return;
    }

    try {
      await apiVentas.post('', nuevaVenta);
      
      alert('¡Venta registrada con éxito! Stock descontado.');
      
      setNuevaVenta({ productoId: '', cantidad: 1, cliente: '' });
      
      // Llamamos a la función auxiliar externa
      recargarHistorial(); 
      
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        // Intentamos obtener el mensaje de error del backend
        const msg = error.response.data.message || error.response.data;
        // Si es un objeto JSON, lo convertimos a string, si no, lo mostramos tal cual
        alert('Error: ' + (typeof msg === 'object' ? JSON.stringify(msg) : msg));
      } else {
        alert('Error de conexión con el servidor de ventas');
      }
    }
  };

  // Helper para mostrar nombre del producto
  const getNombreProducto = (id) => {
    const prod = productos.find(p => p.id === id);
    return prod ? prod.nombre : 'Desconocido';
  };

  return (
    <div className="container mt-4">
      <h2>Punto de Venta (Salida de Stock)</h2>
      
      {/* Formulario de Venta */}
      <div className="card p-4 mb-4 shadow-sm border-success">
        <h4 className="text-success">Registrar Venta</h4>
        <form onSubmit={handleVender}>
          <div className="row g-3">
            
            {/* Producto */}
            <div className="col-md-4">
              <label className="form-label">Producto</label>
              <select className="form-select" required
                value={nuevaVenta.productoId}
                onChange={e => setNuevaVenta({...nuevaVenta, productoId: parseInt(e.target.value)})}>
                <option value="">-- Seleccione --</option>
                {productos.map(p => (
                  <option key={p.id} value={p.id}>{p.sku} - {p.nombre}</option>
                ))}
              </select>
            </div>

            {/* Cliente */}
            <div className="col-md-4">
              <label className="form-label">Cliente</label>
              <input type="text" className="form-control" placeholder="Nombre del Cliente" required
                value={nuevaVenta.cliente}
                onChange={e => setNuevaVenta({...nuevaVenta, cliente: e.target.value})} />
            </div>

            {/* Cantidad */}
            <div className="col-md-2">
              <label className="form-label">Cantidad</label>
              <input type="number" className="form-control" min="1" required
                value={nuevaVenta.cantidad}
                onChange={e => setNuevaVenta({...nuevaVenta, cantidad: parseInt(e.target.value)})} />
            </div>

            {/* Botón */}
            <div className="col-md-2 d-flex align-items-end">
              <button type="submit" className="btn btn-success w-100">
                Confirmar Venta
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Historial */}
      <h3>Historial de Ventas</h3>
      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID Venta</th>
            <th>Producto</th>
            <th>Cliente</th>
            <th>Cantidad</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map(v => (
            <tr key={v.id}>
              <td>#{v.id}</td>
              <td>{getNombreProducto(v.productoId)}</td>
              <td>{v.cliente}</td>
              <td className="text-danger fw-bold">-{v.cantidad}</td>
              <td>{v.fechaVenta ? new Date(v.fechaVenta).toLocaleString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Ventas;