This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Dev DB setup

If you want to use postgres in anticipation of us using it sooner or later, you can modify 

- Create a mysql compatible database (e.g. MySQL, MariaDB)
  - MySQL Workbench (install mysql/server service) https://dev.mysql.com/downloads/workbench/
  - MySQL Server (update readme if works) https://dev.mysql.com/downloads/mysql/
	- Docker image: https://hub.docker.com/_/mysql
- Nothing more needed. Just update your file.

## Setup

Prisma does not read `env.local` automatically, you will need to install and use `dotenv` cli. E.g. `dotenv -e .env.local -- "npx prisma ..."`

- Install this package: `npm i`
- Ensure database server is running
- Generate prisma client if needed: `npx prisma generate`
- Migrate your database: `npx prisma migrate dev`
- Start the frontend server: `npm run dev`
- Browse to: `localhost:3000`

## Database Migrations

- Make changes to schema: `@/prisma/schema.prisma`
- Create migration: `npx prisma migrate dev`

## Inspect the database

Run `npx prisma studio`

- For info about remote DB connection, see remotedDb.md
