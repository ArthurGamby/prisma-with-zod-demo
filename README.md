# Prisma + Zod - Demo

This is a simple demo showing how to combine **Prisma** with **Zod** 
We use Prisma to manage a Postgres database and Zod to validate and format user input before saving it.

Youtube Demo video --> XXXXXXXX

## Features
- Prisma for database access
- Zod for schema validation
- Example `Product` model with validation rules

## Getting Started

### 1. Install dependencies
```bash
npm install
````

### 2. Set up Prisma

Initialize Prisma and configure your database:

```bash
npx prisma init --db
```

### 3. Define the Product model

In `prisma/schema.prisma`:

```prisma
model Product {
  id          String  @id @default(cuid())
  slug        String
  name        String
  description String
  price       Decimal
}
```

Run the migration:

```bash
npx prisma migrate dev --name init
```

## Resources

* [Prisma Documentation](https://www.prisma.io/docs)
* [Zod Documentation](https://zod.dev)


