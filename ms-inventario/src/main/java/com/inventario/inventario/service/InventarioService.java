package com.inventario.inventario.service;

import com.inventario.inventario.model.Inventario;
import com.inventario.inventario.model.Movimiento; // Importante
import com.inventario.inventario.repository.InventarioRepository;
import com.inventario.inventario.repository.MovimientoRepository; // Importante
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class InventarioService {

    // Usamos 'final' para inyección segura por constructor
    private final InventarioRepository inventarioRepository;
    private final MovimientoRepository movimientoRepository;

    // Un solo constructor para inyectar ambos repositorios
    public InventarioService(InventarioRepository inventarioRepository, MovimientoRepository movimientoRepository) {
        this.inventarioRepository = inventarioRepository;
        this.movimientoRepository = movimientoRepository;
    }

    public Optional<Inventario> findByProductoId(Long productoId) {
        return inventarioRepository.findByProductoId(productoId);
    }

    public List<Inventario> listarTodo() {
        return inventarioRepository.findAll();
    }

    // --- NUEVO: OBTENER EL KARDEX ---
    public List<Movimiento> obtenerKardex(Long productoId) {
        return movimientoRepository.findByProductoIdOrderByFechaDesc(productoId);
    }

    // --- COMPRAS (Suma Stock + Registro Kardex) ---
    @Transactional
    public Inventario agregarStock(Long productoId, Integer cantidad) {
        Inventario inventario = inventarioRepository.findByProductoId(productoId)
                .orElse(new Inventario(productoId, 0, "Bodega Central"));

        // 1. Actualizamos el saldo
        inventario.setCantidad(inventario.getCantidad() + cantidad);
        Inventario guardado = inventarioRepository.save(inventario);

        // 2. REGISTRAMOS EL MOVIMIENTO (KARDEX)
        Movimiento movimiento = new Movimiento(productoId, cantidad, "ENTRADA_COMPRA");
        movimientoRepository.save(movimiento);

        return guardado;
    }

    // --- VENTAS (Resta Stock + Registro Kardex) ---
    @Transactional
    public void venderProducto(Long productoId, Integer cantidad) {
        // 1. Buscamos
        Inventario inventario = inventarioRepository.findByProductoId(productoId)
                .orElseThrow(() -> new RuntimeException("El producto no tiene stock inicializado en inventario"));

        // 2. Validamos
        if (inventario.getCantidad() < cantidad) {
            throw new RuntimeException("Stock insuficiente. Disponible: " + inventario.getCantidad() + ", Solicitado: " + cantidad);
        }

        // 3. Restamos y guardamos saldo
        inventario.setCantidad(inventario.getCantidad() - cantidad);
        inventarioRepository.save(inventario);

        // 4. REGISTRAMOS EL MOVIMIENTO (KARDEX)
        Movimiento movimiento = new Movimiento(productoId, cantidad, "SALIDA_VENTA");
        movimientoRepository.save(movimiento);
    }
}