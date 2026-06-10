import { useState, useEffect, useRef } from "react";

// ─── TRANSLATIONS ───────────────────────────────────────────────
const T = {
  en: {
    tagline: "Luxury Beauty, Curated for You",
    nav: { makeup: "Makeup", skincare: "Skincare", cart: "Cart", language: "AR" },
    shopModes: { ready: "Ready to Ship", preorder: "Pre-Order" },
    shopModeSub: { ready: "In stock — ships within 48 hours", preorder: "Reserve yours before it arrives" },
    makeupSubs: ["Face", "Eyes", "Lips", "Brows"],
    skincareSubs: ["Cleanse", "Treat", "Moisturise", "Protect"],
    addToCart: "Add to Bag",
    preorderBtn: "Pre-Order Now",
    currency: "IQD",
    cartTitle: "Your Bag",
    cartEmpty: "Your bag is empty.",
    subtotal: "Subtotal",
    checkout: "Proceed to Checkout",
    paymentTitle: "Payment Method",
    payOnline: "Pay Online (Card / Visa)",
    payOnDelivery: "Cash on Delivery",
    payOnlineSub: "Secure checkout via card",
    payOnDeliverySub: "Pay when your order arrives",
    placeOrder: "Place Order",
    orderSuccess: "Order placed successfully!",
    orderSuccessSub: "We'll contact you shortly to confirm.",
    preorderBadge: "Pre-Order",
    readyBadge: "In Stock",
    heroBtn: "Explore Collection",
    allProducts: "All",
    preorderNote: "Expected delivery: 3–4 weeks",
    close: "Close",
    orderSummary: "Order Summary",
    shipping: "Shipping",
    free: "Free",
    aiAssistant: "Beauty Assistant",
    aiGreeting: "Hello! I'm your Luxa beauty advisor. Ask me anything about skincare routines, makeup tips, or finding the perfect product for you.",
    aiPlaceholder: "Ask about skincare, makeup, shades...",
    aiSend: "Send",
  },
  ar: {
    tagline: "جمال فاخر، مختار لكِ",
    nav: { makeup: "مكياج", skincare: "سكن كير", cart: "الحقيبة", language: "EN" },
    shopModes: { ready: "متوفر الآن", preorder: "حجز مسبق" },
    shopModeSub: { ready: "متوفر — يُشحن خلال 48 ساعة", preorder: "احجزي قبل أن يصل" },
    makeupSubs: ["وجه", "عيون", "شفاه", "حواجب"],
    skincareSubs: ["تنظيف", "علاج", "ترطيب", "حماية"],
    addToCart: "أضيفي للحقيبة",
    preorderBtn: "احجزي الآن",
    currency: "د.ع",
    cartTitle: "حقيبتكِ",
    cartEmpty: "حقيبتكِ فارغة.",
    subtotal: "المجموع",
    checkout: "إتمام الطلب",
    paymentTitle: "طريقة الدفع",
    payOnline: "الدفع الإلكتروني (بطاقة)",
    payOnDelivery: "الدفع عند الاستلام",
    payOnlineSub: "دفع آمن عبر البطاقة",
    payOnDeliverySub: "ادفعي عند وصول طلبكِ",
    placeOrder: "تأكيد الطلب",
    orderSuccess: "تم تأكيد طلبكِ!",
    orderSuccessSub: "سنتواصل معكِ قريباً لتأكيد التفاصيل.",
    preorderBadge: "حجز مسبق",
    readyBadge: "متوفر",
    heroBtn: "استكشفي المجموعة",
    allProducts: "الكل",
    preorderNote: "التوصيل المتوقع: 3–4 أسابيع",
    close: "إغلاق",
    orderSummary: "ملخص الطلب",
    shipping: "الشحن",
    free: "مجاناً",
    aiAssistant: "مستشارة الجمال",
    aiGreeting: "أهلاً! أنا مستشارة جمال لوكسا. اسأليني عن روتين العناية بالبشرة أو نصائح المكياج أو المنتج المناسب لكِ.",
    aiPlaceholder: "اسأليني عن البشرة، المكياج، الألوان...",
    aiSend: "إرسال",
  }
};

// ─── PRODUCTS ───────────────────────────────────────────────────
const PRODUCTS = [
  // MAKEUP — Face
  { id: 1, cat: "makeup", sub: 0, name: "Luminous Silk Foundation", nameAr: "كريم أساس لومينوس سيلك", price: 85000, mode: "ready", desc: "Weightless coverage with a natural satin finish.", descAr: "تغطية خفيفة بلمسة ساتان طبيعية.", emoji: "✦" },
  { id: 2, cat: "makeup", sub: 0, name: "Velvet Blush Duo", nameAr: "احمرار خدود مخملي ثنائي", price: 62000, mode: "preorder", desc: "Two complementary shades for a sculpted glow.", descAr: "تونان متناسقان لإشراقة محددة.", emoji: "◈" },
  // MAKEUP — Eyes
  { id: 3, cat: "makeup", sub: 1, name: "Noir Precision Liner", nameAr: "آيلاينر نوار الدقيق", price: 48000, mode: "ready", desc: "Ultra-fine tip for flawless definition.", descAr: "طرف فائق الدقة لخط عيون مثالي.", emoji: "◉" },
  { id: 4, cat: "makeup", sub: 1, name: "Obsidian Shadow Palette", nameAr: "باليت ظلال أوبسيديان", price: 135000, mode: "preorder", desc: "12 curated shades from nude to dramatic.", descAr: "12 لوناً من النود حتى الدرامي.", emoji: "⬡" },
  // MAKEUP — Lips
  { id: 5, cat: "makeup", sub: 2, name: "Satin Rouge Lipstick", nameAr: "أحمر شفاه ساتان روج", price: 55000, mode: "ready", desc: "Rich pigment, feather-light wear.", descAr: "تصبيغ غني وملمس خفيف كالريشة.", emoji: "◆" },
  { id: 6, cat: "makeup", sub: 2, name: "Crystal Lip Gloss", nameAr: "غلوس كريستال", price: 38000, mode: "ready", desc: "Mirror-finish gloss with plumping complex.", descAr: "لمعة بمظهر المرآة مع مركب تحجيم.", emoji: "◇" },
  // MAKEUP — Brows
  { id: 7, cat: "makeup", sub: 3, name: "Brow Architect Pencil", nameAr: "قلم بروو أركيتكت", price: 42000, mode: "ready", desc: "Micro-tip pencil for hair-stroke precision.", descAr: "طرف دقيق لرسم شعرات الحاجب.", emoji: "⌇" },
  { id: 8, cat: "makeup", sub: 3, name: "Tinted Brow Serum", nameAr: "سيروم حواجب ملون", price: 58000, mode: "preorder", desc: "24hr hold serum with growth peptides.", descAr: "سيروم ثبات 24 ساعة مع ببتيدات النمو.", emoji: "⌁" },
  // SKINCARE — Cleanse
  { id: 9, cat: "skincare", sub: 0, name: "Micellar Cleansing Water", nameAr: "ماء ميسيلار للتنظيف", price: 45000, mode: "ready", desc: "Removes all traces of makeup effortlessly.", descAr: "يزيل كل آثار المكياج بسهولة.", emoji: "○" },
  { id: 10, cat: "skincare", sub: 0, name: "Foam Cleansing Ritual", nameAr: "غسول رغوي طقوس", price: 52000, mode: "preorder", desc: "Purifying foam that respects the skin barrier.", descAr: "رغوة منقية تحترم حاجز البشرة.", emoji: "◌" },
  // SKINCARE — Treat
  { id: 11, cat: "skincare", sub: 1, name: "Vitamin C Radiance Serum", nameAr: "سيروم فيتامين C المضيء", price: 98000, mode: "ready", desc: "15% stabilised Vitamin C for visible brightness.", descAr: "15% فيتامين C مستقر لإشراقة ظاهرة.", emoji: "✧" },
  { id: 12, cat: "skincare", sub: 1, name: "Retinol Night Renewal", nameAr: "ريتينول تجديد الليل", price: 115000, mode: "preorder", desc: "0.3% retinol complex for overnight renewal.", descAr: "0.3% ريتينول لتجديد بشرتكِ أثناء النوم.", emoji: "✦" },
  // SKINCARE — Moisturise
  { id: 13, cat: "skincare", sub: 2, name: "Hydra-Plump Cream", nameAr: "كريم هيدرا بلامب", price: 78000, mode: "ready", desc: "72-hour hydration with hyaluronic acid complex.", descAr: "ترطيب 72 ساعة بمركب الهيالورونيك أسيد.", emoji: "◎" },
  { id: 14, cat: "skincare", sub: 2, name: "Barrier Repair Balm", nameAr: "بلم إصلاح الحاجز", price: 88000, mode: "preorder", desc: "Ceramide-rich balm for sensitive or dry skin.", descAr: "بلم غني بالسيراميد للبشرة الحساسة أو الجافة.", emoji: "◍" },
  // SKINCARE — Protect
  { id: 15, cat: "skincare", sub: 3, name: "UV Shield SPF 50+", nameAr: "درع الأشعة SPF 50+", price: 67000, mode: "ready", desc: "Invisible, non-greasy broad-spectrum protection.", descAr: "حماية شاملة، غير مرئية وغير دهنية.", emoji: "◐" },
  { id: 16, cat: "skincare", sub: 3, name: "Antioxidant Day Veil", nameAr: "حجاب نهاري مضاد للأكسدة", price: 72000, mode: "preorder", desc: "Lightweight veil with pollution defense complex.", descAr: "حجاب خفيف مع مركب دفاع ضد التلوث.", emoji: "◑" },
];

const AI_SYSTEM = `You are a luxury beauty advisor for LUXA, an upscale beauty brand. Speak concisely and elegantly — max 3 sentences. You advise on skincare routines, makeup application, product recommendations from the LUXA range. Products: ${PRODUCTS.map(p=>`${p.name} (${p.cat}, ${p.price.toLocaleString()} IQD)`).join(', ')}. If user writes in Arabic, respond in Arabic. If English, respond in English.`;

// ─── COLORS & STYLE TOKENS ──────────────────────────────────────
const C = {
  black: "#0A0A0A",
  offwhite: "#F8F5F0",
  champagne: "#E8D9C0",
  gold: "#B8975A",
  goldLight: "#D4AF72",
  muted: "#6B6460",
  border: "#E0D8D0",
  white: "#FFFFFF",
  overlay: "rgba(10,10,10,0.55)",
};

const fmt = (price, lang) =>
  lang === "ar"
    ? `${price.toLocaleString()} د.ع`
    : `${price.toLocaleString()} IQD`;

// ─── MAIN COMPONENT ─────────────────────────────────────────────
export default function LuxaStore() {
  const [lang, setLang] = useState("en");
  const [shopMode, setShopMode] = useState("ready"); // "ready" | "preorder"
  const [mainCat, setMainCat] = useState("makeup"); // "makeup" | "skincare"
  const [subCat, setSubCat] = useState(0);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0); // 0=cart,1=payment,2=success
  const [payMethod, setPayMethod] = useState("online");
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const msgEndRef = useRef(null);
  const t = T[lang];
  const isAr = lang === "ar";
  const dir = isAr ? "rtl" : "ltr";

  useEffect(() => {
    setSubCat(0);
  }, [mainCat]);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatOpen && messages.length === 0) {
      setMessages([{ role: "assistant", text: t.aiGreeting }]);
    }
  }, [chatOpen]);

  const subs = mainCat === "makeup" ? t.makeupSubs : t.skincareSubs;

  const filtered = PRODUCTS.filter(
    p => p.cat === mainCat && p.sub === subCat && p.mode === shopMode
  );

  const addToCart = (p) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      return ex ? prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...p, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const sendAI = async () => {
    if (!aiInput.trim() || aiLoading) return;
    const msg = aiInput.trim();
    setAiInput("");
    const newMessages = [...messages, { role: "user", text: msg }];
    setMessages(newMessages);
    setAiLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: AI_SYSTEM,
          messages: newMessages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text }))
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", text: data.content?.[0]?.text || "..." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: isAr ? "عذراً، حدث خطأ." : "Sorry, something went wrong." }]);
    }
    setAiLoading(false);
  };

  // ── STYLES ──────────────────────────────────────────────────
  const S = {
    root: { fontFamily: "'Cormorant Garamond', 'Georgia', serif", background: C.offwhite, minHeight: "100vh", direction: dir, color: C.black },
    // NAV
    nav: { background: C.white, borderBottom: `1px solid ${C.border}`, padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, position: "sticky", top: 0, zIndex: 500 },
    logo: { fontSize: 22, letterSpacing: 8, fontWeight: 400, color: C.black, textTransform: "uppercase" },
    navRight: { display: "flex", alignItems: "center", gap: 20 },
    navBtn: { background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12, letterSpacing: 3, color: C.muted, textTransform: "uppercase", padding: "4px 0" },
    cartBtn: { background: C.black, color: C.white, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", padding: "10px 20px", display: "flex", alignItems: "center", gap: 8 },
    // HERO
    hero: { background: C.black, color: C.white, textAlign: "center", padding: "72px 24px 64px", position: "relative", overflow: "hidden" },
    heroTitle: { fontSize: 52, fontWeight: 300, letterSpacing: 12, textTransform: "uppercase", margin: "0 0 12px", lineHeight: 1.1 },
    heroSub: { fontSize: 14, letterSpacing: 4, color: C.champagne, fontWeight: 300, marginBottom: 32, fontFamily: "'Gill Sans', 'Optima', sans-serif" },
    heroCTA: { background: "none", border: `1px solid ${C.champagne}`, color: C.champagne, padding: "12px 36px", cursor: "pointer", fontFamily: "inherit", fontSize: 11, letterSpacing: 4, textTransform: "uppercase" },
    // MODE TOGGLE
    modeBar: { background: C.white, borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "center", gap: 0 },
    modeBtn: (active) => ({ flex: "0 0 auto", padding: "16px 40px", background: active ? C.black : "none", color: active ? C.white : C.muted, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", borderBottom: active ? "none" : `2px solid transparent`, transition: "all 0.2s" }),
    // CAT BAR
    catBar: { display: "flex", justifyContent: "center", gap: 32, padding: "20px 24px 0", borderBottom: `1px solid ${C.border}`, background: C.white },
    catBtn: (active) => ({ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: active ? C.black : C.muted, paddingBottom: 16, borderBottom: active ? `1.5px solid ${C.black}` : "1.5px solid transparent", fontWeight: active ? 600 : 400, transition: "all 0.2s" }),
    // SUB CATS
    subBar: { display: "flex", justifyContent: "center", gap: 24, padding: "16px 24px", background: C.offwhite, borderBottom: `1px solid ${C.border}` },
    subBtn: (active) => ({ background: active ? C.champagne : "none", border: `1px solid ${active ? C.gold : C.border}`, cursor: "pointer", fontFamily: "inherit", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: active ? C.black : C.muted, padding: "6px 18px", transition: "all 0.2s" }),
    // PRODUCTS
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 1, padding: 0, background: C.border },
    card: { background: C.white, padding: "32px 24px", display: "flex", flexDirection: "column", cursor: "default" },
    cardEmoji: { fontSize: 28, marginBottom: 20, color: C.gold },
    cardBadge: (mode) => ({ display: "inline-block", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", padding: "3px 10px", background: mode === "preorder" ? C.black : C.champagne, color: mode === "preorder" ? C.white : C.black, marginBottom: 12, fontFamily: "'Gill Sans', sans-serif" }),
    cardName: { fontSize: 16, fontWeight: 400, margin: "0 0 6px", letterSpacing: 1 },
    cardDesc: { fontSize: 12, color: C.muted, lineHeight: 1.6, margin: "0 0 20px", fontFamily: "'Gill Sans', 'Optima', sans-serif", fontWeight: 300, flexGrow: 1 },
    cardPrice: { fontSize: 15, color: C.black, letterSpacing: 1, marginBottom: 16, fontFamily: "'Gill Sans', sans-serif" },
    cardBtn: { background: C.black, color: C.white, border: "none", padding: "11px 0", cursor: "pointer", fontFamily: "inherit", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", width: "100%", transition: "background 0.2s" },
    emptyState: { textAlign: "center", padding: "80px 24px", color: C.muted, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'Gill Sans', sans-serif" },
    // CART OVERLAY
    overlay: { position: "fixed", inset: 0, background: C.overlay, zIndex: 800 },
    cartPanel: { position: "fixed", top: 0, [isAr ? "left" : "right"]: 0, width: 400, maxWidth: "100vw", height: "100vh", background: C.white, zIndex: 900, display: "flex", flexDirection: "column", overflowY: "auto" },
    cartHeader: { padding: "28px 28px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" },
    cartTitle: { fontSize: 14, letterSpacing: 4, textTransform: "uppercase", fontWeight: 400 },
    closeBtn: { background: "none", border: "none", cursor: "pointer", fontSize: 18, color: C.muted, fontFamily: "inherit" },
    cartItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 28px", borderBottom: `1px solid ${C.border}` },
    cartItemInfo: { flex: 1 },
    cartItemName: { fontSize: 13, marginBottom: 4, fontWeight: 400 },
    cartItemPrice: { fontSize: 12, color: C.muted, fontFamily: "'Gill Sans', sans-serif" },
    cartRemove: { background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 16, padding: "0 8px" },
    cartFooter: { padding: "24px 28px", marginTop: "auto", borderTop: `1px solid ${C.border}` },
    // PAYMENT
    payOption: (active) => ({ border: `1px solid ${active ? C.black : C.border}`, padding: "16px 20px", marginBottom: 12, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", background: active ? C.offwhite : C.white, transition: "all 0.2s" }),
    payLabel: { fontSize: 13, fontWeight: active => active ? 600 : 400, letterSpacing: 1 },
    payDot: (active) => ({ width: 14, height: 14, borderRadius: "50%", border: `1.5px solid ${active ? C.black : C.border}`, background: active ? C.black : "none", flexShrink: 0 }),
    // BOTTOM CTA BAR (total + checkout)
    stickyBar: { background: C.black, color: C.white, padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" },
    stickyBarBtn: { background: "none", border: `1px solid ${C.champagne}`, color: C.champagne, padding: "10px 24px", cursor: "pointer", fontFamily: "inherit", fontSize: 10, letterSpacing: 3, textTransform: "uppercase" },
    // SUCCESS
    success: { textAlign: "center", padding: "64px 28px" },
    successIcon: { fontSize: 40, marginBottom: 24, color: C.gold },
    successTitle: { fontSize: 22, letterSpacing: 3, fontWeight: 300, marginBottom: 12 },
    successSub: { fontSize: 13, color: C.muted, letterSpacing: 1, fontFamily: "'Gill Sans', sans-serif" },
    // AI CHAT
    chatFab: { position: "fixed", bottom: 28, [isAr ? "right" : "left"]: 28, background: C.black, color: C.white, border: "none", borderRadius: 0, width: 52, height: 52, cursor: "pointer", fontSize: 20, zIndex: 600, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" },
    chatPanel: { position: "fixed", bottom: 90, [isAr ? "right" : "left"]: 28, width: 340, maxWidth: "calc(100vw - 56px)", background: C.white, zIndex: 700, boxShadow: "0 8px 40px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", border: `1px solid ${C.border}` },
    chatHead: { background: C.black, color: C.white, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" },
    chatHeadTitle: { fontSize: 11, letterSpacing: 4, textTransform: "uppercase" },
    chatBody: { flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10, maxHeight: 300 },
    chatMsg: (role) => ({ maxWidth: "85%", padding: "10px 14px", fontSize: 12, lineHeight: 1.6, fontFamily: "'Gill Sans', sans-serif", alignSelf: role === "user" ? (isAr ? "flex-end" : "flex-start") : (isAr ? "flex-start" : "flex-end"), background: role === "user" ? C.offwhite : C.black, color: role === "user" ? C.black : C.white }),
    chatInput: { display: "flex", borderTop: `1px solid ${C.border}`, padding: 12, gap: 8 },
    chatField: { flex: 1, border: `1px solid ${C.border}`, padding: "8px 12px", fontFamily: "inherit", fontSize: 12, outline: "none", background: C.offwhite },
    chatSendBtn: { background: C.black, color: C.white, border: "none", padding: "8px 14px", cursor: "pointer", fontFamily: "inherit", fontSize: 10, letterSpacing: 2 },
  };

  const renderCartContent = () => {
    if (checkoutStep === 2) return (
      <div style={S.success}>
        <div style={S.successIcon}>✦</div>
        <h2 style={S.successTitle}>{t.orderSuccess}</h2>
        <p style={{ ...S.successSub, marginBottom: 32 }}>{t.orderSuccessSub}</p>
        <button style={{ ...S.cartBtn, margin: "0 auto" }} onClick={() => { setCartOpen(false); setCheckoutStep(0); setCart([]); }}>{t.close}</button>
      </div>
    );

    if (checkoutStep === 1) return (
      <>
        <div style={S.cartHeader}>
          <span style={S.cartTitle}>{t.paymentTitle}</span>
          <button style={S.closeBtn} onClick={() => setCheckoutStep(0)}>←</button>
        </div>
        <div style={{ padding: "24px 28px", flex: 1 }}>
          {/* Order summary */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.muted, marginBottom: 14, fontFamily: "'Gill Sans', sans-serif" }}>{t.orderSummary}</p>
            {cart.map(i => (
              <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8, fontFamily: "'Gill Sans', sans-serif" }}>
                <span>{isAr ? i.nameAr : i.name} × {i.qty}</span>
                <span>{fmt(i.price * i.qty, lang)}</span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, fontFamily: "'Gill Sans', sans-serif" }}>
              <span>{t.subtotal}</span><span>{fmt(cartTotal, lang)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted, marginTop: 6, fontFamily: "'Gill Sans', sans-serif" }}>
              <span>{t.shipping}</span><span>{t.free}</span>
            </div>
          </div>
          {/* Payment options */}
          <p style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.muted, marginBottom: 14, fontFamily: "'Gill Sans', sans-serif" }}>{t.paymentTitle}</p>
          {[
            { key: "online", label: t.payOnline, sub: t.payOnlineSub, icon: "💳" },
            { key: "cod", label: t.payOnDelivery, sub: t.payOnDeliverySub, icon: "📦" },
          ].map(opt => (
            <div key={opt.key} style={S.payOption(payMethod === opt.key)} onClick={() => setPayMethod(opt.key)}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 18 }}>{opt.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: payMethod === opt.key ? 600 : 400 }}>{opt.label}</div>
                  <div style={{ fontSize: 11, color: C.muted, fontFamily: "'Gill Sans', sans-serif" }}>{opt.sub}</div>
                </div>
              </div>
              <div style={S.payDot(payMethod === opt.key)} />
            </div>
          ))}
        </div>
        <div style={S.stickyBar}>
          <span style={{ fontSize: 14, letterSpacing: 1, fontFamily: "'Gill Sans', sans-serif" }}>{fmt(cartTotal, lang)}</span>
          <button style={S.stickyBarBtn} onClick={() => setCheckoutStep(2)}>{t.placeOrder}</button>
        </div>
      </>
    );

    return (
      <>
        <div style={S.cartHeader}>
          <span style={S.cartTitle}>{t.cartTitle}</span>
          <button style={S.closeBtn} onClick={() => setCartOpen(false)}>✕</button>
        </div>
        {cart.length === 0 ? (
          <div style={{ ...S.emptyState, flex: 1 }}>{t.cartEmpty}</div>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {cart.map(i => (
                <div key={i.id} style={S.cartItem}>
                  <div style={S.cartItemInfo}>
                    <div style={S.cartItemName}>{isAr ? i.nameAr : i.name}</div>
                    <div style={S.cartItemPrice}>{fmt(i.price, lang)} × {i.qty}</div>
                  </div>
                  <button style={S.cartRemove} onClick={() => removeFromCart(i.id)}>✕</button>
                </div>
              ))}
            </div>
            <div style={S.stickyBar}>
              <span style={{ fontSize: 14, letterSpacing: 1, fontFamily: "'Gill Sans', sans-serif" }}>{fmt(cartTotal, lang)}</span>
              <button style={S.stickyBarBtn} onClick={() => setCheckoutStep(1)}>{t.checkout}</button>
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <div style={S.root}>
      {/* NAV */}
      <nav style={S.nav}>
        <div style={S.logo}>Luxa</div>
        <div style={S.navRight}>
          <button style={S.navBtn} onClick={() => { setMainCat("makeup"); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}>{t.nav.makeup}</button>
          <button style={S.navBtn} onClick={() => { setMainCat("skincare"); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}>{t.nav.skincare}</button>
          <button style={{ ...S.navBtn, color: C.gold }} onClick={() => setLang(l => l === "en" ? "ar" : "en")}>{t.nav.language}</button>
          <button style={S.cartBtn} onClick={() => { setCartOpen(true); setCheckoutStep(0); }}>
            {t.nav.cart}{cartCount > 0 && <span style={{ background: C.gold, borderRadius: "50%", width: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>{cartCount}</span>}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={S.hero}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, #1a1208 0%, #0A0A0A 70%)", zIndex: 0 }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: 10, letterSpacing: 6, color: C.gold, textTransform: "uppercase", marginBottom: 20, fontFamily: "'Gill Sans', sans-serif" }}>LUXA</p>
          <h1 style={S.heroTitle}>The Art<br />of Beauty</h1>
          <p style={S.heroSub}>{t.tagline}</p>
          <button style={S.heroCTA} onClick={() => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })}>{t.heroBtn}</button>
        </div>
      </section>

      {/* SHOP MODE TOGGLE */}
      <div id="shop">
        <div style={S.modeBar}>
          {["ready", "preorder"].map(m => (
            <button key={m} style={S.modeBtn(shopMode === m)} onClick={() => setShopMode(m)}>
              {t.shopModes[m]}
            </button>
          ))}
        </div>
        <div style={{ textAlign: "center", padding: "10px", background: shopMode === "preorder" ? C.black : C.champagne, color: shopMode === "preorder" ? C.champagne : C.black, fontSize: 11, letterSpacing: 2, fontFamily: "'Gill Sans', sans-serif" }}>
          {t.shopModeSub[shopMode]}{shopMode === "preorder" && <span style={{ marginInlineStart: 16 }}>— {t.preorderNote}</span>}
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div style={S.catBar}>
        {["makeup", "skincare"].map(c => (
          <button key={c} style={S.catBtn(mainCat === c)} onClick={() => setMainCat(c)}>
            {c === "makeup" ? t.nav.makeup : t.nav.skincare}
          </button>
        ))}
      </div>

      {/* SUBCATEGORY TABS */}
      <div style={S.subBar}>
        {subs.map((s, i) => (
          <button key={i} style={S.subBtn(subCat === i)} onClick={() => setSubCat(i)}>{s}</button>
        ))}
      </div>

      {/* PRODUCTS */}
      {filtered.length === 0 ? (
        <div style={S.emptyState}>
          {isAr ? "لا توجد منتجات في هذا القسم حالياً" : "No products in this section yet"}
        </div>
      ) : (
        <div style={S.grid}>
          {filtered.map(p => (
            <div key={p.id} style={S.card}
              onMouseEnter={e => e.currentTarget.style.background = C.offwhite}
              onMouseLeave={e => e.currentTarget.style.background = C.white}>
              <div style={S.cardEmoji}>{p.emoji}</div>
              <span style={S.cardBadge(p.mode)}>{p.mode === "preorder" ? t.preorderBadge : t.readyBadge}</span>
              <h3 style={S.cardName}>{isAr ? p.nameAr : p.name}</h3>
              <p style={S.cardDesc}>{isAr ? p.descAr : p.desc}</p>
              <div style={S.cardPrice}>{fmt(p.price, lang)}</div>
              <button style={S.cardBtn}
                onMouseEnter={e => e.currentTarget.style.background = C.muted}
                onMouseLeave={e => e.currentTarget.style.background = C.black}
                onClick={() => addToCart(p)}>
                {p.mode === "preorder" ? t.preorderBtn : t.addToCart}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ background: C.black, color: C.muted, textAlign: "center", padding: "40px 24px", fontSize: 10, letterSpacing: 4, textTransform: "uppercase", fontFamily: "'Gill Sans', sans-serif" }}>
        <p style={{ color: C.champagne, fontSize: 18, letterSpacing: 8, marginBottom: 12, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>LUXA</p>
        <p>© 2025 Luxa Beauty — {isAr ? "جميع الحقوق محفوظة" : "All Rights Reserved"}</p>
      </footer>

      {/* CART OVERLAY */}
      {cartOpen && (
        <>
          <div style={S.overlay} onClick={() => setCartOpen(false)} />
          <div style={S.cartPanel}>{renderCartContent()}</div>
        </>
      )}

      {/* AI CHAT */}
      {chatOpen && (
        <div style={S.chatPanel}>
          <div style={S.chatHead}>
            <span style={S.chatHeadTitle}>{t.aiAssistant}</span>
            <button style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 16 }} onClick={() => setChatOpen(false)}>✕</button>
          </div>
          <div style={S.chatBody}>
            {messages.map((m, i) => (
              <div key={i} style={S.chatMsg(m.role)}>{m.text}</div>
            ))}
            {aiLoading && <div style={{ ...S.chatMsg("assistant"), color: C.gold }}>· · ·</div>}
            <div ref={msgEndRef} />
          </div>
          <div style={S.chatInput}>
            <input style={S.chatField} value={aiInput} onChange={e => setAiInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendAI()}
              placeholder={t.aiPlaceholder} dir={dir} />
            <button style={S.chatSendBtn} onClick={sendAI} disabled={aiLoading}>{t.aiSend}</button>
          </div>
        </div>
      )}
      <button style={S.chatFab} onClick={() => setChatOpen(o => !o)} title={t.aiAssistant}>✦</button>
    </div>
  );
}
