"use client";

import { useEffect, useRef, useState } from "react";
import { products } from "./App.jsx";

const imageUrl = (id, width = 700) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`;

const rupees = (value) => `₹${value.toLocaleString("en-IN")}`;

const featuredBrands = [
  { name: "Bambu Lab", logo: "/assets/brands/bambu-lab.svg" },
  { name: "Sonoff", logo: "/assets/brands/sonoff-favicon.png" },
  { name: "RTL-SDR", logoText: "rtl-sdr.com" },
  { name: "Pro-Range", logo: "/assets/brands/pro-range.jpg" },
  { name: "SimpliFly", logo: "/assets/brands/simplifly.jpg" },
  { name: "WeAct Studio", logo: "/assets/brands/weact-studio.svg" },
  { name: "RunCam", logo: "/assets/brands/runcam.png" },
  { name: "VEGA Processor", logo: "/assets/brands/vega-processor.png" },
  {
    name: "Taparia",
    logo: "/assets/brands/taparia.png",
    logoClass: "l2-featured-brands__logo--light",
  },
  { name: "DWIN", logo: "/assets/brands/dwin.png" },
];

const featuredBrandRows = [featuredBrands.slice(0, 5), featuredBrands.slice(5)];

function scrollFeaturedBrandRail(rail, direction, brandCount) {
  const track = rail?.firstElementChild;
  const firstCard = track?.firstElementChild;
  if (!track || !firstCard || brandCount === 0) return;

  const cardStep = firstCard.getBoundingClientRect().width +
    (parseFloat(window.getComputedStyle(track).columnGap) || 0);
  const cycleWidth = cardStep * brandCount;
  const currentPosition = ((rail.scrollLeft % cycleWidth) + cycleWidth) % cycleWidth;
  const nextPosition = currentPosition + direction * cardStep;

  if (nextPosition < 0) {
    rail.scrollLeft = cycleWidth - cardStep;
  } else if (nextPosition >= cycleWidth) {
    rail.scrollLeft = 0;
  } else {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    rail.scrollTo({ left: nextPosition, behavior });
  }
}

const categories = [
  ["Development Boards", "Arduino, ESP32, Raspberry Pi", "photo-1518770660439-4636190af475"],
  ["Robotics & IoT", "Sensors and smart modules", "photo-1485827404703-89b55fcc595e"],
  ["Electronic Components", "Resistors, LEDs and ICs", "photo-1553406830-ef2513450d76"],
  ["Sensors", "Environment and motion", "photo-1519389950473-47ba0277781c"],
  ["Motors & Actuators", "For machines and motion", "photo-1581092160562-40aa08e78837"],
  ["Tools & Equipment", "Build with confidence", "photo-1581092334651-ddf26d9a09d0"],
  ["Power & Batteries", "Reliable power solutions", "photo-1625842268584-8f3296236761"],
  ["Maker Kits", "Complete project bundles", "photo-1581091226825-a6a2a5aee158"],
];

const headerCategories = [
  ["Development Boards", "photo-1518770660439-4636190af475"],
  ["Drone Parts", "photo-1485827404703-89b55fcc595e"],
  ["Batteries, Power Supply and Accessories", "photo-1625842268584-8f3296236761"],
  ["3D Printers and Parts", "photo-1581092160562-40aa08e78837"],
  ["Sensors", "photo-1519389950473-47ba0277781c"],
  ["Electronic Components", "photo-1553406830-ef2513450d76"],
  ["Motors | Drivers | Pumps | Actuators", "photo-1581092334651-ddf26d9a09d0"],
  ["Electronic Modules and Displays", "photo-1597733336794-12d05021d510"],
  ["IoT and Wireless Modules", "photo-1558002038-1055907df827"],
  ["Mechanical Parts, Measurement & Workbench Tools", "photo-1581092160562-40aa08e78837"],
  ["DIY and Maker Kits", "photo-1581091226825-a6a2a5aee158"],
  ["Electric Vehicle Parts", "photo-1509391366360-2e959784a276"],
];

const services = [
  ["01", "Fast Shipping", "Carefully packed orders dispatched across India."],
  ["02", "Secure Payments", "Multiple trusted payment options at checkout."],
  ["03", "Genuine Products", "Quality-tested components and electronics."],
  ["04", "Maker Support", "Help choosing parts for your next project."],
];

const serviceOffers = [
  ["Industrial 3D Printing", "photo-1581092160562-40aa08e78837"],
  ["Online FDM 3D Printing", "photo-1581092334651-ddf26d9a09d0"],
  ["Metal Laser Cutting", "photo-1581092160562-40aa08e78837"],
  ["Customized Lithium-ion Battery Pack", "photo-1625842268584-8f3296236761"],
  ["Non-Metal Laser Cutting", "photo-1581091226825-a6a2a5aee158"],
  ["PCB Manufacturing", "photo-1518770660439-4636190af475"],
];

const promotionalSlides = [
  {
    kicker: "WEEKEND BUILD",
    title: "Build smarter, from the first component",
    text: "Save on selected boards and maker essentials.",
    image: "photo-1581091226825-a6a2a5aee158",
  },
  {
    kicker: "SMARTER AUTOMATION",
    title: "Turn ideas into connected projects",
    text: "Explore sensors, controllers and IoT kits.",
    image: "photo-1558002038-1055907df827",
  },
];

const blogs = [
  ["Getting started with ESP32", "A practical guide to your first connected project.", "GUIDES", "photo-1518770660439-4636190af475"],
  ["Choosing the right sensor", "Match accuracy, range and power to your build.", "TIPS", "photo-1519389950473-47ba0277781c"],
  ["Your first Arduino project", "Learn the essentials with a simple step-by-step build.", "TUTORIAL", "photo-1581091226825-a6a2a5aee158"],
];

function Icon({ name, size = 20 }) {
  const icons = {
    search: "⌕",
    user: "♙",
    heart: "♡",
    bag: "▢",
    menu: "☰",
    arrow: "→",
    chevron: "›",
    check: "✓",
    truck: "▰",
  };
  return <span className={`l2-icon l2-icon--${name}`} style={{ "--icon-size": `${size}px` }} aria-hidden="true">{icons[name]}</span>;
}

function HeaderIcon({ name }) {
  const paths = {
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.2 4.2" /></>,
    location: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    heart: <path d="M20.2 8.8c0 4.5-8.2 10-8.2 10s-8.2-5.5-8.2-10a4.2 4.2 0 0 1 8.2-1.3 4.2 4.2 0 0 1 8.2 1.3Z" />,
    cart: <><path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.4L22 8H6" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></>,
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 21a7 7 0 0 1 14 0" /></>,
    chevron: <path d="m7 10 5 5 5-5" />,
    left: <><path d="m14 18-6-6 6-6" /><path d="M8 12h12" /></>,
    right: <><path d="m10 18 6-6-6-6" /><path d="M16 12H4" /></>,
    check: <><path d="M12 3 19 6v5c0 4.6-3 8-7 10-4-2-7-5.4-7-10V6l7-3Z" /><path d="m9 12 2 2 4-4" /></>,
    truck: <><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" /><circle cx="7.5" cy="19" r="1.5" /><circle cx="17.5" cy="19" r="1.5" /></>,
    support: <><path d="M4 13v-2a8 8 0 0 1 16 0v2" /><path d="M4 13h3v6H6a2 2 0 0 1-2-2v-4ZM20 13h-3v6h1a2 2 0 0 0 2-2v-4ZM17 20c-1 1-2.5 1-4 1" /></>,
  };
  return <svg className="l2-header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Brand() {
  return (
    <a className="l2-brand" href="/landing-page-two" aria-label="Mitra Shop home">
      <span className="l2-brand__mark">M</span>
      <span className="l2-brand__text">mitra<span>shop</span><small>TECH FOR CURIOUS MINDS</small></span>
    </a>
  );
}

function Header() {
  const [moreOpen, setMoreOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(headerCategories[0][0]);
  const categoriesRef = useRef(null);

  return (
    <header className="l2-header">
      <div className="l2-utility">
        <div className="l2-shell l2-utility__inner">
          <strong>India&apos;s Trusted Electronics &amp; Maker Store</strong>
          <div className="l2-utility__trust">
            <span><HeaderIcon name="check" /> Verified Products</span>
            <span><HeaderIcon name="truck" /> PAN India Delivery</span>
            <a href="#support"><HeaderIcon name="support" /> 24x7 Support</a>
          </div>
        </div>
      </div>
      <div className="l2-shell l2-header__main">
        <Brand />
        <form className="l2-search" onSubmit={(event) => { event.preventDefault(); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }}>
          <HeaderIcon name="search" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, brands and more..." aria-label="Search products" />
          <button type="submit" aria-label="Submit search"><HeaderIcon name="search" /><span>Search</span></button>
        </form>
        <div className="l2-header__actions">
          <label className="l2-location"><HeaderIcon name="location" /><select aria-label="Select location" defaultValue=""><option value="" disabled>Select Location</option><option>Delhi NCR</option><option>Mumbai</option><option>Bengaluru</option><option>Other location</option></select><HeaderIcon name="chevron" /></label>
          <a className="l2-header-action l2-notification" href="#support" aria-label="Notifications"><HeaderIcon name="bell" /></a>
          <a className="l2-header-action" href="#wishlist" aria-label="Wishlist"><HeaderIcon name="heart" /><span>Wishlist</span></a>
          <a className="l2-header-action l2-cart" href="#cart" aria-label="Cart, 0 items"><HeaderIcon name="cart" /><span>Cart</span><b>0</b></a>
          <div className="l2-more">
            <button type="button" className="l2-header-action l2-more__toggle" aria-label="More options" aria-expanded={moreOpen} onClick={() => setMoreOpen((open) => !open)}>More <HeaderIcon name="chevron" /></button>
            {moreOpen && <div className="l2-more__menu"><a href="#categories" onClick={() => setMoreOpen(false)}>All categories</a><a href="#products" onClick={() => setMoreOpen(false)}>Featured products</a><a href="#support" onClick={() => setMoreOpen(false)}>Customer support</a></div>}
          </div>
          <a className="l2-login" href="#account" aria-label="Login / Sign In"><HeaderIcon name="user" /><span>Login / Sign In</span></a>
        </div>
      </div>
      <nav className="l2-category-nav" aria-label="Product categories">
        <div className="l2-shell l2-category-nav__inner">
          <button className="l2-category-nav__arrow" type="button" aria-label="Scroll categories left" onClick={() => categoriesRef.current?.scrollBy({ left: -360, behavior: "smooth" })}><HeaderIcon name="left" /></button>
          <div className="l2-category-nav__scroller" ref={categoriesRef}>
            {headerCategories.map(([name, image]) => (
              <a className={`l2-category-item${activeCategory === name ? " is-active" : ""}`} href="#products" key={name} title={name} aria-current={activeCategory === name ? "true" : undefined} onClick={() => setActiveCategory(name)}>
                <span className="l2-category-item__image"><img src={imageUrl(image, 160)} alt="" loading="lazy" /></span>
                <span className="l2-category-item__name">{name}</span>
              </a>
            ))}
          </div>
          <button className="l2-category-nav__arrow" type="button" aria-label="Scroll categories right" onClick={() => categoriesRef.current?.scrollBy({ left: 360, behavior: "smooth" })}><HeaderIcon name="right" /></button>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  const [slide, setSlide] = useState(0);
  const heroSlides = [
    {
      kicker: "MITRA MAKER SPOTLIGHT",
      title: "Build your next big idea",
      text: "Discover development boards, components and tools for your next breakthrough.",
      image: "photo-1518770660439-4636190af475",
      action: "Explore components",
    },
    {
      kicker: "READY FOR YOUR NEXT PROJECT",
      title: "Smarter projects start here",
      text: "Find the sensors and wireless modules to connect your ideas to the world.",
      image: "photo-1558002038-1055907df827",
      action: "Shop smart modules",
    },
    {
      kicker: "TOOLS FOR REAL MAKERS",
      title: "Turn imagination into prototypes",
      text: "From first sketch to final build, get the essentials that keep you creating.",
      image: "photo-1581091226825-a6a2a5aee158",
      action: "Start building",
    },
    {
      kicker: "POWER EVERY BUILD",
      title: "The right parts make it possible",
      text: "Explore dependable electronics and maker essentials, all in one place.",
      image: "photo-1581092334651-ddf26d9a09d0",
      action: "Find your parts",
    },
  ];
  const promoCards = [
    ["Development boards", "Start with a solid foundation", "photo-1518770660439-4636190af475", "mint"],
    ["3D printing", "Make your ideas tangible", "photo-1581092160562-40aa08e78837", "lavender"],
    ["Power & batteries", "Reliable energy for every build", "photo-1625842268584-8f3296236761", "peach"],
    ["Sensors & modules", "Add intelligence to your project", "photo-1519389950473-47ba0277781c", "sage"],
  ];
  useEffect(() => {
    const timer = window.setInterval(() => setSlide((value) => (value + 1) % heroSlides.length), 6500);
    return () => window.clearInterval(timer);
  }, []);
  const current = heroSlides[slide];
  const moveSlide = (direction) => setSlide((value) => (value + direction + heroSlides.length) % heroSlides.length);

  return (
    <section className="l2-hero" aria-label="Featured promotions">
      <div className="l2-shell l2-hero__inner">
        <div className="l2-hero__promos" aria-label="Featured categories">
          {promoCards.map(([title, detail, image, tone]) => (
            <a className={`l2-hero-promo l2-hero-promo--${tone}`} href="#products" key={title}>
              <span className="l2-hero-promo__copy"><strong>{title}</strong><small>{detail}</small></span>
              <span className="l2-hero-promo__image"><img src={imageUrl(image, 180)} alt="" loading="lazy" /></span>
            </a>
          ))}
        </div>
        <div className="l2-hero__slider" aria-label="Featured offers">
          <div className="l2-hero__banner" aria-live="off">
            <img className="l2-hero__banner-image" key={current.image} src={imageUrl(current.image, 1800)} alt="" />
            <div className="l2-hero__banner-shade"></div>
            <div className="l2-hero__slide-copy">
              <p>{current.kicker}</p>
              <h1>{current.title}</h1>
              <span>{current.text}</span>
              <a className="l2-button l2-button--primary" href="#products">{current.action} <Icon name="arrow" /></a>
            </div>
            <button className="l2-hero__arrow l2-hero__arrow--previous" type="button" aria-label="Previous promotion" onClick={() => moveSlide(-1)}><HeaderIcon name="left" /></button>
            <button className="l2-hero__arrow l2-hero__arrow--next" type="button" aria-label="Next promotion" onClick={() => moveSlide(1)}><HeaderIcon name="right" /></button>
          </div>
          <div className="l2-hero__dots" aria-label="Choose a promotion">
            {heroSlides.map((item, index) => <button type="button" className={index === slide ? "is-active" : ""} onClick={() => setSlide(index)} aria-label={`Show promotion ${index + 1}: ${item.title}`} aria-pressed={index === slide} key={item.title} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, link = "View all" }) {
  return (
    <div className="l2-section-heading">
      <div>{eyebrow && <p>{eyebrow}</p>}<h2>{title}</h2></div>
      <a href="#products">{link} <Icon name="arrow" /></a>
    </div>
  );
}

function CategorySection() {
  return (
    <section className="l2-section" id="categories">
      <div className="l2-shell">
        <SectionHeading eyebrow="SHOP BY CATEGORY" title="Everything you need to build" />
        <div className="l2-category-grid">
          {categories.map(([title, subtitle, image]) => (
            <a className="l2-category-card" href="#products" key={title}>
              <div><img src={imageUrl(image, 480)} alt="" loading="lazy" /></div>
              <h3>{title}</h3>
              <p>{subtitle}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }) {
  return (
    <article className="l2-product">
      <div className="l2-product__media">
        <img src={imageUrl(product.image)} alt={product.name} loading="lazy" />
        {product.badge && <span>{product.badge}</span>}
        <button type="button" aria-label={`Add ${product.name} to wishlist`}>♡</button>
      </div>
      <div className="l2-product__body">
        <p>{product.category}</p>
        <h3>{product.name}</h3>
        <div className="l2-product__rating"><span>★★★★★</span><small>{product.reviews} reviews</small></div>
        <div className="l2-product__buy">
          <div><strong>{rupees(product.price)}</strong>{product.oldPrice && <del>{rupees(product.oldPrice)}</del>}</div>
          <button type="button" aria-label={`Add ${product.name} to cart`}>Add to cart</button>
        </div>
      </div>
    </article>
  );
}

function FeaturedProducts() {
  const all = [...products.featured, ...products.recommended].slice(0, 8);
  return (
    <section className="l2-section l2-section--soft" id="products">
      <div className="l2-shell">
        <SectionHeading eyebrow="CURATED FOR MAKERS" title="Featured products" />
        <div className="l2-product-grid">
          {all.map((product) => <ProductCard product={product} key={product.id} />)}
        </div>
      </div>
    </section>
  );
}

function OurServices() {
  return (
    <section className="l2-section l2-our-services" id="our-services">
      <div className="l2-shell">
        <div className="l2-section-heading">
          <div><p>MADE TO ORDER</p><h2>Our Services</h2></div>
        </div>
        <div className="l2-service-offerings">
          {serviceOffers.map(([title, image]) => (
            <article className="l2-service-offer" key={title}>
              <div className="l2-service-offer__content">
                <h3>{title}</h3>
                <a href="#support" aria-label={`Order ${title}`}>Order Now <Icon name="arrow" size={14} /></a>
              </div>
              <span className="l2-service-offer__image"><img src={imageUrl(image, 360)} alt="" loading="lazy" /></span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="l2-services" id="support">
      <div className="l2-shell">
        <SectionHeading eyebrow="WHY MITRA SHOP" title="Built around your next build" />
        <div className="l2-services__grid">
          {services.map(([number, title, text]) => (
            <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GoogleReviews() {
  const [slide, setSlide] = useState(0);
  const reviewTopics = [
    ["Quality at every step", "Explore thoughtfully selected parts and components for dependable builds."],
    ["Delivery you can plan around", "Clear order updates and delivery options across supported locations."],
    ["Support for makers", "Find guidance and assistance when choosing components for a project."],
  ];
  return (
    <section className="l2-reviews">
      <div className="l2-shell l2-reviews__inner">
        <div className="l2-reviews__brand">
          <span className="l2-google">G</span>
          <div><small>GOOGLE REVIEWS</small><h2>Made for a better shopping experience</h2></div>
        </div>
        <div className="l2-review-card">
          <div className="l2-review-card__stars">★★★★★</div>
          <blockquote>{reviewTopics[slide][1]}</blockquote>
          <strong>{reviewTopics[slide][0]}</strong>
          <a href="https://www.google.com/search?q=Mitra+Shop" target="_blank" rel="noreferrer">View us on Google <Icon name="arrow" /></a>
          <div className="l2-review-card__controls">
            {reviewTopics.map((_, index) => <button type="button" className={slide === index ? "is-active" : ""} onClick={() => setSlide(index)} aria-label={`Show review topic ${index + 1}`} key={index} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function PromoSlider() {
  const [slide, setSlide] = useState(0);
  const current = promotionalSlides[slide];
  return (
    <section className="l2-section">
      <div className="l2-shell l2-promo-grid">
        {[0, 1].map((index) => {
          const item = promotionalSlides[index];
          return (
            <article className={`l2-promo-card${slide === index ? " is-active" : ""}`} key={item.title}>
              <img src={imageUrl(item.image, 900)} alt="" loading="lazy" />
              <div><p>{item.kicker}</p><h2>{item.title}</h2><span>{item.text}</span><a href="#products">Shop the collection <Icon name="arrow" /></a></div>
            </article>
          );
        })}
      </div>
      <div className="l2-promo-controls" aria-label="Promotional slideshow">
        {promotionalSlides.map((_, index) => <button type="button" className={slide === index ? "is-active" : ""} onClick={() => setSlide(index)} aria-label={`Show promotion ${index + 1}`} key={index} />)}
      </div>
    </section>
  );
}

function BlogsAndTutorials() {
  return (
    <>
      <section className="l2-section l2-blogs">
        <div className="l2-shell">
          <SectionHeading eyebrow="FROM THE JOURNAL" title="Latest blogs" />
          <div className="l2-blog-grid">
            {blogs.map(([title, text, tag, image]) => (
              <article key={title}><a href="#tutorials"><img src={imageUrl(image, 800)} alt="" loading="lazy" /></a><div><span>{tag}</span><h3><a href="#tutorials">{title}</a></h3><p>{text}</p><a href="#tutorials">Read article <Icon name="arrow" /></a></div></article>
            ))}
          </div>
        </div>
      </section>
      <section className="l2-tutorials" id="tutorials">
        <div className="l2-shell l2-tutorials__inner">
          <div><p>MITRA TUTORIALS</p><h2>Learn by making.</h2><span>Guides, projects and practical answers for every stage of your build.</span></div>
          <a className="l2-button l2-button--dark" href="#products">Browse tutorials <Icon name="arrow" /></a>
        </div>
      </section>
    </>
  );
}

function Footer() {
  return (
    <footer className="l2-footer">
      <div className="l2-shell">
        <div className="l2-footer__top">
          <div className="l2-footer__brand"><Brand /><p>Technology, components and guidance for curious minds across India.</p><a href="mailto:hello@mitrashop.in">hello@mitrashop.in</a></div>
          <div><h3>Shop</h3><a href="#categories">Development Boards</a><a href="#categories">Components</a><a href="#categories">Sensors</a><a href="#categories">Robotics</a><a href="#categories">Tools & Equipment</a></div>
          <div><h3>Help</h3><a href="#support">Shipping</a><a href="#support">Returns</a><a href="#support">Track order</a><a href="#support">Contact us</a><a href="#support">FAQs</a></div>
          <div><h3>Company</h3><a href="#top">About Mitra Shop</a><a href="#tutorials">Project inspiration</a><a href="#blogs">Journal</a><a href="#support">Privacy</a><a href="#support">Terms</a></div>
          <div className="l2-footer__newsletter"><h3>Stay curious</h3><p>Get project ideas and occasional shop updates.</p><form onSubmit={(event) => event.preventDefault()}><input type="email" placeholder="Email address" aria-label="Email address" /><button type="submit" aria-label="Subscribe">→</button></form></div>
        </div>
        <div className="l2-footer__bottom"><span>© {new Date().getFullYear()} Mitra Shop. All rights reserved.</span><div><a href="#top">Instagram</a><a href="#top">YouTube</a><a href="#top">LinkedIn</a></div></div>
      </div>
    </footer>
  );
}

function FeaturedBrands() {
  const railRefs = useRef([]);
  const [isPaused, setIsPaused] = useState(false);

  const scrollBrandRows = (direction) => {
    railRefs.current.forEach((rail, index) => {
      scrollFeaturedBrandRail(rail, direction, featuredBrandRows[index].length);
    });
  };

  useEffect(() => {
    if (isPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      railRefs.current.forEach((rail, index) => {
        scrollFeaturedBrandRail(rail, 1, featuredBrandRows[index].length);
      });
    }, 4000);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  return (
    <section className="l2-featured-brands" id="featured-brands">
      <div className="l2-shell">
        <div className="l2-featured-brands__header">
          <div className="l2-featured-brands__title"><h2>Our Featured Brands</h2></div>
          <div className="l2-featured-brands__actions">
            <a className="l2-featured-brands__view-all" href="#products">View All <HeaderIcon name="right" /></a>
            <button type="button" onClick={() => scrollBrandRows(-1)} aria-label="Previous brands"><HeaderIcon name="left" /></button>
            <button type="button" onClick={() => scrollBrandRows(1)} aria-label="Next brands"><HeaderIcon name="right" /></button>
          </div>
        </div>
        <div
          className="l2-featured-brands__rows"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
          }}
        >
          {featuredBrandRows.map((brands, rowIndex) => (
            <div
              className="l2-featured-brands__viewport"
              key={`featured-brands-row-${rowIndex}`}
              ref={(element) => { railRefs.current[rowIndex] = element; }}
              role="region"
              aria-label={`Featured brands row ${rowIndex + 1}`}
              tabIndex={0}
            >
              <div className="l2-featured-brands__track">
                {[...brands, ...brands].map(({ name, logo, logoClass, logoText }, index) => (
                  <article
                    className="l2-featured-brands__card"
                    key={`${name}-${index}`}
                    aria-hidden={index >= brands.length}
                  >
                    {logo ? (
                      <img
                        className={`l2-featured-brands__logo${logoClass ? ` ${logoClass}` : ""}`}
                        src={logo}
                        alt=""
                        aria-hidden="true"
                      />
                    ) : (
                      <span className="l2-featured-brands__wordmark" aria-hidden="true">{logoText}</span>
                    )}
                    <span className="l2-featured-brands__name">{name}</span>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LandingPageTwo() {
  return (
    <div className="l2-page" id="top">
      <Header />
      <main>
        <Hero />
        <CategorySection />
        <FeaturedProducts />
        <OurServices />
        <Services />
        <GoogleReviews />
        <PromoSlider />
        <BlogsAndTutorials />
        <FeaturedBrands />
      </main>
      <Footer />
    </div>
  );
}
