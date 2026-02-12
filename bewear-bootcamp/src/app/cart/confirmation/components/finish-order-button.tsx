"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { createCheckoutSession } from "@/actions/create-checkout-session";
import { finishOrder } from "@/actions/finish-order";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useFinishOrder } from "@/hooks/mutations/use-finish-order";

const FinishOrderButton = () => {
    const [successDialogIsOpen, setSuccessDialogIsOpen] = useState(false);
    const finishOrderMutation = useFinishOrder();
    const handleFinishOrder = async () => {
        if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY){
            throw new Error("Stripe publishable key is not set");
        }
        const { orderId } = await finishOrderMutation.mutateAsync();
        const checkouSession = await createCheckoutSession({
            orderId,
        });
        const stripe = await loadStripe(
            process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
        );
        if (!stripe) {
            throw new Error("Failed to load Stripe");
        }
        await stripe.redirectToCheckout({
            sessionId: checkouSession.id,
        });
        setSuccessDialogIsOpen(true);
    }
    return (
        <>
            <Button 
                className="w-full rounded-full" 
                size="lg" 
                onClick={handleFinishOrder}
                disabled={finishOrderMutation.isPending}
            >
                {finishOrderMutation.isPending && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Finalizar Compra
            </Button>
            <Dialog open={successDialogIsOpen} onOpenChange={setSuccessDialogIsOpen}>
                <DialogContent className="text-center">
                    <Image 
                        src="/illustration.svg"
                        alt="Success"
                        width={300}
                        height={300}
                        className="mx-auto"
                    />
                    <DialogTitle className="text-2xl mt-4">Pedido efetuado!</DialogTitle>
                    <DialogDescription className="font-medium">
                        Seu pedido foi efetuado com sucesso. Você pode acompanhar o status
                        na seção de “Meus Pedidos”.
                    </DialogDescription>

                    <DialogFooter>
                        <Button className="rounded-full" size="lg">
                            Ver meus pedidos
                        </Button>
                        <Button 
                            className="rounded-full" 
                            variant="outline"
                            size="lg"
                            asChild 
                        >
                            <Link href="/">Voltar para a loja</Link>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default FinishOrderButton