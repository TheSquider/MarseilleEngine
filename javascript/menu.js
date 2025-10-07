//
//for npc dialog go to npc.js
let glbtxt; //the textbox used by all scripts (and npc.js)
let appBool = true; //Wether the txtbox is open or closed
let menuBool = false; //Used only in basics.js, here only for ease
//DialogOption is in basics

//MOVE TO FILE
let menuOptionsDefault = ['0', '1', '2'];
let menuTextDefault = ['STATISTICS', 'QUESTS', 'ITEMS']
let menuScreens = [
    "There are no Statistics in this level. Your EXP wont save you.", 
    "You have no Quests! What even is your purpose in life?", 
    "You also have nothing."
]

function setTXT(txt) { //to be called by the body
    glbtxt = txt;
    txt.remove();
    appBool = false;
}

//MENU
//
//I don't know how in-options menus will work (like getting to specific item or quest)
function menu(menuOptions, menuText) { //Why do I need them as arguments when they are already in the file? Flexibility? Idk what I was thinking. If it works dont fix it.
    let txtToGive = "<ul>"
    for (let i = 0; i < menuOptions.length; i++) {
        const opt = menuOptions[i];
        const txt = menuText[i];
        txtToGive += "<li id='" + opt + "'>" + txt + "</li>";
    }
    txtToGive += "</ul>"
    glbtxt.innerHTML = txtToGive;
    
    document.body.appendChild(glbtxt);
    document.getElementById('0').style.color = 'red';
    
    dialogOption = 0;
    appBool = true;
    //90% of this is housekeeping flexibility stuff. Life is cruel.
}
function selectMenu(LoR, menuOptions) {
    //console.log(menuOptions[dialogOption]);
    
    dialogOption += LoR; if(dialogOption > menuOptions.length-1){dialogOption = menuOptions.length-1}if(dialogOption < 0){dialogOption = 0}
    
    document.getElementById(menuOptions[dialogOption]).style.color = 'red';
    for (let i = 0; i < menuOptions.length; i++) {
        if (menuOptions[i] != menuOptions[dialogOption]) {
            document.getElementById(menuOptions[i]).style.color = 'white';
        }
    }
    //rethink
}
function clickMenu(dOp) {
    glbtxt.innerHTML = menuScreens[dOp];
    //rethink
}