let pos = [0, 0]
let objsPos = []
let npc = [] //Array of arrays, in an array: 0 is x axis, 1 is y axis, 2 is id, 3 is element
let dialogStage = 1; //dialogStage = 0 is not talking (not used as a check in code, but setting it to 0 from the start breaks it)
let dialogOption = 0;
let objforZcheck = []; //For player and walls
let margins = [];
//
//AUDIO
const menuOpen = new Audio('./files/sound/menuOpen.wav'); //Yes I should have made the istancese of the audios when they need to be called, but it's cleaner like this
menuOpen.type = "audio/mpeg";
const menuClose = new Audio('./files/sound/menuClose.wav');
menuClose.type = "audio/mpeg";
//Walk in code
const select = new Audio('./files/sound/select.wav');
select.type = "audio/mpeg";
//MenuMove in code
//
//

//
//
//PLAYER
let A = 0; //for audio
let B = 171;
let time = 0; 
let forAudio = false
function controls(plr, eve, spd) { //higly recomend to keep speed at 10
    //console.time();
    if(!spd){spd = 10;} //defaults
    spd = (Math.floor(spd/10))*10; //if(Math.abs(spd) < 5 && spd !== 0){spd = (5*spd)/Math.abs(spd);}else{spd = 10;}
    
    let key = eve.code;
   
    //
    //AUDIO
    let walk = new Audio('./files/sound/walk.wav'); walk.type = "audio/mpeg";
    //console.log("ALPHA: "+ A + " @ " + B + " @ " + Math.abs((B - A)));
    switch (forAudio) {
        case false:
            A = eve.timeStamp;
            forAudio = true;
            break;
        
        case true:
            B = eve.timeStamp;
            forAudio = false;
            break;
    }
    //console.log("BETA: "+ A + " @ " + B + " @ " + Math.abs((B - A)));
    
    zCheck();
    
    function MV(spd, xy) { //Makes for less repitition, slower & only works for player
        pos[xy] += spd; //xy means wehter the movement in x or y, 0 for x, 1 for y
        for (let i = 0; i < objsPos.length; i++) { //The colision check
            if (pos.toString() === objsPos[i].toString()) {
                pos[xy] -= spd;
            }
        }

        //
        //AUDIO
        if (Math.abs((B - A)) >= 170) {
            walk.play();
            time = 0;
        } else {
            time++;
            if (time >= 10) {
                walk.play();
                time = 0;
            }
        }
        //console.log('PRESSED FOR: ' + t);
    }
    
    //key input (yes all of it)
    switch (key) {
        case 'KeyD':
            MV(spd, 0);
            applypos(pos, plr);
            break;
        case 'KeyA':
            MV(spd*-1, 0);
            applypos(pos, plr);
            break;
        case 'KeyS':
            MV(spd, 1);
            applypos(pos, plr);
            break;
        case 'KeyW':
            MV(spd*-1, 1);
            applypos(pos, plr);
            break;
    
    //OTHER CONTROLS
        case 'KeyQ': //interact NPC
            for (let i = 0; i < npc.length; i++) { //yes it checks all NPCs, it's fast enough though
                let checkforPos = [];
                for (let o = 0; o < npc[i].length - 2; o++) {
                    checkforPos.push(npc[i][o])
                }
                if (pos.toString() === checkforPos.toString()) {
                    npcDialog(npc[i][2]); //InternalID is not given as it can be used globaly, and it needs to be used globaly for KeyP to work
                    dialogStage++;
                    checkQuest(npc[i][2]);
                }
            }
            break;
    //MENU
        case 'KeyP': //open menu (items, quests, stats) & close txtbox if open | ONLY SECOND WORKS
            if (appBool == true) {
                glbtxt.remove();
                appBool = false; //Varible from dialog.js
                menuBool = false;

                dialogStage = 1;
                InternalId = 0; //Variable from npc.js
                menuClose.play(); //Play audio (see above for file)
            } else {
                menuBool = true;
                menu(menuOptionsDefault, menuTextDefault);
                menuOpen.play(); //Play audio (see above for file)
            }
            break;
        case 'BracketLeft':
            let menuMoveA = new Audio('./files/sound/menuMove.wav'); menuMoveA.type = "audio/mpeg";
            if (menuBool == true) {
                selectMenu(-1, menuOptionsDefault);
                menuMoveA.play();
            }
            break;
        case 'BracketRight':
            let menuMoveB = new Audio('./files/sound/menuMove.wav'); menuMoveB.type = "audio/mpeg";
            if (menuBool == true) {
                selectMenu(1, menuOptionsDefault);
                menuMoveB.play();
            }
            break;
        case 'KeyO':
            if (menuBool == true) {
                clickMenu(dialogOption);
                select.play();
            }
            break;
    }

    //margins
    for (let i = 0; i < pos.length; i++) {
        const check = pos[i];
        
        if(check < margins[0]){
            pos[i] = margins[0];
            applypos(pos, plr);
        }
        if (check > margins[1]) {
            pos[i] = margins[1];
            applypos(pos, plr);
        }
    }

    //console.timeEnd();
}
function applypos(newPos, obj) { //Yes, in setObj we go through an entire little adventure so we can turn the strings we get int ints JUST to turn the ints into strings again here, why? Because it makes player movement easier, and the code easier to read (otherwise there would need to be two applypos functions and I don't feel like doing that)
    obj.style.left = newPos[0].toString() + 'px';
    obj.style.top = newPos[1].toString() + 'px';
}
function zCheck() { //does NOT work for NPCs (aka npc phase through walls)
    for (let i = 0; i < objforZcheck.length; i++) {
        if (pos[1] > objforZcheck[i][1]) { //If the player is at the same height or below the object
            objforZcheck[i][0].style.zIndex = "-1";
        } else {
            objforZcheck[i][0].style.zIndex = "1";
        }
    }
}

//
//
//OBJECTS
function setObj(obj, mrg) {
    if(!mrg){mrg = [0, 500]} margins = mrg;
    for (let i = 0; i < obj.length; i++) {
        const cObj = obj[i];
        
        let Opos = cObj.innerHTML.split('#'); //In order [innerHTML, X cordinate, Y cordinate, NPC ID (if any)]
        
        if(Opos.length >= 3){ //Debug (check else statement)
        
        if (Opos[0].length > 1 && cObj.className.includes('object') && !cObj.className.includes('npc') && !cObj.className.includes('path')) { //This is needed for objects with horizontal lenght (eg. walls)
            for (let i = 1; i < Opos[0].length; i++) {
                let intOposWall = [parseInt(Opos[1])+10*i, parseInt(Opos[2])];
                objsPos.push(intOposWall);
            }
        }

        if (cObj.className.includes('object') && !cObj.className.includes('npc') && !cObj.className.includes('path')) { //I originally didn't want to make an array of pure HTML elemnets for the objects but this is needed for polish (damn you Poland)
            objforZcheck.push([obj[i], parseInt(Opos[2])]);
        }

        cObj.innerHTML = Opos[0]; //Remove the cordinates
        Opos.splice(0, 1);

        let intOpos = [] //by default Opos is an array of strings
        for (let i = 0; i < Opos.length; i++) { //Needed for NPCs which have 3 # numbers (also makes the code flexible)
           intOpos.push(parseInt(Opos[i]));
        }
        
        //ARRAYS
        if (cObj.className.includes('npc')) { //Adds to the npc list or object list, does nothing for paths (Yes, the class must be 'object npc' in that order)
            //no more than the NPC class, might need work
            intOpos.push(cObj);
            npc.push(intOpos);
        }
        else if(cObj.className.includes('path')) {/*does nothing*/}
        else {objsPos.push(intOpos);}
        
        applypos(intOpos, cObj); //The whole reason we did all that is so objects can be on a grid, otherwise it would be near imposible to do anything
        } else {let lol = 'ERROR MISSING ARGUMENTS check Object positions in the .html file. Error caused by: ' + Opos[0]; console.log(lol); cObj.innerHTML = lol;} //Debug for missing arguments
    }

    if (document.getElementById('loading')) {
        document.getElementById('loading').remove();
    }
}








//
//
//The grid(tm) is an imaginary set of cordinates where all objects, NPCs and the player operate in.
//Each "cell" in the grid is a 10x10 box of pixels, and it can also be considered as a step.
//When definining something that isn't a player (which by default starts at [0,0]) after the innerHTML of the object you must add it's cordinates
//This can be done like this (O#80#120)
//The above object will look like "O" and be at the position [80,120]
//Longer objects, like walls, will look like this (WALL#80#120)
//The wall will start at the position [80,120] and end in the position [80, 120 + Number of characters minus the first * 10] (in this case [80, 150])
//Horizontal walls must be done manually (for now)
//NPCs need an extra #, which is their id (eg. §#200#10#89, this will make an NPC at the position [200,10] and with id 89)
//

//
//
//DEBUG
//
//

let state = false
function debugFrame() {
    let debug = document.getElementsByClassName('object debug');
    
    /*let p = 0;
    let ran = 0;
    let a = 0;
    let b = 0;
    let c = 0;
    while(p !== 10000){
        ran = Math.floor((Math.random()*2)+1);
        if (ran == 1) {
            a++
        } else if (ran == 2) {
            b++
        } else {
            c++
        }
        p++
    }
    console.log(a + ' @ ' + b + ' @ ' + c + ' with a dif of: ' + (Math.abs(a-b)));*/
    

    setTimeout(() => {
        for (let i = 0; i < debug.length; i++) {
            const db = debug[i];
            
            if (state == true) {
                db.style.color = '#00FF00';
                db.style.background = '#FF00FF';
            } else {
                db.style.color = '#FF00FF';
                db.style.background = '#00FF00';
            }
        }
        if (state == true) {
            state = false;
        } else {
            state = true;
        }
        
        debugFrame();
    }, 1000);

}