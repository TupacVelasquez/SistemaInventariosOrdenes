package com.inventario.inventario.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        // Creamos un JSON limpio: { "message": "Stock insuficiente..." }
        Map<String, String> response = new HashMap<>();
        response.put("message", ex.getMessage());

        // Devolvemos HTTP 400 (Bad Request) en lugar de 500
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}