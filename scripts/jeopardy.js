/*property

*/


const Jeop = (function () {
    "use strict";

    /*------------------------------------------------------------------------
     *              CONSTANTS
     */
    const QUESTIONS_URL_PREFIX = 'https://raw.githubusercontent.com/isaacmaxparker/JSON/main/Games/Jeopardy/'
    const TEAMS_TO_REMOVE = [
        [6, 5, 4, 3],
        [5, 4, 3],
        [4, 3],
        [4],
    ]

    const MAX_NUM_OF_TEAMS = 6

    const GRID_CONT_ID = "mainGrid";
    const DOUBLE_GRID_CONT_ID = "doubleGrid";

    /*------------------------------------------------------------------------
     *              PRIVATE VARIABLES
     */
    let questionsLoaded = false;
    let game;
    let current_teams = [];
    let num_of_teams;
    let round_1_questions;
    let round_2_questions;
    let final_question;
    let outstanding_points = 0;
    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    let addPoints;
    let loadPlayers;
    let init;
    let loadGrid;
    let loadGames;
    let loadQuestions;
    let playSound;
    let hideQuestion;
    let showQuestion;
    let showBoard;
    let showColumn;
    let showFinalJeopardy;
    let showGrid;
    let flipTile;
    let finalPoints;
    let updateFinalJeopardy;
    let showDoubleJeopardy;


    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    addPoints = function (team_id) {
        let div = document.getElementById('team_' + team_id).querySelector(".team_points")
        div.value = parseInt(div.value) + parseInt(outstanding_points);
        console.log(outstanding_points)
        hideQuestion()
    }

    flipTile = function (tiles, index) {
        console.log(tiles)
        console.log(tiles.length)
        if (index < tiles.length) {
            tiles[index].classList.remove('flippedDiv')
            setTimeout(function () { flipTile(tiles, index + 1) }, 50)
        }
    }

    finalPoints = function (id, to_add) {
        let wager = parseInt(document.getElementById('team_' + id + '_wager_points').value);
        let scoreDiv = document.getElementById('team_' + id).querySelector('.team_points');

        if (to_add) {
            scoreDiv.value = parseInt(scoreDiv.value) + wager;
        }
        else {
            scoreDiv.value = parseInt(scoreDiv.value) - wager;
        }

    }

    hideQuestion = function (double=false) {
        if(double){
            document.getElementById('dailydouble').classList.add('flippedDiv')
        }else{
            document.getElementById('question').classList.add('flippedDiv')
            outstanding_points = 0;
        }

    }

    init = function (onInitializedCallback) {
        console.log("Started Jeopardy init...");
        window.scrollTo(0, 0)
        loadGames();

        let html = '';
        for (let i = 2; i <= MAX_NUM_OF_TEAMS; i++) {
            html += `<div class="playNum" onclick=loadPlayers(${i})>${i}</div>`;
        }

        document.getElementById('playnumbers').innerHTML = html;

        // loadPlayers(9);

        window.onkeypress = function (event) {
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
    };

    loadGames = function () {
        game = JSON.parse(localStorage.getItem("currentGame"))
        loadQuestions();
    }

    loadQuestions = function () {
        let url = QUESTIONS_URL_PREFIX + game.json_name + ".json"
        Global.ajax(url, function (data) {
            console.log(data);
            round_1_questions = data[0].round_one;
            round_2_questions = data[0].round_two;
            final_question = data[0].final_questions;
            questionsLoaded = true;
            loadGrid()
        })

    }

    loadGrid = function () {
        let gridCont = document.getElementById(GRID_CONT_ID);
        
        let shuffled_column = Global.shuffleArray(round_1_questions);
        let random_int = Math.round(Math.random() * (5 - 1) + 1)
        console.log(random_int)
        console.log(shuffled_column[1].questions[random_int]);
        shuffled_column[1].questions[random_int].double = true;

        round_1_questions.forEach(categ => {
            let colHTML = '';
            colHTML += `<div class="mainGridColumn col-${round_1_questions.length}" >`
            colHTML += `<div class="mainGridTile" onclick="showColumn(this.parentElement)">
                            <div class="mainTileText flippedDiv">
                                <div class="catName ${round_1_questions.length < 8 && categ.category_name.length > 20 ? 'smallerText' : '' }">${categ.category_name}</div>
                            </div>
                        </div>`
            categ.questions.forEach(quest => {
                colHTML += `<div class="mainGridTile" onclick="showQuestion(this)">
                            <div class="mainTileText flippedDiv">
                            <div class="hidden">
                                <div class="q">
                                    ${quest.question}
                                </div>
                                <div class="a">
                                    ${quest.answer}
                                </div>
                                <div class="d" data-double="${quest.double ? true : false}"></div>
                            </div>
                            <div class="points">$${quest.points}</div>
                            </div>
                        </div>`
            });
            colHTML += '</div>'

            gridCont.innerHTML += colHTML;
        });
        shuffled_column = Global.shuffleArray(round_2_questions);
        random_int = Math.round(Math.random() * (5 - 1) + 1)
        shuffled_column[1].questions[random_int].double = true;
        let doubleGridCont = document.getElementById(DOUBLE_GRID_CONT_ID);
        round_2_questions.forEach(categ => {
            let colHTML = '';
            colHTML += `<div class="mainGridColumn col-${round_2_questions.length}" >`
            colHTML += `<div class="mainGridTile" onclick="showColumn(this.parentElement)">
                            <div class="mainTileText flippedDiv">
                                <div class="catName ${round_2_questions.length < 8 && categ.category_name.length > 20 ? 'smallerText' : '' }">${categ.category_name}</div>
                            </div>
                        </div>`
            categ.questions.forEach(quest => {
                colHTML += `<div class="mainGridTile" onclick="showQuestion(this)">
                            <div class="mainTileText flippedDiv">
                            <div class="hidden">
                                <div class="q">
                                    ${quest.question}
                                </div>
                                <div class="a">
                                    ${quest.answer}
                                </div>
                                <div class="d" data-double="${quest.double ? true : false}"></div>
                            </div>
                            <div class="points">$${quest.points}</div>
                            </div>
                        </div>`
            });
            colHTML += '</div>'

            doubleGridCont.innerHTML += colHTML;
        });

        document.getElementById('finalQuestion').innerHTML = final_question;
    }

    loadPlayers = function (num_of_players) {
        num_of_teams = num_of_players;
        document.getElementById('loadScreen').classList.add('hidden');


        let team_html = '<div id="current_points" class="hidden"></div>';
        let wager_html = '';

        for (let i = 1; i <= num_of_players; i++) {
            team_html += `<div id="team_${i}" class="team">
                                <input class="team_name"  placeholder="Team ${i}" onchange="updateTeamWagerName(this,${i})"/>
                                <input class="team_points" value="0" type="number" min="0"/>
                            </div>`;

            wager_html += ` <div id="team_${i}_wagers" class="team">
                                <input id="team_${i}_wager_name" class="team_name"> 
                                <input id="team_${i}_wager_points" class="team_points" placeholder="0" type="number" min="0" oninput="validateWager(this)"/>
                                <input class="team_name" style="border-bottom:none !important;border-top:rgb(32, 32, 90) 5px solid !important;"> 
                                <div class="wager_buttons"><div class="wagerButton icon" onclick="finalPoints(${i},true)">i</div><div class="wagerButton icon" onclick="finalPoints(${i},false)">*</div></div>
                            </div>`;
        }

        document.getElementById('teams_list').innerHTML = team_html;
        document.getElementById('wagers').innerHTML = wager_html;


        if(num_of_players > 4){
            document.getElementById('wagers').classList.add('grid-two-rows');
            document.getElementById('final_q').classList.add('small_q');
            document.getElementById('teams_list').classList.add('grid-two-columns');
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
            case 5:
                current_teams = [49, 50, 51, 52, 53]
                break;
            case 6:
                current_teams = [49, 50, 51, 52, 53, 54]
                break;
        }

        setTimeout(function () { document.getElementById('teams_list').classList.remove('invisible') }, 250)
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

    showFinalJeopardy = function () {

    }
    showGrid = function () {

    }

    showQuestion = function (oldElement) {
        let newElement = document.getElementById('question');
        console.log(oldElement.querySelector('.d').getAttribute('data-double'));
        if(oldElement.querySelector('.d').getAttribute('data-double') == true || oldElement.querySelector('.d').getAttribute('data-double') == 'true'){
            document.getElementById('dailydouble').classList.remove('flippedDiv');
            outstanding_points = parseInt(oldElement.querySelector('.points').innerHTML.replace('$', '')) * 2;
        }else{
            outstanding_points = oldElement.querySelector('.points').innerHTML.replace('$', '')
        }
        document.getElementById('questionText').innerHTML = oldElement.querySelector('.a').innerHTML
        oldElement.innerHTML = "";
        oldElement.classList.add("inactiveTile")
        newElement.classList.remove('flippedDiv');
    }

    showColumn = function (column) {
        console.log(column)
        let tiles = column.querySelectorAll('.mainTileText');
        flipTile(tiles, 0)
    }

    showBoard = function () {
        let tiles = document.getElementsByClassName('mainTileText');
        flipTile(tiles, 0)
    }

    showGrid = function () {
        document.getElementById('finalGrid').classList.add('invisible');
        document.getElementById('doubleGrid').classList.add('invisible');
        setTimeout(function () {
            document.getElementById('mainGrid').classList.remove('hidden');
            document.getElementById('doubleGrid').classList.add('hidden');
            document.getElementById('finalGrid').classList.add('hidden');
            setTimeout(function () { document.getElementById('mainGrid').classList.remove('invisible'); }, 250)

        }, 250)
    }

    showDoubleJeopardy = function () {
        document.getElementById('finalGrid').classList.add('invisible');
        document.getElementById('mainGrid').classList.add('invisible');
        setTimeout(function () {
            document.getElementById('doubleGrid').classList.remove('hidden');
            document.getElementById('mainGrid').classList.add('hidden');
            document.getElementById('finalGrid').classList.add('hidden');
            setTimeout(function () { document.getElementById('doubleGrid').classList.remove('invisible'); }, 250)

        }, 250)
    }

    showFinalJeopardy = function () {
        updateFinalJeopardy()
        document.getElementById('mainGrid').classList.add('invisible');
        document.getElementById('doubleGrid').classList.add('invisible');
        setTimeout(function () {
            document.getElementById('finalGrid').classList.remove('hidden');
            document.getElementById('mainGrid').classList.add('hidden');
            document.getElementById('doubleGrid').classList.add('hidden');
            setTimeout(function () {
                document.getElementById('finalGrid').classList.remove('invisible');
            }, 250)
        }, 250)
    }

    updateFinalJeopardy = function () {
        for (let i = 1; i <= num_of_teams; i++) {
            let max = parseInt(document.getElementById('team_' + i).querySelector('.team_points').value);
            document.getElementById('team_' + i + '_wager_points').setAttribute('max', max)
        }
    }



    /*------------------------------------------------------------------------
     *              PUBLIC METHODS
     */
    return {
        init,
        loadPlayers,
        hideQuestion,
        showQuestion,
        showBoard,
        showColumn,
        showFinalJeopardy,
        showGrid,
        showDoubleJeopardy,
        finalPoints,
    };
}());
