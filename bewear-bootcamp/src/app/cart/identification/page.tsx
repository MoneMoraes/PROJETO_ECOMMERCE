import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getCart } from "@/actions/get-cart";
import { Header } from "@/components/common/header";
import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import Addresses from "./components/addresses";

const IdentificationPage = async () => {
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

  return (
    <>
      <Header />
      <div className="px-5">
        <Addresses shippingAddresses={shippingAddresses} initialCart={cart}/>
      </div>
    </>
  );
};

export default IdentificationPage;
