# Użyj oficjalnego Nginx
FROM nginx:alpine

# Usuń domyślną konfigurację
RUN rm /etc/nginx/conf.d/default.conf

# Skopiuj własny plik konfiguracyjny
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Skopiuj zbudowany frontend (np. z Reacta)
COPY frontend/build /usr/share/nginx/html
