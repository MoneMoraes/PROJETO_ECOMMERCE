import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getCart } from "@/actions/get-cart";
import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import CartSummary from "../components/cart-summary";
import { formatAddress } from "../helpers/address";

const ConfirmationPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
      });
    
      if (!session?.user.id) {
        redirect("/");
      }
    
      const cart = await getCart();
      if (!cart || cart?.items.length === 0) {
        redirect("/");
      }
      const shippingAddresses = await db.query.shippingAddressTable.findMany({
        where: eq(shippingAddressTable.userId, session.user.id),
      });
    
      const cartTotalInCents = cart.items.reduce(
        (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
        0,
      );
      if(!cart.shippingAddress) {
        redirect("/cart/identidication");
      }

    return (
        <div>
            <Header />

            <div className="space-y-4 px-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Identificação</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Card>
                            <CardContent >
                                <p className="text-sm">{formatAddress(cart.shippingAddress)}</p>
                            </CardContent>
                        </Card>
                        <Button className="w-full rounded-full" size="lg">Finalizar Compra</Button>
                    </CardContent>
                </Card>
                <CartSummary 
                    subtotalInCents={cartTotalInCents}
                    totalInCents={cartTotalInCents}
                    products={cart.items.map((item) => ({
                        id: item.productVariant.id,
                        name: item.productVariant.product.name,
                        variantName: item.productVariant.name,
                        quantity: item.quantity,
                        priceInCents: item.productVariant.priceInCents,
                        imageUrl: item.productVariant.imageUrl,
                    }))}  
                        />
            </div>
            <div className="mt-12">
                <Footer />
            </div>
        </div>
    );
};

export default ConfirmationPage;