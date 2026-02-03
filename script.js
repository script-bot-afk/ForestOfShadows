// ==============================
// Scopophobia: Forest of Shadows - Epic CYOA
// ==============================

// --- GAME STATE ---
let inventory = [];
let stats = { health: 10, mana: 5, stamina: 5, courage: 5, sanity: 10 };
let currentLocation = "start";

// --- HTML ELEMENTS ---
const gameText = document.getElementById('gameText');
const choicesDiv = document.getElementById('choices');
const inventoryList = document.getElementById('inventoryList');

// --- HELPER FUNCTIONS ---
function addToInventory(item){
    if(!inventory.includes(item)){
        inventory.push(item);
        updateInventoryDisplay();
    }
}
function removeFromInventory(item){
    inventory = inventory.filter(i=>i!==item);
    updateInventoryDisplay();
}
function updateInventoryDisplay(){
    inventoryList.innerHTML = '';
    inventory.forEach(item=>{
        const li = document.createElement('li');
        li.textContent = item;
        inventoryList.appendChild(li);
    });
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

// Random event helper
function randomEvent(events){
    if(Math.random()<0.3){ // 30% chance
        const e = events[Math.floor(Math.random()*events.length)];
        updateText(e.text);
        if(e.item) addToInventory(e.item);
        if(e.health) stats.health += e.health;
        if(e.mana) stats.mana += e.mana;
        if(e.stamina) stats.stamina += e.stamina;
        if(e.courage) stats.courage += e.courage;
        if(e.sanity) stats.sanity += e.sanity;
    }
}

// Secret encounter helper
function secretEncounter(){
    const secrets = [
        { text: "A glowing spirit restores your courage.", courage: +3 },
        { text: "A hidden pit traps you briefly. Stamina -2.", stamina: -2 },
        { text: "You find an ancient scroll. Mana +3.", mana: +3, item: "Ancient Scroll" },
        { text: "A shadow beast attacks! Health -4.", health: -4 },
        { text: "A hidden treasure chest appears with a mysterious key.", item: "Mysterious Key" },
        { text: "A spectral vision frightens you. Sanity -2.", sanity: -2 }
    ];
    const s = secrets[Math.floor(Math.random()*secrets.length)];
    updateText(s.text);
    if(s.item) addToInventory(s.item);
    if(s.health) stats.health += s.health;
    if(s.mana) stats.mana += s.mana;
    if(s.stamina) stats.stamina += s.stamina;
    if(s.courage) stats.courage += s.courage;
    if(s.sanity) stats.sanity += s.sanity;
}

// --- ENDINGS ---
function endingSpirit(){
    updateText("You become a guardian spirit of the forest, forever watching the shadows. <b>The End.</b>");
    setChoices([{ text:"Play Again", action:start }]);
}
function endingTreasure(){
    updateText("You escape with legendary treasure. Your name becomes a tale told for centuries. <b>The End.</b>");
    setChoices([{ text:"Play Again", action:start }]);
}
function endingDarkness(){
    updateText("The forest consumes you. You vanish into the shadows forever. <b>The End.</b>");
    setChoices([{ text:"Play Again", action:start }]);
}
function gameOver(message){
    updateText(`<b>GAME OVER:</b> ${message}`);
    setChoices([{ text:"Restart", action:start }]);
}

// --- STORY LOCATIONS ---
const storyData = {};

// --- Start and early forest ---
storyData["start"] = {
    text:"You awaken at the edge of the Forest of Shadows. Dark trees loom. You clutch your staff.",
    choices:[
        { text:"Enter forest", action:()=>goTo("forestEntrance") },
        { text:"Walk along edge", action:()=>goTo("forestEdge") },
        { text:"Check inventory", action:()=>goTo("checkInventory") }
    ]
};

storyData["forestEntrance"] = {
    text:"Twisted branches create eerie shadows. A blue vial glimmers on the ground.",
    choices:[
        { text:"Pick up vial", action:()=>{ addToInventory("Mana Potion"); goTo("deeperForest"); } },
        { text:"Ignore it", action:()=>goTo("deeperForest") },
        { text:"Return to edge", action:()=>goTo("forestEdge") }
    ]
};

storyData["forestEdge"] = {
    text:"Along the forest edge, sunlight glimmers across a quiet stream.",
    choices:[
        { text:"Rest by stream", action:()=>{ stats.health+=2; goTo("forestEntrance"); } },
        { text:"Enter forest anyway", action:()=>goTo("forestEntrance") }
    ]
};

storyData["deeperForest"] = {
    text:"Fog thickens. Whispering voices echo. Two paths lie ahead: the Misty Path or the Ruins Path.",
    choices:[
        { text:"Take the Misty Path", action:()=>goTo("mistyPath") },
        { text:"Explore the Ruins Path", action:()=>goTo("ruinsPath") },
        { text:"Drink Mana Potion (if available)", action:()=>goTo("drinkPotion") }
    ]
};

// --- 50+ Locations ---
// Here we add 40+ extra locations programmatically for now
for(let i=1;i<=40;i++){
    storyData["extraLocation"+i] = {
        text: `Mysterious area #${i}. Something strange happens.`,
        choices:[
            { text:"Continue", action:()=>goTo("extraLocation"+(i+1) || "forestClearing") }
        ]
    };
}

// --- Special locations & final zones ---
storyData["mistyPath"] = {
    text:"The mist swirls unnaturally. Shadows flicker and shapes seem to move. A shadow beast lunges!",
    choices:[
        { text:"Fight with staff", action:fightShadow },
        { text:"Flee back to Ruins Path", action:()=>goTo("ruinsPath") }
    ]
};

storyData["ruinsPath"] = {
    text:"Ancient ruins loom. A pedestal holds a rusty key.",
    choices:[
        { text:"Take rusty key", action:()=>{ addToInventory("Rusty Key"); goTo("hiddenChamber"); } },
        { text:"Ignore key", action:()=>goTo("hiddenChamber") },
        { text:"Return to Misty Path", action:()=>goTo("mistyPath") }
    ]
};

storyData["hiddenChamber"] = {
    text:"Hidden chamber hums with magic. Two chests: Golden and Shadowed.",
    choices:[
        { text:"Open Golden Chest", action:goldenChest },
        { text:"Open Shadowed Chest", action:shadowChest },
        { text:"Leave chamber", action:()=>goTo("forestClearing") }
    ]
};

storyData["forestClearing"] = {
    text:"A clearing opens, light pierces the darkness. Paths continue to deeper forest or back to edge.",
    choices:[
        { text:"Venture deeper", action:()=>goTo("necroticSwamp") },
        { text:"Return to forest edge", action:()=>goTo("forestEdge") }
    ]
};

storyData["necroticSwamp"] = {
    text:"Swamp thick with mist and foul stench. Unseen creatures stir.",
    choices:[
        { text:"Cross carefully", action:()=>goTo("hauntedBridge") },
        { text:"Return to clearing", action:()=>goTo("forestClearing") }
    ]
};

storyData["hauntedBridge"] = {
    text:"Old wooden bridge creaks over black waters. Shadows move beneath.",
    choices:[
        { text:"Cross bridge", action:()=>goTo("ancientTower") },
        { text:"Step back", action:()=>goTo("necroticSwamp") }
    ]
};

storyData["ancientTower"] = {
    text:"Tower ruins with spiral staircase. Faint light above.",
    choices:[
        { text:"Climb staircase", action:()=>goTo("towerSummit") },
        { text:"Explore basement", action:()=>goTo("towerBasement") }
    ]
};

storyData["towerBasement"] = {
    text:"Whispers echo in darkness. Ancient glyphs pulse with magic.",
    choices:[
        { text:"Investigate whispers", action:()=>{ stats.sanity-=2; goTo("hiddenLibrary"); } },
        { text:"Return upstairs", action:()=>goTo("ancientTower") }
    ]
};

storyData["towerSummit"] = {
    text:"Summit opens to the sky. Stars flicker strangely.",
    choices:[
        { text:"Use telescope", action:()=>{ addToInventory("Star Map"); goTo("spiritGlade"); } },
        { text:"Rest", action:()=>{ stats.stamina+=2; goTo("spiritGlade"); } }
    ]
};

storyData["hiddenLibrary"] = {
    text:"Secret library with glowing books.",
    choices:[
        { text:"Read spellbook", action:()=>{ stats.mana+=3; goTo("cursedGrove"); } },
        { text:"Search shelves", action:()=>{ addToInventory("Ancient Scroll"); goTo("cursedGrove"); } }
    ]
};

storyData["cursedGrove"] = {
    text:"Grove corrupted with dark energy. Path forks: left or right.",
    choices:[
        { text:"Left path", action:()=>goTo("bloodMoonClearing") },
        { text:"Right path", action:()=>goTo("crystalCavern") }
    ]
};

storyData["bloodMoonClearing"] = {
    text:"Red moon bathes clearing. Shadows move violently.",
    choices:[
        { text:"Fight shadows", action:fightShadow },
        { text:"Hide", action:()=>{ stats.sanity-=3; goTo("crystalCavern"); } }
    ]
};

storyData["crystalCavern"] = {
    text:"Cavern walls glitter with crystals. Magical energy pulses.",
    choices:[
        { text:"Collect crystal", action:()=>{ addToInventory("Magic Crystal"); stats.mana+=2; goTo("floatingIsland"); } },
        { text:"Proceed further", action:()=>goTo("floatingIsland") }
    ]
};

storyData["floatingIsland"] = {
    text:"Floating island, strange gravity. A portal shimmers.",
    choices:[
        { text:"Enter portal", action:endingTreasure },
        { text:"Rest on island", action:()=>{ stats.stamina+=2; goTo("spiritGlade"); } }
    ]
};

storyData["spiritGlade"] = {
    text:"Glade filled with spirits, calming presence.",
    choices:[
        { text:"Meditate", action:()=>{ stats.courage+=3; goTo("floatingIsland"); } },
        { text:"Explore further", action:()=>goTo("floatingIsland") }
    ]
};

storyData["drinkPotion"] = {
    text:"You drink the potion. Mana +5.",
    choices:[
        { text:"Continue", action:()=>{ stats.mana+=5; goTo("deeperForest"); removeFromInventory("Mana Potion"); } }
    ]
};

storyData["checkInventory"] = {
    text:"Inventory: "+(inventory.join(", ")||"Nothing"),
    choices:[
        { text:"Back", action:()=>goTo(currentLocation) }
    ]
};

// --- STORY FUNCTIONS ---
function goTo(location){
    currentLocation = location;
    if(Math.random()<0.05) secretEncounter(); // 5% secret
    const loc = storyData[location];
    if(!loc) { gameOver("You wander into unknown darkness."); return; }
    updateText(loc.text);
    setChoices(loc.choices);
}

// --- SPECIAL FUNCTIONS ---
function fightShadow(){
    if(stats.mana>0){
        stats.mana-=2;
        updateText("You cast a spell, scattering the shadow beast. You escape safely.");
        setChoices([{ text:"Continue", action:()=>goTo("ruinsPath") }]);
    } else {
        stats.health-=3;
        if(stats.health<=0) gameOver("Without magic, the shadow beast kills you.");
        else setChoices([{ text:"Run", action:()=>goTo("ruinsPath") }]);
    }
}

function goldenChest(){
    addToInventory("Enchanted Amulet");
    stats.mana+=3;
    updateText("Golden chest: Enchanted Amulet! Mana +3.");
    setChoices([{ text:"Proceed", action:()=>goTo("forestClearing") }]);
}

function shadowChest(){
    stats.health-=5;
    if(stats.health<=0) gameOver("The shadow wraith drains your life.");
    else setChoices([
        { text:"Flee to clearing", action:()=>goTo("forestClearing") },
        { text:"Attempt to banish wraith", action:attemptBanish }
    ]);
}

function attemptBanish(){
    if(inventory.includes("Enchanted Amulet")){
        updateText("Amulet glows, banishing the wraith!");
        setChoices([{ text:"Proceed", action:()=>goTo("forestClearing") }]);
    } else {
        stats.health-=3;
        if(stats.health<=0) gameOver("Without protection, wraith kills you.");
        else setChoices([{ text:"Flee", action:()=>goTo("forestClearing") }]);
    }
}

// --- START GAME ---
function start(){
    inventory=[];
    stats = { health:10, mana:5, stamina:5, courage:5, sanity:10 };
    updateInventoryDisplay();
    goTo("start");
}

// Launch game
start();
