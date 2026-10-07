import { getBanks, getCategories, getProducts } from "@/lib/api";
import DegerlendirExplorer from "@/components/DegerlendirExplorer";

export default async function DegerlendirPage() {
  const [categories, products, banks] = await Promise.all([
    getCategories(),
    getProducts({}),
    getBanks(),
  ]);

  return (
    <DegerlendirExplorer
      categories={categories ?? []}
      initialProducts={products ?? []}
      banks={banks ?? []}
    />
  );
}
