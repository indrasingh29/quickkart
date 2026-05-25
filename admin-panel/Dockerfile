FROM node:24-alpine AS build
WORKDIR /app
COPY admin-panel/package*.json ./
RUN npm ci
COPY admin-panel .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx-spa.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
