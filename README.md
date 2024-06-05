```
npm install
npm run dev
```

```
npm run deploy
```

## Create wrangler migration

```bash
npx wrangler d1 migrations create get-focus-db create_user_table --remote
```

You can now generate the required SQL statement for creating a User table that can be mapped to the User model in your the Prisma schema as follows:

```bash
npx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/0001_create_user_table.sql
```

apply migration

```bash
npx wrangler d1 migrations apply get-focus-db --remote
```
