import { PrismaClient, Prisma } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

async function main() {
  // 1) Valid product
  await prisma.product.create({
    data: {
      slug: "example-product",
      name: "Example Product",
      description: "A valid product",
      price: new Prisma.Decimal("10.95"),
    },
  });

  // 2) Intentionally short slug to fail later when we add Zod
  await prisma.product.create({
    data: {
      slug: "x",
      name: "Short Slug",
      description: "This will fail once Zod is added (min length)",
      price: new Prisma.Decimal("12.00"),
    },
  });

  // 3) Intentionally invalid price to fail later when we add Zod
  await prisma.product.create({
    data: {
      slug: "another-example",
      name: "Bad Price",
      description: "This will fail once Zod is added (min price)",
      price: new Prisma.Decimal("-1.00"),
    },
  });
}

main().finally(async () => prisma.$disconnect());
