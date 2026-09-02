document.addEventListener("DOMContentLoaded",()=>{const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];const cart=[];const times=["08:12 AM","09:27 AM","10:05 AM","11:18 AM","12:03 PM","12:47 PM","01:16 PM","02:24 PM","03:11 PM","04:38 PM","05:06 PM","06:22 PM","07:14 PM","08:03 PM","09:31 PM"];function open(id){const m=$("#"+id);if(m)m.classList.add("show")}function close(id){const m=$("#"+id);if(m)m.classList.remove("show")}function money(n){return "£"+n.toFixed(2)}function toast(t){const x=$("#toast");x.textContent=t;x.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>x.classList.remove("show"),1800)}
$$(".card").forEach((card,i)=>card.addEventListener("click",e=>{if(e.target.closest(".add-order"))return;$("#modalEmoji").textContent=card.dataset.emoji;$("#modalFoodName").textContent=card.dataset.name;$("#modalFoodDescription").textContent=card.querySelector("p").textContent;$("#modalMadeTime").textContent=times[i%times.length];open("foodModal")}));
$$(".add-order").forEach(btn=>btn.addEventListener("click",e=>{e.stopPropagation();const c=btn.closest(".card");cart.push({name:c.dataset.name,price:parseFloat(c.dataset.price),emoji:c.dataset.emoji});update();toast(c.dataset.name+" added to your order! 🛒")}));
function update(){ $("#cartCount").textContent=cart.length;const box=$("#cartItems");box.innerHTML=cart.length?cart.map((x,i)=>`<div class="cart-row"><div style="font-size:2rem">${x.emoji}</div><div class="cart-row-main"><div class="cart-row-name">${x.name}</div><div class="cart-row-price">${money(x.price)}</div></div><button class="remove-item" data-i="${i}">✕</button></div>`).join(""):"<p>Your order is empty. Add something delicious! 🍰</p>";$$(".remove-item").forEach(b=>b.onclick=()=>{cart.splice(+b.dataset.i,1);update()});$("#cartTotal").textContent=money(cart.reduce((a,x)=>a+x.price,0))}
$("#orderButton").onclick=()=>{update();open("cartModal")};$("#checkoutButton").onclick=()=>{if(!cart.length){toast("Add some food first! 🍔");return}close("cartModal");open("checkoutModal")};$("#placeOrderButton").onclick=()=>{const total=cart.reduce((a,x)=>a+x.price,0);$("#receiptContent").innerHTML=cart.map(x=>`<div class="receipt-line"><span>${x.name}</span><strong>${money(x.price)}</strong></div>`).join("")+`<div class="receipt-total"><span>Total</span><span>${money(total)}</span></div><p>🕒 Kitchen time: 18–27 minutes.</p>`;cart.length=0;update();close("checkoutModal");open("receiptModal")};
$$("[data-close]").forEach(b=>b.onclick=()=>close(b.dataset.close));$$(".overlay-modal").forEach(m=>m.onclick=e=>{if(e.target===m)close(m.id)});document.onkeydown=e=>{if(e.key==="Escape")$$(".overlay-modal.show").forEach(m=>close(m.id))};update()});

// MEGA UPDATE extras
const promoVideo=document.getElementById('promoVideo');
const promoPlay=document.getElementById('promoPlay');
const promoPause=document.getElementById('promoPause');
const promoBack=document.getElementById('promoBack');
const promoProgress=document.getElementById('promoProgress');
let promoPlaying=false;
function playPromo(){promoVideo.classList.add('playing');promoPlaying=true;promoProgress.classList.add('running');promoPlay.textContent='↻ Replay Promo';promoPause.textContent='Ⅱ'}
promoPlay?.addEventListener('click',playPromo);
promoPause?.addEventListener('click',()=>{promoPlaying=!promoPlaying;promoVideo.classList.toggle('playing',promoPlaying);promoProgress.classList.toggle('running',promoPlaying);promoPause.textContent=promoPlaying?'Ⅱ':'▶'});
promoBack?.addEventListener('click',()=>{promoVideo.classList.remove('playing');promoPlaying=false;promoProgress.classList.remove('running');promoPause.textContent='▶';promoPlay.textContent='▶ Play Promo'});

const search=document.getElementById('menuSearch'), filter=document.getElementById('categoryFilter'), result=document.getElementById('searchResult');
function filterMenu(){const q=(search?.value||'').toLowerCase().trim(), cat=filter?.value||'all';let shown=0;document.querySelectorAll('.card').forEach(c=>{const text=(c.dataset.name+' '+c.textContent).toLowerCase();const section=c.closest('section');const heading=section?.querySelector('h2')?.textContent.toLowerCase()||'';const okText=!q||text.includes(q);const okCat=cat==='all'||heading.includes(cat);c.classList.toggle('search-hidden',!(okText&&okCat));if(okText&&okCat)shown++});if(result)result.textContent=q||cat!=='all'?`${shown} menu item${shown===1?'':'s'} found 🍽️`:'24 delicious choices available!';}
search?.addEventListener('input',filterMenu);filter?.addEventListener('change',filterMenu);filterMenu();

const picks=['Chicken Burger 👑','Cookie Cake 👑','Dynamite Shrimp 🍤','Crispy Waffles 🧇','Creamy Chicken Mayo Pasta 🍝'];
const day=new Date().getDate();document.getElementById('dailyPick')&&(document.getElementById('dailyPick').textContent=picks[day%picks.length]);
const live=document.getElementById('liveStatus');const statuses=['🔥 Chefs are cooking!','🍟 Fries station is BUSY!','🍪 Dessert squad online!','🍔 Burger station ready!','✨ Kitchen is feeling fancy!'];let si=0;if(live){live.textContent=statuses[0];setInterval(()=>{si=(si+1)%statuses.length;live.textContent=statuses[si]},2500)}

document.getElementById('secretButton')?.addEventListener('click',e=>{e.currentTarget.textContent='🍕 PIZZA?!';e.currentTarget.classList.add('secret-active');toast('SECRET BUTTON UNLOCKED! 🎉');setTimeout(()=>{e.currentTarget.textContent='???';e.currentTarget.classList.remove('secret-active')},1800)});
