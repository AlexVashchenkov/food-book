# 🍲 FoodBook

Простое веб-приложение для просмотра и выбора блюд.

## 📦 Стек технологий

- **Backend**: NestJS (TypeScript)
- **Frontend**: HTML + CSS + JavaScript
- **База данных**: PostgreSQL (через Prisma ORM)
- **Хранение файлов**: Yandex Object Storage (через AWS SDK)

## ⚙️ Запуск проекта

1. Клонируйте репозиторий:

   ```bash
   git clone https://github.com/AlexVashchenkov/food-book.git
   cd food-book
   ```

2. Установите зависимости:

   ```bash
   npm install
   ```

3. Настройте переменные окружения:
   * Создайте .env файл на основе .env.example и укажите ключи доступа.

4. Примените миграции:

   ```bash
   npx prisma migrate dev
   ```
5. Запустите приложение:

   ```bash
   npm run start:dev
   ```

6. Откройте браузер и перейдите по адресу: [http://localhost:PORT](http://localhost:PORT)

Если хотите использовать Docker:
   * Соберите и запустите контейнеры:

      ```bash
      docker-compose up --build
      ```