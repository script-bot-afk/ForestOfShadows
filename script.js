// === Game State ===
let inventory = [];
let stats = { health: 10, mana: 5 };
let storyProgress = "start";

// === HTML Elements ===
const gameText = document.getElementById('gameText');
const choicesDiv = document.getElementById('choices');
const inventoryList = document.getElementById('inventoryList');

// === Helper Functions ===
function addToInventory(item){
  if(!inventory.includes(item)){
    inventory.push(item);
    const li = document.createElement('li');
    li.textContent = item;
    inventoryList.appendChild(li);
  }
}

function updateText(text){
  gameText.innerHTML = text;
}

function setChoices(options){
  choicesDiv.innerHTML = '';
  options.forEach(o=>{
    const btn = document.createElement('button');
    btn.textContent = o.text;
    btn.className = 'choice';
    btn.onclick = ()=>o.action();
    choicesDiv.appendChild(btn);
  });
}

// === Story ===
function start(){
  storyProgress = "start";
  updateText(`You awaken at the edge of the <b>Forest of Shadows</b>, the trees looming dark and silent. 
  Your heart pounds as whispers drift through the fog. You clutch your staff tightly.`);
  
  setChoices([
    { text: "Step into the forest", action: forestEntrance },
    { text: "Walk along the edge", action: forestEdge },
    { text: "Check your supplies", action: checkInventory }
  ]);
}

function forestEntrance(){
  storyProgress = "entrance";
  updateText(`You step beneath the twisted branches. A faint glow catches your eye on the ground: a <b>small vial of blue liquid</b>.`);
  setChoices([
    { text: "Pick up the vial", action: ()=>{ addToInventory("Mana Potion"); deeperForest(); } },
    { text: "Ignore it and move forward", action: deeperForest },
    { text: "Return to the forest edge", action: forestEdge }
  ]);
}

function deeperForest(){
  storyProgress = "deeper";
  updateText(`The fog thickens. You hear rustling. Something moves in the shadows. 
  Suddenly, two paths appear: one toward a <b>creeping mist</b>, one toward a <b>sunken path with ruins</b>.`);
  setChoices([
    { text: "Take the misty path", action: mistyPath },
    { text: "Explore the ruins", action: ruinsPath },
    { text: "Drink Mana Potion (if you have one)", action: drinkPotion }
  ]);
}

function mistyPath(){
  storyProgress = "mist";
  updateText(`The mist swirls unnaturally. Shapes seem to dance. Your vision blurs. 
  A shadow beast lunges!`);
  stats.health -= 3;
  if(stats.health <= 0) {
    gameOver("The shadow beast overpowers you. Your adventure ends here.");
    return;
  }
  setChoices([
    { text: "Fight with staff", action: fightShadow },
    { text: "Run back to ruins", action: ruinsPath }
  ]);
}

function ruinsPath(){
  storyProgress = "ruins";
  updateText(`You enter the crumbling ruins. Ancient runes glow faintly. A <b>rusty key</b> lies on a pedestal.`);
  setChoices([
    { text: "Take the key", action: ()=>{ addToInventory("Rusty Key"); hiddenChamber(); } },
    { text: "Ignore the key and continue", action: hiddenChamber },
    { text: "Return to misty path", action: mistyPath }
  ]);
}

function hiddenChamber(){
  storyProgress = "chamber";
  updateText(`You discover a hidden chamber beneath the ruins. The air hums with magic. 
  Two chests sit before you: one <b>golden</b>, one <b>shadowed</b>.`);
  setChoices([
    { text: "Open golden chest", action: goldenChest },
    { text: "Open shadowed chest", action: shadowChest },
    { text: "Leave the chamber", action: forestExit }
  ]);
}

function goldenChest(){
  addToInventory("Enchanted Amulet");
  updateText(`Inside the golden chest you find an <b>Enchanted Amulet</b>! Your mana increases.`);
  stats.mana += 3;
  setChoices([
    { text: "Proceed deeper", action: forestExit }
  ]);
}

function shadowChest(){
  updateText(`A dark wraith emerges from the chest! You are struck with necrotic energy.`);
  stats.health -= 5;
  if(stats.health <= 0) gameOver("The wraith drains your life completely.");
  else setChoices([
    { text: "Flee to forest exit", action: forestExit },
    { text: "Attempt to banish wraith", action: attemptBanish }
  ]);
}

function attemptBanish(){
  if(inventory.includes("Enchanted Amulet")){
    updateText(`The amulet glows brightly, banishing the wraith into the shadows!`);
    setChoices([
      { text: "Proceed to forest exit", action: forestExit }
    ]);
  } else {
    stats.health -= 3;
    if(stats.health <= 0) gameOver("Without protection, the wraith kills you.");
    else setChoices([
      { text: "Flee to forest exit", action: forestExit }
    ]);
  }
}

function fightShadow(){
  if(stats.mana > 0){
    stats.mana -= 2;
    updateText(`You cast a bright spell, scattering the shadow beast. You escape safely.`);
    setChoices([
      { text: "Continue to ruins", action: ruinsPath }
    ]);
  } else {
    stats.health -= 3;
    if(stats.health <= 0) gameOver("Without magic, the shadow beast kills you.");
    else setChoices([
      { text: "Run to ruins", action: ruinsPath }
    ]);
  }
}

function drinkPotion(){
  if(inventory.includes("Mana Potion")){
    inventory = inventory.filter(i=>i!=="Mana Potion");
    updateInventoryDisplay();
    stats.mana += 5;
    updateText(`You drink the potion. Mana restored!`);
    setChoices([
      { text: "Proceed into forest", action: deeperForest }
    ]);
  } else {
    updateText("You don't have a Mana Potion.");
    setChoices([
      { text: "Proceed into forest", action: deeperForest }
    ]);
  }
}

function forestEdge(){
  storyProgress = "edge";
  updateText(`Walking along the edge of the forest, you find a quiet stream. The sunlight glimmers faintly.`);
  setChoices([
    { text: "Rest here for a moment", action: restByStream },
    { text: "Venture into the forest anyway", action: forestEntrance }
  ]);
}

function restByStream(){
  stats.health += 2;
  updateText("You rest by the stream. Your body feels rejuvenated.");
  setChoices([
    { text: "Enter forest", action: forestEntrance }
  ]);
}

function forestExit(){
  storyProgress = "exit";
  updateText(`You finally see a clearing ahead. Light pierces the darkness. Your adventure ends here.`);
  setChoices([
    { text: "Play Again", action: start }
  ]);
}

function gameOver(message){
  updateText(`<b>GAME OVER:</b> ${message}`);
  setChoices([
    { text: "Restart", action: start }
  ]);
}

// === Inventory Update Helper ===
function updateInventoryDisplay(){
  inventoryList.innerHTML = '';
  inventory.forEach(item=>{
    const li = document.createElement('li');
    li.textContent = item;
    inventoryList.appendChild(li);
  });
}

// === Start Game ===
start();
