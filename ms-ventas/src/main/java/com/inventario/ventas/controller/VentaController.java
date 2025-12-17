package com.inventario.ventas.controller;

import com.inventario.ventas.model.Venta;
import com.inventario.ventas.service.VentaService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    private final VentaService service;

    public VentaController(VentaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Venta> listar() {
        return service.listarVentas();
    }

    @PostMapping
    public Venta crear(@RequestBody Venta venta) {
        return service.crearVenta(venta);
    }
}