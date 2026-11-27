"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer, Header, ProductCard as LandingProductCard } from "./LandingPageTwo.jsx";
import { products } from "./App.jsx";
import { useShopStore } from "./ShopStore.jsx";
import { pdfCategories, findCategoryBySlug } from "./categoriesData.js";

// Deduplicate products across all App categories
const rawProducts = Object.values(products).flat();
const allProductsMap = new Map();
rawProducts.forEach((p) => {
  if (p && p.id && !allProductsMap.has(p.id)) {
    allProductsMap.set(p.id, p);
  }
});
const allProducts = Array.from(allProductsMap.values());

const imageUrl = (image, width = 900) => `https://images.unsplash.com/${image}?auto=format&fit=crop&w=${width}&q=85`;
const money = (amount) => `₹${amount.toLocaleString("en-IN")}`;

function getCategoryForProduct(product) {
  if (!product) return { name: "All Products", slug: "development-boards" };
  const found = pdfCategories.find((c) => c.productIds && c.productIds.includes(product.id));
  if (found) return { name: found.name, slug: found.slug };
  return { name: "Development Boards", slug: "development-boards" };
}

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
  const savings = product.oldPrice ? product.oldPrice - product.price : null;

  return (
    <article className="shop-product-card">
      <div className="shop-product-card__media">
        <a href={`/product/${product.id}`} className="shop-product-card__img-link">
          <img src={imageUrl(product.image, 560)} alt={product.name} loading="lazy" />
        </a>
        {discount && <span className="shop-discount">−{discount}%</span>}
        <span className="shop-instock-badge">
          <i /> In Stock
        </span>
        <button
          className={`shop-heart${saved ? " is-saved" : ""}`}
          type="button"
          aria-label={`${saved ? "Remove" : "Add"} ${product.name} ${saved ? "from" : "to"} wishlist`}
          aria-pressed={saved}
          onClick={() => toggleWishlist(product)}
        >
          {saved ? "♥" : "♡"}
        </button>
      </div>
      <div className="shop-product-card__body">
        <span className="shop-product-category">{product.category}</span>
        <h3><a href={`/product/${product.id}`}>{product.name}</a></h3>
        <div className="shop-rating">
          <span className="shop-rating__stars">
            {"★".repeat(Math.round(Number(product.rating) || 4))}{"☆".repeat(5 - Math.round(Number(product.rating) || 4))}
          </span>
          <small>{product.rating} ({product.reviews})</small>
        </div>
        <div className="shop-card-price-row">
          <strong className="shop-card-price">{money(product.price)}</strong>
          {product.oldPrice && <del className="shop-card-old-price">{money(product.oldPrice)}</del>}
          {savings && <span className="shop-card-savings">Save {money(savings)}</span>}
        </div>
        <button className="shop-card-atc-btn" type="button" onClick={() => addToCart(product)}>
          🛒 Add to Cart
        </button>
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
          <aside className="shop-summary"><h2>Order summary</h2><div className="shop-summary__line"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><form className="shop-coupon" onSubmit={applyCoupon}><label htmlFor="coupon">Have a coupon?</label><div><input id="coupon" value={couponInput} onChange={(event) => setCouponInput(event.target.value)} placeholder="Enter code" /><button type="submit">Apply</button></div>{couponMessage && <small className={couponApplied ? "success" : "error"}>{couponMessage}</small>}</form><div className="shop-summary__line"><span>Discount</span><strong className="shop-savings">−{money(discount)}</strong></div><div className="shop-summary__line"><span>Shipping</span><strong>{shipping === 0 ? "Free" : money(shipping)}</strong></div>{shipping > 0 && <p className="shop-shipping-note">Free shipping on orders over ₹1,999</p>}<div className="shop-summary__total"><span>Total</span><strong>{money(total)}</strong></div><a className="shop-button shop-button--primary shop-checkout" href="/checkout">Proceed to Checkout <span>→</span></a><div className="shop-payment-note">🔒 Secure checkout · Taxes included</div></aside>
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
  const match = findCategoryBySlug(slug);
  const category = match?.category || pdfCategories[0];
  const initialSubcategory = match?.subcategory || null;

  const [activeSubSlug, setActiveSubSlug] = useState(initialSubcategory?.slug || null);

  useEffect(() => {
    const updatedMatch = findCategoryBySlug(slug);
    setActiveSubSlug(updatedMatch?.subcategory?.slug || null);
  }, [slug]);

  const activeSubcategory = useMemo(() => {
    if (!activeSubSlug || !category.subcategories) return null;
    return category.subcategories.find((s) => s.slug === activeSubSlug) || null;
  }, [activeSubSlug, category]);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [brand, setBrand] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [ratingFloor, setRatingFloor] = useState(0);
  const [sort, setSort] = useState("popular");
  const [filterOpen, setFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  const baseProducts = useMemo(() => {
    let ids = [];
    if (activeSubcategory) {
      ids = activeSubcategory.productIds || [];
    } else {
      ids = category.productIds || [];
    }
    const result = [];
    const seen = new Set();
    for (const id of ids) {
      const p = allProducts.find((item) => item.id === id);
      if (p && !seen.has(p.id)) {
        seen.add(p.id);
        result.push(p);
      }
    }
    return result;
  }, [activeSubcategory, category]);

  const brands = useMemo(() => [...new Set(baseProducts.map(brandFor))], [baseProducts]);

  const filtered = useMemo(() => {
    const list = baseProducts.filter(
      (product) =>
        (!minPrice || product.price >= Number(minPrice)) &&
        (!maxPrice || product.price <= Number(maxPrice)) &&
        (brand === "all" || brandFor(product) === brand) &&
        (!ratingFloor || Number(product.rating) >= ratingFloor) &&
        (!inStockOnly || product.inStock !== false)
    );
    if (sort === "low") list.sort((a, b) => a.price - b.price);
    if (sort === "high") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => Number(b.rating) - Number(a.rating));
    if (sort === "new") list.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
    if (sort === "popular") list.sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [baseProducts, minPrice, maxPrice, brand, ratingFloor, inStockOnly, sort]);

  const resetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setBrand("all");
    setRatingFloor(0);
    setInStockOnly(false);
  };

  const breadcrumbItems = [
    { label: "Shop", href: "/landing-page-two" },
    { label: category.name, href: activeSubcategory ? `/category/${category.slug}` : undefined },
  ];
  if (activeSubcategory) {
    breadcrumbItems.push({ label: activeSubcategory.name });
  }

  const pageTitle = activeSubcategory ? activeSubcategory.name : category.name;
  const pageDescription = activeSubcategory
    ? `Explore our verified selection of ${activeSubcategory.name} in the ${category.name} catalog.`
    : category.description;

  /* ---- Subcategory image mapping (Unsplash thumbnails by keyword) ---- */
  const subcatImages = {
    "raspberry-pi": "photo-1587825045005-5b02ecf2ff3c",
    "boards-compatible-with-arduino": "photo-1553406830-ef2513450d76",
    "nodemcu-esp": "photo-1558002038-1055907df827",
    "stm": "photo-1518770660439-4636190af475",
    "color-sensors": "photo-1519389950473-47ba0277781c",
    "current-sensors": "photo-1581092160562-40aa08e78837",
    "distance-sensors": "photo-1519389950473-47ba0277781c",
    "temperature-humidity-sensors": "photo-1519389950473-47ba0277781c",
    "ir-motion-sensors": "photo-1519389950473-47ba0277781c",
    "light-sensors": "photo-1509391366360-2e959784a276",
    "ics": "photo-1553406830-ef2513450d76",
    "resistors": "photo-1607604276583-eef5d076aa5f",
    "capacitors": "photo-1607604276583-eef5d076aa5f",
    "lithium-ion-battery-packs": "photo-1625842268584-8f3296236761",
    "batteries": "photo-1625842268584-8f3296236761",
    "adapters": "photo-1625842268584-8f3296236761",
    "chargers": "photo-1625842268584-8f3296236761",
    "iot-boards-and-modules": "photo-1558002038-1055907df827",
    "bluetooth": "photo-1558002038-1055907df827",
    "wireless": "photo-1558002038-1055907df827",
    "gps-modules": "photo-1558002038-1055907df827",
    "push-button-switches": "photo-1581092334651-ddf26d9a09d0",
    "relays": "photo-1581092334651-ddf26d9a09d0",
    "leds": "photo-1509391366360-2e959784a276",
    "led-strips-controllers": "photo-1509391366360-2e959784a276",
    "dc-motors": "photo-1581092160562-40aa08e78837",
    "servo-motors": "photo-1581092160562-40aa08e78837",
    "stepper-motors": "photo-1581092160562-40aa08e78837",
    "motor-drivers": "photo-1581092160562-40aa08e78837",
    "jumper-wires": "photo-1558494949-ef010cbdcc31",
    "power-cables": "photo-1558494949-ef010cbdcc31",
    "3d-printers-pens": "photo-1634838080334-28befa9efe80",
    "3d-printer-filaments": "photo-1634838080334-28befa9efe80",
    "3d-printer-parts": "photo-1634838080334-28befa9efe80",
    "smd-capacitors": "photo-1607604276583-eef5d076aa5f",
    "smd-resistors": "photo-1607604276583-eef5d076aa5f",
    "drone-controllers": "photo-1485827404703-89b55fcc595e",
    "drone-frames": "photo-1485827404703-89b55fcc595e",
    "drone-motors-sub": "photo-1485827404703-89b55fcc595e",
    "soldering-accessories": "photo-1581092160562-40aa08e78837",
    "multimeters": "photo-1581092160562-40aa08e78837",
    "tools": "photo-1581092160562-40aa08e78837",
    "oled": "photo-1597733336794-12d05021d510",
    "lcd": "photo-1597733336794-12d05021d510",
    "tft-touch": "photo-1597733336794-12d05021d510",
  };

  function getSubcatImage(sub) {
    if (subcatImages[sub.slug]) return imageUrl(subcatImages[sub.slug], 400);
    return imageUrl(category.image, 400);
  }

  const filters = (
    <div className="shop-filter-content">
      <div className="shop-filter-head">
        <h2>Filters</h2>
        <button type="button" onClick={resetFilters}>Clear all</button>
      </div>
      <fieldset>
        <legend>Price range</legend>
        <div className="shop-price-range">
          <label><span>Min</span><input type="number" min="0" placeholder="₹0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} /></label>
          <i>—</i>
          <label><span>Max</span><input type="number" min="0" placeholder="No limit" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} /></label>
        </div>
      </fieldset>
      {brands.length > 0 && (
        <fieldset>
          <legend>Brand</legend>
          <select value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value="all">All brands</option>
            {brands.map((b) => <option key={b}>{b}</option>)}
          </select>
        </fieldset>
      )}
      <fieldset>
        <legend>Availability</legend>
        <label className="shop-checkbox"><input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} /> In stock only</label>
      </fieldset>
      <fieldset>
        <legend>Customer rating</legend>
        {[4, 3, 2].map((v) => (
          <label className="shop-checkbox" key={v}><input type="radio" name="rating" checked={ratingFloor === v} onChange={() => setRatingFloor(v)} /> <span className="shop-rating-stars">{"★".repeat(v)}{"☆".repeat(5 - v)}</span> &amp; up</label>
        ))}
      </fieldset>
      <fieldset>
        <legend>All Departments</legend>
        <div className="shop-cat-sidebar-list">
          {pdfCategories.map((c) => (
            <a className={`shop-category-filter ${c.slug === category.slug ? "is-current" : ""}`} href={`/category/${c.slug}`} key={c.slug}>
              <span>{c.name}</span>
              <span className="shop-cat-filter-count">{c.productIds?.length || 0} ›</span>
            </a>
          ))}
        </div>
      </fieldset>
    </div>
  );

  /* ---------- Determine view mode ----------
     - Main category page (no activeSubcategory): show Robu.in-style subcategory image grid
     - Subcategory drilled in (activeSubcategory set): show product listing with filters */
  const showSubcategoryGrid = !activeSubcategory && category.subcategories && category.subcategories.length > 0;

  return (
    <div className="shop-container" style={{ paddingTop: 28, paddingBottom: 60 }}>
      <Breadcrumbs items={breadcrumbItems} />

      {/* ---- Category Heading (Robu.in style) ---- */}
      <h1 className="robu-cat-title">{pageTitle}</h1>

      {/* ---- Category Description Paragraphs ---- */}
      <div className="robu-cat-description">
        <p>{pageDescription}</p>
        {!activeSubcategory && category.subcategories && category.subcategories.length > 0 && (
          <p>
            Browse our carefully organised subcategories below to find exactly what you need.
            Every listing is verified for quality and backed by <strong>Mitra Shop&apos;s maker-friendly support</strong>.
            {category.productIds && category.productIds.length > 0 && (
              <> We currently stock <strong>{category.productIds.length} product{category.productIds.length !== 1 ? "s" : ""}</strong> across this department.</>
            )}
          </p>
        )}
      </div>

      {/* ======== VIEW A: Subcategory Image Grid (Robu.in layout) ======== */}
      {showSubcategoryGrid && (
        <div className="robu-subcat-grid">
          {category.subcategories.map((sub) => {
            const count = sub.productIds ? sub.productIds.length : 0;
            return (
              <a
                key={sub.slug}
                className="robu-subcat-card"
                href={`/category/${sub.slug}`}
                onClick={(e) => { e.preventDefault(); setActiveSubSlug(sub.slug); }}
              >
                <div className="robu-subcat-card__img">
                  <img src={getSubcatImage(sub)} alt={sub.name} loading="lazy" />
                </div>
                <span className="robu-subcat-card__name">{sub.name}</span>
                {count > 0 && <span className="robu-subcat-card__count">{count} product{count !== 1 ? "s" : ""}</span>}
              </a>
            );
          })}
        </div>
      )}

      {/* ======== VIEW B: Product Listing (subcategory drilled-in or no subcategories) ======== */}
      {!showSubcategoryGrid && (
        <>
          {/* Back link to parent category */}
          {activeSubcategory && (
            <button
              type="button"
              className="robu-back-link"
              onClick={() => setActiveSubSlug(null)}
            >
              ← Back to all {category.name}
            </button>
          )}

          {baseProducts.length === 0 ? (
            <div className="shop-category-empty-wrap">
              <div className="shop-coming-soon">
                <div className="shop-coming-soon__icon">📦</div>
                <h2>Products Coming Soon</h2>
                <p>
                  We are currently sourcing and testing authentic stock for{" "}
                  <strong>{pageTitle}</strong> according to our strict maker quality benchmarks.
                </p>
                <div className="shop-coming-soon__actions">
                  <a href="/landing-page-two" className="shop-button shop-button--primary">Explore In-Stock Items</a>
                  {activeSubcategory && (
                    <button type="button" className="shop-button shop-button--outline" onClick={() => setActiveSubSlug(null)}>
                      View All {category.name}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="shop-category-toolbar">
                <div>
                  <strong>{filtered.length}</strong> {filtered.length === 1 ? "product" : "products"} available{" "}
                  <span>·</span> Genuine components with fast delivery
                </div>
                <div className="shop-category-controls">
                  <button className="shop-filter-toggle" type="button" onClick={() => setFilterOpen(true)}>☷ Filters</button>
                  <label>
                    Sort by{" "}
                    <select value={sort} onChange={(e) => setSort(e.target.value)}>
                      <option value="popular">Popularity</option>
                      <option value="low">Price: Low to High</option>
                      <option value="high">Price: High to Low</option>
                      <option value="new">Newest Arrivals</option>
                      <option value="rating">Customer Rating</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="shop-category-layout">
                <aside className="shop-filter-sidebar">{filters}</aside>
                <section className="shop-category-results">
                  <div className="shop-product-grid">
                    {filtered.slice(0, visibleCount).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                    {!filtered.length && (
                      <div className="shop-no-results">
                        <h2>No products match those filters</h2>
                        <p>Try clearing your price range or rating selection.</p>
                        <button className="shop-button shop-button--outline" type="button" onClick={resetFilters}>Clear filters</button>
                      </div>
                    )}
                  </div>
                  {filtered.length > visibleCount && (
                    <button className="shop-button shop-button--outline shop-load-more" type="button" onClick={() => setVisibleCount((c) => c + 12)}>Load more products</button>
                  )}
                </section>
              </div>
            </>
          )}
        </>
      )}

      {/* Categories with NO subcategories AND no products → Coming Soon */}
      {!category.subcategories?.length && category.productIds.length === 0 && (
        <div className="shop-category-empty-wrap">
          <div className="shop-coming-soon">
            <div className="shop-coming-soon__icon">📦</div>
            <h2>Products Coming Soon</h2>
            <p>We are currently sourcing and testing authentic stock for <strong>{pageTitle}</strong> according to our strict maker quality benchmarks.</p>
            <div className="shop-coming-soon__actions">
              <a href="/landing-page-two" className="shop-button shop-button--primary">Explore In-Stock Items</a>
              <a href="/category/development-boards" className="shop-button shop-button--outline">Browse Development Boards</a>
            </div>
          </div>
        </div>
      )}

      {filterOpen && (
        <div className="shop-drawer-backdrop" onClick={() => setFilterOpen(false)}>
          <aside className="shop-filter-drawer" onClick={(e) => e.stopPropagation()}>
            <button className="shop-drawer-close" type="button" onClick={() => setFilterOpen(false)} aria-label="Close filters">×</button>
            {filters}
            <button className="shop-button shop-button--primary shop-apply-filters" type="button" onClick={() => setFilterOpen(false)}>Show {filtered.length} products</button>
          </aside>
        </div>
      )}
    </div>
  );
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
  const prodCategory = getCategoryForProduct(product);
  return <div className="shop-container shop-product-page"><Breadcrumbs items={[{ label: prodCategory.name, href: `/category/${prodCategory.slug}` }, { label: product.name }]} />
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
