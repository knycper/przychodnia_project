# Etap 1: Budowanie zależności
FROM node:18 AS deps

WORKDIR /app

COPY package*.json ./
RUN npm install

# Etap 2: Development
FROM node:18 AS dev

WORKDIR /app

# Skopiuj zależności z poprzedniego etapu
COPY --from=deps /app/node_modules ./node_modules

# Źródła będą montowane jako volume, więc nie kopiujemy ich tutaj
CMD ["npx", "nodemon"]
