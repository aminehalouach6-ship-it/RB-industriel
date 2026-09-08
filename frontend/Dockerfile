# Étape 1 : Compilation du Frontend React Vite
FROM node:22-alpine AS builder

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./
RUN npm install

# Copie du code source et build de production
COPY . .
RUN npm run build

# Étape 2 : Serveur Nginx ultra-léger pour distribuer le bundle
FROM nginx:alpine

# Copie du build compilé dans le dossier servi par Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copie de la configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Port exposé
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
