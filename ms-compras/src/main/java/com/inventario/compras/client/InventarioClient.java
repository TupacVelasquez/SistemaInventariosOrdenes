package com.inventario.compras.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "ms-inventario", url = "${servicio.inventario.url}")
public interface InventarioClient {

    @PostMapping("/agregar")
    void agregarStock(@RequestBody StockDTO stockDTO);
}