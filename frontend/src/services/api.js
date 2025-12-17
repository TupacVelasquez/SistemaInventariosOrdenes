import axios from 'axios';

// URLs de los microservicios 
const PRODUCTOS_URL = 'http://localhost:8081/api/productos';
const PROVEEDORES_URL = 'http://localhost:8083/api/proveedores';
const INVENTARIO_URL = 'http://localhost:8084/api/inventario'; 
const COMPRAS_URL = 'http://localhost:8085/api/compras';
const VENTAS_URL = 'http://localhost:8086/api/ventas';

export const apiProductos = axios.create({ baseURL: PRODUCTOS_URL });
export const apiProveedores = axios.create({ baseURL: PROVEEDORES_URL });
export const apiInventario = axios.create({ baseURL: INVENTARIO_URL });
export const apiCompras = axios.create({ baseURL: COMPRAS_URL });
export const apiVentas = axios.create({ baseURL: VENTAS_URL });