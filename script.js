const foods = [
    {
        id: 1,
        name: "برگر مخصوص",
        category: "برگر",
        price: 180000,
        description: "برگر گوشت تازه با پنیر چدار، کاهو، گوجه، خیارشور و سس مخصوص سرآشپز.",
        badge: "پرفروش"
    },
    {
        id: 2,
        name: "پیتزا پپرونی",
        category: "پیتزا",
        price: 250000,
        description: "پیتزای ایتالیایی با پنیر موزارلا، پپرونی تازه و سس مخصوص.",
        badge: "محبوب"
    },
    {
        id: 3,
        name: "سیب زمینی ویژه",
        category: "غذای اصلی",
        price: 95000,
        description: "سیب زمینی ترد و طلایی همراه با ادویه مخصوص و سس پنیر.",
        badge: "ویژه"
    },
    {
        id: 4,
        name: "ساندویچ مرغ",
        category: "غذای اصلی",
        price: 155000,
        description: "مرغ گریل شده همراه با سبزیجات تازه و سس مخصوص.",
        badge: "جدید"
    },
    {
        id: 5,
        name: "نوشابه خنک",
        category: "نوشیدنی",
        price: 35000,
        description: "نوشیدنی خنک برای همراهی با غذای مورد علاقه‌ات.",
        badge: "خنک"
    },
    {
        id: 6,
        name: "پیتزا سبزیجات",
        category: "پیتزا",
        price: 210000,
        description: "پیتزای خوشمزه با قارچ، فلفل دلمه‌ای، زیتون و پنیر.",
        badge: "گیاهی"
    }
];

const coupons = {
    FOOD20: 20,
    WELCOME10: 10
};

let cart = [];
let activeCoupon = null;

const foodGrid = document.getElementById("food-grid");
const cartItems = document.getElementById("cart-items");

const foodDialog = document.getElementById("food-dialog");
const addressDialog = document.getElementById("address-dialog");
const successDialog = document.getElementById("success-dialog");

const faNumber = number =>
    new Intl.NumberFormat("fa-IR").format(number);

function formatPrice(price) {
    return faNumber(price) + " تومان";
}

// گرفتن عکس از HTML
function getFoodImage(id) {
    const card = document.querySelector(`[data-food-id="${id}"]`);
    return card?.querySelector(".food-image")?.src || "";
}

// جزئیات غذا
function showFoodDetails(id) {
    const food = foods.find(item => item.id === id);

    if (!food) return;

    const details = document.getElementById("food-details");
    details.replaceChildren();

    const title = document.createElement("h2");
    title.textContent = food.name;

    const image = document.createElement("img");
    image.src = getFoodImage(id);
    image.alt = food.name;
    image.className = "detail-image";

    const description = document.createElement("p");
    description.className = "detail-description";
    description.textContent = food.description;

    const price = document.createElement("div");
    price.className = "detail-price";
    price.textContent = formatPrice(food.price);

    const button = document.createElement("button");
    button.className = "primary-btn";
    button.textContent = "افزودن به سبد خرید";

    button.addEventListener("click", () => {
        addToCart(id);
        foodDialog.close();
    });

    details.append(title, image, description, price, button);

    foodDialog.showModal();
}

// افزودن به سبد
function addToCart(id) {
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id,
            quantity: 1
        });
    }

    updateCart();
}

// تغییر تعداد
function changeQuantity(id, amount) {
    const item = cart.find(food => food.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(food => food.id !== id);
    }

    updateCart();
}

// حذف غذا
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// جمع قیمت
function calculateSubtotal() {
    return cart.reduce((sum, item) => {
        const food = foods.find(food => food.id === item.id);

        return sum + food.price * item.quantity;
    }, 0);
}

// تخفیف
function calculateDiscount(subtotal) {
    if (!activeCoupon) return 0;

    return Math.round(
        subtotal * coupons[activeCoupon] / 100
    );
}

// قیمت نهایی
function calculateTotal() {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    const shipping = subtotal > 0 ? 25000 : 0;

    return subtotal - discount + shipping;
}

// پاک کردن کوپن
function clearCouponIfCartEmpty() {
    if (cart.length === 0) {
        activeCoupon = null;

        document.getElementById("coupon-message").textContent = "";
        document.getElementById("coupon-input").value = "";
    }
}

// بروزرسانی سبد
function updateCart() {
    cartItems.replaceChildren();

    clearCouponIfCartEmpty();

    if (cart.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-cart";
        empty.textContent = "سبد خرید شما خالی است 🍽️";

        cartItems.appendChild(empty);
    }

    cart.forEach(item => {
        const food = foods.find(food => food.id === item.id);

        const row = document.createElement("div");
        row.className = "cart-item";

        const info = document.createElement("div");
        info.className = "cart-item-info";

        const image = document.createElement("img");
        image.src = getFoodImage(item.id);
        image.alt = food.name;

        const details = document.createElement("div");

        const name = document.createElement("strong");
        name.textContent = food.name;

        const price = document.createElement("small");
        price.textContent = formatPrice(food.price * item.quantity);

        details.append(name, price);
        info.append(image, details);

        const controls = document.createElement("div");
        controls.className = "quantity-controls";

        const minus = document.createElement("button");
        minus.textContent = "−";
        minus.addEventListener("click", () =>
            changeQuantity(item.id, -1)
        );

        const count = document.createElement("span");
        count.textContent = faNumber(item.quantity);

        const plus = document.createElement("button");
        plus.textContent = "+";
        plus.addEventListener("click", () =>
            changeQuantity(item.id, 1)
        );

        const remove = document.createElement("button");
        remove.textContent = "حذف";
        remove.className = "remove-btn";

        remove.addEventListener("click", () =>
            removeFromCart(item.id)
        );

        controls.append(minus, count, plus, remove);

        row.append(info, controls);

        cartItems.appendChild(row);
    });

    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    const shipping = subtotal > 0 ? 25000 : 0;
    const total = subtotal - discount + shipping;

    document.getElementById("cart-count").textContent =
        faNumber(
            cart.reduce((sum, item) => sum + item.quantity, 0)
        );

    document.getElementById("subtotal").textContent =
        formatPrice(subtotal);

    document.getElementById("discount").textContent =
        formatPrice(discount);

    document.getElementById("shipping").textContent =
        formatPrice(shipping);

    document.getElementById("total").textContent =
        formatPrice(total);

    document.getElementById("address-total").textContent =
        formatPrice(total);
}

// کلیک روی دکمه های کارت ها
foodGrid.addEventListener("click", event => {
    const detailButton = event.target.closest("[data-detail]");
    const addButton = event.target.closest("[data-add]");

    if (detailButton) {
        showFoodDetails(Number(detailButton.dataset.detail));
    }

    if (addButton) {
        addToCart(Number(addButton.dataset.add));
    }
});

// فیلتر و جستجو
function filterFoods() {
    const query = document
        .getElementById("search-input")
        .value
        .trim()
        .toLocaleLowerCase("fa");

    const category =
        document.querySelector(".category.active")?.dataset.category || "همه";

    document.querySelectorAll(".food-card").forEach(card => {
        const id = Number(card.dataset.foodId);
        const food = foods.find(item => item.id === id);

        const matchesSearch = food.name
            .toLocaleLowerCase("fa")
            .includes(query);

        const matchesCategory =
            category === "همه" || food.category === category;

        card.hidden = !(matchesSearch && matchesCategory);
    });
}

document.getElementById("search-input")
    .addEventListener("input", filterFoods);

document.querySelectorAll(".category").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".category.active")
            ?.classList.remove("active");

        button.classList.add("active");

        filterFoods();
    });
});

// کوپن تخفیف
document.getElementById("apply-coupon")

    .addEventListener("click", () => {

        const input = document.getElementById("coupon-input");
        const message = document.getElementById("coupon-message");

        const code = input.value.trim().toUpperCase();

        message.className = "";

        if (!cart.length) {
            message.textContent = "ابتدا یک غذا به سبد خرید اضافه کن.";
            message.classList.add("error");
            return;
        }

        if (!coupons[code]) {
            message.textContent = "این کد تخفیف معتبر نیست.";
            message.classList.add("error");
            return;
        }

        if (activeCoupon === code) {
            message.textContent = "این کد قبلاً اعمال شده است.";
            message.classList.add("error");
            return;
        }

        activeCoupon = code;

        message.textContent =
            `کد ${code} با موفقیت اعمال شد! ${faNumber(coupons[code])}٪ تخفیف گرفتی 🎉`;

        message.classList.add("success");

        updateCart();
    });

// باز کردن فرم آدرس
document.getElementById("checkout-button")
    .addEventListener("click", () => {

        if (!cart.length) {
            alert("سبد خرید شما خالی است!");
            return;
        }

        addressDialog.showModal();
    });

// ثبت سفارش نمایشی
document.getElementById("address-form")
    .addEventListener("submit", event => {

        event.preventDefault();

        const form = event.currentTarget;

        if (!form.reportValidity()) return;

        const addressData = Object.fromEntries(
            new FormData(form).entries()
        );

        console.log("اطلاعات تحویل:", addressData);
        console.log("مبلغ سفارش:", calculateTotal());
        console.log("سبد خرید:", cart);

        addressDialog.close();

        cart = [];
        activeCoupon = null;

        form.reset();

        document.getElementById("coupon-input").value = "";
        document.getElementById("coupon-message").textContent = "";

        updateCart();

        successDialog.showModal();
    });

// بستن پنجره ها
document.querySelectorAll("[data-close]").forEach(button => {
    button.addEventListener("click", () => {
        document.getElementById(button.dataset.close).close();
    });
});

// بستن با کلیک بیرون پنجره
document.querySelectorAll("dialog").forEach(dialog => {
    dialog.addEventListener("click", event => {
        if (event.target === dialog) {
            dialog.close();
        }
    });
});

// شروع برنامه
updateCart();

