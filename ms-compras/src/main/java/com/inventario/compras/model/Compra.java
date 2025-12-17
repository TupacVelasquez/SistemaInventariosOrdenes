package com.inventario.compras.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;


@Entity
@Table(name = "compras")
public class Compra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long productoId; // ID del producto comprado

    @Column(nullable = false)
    private Integer cantidad;

    @Column(nullable = false)
    private LocalDateTime fechaCompra;

    private String proveedor;

    // Constructores, Getters y Setters manuales
    public Compra() {}
    public Compra(Long productoId, Integer cantidad, LocalDateTime fechaCompra, String proveedor) {
        this.productoId = productoId;
        this.cantidad = cantidad;
        this.fechaCompra = fechaCompra;
        this.proveedor = proveedor;
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProductoId() { return productoId; }
    public void setProductoId(Long productoId) { this.productoId = productoId; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    public LocalDateTime getFechaCompra() { return fechaCompra; }
    public void setFechaCompra(LocalDateTime fechaCompra) { this.fechaCompra = fechaCompra; }
    public String getProveedor() { return proveedor; }
    public void setProveedor(String proveedor) { this.proveedor = proveedor; }

}