import ShopPage from "../../../src/ShopPages.jsx";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { title: `${slug.replaceAll("-", " ")} — Mitra Shop` };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  return <ShopPage type="category" slug={slug} />;
}
