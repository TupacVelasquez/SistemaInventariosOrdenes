package com.inventario.inventario.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimientos")
public class Movimiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productoId;
    private Integer cantidad; // Cuánto se movió (ej: 5)
    private String tipo;      // "ENTRADA_COMPRA", "SALIDA_VENTA", "AJUSTE"
    private LocalDateTime fecha;

    @PrePersist
    public void prePersist() {
        this.fecha = LocalDateTime.now();
    }

    // Constructor helper
    public Movimiento(Long productoId, Integer cantidad, String tipo) {
        this.productoId = productoId;
        this.cantidad = cantidad;
        this.tipo = tipo;
    }

    public Movimiento() {}


    public Long getId() { return id; }
    public Long getProductoId() { return productoId; }
    public Integer getCantidad() { return cantidad; }
    public String getTipo() { return tipo; }
    public LocalDateTime getFecha() { return fecha; }
}