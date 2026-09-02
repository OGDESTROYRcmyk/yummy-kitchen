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

// YUMMY KITCHEN 2.0: arcade, achievements, coins, chef, modes and secrets
(() => {
  let score=0,best=Number(localStorage.getItem('ykBest')||0),coins=Number(localStorage.getItem('ykCoins')||0),ordersMade=Number(localStorage.getItem('ykOrders')||0),achievements=JSON.parse(localStorage.getItem('ykAchievements')||'[]');
  const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];
  const coinEl=$('#coinCount'),bestEl=$('#bestScore'),scoreEl=$('#gameScore'); if(coinEl) coinEl.textContent=coins;if(bestEl)bestEl.textContent=best;
  function save(){localStorage.setItem('ykCoins',coins);localStorage.setItem('ykBest',best);localStorage.setItem('ykOrders',ordersMade);localStorage.setItem('ykAchievements',JSON.stringify(achievements));}
  function earn(n){coins+=n;if(coinEl)coinEl.textContent=coins;save();}
  function unlock(id){if(!achievements.includes(id)){achievements.push(id);const el=$(`[data-ach="${id}"]`);el?.classList.remove('locked');el?.classList.add('unlocked');save();if(window.toast) window.toast('🏆 Achievement unlocked!');}}
  $$('.achievement').forEach(e=>{if(achievements.includes(e.dataset.ach))e.classList.add('unlocked'),e.classList.remove('locked')});
  if(achievements.length>=5)unlock('master');
  // Observe cart additions without replacing the existing cart system
  $$('.add-order').forEach(b=>b.addEventListener('click',()=>{ordersMade++;earn(10);unlock('first');if(ordersMade>=5)unlock('five');const c=b.closest('.card');if(c?.dataset.name.toLowerCase().includes('cake')||c?.dataset.name.toLowerCase().includes('mochi')||c?.closest('section')?.id==='desserts')unlock('cake');if(achievements.length>=5)unlock('master')}));
  // Arcade
  const board=$('#gameBoard'),basket=$('#foodBasket'),start=$('#startGame'),reset=$('#resetGame');let running=false,spawnTimer=null,gameTimer=null;
  function moveBasket(x){if(!board||!basket)return;const r=board.getBoundingClientRect();let pct=((x-r.left)/r.width)*100;pct=Math.max(8,Math.min(92,pct));basket.style.left=pct+'%'}
  board?.addEventListener('mousemove',e=>moveBasket(e.clientX));board?.addEventListener('touchmove',e=>{if(e.touches[0])moveBasket(e.touches[0].clientX)},{passive:true});
  function spawn(){if(!running)return;const f=document.createElement('div');f.className='falling-food';f.textContent=['🍔','🍟','🍪','🍕','🍗','🍰','🥞'][Math.floor(Math.random()*7)];f.style.left=(5+Math.random()*90)+'%';f.style.animationDuration=(2.5+Math.random()*2)+'s';f.onclick=()=>{if(!running)return;score++;if(scoreEl)scoreEl.textContent=score;f.remove();if(score>=10){unlock('game');earn(20)}};board.appendChild(f);setTimeout(()=>f.remove(),5000)}
  function startGame(){score=0;scoreEl.textContent=0;running=true;board.classList.add('playing');start.textContent='⏱ Playing...';clearInterval(spawnTimer);clearTimeout(gameTimer);spawnTimer=setInterval(spawn,650);gameTimer=setTimeout(endGame,20000)}
  function endGame(){running=false;board.classList.remove('playing');clearInterval(spawnTimer);start.textContent='▶ Start Game';if(score>best){best=score;bestEl.textContent=best;localStorage.setItem('ykBest',best)}if(score>0)earn(score)}
  start?.addEventListener('click',startGame);reset?.addEventListener('click',()=>{running=false;clearInterval(spawnTimer);clearTimeout(gameTimer);score=0;scoreEl.textContent=0;board.classList.remove('playing');start.textContent='▶ Start Game';$$('.falling-food').forEach(x=>x.remove())});
  // Rewards
  $$('.reward-btn').forEach(b=>b.addEventListener('click',()=>{const cost=+b.dataset.cost;if(coins<cost){window.toast?.('🪙 You need more Yummy Coins!');return}coins-=cost;coinEl.textContent=coins;save();window.toast?.('🎁 Reward unlocked!')}));
  // Chef
  const chefMessages=['The kitchen is ready!','Excellent choice! 🍔','Remember: dessert is important. 🍪','The royal recipe is a secret... 👀','You are officially part of the Yummy Club! 👑'];let cm=0;$('#chefTalk')?.addEventListener('click',()=>{cm=(cm+1)%chefMessages.length;$('#chefMessage').textContent=chefMessages[cm];$('#chefAvatar').textContent=['🧑‍🍳','👨‍🍳','👩‍🍳','🧑‍🍳'][cm%4];});
  // Day/night
  $('#dayMode')?.addEventListener('click',()=>{document.body.classList.remove('night-mode');localStorage.setItem('ykMode','day')});$('#nightMode')?.addEventListener('click',()=>{document.body.classList.add('night-mode');localStorage.setItem('ykMode','night')});if(localStorage.getItem('ykMode')==='night')document.body.classList.add('night-mode');
  // Secret room: 3 clicks on the Yummy Kitchen title
  let titleClicks=0;const title=document.querySelector('header h1')||document.querySelector('h1');title?.addEventListener('click',()=>{titleClicks++;if(titleClicks>=3){titleClicks=0;$('#secretRoom')?.classList.add('show-room');unlock('secret');window.toast?.('🗝️ SECRET ROOM UNLOCKED!')}});
  $('#unlockRecipe')?.addEventListener('click',()=>{$('#secretRecipe').textContent='👑 Royal Yummy Sauce: garlic + cheese + chef magic ✨';earn(15);window.toast?.('🍳 Recipe unlocked!')});
  // Simple sound toggle using Web Audio for UI/game feedback
  let soundOn=localStorage.getItem('ykSound')!=='off';const soundBtn=$('#soundToggle');function beep(){if(!soundOn)return;try{const a=new AudioContext(),o=a.createOscillator(),g=a.createGain();o.frequency.value=660;g.gain.value=.03;o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+.07)}catch(e){}}
  soundBtn?.addEventListener('click',()=>{soundOn=!soundOn;localStorage.setItem('ykSound',soundOn?'on':'off');soundBtn.textContent=soundOn?'🔊 Sounds On':'🔇 Sounds Off';beep()});
})();
