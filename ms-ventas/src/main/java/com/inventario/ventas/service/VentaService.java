package com.inventario.ventas.service;

import com.inventario.ventas.client.InventarioClient;
import com.inventario.ventas.client.StockDTO;
import com.inventario.ventas.model.Venta;
import com.inventario.ventas.repository.VentaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VentaService {
    private final VentaRepository repository;
    private final InventarioClient inventarioClient;

    public VentaService(VentaRepository repository, InventarioClient inventarioClient) {
        this.repository = repository;
        this.inventarioClient = inventarioClient;
    }

    public List<Venta> listarVentas() {
        return repository.findAll();
    }

    public Venta crearVenta(Venta venta) {
        // 1. Intentar descontar stock primero (Si falla, lanza excepción y no guarda la venta)
        inventarioClient.reducirStock(new StockDTO(venta.getProductoId(), venta.getCantidad()));

        // 2. Si hay stock, guardamos la venta
        return repository.save(venta);
    }
}