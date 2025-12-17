package com.inventario.proveedores.service;

import com.inventario.proveedores.model.Proveedor;
import com.inventario.proveedores.repository.ProveedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProveedorService {

    @Autowired
    private ProveedorRepository repository;

    public List<Proveedor> findAll() {
        return repository.findAll();
    }

    public Optional<Proveedor> findById(Long id) {
        return repository.findById(id);
    }

    public boolean existsById(Long id) {
        return repository.existsById(id);
    }

    @Transactional
    public Proveedor save(Proveedor proveedor) {
        if (proveedor.getId() == null && repository.existsByRuc(proveedor.getRuc())) {
            throw new RuntimeException("El RUC ya existe");
        }
        return repository.save(proveedor);
    }

    @Transactional
    public Proveedor update(Long id, Proveedor proveedorData) {
        return repository.findById(id).map(proveedor -> {
            // Validar si el RUC que intenta poner ya pertenece a otro proveedor distinto
            if (!proveedor.getRuc().equals(proveedorData.getRuc()) &&
                    repository.existsByRuc(proveedorData.getRuc())) {
                throw new RuntimeException("El nuevo RUC ya está registrado por otro proveedor");
            }

            // Actualización basada exactamente en tu Model
            proveedor.setRazonSocial(proveedorData.getRazonSocial());
            proveedor.setRuc(proveedorData.getRuc());
            proveedor.setDireccion(proveedorData.getDireccion());
            proveedor.setTelefono(proveedorData.getTelefono());
            proveedor.setEmail(proveedorData.getEmail());

            return repository.save(proveedor);
        }).orElseThrow(() -> new RuntimeException("Proveedor no encontrado con id: " + id));
    }

    @Transactional
    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar: Proveedor no encontrado");
        }
        repository.deleteById(id);
    }
}