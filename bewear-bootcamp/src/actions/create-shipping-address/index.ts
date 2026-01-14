"use server";

import { headers } from "next/headers";

import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { createShippingAddressSchema } from "./schema";

export const createShippingAddress = async (
  data: createShippingAddressSchema,
) => {
  createShippingAddressSchema.parse(data);
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await db.insert(shippingAddressTable).values({
    userId: session.user.id,
    recipientName: data.fullName,
    street: data.address,
    number: data.number,
    complement: data.complement || null,
    city: data.city,
    state: data.state,
    neighborhood: data.neighborhood,
    country: "Brasil",
    phone: data.phone,
    email: data.email,
    cpfOrCnpj: data.cpf,
  });
};
