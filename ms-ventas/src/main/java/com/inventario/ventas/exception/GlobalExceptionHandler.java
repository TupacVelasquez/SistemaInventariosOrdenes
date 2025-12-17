package com.inventario.ventas.exception;

import com.fasterxml.jackson.databind.ObjectMapper;
import feign.FeignException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(FeignException.class)
    public ResponseEntity<Map<String, String>> handleFeignException(FeignException ex) {
        Map<String, String> response = new HashMap<>();

        try {
            // Jackson convierte el String JSON a un Mapa de Java
            String jsonBody = ex.contentUTF8();
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> map = mapper.readValue(jsonBody, Map.class);

            response.put("message", (String) map.get("message"));
        } catch (Exception e) {
            response.put("message", "Error al procesar la venta. Verifique el stock.");
        }

        return ResponseEntity.status(ex.status()).body(response);
    }
}