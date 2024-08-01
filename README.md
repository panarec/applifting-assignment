## Description

Demo NestJS blog application.

## Features

- NestJS
- WebSockets w/ Socket.IO
- Docker (Docker-compose)
- GraphQL w/ playground
- Prisma for database modelling, migration and type-safe access (Postgres)
- JWT authentication w/ @nestjs/jwt
- REST API docs w/ Swagger
- Test w/ Jest


## Installation

```bash
$ npm install
```

## Database 

### Setup
Setup a development PostgreSQL with Docker. Copy .env.example and rename to .env - cp .env.example .env - which sets the required environments for PostgreSQL such as POSTGRES_USER, POSTGRES_PASSWORD and POSTGRES_DB. Update the variables as you wish and select a strong password.

Start the PostgreSQL database

```bash
docker compose -f docker-compose.db.yml up -d
```
### Migrate
Prisma Migrate is used to manage the schema and migration of the database. Prisma datasource requires an environment variable DATABASE_URL for the connection to the PostgreSQL database. Prisma reads the DATABASE_URL from the root .env file.

```base
# development
$ npx prisma migrate dev
# production
$ npx prisma migrate deploy
```

### Seed
To populate a database with initial data, execute the script with this command:

```base
$ npm run seed
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running the app in Docker
You can also setup a the database and Nest application with the docker compose

```bash
# building new NestJS docker image
docker-compose build

# start docker-compose
docker-compose up -d
```

After setup, don't forget to run database migration command. This will also automatically seed your DB with initial data.

```bash
#Inside container /app folder
$ npx prisma migrate deploy
```

## GraphQL playground

GraphQL Playground for the NestJS Server is available here: http://localhost:3000/graphql

Some queries and mutations are secured by an auth guard. You have to acquire a JWT token from `login`. Add the accessToken followed to HTTP HEADERS in the playground and replace **YOURTOKEN** here:

{
  "Authorization": "Bearer YOURTOKEN"
}

## REST API
RESTful API documentation available with Swagger.
http://localhost:3000/api

## Test

```bash
# unit tests
$ npm run test
```

