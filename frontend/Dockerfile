# --- Etapa 1: Construcción (Build) ---
FROM node:20-alpine as build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# --- Etapa 2: Servidor Web (Nginx) ---
FROM nginx:alpine
# Copiamos los archivos construidos (dist) a la carpeta de Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Copiamos una configuración básica de Nginx (la crearemos en el siguiente paso)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]