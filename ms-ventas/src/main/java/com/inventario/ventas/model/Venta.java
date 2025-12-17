package com.inventario.ventas.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ventas")
public class Venta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productoId;
    private Integer cantidad;
    private String cliente; // Nombre del cliente (por ahora texto simple)
    private LocalDateTime fechaVenta;

    @PrePersist
    public void prePersist() {
        this.fechaVenta = LocalDateTime.now();
    }

    // Getters, Setters y Constructor vacío (O usa Lombok @Data)
    public Venta() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProductoId() { return productoId; }
    public void setProductoId(Long productoId) { this.productoId = productoId; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    public String getCliente() { return cliente; }
    public void setCliente(String cliente) { this.cliente = cliente; }
    public LocalDateTime getFechaVenta() { return fechaVenta; }
}