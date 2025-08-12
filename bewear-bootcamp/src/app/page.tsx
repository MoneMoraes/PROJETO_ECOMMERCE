import Image from "next/image";

import CategorySelector from "@/components/common/category-selector";
import { Header } from "@/components/common/header";
import ProductList from "@/components/common/products-list";
import { Button } from "@/components/ui/button";
import { db } from "@/db";

const Home = async () => {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });

  const categories = await db.query.categoryTable.findMany({});

  return (
    <>
      <Header />

      <div className="space-y-6">
        <p className="px5">
          <Image
            src="/banner-01.png"
            alt="Leve uma vida com estilo"
            height={0}
            width={0}
            sizes="100vw"
            className="h-auto w-full"
          />
        </p>

        <ProductList products={products} title="Mais vendidos" />

        <div className="px5">
          <CategorySelector categories={categories} />
        </div>

        <p className="px5">
          <Image
            src="/banner-02.png"
            alt="Leve uma vida com estilo"
            height={0}
            width={0}
            sizes="100vw"
            className="h-auto w-full"
          />
        </p>
      </div>
    </>
  );
};

export default Home;
