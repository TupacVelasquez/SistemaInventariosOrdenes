package com.inventario.compras.controller;

import com.inventario.compras.model.Compra;
import com.inventario.compras.service.CompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/compras")
public class CompraController {

    @Autowired
    private CompraService service;

    @GetMapping
    public List<Compra> listar() {
        return service.findAll();
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Compra compra) {
        try {
            return ResponseEntity.ok(service.registrarCompra(compra));
        } catch (Exception e) {
            // Manejo básico de error si falla la comunicación con inventario
            return ResponseEntity.internalServerError().body("Error al procesar compra: " + e.getMessage());
        }
    }
}