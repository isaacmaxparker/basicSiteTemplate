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

    const TV_CONTENT_ID = "tvContent"
    const TV_SCREEN_ID = "karaoke_machine"

    const FNAME_ARRAY = ["Taylor", "Addison", "Aspen", "Ash", "Charlie", "Drew", "Casey", "Hayden", "Jessie", "Jordan", "Morgan", "Sam", "Robyn", "Sasha", "Toni", "Max", "Marley", "Jaydon", "Briar", "Bellamy", "Brighton", "Cove", "Cypress", "Jupiter", "Hollis", "Rory", "Lux", "Emery"]
    const MNAME_ARRAY = ["La Coochie", "Limp Biscuit", "Glizzy Gobbler", "Cluck Flucker", "La Queefy Greens", "Mommy Milkers", "Titty Twister", "Abalababala", "Cum Gurgling", "Turd Burgling", "Creamed Corn", "Ducked Tape"]
    const LNAME_ARRAY = ["Watkins", "Johnson", "Sorenson", "Young", "Smith", "Anderson", "Cummingham", "Andrews", "Marley", "Adamson", "Radwell", "Jeffries", "St. Claire", "III", "Peterson", "Jackson", "Willingham", "Boroughsby"]

    const PLACES = ["1st", "Runner Up", "3rd Place", "4th Place", "5th Place", "6th Place"]

    const STORIES = [
        "Briefly had an affair with the married technical producer of the show to try and score a chance to get back on the show. Contracted Chlamydia",
        "Left show business right after getting eliminated. Accidentally broke a pickle jar trying to get it unscrewed. Sliced wrist open on glass and died",
        "Capitalized on their 15 minutes of fame and started twitter fueds with every famous celebrity. Gets killed on stage while hosting the oscars. No one cares.",
        "Settles down and has a family and a boring ass straight person life.",
        "Does some weird drugs and accidentally paints a masterpiece. Sells it for $15 million and spends the money on a gold yacht. Sinks after hitting an iceberg.",
        "Signs to a minor label and releases one mildly successful album. Joins Snoop Dogg and Martha Stewart in a threesome. Gets high off Snoop's cum",
        "Signs a deal as a voice actor for anime. Becomes a total weeb and decorates house with anime uwu girls. Owns an anime sex doll. Gets fat",
        "Sleeps with the winner of the contest and films the whole thing. Blackmails them using the tape into recieving 50% of their earnings",
        "Learns french and tries to make fpop a thing. Fails miserably.",
        "Leaves show business to go to college to get a degree and joins a sorority. Becomes the first minority president. Gets killed by the red devil.",
        "Got hit by a bus walking out of the studio",
        "Addicted to fame, but ultimately talentless, they break into a sperm bank and use turkey basters to impregnate monkeys. Creates mutants that will one day take over",
        "Accidentally took the wrong door out of the studio and is teleported to an alternate dimension where they must watch their parents have sex on repeat. Can't die.",
        "Says 'Fuck it' after getting eliminated and climbs up in the rafters waiting for the final ceremony. Drops a taco bell shit on the winners head.",
        "After the show they accidentally witness a gang murder. After testifying are put in witness protection. Will be on next season with their new identity"
    ]

    const WINNING_STORIES = [
        "Released a self titled debut album which went to the top 5 on the Billboard Hot 100. Dates Taylor Swift and writes a breakup song about her.",
        "Released a series of music over a long career, including hits like 'Suck My Tits' and 'Bisexuals aren't real'",
        "Went on to host future seasons of the show. Accidentally births 15 children and starts a family band who wins America's Got Talent."
    ]

    const DEMO = {
        "title": "Demo (Penis Song)",
        "artist": "Macklemore",
        "key": "penis_song",
        "file": "penis_song.mp3",
        "lyrics": [
            "(intro)",
            "This is my penis song",
            "I wish that I had a bigger shlong",
            "One that was quite a bit more",
            "_____ ___ ___ ____ ____"
        ]
    }

    const EPISODE_TITLES = ["Episode One - Blind Auditions", "Episode Two - Showdown", "Episode Three - Semifinals", "Episode Four - Finals"]

    /*------------------------------------------------------------------------
     *              PRIVATE VARIABLES
     */

    let outOrder = 0;
    let currentAnimatedPiece = 0;
    let usedNames = [];
    let usedStories = [];
    let currentEpisode = 1;
    let game;
    let songIndex = 0;
    let screenIndex = 0;
    let highestVote = 0;
    let questions = [];
    let players_that_passed = [];
    let eligible_players = [];
    let players = [
        {
            "name": "red",
            "active": true,
            "votes": 0,
            "outorder": null,
            "first_name": "",
            "last_name": "",
            "stage_name": ""
        },
        {
            "name": "orange",
            "active": true,
            "votes": 0,
            "outorder": null,
            "first_name": "",
            "last_name": "",
            "stage_name": ""
        },
        {
            "name": "yellow",
            "active": true,
            "votes": 0,
            "outorder": null,
            "first_name": "",
            "last_name": "",
            "stage_name": ""
        },
        {
            "name": "green",
            "active": true,
            "votes": 0,
            "outorder": null,
            "first_name": "",
            "last_name": "",
            "stage_name": ""
        },
        {
            "name": "blue",
            "active": true,
            "votes": 0,
            "outorder": null,
            "first_name": "",
            "last_name": "",
            "stage_name": ""
        },
        {
            "name": "pink",
            "active": true,
            "votes": 0,
            "outorder": null,
            "first_name": "",
            "last_name": "",
            "stage_name": ""
        },
    ]

    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    let advanceScreen;
    let animateInPiece;
    let askTheAudience;
    let checkNextEpisode;
    let choosePlayer;
    let getPlayerPadding;
    let getPlayerColor;
    let getRandomPlayerName;
    let getRandomStory;
    let getPlayerVotes;
    let getEpisodeHtml;
    let loadEpisodeCard;
    let loadQuestions;
    let loadSongs;
    let loadScreen;
    let hidePolls;
    let init;
    let playerShow;
    let toggleContestant;
    let setupKeyPress;
    let showPolls;
    let showVotes;
    let showTV;
    let hideTV;
    let loadTVContent;
    let incrementVotes;
    let showWinner;
    let nextEpisode;


    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    advanceScreen = () => {
        if (screenIndex == 0) {
            let element = questions[songIndex - 1];
            let soundElement = document.getElementById(`${element.key}_audio`);
            soundElement.pause();
            soundElement.currentTime = 0;
            soundElement.play();
        }
        document.getElementById(TV_CONTENT_ID).children[screenIndex].classList.add('hidden')
        console.log(document.getElementById(TV_CONTENT_ID).children[screenIndex + 1])
        if (document.getElementById(TV_CONTENT_ID).children[screenIndex + 1] == undefined) {
            screenIndex = 0
        } else {
            screenIndex += 1;
        }
        document.getElementById(TV_CONTENT_ID).children[screenIndex].classList.remove('hidden')
    }

    animateInPiece = () => {
        if (currentAnimatedPiece < 6) {
            document.getElementById(CONTESTANTS_PLATFORM_ID).children[currentAnimatedPiece].classList.remove('hiddenToBottom')
        } else {
            document.getElementById("right_side").classList.remove("hiddenToRight")
        }
        currentAnimatedPiece += 1;
    }

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
                if (element.votes > VOTE_CAP) {
                    element.votes = Math.floor((Math.random() * 3) * Math.floor(Math.random() * (VOTE_CAP * .75)));
                    if (element.votes > (VOTE_CAP * .75)) {
                        element.votes = Math.floor((Math.random() * 1) * Math.floor(Math.random() * (VOTE_CAP * .5)));
                    }
                }

                if (element.votes < 200) {
                    element.votes = element.votes + 1234
                }

                if (element.votes > highestVote) {
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
                console.log(element.name + " - " + element.outorder)
                if (element.outorder == null) {
                    outOrder += 1;
                    element.outorder = outOrder;
                }
                console.log(winningplayer)
                console.log(element)
                if (element.name == winningplayer) {
                    element.outorder = 100;
                    showWinner()
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

    choosePlayer = () => {
        let activeElement;
        let playerIndex = 0;
        let i = 0;
        let pickablePlayers = []
        console.log(players)
        players.forEach(element => {
            console.log(element)
            i++;
            let char = document.getElementsByClassName('player-' + i)[0];
            if (!char.parentElement.classList.contains('inactive-icon')) {
                if (!players_that_passed.includes(element.name)) {
                    pickablePlayers.push(char)
                }
            }
        });

        let index = Global.getRandInt(pickablePlayers.length * 10, (pickablePlayers.length * 10) + 15)

        console.log(pickablePlayers)
        playerShow(0, index, pickablePlayers)
    }

    playerShow = (i, cap, players) => {
        console.log(players)
        let activeBar = document.getElementsByClassName('chosenPlayer')[0];
        if (i < players.length) {
            if (i > 0) {
                if(activeBar){
                    activeBar.classList.remove('chosenPlayer')
                }
            }
            players[i].classList.add('chosenPlayer')
        } else {
            cap = cap - players.length;
            i = 0;
            if(activeBar){
                activeBar.classList.remove('chosenPlayer')
            }
            players[i].classList.add('chosenPlayer')
        }
        if (i < cap) {
            Global.playSound('click')
            setTimeout(function () { playerShow(i + 1, cap, players) }, 65)
        } else {

            let flash = 500
            setTimeout(function () { players[i].classList.remove('chosenPlayer'); Global.playSound("right") }, flash)
            setTimeout(function () { players[i].classList.add('chosenPlayer') }, flash * 2)
            setTimeout(function () { players[i].classList.remove('chosenPlayer'); Global.playSound("right") }, flash * 3)
            setTimeout(function () { players[i].classList.add('chosenPlayer') }, flash * 4)
            setTimeout(function () { players[i].classList.remove('chosenPlayer'); Global.playSound("right") }, flash * 5)
        }
    }

    getRandomPlayerName = (player) => {
        let firstName = FNAME_ARRAY[Math.floor(Math.random() * FNAME_ARRAY.length)];
        let lastName = LNAME_ARRAY[Math.floor(Math.random() * LNAME_ARRAY.length)];
        let middleName = MNAME_ARRAY[Math.floor(Math.random() * MNAME_ARRAY.length)];
        if (usedNames.includes(firstName) || usedNames.includes(lastName) || usedNames.includes(middleName)) {
            return getRandomPlayerName(player)
        } else {
            usedNames.push(firstName)
            usedNames.push(lastName)
            usedNames.push(middleName)
        }
        player.first_name = firstName
        player.last_name = lastName
        player.stage_name = middleName
    }

    getRandomStory = (i) => {
        let array = STORIES
        if (i == 1) {
            array = WINNING_STORIES
        }
        let story = array[Math.floor(Math.random() * array.length)];
        if (usedStories.includes(story)) {
            return getRandomStory(i)
        } else {
            usedStories.push(story)
        }
        return story
    }


    getPlayerPadding = (name) => {
        if (name == "red" || name == "pink") {
            return "height:30%"
        }
        else if (name == "orange" || name == "blue") {
            return "height:45%"
        }
        else if (name == "green") {
            return "height:36%"
        }
        else {
            return "height:28%"
        }
    }

    getPlayerVotes = (name) => {
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
            if (currentEpisode > 1) {
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
        players_that_passed = [];
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
        let i = 0;
        players.forEach(player => {
            i++;
            html += `
                <div class="contestant hiddenToBottom" id="contestant=${player.name}" data-name="${player.name}" onclick="toggleContestant('${player.name}')">
                    <img class="playerimg player-${i}" src="../images/characters/${player.name}_glow.png">
                    <div class="contestant_name" style="color:${getPlayerColor(player.name)};${getPlayerPadding(player.name)};text-shadow:${getPlayerColor(player.name)} 1px 0 10px; box-shadow: inset ${getPlayerColor(player.name)} 0px 0px 2px 5px;">${player.first_name}<br><b>"${player.stage_name}"</b><br>${player.last_name}</div>
                </div>
`
        });

        document.getElementById(CONTESTANTS_PLATFORM_ID).innerHTML = html;

        showTV()
    }

    loadSongs = (data) => {
        let html =
        `<audio id="rightAudio" controls>
            <source src="../audios/correct.wav" type="audio/mpeg">
        </audio>
        <audio id="clickAudio" controls>
            <source src="../audios/click.mp3" type="audio/mpeg">
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

    loadTVContent = () => {
        screenIndex = 0;
        let element = questions[songIndex]
        let html = `
        <div class="tvLyric">
            <div class="tvTitle">${element.title}</div>
            <div class="tvArtist">${element.artist}</div>
        </div>
        `
        element.lyrics.forEach(el => {
            html += `<div class="tvLyric hidden">${el}</div>`
        });

        document.getElementById(TV_CONTENT_ID).innerHTML = html
        songIndex += 1
        showTV()
    }

    init = function () {
        console.log("Started Voice init...");
        window.scrollTo(0, 0)
        game = JSON.parse(localStorage.getItem("currentGame"))
        if (game == undefined || game.json_name == undefined) {
            game.json_name = '2010popparty';
        }

        players.forEach(element => {
            getRandomPlayerName(element)
        });

        loadQuestions();
        loadEpisodeCard();
        setupKeyPress();
    };

    setupKeyPress = () => {
        window.onkeypress = function (event) {
            console.log(event.keyCode)
            switch (event.keyCode) {
                case 13:
                    Global.playSound("right")
                    break;
                case 32:
                    event.preventDefault();
                    advanceScreen();
                    break;
                case 92:
                    Global.playSound("wrong")
                    break;
                case 104:
                    Global.goHome()
                    break;
                case 105:
                    loadTVContent()
                    break;
                case 110:
                    animateInPiece()
                    break;
                case 111:
                    hideTV()
                    break;
                case 112:
                    showTV()
                    break;
                case 113:
                    songIndex = songIndex - 2;
                    loadTVContent();
                    break;
                case 117:
                    choosePlayer()
                    break;
            }
        }
    }

    toggleContestant = (name) => {
        let off = true;
        let bar = document.getElementById(`contestant=${name}`)

        players.forEach(element => {
            if (element.name == name) {
                if (element.active) {
                    off = true
                    if (element.outorder == null) {
                        outOrder += 1;
                        element.outorder = outOrder;
                    }
                } else {
                    off = false
                    element.outorder = null;
                }
                element.active = !off
            }
        });
        if (off) {
            bar.classList.add('inactive-icon')
            bar.style = "filter:saturate(0) brightness(.6)"

        } else {
            bar.classList.remove('inactive-icon')
            bar.style = "";
        }

    }

    incrementVotes = (bar, text, i, cap) => {
        if (i > cap) {
            i = cap
        }
        bar.style.height = Math.floor((i / highestVote) * 100) + "%"
        text.innerHTML = `${i}`
        if (i < cap) {
            if (i > 250) {
                setTimeout(function () { incrementVotes(bar, text, i + 5, cap) }, .1)
            } else if (i > 500) {
                setTimeout(function () { incrementVotes(bar, text, i + 10, cap) }, .001)
            }
            else if (i > 1000) {
                setTimeout(function () { incrementVotes(bar, text, i + 15, cap) }, .001)
            }
            else {
                setTimeout(function () { incrementVotes(bar, text, i + 1, cap) }, .1)
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
        if (element.getAttribute('data-votes')) {
            votes = element.getAttribute('data-votes')
        }

        incrementVotes(bar, text, 0, votes)
    }

    hidePolls = () => {
        document.getElementById(AUDIENCE_COVER_ID).classList.remove('hidden')
        document.getElementById(AUDIENCE_POLL_CONTAINER).innerHTML = "";
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

    hideTV = () => {
        screenIndex = 0;
        document.getElementById(TV_SCREEN_ID).classList.add('hiddenTV')
        setTimeout(function () { document.getElementById(TV_CONTENT_ID).classList.add("hiddenFade") }, 4000)
    }
    showTV = () => {
        document.getElementById(TV_SCREEN_ID).classList.remove('hiddenTV')
        setTimeout(function () { document.getElementById(TV_CONTENT_ID).classList.remove("hiddenFade") }, 4000)
    }

    showWinner = () => {
        let div = document.getElementById('winners')


        players.forEach(element => {
            if (element.outorder) {

            } else {
                element.outorder = 95
            }
        });

        let orderedPlayers = players.sort(compare)
        console.log(orderedPlayers)
        let i = 6;
        let html = `            <div class="resultTitle">
        <p onclick="window.scrollBy(0,window.clientHeight)">&rsaquo;</p>
        <div style="background-color: #ff1100"><p>R</p></div>
        <div style="background-color: #ff9d00"><p>E</p></div>
        <div style="background-color: #ebe834"><p>S</p></div>
        <div style="background-color: #40eb34"><p>U</p></div>
        <div style="background-color: #34deeb"><p>L</p></div>
        <div style="background-color: #eb34ab"><p>T</p></div>
        <div style="background-color: #ba34eb"><p>S</p></div>
    </div>`;
        orderedPlayers.forEach(element => {
            let color = getPlayerColor(element.name)
            if (i == 1) {
                html +=
                    `<div class="result">
                    <div class="resultBack" style="color:${color};background-color:${color};">
                    </div>
                    <div class="resultDiv" style="border-color:${color};width:85vw;align-self:flex-end;margin-bottom:50px;justify-self:center;">
                        <div class="resultText">
                            <div class="resultPlace" style="color:${color};">WINNER!</div>
                                <div class="resultName" style="color:${color};">${element.stage_name}</div>
                        </div>
                        <img class="resultImg" src="../images/characters/${element.name}_glow.png">
                        <div class="resultText">
                            <div class="resultStory" style="color:${color};">${getRandomStory(i)}</div>
                        </div>
                    </div>
                </div>`
            } else {
                if (i % 2 == 0) {
                    html +=
                        `<div class="result">
                        <div class="resultBack" style="color:${color};background-color:${color};" onclick="this.parentElement.children[1].classList.remove('hiddenToLeft')">
                        <p class="resultArrow"  style="color:white;">&raquo;</p>
                        </div>
                        <div class="resultDiv hiddenToLeft" style="border-color:${color};transform:translate(-5%);margin-left:50px;">
                            <img class="resultImg" src="../images/characters/${element.name}_glow.png">
                            <div class="resultText">
                                <div class="resultName" style="color:${color};">${element.stage_name}</div>
                                <div class="resultPlace" style="color:${color};">${PLACES[i - 1]}</div>
                                <div class="resultStory" style="color:${color};">${getRandomStory(i)}</div>
                            </div>
                        </div>
                    </div>`
                } else {
                    html +=
                        `<div class="result">
                        <div class="resultBack" style="color:red;background-color:${color};" onclick="this.parentElement.children[1].classList.remove('hiddenToRight')">
                        <p class="resultArrow"  style="color:white;">&laquo;</p>
                        </div>
                        <div class="resultDiv hiddenToRight" style="border-color:${color};transform:translate(5%);margin-right:50px;">
                            <div class="resultText">
                                <div class="resultName" style="color:${color};">${element.stage_name}</div>
                                <div class="resultPlace" style="color:${color};">${PLACES[i - 1]}</div>
                                <div class="resultStory" style="color:${color};">${getRandomStory(i)}</div>
                            </div>
                            <img class="resultImg" src="../images/characters/${element.name}_glow.png">
                        </div>
                    </div>`
                }
                i--;
            }

        });

        div.innerHTML = html;
        div.classList.remove('hidden')
        setTimeout(function () { div.classList.remove('hiddenFade') }, 50)


    }

    function compare(a, b) {
        if (a.outorder < b.outorder) {
            return -1;
        }
        if (a.outorder > b.outorder) {
            return 1;
        }
        return 0;
    }

    nextEpisode = () => {
        hideTV()
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
