package com.inventario.inventario.model;

import jakarta.persistence.*;

@Entity
@Table(name = "inventarios")
public class Inventario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long productoId; // Referencia al ID del ms-productos (Desacoplamiento)

    @Column(nullable = false)
    private Integer cantidad;

    private String ubicacionBodega; // Ej: "Bodega Central", "Norte"

    // Constructores, Getters y Setters manuales
    public Inventario() {}

    public Inventario(Long productoId, Integer cantidad, String ubicacionBodega) {
        this.productoId = productoId;
        this.cantidad = cantidad;
        this.ubicacionBodega = ubicacionBodega;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProductoId() { return productoId; }
    public void setProductoId(Long productoId) { this.productoId = productoId; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    public String getUbicacionBodega() { return ubicacionBodega; }
    public void setUbicacionBodega(String ubicacionBodega) { this.ubicacionBodega = ubicacionBodega; }
}