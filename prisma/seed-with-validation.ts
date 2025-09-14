import { PrismaClient, Prisma } from "../generated/prisma/index.js";
import { z } from "zod";

const ProductSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().max(100),
  description: z.string().max(1000),
  price: z
    .instanceof(Prisma.Decimal)
    .refine((p) => p.gte("0.01") && p.lt("1000000.00")),
}) satisfies z.Schema<Prisma.ProductUncheckedCreateInput>;

const prisma = new PrismaClient().$extends({
  query: {
    product: {
      create({ args, query }) {
        args.data = ProductSchema.parse(args.data);
        return query(args);
      },
    },
  },
});

async function main() {
  // Clean slate
  await prisma.product.deleteMany();

  // 1) Valid product (should pass)
  await prisma.product.create({
    data: {
      slug: "example-product",
      name: "Example Product",
      description: "A valid product",
      price: new Prisma.Decimal("10.95"),
    },
  });

  // 2) Invalid because slug too short (min 3)
  try {
    await prisma.product.create({
      data: {
        slug: "x",
        name: "Short Slug",
        description: "Should fail (slug too short)",
        price: new Prisma.Decimal("12.00"),
      },
    });
  } catch (e: any) {
    console.log("Expected error (short slug):", e?.cause?.issues ?? e.message);
  }

  // 3) Invalid because price too low (< 0.01)
  try {
    await prisma.product.create({
      data: {
        slug: "another-example",
        name: "Bad Price",
        description: "Should fail (price too low)",
        price: new Prisma.Decimal("-1.00"),
      },
    });
  } catch (e: any) {
    console.log("Expected error (bad price):", e?.cause?.issues ?? e.message);
  }
}

main().finally(async () => prisma.$disconnect());
