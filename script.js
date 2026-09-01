
document.addEventListener("DOMContentLoaded", () => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const cart = [];
  const fakeTimes = ["08:12 AM","09:27 AM","10:05 AM","11:18 AM","12:03 PM","12:47 PM","01:16 PM","02:24 PM","03:11 PM","04:38 PM","05:06 PM","06:22 PM","07:14 PM","08:03 PM","09:31 PM"];

  function openModal(id) { const m = document.getElementById(id); if(m){m.classList.add("show");m.setAttribute("aria-hidden","false");} }
  function closeModal(id) { const m = document.getElementById(id); if(m){m.classList.remove("show");m.setAttribute("aria-hidden","true");} }
  function money(n) { return "£" + n.toFixed(2); }
  function toast(text) {
    const t = $("#toast"); t.textContent = text; t.classList.add("show");
    clearTimeout(window._toast); window._toast = setTimeout(()=>t.classList.remove("show"), 1800);
  }

  // Fancy kitchen-log popup for any card.
  const foodModal = $("#foodModal");
  $$(".card").forEach((card, index) => {
    card.addEventListener("click", e => {
      if (e.target.closest(".add-order")) return;
      const name = card.querySelector("h3")?.textContent.trim() || "Yummy Kitchen dish";
      const description = card.querySelector("p")?.textContent.trim() || "A Yummy Kitchen favourite.";
      if ($("#modalFoodName")) $("#modalFoodName").textContent = name.replace("👨‍🍳 CHEF’S SPECIAL","");
      if ($("#modalFoodDescription")) $("#modalFoodDescription").textContent = description;
      if ($("#modalMadeTime")) $("#modalMadeTime").textContent = fakeTimes[index % fakeTimes.length];
      if (foodModal) openModal("foodModal");
    });
  });

  // Add to order.
  $$(".add-order").forEach(btn => btn.addEventListener("click", e => {
    e.stopPropagation();
    const card = btn.closest(".card");
    const name = btn.dataset.food || "Yummy dish";
    const priceText = card?.querySelector("strong")?.textContent || card?.querySelector(".price")?.textContent || "";
    const match = priceText.match(/(\d+(?:\.\d{1,2})?)/);
    const price = match ? parseFloat(match[1]) : 10;
    cart.push({name, price, emoji:"🍽️"});
    updateCart();
    toast(`${name} added to your order! 🛒`);
  }));

  function updateCart() {
    $("#cartCount").textContent = cart.length;
    const box = $("#cartItems");
    if (!cart.length) { box.innerHTML = "<p>Your order is empty. Add something delicious! 🍰</p>"; }
    else {
      box.innerHTML = cart.map((item,i)=>`<div class="cart-row">
        <div class="cart-emoji">${item.emoji}</div><div class="cart-row-main">
        <div class="cart-row-name">${item.name}</div><div class="cart-row-price">${money(item.price)}</div>
        </div><button class="remove-item" data-index="${i}" aria-label="Remove">✕</button></div>`).join("");
      $$(".remove-item").forEach(b=>b.addEventListener("click",()=>{cart.splice(+b.dataset.index,1);updateCart();}));
    }
    $("#cartTotal").textContent = money(cart.reduce((a,b)=>a+b.price,0));
  }

  $("#orderButton")?.addEventListener("click",()=>{updateCart();openModal("cartModal");});
  $("#checkoutButton")?.addEventListener("click",()=>{
    if (!cart.length) { toast("Add some food first! 🍔"); return; }
    closeModal("cartModal"); openModal("checkoutModal");
  });
  $("#placeOrderButton")?.addEventListener("click",()=>{
    const total = cart.reduce((a,b)=>a+b.price,0);
    $("#receiptContent").innerHTML = cart.map(x=>`<div class="receipt-line"><span>${x.name}</span><strong>${money(x.price)}</strong></div>`).join("") +
      `<div class="receipt-total"><span>Total</span><span>${money(total)}</span></div><p>🕒 Estimated kitchen time: 18–27 minutes (fictional).</p>`;
    cart.length = 0; updateCart(); closeModal("checkoutModal"); openModal("receiptModal");
  });

  $$("[data-close]").forEach(b=>b.addEventListener("click",()=>closeModal(b.dataset.close)));
  $$(".overlay-modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)closeModal(m.id);}));
  document.addEventListener("keydown",e=>{if(e.key==="Escape") $$(".overlay-modal.show").forEach(m=>closeModal(m.id));});
  updateCart();
});
