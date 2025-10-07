let quest = [
    [1, 45, 0, 'The Grand Debug Quest'] //in order [Quest setter NPC id, Quest subject NPC id, Uset(0)/Set(1)/Complete(2), 'Quest Name']
];
//
//
//Create a new menuOptions here will all the quests and stuff, basically every minimenu has to be it's own menu. It's past 12, I'm tired...

function checkQuest(id) {
    let ds = 1.2;
    if (ds !== 1) { return null;} 
    else {
        for (let i = 0; i < quest.length; i++) {
            if (id == quest[i][0]) {
                quest[i][2] =  1;
                menuScreens[1] = 
                "<ul>" +
                "<li>Nope o Clock</li>" +
                "<li>" + quest[i][3] + "</li>" +
                "</ul>";
            }
        }
    }

    for (let i = 0; i < quest.length; i++) {
        if (quest[i][2] >= 0){/*console.log(quest[i]);*/}
    }
}