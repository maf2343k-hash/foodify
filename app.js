const foods = {
    burger: { name: "برگر مخصوص", description: "برگر گوشت تازه همراه پنیر، کاهو، گوجه و سس مخصوص.", price: 185000, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700" },
    pizza: { name: "پیتزا پپرونی", description: "پیتزای خوشمزه با پنیر کش‌دار، پپرونی و سس مخصوص.", price: 240000, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700" },
    fries: { name: "سیب زمینی ویژه", description: "سیب زمینی ترد و طلایی همراه سس مخصوص.", price: 95000, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=700" },
    sandwich: { name: "ساندویچ مرغ", description: "مرغ گریل‌شده همراه سبزیجات تازه و سس مخصوص.", price: 155000, image: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=700" },
    pasta: { name: "پاستا آلفردو", description: "پاستای لطیف با سس خامه‌ای، قارچ و پنیر پارمزان.", price: 195000, image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=700" },
    salad: { name: "سالاد سزار", description: "کاهوی تازه، مرغ گریل، نان کروتان و سس سزار.", price: 145000, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700" },
    hotdog: { name: "هات‌داگ ویژه", description: "هات‌داگ گریل‌شده با پنیر، خیارشور و سس خردل.", price: 135000, image: "https://images.unsplash.com/photo-1612392062126-2f9c4f6f0d8b?w=700" },
    friedchicken: { name: "مرغ سوخاری", description: "تکه‌های مرغ با روکش طلایی و ادویه‌های خوش‌عطر.", price: 220000, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=700" },
    tacos: { name: "تاکو گوشت", description: "نان تاکو با گوشت مزه‌دار، سبزیجات و سس سالسا.", price: 180000, image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=700" },
    sushi: { name: "رول سوشی", description: "رول برنج و سبزیجات با ترکیب طعمی ملایم و تازه.", price: 260000, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=700" },
    lasagna: { name: "لازانیا", description: "لایه‌های پاستا با گوشت، سس گوجه و پنیر آب‌شده.", price: 210000, image: "https://images.unsplash.com/photo-1619895092538-128341789043?w=700" },
    falafel: { name: "ساندویچ فلافل", description: "فلافل تازه و ترد با سبزیجات، ترشی و سس مخصوص.", price: 110000, image: "https://images.unsplash.com/photo-1593001874117-c99c800e3eb6?w=700" }
};
const SHIPPING_PRICE = 30000, FREE_SHIPPING_LIMIT = 500000, COUPON_CODE = "FOOD10", COUPON_RATE = .10;
const formatPrice = n => Math.max(0, Number(n) || 0).toLocaleString("fa-IR") + " تومان";
const getCart = () => { try { return JSON.parse(localStorage.getItem("foodifyCart")) || [] } catch { return [] } };
const saveCart = cart => localStorage.setItem("foodifyCart", JSON.stringify(cart));
const getDiscount = () => localStorage.getItem("foodifyCoupon") === "applied";
function showToast(message, type = "success") {
    const toast = document.getElementById("toast"); if (!toast) { alert(message); return }
    toast.textContent = message; toast.className = "toast show" + (type === "error" ? " error" : "");
    clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.className = "toast", 2600);
}
function cartCount() { return getCart().reduce((sum, item) => sum + (Number(item.quantity) || 0), 0) }
function updateNavCount() {
    const count = cartCount();["navCartCount", "navCartCountDesktop"].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = count.toLocaleString("fa-IR") });
}
function addFood(id, quantity = 1) {
    const food = foods[id], qty = Math.floor(Number(quantity));
    if (!food || !Number.isFinite(qty) || qty < 1) { showToast("لطفاً ابتدا تعداد معتبری انتخاب کن.", "error"); return false }
    const cart = getCart(), existing = cart.find(item => item.id === id);
    if (existing) existing.quantity = Math.min(99, (Number(existing.quantity) || 0) + qty);
    else cart.push({ id, name: food.name, price: food.price, quantity: Math.min(99, qty), image: food.image });
    saveCart(cart); updateNavCount(); showToast(`${food.name} به سبد خرید اضافه شد.`); return true;
}
function calculateTotals() {
    const subtotal = getCart().reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
    const discount = getDiscount() ? Math.round(subtotal * COUPON_RATE) : 0;
    const shipping = subtotal === 0 ? 0 : (subtotal >= FREE_SHIPPING_LIMIT ? 0 : SHIPPING_PRICE);
    return { subtotal, discount, shipping, total: subtotal - discount + shipping };
}
function renderCart(){
    const container = document.getElementById("cartItems"); if (!container) return;
    const cart = getCart(); container.innerHTML = "";
    if (!cart.length) {
        container.innerHTML = '<div class="empty-cart"><h3>سبد خریدت خالی است!</h3><p>از منوی غذا یک انتخاب خوشمزه داشته باش.</p><a class="primary-btn" href="index.html#foods">مشاهده غذاها</a></div>';
        localStorage.removeItem("foodifyCoupon");
    } else {
        cart.forEach(item => {
            const row = document.createElement("article"); row.className = "cart-item";
            const img = document.createElement("img"); img.src = item.image || foods[item.id]?.image || ""; img.alt = item.name; img.loading = "lazy";
            const info = document.createElement("div"); info.className = "cart-item-info";
            const title = document.createElement("h3"); title.textContent = item.name;
            const price = document.createElement("p"); price.textContent = formatPrice(item.price * item.quantity);
            info.append(title, price);
            const controls = document.createElement("div"); controls.className = "cart-quantity";
            const minus = document.createElement("button"); minus.type = "button"; minus.textContent = "−"; minus.setAttribute("aria-label", "کم کردن تعداد");
            const qty = document.createElement("strong"); qty.textContent = Number(item.quantity).toLocaleString("fa-IR");
            const plus = document.createElement("button"); plus.type = "button"; plus.textContent = "+"; plus.setAttribute("aria-label", "زیاد کردن تعداد");
            minus.addEventListener("click", () => changeQuantity(item.id, -1)); plus.addEventListener("click", () => changeQuantity(item.id, 1));
            controls.append(minus, qty, plus);
            const remove = document.createElement("button"); remove.className = "remove-btn"; remove.type = "button"; remove.textContent = "حذف"; remove.addEventListener("click", () => removeFood(item.id));
            row.append(img, info, controls, remove); container.appendChild(row);
        });
    }
    updateSummary(); updateNavCount();
}
function changeQuantity(id, delta) {
    const cart = getCart(), item = cart.find(x => x.id === id); if (!item) return;
    item.quantity += delta; if (item.quantity <= 0) { saveCart(cart.filter(x => x.id !== id)) } else { item.quantity = Math.min(99, item.quantity); saveCart(cart) }
    renderCart();
}
function removeFood(id) { saveCart(getCart().filter(item => item.id !== id)); renderCart(); showToast("محصول از سبد خرید حذف شد.") }
function updateSummary() {
    const t = calculateTotals();
    const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = formatPrice(value) };
    set("subtotal", t.subtotal); set("discount", t.discount); set("shipping", t.shipping); set("beforeTotal", t.subtotal); set("total", t.total); set("checkoutTotal", t.total);
    const note = document.getElementById("shippingNote"); if (note) note.textContent = t.subtotal === 0 ? "برای ثبت سفارش ابتدا محصولی به سبد اضافه کن." : t.shipping === 0 ? "ارسال سفارش شما رایگان است." : "با خرید ۵۰۰,۰۰۰ تومان یا بیشتر، ارسال رایگان می‌شود.";
    const msg = document.getElementById("couponMessage"); if (msg) msg.textContent = getDiscount() ? "کد FOOD10 با موفقیت اعمال شد." : "با کد FOOD10 ده درصد تخفیف بگیر.";
}
function applyCoupon() {
    if (!getCart().length) { showToast("برای اعمال کد تخفیف ابتدا محصولی به سبد اضافه کن.", "error"); return }
    const input = document.getElementById("couponInput"), code = (input?.value || "").trim().toUpperCase();
    if (code !== COUPON_CODE) { showToast("کد تخفیف معتبر نیست.", "error"); return }
    localStorage.setItem("foodifyCoupon", "applied"); updateSummary(); showToast("تخفیف ۱۰ درصدی اعمال شد.");
}
function initHome() {
    document.querySelectorAll("[data-add]").forEach(button => button.addEventListener("click", () => {
        const card = button.closest(".food-card"), input = card?.querySelector(".food-qty"), quantity = input ? Number(input.value) : 0;
        if (!quantity || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) { showToast("تعداد باید بین ۱ تا ۲۰ باشد.", "error"); return }
        if (addFood(button.dataset.add, quantity) && input) input.value = "0";
    }));
    document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => { window.location.href = `product.html?id=${encodeURIComponent(button.dataset.view)}` }));
    const search = document.getElementById("foodSearch"), message =document.getElementById("searchMessage");
  const runSearch = () => {
        const q = (search?.value || "").trim().toLocaleLowerCase("fa"); let shown = 0;
        document.querySelectorAll(".food-card").forEach(card => { const text = card.innerText.toLocaleLowerCase("fa"), match = !q || text.includes(q) || card.dataset.id.includes(q); card.hidden = !match; if (match) shown++ });
        if (message) message.textContent = q ? (shown ? `${shown.toLocaleString("fa-IR")} غذا پیدا شد.` : "غذایی با این نام پیدا نشد.") : "";
        if (q) document.getElementById("foods")?.scrollIntoView({ behavior: "smooth" });
    };
    document.getElementById("searchForm")?.addEventListener("submit", e => { e.preventDefault(); runSearch() });
    search?.addEventListener("input", () => { if (!search.value.trim()) { document.querySelectorAll(".food-card").forEach(c => c.hidden = false); if (message) message.textContent = "" } });
}
function initProduct() {
    const id = new URLSearchParams(location.search).get("id"), food = foods[id];
    if (!food) { showToast("غذای مورد نظر پیدا نشد.", "error"); setTimeout(() => location.href = "index.html", 900); return }
    document.title = food.name + " | Foodify";
    document.getElementById("productName").textContent = food.name; document.getElementById("productDescription").textContent = food.description; document.getElementById("productPrice").textContent = formatPrice(food.price);
    const img = document.getElementById("productImage"); img.src = food.img; img.alt = food.name;
    let quantity = 1; const qty = document.getElementById("quantity");
    document.getElementById("plusBtn").addEventListener("click", () => { if (quantity < 20) qty.textContent = (++quantity).toLocaleString("fa-IR") });
    document.getElementById("minusBtn").addEventListener("click", () => { if (quantity > 1) qty.textContent = (--quantity).toLocaleString("fa-IR") });
    document.getElementById("addToCartBtn").addEventListener("click", () => { if (addFood(id, quantity)) location.href = "cart.html" });
}
function initCart() {
    renderCart(); document.getElementById("applyCoupon")?.addEventListener("click", applyCoupon);
    document.getElementById("couponInput")?.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); applyCoupon() } });
    document.getElementById("checkoutBtn")?.addEventListener("click", () => { if (!getCart().length) { showToast("سبد خرید خالی است؛ ابتدا غذا انتخاب کن.", "error"); return } location.href = "checkout.html" });
}
function initCheckout() {
    const cart = getCart(); if (!cart.length) { showToast("سبد خرید خالی است.", "error"); setTimeout(() => location.href = "cart.html", 900); return }
    const total = document.getElementById("checkoutTotal"); if (total) total.textContent = formatPrice(calculateTotals().total);
    document.getElementById("checkoutForm")?.addEventListener("submit", e => {
        e.preventDefault(); if (!e.currentTarget.reportValidity()) return;
        const form = new FormData(e.currentTarget), order = { number: "FD" + Date.now().toString().slice(-8), total: calculateTotals().total, customer: { name: form.get("fullName"), phone: form.get("phone"), city: form.get("city"), address: form.get("address"), description: form.get("description") }, items: getCart(), createdAt: new Date().toISOString() };
        localStorage.setItem("foodifyLastOrder", JSON.stringify(order)); saveCart([]); localStorage.removeItem("foodifyCoupon"); location.href = "success.html";
    });
}
function initSuccess() {
    try {
        const order = JSON.parse(localStorage.getItem("foodifyLastOrder")); if (!order) return;
        const number = document.getElementById("orderNumber"), total = document.getElementById("successTotal");
        if (number) number.textContent = order.number; if (total) total.textContent = formatPrice(order.total);
    } catch { }
}
function initMenu() {
    const toggle = document.getElementById("menuToggle"), nav = document.getElementById("mainNav"); if (!toggle || !nav) return;
    toggle.addEventListener("click", () => { const open = nav.classList.toggle("open"); toggle.setAttribute("aria-expanded", String(open)); toggle.textContent = open ? "✕" : "☰" });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); toggle.textContent = "☰" }));
}
document.addEventListener("DOMContentLoaded", () => {
    initMenu(); updateNavCount();
    const page = document.body.dataset.page;
    if (page === "home") initHome(); if (page === "product") initProduct(); if (page === "cart") initCart(); if (page === "checkout") initCheckout(); if (page === "success") initSuccess();
});

