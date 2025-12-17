package com.inventario.compras.service;

import com.inventario.compras.client.InventarioClient;
import com.inventario.compras.client.StockDTO;
import com.inventario.compras.model.Compra;
import com.inventario.compras.repository.CompraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CompraService {

    @Autowired
    private CompraRepository repository;

    @Autowired
    private InventarioClient inventarioClient; // Inyectamos nuestro cliente Feign

    public List<Compra> findAll() { return repository.findAll(); }

    @Transactional
    public Compra registrarCompra(Compra compra) {
        compra.setFechaCompra(LocalDateTime.now());

        // 1. Guardar el registro de la compra (Historial)
        Compra nuevaCompra = repository.save(compra);

        // 2. Comunicarse con ms-inventario para sumar el stock
        // (Si esto falla, @Transactional hará rollback de la compra)
        inventarioClient.agregarStock(new StockDTO(compra.getProductoId(), compra.getCantidad()));

        return nuevaCompra;
    }
}