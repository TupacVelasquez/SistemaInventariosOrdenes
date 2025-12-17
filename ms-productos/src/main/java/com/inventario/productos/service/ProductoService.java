package com.inventario.productos.service;

import com.inventario.productos.model.Producto;
import com.inventario.productos.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository repository;

    public List<Producto> findAll() { return repository.findAll(); }

    public Optional<Producto> findById(Long id) { return repository.findById(id); }

    public Producto save(Producto producto) {
        // Validación simple: SKU único al crear
        if (producto.getId() == null && repository.existsBySku(producto.getSku())) {
            throw new RuntimeException("El SKU ya existe");
        }
        return repository.save(producto);
    }

    public void deleteById(Long id) { repository.deleteById(id); }
}