# Construire le frontend : npm ci utilise le package-lock.json du projet.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Servir les fichiers statiques ; Nginx écoute sur le port attendu par Render.
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/40-version.sh /docker-entrypoint.d/40-version.sh
RUN chmod +x /docker-entrypoint.d/40-version.sh

ARG APP_VERSION=local
ENV APP_VERSION=$APP_VERSION
EXPOSE 10000
CMD ["nginx", "-g", "daemon off;"]
