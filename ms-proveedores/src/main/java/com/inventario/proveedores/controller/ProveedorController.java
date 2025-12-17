package com.inventario.proveedores.controller;

import com.inventario.proveedores.model.Proveedor;
import com.inventario.proveedores.service.ProveedorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/proveedores")
public class ProveedorController {

    private final ProveedorService service;

    // Inyección por constructor (Práctica recomendada)
    public ProveedorController(ProveedorService service) {
        this.service = service;
    }

    // 1. Listar todos los proveedores
    @GetMapping
    public List<Proveedor> listar() {
        return service.findAll();
    }

    // 2. Obtener un proveedor por ID (Manejo de 404)
    @GetMapping("/{id}")
    public ResponseEntity<Proveedor> obtenerPorId(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Crear proveedor (Retorna 201 Created)
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Proveedor proveedor) {
        try {
            Proveedor nuevo = service.save(proveedor);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
        } catch (RuntimeException e) {
            // Manejo de errores centralizado o badRequest según validación
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 4. Actualizar proveedor (PUT /api/proveedores/{id})
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Proveedor proveedor) {
        try {
            // Cambiamos 'service.save' por 'service.update'
            Proveedor actualizado = service.update(id, proveedor);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // 5. Eliminar proveedor (Retorna 204 No Content)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (service.existsById(id)) {
            service.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}