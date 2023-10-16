## Тестовое задание
### Развертывание

#### updates-service
```
yarn install
.env > DATABASE="postgresql://user:password@host:5432/db"
yarn start
```
Сервис работает на порту **3001**. Использует Express, zod и pg.

*POST: /updates/create*
```
type: created | updated | deleted
date: Date
target: number
ip: IPv4 string
data?: object
```
*GET: /updates/list* - список действий, query: **page, limit, id**

#### users-service
```
yarn install
yarn run prepare
.env > DATABASE_URL="postgresql://user:password@host:5432/db"; UPDATES_SERVER_HOST="http://hostname:3001"
yarn start
```
Сервис работает на порту 3000. Использует Nest.js (Express), Prisma, zod, axios

*GET: /users/create/:name/:email/:?number* - создание нового пользователя, данные нового пользователя передаются в */updates/create* 
*GET: /users/delete/:id* - удаление существующего пользователя
*GET: /users* - возвращает список пользователей

*POST: /users/update/:id* - изменяет переданные в **body** поля указанному пользователю, отсылает запрос на */updates/create* в **data** передает **body** 
```
name?: string
joinDate?: Date
email?: string 
number?: string 
```
