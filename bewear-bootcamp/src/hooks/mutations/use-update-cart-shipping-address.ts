import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCartShippingAddress } from "@/actions/update-cart-shipping-address";
import { updateCartShippingAddressSchema } from "@/actions/update-cart-shipping-address/schema";

import { getUseCartQueryKey } from "../queries/use-cart";

export const getUpdateCartShippingAddressMutationKey = () =>
  ["update-cart-shipping-address"] as const;

export const useUpdateCartShippingAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getUpdateCartShippingAddressMutationKey(),
    mutationFn: (data: updateCartShippingAddressSchema) =>
      updateCartShippingAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};

