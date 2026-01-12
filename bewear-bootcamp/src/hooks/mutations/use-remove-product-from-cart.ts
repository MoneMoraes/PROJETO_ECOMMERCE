import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeProductFromCart } from "@/actions/remove-cart-product";

import { getUseCartQueryKey } from "../queries/use-cart";

export const getRemoveProductFromCArtMutationKey = (cartItemId: string) =>
  ["remove-cart-product", cartItemId] as const;

export const useRemoveProductFromCart = (cartItemId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getRemoveProductFromCArtMutationKey(cartItemId),
    mutationFn: () => removeProductFromCart({ cartItemId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};
