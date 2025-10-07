let dbgnmbr2 = 0; //DEBUG
let npcDialogOpt = [];
let InternalId = 0;
//
//
//DIALOG
function npcDialog(id) { //dialogStage is from basics.js
    let output = 'ERROR';
    let talk = new Audio('./files/sound/talk.wav');
    

    if (appBool == false) { //Checks if an interal ID has be found
        for (let i = 0; i < npcDialogOpt.length; i++) { //Finds internal ID
            if (id == npcDialogOpt[i][0]) {InternalId = i;}
        }
    }
    
    
    if (dialogStage !== npcDialogOpt[InternalId].length) { //This exists for scripts run through dialog
        let cmd = npcDialogOpt[InternalId][dialogStage].split('CMD#');

        if (cmd.length > 1) {cmd.shift(); eval(cmd[0]); output=cmd[1];} else {
        output = cmd[0];} //here all output is set, cmd is our god
    }

    glbtxt.innerHTML = output;
    if(dialogStage != npcDialogOpt[InternalId].length){talk.play();}
    
    if (appBool == true && dialogStage == npcDialogOpt[InternalId].length) {
        dialogStage = 0;
        InternalId = 0;
        appBool = false;

        glbtxt.remove();
    } else if (appBool == false) { //I could just use else here, but else if makes it easier to read
        appBool = true;

        document.body.appendChild(glbtxt);
    }
}

function setDialog() { //Ignore this
    let read = toRead;

    let readArray = read.split('NW ');
    readArray.shift();
    let readArrayFinal = [];

    for (let i = 0; i < readArray.length; i++) {
        readArrayFinal.push(readArray[i].split(' # '));
    }
    for (let i = 0; i < readArrayFinal.length; i++) {
        readArrayFinal[i][0] = parseInt(readArrayFinal[i][0]);
        npcDialogOpt.push(readArrayFinal[i])
    }
}


//
//
//MOVEMENT
/*function randomMove(npcMargins, idGiven) { //BROKEN AS SHIT

    
    //The air is quite, the birds are out, the clouds are hugging the earth. It's so nice today, I think I'll go for a walk.

    // let A2 = performance.now(); //ignore this DEBUG

    if(!idGiven && idGiven !== 0){return null;}
    
    let time = 0;
    let InteralIDMovement = [];
    for (let o = 0; o < idGiven.length; o++) {
        for (let i = 0; i < npcID.length; i++) {
            if (npcID[i] == idGiven[o]) {InteralIDMovement.push(i)}
        }
    }

    function MVnpc(spd, xy, id) {
        npc[id][xy] += spd;
        for (let i = 0; i < objsPos.length; i++) {
            if (npc[id].toString() === objsPos[i].toString()) {
                npc[id][xy] -= spd;
            }
        }
    }

    //while (time < 999) { why did I ever use a while statement what????
    let rand = Math.abs((Math.floor(Math.random()*10)));
    time += rand + 1;

    setTimeout(() => { //omg this sucks
    let rand2 = 2;
    for (let i = 0; i < InteralIDMovement.length; i++) {
        const id = InteralIDMovement[i];
        rand2 = (Math.floor(Math.random()*10));

        if (npc[id].toString() !== pos.toString()) { //if the player isn't topping you
            if (rand2 > 2) {
                if (rand < 2) {
                    MVnpc(spd, 0, id);
                } else {
                    MVnpc(spd*-1, 0, id)
                }
            } else {
                if (rand < 2) {
                    MVnpc(spd, 1, id);
                } else {
                    MVnpc(spd*-1, 1, id);
                }
            }
    
            for (let i = 0; i < npc[id].length; i++) {
                const check = npc[id][i];
                
                if(check < npcMargins[0]){
                    npc[id][i] += spd;
                }
                if (check > npcMargins[1]) {
                    npc[id][i] -= spd;
                }
            }
            applypos(npc[id], npcElement[id]);
        }}
        randomMove(npcMargins, idGiven); //Propably can be optimized
    }, time * 500);

    // let B2 = performance.now();
    // dbgnmbr2 = (B2 - A2);
    // console.log(dbgnmbr2 + ' ms @ ' + InteralIDMovement.length + ' MOVING NPCs');
}*/

let InternalIDMV = [];
let npcBox = []; //1-1 with InternalIDMV, the box where an npc is allowed to move
function randomMove(Margins, idGiven, plus) { //to be called by the html file
    for (let i = 0; i < idGiven.length; i++) {
        for (let o = 0; o < npc.length; o++) {
            if (idGiven[i] == npc[o][2]) {
                InternalIDMV.push(o);
                let temp = [npc[o][0]+Margins[0], npc[o][1]+Margins[1], npc[o][0]-Margins[0], npc[o][1]-Margins[1]];
                npcBox.push(temp)
            }
        }
    }
    ranMovement();
}
function ranMovement() {
    let time = Math.floor((Math.random()*10)+1);

    setTimeout(() => { //clock
        for (let i = 0; i < InternalIDMV.length; i++) { 
            const cIID = InternalIDMV[i]; //for the npc array
            
            let npcPos = [npc[cIID][0], npc[cIID][1]]; 
            if (npcPos.toString() !== pos.toString()) { //player
                let ran = Math.floor((Math.random()*4)+1);
                
                // Make newPos array for checking, check for walls and margins (that start at the NPC first position)
                switch (ran) {
                    case 1:
                        npcPos[0] += 10;
                        break;
                    
                    case 2:
                        npcPos[0] -= 10;
                        break;
                    case 3:
                        npcPos[1] += 10;
                        break;
                    case 4:
                        npcPos[1] -= 10;
                        break;
                }
                let doMV = true;
                for (let i = 0; i < objsPos.length; i++) { //Objects
                    if (npcPos.toString() == objsPos[i].toString()) {
                        doMV = false;
                    }
                } //could use the includes function somehow but naahhhh 
                for (let i = 0; i < npcPos.length; i++) { //Margins
                    const check = npcPos[i];
        
                    if(check < margins[0] || check > margins[1]){
                        doMV = false;
                    }
                }
                if (!(npcPos[0] <= npcBox[i][0] && npcPos[0] >= npcBox[i][2]) || !(npcPos[1] <= npcBox[i][1] && npcPos[1] >= npcBox[i][3])) {
                    doMV = false;
                    // really verbose//non-flexible but it works
                       
                }
                
                if (doMV == true) {
                    npc[cIID][0] = npcPos[0]; npc[cIID][1] = npcPos[1]; 
                    applypos(npcPos, npc[cIID][3])
                }
            }
        }

        ranMovement();
    }, time*500);
}