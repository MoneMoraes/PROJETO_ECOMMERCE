"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { cartTable, shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { updateCartShippingAddressSchema } from "./schema";

export const updateCartShippingAddress = async (
  data: updateCartShippingAddressSchema,
) => {
  updateCartShippingAddressSchema.parse(data);
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const shippingAddress = await db.query.shippingAddressTable.findFirst({
    where: (address, { eq, and }) =>
      and(
        eq(address.id, data.shippingAddressId),
        eq(address.userId, session.user.id),
      ),
  });

  if (!shippingAddress) {
    throw new Error("Shipping address not found");
  }

  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
  });

  if (!cart) {
    await db.insert(cartTable).values({
      userId: session.user.id,
      shippingAddressId: data.shippingAddressId,
    });
    return;
  }

  await db
    .update(cartTable)
    .set({
      shippingAddressId: data.shippingAddressId,
    })
    .where(eq(cartTable.id, cart.id));
};

