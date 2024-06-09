# Honojs-D1-Prisma Example Project

This repository contains an example project demonstrating the integration of [Honojs](https://hono.dev/), [D1 Database from Cloudflare](https://developers.cloudflare.com/d1/), and [Prisma](https://www.prisma.io/). The project includes the implementation of JWT authentication, Zod validation, and middleware.

## Table of Contents

- [Getting Started](#getting-started)
- [Endpoints](#endpoints)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

Follow these simple steps to get a local copy of the project up and running.

### Installation

Clone the repository:

```bash
git clone https://github.com/arryanggaputra/hono-d1-prisma-cloudflare-worker.git
cd hono-d1-prisma-cloudflare-worker
```

Install the dependencies:

```bash
npm install
# or
yarn install

```

### Create D1 Database

Create a D1 database using `wrangler`:

```
npx wrangler d1 create your_database_name
```

The result from the command line will be:

```bash
 ⛅️ wrangler 3.59.0 (update available 3.60.0)
-------------------------------------------------------
✅ Successfully created DB 'your_database_name' in region APAC
Created your new D1 database.

[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "your_database_name"
database_id = "f9bff70a-067b-4ad3-87d2-xxx"

```

Setup the environment variables. Modify `wrangler.toml` file in the root directory and change the following:

```
[vars]
JWT_SECRET = "my-variable"

[[d1_databases]]
binding = "DB"
database_name = "your_database_name"
database_id = "f9bff70a-067b-4ad3-87d2-xxx"
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
