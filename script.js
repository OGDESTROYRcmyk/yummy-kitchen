document.addEventListener("DOMContentLoaded",()=>{

const foods=[
["Starters","🧄","Cheesy Garlic Bread",12.95,"Golden toast, garlic butter and melted cheese."],
["Starters","🍟","Loaded Fries",18.95,"Crispy fries with cheese and chicken."],
["Starters","🍤","Dynamite Shrimp",21.95,"Crispy shrimp with creamy mild dynamite sauce."],
["Starters","🥟","Chicken Dumplings",17.95,"Soft dumplings with chicken filling and soy dip."],
["Starters","🧀","Mozzarella Sticks",16.95,"Crispy outside, melty cheese inside."],
["Starters","🍗","Chicken Wings",19.95,"Hot, crispy and saucy."],
["Mains","🍔","Chicken Burger 👑",27.95,"Our 11/10 legend with chicken, cheese, lettuce and sauce."],
["Mains","🍝","Creamy Chicken Mayo Pasta",24.95,"Our famous mild-mayo creamy chicken pasta."],
["Mains","🍳","Chicken Egg Fried Rice",22.95,"Chicken, egg, rice and soy sauce."],
["Mains","🍜","Garlic Onion Chicken Noodles",23.95,"Noodles with garlic, onion, chicken and soy sauce."],
["Mains","🍛","Chicken Massaman Curry",29.95,"Rich curry with chicken, potato and coconut milk."],
["Mains","🌯","Chicken Wrap",19.95,"Chicken, lettuce, tomato, cheese and sauce."],
["Desserts","🍨","Ice Cream Mochi",14.95,"Soft mochi wrapped around cold ice cream."],
["Desserts","🥞","Fluffy Pancakes",15.95,"Warm pancakes with syrup and toppings."],
["Desserts","🧇","Crispy Waffles",16.95,"Crispy waffles with fruit, syrup or ice cream."],
["Desserts","🍪","Cookie Cake 👑",26.95,"The 12/10 dessert legend."],
["Desserts","🍫","Chocolate Fudge Cake",24.95,"Rich chocolate cake with fudge."],
["Desserts","🍰","Cheesecake",24.95,"Cool, creamy and smooth."],
["Drinks","🍌","Banana Ice Cream Milkshake",13.95,"Banana, cold milk and vanilla ice cream."],
["Drinks","🍓","Strawberry Milk",9.95,"Cold milk with strawberry."],
["Drinks","🧃","Rubicon",8.95,"Officially approved."],
["Drinks","🥤","Sprite",7.95,"Ice-cold lemon-lime fizz."],
["Drinks","🥤","7UP",7.95,"Classic lemon-lime soda."],
["Drinks","🥭","Mango Mojito Mocktail",11.95,"Fresh mango, lime, mint and fizz. Alcohol-free."]
];

const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
let cart=JSON.parse(localStorage.getItem("ykCart")||"[]");
let coins=Number(localStorage.getItem("ykCoins")||0);
let orders=Number(localStorage.getItem("ykOrders")||0);
let best=Number(localStorage.getItem("ykBest")||0);
let soundOn=localStorage.getItem("ykSound")!=="off";

function toast(msg){
 const t=$("#toast"); t.textContent=msg; t.classList.add("show");
 clearTimeout(window._toast); window._toast=setTimeout(()=>t.classList.remove("show"),2200);
}
window.yummyToast=toast;

function save(){localStorage.setItem("ykCart",JSON.stringify(cart));localStorage.setItem("ykCoins",coins);localStorage.setItem("ykOrders",orders);localStorage.setItem("ykBest",best);updateCoins();renderCart();renderAchievements()}
function updateCoins(){$("#coinDisplay").textContent=`🪙 ${coins} Yummy Coins`}

function renderMenu(){
 const search=$("#search").value.toLowerCase().trim();
 const cat=document.querySelector(".filter.active")?.dataset.cat||"all";
 const groups={};
 foods.forEach(f=>{if((cat==="all"||f[0].toLowerCase()===cat)&&(f[2].toLowerCase().includes(search)||f[3].toString().includes(search))) (groups[f[0]]??=[]).push(f)});
 $("#menuSections").innerHTML=Object.entries(groups).map(([name,list])=>`
 <div class="menu-category"><h3>${name==="Starters"?"🍽️":name==="Mains"?"🍔":name==="Desserts"?"🍰":"🥤"} ${name}</h3>
 <div class="food-grid">${list.map((f,i)=>{
   const chef=f[2].includes("Chicken Burger")||f[2].includes("Cookie Cake");
   return `<article class="food-card" data-name="${f[2].replaceAll('"','&quot;')}">
   ${chef?'<span class="badge">👑 CHEF SPECIAL</span>':''}
   <div class="food-img">${f[1]}</div><h4>${f[2]}</h4><p>${f[4]}</p>
   <span class="price">£${f[3].toFixed(2)}</span>
   <div class="card-actions"><button class="view">👀 View</button><button class="primary add">➕ Add</button></div></article>`
 }).join("")}</div></div>`).join("")||'<p class="empty">No food found. Try another search!</p>';
 $$(".add").forEach((b)=>b.addEventListener("click",e=>{e.stopPropagation();let card=b.closest(".food-card");let f=foods.find(x=>x[2]===card.dataset.name);add(f)}));
 $$(".view").forEach(b=>b.addEventListener("click",()=>{let card=b.closest(".food-card");let f=foods.find(x=>x[2]===card.dataset.name);showFood(f)}));
}
function add(f){cart.push({name:f[2],price:f[3],emoji:f[1]});orders++;coins+=5;toast(`🍽️ ${f[2]} added! +5 coins`);save()}
function showFood(f){$("#modalContent").innerHTML=`<div style="font-size:4rem">${f[1]}</div><h2>${f[2]}</h2><p>${f[4]}</p><h3>£${f[3].toFixed(2)}</h3><button class="primary" id="modalAdd">➕ Add to Order</button>`;$("#modal").classList.add("show");$("#modalAdd").onclick=()=>{add(f);$("#modal").classList.remove("show")}}
function renderCart(){
 if(!cart.length){$("#cart").innerHTML='<div class="empty">Your basket is empty. Go grab something delicious! 🍽️</div>';$("#total").textContent="£0.00";return}
 $("#cart").innerHTML=cart.map((x,i)=>`<div class="order-row"><span>${x.emoji}</span><span class="grow">${x.name}</span><b>£${x.price.toFixed(2)}</b><button data-i="${i}" class="remove">Remove</button></div>`).join("");
 $$(".remove").forEach(b=>b.onclick=()=>{cart.splice(Number(b.dataset.i),1);save();toast("Item removed")});
 $("#total").textContent="£"+cart.reduce((a,x)=>a+x.price,0).toFixed(2);
}
const achievementData=[
["first","🍽️ First Bite","Add your first item"],
["coins","🪙 Coin Collector","Earn 50 Yummy Coins"],
["game","🎮 Arcade Chef","Score 10 in Catch The Food"],
["orders","👨‍🍳 Regular Customer","Make 5 orders"],
["secret","🗝️ Secret Chef","Find the Secret Room"]
];
function unlocked(id){
 if(id==="first")return orders>=1;
 if(id==="coins")return coins>=50;
 if(id==="game")return best>=10;
 if(id==="orders")return orders>=5;
 if(id==="secret")return localStorage.getItem("ykSecret")==="1";
}
function renderAchievements(){$("#achievements").innerHTML=achievementData.map(a=>`<div class="achievement ${unlocked(a[0])?"":"locked"}"><b>${a[1]}</b><br><small>${unlocked(a[0])?"UNLOCKED":"🔒 "+a[2]}</small></div>`).join("")}

$$(".filter").forEach(b=>b.onclick=()=>{$$(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderMenu()});
$("#search").oninput=renderMenu;
$("#clearCart").onclick=()=>{cart=[];save();toast("Basket cleared")};
$("#checkout").onclick=()=>{if(!cart.length){toast("Your basket is empty!");return}$("#modalContent").innerHTML=`<h2>🧾 Order Ready!</h2><p>Your order total is <b>${$("#total").textContent}</b>.</p><p>Checkout is set up for this website, but no payment is processed here.</p><button class="primary" id="done">Place Order</button>`;$("#modal").classList.add("show");$("#done").onclick=()=>{cart=[];coins+=10;toast("🎉 Order placed! +10 coins");save();$("#modal").classList.remove("show")}};
$("#closeModal").onclick=()=>$("#modal").classList.remove("show");
$("#modal").onclick=e=>{if(e.target.id==="modal")$("#modal").classList.remove("show")};
document.addEventListener("keydown",e=>{if(e.key==="Escape")$("#modal").classList.remove("show")});

$("#themeBtn").onclick=()=>{document.body.classList.toggle("night");let n=document.body.classList.contains("night");$("#themeBtn").textContent=n?"☀️ Day":"🌙 Night";localStorage.setItem("ykNight",n?"1":"0")};
if(localStorage.getItem("ykNight")==="1"){document.body.classList.add("night");$("#themeBtn").textContent="☀️ Day"}
$("#soundBtn").onclick=()=>{soundOn=!soundOn;localStorage.setItem("ykSound",soundOn?"on":"off");$("#soundBtn").textContent=soundOn?"🔊 Sound":"🔇 Sound";toast(soundOn?"Sound on":"Sound off")};
if(!soundOn)$("#soundBtn").textContent="🔇 Sound";

let titleClicks=0;
$("#secretTitle").addEventListener("click",()=>{
 titleClicks++;
 if(titleClicks>=3){
  titleClicks=0;
  $("#secretRoom").classList.add("unlocked");
  localStorage.setItem("ykSecret","1");
  coins+=25; save();
  toast("🗝️ SECRET ROOM UNLOCKED! +25 coins");
  setTimeout(()=>$("#secretRoom").scrollIntoView({behavior:"smooth",block:"center"}),150);
 }
});
if(localStorage.getItem("ykSecret")==="1")$("#secretRoom").classList.add("unlocked");

const promos=["Fresh from the kitchen!","Chef's special incoming!","Big flavour. Big vibes.","Something delicious is cooking..."];
let pi=0;setInterval(()=>{$("#promoText").textContent=promos[++pi%promos.length]},1800);
$("#chefStatus").textContent=["Chef is cooking!","Chef is plating!","Chef is checking the sauce!","Chef is preparing dessert!"][new Date().getMinutes()%4];
$("#dailyPick").textContent=foods[new Date().getDate()%foods.length][2];

let gameRunning=false,score=0,time=30,timer;
const gameFoods=["🍔","🍕","🍪","🍟","🍩","🍗","🍓","🥞","🍰","🍜","🧁","🍉"];
function startGame(){
 if(gameRunning)return;
 gameRunning=true;score=0;time=30;$("#score").textContent=0;$("#time").textContent=30;$("#startGame").textContent="GAME RUNNING!";
 const board=$("#gameBoard");
 $$(".game-food").forEach(x=>x.remove());
 timer=setInterval(()=>{time--;$("#time").textContent=time;if(time<=0)endGame()},1000);
 let spawner=setInterval(()=>{if(!gameRunning){clearInterval(spawner);return}spawnFood()},600);
 board.dataset.spawner="1";
}
function spawnFood(){
 if(!gameRunning)return;
 const board=$("#gameBoard"),el=document.createElement("span");el.className="game-food";el.textContent=gameFoods[Math.floor(Math.random()*gameFoods.length)];
 el.style.left=(5+Math.random()*88)+"%";el.style.animationDuration=(1.5+Math.random()*1.7)+"s";board.appendChild(el);
 el.onclick=()=>{if(!gameRunning)return;score++;$("#score").textContent=score;el.remove();if(score%5===0){coins+=10;updateCoins();toast("🪙 +10 coins!")}};
 setTimeout(()=>el.remove(),3800);
}
function endGame(){gameRunning=false;clearInterval(timer);if(score>best){best=score;toast(`🏆 New best score: ${score}!`)}else toast(`🎮 Game over — score ${score}`);coins+=Math.max(0,score);$("#startGame").textContent="PLAY AGAIN";save()}
$("#startGame").onclick=startGame;

updateCoins();renderMenu();renderCart();renderAchievements();

});