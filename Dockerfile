FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

# Открываем порт
EXPOSE 3000

CMD ["npm", "run", "start:prod"]
