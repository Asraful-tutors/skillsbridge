This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Setup

- Install this package: `npm i`
- Generate prisma client if needed: `npx prisma generate`
- Create db file and/or update: `npx prisma migrate dev`
- Start the dev server: `npm run dev`
- Browse to: `localhost:3000`

## Database Migrations

- Make changes to schema: `@/prisma/schema.prisma`
- Create migration: `npx prisma migrate dev`

## Inspect the database

Just run `npx prisma studio`!
