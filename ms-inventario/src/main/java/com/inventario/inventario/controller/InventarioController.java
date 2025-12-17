package com.inventario.inventario.controller;

import com.inventario.inventario.model.Inventario;
import com.inventario.inventario.model.Movimiento; // <--- Importante
import com.inventario.inventario.service.InventarioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventario")
public class InventarioController {

    private final InventarioService inventarioService;

    public InventarioController(InventarioService inventarioService) {
        this.inventarioService = inventarioService;
    }

    // 1. Listar todo (Para la tabla general)
    @GetMapping
    public List<Inventario> listarTodo() {
        return inventarioService.listarTodo();
    }

    // 2. Obtener por ID
    @GetMapping("/{productoId}")
    public Inventario obtenerPorId(@PathVariable Long productoId) {
        return inventarioService.findByProductoId(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    // 3. Agregar Stock (Entrada)
    @PostMapping("/agregar")
    public Inventario agregarStock(@RequestBody StockDTO stockDTO) {
        return inventarioService.agregarStock(stockDTO.productoId(), stockDTO.cantidad());
    }

    // 4. Vender (Salida - llamado por ms-ventas)
    @PostMapping("/vender")
    public void venderProducto(@RequestBody StockDTO stockDTO) {
        inventarioService.venderProducto(stockDTO.productoId(), stockDTO.cantidad());
    }

    // --- 5. ESTE ES EL QUE TE FALTA (EL KARDEX) ---
    @GetMapping("/{productoId}/kardex")
    public List<Movimiento> verKardex(@PathVariable Long productoId) {
        // Aquí conectamos el endpoint con tu servicio que ya está listo
        return inventarioService.obtenerKardex(productoId);
    }
}

// DTO Auxiliar (si no lo tienes en otro archivo)
record StockDTO(Long productoId, Integer cantidad) {}