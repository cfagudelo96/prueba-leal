# Prueba Leal

Desarrollado con NestJS. Para usar la aplicación, primero instalar las dependencias corriendo el comando
`npm install`. Paso seguido deben correrse las migraciones de la base de datos SQLite con el comando `npm run db:migrate`.
Posteriormente, debe ejecutarse la aplicación con el comando `npm run start`.

## Endpoints

| Requirement                | Operation | URL                                     |
| -------------------------- | --------- | --------------------------------------- |
| Register a new user        | POST      | /users                                  |
| Log in as user             | POST      | /users/log-in                           |
| Get user's points          | GET       | /users/:userId/points                   |
| Get user's transactions    | GET       | /users/:userId/transactions             |
| Export user's transactions | GET       | /users/:userId/transactions-file        |
| Register new transaction   |  POST     | /transactions                           |
| Inactivate transaction     | PUT       | /transactions/:transactionId/inactivate |
