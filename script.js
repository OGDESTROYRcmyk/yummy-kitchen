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

let gameRunning=false,score=0,time=30,timer,spawnTimer;
let basketX=50;
const gameFoods=["🍔","🍕","🍪","🍟","🍩","🍗","🍓","🥞","🍰","🍜","🧁","🍉"];

function moveBasket(dir){
 if(!gameRunning)return;
 basketX=Math.max(7,Math.min(93,basketX+dir*5));
 $("#basket").style.left=basketX+"%";
}
document.addEventListener("keydown",e=>{
 if(e.key==="ArrowLeft"){e.preventDefault();moveBasket(-1)}
 if(e.key==="ArrowRight"){e.preventDefault();moveBasket(1)}
});

function startGame(){
 if(gameRunning)return;
 gameRunning=true;score=0;time=30;basketX=50;
 $("#score").textContent=0;$("#time").textContent=30;$("#basket").style.left="50%";
 $("#startGame").textContent="GAME RUNNING!";
 $$(".game-food").forEach(x=>x.remove());
 timer=setInterval(()=>{time--;$("#time").textContent=time;if(time<=0)endGame()},1000);
 spawnTimer=setInterval(spawnFood,650);
 spawnFood();
}

function spawnFood(){
 if(!gameRunning)return;
 const board=$("#gameBoard"),el=document.createElement("span");
 el.className="game-food";
 el.textContent=gameFoods[Math.floor(Math.random()*gameFoods.length)];
 el.style.left=(4+Math.random()*92)+"%";
 el.style.animationDuration="2.8s";
 board.appendChild(el);

 const check=setInterval(()=>{
  if(!gameRunning){clearInterval(check);return}
  const a=el.getBoundingClientRect(),b=$("#basket").getBoundingClientRect();
  if(a.bottom>=b.top && a.left<b.right && a.right>b.left){
   score++;$("#score").textContent=score;el.remove();clearInterval(check);
   if(score%5===0){coins+=10;updateCoins();toast("🪙 +10 coins!")}
  }
 },40);

 setTimeout(()=>{clearInterval(check);el.remove()},3000);
}

function endGame(){
 gameRunning=false;clearInterval(timer);clearInterval(spawnTimer);
 $$(".game-food").forEach(x=>x.remove());
 if(score>best){best=score;toast(`🏆 New best score: ${score}!`)}
 else toast(`🎮 Game over — score ${score}`);
 coins+=Math.max(0,score);
 $("#startGame").textContent="PLAY AGAIN";
 save();
}
$("#startGame").onclick=startGame;


// ===== YUMMY KITCHEN 3.0 =====
let powerups=JSON.parse(localStorage.getItem("ykPowerups")||'{"magnet":0,"life":0,"slow":0}');
let rooms=JSON.parse(localStorage.getItem("ykRooms")||'{"burger":true}');
let lastReward=localStorage.getItem("ykDailyReward")||"";
let lastSpin=localStorage.getItem("ykSpin")||"";
let challenge=localStorage.getItem("ykChallenge")||"";
const today=new Date().toISOString().slice(0,10);

function saveExtras(){
 localStorage.setItem("ykPowerups",JSON.stringify(powerups));
 localStorage.setItem("ykRooms",JSON.stringify(rooms));
}

function renderShop(){
 const items=[
  ["magnet","🧲 Food Magnet","Makes catching food easier","25"],
  ["life","❤️ Extra Life","Adds one game life","30"],
  ["slow","🐌 Slow Mode","Slows falling food for your next game","35"]
 ];
 $("#shop").innerHTML=items.map(x=>`<div class="shop-item"><div style="font-size:2.5rem">${x[0]==="magnet"?"🧲":x[0]==="life"?"❤️":"🐌"}</div><h3>${x[1]}</h3><p>${x[2]}</p><b>£? · ${x[3]} 🪙</b><button data-buy="${x[0]}" class="primary">Buy · ${x[3]} 🪙</button><div class="owned">Owned: ${powerups[x[0]]}</div></div>`).join("");
 $$("#shop [data-buy]").forEach(b=>b.onclick=()=>{
   const id=b.dataset.buy,cost={magnet:25,life:30,slow:35}[id];
   if(coins<cost){toast("🪙 Not enough coins!");return}
   coins-=cost;powerups[id]++;saveExtras();save();renderShop();toast("⚡ Upgrade purchased!");
 });
}

function renderRooms(){
 const data=[
  ["burger","🍔 Burger Room","The home of legendary burgers.",40],
  ["dessert","🍰 Dessert Room","Unlock the sweet kitchen.",60],
  ["drinks","🥤 Drink Bar","Mix up the drink station.",80],
  ["noodle","🍜 Noodle Kitchen","The noodle chef's secret area.",100],
  ["vip","👑 VIP Kitchen","The ultimate Yummy Kitchen room.",150]
 ];
 $("#rooms").innerHTML=data.map(x=>{
   const open=rooms[x[0]];
   return `<div class="room-card"><div style="font-size:2.5rem">${x[1].split(" ")[0]}</div><h3>${x[1]}</h3><p>${x[2]}</p>${open?'<div class="owned">🔓 UNLOCKED</div>':`<button class="primary" data-room="${x[0]}" data-cost="${x[3]}">🔒 Unlock · ${x[3]} 🪙</button>`}</div>`
 }).join("");
 $$("#rooms [data-room]").forEach(b=>b.onclick=()=>{
   const id=b.dataset.room,cost=Number(b.dataset.cost);
   if(coins<cost){toast("🪙 You need more coins!");return}
   coins-=cost;rooms[id]=true;saveExtras();save();renderRooms();toast("🗺️ New kitchen room unlocked!");
 });
}

function renderDaily(){
 const targets=[
  ["Add 3 items to your basket","3 items","basket"],
  ["Earn 25 Yummy Coins","25 coins","coins"],
  ["Score 8 in Catch The Food","8 points","game"]
 ];
 const idx=new Date().getDate()%targets.length;
 const t=targets[idx];
 let progress=t[2]==="basket"?Math.min(3,cart.length):t[2]==="coins"?Math.min(25,coins):Math.min(8,best);
 $("#dailyChallenge").innerHTML=`<b>🎯 Today's Challenge:</b> ${t[0]}<br><br>Progress: <b>${progress}</b> / ${t[1]}`;
}

$("#dailyReward").onclick=()=>{
 if(lastReward===today){toast("🎁 You already claimed today's reward!");return}
 lastReward=today;localStorage.setItem("ykDailyReward",today);coins+=30;save();toast("🎁 Daily reward: +30 Yummy Coins!");renderDaily()
};

$("#spinWheel").onclick=()=>{
 if(lastSpin===today){toast("🎰 Come back tomorrow for another spin!");return}
 lastSpin=today;localStorage.setItem("ykSpin",today);
 const rewards=["🪙 +15 Coins","🪙 +25 Coins","❤️ +1 Life","🧲 +1 Magnet","🏆 +50 Coins"];
 const reward=rewards[Math.floor(Math.random()*rewards.length)];
 $("#wheelResult").classList.remove("spin");void $("#wheelResult").offsetWidth;$("#wheelResult").classList.add("spin");$("#wheelResult").textContent=reward;
 if(reward.includes("+15"))coins+=15;
 if(reward.includes("+25"))coins+=25;
 if(reward.includes("+50"))coins+=50;
 if(reward.includes("Life"))powerups.life++;
 if(reward.includes("Magnet"))powerups.magnet++;
 saveExtras();save();renderShop();toast("🎰 You won "+reward+"!");
};

$("#createDish").onclick=()=>{
 const a=$("#dishBase").value,b=$("#dishSauce").value,c=$("#dishExtra").value;
 const price=(15+Math.floor(Math.random()*15)).toFixed(2);
 $("#createdDish").innerHTML=`<div style="font-size:2.5rem">🍽️</div><h3>Your Signature Dish</h3><p>${a} + ${b} + ${c}</p><b>Menu price: £${price}</b><br><button id="addCreated" class="primary" style="margin-top:10px">➕ Add My Dish</button>`;
 $("#addCreated").onclick=()=>{cart.push({name:"My Signature Dish",price:Number(price),emoji:"🍽️"});coins+=5;save();toast("✨ Signature dish added! +5 coins")};
};

$("#mysteryBox").onclick=()=>{
 if(coins<20){toast("🪙 You need 20 coins!");return}
 coins-=20;
 const rewards=[["🪙 +50 Coins",()=>coins+=50],["❤️ +1 Extra Life",()=>powerups.life++],["🧲 +1 Magnet",()=>powerups.magnet++],["🪙 +30 Coins",()=>coins+=30],["🏆 +75 Coins",()=>coins+=75]];
 const r=rewards[Math.floor(Math.random()*rewards.length)];r[1]();
 $("#mysteryResult").innerHTML=`🎁 <b>You opened the Mystery Box!</b><br><br>You got: <strong>${r[0]}</strong>`;
 saveExtras();save();renderShop();toast("🎁 Mystery reward unlocked!");
};

// Improve game with levels, lives, combos, upgrades.
let gameLevel=1,gameLives=3,combo=0;
function updateGameHUD(){
 $("#level").textContent=gameLevel;$("#lives").textContent=gameLives;$("#score").textContent=score;
}
const oldStartGame=startGame;
startGame=function(){
 if(gameRunning)return;
 gameLevel=1;gameLives=3+powerups.life;combo=0;
 if(powerups.life) powerups.life=0;
 updateGameHUD();
 oldStartGame();
};
function enhancedSpawnFood(){
 if(!gameRunning)return;
 const board=$("#gameBoard"),el=document.createElement("span");
 el.className="game-food";el.textContent=gameFoods[Math.floor(Math.random()*gameFoods.length)];
 el.style.left=(4+Math.random()*92)+"%";
 const speed=powerups.slow>0?3.8:Math.max(1.4,2.8-gameLevel*.08);
 el.style.animationDuration=speed+"s";board.appendChild(el);
 const check=setInterval(()=>{
   if(!gameRunning){clearInterval(check);return}
   const a=el.getBoundingClientRect(),b=$("#basket").getBoundingClientRect();
   const magnet=powerups.magnet>0;
   const bx=magnet?b.left-45:b.left,br=magnet?b.right+45:b.right;
   if(a.bottom>=b.top && a.left<br && a.right>bx){
     score++;combo++;$("#score").textContent=score;el.remove();clearInterval(check);
     if(combo%5===0){coins+=10;toast("🔥 COMBO! +10 coins")}
     if(score>=10&&gameLevel<5){gameLevel++;toast("⬆️ LEVEL "+gameLevel+"!");updateGameHUD()}
   }
 },35);
 setTimeout(()=>{
   if(el.isConnected){el.remove();combo=0;gameLives--;updateGameHUD();if(gameLives<=0)endGame()}
   clearInterval(check)
 },speed*1000);
}
spawnFood=enhancedSpawnFood;

renderShop();renderRooms();renderDaily();updateGameHUD();

updateCoins();renderMenu();renderCart();renderAchievements();

});

/* YUMMY KITCHEN CITY */
const CITY_KEY='yummyCityState';
let cityState=JSON.parse(localStorage.getItem(CITY_KEY)||'null')||{
  coins:0, rep:0, level:1, lastReward:'', districts:{'Burger District':true}, mission:0
};
function saveCity(){localStorage.setItem(CITY_KEY,JSON.stringify(cityState)); updateCityUI();}
function cityMsg(t){
  const el=document.getElementById('cityLog'); if(el) el.textContent=t;
  if(typeof window.toast==='function') window.toast(t); else console.log(t);
}
function updateCityUI(){
  const c=document.getElementById('cityCoins'),r=document.getElementById('cityRep'),l=document.getElementById('cityLevel');
  if(c)c.textContent=cityState.coins;
  if(r)r.textContent=cityState.rep;
  if(l)l.textContent=cityState.level;
  document.querySelectorAll('.city-card').forEach(card=>{
    const name=card.querySelector('b')?.textContent;
    if(cityState.districts[name]){
      card.classList.add('unlocked');
      const small=card.querySelector('small'); if(small) small.textContent='Unlocked — visit the district!';
    }
  });
}
function openCity(){
  document.getElementById('city')?.scrollIntoView({behavior:'smooth',block:'start'});
  cityMsg('🏙️ Welcome to Yummy Kitchen City!');
}
function visitDistrict(name){
  if(!cityState.districts[name]) return cityMsg('🔒 Unlock this district first!');
  cityState.rep+=10;
  cityState.coins+=25;
  cityState.mission++;
  saveCity();
  cityMsg('🚶 You visited '+name+'! +25 City Coins and +10 Reputation.');
}
function unlockDistrict(card,name,cost){
  if(cityState.districts[name]) return visitDistrict(name);
  if(cityState.coins<cost) return cityMsg('🪙 You need '+cost+' City Coins to unlock '+name+'.');
  cityState.coins-=cost;
  cityState.districts[name]=true;
  cityState.rep+=25;
  saveCity();
  cityMsg('🎉 '+name+' unlocked! Your city is growing!');
}
function cityMission(){
  const target=5;
  if(cityState.mission>=target){
    cityState.mission=0; cityState.coins+=150; cityState.rep+=50; saveCity();
    return cityMsg('🏆 Mission complete! +150 City Coins and +50 Reputation.');
  }
  cityMsg('📋 City Mission: visit '+(target-cityState.mission)+' more district'+(target-cityState.mission===1?'':'s')+'.');
}
function cityReward(){
  const today=new Date().toISOString().slice(0,10);
  if(cityState.lastReward===today) return cityMsg('⏰ You already collected today’s City Reward.');
  cityState.lastReward=today; cityState.coins+=100; cityState.rep+=20; saveCity();
  cityMsg('🎁 Daily City Reward: +100 City Coins and +20 Reputation!');
}
function cityUpgrade(){
  const cost=cityState.level*250;
  if(cityState.coins<cost) return cityMsg('⬆️ City Level '+(cityState.level+1)+' costs '+cost+' City Coins.');
  cityState.coins-=cost; cityState.level++; cityState.rep+=75; saveCity();
  cityMsg('🌟 City upgraded to Level '+cityState.level+'!');
}
document.addEventListener('DOMContentLoaded',updateCityUI);
