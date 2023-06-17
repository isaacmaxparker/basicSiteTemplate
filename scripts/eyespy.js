/*property

*/


const Spy = (function () {
    "use strict";

    /*------------------------------------------------------------------------
     *              CONSTANTS
     */
    const QUESTIONS_URL_PREFIX = 'https://raw.githubusercontent.com/isaacmcdgl/JSON/main/Games/EyeSpy/'
    const IMAGE_URL_PREFIX = 'https://raw.githubusercontent.com/isaacmcdgl/JSON/main/Games/EyeSpy/images/'
    const TEAMS_TO_REMOVE = [
        [4, 3],
        [4],
    ]

    const GRID_CONT_ID = "mainGrid"
    const ROW_POINTS = 4000;
    const LOSE_POINTS_VALUE = 500;
    const MAX_NUM_OF_TEAMS = 4;

    /*------------------------------------------------------------------------
     *              PRIVATE VARIABLES
     */
    let questionsLoaded = false;
    let game;
    let current_teams = [];
    let num_of_teams;
    let columns;
    let rows;
    let questions;
    let outstanding_points;
    let current_tile;
    let imagefolder;
    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    let addPoints;
    let addRowPoints;
    let changeLevel;
    let decodePoints;
    let loadPlayers;
    let init;
    let loadGrid;
    let loadGames;
    let loadQuestions;
    let playSound;
    let hideQuestion;
    let showQuestion;
    let losePoints;
    let showGrid;
    let showAnswerImage;
    let pointsInARow;


    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    addPoints = function (team_id) {
        playSound('money')
        let div = document.getElementById('team_' + team_id).querySelector(".team_points")
        div.value = parseInt(div.value) + parseInt(outstanding_points);
        console.log(outstanding_points)
        hideQuestion()
        current_tile.classList.remove('inactiveTile');
        current_tile.classList.add(`team_${team_id}_earned`);
    }

    pointsInARow = (div, level) => {
        div.value = parseInt(div.value) + decodePoints(parseInt(level));
    }


    addRowPoints = function (team_id) {
        let div = document.getElementById('team_' + team_id).querySelector(".team_points")
        div.value = parseInt(div.value) + parseInt(ROW_POINTS);
    }

    changeLevel = (level) => {
        console.log(level);
        let dist = document.getElementById('distortion_question');
        let all = document.getElementsByClassName(`dist_image`);
        console.log(all)
        for (let i = 0; i < all.length; i++) {
            console.log(all[i])
            all[i].classList.add('hidden');
            console.log(all[i])
        }
        console.log(`dist_image_${level + 1}`);
        document.getElementById(`dist_image_${parseInt(level) + 1}`).classList.remove('hidden');
        outstanding_points = decodePoints(parseInt(level));
    }

    decodePoints = (level) => {
        console.log(level)
        switch (level) {
            case 0:
                return 2000;
                break;
            case 1:
                return 1500;
                break;
            case 2:
                return 1000;
                break;
            case 3:
                return 250;
                break;
        }
    }

    hideQuestion = function () {
        document.getElementById('distortion_question').classList.add('flippedDiv')
        document.getElementById('character_question').classList.add('flippedDiv')
        document.getElementById('location_question').classList.add('flippedDiv')
        document.getElementById('charloc_question').classList.add('flippedDiv')
        outstanding_points = 0;
        let answers = document.getElementsByClassName('answerText');
        for (let i = 0; i < answers.length; i++) {
            answers[i].classList.add('invisible');
        }

    }

    init = function (onInitializedCallback) {
        console.log("Started EyeSpy init...");
        window.scrollTo(0, 0)
        loadGames();
       // loadPlayers(4);

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
                    case 54:
                        losePoints(1);
                        break;
                    case 55:
                        losePoints(2)
                        break;
                    case 56:
                        losePoints(3)
                        break;
                    case 57:
                        losePoints(4)
                        break;
                        case 48:
                            hideQuestion()
                            break;

                }
            }
        }
    };

    loadGames = function () {
        game = JSON.parse(localStorage.getItem("currentGame"))
        loadQuestions();
    }

    loadQuestions = function () {
        if (game == undefined || game.json_name == undefined) {
            game.json_name = 'isaacparkervol1';
        }
        let url = QUESTIONS_URL_PREFIX + game.json_name + ".json"
        Global.ajax(url, function (data) {
            console.log(data);
            columns = data[0].columns;
            rows = data[0].rows;
            questions = Global.shuffleArray(data[0].questions);
            imagefolder = data[0].foldername + "/";
            loadGrid()
        })

    }

    loadGrid = function () {
        let gridCont = document.getElementById(GRID_CONT_ID);
        console.log(questions)
        let i = 1;
        let colHTML;
        questions.forEach(question => {
            console.log(question);
            console.log(i);
            if (i == 1) {
                colHTML = `<div class="mainGridColumn col-${columns} row-${rows}" >`;
                colHTML += `<div class="mainGridTile" onclick="showQuestion('${question.type}',this)">
                                <img src="../images/logos/eyespy/${question.type}.png">
                                <div class="hidden">
                                <div class="categ">
                                    ${question.category}
                                </div>
                                    <div class="a">
                                        ${question.answer}
                                    </div>
                                    <div class="img">${question.imagename}</div>
                                </div>
                            </div>`
            }
            else if (i == 4) {
                colHTML += `<div class="mainGridTile" onclick="showQuestion('${question.type}',this)">
                                <img src="../images/logos/eyespy/${question.type}.png">
                                <div class="hidden">
                                <div class="categ">
                                ${question.category}
                            </div>
                                    <div class="a">
                                        ${question.answer}
                                    </div>
                                    <div class="img">${question.imagename}</div>
                                </div>
                            </div>`

                colHTML += '</div>'
                gridCont.innerHTML += colHTML;
                i = 0;
            }
            else {
                colHTML += `<div class="mainGridTile" onclick="showQuestion('${question.type}',this)">
                                <img src="../images/logos/eyespy/${question.type}.png">
                                <div class="hidden">
                                <div class="categ">
                                ${question.category}
                            </div>
                                    <div class="a">
                                        ${question.answer}
                                    </div>
                                    <div class="img">${question.imagename}</div>
                                </div>
                            </div>`
            }
            i++;
        });
    }

    loadPlayers = function (num_of_players) {
        num_of_teams = num_of_players;
        document.getElementById('loadScreen').classList.add('invisible');
        setTimeout(() => { document.getElementById('loadScreen').classList.add('hidden'); }, 550)
        setTimeout(() => { document.getElementById(GRID_CONT_ID).classList.remove('invisible'); }, 550)
        if (num_of_players == MAX_NUM_OF_TEAMS ) {

        } else {

            let players_to_remove = TEAMS_TO_REMOVE[num_of_players - 2];
            console.log(num_of_players)
            console.log(players_to_remove)
            console.log(players_to_remove);

            players_to_remove.forEach(element => {
                document.getElementById('team_tools_' + element).remove();
            });
        }

        switch (num_of_players) {
            case 2:
                current_teams = [49, 50]
                break;
            case 3:
                current_teams = [49, 50, 51]
                break;
            case 4:
                current_teams = [49, 50, 51, 52]
                break;
        }

        setTimeout(function () { document.getElementById('teams_list').classList.remove('invisible') }, 550)
    }

    losePoints = (team_id) => {
        playSound('wrong');
        let div = document.getElementById('team_' + team_id).querySelector(".team_points")
        div.value = parseInt(div.value) - LOSE_POINTS_VALUE;
    }

    playSound = function (sound) {
        console.log(sound)
        let soundElement;
        switch (sound) {
            case "right":
                soundElement = document.getElementById('rightAudio')
                break;
            case "wrong":
                soundElement = document.getElementById('wrongAudio')
                break;
            case "winner":
                soundElement = document.getElementById('winnerAudio')
                break;
            case "money":
                soundElement = document.getElementById('moneyAudio')
                break;
        }
        soundElement.pause();
        soundElement.currentTime = 0;
        soundElement.play();
    }

    showAnswerImage = function (element) {
        playSound('right')
        element.querySelector('.answerText').classList.remove('invisible');
        console.log(document.getElementById('location_image_2'))
        document.getElementById('character_image_2').classList.remove('hidden');
        document.getElementById('location_image_2').classList.remove('hidden');
        document.getElementById('charloc_image_2').classList.remove('hidden');
    }
    showQuestion = function (type, oldElement) {

        if (type == 'distortion') {
            outstanding_points = 1500;
            for (let i = 1; i <= 4; i++) {
                document.getElementById(`dist_image_${i}`).setAttribute('src', IMAGE_URL_PREFIX + imagefolder + oldElement.querySelector('.img').innerHTML + '_' + type + '_' + i + '.png')
                if (i != 1) {
                    document.getElementById(`dist_image_${i}`).classList.add('hidden')
                }else{
                    document.getElementById(`dist_image_${i}`).classList.remove('hidden')
                }

            }
            document.getElementById('dist_slider').value = 0;
        } else {
            if (type == 'charloc') {
                outstanding_points = 2000;
            }
            else {
                outstanding_points = 1000;
            }
            for (let i = 1; i <= 2; i++) {
                document.getElementById(`${type}_image_${i}`).setAttribute('src', IMAGE_URL_PREFIX + imagefolder + oldElement.querySelector('.img').innerHTML + '_' + type + '_' + i + '.png')
                if (i != 1) {
                    document.getElementById(`${type}_image_${i}`).classList.add('hidden')
                }else{
                    document.getElementById(`${type}_image_${i}`).classList.remove('hidden')
                }
            }
        }
        let newElement = document.getElementById(type + '_question');
        newElement.querySelector('.answerText').innerHTML = oldElement.querySelector('.a').innerHTML
        newElement.querySelector('.questionCategory').innerHTML = oldElement.querySelector('.categ').innerHTML
        oldElement.innerHTML = "";
        oldElement.classList.add("inactiveTile")
        setTimeout(function () { newElement.classList.remove('flippedDiv'); }, 50)
        current_tile = oldElement;
    }


    /*------------------------------------------------------------------------
     *              PUBLIC METHODS
     */
    return {
        init,
        playSound,
        loadPlayers,
        hideQuestion,
        showQuestion,
        showGrid,
        addRowPoints,
        changeLevel,
        showAnswerImage,
        pointsInARow,
        addPoints,
    };
}());
