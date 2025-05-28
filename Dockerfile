FROM node:20-alpine
WORKDIR /app

# Копируем package.json, package-lock.json и prisma/schema.prisma
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
