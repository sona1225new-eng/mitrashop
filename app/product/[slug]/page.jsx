import ShopPage from "../../../src/ShopPages.jsx";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { title: `${slug.replaceAll("-", " ")} — Mitra Shop` };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  return <ShopPage type="product" slug={slug} />;
}
