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
    const AUDIENCE_COVER_ID = "audienceButton"
    const AUDIENCE_POLL_CONTAINER = "audiencePoll"

    const CONTESTANTS_PLATFORM_ID = "contestants"

    const NEXT_EPISODE_BUTTON = "nextEpisodeButton"

    const VOTE_CAP = 3000

    const FNAME_ARRAY = ["Taylor", "Addison", "Aspen","Ash","Charlie","Drew","Casey","Hayden","Jessie","Jordan","Morgan","Sam", "Robyn","Sasha","Toni","Max","Marley","Jaydon","Briar","Bellamy","Brighton","Cove","Cypress","Jupiter","Hollis","Rory","Lux","Emery"]
    const MNAME_ARRAY = ["La Coochie", "Limp Biscuit","Glizzy Gobbler", "Cluck Flucker","La Queefy Greens","MILF Milker","Titty Twister", "Abalababala","Cum Biscuit","Turd Burgling","Creamed Corn", "Ducked Tape"]
    const LNAME_ARRAY = ["Watkins","Johnson","Sorenson","Young","Smith","Anderson","Cummingham","Andrews","Marley","Adamson","Radwell","Jeffries","St. Claire", "III", "Peterson", "Jackson", "Willingham", "Boroughsby"]

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
    let highestVote = 0;
    let questions = [];
    let players_that_passed = [];
    let eligible_players = [];
    let players = [
        {
            "name": "red",
            "active": true,
            "votes": 0,
        },
        {
            "name": "orange",
            "active": true,
            "votes": 0,
        },
        {
            "name": "yellow",
            "active": true,
            "votes": 0,
        },
        {
            "name": "green",
            "active": true,
            "votes": 0,
        },
        {
            "name": "blue",
            "active": true,
            "votes": 0,
        },
        {
            "name": "pink",
            "active": true,
            "votes": 0,
        },
    ]

    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    let askTheAudience;
    let checkNextEpisode;
    let getPlayerPadding;
    let getPlayerColor;
    let getRandomPlayerName;
    let getPlayerVotes;
    let getEpisodeHtml;
    let loadEpisodeCard;
    let loadQuestions;
    let loadSongs;
    let loadScreen;
    let hidePolls;
    let init;
    let toggleContestant;
    let setupKeyPress;
    let showPolls;
    let showVotes;
    let incrementVotes;
    let showWinner;
    let nextEpisode;


    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */


    askTheAudience = () => {
        eligible_players = []
        let sourceBoxes = document.getElementById("episode-" + currentEpisode).children[0].children[3].children;
        console.log(sourceBoxes)
        for (let i = 0; i < sourceBoxes.length; i++) {
            if (sourceBoxes[i].children.length >= 1 && !(sourceBoxes[i].children[0].classList.contains('inactive_icon'))) {
                eligible_players.push(sourceBoxes[i].children[0].getAttribute('data-name'))

            }
        }

        highestVote = 0;

        players.forEach(element => {
            if (eligible_players.includes(element.name)) {
                element.votes = Math.floor((Math.random() * 5) * Math.floor(Math.random() * VOTE_CAP));
                if(element.votes > VOTE_CAP){
                    element.votes = Math.floor((Math.random() * 3) * Math.floor(Math.random() * (VOTE_CAP * .75)));
                    if(element.votes > (VOTE_CAP * .75)){
                        element.votes = Math.floor((Math.random() * 1) * Math.floor(Math.random() * (VOTE_CAP * .5)));
                    }
                }

                if(element.votes < 200){
                    element.votes = element.votes + 1234
                }

                if(element.votes > highestVote){
                    highestVote = element.votes
                }

            } else {
                element.votes = 0;
            }
        });

        showPolls()

        console.log(players)
        console.log(eligible_players)
    }

    checkNextEpisode = () => {
        if (currentEpisode == 4) {
            let winningplayer = document.getElementById("episode-" + currentEpisode).children[0].children[2].children[0].children[0].getAttribute('data-name');
            players.forEach(element => {
                if(element.name == winningplayer){
                    showWinner(element.stage_name)
                }
            });
            
        } else {
            let destinationBoxes = document.getElementById("episode-" + currentEpisode).children[0].children[2].children;
            console.log(destinationBoxes)
            let show = true;

            players_that_passed = [];

            players.forEach(element => {
                element.active = false
            });

            for (let i = 0; i < destinationBoxes.length; i++) {
                console.log(destinationBoxes[i].children)
                console.log(destinationBoxes[i].children.length)
                if (destinationBoxes[i].children.length < 1) {
                    show = false;
                } else {
                    players_that_passed.push(destinationBoxes[i].children[0].getAttribute('data-name'))
                }
            }

            if (show) {
                document.getElementById(NEXT_EPISODE_BUTTON).classList.remove('hidden')
            }
        }

    }

    getRandomPlayerName = () =>{
        let firstName =  FNAME_ARRAY[Math.floor(Math.random()*FNAME_ARRAY.length)];
        let lastName = LNAME_ARRAY[Math.floor(Math.random()*LNAME_ARRAY.length)];
        let middleName= MNAME_ARRAY[Math.floor(Math.random()*MNAME_ARRAY.length)];
        return `${firstName} "${middleName}" ${lastName}`
    }


    getPlayerPadding = (name) =>{
        if(name == "red"|| name == "pink"){
            return "margin-top: 7vh;"
        }
        else if (name == "orange" || name == "blue"){
            return "margin-top: -8vh;"
        }
        else if(name == "green"){
            return "margin-top: -1vh;"
        }
        else {
            return "margin-top: 3vh;"
        }
    }

    getPlayerVotes = (name) =>{
        switch (name) {
            case 'red':
                return players[0].votes
            case 'orange':
                return players[1].votes
            case 'yellow':
                return players[2].votes
            case 'green':
                return players[3].votes
            case 'blue':
                return players[4].votes
            case 'pink':
                return players[5].votes
        }
    }

    getPlayerColor = (name) => {
        switch (name) {
            case 'red':
                return "#ff1100"
            case 'orange':
                return "#ff9d00"
            case 'yellow':
                return "#ebe834"
            case 'green':
                return "#40eb34"
            case 'blue':
                return "#34deeb"
            case 'pink':
                return "#eb34ab"
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
            if (players_that_passed.includes(element.name)) {
                element.active = true
            }
            if(currentEpisode > 1){
                element.active = !element.active
                toggleContestant(element.name)
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

    loadScreen = () => {
        let html = "";

        players.forEach(player => {
            html += `
                <div class="contestant" id="contestant=${player.name}" data-name="${player.name}" onclick="toggleContestant('${player.name}')">
                    <img src="../images/characters/${player.name}_glow.png" style="${getPlayerPadding(player.name)}">
                    <div class="contestant_name" style="color:${getPlayerColor(player.name)};text-shadow:${getPlayerColor(player.name)} 1px 0 10px;">${player.stage_name}</div>
                </div>
`
        });

        document.getElementById(CONTESTANTS_PLATFORM_ID).innerHTML = html;
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

        players.forEach(element => {
            element.stage_name = getRandomPlayerName()
        });

        loadQuestions();
        loadEpisodeCard();
        setupKeyPress();
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

    toggleContestant = (name) => {
        let off = true;

        let bar = document.getElementById(`contestant=${name}`)

        players.forEach(element => {
            if(element.name == name){
                if(element.active){
                    off = true
                }else{
                    off = false
                }
                element.active = !off
            }
        });
        if(off){
            bar.style="filter:saturate(0) brightness(.6)"
        }else{
            bar.style="";
        }
       
    }

    incrementVotes = (bar, text, i, cap) => {
        if(i>cap){
            i = cap
        }
        bar.style.height = Math.floor((i/highestVote) * 100) + "%"
        text.innerHTML = `${i}`
        if(i < cap){
            if(i > 250){
                setTimeout(function(){incrementVotes(bar,text,i+5,cap)},.1)
            }else if(i>500){
                setTimeout(function(){incrementVotes(bar,text,i+10,cap)},.001)
            }
            else if(i>1000){
                setTimeout(function(){incrementVotes(bar,text,i+15,cap)},.001)
            }
            else{
                setTimeout(function(){incrementVotes(bar,text,i+1,cap)},.1)
            }
        }
    }

    showVotes = (element) => {
        console.log(element)
        let bar = element.children[0].children[0];
        let text = element.children[2];
        bar.style.height = "0%"
        text.innerHTML = 0

        let votes = 10;
        if(element.getAttribute('data-votes')){
            votes = element.getAttribute('data-votes')
        }

        incrementVotes(bar,text,0,votes)
    }

    hidePolls = () =>{
        document.getElementById(AUDIENCE_COVER_ID).classList.remove('hidden')
        document.getElementById(AUDIENCE_POLL_CONTAINER).innerHTML ="";
    }

    showPolls = () => {
        let html = '';
        eligible_players.forEach(name => {
            html += `<div id="${name}PollDiv" class="playerPollDiv" data-votes="${getPlayerVotes(name)}">
                        <div class="vote_bar_container">
                            <div class="vote_bar" style="background-color: ${getPlayerColor(name)};"></div>
                        </div>
                        <div class="vote_icon">
                            <img src="../images/characters/${name}_icon.png" onclick="showVotes(this.parentElement.parentElement)">
                        </div>
                        <div class="vote_count" style="color:${getPlayerColor(name)};">-</div>
                    </div>`
        });
        document.getElementById(AUDIENCE_POLL_CONTAINER).innerHTML = html;
        document.getElementById(AUDIENCE_COVER_ID).classList.add('hidden')

    }

    showWinner = (winner) => {
        alert(winner + " WON!")
    }

    nextEpisode = () => {
        currentEpisode += 1;
        hidePolls()
        loadEpisodeCard()
        if (currentEpisode == 4) {
            document.getElementById(NEXT_EPISODE_BUTTON).remove()
        } else {
            document.getElementById(NEXT_EPISODE_BUTTON).classList.add('hidden')
        }
    }

    return {
        init,
        nextEpisode,
        askTheAudience,
        showVotes,
        hidePolls,
        checkNextEpisode,
        loadScreen,
        toggleContestant,
    };
}());
