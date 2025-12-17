import { useState, useEffect } from 'react';
import { apiProductos, apiInventario } from '../services/api';
import { Link } from 'react-router-dom';

const Inicio = () => {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calcularAlertas = async () => {
      try {
        // 1. Cargamos TODO en paralelo
        const [resProd, resInv] = await Promise.all([
          apiProductos.get(''),
          apiInventario.get('') // Asegúrate de que tu backend tenga un endpoint para listar todo el inventario
          // NOTA: Si ms-inventario no tiene un "listar todo", el dashboard no funcionará bien.
          // Por ahora, asumiremos que sí o usaremos lógica de búsqueda individual si son pocos.
        ]);

        const productos = resProd.data;
        const inventario = resInv.data; // Array de { productoId, cantidad, ... }

        // 2. Cruzamos la información
        const productosEnRiesgo = productos.map(prod => {
          // Buscamos cuánto hay en inventario de este producto
          const stockItem = inventario.find(inv => inv.productoId === prod.id);
          const cantidadActual = stockItem ? stockItem.cantidad : 0; // Si no está en inventario, es 0

          return {
            ...prod,
            cantidadActual
          };
        }).filter(item => item.cantidadActual <= item.stockMinimo); // 3. Filtramos los críticos

        setAlertas(productosEnRiesgo);
      } catch (error) {
        console.error("Error calculando dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    calcularAlertas();
  }, []);

  return (
    <div className="container mt-4">
      <div className="jumbotron p-5 mb-4 bg-light rounded-3 shadow-sm">
        <h1 className="display-5 fw-bold">Dashboard de Control</h1>
        <p className="col-md-8 fs-4">Bienvenido al sistema de gestión de inventario.</p>
      </div>

      <h3 className="mb-3 text-danger"> Alertas de Stock Bajo</h3>
      
      {loading ? (
        <p>Analizando inventario...</p>
      ) : alertas.length === 0 ? (
        <div className="alert alert-success">
          ¡Todo excelente! Todos los productos tienen stock suficiente. 
        </div>
      ) : (
        <div className="row">
          {alertas.map(item => (
            <div key={item.id} className="col-md-4 mb-3">
              <div className="card border-danger mb-3 shadow-sm">
                <div className="card-header bg-danger text-white fw-bold">
                  {item.sku}
                </div>
                <div className="card-body text-danger">
                  <h5 className="card-title">{item.nombre}</h5>
                  <p className="card-text">
                    Stock Actual: <span className="display-6 fw-bold">{item.cantidadActual}</span>
                    <br />
                    <small className="text-muted">Mínimo requerido: {item.stockMinimo}</small>
                  </p>
                  <Link to="/compras" className="btn btn-outline-danger btn-sm">
                    Reabastecer ahora
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Inicio;