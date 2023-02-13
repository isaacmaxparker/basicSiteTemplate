/*property

*/


const Voice = (function () {
    "use strict";

    /*------------------------------------------------------------------------
     *              CONSTANTS
     */
    const QUESTIONS_URL_PREFIX = 'https://raw.githubusercontent.com/isaacmcdgl/JSON/main/Games/Voice/'
    const AUDIO_URL_PREFIX = 'https://raw.githubusercontent.com/isaacmcdgl/JSON/main/Games/Voice/audios/'

    const AUDIO_DIV_CONTAINER_ID = "audiosContainer"
    const EPISODE_CONTAINER_ID = "episodeContainer"

    const NEXT_EPISODE_BUTTON = "nextEpisodeButton"

    const DEMO = {
        "title": "Demo (Penis Song)",
        "artist": "Macklemore",
        "key": "penis_song",
        "file": "penis_song.mp3",
        "lyrics": [
            "This is my penis son",
            "I wish that I had a bigger shlong",
            "One that was quite a bit more",
            "_____ ___ ___ ____ ____"
        ]
    }

    const EPISODE_TITLES = ["Episode One - Blind Auditions", "Episode Two - Showdown", "Episode Three - Semifinals", "Episode Four - Finals"]

    /*------------------------------------------------------------------------
     *              PRIVATE VARIABLES
     */
    let currentEpisode = 1;
    let game;
    let questions = [];
    let players_that_passed = [];
    let players = [
        {
            "name": "red",
            "active": true
        },
        {
            "name": "orange",
            "active": true
        },
        {
            "name": "yellow",
            "active": true
        },
        {
            "name": "green",
            "active": true
        },
        {
            "name": "blue",
            "active": true
        },
        {
            "name": "pink",
            "active": true
        },
    ]

    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    let checkNextEpisode;
    let getEpisodeHtml;
    let loadEpisodeCard;
    let loadQuestions;
    let loadSongs;
    let init;
    let setupKeyPress;
    let showWinner;
    let nextEpisode;


    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    checkNextEpisode = () =>{
        if(currentEpisode == 4){
            let winningplayer = document.getElementById("episode-" + currentEpisode).children[0].children[2].children[0].children[0].getAttribute('data-name');
            showWinner(winningplayer)
        }else{
            let destinationBoxes = document.getElementById("episode-" + currentEpisode).children[0].children[2].children;
            console.log(destinationBoxes)
            let show = true;
    
            players_that_passed = [];
    
            players.forEach(element => {
                element.active = false
            });
    
            for(let i = 0; i < destinationBoxes.length; i++){
                console.log(destinationBoxes[i].children)
                console.log(destinationBoxes[i].children.length)
                if(destinationBoxes[i].children.length < 1){
                    show = false;
                }else{
                    players_that_passed.push(destinationBoxes[i].children[0].getAttribute('data-name'))
                }
            }
    
            if(show){
                document.getElementById(NEXT_EPISODE_BUTTON).classList.remove('hidden')
            }
        }
        
    }

    getEpisodeHtml = (episode) => {
        switch (episode) {
            case 1:
                return `<div class="episode" id="episode-${episode}">
                            <div class="episode_container">
                            <img class="episode_header" src="../images/characters/clapper.png">

                            <div class="episode_title">${EPISODE_TITLES[episode - 1]}</div>
                            <div class="episode_advancements flex-row">
                            <div class="destination_box" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
                            <div class="destination_box" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
                            <div class="destination_box" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
                            <div class="destination_box" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
                            <div class="destination_box" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
                            </div>`
            case 2:
                return `<div class="episode" id="episode-${episode}">
                <div class="episode_container">
                <img class="episode_header" src="../images/characters/clapper.png">
                            <div class="episode_title">${EPISODE_TITLES[episode - 1]}</div>
                            <div class="episode_advancements flex-row">
                            <div class="destination_box" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
                            <div class="destination_box" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
                            <div class="destination_box" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
                            <div class="destination_box" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
                            </div>`
            case 3:
                return `<div class="episode" id="episode-${episode}">
                <div class="episode_container">
                <img class="episode_header" src="../images/characters/clapper.png">
                            <div class="episode_title">${EPISODE_TITLES[episode - 1]}</div>
                            <div class="episode_advancements flex-row">
                            <div class="destination_box" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
                            <div class="destination_box" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
                            </div>`
            case 4:
                return `<div class="episode" id="episode-${episode}">
                <div class="episode_container">
                <img class="episode_header" src="../images/characters/clapper.png">
                            <div class="episode_title">${EPISODE_TITLES[episode - 1]}</div>
                            <div class="episode_advancements flex-row">
                            <div class="destination_box" ondrop="drop(event)" ondragover="allowDrop(event)"></div>e
                            </div>`
        }
    }

    loadEpisodeCard = () => {

        players.forEach(element => {
            if(players_that_passed.includes(element.name)){
                element.active = true
            }
        });

        let episode_card_html = getEpisodeHtml(currentEpisode)
        episode_card_html += `<div class="episode_members flex-row">`
        players.forEach(player => {
            episode_card_html += `<div class="origin_box" ondrop="drop(event)" ondragover="allowDrop(event)">
                                    <img id="${player.name}-ep-${currentEpisode}" data-name="${player.name}" class="player_icon ${player.active ? "" : "inactive_icon"}" src="../images/characters/${player.name}_icon.png" draggable="true" ondragstart="drag(event)">
                                  </div>`
        });

        episode_card_html += `</div>
        </div>
                                </div>
                            </div>`

        document.getElementById(EPISODE_CONTAINER_ID).innerHTML += episode_card_html
    }

    loadQuestions = () => {
        let url = QUESTIONS_URL_PREFIX + game.json_name + ".json"
        Global.ajax(url, function (data) {
            console.log("QUESTION DATA: ")
            questions = data
            questions.unshift(DEMO)
            console.log(questions);
            loadSongs(data)
        })
    }

    loadSongs = (data) => {
        let html =
            `<audio id="rightAudio" controls>
            <source src="../audios/correct.wav" type="audio/mpeg">
        </audio>
        <audio id="wrongAudio" controls>
            <source src="../audios/buzzer.wav" type="audio/mpeg">
        </audio>`;
        data.forEach(element => {
            html += `<audio id="${element.key}_audio" controls>
                        <source src="${AUDIO_URL_PREFIX}${element.file}" type="audio/mpeg">
                     </audio>`
        });
        document.getElementById(AUDIO_DIV_CONTAINER_ID).innerHTML = html
    }

    init = function () {
        console.log("Started Voice init...");
        window.scrollTo(0, 0)

        game = JSON.parse(localStorage.getItem("currentGame"))
        if (game == undefined || game.json_name == undefined) {
            game.json_name = '2010popparty';
        }
        loadQuestions();
        loadEpisodeCard();
    };

    setupKeyPress = () => {
        window.onkeypress = function (event) {
            console.log(event.keyCode)
            if (current_teams.includes(event.keyCode)) {
                addPoints(current_teams.indexOf(event.keyCode) + 1);
                return
            }
            else {
                switch (event.keyCode) {
                    case 13:
                        playSound("right")
                        break;
                    case 47:
                        playSound("wrong")
                        break;
                }
            }
        }
    }

    showWinner = (winner)=>{
        alert(winner + " WON!")
    }

    nextEpisode = () =>{
        currentEpisode += 1;
        loadEpisodeCard()
        if(currentEpisode == 4){
            document.getElementById(NEXT_EPISODE_BUTTON).remove()
        }else{
            document.getElementById(NEXT_EPISODE_BUTTON).classList.add('hidden')
        }
    }

    return {
        init,
        nextEpisode,
        checkNextEpisode,
    };
}());
