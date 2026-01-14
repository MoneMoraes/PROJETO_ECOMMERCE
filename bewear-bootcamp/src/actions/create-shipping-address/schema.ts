import { z } from "zod";

export const createShippingAddressSchema = z.object({
  email: z.string().email("Email inválido."),
  fullName: z.string().trim().min(1, "Nome completo é obrigatório."),
  cpf: z
    .string()
    .min(14, "CPF inválido.")
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido."),
  phone: z
    .string()
    .min(15, "Celular inválido.")
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Celular inválido."),
  zipCode: z
    .string()
    .min(9, "CEP inválido.")
    .regex(/^\d{5}-\d{3}$/, "CEP inválido."),
  address: z.string().trim().min(1, "Endereço é obrigatório."),
  number: z.string().trim().min(1, "Número é obrigatório."),
  complement: z.string().trim().optional(),
  neighborhood: z.string().trim().min(1, "Bairro é obrigatório."),
  city: z.string().trim().min(1, "Cidade é obrigatória."),
  state: z.string().trim().min(1, "Estado é obrigatório."),
});

export type createShippingAddressSchema = z.infer<
  typeof createShippingAddressSchema
>;
