
# Stage 1: Build Angular App
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./


RUN npm ci


COPY . .


RUN npm run build -- --configuration production


FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

# COPY --from=builder /app/dist/revplay/browser /usr/share/nginx/html 
COPY --from=builder /app/dist/revplay-frontend/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]