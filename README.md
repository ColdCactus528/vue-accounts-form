# Vue Accounts Form

Форма управления учётными записями (логин/пароль/метки), написанная на **Vue 3 + Pinia + Naive UI**.  
Поддерживает локальное хранение данных и валидацию полей. Есть автотесты на **Vitest** и возможность сборки Docker-образа.

🌐 Демо: [vue-accounts-form-xi.vercel.app](https://vue-accounts-form-xi.vercel.app/)

---

## 🚀 Запуск проекта локально

Убедитесь, что у вас установлен **Node.js 20+**.

```bash
git clone https://github.com/ColdCactus528/vue-accounts-form.git
cd vue-accounts-form

# Установка зависимостей
npm ci

# Запуск в режиме разработки
npm run dev

# Проверка типов
npm run type-check

# Сборка production-версии
npm run build

# Локальный предпросмотр собранного приложения
npm run preview
```

🧪 Тесты
Тесты написаны с помощью Vitest и @vue/test-utils.

```
# Запуск всех тестов
npm run test

# Watch-режим
npm run test:watch

# Отчёт по покрытию
npm run test:coverage
```

🐳 Docker

Проект можно собрать и запускать в контейнере. После этого приложение будет доступно по адресу:
👉 http://localhost:8080

```
docker build -t vue-accounts-form .
docker run -p 8080:80 vue-accounts-form
```
