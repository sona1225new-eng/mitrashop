"use client";

import { useEffect, useMemo, useState } from "react";
import { Header, Footer } from "./LandingPageTwo.jsx";
import { useShopStore } from "./ShopStore.jsx";

const imageUrl = (id, width = 400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`;

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi NCR", "Jammu & Kashmir", "Ladakh", "Puducherry", "Chandigarh"
];

const DEFAULT_ADDRESSES = [
  {
    id: "addr-sample-1",
    fullName: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    mobile: "9876543210",
    address: "Flat 402, Ramanujan Heights, Electronic City Phase 1",
    landmark: "Near Tech Park Gate 2",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560100",
    isDefault: true,
  },
];

export default function CheckoutPage() {
  const { cart, clearCart } = useShopStore();

  // Form State
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("new");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Delhi NCR");
  const [pincode, setPincode] = useState("");
  const [saveAddress, setSaveAddress] = useState(true);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [selectedUpiApp, setSelectedUpiApp] = useState("gpay");
  const [upiId, setUpiId] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");

  // Validation & Submission
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Initialize saved addresses
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("mitra-shop-addresses");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedAddresses(parsed);
          setSelectedAddressId(parsed[0].id);
          applySavedAddress(parsed[0]);
          return;
        }
      }
      // If none in storage, populate default
      setSavedAddresses(DEFAULT_ADDRESSES);
      setSelectedAddressId(DEFAULT_ADDRESSES[0].id);
      applySavedAddress(DEFAULT_ADDRESSES[0]);
    } catch {
      setSavedAddresses(DEFAULT_ADDRESSES);
    }
  }, []);

  function applySavedAddress(addr) {
    if (!addr) return;
    setFullName(addr.fullName || "");
    setEmail(addr.email || "");
    setMobile(addr.mobile || "");
    setAddress(addr.address || "");
    setLandmark(addr.landmark || "");
    setCity(addr.city || "");
    setState(addr.state || "Delhi NCR");
    setPincode(addr.pincode || "");
  }

  const handleAddressSelect = (id) => {
    setSelectedAddressId(id);
    if (id === "new") {
      setFullName("");
      setEmail("");
      setMobile("");
      setAddress("");
      setLandmark("");
      setCity("");
      setState("Delhi NCR");
      setPincode("");
    } else {
      const found = savedAddresses.find((item) => item.id === id);
      if (found) applySavedAddress(found);
    }
  };

  // Calculations
  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === "percent") {
      return Math.round((subtotal * appliedCoupon.value) / 100);
    }
    return Math.min(subtotal, appliedCoupon.value);
  }, [subtotal, appliedCoupon]);

  const shipping = subtotal - discount >= 1999 || subtotal === 0 ? 0 : 99;
  const grandTotal = Math.max(0, subtotal - discount + shipping);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === "MITRA10") {
      setAppliedCoupon({ code: "MITRA10", type: "percent", value: 10, label: "10% off order" });
      setCouponMessage("MITRA10 applied: 10% discount added!");
    } else if (code === "MAKER100") {
      setAppliedCoupon({ code: "MAKER100", type: "flat", value: 100, label: "₹100 off order" });
      setCouponMessage("MAKER100 applied: ₹100 flat discount added!");
    } else {
      setAppliedCoupon(null);
      setCouponMessage("Invalid code. Try MITRA10 or MAKER100.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponMessage("");
  };

  // Validation
  const validateForm = () => {
    const errs = {};
    if (!fullName.trim()) errs.fullName = "Full name is required";
    else if (fullName.trim().length < 2) errs.fullName = "Name is too short";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) errs.email = "Email address is required";
    else if (!emailRegex.test(email.trim())) errs.email = "Enter a valid email address";

    const mobileDigits = mobile.replace(/\D/g, "");
    if (!mobile.trim()) errs.mobile = "Mobile number is required";
    else if (mobileDigits.length !== 10) errs.mobile = "Enter a valid 10-digit mobile number";

    if (!address.trim()) errs.address = "Delivery address is required";
    if (!city.trim()) errs.city = "City is required";
    if (!state.trim()) errs.state = "State is required";

    const pinDigits = pincode.replace(/\D/g, "");
    if (!pincode.trim()) errs.pincode = "PIN code is required";
    else if (pinDigits.length !== 6) errs.pincode = "Enter a 6-digit PIN code";

    if (paymentMethod === "upi" && selectedUpiApp === "other" && !upiId.trim()) {
      errs.upiId = "Enter your UPI ID (e.g. name@okhdfcbank)";
    }

    if (paymentMethod === "card") {
      if (!cardHolder.trim()) errs.cardHolder = "Cardholder name is required";
      if (!cardNumber.trim()) errs.cardNumber = "Card number is required";
      if (!cardExpiry.trim()) errs.cardExpiry = "Expiry date required";
      if (!cardCvv.trim()) errs.cardCvv = "CVV required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty. Please add products before checking out.");
      return;
    }

    if (!validateForm()) {
      const firstError = document.querySelector(".checkout-input--error");
      if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);

    const orderId = `MITRA-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAddressObj = {
      id: `addr-${Date.now()}`,
      fullName: fullName.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      address: address.trim(),
      landmark: landmark.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
    };

    if (saveAddress && selectedAddressId === "new") {
      try {
        const nextAddrs = [newAddressObj, ...savedAddresses.slice(0, 4)];
        window.localStorage.setItem("mitra-shop-addresses", JSON.stringify(nextAddrs));
        setSavedAddresses(nextAddrs);
      } catch (err) {
        console.error("Could not save address", err);
      }
    }

    const orderRecord = {
      orderId,
      createdAt: new Date().toISOString(),
      customer: {
        fullName: fullName.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
      },
      shippingAddress: newAddressObj,
      payment: {
        method: paymentMethod,
        label:
          paymentMethod === "cod"
            ? "Cash on Delivery (COD)"
            : paymentMethod === "upi"
            ? `UPI (${selectedUpiApp.toUpperCase()})`
            : "Debit / Credit Card",
        status: paymentMethod === "cod" ? "Pay on Delivery" : "Paid (Simulated)",
      },
      items: cart.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        category: item.product.category,
        image: item.product.image,
        price: item.product.price,
        quantity: item.quantity,
        total: item.product.price * item.quantity,
      })),
      pricing: {
        subtotal,
        discount,
        couponCode: appliedCoupon?.code || null,
        shipping,
        grandTotal,
      },
    };

    // Store in browser history
    try {
      const storedOrders = JSON.parse(window.localStorage.getItem("mitra-shop-orders") || "[]");
      window.localStorage.setItem("mitra-shop-orders", JSON.stringify([orderRecord, ...storedOrders]));
    } catch (err) {
      console.error("Could not save order", err);
    }

    // Clear cart in store
    clearCart();

    setTimeout(() => {
      setIsSubmitting(false);
      setCompletedOrder(orderRecord);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 450);
  };

  // Render Confirmation State
  if (completedOrder) {
    return (
      <div className="shop-page-frame">
        <Header />
        <main className="shop-main checkout-page">
          <div className="shop-container">
            <nav className="shop-breadcrumbs" aria-label="Breadcrumb">
              <a href="/landing-page-two">Home</a>
              <span><i>/</i><a href="/cart">Cart</a></span>
              <span><i>/</i><a href="/checkout">Checkout</a></span>
              <span><i>/</i><strong>Confirmation</strong></span>
            </nav>

            <div className="checkout-success-card">
              <div className="checkout-success-badge">✓</div>
              <p className="shop-eyebrow">ORDER CONFIRMED</p>
              <h1>Thank you for your order, {completedOrder.customer.fullName}!</h1>
              <p className="checkout-success-lead">
                Your order reference is <strong>#{completedOrder.orderId}</strong>. We are getting your maker essentials ready for dispatch.
              </p>

              <div className="checkout-notice-pill">
                🔒 <strong>Demo Store Confirmation:</strong> This order has been recorded locally in your browser storage. Cart has been emptied and no payment was charged.
              </div>

              <div className="checkout-confirmation-grid">
                {/* Details Column */}
                <div className="checkout-confirmation-col">
                  <div className="checkout-card">
                    <h3>Delivery Details</h3>
                    <p className="checkout-detail-line"><strong>Recipient:</strong> {completedOrder.customer.fullName}</p>
                    <p className="checkout-detail-line"><strong>Contact:</strong> {completedOrder.customer.mobile} · {completedOrder.customer.email}</p>
                    <p className="checkout-detail-line">
                      <strong>Shipping Address:</strong><br />
                      {completedOrder.shippingAddress.address}
                      {completedOrder.shippingAddress.landmark ? `, ${completedOrder.shippingAddress.landmark}` : ""}<br />
                      {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state} – {completedOrder.shippingAddress.pincode}
                    </p>
                    <div className="checkout-delivery-timeline">
                      <span className="checkout-truck-icon">🚚</span>
                      <div>
                        <strong>Estimated Delivery: 3 to 5 Business Days</strong>
                        <small>Carefully inspected &amp; dispatched across India via express courier</small>
                      </div>
                    </div>
                  </div>

                  <div className="checkout-card">
                    <h3>Payment Information</h3>
                    <p className="checkout-detail-line"><strong>Payment Method:</strong> {completedOrder.payment.label}</p>
                    <p className="checkout-detail-line"><strong>Status:</strong> <span className="checkout-status-badge">{completedOrder.payment.status}</span></p>
                    <p className="checkout-detail-line"><strong>Amount Payable:</strong> {money(completedOrder.pricing.grandTotal)}</p>
                  </div>

                  <div className="checkout-card">
                    <h3>Items in This Order ({completedOrder.items.reduce((s, i) => s + i.quantity, 0)})</h3>
                    <div className="checkout-confirmed-items">
                      {completedOrder.items.map((item) => (
                        <div className="checkout-confirmed-item" key={item.id}>
                          <img src={imageUrl(item.image, 160)} alt={item.name} />
                          <div className="checkout-confirmed-item__info">
                            <h4>{item.name}</h4>
                            <span className="checkout-confirmed-item__cat">{item.category}</span>
                            <div className="checkout-confirmed-item__qty">Qty: {item.quantity} × {money(item.price)}</div>
                          </div>
                          <strong className="checkout-confirmed-item__total">{money(item.total)}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Summary Column */}
                <div className="checkout-confirmation-col checkout-confirmation-col--side">
                  <div className="checkout-card checkout-summary-card">
                    <h3>Payment Summary</h3>
                    <div className="checkout-summary-line">
                      <span>Subtotal</span>
                      <strong>{money(completedOrder.pricing.subtotal)}</strong>
                    </div>
                    {completedOrder.pricing.discount > 0 && (
                      <div className="checkout-summary-line checkout-summary-line--discount">
                        <span>Discount ({completedOrder.pricing.couponCode})</span>
                        <strong>−{money(completedOrder.pricing.discount)}</strong>
                      </div>
                    )}
                    <div className="checkout-summary-line">
                      <span>Shipping Charges</span>
                      <strong>{completedOrder.pricing.shipping === 0 ? "FREE" : money(completedOrder.pricing.shipping)}</strong>
                    </div>
                    <div className="checkout-summary-line checkout-summary-line--total">
                      <span>Total Amount</span>
                      <strong>{money(completedOrder.pricing.grandTotal)}</strong>
                    </div>

                    <div className="checkout-confirmation-actions">
                      <button
                        type="button"
                        className="shop-button shop-button--outline"
                        onClick={() => window.print()}
                      >
                        🖨️ Print Receipt
                      </button>
                      <a href="/landing-page-two" className="shop-button shop-button--primary">
                        Continue Shopping →
                      </a>
                    </div>
                  </div>

                  <div className="checkout-help-card">
                    <h4>Need assistance?</h4>
                    <p>Have questions about your order or parts? Our maker support team is available 24×7.</p>
                    <a href="/landing-page-two#support" className="shop-text-link">Contact Maker Support →</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If Cart is Empty
  if (cart.length === 0) {
    return (
      <div className="shop-page-frame">
        <Header />
        <main className="shop-main checkout-page">
          <div className="shop-container">
            <nav className="shop-breadcrumbs" aria-label="Breadcrumb">
              <a href="/landing-page-two">Home</a>
              <span><i>/</i><a href="/cart">Cart</a></span>
              <span><i>/</i><strong>Checkout</strong></span>
            </nav>

            <div className="shop-empty checkout-empty">
              <span className="shop-empty__icon">🛍️</span>
              <h2>Your Cart is Empty</h2>
              <p>You don&apos;t have any products in your cart to checkout yet. Explore our curated selection of development boards, sensors, and maker components.</p>
              <div className="checkout-empty-actions">
                <a href="/landing-page-two" className="shop-button shop-button--primary">
                  Explore Products
                </a>
                <a href="/wishlist" className="shop-button shop-button--outline">
                  View Saved Wishlist
                </a>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Main Checkout Form
  return (
    <div className="shop-page-frame">
      <Header />
      <main className="shop-main checkout-page">
        <div className="shop-container">
          <nav className="shop-breadcrumbs" aria-label="Breadcrumb">
            <a href="/landing-page-two">Home</a>
            <span><i>/</i><a href="/cart">Cart</a></span>
            <span><i>/</i><strong>Checkout</strong></span>
          </nav>

          <div className="shop-page-title checkout-header">
            <div>
              <p className="shop-eyebrow">FAST &amp; SECURE CHECKOUT</p>
              <h1>Delivery &amp; Payment</h1>
              <p>Complete your shipping details and select your preferred payment method.</p>
            </div>
            <a className="shop-text-link" href="/cart">← Back to Cart</a>
          </div>

          <form onSubmit={handlePlaceOrder} className="checkout-layout" noValidate>
            {/* Left Column: Form Fields & Payment */}
            <div className="checkout-main-col">
              {/* 1. Contact Information */}
              <section className="checkout-section">
                <div className="checkout-section__header">
                  <span className="checkout-step-number">1</span>
                  <div>
                    <h2>Customer Information</h2>
                    <p>Enter your details for order notifications and shipment tracking</p>
                  </div>
                </div>

                <div className="checkout-fields-grid checkout-fields-grid--3">
                  <div className="checkout-field">
                    <label htmlFor="chk-fullName">
                      Full Name <span className="req">*</span>
                    </label>
                    <input
                      id="chk-fullName"
                      type="text"
                      placeholder="e.g. Aarav Sharma"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) setErrors({ ...errors, fullName: null });
                      }}
                      className={errors.fullName ? "checkout-input checkout-input--error" : "checkout-input"}
                    />
                    {errors.fullName && <span className="checkout-error-msg">{errors.fullName}</span>}
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="chk-email">
                      Email Address <span className="req">*</span>
                    </label>
                    <input
                      id="chk-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: null });
                      }}
                      className={errors.email ? "checkout-input checkout-input--error" : "checkout-input"}
                    />
                    {errors.email && <span className="checkout-error-msg">{errors.email}</span>}
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="chk-mobile">
                      Mobile Number <span className="req">*</span>
                    </label>
                    <div className="checkout-mobile-wrap">
                      <span className="checkout-mobile-prefix">+91</span>
                      <input
                        id="chk-mobile"
                        type="tel"
                        maxLength="10"
                        placeholder="10-digit number"
                        value={mobile}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setMobile(val);
                          if (errors.mobile) setErrors({ ...errors, mobile: null });
                        }}
                        className={errors.mobile ? "checkout-input checkout-input--error" : "checkout-input"}
                      />
                    </div>
                    {errors.mobile && <span className="checkout-error-msg">{errors.mobile}</span>}
                  </div>
                </div>
              </section>

              {/* 2. Delivery Address */}
              <section className="checkout-section">
                <div className="checkout-section__header">
                  <span className="checkout-step-number">2</span>
                  <div>
                    <h2>Delivery Address</h2>
                    <p>Where should we deliver your order?</p>
                  </div>
                </div>

                {/* Saved addresses selector */}
                {savedAddresses.length > 0 && (
                  <div className="checkout-saved-addresses">
                    <label className="checkout-subheading">Choose a delivery address:</label>
                    <div className="checkout-address-cards">
                      {savedAddresses.map((addr) => (
                        <label
                          key={addr.id}
                          className={`checkout-address-card ${selectedAddressId === addr.id ? "is-selected" : ""}`}
                        >
                          <input
                            type="radio"
                            name="addressSelect"
                            value={addr.id}
                            checked={selectedAddressId === addr.id}
                            onChange={() => handleAddressSelect(addr.id)}
                          />
                          <div className="checkout-address-card__content">
                            <div className="checkout-address-card__top">
                              <strong>{addr.fullName}</strong>
                              <span className="checkout-address-tag">Saved</span>
                            </div>
                            <p>{addr.address}, {addr.landmark ? `${addr.landmark}, ` : ""}{addr.city}, {addr.state} – {addr.pincode}</p>
                            <small>📞 +91 {addr.mobile}</small>
                          </div>
                        </label>
                      ))}

                      <label
                        className={`checkout-address-card checkout-address-card--new ${selectedAddressId === "new" ? "is-selected" : ""}`}
                      >
                        <input
                          type="radio"
                          name="addressSelect"
                          value="new"
                          checked={selectedAddressId === "new"}
                          onChange={() => handleAddressSelect("new")}
                        />
                        <div className="checkout-address-card__content">
                          <strong>+ Add New Delivery Address</strong>
                          <p>Enter a different doorstep shipping address</p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Address Form Inputs */}
                <div className="checkout-fields-grid checkout-fields-grid--1">
                  <div className="checkout-field">
                    <label htmlFor="chk-address">
                      Street Address / Flat / Building / Area <span className="req">*</span>
                    </label>
                    <input
                      id="chk-address"
                      type="text"
                      placeholder="e.g. Flat 301, Tower B, Green Meadows, MG Road"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (errors.address) setErrors({ ...errors, address: null });
                      }}
                      className={errors.address ? "checkout-input checkout-input--error" : "checkout-input"}
                    />
                    {errors.address && <span className="checkout-error-msg">{errors.address}</span>}
                  </div>
                </div>

                <div className="checkout-fields-grid checkout-fields-grid--2">
                  <div className="checkout-field">
                    <label htmlFor="chk-landmark">Landmark (Optional)</label>
                    <input
                      id="chk-landmark"
                      type="text"
                      placeholder="e.g. Near Metro Pillar 140 or Opposite Bank"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="checkout-input"
                    />
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="chk-city">
                      City / District <span className="req">*</span>
                    </label>
                    <input
                      id="chk-city"
                      type="text"
                      placeholder="e.g. Bengaluru, Delhi, Mumbai"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (errors.city) setErrors({ ...errors, city: null });
                      }}
                      className={errors.city ? "checkout-input checkout-input--error" : "checkout-input"}
                    />
                    {errors.city && <span className="checkout-error-msg">{errors.city}</span>}
                  </div>
                </div>

                <div className="checkout-fields-grid checkout-fields-grid--2">
                  <div className="checkout-field">
                    <label htmlFor="chk-state">
                      State / UT <span className="req">*</span>
                    </label>
                    <select
                      id="chk-state"
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
                        if (errors.state) setErrors({ ...errors, state: null });
                      }}
                      className={errors.state ? "checkout-input checkout-input--error" : "checkout-input"}
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {errors.state && <span className="checkout-error-msg">{errors.state}</span>}
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="chk-pincode">
                      PIN Code <span className="req">*</span>
                    </label>
                    <input
                      id="chk-pincode"
                      type="text"
                      maxLength="6"
                      placeholder="e.g. 560100"
                      value={pincode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setPincode(val);
                        if (errors.pincode) setErrors({ ...errors, pincode: null });
                      }}
                      className={errors.pincode ? "checkout-input checkout-input--error" : "checkout-input"}
                    />
                    {errors.pincode && <span className="checkout-error-msg">{errors.pincode}</span>}
                  </div>
                </div>

                <div className="checkout-checkbox-row">
                  <label className="checkout-checkbox">
                    <input
                      type="checkbox"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                    />
                    <span>Save this address to my profile for faster checkout</span>
                  </label>
                </div>
              </section>

              {/* 3. Payment Method */}
              <section className="checkout-section">
                <div className="checkout-section__header">
                  <span className="checkout-step-number">3</span>
                  <div>
                    <h2>Payment Method</h2>
                    <p>Select your preferred mode of payment</p>
                  </div>
                </div>

                <div className="checkout-payment-methods">
                  {/* COD */}
                  <label className={`checkout-pay-option ${paymentMethod === "cod" ? "is-active" : ""}`}>
                    <div className="checkout-pay-option__head">
                      <input
                        type="radio"
                        name="payMethod"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                      />
                      <div className="checkout-pay-option__title">
                        <strong>Cash on Delivery (COD)</strong>
                        <span>Pay in cash or scan QR code when your package arrives at your door</span>
                      </div>
                      <span className="checkout-pay-badge">Recommended</span>
                    </div>
                    {paymentMethod === "cod" && (
                      <div className="checkout-pay-details">
                        <div className="checkout-cod-note">
                          <span>✓</span> Zero extra fee on Cash on Delivery. Keep exact change or scan UPI on arrival.
                        </div>
                      </div>
                    )}
                  </label>

                  {/* UPI */}
                  <label className={`checkout-pay-option ${paymentMethod === "upi" ? "is-active" : ""}`}>
                    <div className="checkout-pay-option__head">
                      <input
                        type="radio"
                        name="payMethod"
                        value="upi"
                        checked={paymentMethod === "upi"}
                        onChange={() => setPaymentMethod("upi")}
                      />
                      <div className="checkout-pay-option__title">
                        <strong>Instant UPI</strong>
                        <span>Google Pay, PhonePe, Paytm, BHIM or any UPI ID</span>
                      </div>
                      <span className="checkout-pay-icons">⚡ Fast</span>
                    </div>
                    {paymentMethod === "upi" && (
                      <div className="checkout-pay-details">
                        <p className="checkout-upi-hint">Select your preferred UPI app or enter your VPA / UPI ID:</p>
                        <div className="checkout-upi-apps">
                          {[
                            { id: "gpay", name: "Google Pay" },
                            { id: "phonepe", name: "PhonePe" },
                            { id: "paytm", name: "Paytm" },
                            { id: "other", name: "Enter UPI ID" },
                          ].map((app) => (
                            <button
                              type="button"
                              key={app.id}
                              className={`checkout-upi-btn ${selectedUpiApp === app.id ? "is-selected" : ""}`}
                              onClick={() => setSelectedUpiApp(app.id)}
                            >
                              {app.name}
                            </button>
                          ))}
                        </div>

                        {selectedUpiApp === "other" && (
                          <div className="checkout-field checkout-upi-input-wrap">
                            <label htmlFor="chk-upiId">Your UPI ID (VPA)</label>
                            <input
                              id="chk-upiId"
                              type="text"
                              placeholder="e.g. mobile@okaxis or name@paytm"
                              value={upiId}
                              onChange={(e) => {
                                setUpiId(e.target.value);
                                if (errors.upiId) setErrors({ ...errors, upiId: null });
                              }}
                              className={errors.upiId ? "checkout-input checkout-input--error" : "checkout-input"}
                            />
                            {errors.upiId && <span className="checkout-error-msg">{errors.upiId}</span>}
                          </div>
                        )}
                        <small className="checkout-demo-disclaimer">
                          🔒 Demo UPI Mode: Seamless instant order verification for local testing.
                        </small>
                      </div>
                    )}
                  </label>

                  {/* Card */}
                  <label className={`checkout-pay-option ${paymentMethod === "card" ? "is-active" : ""}`}>
                    <div className="checkout-pay-option__head">
                      <input
                        type="radio"
                        name="payMethod"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                      />
                      <div className="checkout-pay-option__title">
                        <strong>Debit / Credit Card / Net Banking</strong>
                        <span>Visa, MasterCard, RuPay, Maestro &amp; major Indian banks</span>
                      </div>
                    </div>
                    {paymentMethod === "card" && (
                      <div className="checkout-pay-details">
                        <div className="checkout-fields-grid checkout-fields-grid--1">
                          <div className="checkout-field">
                            <label htmlFor="chk-cardHolder">Cardholder Name</label>
                            <input
                              id="chk-cardHolder"
                              type="text"
                              placeholder="Name on card"
                              value={cardHolder}
                              onChange={(e) => setCardHolder(e.target.value)}
                              className="checkout-input"
                            />
                          </div>
                        </div>
                        <div className="checkout-fields-grid checkout-fields-grid--1">
                          <div className="checkout-field">
                            <label htmlFor="chk-cardNumber">Card Number</label>
                            <input
                              id="chk-cardNumber"
                              type="text"
                              maxLength="19"
                              placeholder="4000 1234 5678 9010"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              className="checkout-input"
                            />
                          </div>
                        </div>
                        <div className="checkout-fields-grid checkout-fields-grid--2">
                          <div className="checkout-field">
                            <label htmlFor="chk-cardExpiry">Expiry (MM/YY)</label>
                            <input
                              id="chk-cardExpiry"
                              type="text"
                              maxLength="5"
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="checkout-input"
                            />
                          </div>
                          <div className="checkout-field">
                            <label htmlFor="chk-cardCvv">CVV</label>
                            <input
                              id="chk-cardCvv"
                              type="password"
                              maxLength="4"
                              placeholder="•••"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              className="checkout-input"
                            />
                          </div>
                        </div>
                        <small className="checkout-demo-disclaimer">
                          🔒 Demo Card Mode: No real banking API is invoked; do not enter sensitive real cards.
                        </small>
                      </div>
                    )}
                  </label>
                </div>
              </section>
            </div>

            {/* Right Column: Order Summary & Placement */}
            <aside className="checkout-side-col">
              <div className="checkout-card checkout-order-summary">
                <h2>Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)})</h2>

                {/* Items List */}
                <div className="checkout-items-list">
                  {cart.map(({ product, quantity }) => (
                    <div className="checkout-cart-item" key={product.id}>
                      <div className="checkout-cart-item__thumb">
                        <img src={imageUrl(product.image, 160)} alt={product.name} />
                        <span className="checkout-cart-item__badge">{quantity}</span>
                      </div>
                      <div className="checkout-cart-item__details">
                        <h4>{product.name}</h4>
                        <span className="checkout-cart-item__cat">{product.category}</span>
                        <div className="checkout-cart-item__price">
                          {quantity} × {money(product.price)}
                        </div>
                      </div>
                      <strong className="checkout-cart-item__subtotal">
                        {money(product.price * quantity)}
                      </strong>
                    </div>
                  ))}
                </div>

                {/* Coupon Box */}
                <div className="checkout-coupon-box">
                  <label htmlFor="chk-coupon">Coupon or Discount Code</label>
                  {!appliedCoupon ? (
                    <div className="checkout-coupon-row">
                      <input
                        id="chk-coupon"
                        type="text"
                        placeholder="e.g. MITRA10"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <button type="button" onClick={handleApplyCoupon}>
                        Apply
                      </button>
                    </div>
                  ) : (
                    <div className="checkout-coupon-applied">
                      <div>
                        <strong>{appliedCoupon.code} applied</strong>
                        <small>{appliedCoupon.label}</small>
                      </div>
                      <button type="button" onClick={handleRemoveCoupon}>
                        Remove
                      </button>
                    </div>
                  )}
                  {couponMessage && (
                    <small className={appliedCoupon ? "checkout-msg-success" : "checkout-msg-error"}>
                      {couponMessage}
                    </small>
                  )}
                  {!appliedCoupon && (
                    <span className="checkout-coupon-tip">
                      💡 Tip: Use code <strong>MITRA10</strong> for 10% off.
                    </span>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="checkout-breakdown">
                  <div className="checkout-breakdown-row">
                    <span>Subtotal</span>
                    <strong>{money(subtotal)}</strong>
                  </div>
                  {discount > 0 && (
                    <div className="checkout-breakdown-row checkout-breakdown-row--discount">
                      <span>Discount</span>
                      <strong>−{money(discount)}</strong>
                    </div>
                  )}
                  <div className="checkout-breakdown-row">
                    <span>Shipping Charges</span>
                    <strong>{shipping === 0 ? "FREE" : money(shipping)}</strong>
                  </div>
                  {shipping > 0 && (
                    <p className="checkout-free-shipping-hint">
                      Add {money(1999 - (subtotal - discount))} more for FREE delivery
                    </p>
                  )}
                  <div className="checkout-breakdown-total">
                    <span>Grand Total</span>
                    <strong>{money(grandTotal)}</strong>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="shop-button shop-button--primary checkout-submit-btn"
                >
                  {isSubmitting ? "Processing Order..." : `Place Order • ${money(grandTotal)}`}
                </button>

                <div className="checkout-security-notes">
                  <span>🔒 256-bit encrypted checkout</span>
                  <span>📦 Carefully packed &amp; tested</span>
                  <span>↻ Easy 7-day maker returns</span>
                </div>
              </div>
            </aside>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
