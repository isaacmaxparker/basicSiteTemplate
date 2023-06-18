/*property

*/


const Cards = (function () {
    "use strict";

    /*------------------------------------------------------------------------
     *              CONSTANTS
     */

    const FLIP_DURATION = 200;
    const QUESTIONS_URL_PREFIX = 'https://raw.githubusercontent.com/isaacmaxparker/JSON/main/Games/Cards/'
    const CHARACTERS = ["athleta", "angela", "autumn", "brenda", "charlotte", "circe", "ginger", "harley", "libby", "olive", "paige", "pixie", "raven", "reighlynn", "sakura", "serena", "spectra", "stella", "sunny"]

    const EASY_POINTS = 100
    const MED_POINTS = 350 
    const HARD_POINTS = 750

    /*------------------------------------------------------------------------
     *              PRIVATE VARIABLES
     */

    let row_count;
    let game;
    let easy_cards;
    let mid_cards;
    let hard_cards;
    let players = [];
    let players_ranked = [];
    let outstanding_points;
    let num_of_players;
    let sorted_characters;
    let player_groups = [];
    let current_group;


    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    let init
    let displayCards;
    let chooseCard;
    let decodePlayerColor;
    let loadPlayerScores;
    let loadPlayerSelectionScreen;
    let loadCards;
    let loadPlayers;
    let savePlayerNames;
    let shuffleCharacters;
    let hidePlayerSelection;
    let correctAnswer;


    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    correctAnswer = () => {
        Global.playSound("right")
        console.log(current_group)
        current_group.forEach(element => {
            let input = document.getElementById('points_for_' + element.character)
            console.log("PTS" + outstanding_points)
            let value =  parseInt(input.value) + outstanding_points
            players.forEach(elemdnt => {
                if(elemdnt.character == element.character){
                    elemdnt.points = value
                }
            });
        });
        outstanding_points = 0;
        document.getElementById("flippedCard").classList.add("card_gone")

        players_ranked = players.sort((a,b)=> (a.points < b.points ? 1 : -1))
        loadPlayerScores(players_ranked)
    }

    chooseCard = (card, stack, index) => {
        
        card.classList.add("flown_out_card")
        let phrase;
        switch(stack){
            case "easy":
                outstanding_points = EASY_POINTS;
                phrase = easy_cards[index]
                break;
            case "med":
                outstanding_points = MED_POINTS;
                phrase= mid_cards[index]
                break;
            case "hard":
                outstanding_points = HARD_POINTS;
                phrase = hard_cards[index]
                break;
        }

        console.log("points: " + outstanding_points)
        document.getElementById("flipped_card_phrase").innerHTML = phrase
        setTimeout(function(){Global.playSound("flip");document.getElementById('flippedCard').classList.remove("card_gone")},2000)
    }

    displayCards = () =>{
        let html = ""
        let i = 0;
        easy_cards.forEach(element => {
            html+=`<img style="margin-top:${i*1.2}px !important;margin-left:${i*1.2}px !important" src="../images/card_backs/green_card.png" onclick="chooseCard(this,'easy',${0})">`
            i++
        });
        document.getElementById("easy_card_stack").innerHTML = html
        html = ""
        i = 0;
        mid_cards.forEach(element => {
            html+=`<img style="margin-top:${i*1.2}px !important;margin-left:${i*1.2}px !important" src="../images/card_backs/yellow_card.png" onclick="chooseCard(this,'med',${0})">`
            i++
        });
        document.getElementById("medium_card_stack").innerHTML = html
        html = ""
        i = 0;
        hard_cards.forEach(element => {
            html+=`<img style="margin-top:${i*1.2}px !important;margin-left:${i*1.2}px !important" src="../images/card_backs/red_card.png" onclick="chooseCard(this,'hard',${0})">`
            i++
        });
        document.getElementById("hard_card_stack").innerHTML = html
    }

    decodePlayerColor = (name) => {
        switch (name) {
            case "olive":
                return "#98cb33"
            case "brenda":
                return "#ffcc66"
            case "charlotte":
                return "#990033"
            case "libby":
                return "#9966cc"
            case "raven":
                return "#000000"
            case "circe":
                return "#5d045d"
            case "pixie":
                return "#65caca"
            case "reighlynn":
                return "#663300"
            case "athleta":
                return "#ccff33"
            case "spectra":
                return "#c7c7c7"
            case "stella":
                return "#000033"
            case "sakura":
                return "#ff9999"
            case "sunny":
                return "#ffcc00"
            case "serena":
                return "#003333"
            case "ginger":
                return "#336600"
            case "autumn":
                return "#ff9900"
            case "angela":
                return "#cc0000"
            case "harley":
                return "#ff6699"
            case "paige":
                return "#cc3366"

        }
    }

    hidePlayerSelection = () =>{
        Global.hideElementFade(document.getElementById("playerSelectScreen"))
    }

    init = function (onInitializedCallback) {
        console.log("Started Scatter init...");
        game = JSON.parse(localStorage.getItem("currentGame"))
        shuffleCharacters();
        
    };

    loadCards = () => {
        let url = QUESTIONS_URL_PREFIX + game.json_name + ".json"
        Global.ajax(url, function (data) {
            console.log(data)
            console.log(data.easy_cards)
            easy_cards = Global.shuffleArray(data.easy_cards)
            console.log(data.hard_cards)
            hard_cards = Global.shuffleArray(data.hard_cards)
            console.log(data.mid_cards)
            mid_cards = Global.shuffleArray(data.mid_cards)
            displayCards()
        })
    }

    loadPlayerSelectionScreen = () =>{
        Global.hideElementFade(document.getElementById('playerNameScreen'));   
        if(player_groups.length == 0){
            let p = players;
            let shuffled = Global.shuffleArray(p);
            let players_left = num_of_players;
            if(players_left > 4){
                
                let i = 0;
                while(players_left > 0 && i < 16){
                    let addArray = []
                    for(let j = 0; j < 4; j++){
                        let k = (i * 4) + j
                        if(k < num_of_players){
                            addArray.push(shuffled[k])
                        }else{
                            console.log("SHUF")
                            console.log(Global.shuffleArray(p))
                            console.log(players)
                            addArray.push(Global.shuffleArray(p)[0])
                        }
                    }
                    console.log("ADD ARRAY")
                    console.log(addArray)
                    console.log("PLAYER GROUPS")
                    player_groups.push(addArray)
                    console.log(player_groups)
                    players_left = players_left - 4;
                    console.log("PLAYERS LEFT")
                    i++
                }
                console.log(player_groups)
            }else{
                player_groups.push(players)
            }
        }
        current_group = player_groups[0]
        player_groups.shift()

        document.getElementById("image_one").classList.add("hidden")
        document.getElementById("image_two").classList.add("hidden")
        document.getElementById("image_three").classList.add("hidden")
        document.getElementById("image_four").classList.add("hidden")

        Global.showElementFade(document.getElementById("playerSelectScreen"))
        setTimeout(() => {
            setTimeout(() => {
                document.getElementById("image_one").setAttribute("src",`../images/characters/character_icons/${current_group[0].character}.png`)
                document.getElementById("image_one").classList.remove("hidden")
                setTimeout(() => {
                    document.getElementById("image_two").setAttribute("src",`../images/characters/character_icons/${current_group[1].character}.png`)
                    document.getElementById("image_two").classList.remove("hidden")
                    setTimeout(() => {
                        document.getElementById("image_three").setAttribute("src",`../images/characters/character_icons/${current_group[2].character}.png`)
                        document.getElementById("image_three").classList.remove("hidden")
                        setTimeout(() => {
                            document.getElementById("image_four").setAttribute("src",`../images/characters/character_icons/${current_group[3].character}.png`)
                            document.getElementById("image_four").classList.remove("hidden")
                        },2100) 
                    },2000) 
                },2000) 
            },2000) 
        },500)     
    }

    loadPlayerScores = (array) =>{
        let html = ``;
        array.forEach(element => {
            html += `<div class="playerScore flex-row" style="color: ${decodePlayerColor(element.character)};background-color:${decodePlayerColor(element.character)}40;">
                        <img src="../images/characters/character_icons/${element.character}.png">
                        <div class="flex-column" style="align-items: flex-start;font-size:1.8rem;">
                            <p style="margin:0px">${element.name}</p>
                            <input id="points_for_${element.character}" class="pointsInput" style="font-size:1.5rem;color:${decodePlayerColor(element.character)};margin:0px" value = "${element.points}" class="character_name_input" style="color:${decodePlayerColor(element.character)};border-color:${decodePlayerColor(element.character)}"> 
                        </div>
                    </div>`
        });
        document.getElementById("scoreList").innerHTML = html;
        loadCards();
    }

    loadPlayers = function (playernum, redo = false) {
        num_of_players = playernum;
        Global.hideElementFade(document.getElementById('loadScreen'));
        setTimeout(() => { Global.showElementFade(document.getElementById('playerNameScreen')); }, 250);

        let html = ``;
        row_count = 0;
        let grid_count = 0;


        if (num_of_players <= 5) {
            grid_count = num_of_players;
            row_count = 1
        } else {
            row_count = 2
            switch (num_of_players) {
                case 6:
                    grid_count = 3;
                    break;
                case 7:
                    grid_count = 4;
                    break;
                case 8:
                    grid_count = 4;
                    break;
                case 9:
                    grid_count = 5;
                    break;
                case 10:
                    grid_count = 5;
                    break;
                case 11:
                    row_count = 3;
                    grid_count = 4;
                    break;
                case 12:
                    row_count = 3;
                    grid_count = 4;
                    break;
                case 13:
                    row_count = 3;
                    grid_count = 5;
                    break;
                case 14:
                    row_count = 3;
                    grid_count = 5;
                    break;
                case 15:
                    row_count = 3;
                    grid_count = 5;
                    break;
            }
        }

        let string = ""
        for (let i = 0; i < grid_count; i++) {
            string += "1fr "
        }

        for (let i = 0; i < row_count; i++) {
            html += `<div style="display:flex;flex:1;">`
            for (let j = 0; j < grid_count; j++) {
                let k = (i * grid_count) + j;
                if (k < num_of_players) {
                    html += `<div style="${row_count == 3 ? "max-height: 25vh;" : row_count == 2 ? "max-height: 25vh;" : "max-height: 50vh;"}" class="character_name_tile flex-column" data-player="${sorted_characters[k]}">
                                <img src="../images/characters/character_icons/${sorted_characters[k]}.png">
                                <input placeholder=${sorted_characters[k].capitalize()} class="character_name_input" style="color:${decodePlayerColor(sorted_characters[k])};border-color:${decodePlayerColor(sorted_characters[k])}"> 
                            </div>`
                }
            }
            html += `</div>`;
        }
        document.getElementById("player_tile_container").innerHTML = html;
    }

    savePlayerNames = (saved = false) => {

        for(let h = 0; h < row_count; h++){
            let tiles =  document.getElementById('player_tile_container').children[h].children
            for(let i = 0; i < tiles.length; i++){
                let tile = tiles[i];
                console.log(tile);
                console.log(tile.children[1].value)
                if(tile.children[1].value == ""){
                    return
                }

                players.push(
                    {
                        "character":tile.getAttribute("data-player"),
                        "name":tile.children[1].value,
                        "points":0
                    }
                )
                
                players_ranked.push(
                    {
                        "character":tile.getAttribute("data-player"),
                        "name":tile.children[1].value,
                        "points":0
                    }
                )

                console.log(players[i])
                
            }
        }
        console.log(players)

        loadPlayerScores(players)

        Global.hideElementFade(document.getElementById('playerNameScreen'));
        Global.showElementFade(document.getElementsByClassName('splitContent')[0]);
    }

    shuffleCharacters = () => {
        sorted_characters = Global.shuffleArray(CHARACTERS)
    }

    Object.defineProperty(String.prototype, 'capitalize', {
        value: function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        },
        enumerable: false
    });

    /*------------------------------------------------------------------------
     *              PUBLIC METHODS
     */
    return {
        init,
        loadPlayers,
        savePlayerNames,
        hidePlayerSelection,
        loadPlayerSelectionScreen,
        chooseCard,
        correctAnswer,
    };
}());
