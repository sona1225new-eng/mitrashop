"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer, Header, ProductCard as LandingProductCard } from "./LandingPageTwo.jsx";
import { products } from "./App.jsx";
import { useShopStore } from "./ShopStore.jsx";

const allProducts = Object.values(products).flat();
const imageUrl = (image, width = 900) => `https://images.unsplash.com/${image}?auto=format&fit=crop&w=${width}&q=85`;
const money = (amount) => `₹${amount.toLocaleString("en-IN")}`;

const categories = [
  { slug: "maker-kits", title: "Maker Kits", description: "Everything you need to bring your next hands-on project to life.", products: ["Maker kits"], image: "photo-1581091226825-a6a2a5aee158" },
  { slug: "boards-iot", title: "Boards & IoT", description: "Development boards and connected essentials for curious builders.", products: ["Boards & IoT"], image: "photo-1518770660439-4636190af475" },
  { slug: "components", title: "Components", description: "The small, dependable parts that make big ideas work.", products: ["Components"], image: "photo-1553406830-ef2513450d76" },
  { slug: "tools-lab", title: "Tools & Lab", description: "Thoughtful tools for a better-equipped workbench.", products: ["Tools & lab"], image: "photo-1581092334651-ddf26d9a09d0" },
];

const categoryAliases = {
  "development-boards": "boards-iot",
  "electronic-components": "components",
  sensors: "components",
  "robotics-iot": "maker-kits",
  "motors-actuators": "maker-kits",
  "drone-parts": "maker-kits",
  "diy-maker-kits": "maker-kits",
  "batteries-power-supply-and-accessories": "components",
  "3d-printers-and-parts": "tools-lab",
  "tools-equipment": "tools-lab",
  "mechanical-parts-measurement-workbench-tools": "tools-lab",
  "electronic-modules-and-displays": "boards-iot",
  "iot-and-wireless-modules": "boards-iot",
  "electric-vehicle-parts": "components",
};
const categoryTitles = {
  "development-boards": "Development Boards",
  "electronic-components": "Electronic Components",
  sensors: "Sensors",
  "robotics-iot": "Robotics & IoT",
  "motors-actuators": "Motors & Actuators",
  "drone-parts": "Drone Parts",
  "diy-maker-kits": "DIY & Maker Kits",
  "batteries-power-supply-and-accessories": "Batteries & Power",
  "3d-printers-and-parts": "3D Printers & Parts",
  "tools-equipment": "Tools & Equipment",
  "mechanical-parts-measurement-workbench-tools": "Mechanical Parts & Workbench Tools",
  "electronic-modules-and-displays": "Electronic Modules & Displays",
  "iot-and-wireless-modules": "IoT & Wireless Modules",
  "electric-vehicle-parts": "Electric Vehicle Parts",
};
const categoryImageByTitle = {
  "Development Boards": "photo-1518770660439-4636190af475",
  "Drone Parts": "photo-1485827404703-89b55fcc595e",
  "Batteries, Power Supply and Accessories": "photo-1625842268584-8f3296236761",
  "3D Printers and Parts": "photo-1581092160562-40aa08e78837",
  Sensors: "photo-1519389950473-47ba0277781c",
  "Electronic Components": "photo-1553406830-ef2513450d76",
  "Motors | Drivers | Pumps | Actuators": "photo-1581092334651-ddf26d9a09d0",
  "Electronic Modules and Displays": "photo-1597733336794-12d05021d510",
  "IoT and Wireless Modules": "photo-1558002038-1055907df827",
  "Mechanical Parts, Measurement & Workbench Tools": "photo-1581092160562-40aa08e78837",
  "DIY and Maker Kits": "photo-1581091226825-a6a2a5aee158",
  "Electric Vehicle Parts": "photo-1509391366360-2e959784a276",
};
const categoryProductIds = {
  sensors: ["sensor-pack", "smart-home-sensor", "weather-station"],
  "robotics-iot": ["robotics-kit", "sensor-pack", "smart-home-sensor"],
  "motors-actuators": ["robotics-kit"],
  "drone-parts": ["robotics-kit"],
  "batteries-power-supply-and-accessories": ["usb-hub", "smart-home-sensor"],
  "3d-printers-and-parts": ["precision-toolkit", "multimeter"],
  "tools-equipment": ["precision-toolkit", "multimeter", "wireless-keyboard"],
  "mechanical-parts-measurement-workbench-tools": ["precision-toolkit", "multimeter", "breadboard-set"],
  "electronic-modules-and-displays": ["raspberry-pi", "esp32-board", "usb-hub"],
  "iot-and-wireless-modules": ["esp32-board", "smart-home-sensor", "sensor-pack"],
  "electric-vehicle-parts": ["weather-station", "usb-hub"],
};
const productCategorySlugs = {
  "Boards & IoT": "boards-iot",
  "Maker kits": "maker-kits",
  Components: "components",
  "Tools & lab": "tools-lab",
};

function brandFor(product) {
  if (product.id.includes("arduino")) return "Arduino";
  if (product.id.includes("raspberry")) return "Raspberry Pi";
  if (product.id.includes("esp32")) return "Espressif";
  if (product.category === "Tools & lab") return "Mitra Essentials";
  if (product.category === "Maker kits") return "Mitra Maker";
  return "Mitra Tech";
}

function PageFrame({ children }) {
  return <div className="shop-page-frame"><Header /><main className="shop-main">{children}</main><Footer /></div>;
}

function Breadcrumbs({ items }) {
  return <nav className="shop-breadcrumbs" aria-label="Breadcrumb"><a href="/landing-page-two">Home</a>{items.map((item, index) => <span key={`${item.label}-${index}`}><i>/</i>{item.href ? <a href={item.href}>{item.label}</a> : <strong>{item.label}</strong>}</span>)}</nav>;
}

function EmptyState({ icon, title, text, action, href }) {
  return <section className="shop-empty"><span className="shop-empty__icon">{icon}</span><h2>{title}</h2><p>{text}</p><a className="shop-button shop-button--primary" href={href}>{action}</a></section>;
}

function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useShopStore();
  const saved = wishlist.some((item) => item.id === product.id);
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null;
  return (
    <article className="shop-product-card">
      <div className="shop-product-card__media">
        <a href={`/product/${product.id}`}><img src={imageUrl(product.image, 560)} alt={product.name} loading="lazy" /></a>
        {discount && <span className="shop-discount">{discount}% OFF</span>}
        <button className={`shop-heart${saved ? " is-saved" : ""}`} type="button" aria-label={`${saved ? "Remove" : "Add"} ${product.name} ${saved ? "from" : "to"} wishlist`} aria-pressed={saved} onClick={() => toggleWishlist(product)}>{saved ? "♥" : "♡"}</button>
      </div>
      <div className="shop-product-card__body">
        <span className="shop-product-category">{product.category}</span>
        <h3><a href={`/product/${product.id}`}>{product.name}</a></h3>
        <div className="shop-rating"><span>★★★★★</span><small>{product.rating} · {product.reviews} reviews</small></div>
        <div className="shop-card-buy"><div><strong>{money(product.price)}</strong>{product.oldPrice && <del>{money(product.oldPrice)}</del>}</div><button className="shop-button shop-button--small" type="button" onClick={() => addToCart(product)}>Add to Cart</button></div>
        <p className="shop-stock"><span /> In stock</p>
      </div>
    </article>
  );
}

function CartPage() {
  const { cart, setQuantity, removeFromCart, moveToWishlist, moveToCart, wishlist } = useShopStore();
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal - discount >= 1999 || subtotal === 0 ? 0 : 99;
  const total = subtotal - discount + shipping;
  const applyCoupon = (event) => {
    event.preventDefault();
    if (couponInput.trim().toUpperCase() === "MITRA10") {
      setCouponApplied(true);
      setCouponMessage("MITRA10 applied — 10% off your order.");
    } else {
      setCouponApplied(false);
      setCouponMessage("That code didn’t work. Try MITRA10.");
    }
  };

  return (
    <div className="shop-container">
      <Breadcrumbs items={[{ label: "Cart" }]} />
      <div className="shop-page-title"><div><p className="shop-eyebrow">YOUR NEXT BUILD STARTS HERE</p><h1>Your shopping cart <span>({cart.reduce((sum, item) => sum + item.quantity, 0)})</span></h1><p>Review your picks and get ready to make something remarkable.</p></div><a className="shop-text-link" href="/landing-page-two">← Continue shopping</a></div>
      {!cart.length ? <EmptyState icon="♡" title="Your cart is waiting for a good idea" text="Explore our maker-approved essentials and find just the right starting point." action="Shop now" href="/landing-page-two" /> : (
        <div className="shop-cart-layout">
          <section className="shop-cart-items" aria-label="Cart items">
            {cart.map(({ product, quantity }) => {
              const saved = wishlist.some((item) => item.id === product.id);
              return <article className="shop-cart-item" key={product.id}>
                <a className="shop-cart-item__image" href={`/product/${product.id}`}><img src={imageUrl(product.image, 360)} alt={product.name} /></a>
                <div className="shop-cart-item__info"><span className="shop-product-category">{product.category}</span><h2><a href={`/product/${product.id}`}>{product.name}</a></h2><p>Variant: Standard <span>·</span> <b className="shop-stock shop-stock--inline"><i /> In stock</b></p><div className="shop-cart-item__actions"><div className="shop-quantity"><button aria-label={`Decrease ${product.name} quantity`} disabled={quantity <= 1} onClick={() => setQuantity(product.id, quantity - 1)}>−</button><span>{quantity}</span><button aria-label={`Increase ${product.name} quantity`} onClick={() => setQuantity(product.id, quantity + 1)}>+</button></div><button className="shop-inline-action" onClick={() => moveToWishlist(product)}>{saved ? "♡ Saved for later" : "♡ Save for later"}</button><button className="shop-inline-action shop-inline-action--muted" onClick={() => removeFromCart(product.id)}>Remove</button></div></div>
                <strong className="shop-cart-item__price">{money(product.price * quantity)}</strong>
              </article>;
            })}
            <a href="/landing-page-two" className="shop-continue">← Continue shopping</a>
          </section>
          <aside className="shop-summary"><h2>Order summary</h2><div className="shop-summary__line"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><form className="shop-coupon" onSubmit={applyCoupon}><label htmlFor="coupon">Have a coupon?</label><div><input id="coupon" value={couponInput} onChange={(event) => setCouponInput(event.target.value)} placeholder="Enter code" /><button type="submit">Apply</button></div>{couponMessage && <small className={couponApplied ? "success" : "error"}>{couponMessage}</small>}</form><div className="shop-summary__line"><span>Discount</span><strong className="shop-savings">−{money(discount)}</strong></div><div className="shop-summary__line"><span>Shipping</span><strong>{shipping === 0 ? "Free" : money(shipping)}</strong></div>{shipping > 0 && <p className="shop-shipping-note">Free shipping on orders over ₹1,999</p>}<div className="shop-summary__total"><span>Total</span><strong>{money(total)}</strong></div><button className="shop-button shop-button--primary shop-checkout" onClick={() => window.alert("Checkout is not connected yet. Your cart is saved on this device.")}>Proceed to Checkout <span>→</span></button><div className="shop-payment-note">🔒 Secure checkout · Taxes included</div></aside>
        </div>
      )}
      {wishlist.length > 0 && <section className="shop-cart-saved"><h2>Saved for later <span>{wishlist.length}</span></h2><div className="shop-product-grid shop-product-grid--four">{wishlist.slice(0, 4).map((product) => <div key={product.id}><ProductCard product={product} /><button className="shop-button shop-button--small shop-saved-add" onClick={() => moveToCart(product)}>Move to cart</button></div>)}</div></section>}
    </div>
  );
}

function WishlistPage() {
  const { wishlist, removeFromWishlist, moveToCart } = useShopStore();
  return <div className="shop-container"><Breadcrumbs items={[{ label: "Wishlist" }]} /><div className="shop-page-title"><div><p className="shop-eyebrow">THE GOOD IDEAS LIST</p><h1>Your wishlist <span>({wishlist.length})</span></h1><p>Keep your favorite finds close for the next time inspiration strikes.</p></div><a className="shop-text-link" href="/landing-page-two">Explore the shop ↗</a></div>
    {!wishlist.length ? <EmptyState icon="♡" title="Your wishlist is a blank canvas" text="Tap the heart on anything you love and it’ll be waiting here." action="Explore products" href="/landing-page-two" /> : <div className="shop-wishlist-grid">{wishlist.map((product) => {
      const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null;
      return <article className="shop-wishlist-card" key={product.id}><div className="shop-wishlist-card__media"><a href={`/product/${product.id}`}><img src={imageUrl(product.image, 560)} alt={product.name} /></a>{discount && <span className="shop-discount">{discount}% OFF</span>}<button type="button" className="shop-heart is-saved" aria-label={`Remove ${product.name} from wishlist`} onClick={() => removeFromWishlist(product.id)}>♥</button></div><div className="shop-wishlist-card__body"><span className="shop-product-category">{product.category}</span><h2><a href={`/product/${product.id}`}>{product.name}</a></h2><div className="shop-rating"><span>★★★★★</span><small>{product.rating} ({product.reviews})</small></div><div className="shop-wishlist-price"><strong>{money(product.price)}</strong>{product.oldPrice && <del>{money(product.oldPrice)}</del>}</div><p className="shop-stock"><span /> In stock</p><button className="shop-button shop-button--primary shop-wishlist-add" type="button" onClick={() => moveToCart(product)}>Move to Cart</button></div></article>;
    })}</div>}
  </div>;
}

function CategoryPage({ slug }) {
  const resolvedSlug = categoryAliases[slug] || slug;
  const baseCategory = categories.find((item) => item.slug === resolvedSlug);
  const category = baseCategory ? {
    ...baseCategory,
    title: categoryTitles[slug] || baseCategory.title,
    image: categoryImageByTitle[categoryTitles[slug]] || baseCategory.image,
  } : null;
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [brand, setBrand] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [ratingFloor, setRatingFloor] = useState(0);
  const [sort, setSort] = useState("popular");
  const [filterOpen, setFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const source = category ? categoryProductIds[slug]
    ? allProducts.filter((product) => categoryProductIds[slug].includes(product.id))
    : allProducts.filter((product) => category.products.includes(product.category)) : [];
  const brands = [...new Set(source.map(brandFor))];
  const filtered = useMemo(() => {
    const list = source.filter((product) => (!minPrice || product.price >= Number(minPrice)) && (!maxPrice || product.price <= Number(maxPrice)) && (brand === "all" || brandFor(product) === brand) && (!ratingFloor || Number(product.rating) >= ratingFloor) && (!inStockOnly || product.inStock !== false));
    if (sort === "low") list.sort((a, b) => a.price - b.price);
    if (sort === "high") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => Number(b.rating) - Number(a.rating));
    if (sort === "new") list.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
    if (sort === "popular") list.sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [source, minPrice, maxPrice, brand, ratingFloor, inStockOnly, sort]);
  const resetFilters = () => { setMinPrice(""); setMaxPrice(""); setBrand("all"); setRatingFloor(0); setInStockOnly(false); };
  const filters = <div className="shop-filter-content"><div className="shop-filter-head"><h2>Filters</h2><button onClick={resetFilters}>Clear all</button></div><fieldset><legend>Price range</legend><div className="shop-price-range"><label><span>Min</span><input type="number" min="0" placeholder="₹0" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} /></label><i>—</i><label><span>Max</span><input type="number" min="0" placeholder="No limit" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} /></label></div></fieldset><fieldset><legend>Brand</legend><select value={brand} onChange={(event) => setBrand(event.target.value)}><option value="all">All brands</option>{brands.map((item) => <option key={item}>{item}</option>)}</select></fieldset><fieldset><legend>Availability</legend><label className="shop-checkbox"><input type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} /> In stock</label></fieldset><fieldset><legend>Product category</legend>{categories.map((item) => <a className="shop-category-filter" href={`/category/${item.slug}`} key={item.slug}>{item.title}<span>›</span></a>)}</fieldset><fieldset><legend>Customer rating</legend>{[4, 3, 2].map((value) => <label className="shop-checkbox" key={value}><input type="radio" name="rating" checked={ratingFloor === value} onChange={() => setRatingFloor(value)} /> <span className="shop-rating-stars">{"★".repeat(value)}{"☆".repeat(5 - value)}</span> &amp; up</label>)}</fieldset></div>;

  return <div className="shop-container"><Breadcrumbs items={[{ label: "Shop", href: "/landing-page-two" }, { label: category?.title || "Category" }]} />{category ? <>
    <section className="shop-category-hero"><img src={imageUrl(category.image, 1200)} alt="" /><div><p className="shop-eyebrow">MADE FOR YOUR NEXT IDEA</p><h1>{category.title}</h1><p>{category.description}</p></div></section>
    <div className="shop-category-toolbar"><div><strong>{filtered.length}</strong> products <span>·</span> Thoughtfully selected for makers</div><div className="shop-category-controls"><button className="shop-filter-toggle" onClick={() => setFilterOpen(true)}>☷ Filters</button><label>Sort by <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="popular">Popularity</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option><option value="new">Newest Arrivals</option><option value="rating">Customer Rating</option></select></label></div></div>
    <div className="shop-category-layout"><aside className="shop-filter-sidebar">{filters}</aside><section className="shop-category-results"><div className="shop-product-grid">{filtered.slice(0, visibleCount).map((product) => <ProductCard key={product.id} product={product} />)}{!filtered.length && <div className="shop-no-results"><h2>No products match those filters</h2><p>Try adjusting your price or rating filters.</p><button className="shop-button shop-button--outline" onClick={resetFilters}>Clear filters</button></div>}</div>{filtered.length > visibleCount && <button className="shop-button shop-button--outline shop-load-more" onClick={() => setVisibleCount((count) => count + 8)}>Load more products</button>}</section></div>
    {filterOpen && <div className="shop-drawer-backdrop" onClick={() => setFilterOpen(false)}><aside className="shop-filter-drawer" onClick={(event) => event.stopPropagation()}><button className="shop-drawer-close" onClick={() => setFilterOpen(false)} aria-label="Close filters">×</button>{filters}<button className="shop-button shop-button--primary shop-apply-filters" onClick={() => setFilterOpen(false)}>Show {filtered.length} products</button></aside></div>}
  </> : <EmptyState icon="⌕" title="We couldn’t find that category" text="Browse our full range of maker essentials instead." action="Shop all products" href="/landing-page-two" />}</div>;
}

function ProductPage({ slug }) {
  const router = useRouter();
  const product = allProducts.find((item) => item.id === slug);
  const { addToCart, toggleWishlist, wishlist } = useShopStore();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [recent, setRecent] = useState([]);
  useEffect(() => {
    if (!product) return;
    try {
      const previous = JSON.parse(window.localStorage.getItem("mitra-shop-recent") || "[]");
      const next = [product.id, ...previous.filter((id) => id !== product.id)].slice(0, 5);
      window.localStorage.setItem("mitra-shop-recent", JSON.stringify(next));
      setRecent(next.filter((id) => id !== product.id).map((id) => allProducts.find((item) => item.id === id)).filter(Boolean));
    } catch (error) {
      console.error("Could not update recently viewed products.", error);
    }
  }, [product]);
  if (!product) return <PageFrame><div className="shop-container shop-product-not-found"><Breadcrumbs items={[{ label: "Product" }]} /><EmptyState icon="⌕" title="That product isn’t here" text="Explore the shop to find something for your next project." action="Explore products" href="/landing-page-two" /></div></PageFrame>;
  const saved = wishlist.some((item) => item.id === product.id);
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null;
  const gallery = [product.image, ...allProducts.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3).map((item) => item.image)];
  const add = () => addToCart(product, quantity);
  return <div className="shop-container shop-product-page"><Breadcrumbs items={[{ label: product.category, href: `/category/${productCategorySlugs[product.category]}` }, { label: product.name }]} />
    <div className="shop-product-detail"><div className="shop-gallery"><div className="shop-gallery__main"><img src={imageUrl(gallery[activeImage], 1100)} alt={product.name} /><span className="shop-zoom-hint">Hover to zoom</span>{discount && <span className="shop-discount">{discount}% OFF</span>}</div><div className="shop-gallery__thumbs">{gallery.map((image, index) => <button key={`${image}-${index}`} className={activeImage === index ? "is-active" : ""} onClick={() => setActiveImage(index)} aria-label={`View product image ${index + 1}`}><img src={imageUrl(image, 180)} alt="" /></button>)}</div></div>
      <section className="shop-product-info"><span className="shop-product-category">{brandFor(product)} · {product.category}</span><h1>{product.name}</h1><div className="shop-detail-rating"><span>★★★★★</span><strong>{product.rating}</strong><a href="#reviews">{product.reviews} customer reviews</a></div><div className="shop-detail-price"><strong>{money(product.price)}</strong>{product.oldPrice && <><del>{money(product.oldPrice)}</del><span>{discount}% off</span></>}</div><p className="shop-tax-note">Inclusive of all taxes</p><div className="shop-stock shop-detail-stock"><span /> In stock <small>· Ready to ship</small></div><p className="shop-short-description">{product.name} is a reliable, maker-friendly essential selected to help you build confidently. Carefully chosen for quality, easy integration, and dependable everyday use.</p><div className="shop-delivery-promise"><span>↗</span><div><strong>Fast delivery across India</strong><small>Free shipping on orders above ₹1,999</small></div></div><div className="shop-buy-row"><div className="shop-quantity shop-quantity--large"><button aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((number) => Math.max(1, number - 1))}>−</button><span>{quantity}</span><button aria-label="Increase quantity" onClick={() => setQuantity((number) => number + 1)}>+</button></div><button className="shop-button shop-button--primary" onClick={add}>Add to Cart</button><button className="shop-button shop-button--buy" onClick={() => { add(); window.setTimeout(() => router.push("/cart"), 50); }}>Buy Now</button><button className={`shop-detail-heart${saved ? " is-saved" : ""}`} aria-label={`${saved ? "Remove from" : "Add to"} wishlist`} onClick={() => toggleWishlist(product)}>{saved ? "♥" : "♡"}</button></div><div className="shop-product-assurances"><span>✓ Genuine products</span><span>↻ Easy 7-day returns</span><span>♧ Maker support</span></div></section>
    </div>
    <section className="shop-detail-section"><div className="shop-detail-section__heading"><p className="shop-eyebrow">THE DETAILS</p><h2>Made for your next build</h2></div><div className="shop-detail-columns"><article><h3>Product description</h3><p>{product.name} brings dependable performance and thoughtful design to your workbench. Whether you’re learning the fundamentals or refining a prototype, it’s a practical addition to a maker’s toolkit.</p><h3>Key highlights</h3><ul><li>Curated for quality and reliable everyday use</li><li>Suitable for learning, prototyping, and personal projects</li><li>Backed by friendly Mitra Shop maker support</li></ul></article><div className="shop-specifications"><h3>Specifications</h3>{[["Brand", brandFor(product)], ["Category", product.category], ["Customer rating", `${product.rating} / 5`], ["Availability", "In stock"], ["Model", product.id.toUpperCase()]].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></div></section>
    <section className="shop-detail-section shop-review-section" id="reviews"><p className="shop-eyebrow">MAKER COMMUNITY</p><h2>Customer reviews <span>({product.reviews})</span></h2><div className="shop-review-overview"><strong>{product.rating}</strong><div><span>★★★★★</span><small>Based on {product.reviews} ratings</small></div></div><div className="shop-review-cards"><article><span>★★★★★</span><h3>Great addition to my workbench</h3><p>Well presented and a great fit for my latest project. The product information made it easy to choose.</p><small>Verified Mitra Shop customer</small></article><article><span>★★★★★</span><h3>Exactly what I needed</h3><p>Good quality and arrived carefully packed. I’d happily recommend it to other makers.</p><small>Verified Mitra Shop customer</small></article></div></section>
    {recent.length > 0 && <section className="shop-related"><p className="shop-eyebrow">PICK UP WHERE YOU LEFT OFF</p><h2>Recently viewed</h2><div className="l2-product-grid shop-related__grid">{recent.slice(0, 4).map((item) => <LandingProductCard key={item.id} product={item} />)}</div></section>}
    <section className="shop-related"><p className="shop-eyebrow">MORE TO EXPLORE</p><h2>You may also like</h2><div className="l2-product-grid shop-related__grid">{allProducts.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 4).map((item) => <LandingProductCard key={item.id} product={item} />)}</div></section>
  </div>;
}

export default function ShopPage({ type, slug }) {
  if (type === "product") return <PageFrame><ProductPage slug={slug} /></PageFrame>;
  return <PageFrame>{type === "cart" ? <CartPage /> : type === "wishlist" ? <WishlistPage /> : <CategoryPage slug={slug} />}</PageFrame>;
}
