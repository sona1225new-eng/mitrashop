"use client";

import { useEffect, useRef, useState } from "react";

export const products = {
  featured: [
    { id: "esp32-board", name: "ESP32 Development Board with Wi-Fi + Bluetooth", category: "Boards & IoT", price: 799, oldPrice: 999, rating: "4.9", reviews: 128, badge: "BESTSELLER", image: "photo-1518770660439-4636190af475" },
    { id: "arduino-starter", name: "Arduino Starter Kit for Curious Makers", category: "Maker kits", price: 2499, oldPrice: 2999, rating: "4.8", reviews: 86, badge: "MAKER PICK", image: "photo-1581091226825-a6a2a5aee158" },
    { id: "raspberry-pi", name: "Raspberry Pi 5 — 8GB Single Board Computer", category: "Boards & IoT", price: 8499, rating: "4.9", reviews: 54, badge: "POPULAR", image: "photo-1597733336794-12d05021d510" },
    { id: "precision-toolkit", name: "Precision Electronics Tool Kit · 32-piece", category: "Tools & lab", price: 1299, oldPrice: 1599, rating: "4.7", reviews: 72, badge: "−19%", image: "photo-1581092160562-40aa08e78837" },
  ],
  recommended: [
    { id: "sensor-pack", name: "Smart Sensor & IoT Experiment Pack", category: "Maker kits", price: 1899, rating: "4.8", reviews: 39, badge: "PROJECT PICK", image: "photo-1519389950473-47ba0277781c" },
    { id: "breadboard-set", name: "Solderless Breadboard & Jumper Wire Set", category: "Components", price: 449, oldPrice: 599, rating: "4.6", reviews: 91, badge: "GREAT VALUE", image: "photo-1553406830-ef2513450d76" },
    { id: "multimeter", name: "Digital Multimeter for Your Workbench", category: "Tools & lab", price: 1499, rating: "4.7", reviews: 47, badge: "MAKER PICK", image: "photo-1581092334651-ddf26d9a09d0" },
    { id: "robotics-kit", name: "Mini Robotics Chassis & Motor Kit", category: "Maker kits", price: 999, oldPrice: 1199, rating: "4.8", reviews: 64, badge: "−17%", image: "photo-1485827404703-89b55fcc595e" },
  ],
  latest: [
    { id: "usb-hub", name: "USB-C Power & Connectivity Hub", category: "Components", price: 1199, rating: "4.6", reviews: 18, badge: "JUST IN", image: "photo-1625842268584-8f3296236761", isNew: true },
    { id: "smart-home-sensor", name: "Compact Smart Home Sensor Bundle", category: "Boards & IoT", price: 2199, rating: "4.8", reviews: 22, badge: "JUST IN", image: "photo-1558002038-1055907df827", isNew: true },
    { id: "weather-station", name: "Build Your Own Mini Weather Station", category: "Maker kits", price: 1599, oldPrice: 1799, rating: "4.7", reviews: 14, badge: "NEW KIT", image: "photo-1509391366360-2e959784a276", isNew: true },
    { id: "wireless-keyboard", name: "Wireless Keyboard for Your Setup", category: "Tools & lab", price: 1899, rating: "4.7", reviews: 31, badge: "JUST IN", image: "photo-1587829741301-dc798b83add3", isNew: true },
  ],
};

const categories = [
  { title: "Maker kits", subtitle: "Learn by making", icon: "kit", target: "featured" },
  { title: "Boards & IoT", subtitle: "Connect your world", icon: "chip", target: "recommended" },
  { title: "Components", subtitle: "Small parts, big plans", icon: "plug", target: "recommended" },
  { title: "Tools & lab", subtitle: "Get hands-on", icon: "tool", target: "latest" },
];

const imageUrl = (id, width = 720) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`;
const formatPrice = (amount) => `₹${amount.toLocaleString("en-IN")}`;

function Icon({ name, className = "" }) {
  const paths = {
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.2 4.2" /></>,
    heart: <path d="M20.2 8.8c0 4.5-8.2 10-8.2 10s-8.2-5.5-8.2-10a4.2 4.2 0 0 1 8.2-1.3 4.2 4.2 0 0 1 8.2 1.3Z" />,
    bag: <><path d="M5 8h14l1 12H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    add: <path d="M12 5v14m-7-7h14" />,
    kit: <><path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z" /><path d="m4.5 8.8 7.5 4.3 7.5-4.3M12 13v6.5M8 6.3l8 4.5" /></>,
    chip: <><rect x="5" y="5" width="14" height="14" rx="2" /><path d="M9 9h6v6H9zM8 2v3m4-3v3m4-3v3M8 19v3m4-3v3m4-3v3M2 8h3m-3 4h3m-3 4h3m14-8h3m-3 4h3m-3 4h3" /></>,
    plug: <path d="M7 4v5m10-5v5M5 9h14v2a7 7 0 0 1-14 0V9Zm7 9v3m-3 0h6" />,
    tool: <path d="m16.5 4.5 3-3a4 4 0 0 1-5.7 5.7L5 16a2.1 2.1 0 0 0 3 3l8.8-8.8a4 4 0 0 0 5.7-5.7l-3 3Z" />,
    delivery: <path d="M3 7h11v11H3zM14 11h4l3 3v4h-7zM7 18.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Zm9 0a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z" />,
    shield: <><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></>,
    return: <path d="M4 12a8 8 0 1 1 2.3 5.6L4 20m0-8h5" />,
    chat: <><path d="M4 5h16v12H9l-5 4V5Z" /><path d="M8 9h8m-8 4h5" /></>,
  };
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}

function Brand({ footer = false }) {
  return (
    <a className={`brand${footer ? " brand--footer" : ""}`} href="#top" aria-label="Mitra Shop home">
      <span className="brand__mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none">
          <path d="M5 24V10.5c0-1.1 1.3-1.7 2.1-.9L16 18.5l8.9-8.9c.8-.8 2.1-.2 2.1.9V24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="16" cy="7" r="2" fill="currentColor" />
        </svg>
      </span>
      <span className="brand__wordmark">mitra<span>shop</span><small>TECH FOR CURIOUS MINDS</small></span>
    </a>
  );
}

function Header({ search, setSearch, onSearch, cartCount, savedCount, showToast }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const navLinks = [
    ["Shop all", "#categories"],
    ["Maker kits", "#featured"],
    ["Components", "#recommended"],
    ["New arrivals", "#latest"],
    ["Offers", "#deals"],
  ];

  return (
    <>
      <div className="announcement">
        <div className="container announcement__inner">
          <span>Thoughtful tech. Better ideas.</span>
          <span className="announcement__right">Free delivery on orders over ₹1,999 <span aria-hidden="true">·</span> Need help? <a href="mailto:hello@mitrashop.in">Talk to us</a></span>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-main">
          <Brand />
          <form className="search" role="search" onSubmit={onSearch}>
            <Icon name="search" />
            <input
              ref={searchRef}
              type="search"
              placeholder="Search kits, boards, components..."
              aria-label="Search products"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <kbd>Ctrl K</kbd>
            <button type="submit" aria-label="Submit search"><span aria-hidden="true">›</span></button>
          </form>
          <div className="header-actions">
            <button className="icon-action wishlist-action" type="button" aria-label="Saved items" onClick={() => showToast(savedCount ? `${savedCount} ${savedCount === 1 ? "item" : "items"} saved for later.` : "Tap a heart to save products for later.")}>
              <Icon name="heart" />
              <span>Saved</span>
            </button>
            <button className="icon-action cart-action" type="button" aria-label={`Shopping bag, ${cartCount} ${cartCount === 1 ? "item" : "items"}`} onClick={() => showToast(cartCount ? `${cartCount} ${cartCount === 1 ? "item" : "items"} in your bag.` : "Your bag is ready for a good idea.")}>
              <span className="cart-icon-wrap"><Icon name="bag" /><i className="cart-count" aria-live="polite">{cartCount}</i></span>
              <span>Bag</span>
            </button>
            <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} onClick={() => setMenuOpen((open) => !open)}>
              <span></span><span></span>
            </button>
          </div>
        </div>
        <nav className={`container main-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
          {navLinks.map(([label, href], index) => (
            <a className={index === 0 ? "main-nav__active" : undefined} href={href} key={href} onClick={closeMenu}>{label}</a>
          ))}
          <span className="main-nav__note"><span className="status-dot"></span> Made for the makers</span>
        </nav>
      </header>
    </>
  );
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__glow hero__glow--one"></div>
      <div className="hero__glow hero__glow--two"></div>
      <div className="container hero__inner">
        <div className="hero__content">
          <p className="eyebrow eyebrow--light"><span className="eyebrow-dot"></span> YOUR NEXT BIG IDEA STARTS HERE</p>
          <h1 id="hero-title">Make something<br /><span>remarkable.</span></h1>
          <p className="hero__description">From your first circuit to your next breakthrough, find the tools and tech that move your ideas forward.</p>
          <div className="hero__actions">
            <a className="button button--primary" href="#featured">Explore the collection <span aria-hidden="true">↗</span></a>
            <a className="button button--ghost" href="#categories">Find your starting point</a>
          </div>
          <div className="hero__proof"><div className="avatar-stack" aria-hidden="true"><span>R</span><span>A</span><span>M</span><span>+</span></div><p><strong>10,000+</strong> makers building better things</p></div>
        </div>
        <div className="hero__visual" aria-hidden="true">
          <div className="hero-orbit hero-orbit--outer"></div>
          <div className="hero-orbit hero-orbit--inner"></div>
          <div className="hero__image-frame"><img src={imageUrl("photo-1518770660439-4636190af475", 1200)} alt="" /></div>
          <div className="floating-tag floating-tag--top"><span className="floating-tag__icon">✦</span><span><b>Built for curiosity</b><small>Quality you can count on</small></span></div>
          <div className="floating-tag floating-tag--bottom"><span className="floating-tag__pulse"></span><span><b>Ideas in motion</b><small>Explore 250+ essentials</small></span></div>
        </div>
        <div className="hero__scroll" aria-hidden="true"><span></span> SCROLL TO EXPLORE</div>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, action, aside }) {
  return (
    <div className="section-heading">
      <div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>
      {aside ? <div className="section-heading__aside"><span>{aside}</span>{action}</div> : action}
    </div>
  );
}

function TextLink({ href, children }) {
  return <a className="text-link" href={href}>{children} <span aria-hidden="true">↗</span></a>;
}

function CategorySection({ onSelectCategory }) {
  const iconTones = ["mint", "blue", "peach", "lavender"];
  return (
    <section className="section categories-section" id="categories">
      <div className="container">
        <SectionHeading eyebrow="A GOOD PLACE TO BEGIN" title="Explore by category" action={<TextLink href="#featured">Browse everything</TextLink>} />
        <div className="category-grid">
          {categories.map((category, index) => (
            <a className="category-card" href={`#${category.target}`} key={category.title} onClick={(event) => { event.preventDefault(); onSelectCategory(category.title); }}>
              <span className={`category-card__icon category-card__icon--${iconTones[index]}`}><Icon name={category.icon} /></span>
              <span><b>{category.title}</b><small>{category.subtitle}</small></span>
              <span className="category-arrow">↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, isSaved, onToggleSave, onAdd }) {
  const badgeClass = product.isNew ? "product-tag product-tag--new" : product.oldPrice ? "product-tag product-tag--sale" : "product-tag";
  return (
    <article className="product-card">
      <div className="product-card__image">
        <img src={imageUrl(product.image)} alt={product.name} loading="lazy" />
        <span className={badgeClass}>{product.badge}</span>
        <button className={`favorite-button${isSaved ? " is-saved" : ""}`} type="button" aria-label={`${isSaved ? "Remove" : "Save"} ${product.name} ${isSaved ? "from" : "to"} favorites`} aria-pressed={isSaved} onClick={() => onToggleSave(product)}>
          <Icon name="heart" />
        </button>
      </div>
      <div className="product-card__body">
        <p className="product-card__category">{product.category}</p>
        <h3>{product.name}</h3>
        <div className="product-card__rating"><span className="stars" aria-label={`${product.rating} out of 5 stars`}>★★★★★</span><span>{product.rating} ({product.reviews})</span></div>
        <div className="product-card__bottom">
          <span className="product-price">{formatPrice(product.price)}{product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}</span>
          <button className="add-button" type="button" aria-label={`Add ${product.name} to bag`} onClick={() => onAdd(product)}><Icon name="add" /> Add</button>
        </div>
      </div>
    </article>
  );
}

function ProductSection({ id, eyebrow, title, items, search, favorites, onToggleSave, onAdd, action, aside }) {
  const normalizedSearch = search.trim().toLowerCase();
  const visibleProducts = items.filter((product) =>
    `${product.name} ${product.category}`.toLowerCase().includes(normalizedSearch),
  );

  return (
    <section className={`section section--products${id === "latest" ? " section--latest" : ""}`} id={id}>
      <div className="container">
        <SectionHeading eyebrow={eyebrow} title={title} action={action} aside={aside} />
        <div className="product-grid">
          {visibleProducts.length ? visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} isSaved={favorites.has(product.id)} onToggleSave={onToggleSave} onAdd={onAdd} />
          )) : <div className="no-results"><strong>No matches just yet.</strong>Try another search, or explore a category above.</div>}
        </div>
      </div>
    </section>
  );
}

function DealSection() {
  return (
    <section className="container deal-section" id="deals">
      <div className="deal-section__copy">
        <p className="eyebrow eyebrow--light"><span className="eyebrow-dot"></span> THE MAKER BUNDLE</p>
        <h2>Start building.<br /><span>Save a little.</span></h2>
        <p>Get the essentials for your next project, all in one thoughtfully chosen kit.</p>
        <div className="deal-price"><strong>Save 20%</strong><span>on your first maker bundle</span></div>
        <a className="button button--light" href="#recommended">Build your bundle <span aria-hidden="true">↗</span></a>
      </div>
      <div className="deal-section__art" aria-hidden="true">
        <div className="deal-orbit"></div>
        <img src={imageUrl("photo-1581091226825-a6a2a5aee158", 1000)} alt="" />
        <span className="deal-sticker">MADE<br />TO MAKE</span>
        <span className="deal-spark deal-spark--one">✳</span><span className="deal-spark deal-spark--two">✦</span>
      </div>
      <div className="deal-section__foot"><span>Thoughtfully picked, ready when you are.</span><span className="deal-index">01 <i></i> 03</span></div>
    </section>
  );
}

function Benefits() {
  const benefits = [
    { icon: "delivery", title: "Free, fast delivery", caption: "On orders over ₹1,999" },
    { icon: "shield", title: "Quality, always", caption: "Curated and maker-approved" },
    { icon: "return", title: "Easy 7-day returns", caption: "Shop with peace of mind" },
    { icon: "chat", title: "Real human support", caption: "Here when you need us" },
  ];
  return (
    <section className="benefits-section">
      <div className="container benefits-grid">
        {benefits.map((benefit) => (
          <article className="benefit" key={benefit.title}>
            <span className="benefit__icon"><Icon name={benefit.icon} /></span>
            <span><b>{benefit.title}</b><small>{benefit.caption}</small></span>
          </article>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Brand footer />
            <p>For the curious, the tinkerers, and the ones who just want to know how it works.</p>
            <a className="footer-email" href="mailto:hello@mitrashop.in">hello@mitrashop.in <span aria-hidden="true">↗</span></a>
          </div>
          <div className="footer-links"><h3>Explore</h3><a href="#categories">Shop all</a><a href="#featured">Maker kits</a><a href="#recommended">Boards &amp; components</a><a href="#latest">New arrivals</a></div>
          <div className="footer-links"><h3>We're here</h3><a href="mailto:hello@mitrashop.in">Contact us</a><a href="#deals">Shipping &amp; returns</a><a href="#deals">FAQs</a><a href="#deals">Project inspiration</a></div>
          <div className="footer-note"><span className="footer-note__spark">✳</span><h3>Make room<br />for wonder.</h3><p>Good things happen when you stay curious.</p></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Mitra Shop. Built for curious minds.</span><span><a href="#top">Back to top ↑</a><span className="footer-bottom__divider">·</span> Made with care in India</span></div>
      </div>
    </footer>
  );
}

export default function App() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState(() => new Set());
  const [toastMessage, setToastMessage] = useState("");
  const toastTimer = useRef(null);
  const featuredRef = useRef(null);
  const allProducts = Object.values(products).flat();

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const showToast = (message) => {
    setToastMessage(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMessage(""), 2400);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    featuredRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const selectCategory = (category) => {
    setSearch(category);
    featuredRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addToCart = (product) => {
    setCart((items) => [...items, product]);
    showToast(`${product.name} added to your bag.`);
  };

  const toggleFavorite = (product) => {
    const isSaved = favorites.has(product.id);
    setFavorites((current) => {
      const next = new Set(current);
      if (isSaved) {
        next.delete(product.id);
      } else {
        next.add(product.id);
      }
      return next;
    });
    showToast(isSaved ? "Removed from your favorites." : "Saved to your favorites.");
  };

  const productSectionProps = {
    search,
    favorites,
    onToggleSave: toggleFavorite,
    onAdd: addToCart,
  };

  return (
    <>
      <Header search={search} setSearch={setSearch} onSearch={submitSearch} cartCount={cart.length} savedCount={favorites.size} showToast={showToast} />
      <main>
        <Hero />
        <CategorySection onSelectCategory={selectCategory} />
        <div ref={featuredRef}>
          <ProductSection {...productSectionProps} id="featured" eyebrow="THE MAKER FAVORITES" title="Popular right now" aside="Good ideas start with good gear." action={<TextLink href="#latest">See all products</TextLink>} items={products.featured} />
        </div>
        <DealSection />
        <ProductSection {...productSectionProps} id="recommended" eyebrow="A LITTLE INSPIRATION" title="Picked for your next project" action={<TextLink href="#latest">Discover more</TextLink>} items={products.recommended} />
        <ProductSection {...productSectionProps} id="latest" eyebrow="FRESH FROM THE WORKBENCH" title="New arrivals" action={<TextLink href="#categories">Explore the shop</TextLink>} items={products.latest} />
        <Benefits />
      </main>
      <Footer />
      <div className={`toast${toastMessage ? " is-visible" : ""}`} role="status" aria-live="polite">{toastMessage}</div>
    </>
  );
}
