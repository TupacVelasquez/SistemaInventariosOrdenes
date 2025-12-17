# Imagen base ligera de Java 17
FROM eclipse-temurin:17-jdk-alpine

# Directorio de trabajo
WORKDIR /app

# Copiamos el JAR generado (El asterisco * ayuda si cambia la versión)
COPY target/*.jar app.jar

# Ejecutamos la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]