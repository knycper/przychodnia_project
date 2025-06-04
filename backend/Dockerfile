FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

# zrodla beda montowane jako volume
CMD ["npx", "nodemon"]
