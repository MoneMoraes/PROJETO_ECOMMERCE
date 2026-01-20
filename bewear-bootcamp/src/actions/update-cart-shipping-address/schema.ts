import { z } from "zod";

export const updateCartShippingAddressSchema = z.object({
  shippingAddressId: z.string().uuid("ID do endereço inválido."),
});

export type updateCartShippingAddressSchema = z.infer<
  typeof updateCartShippingAddressSchema
>;
