# Usa una imagen base de Node.js con soporte para Alpine Linux
FROM node:16-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos del proyecto al directorio de trabajo
COPY . .

# Construye la aplicación
RUN npm run build

# Expone el puerto que usa la aplicación (por defecto, 3000)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]