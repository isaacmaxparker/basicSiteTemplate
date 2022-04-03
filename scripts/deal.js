/*property

*/


const Deal = (function () {
    "use strict";

    /*------------------------------------------------------------------------
     *              CONSTANTS
     */
    const TEAMS_TO_REMOVE = [
        [4, 3],
        [4],
    ]

    const PULSE_TIME = 500;

    const CASES_ROW_ID = 'case_rows';

    const POSSIBLE_VALUES = [
        0.01,
        1,
        5,
        10,
        25,
        50,
        75,
        100,
        200,
        300,
        400,
        500,
        750,
        1000,
        5000,
        10000,
        25000,
        50000,
        75000,
        100000,
        200000,
        300000,
        400000,
        500000,
        750000,
        1000000
    ]

    /*------------------------------------------------------------------------
     *              PRIVATE VARIABLES
     */
    let questionsLoaded = false;
    let game;
    let cases = [];
    let values_left =[];
    let current_teams = [];
    let num_of_teams;

    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    let addPoints;
    let calculateOffer;
    let loadPlayers;
    let init;
    let loadGame;
    let loadCases;
    let loadCaseRow;
    let playSound;
    let setupCases;
    let showValueScreen;

    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */
    calculateOffer = (team_id)=> {
        if(team_id == all){
            for(let i = 1; i<= num_of_teams;i++){
                calculateOffer(i)
            }
        }
        else{

        }
    }

    init = function (onInitializedCallback) {
        console.log("Started Deal init...");
        window.scrollTo(0, 0)
    };

    loadPlayers = (num_of_players) => {
        num_of_teams = num_of_players;
        document.getElementById('loadScreen').classList.add('hidden');
        if (num_of_players == 4) {
            
        }else{
            let players_to_remove = TEAMS_TO_REMOVE[num_of_players - 2];
            console.log(num_of_players)
            console.log(players_to_remove)
            console.log(players_to_remove);

            players_to_remove.forEach(element => {
                document.getElementById('team_' + element).remove();
                document.getElementById('team_' + element + '_wager').remove();
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

        setTimeout(function(){document.getElementById('wager_list').classList.remove('invisible')},250)
        setTimeout(function(){document.getElementById('teams_list').classList.remove('invisible')},250)
        loadGame();
    }

    loadGame = () => {
        setupCases();
    }

    loadCases = () => {
        let rows_html = '';
        rows_html += loadCaseRow(1,9);
        rows_html += loadCaseRow(10,18);
        rows_html += loadCaseRow(19,26);
        document.getElementById(CASES_ROW_ID).innerHTML = rows_html;
    }
    
    loadCaseRow = (starting_id,length) =>{
        let html = `<div class="cases_row grid-${length}">`;
        console.log(length);
        let id = starting_id;
        while(id <= length){
            console.log("ASdf: " + id)
            html +=
            `<div class="case">
                <div class="inactive_case casing">
                    ${id}
                </div>
                <div id="draggable_case_${id}"class="active_case casing" draggable="true" ondragstart="drag(event)">
                    <div id="closed_case_${id}" class="closed_case" ondblclick="showValueScreen(${id})">${id}</div>
                    <div id="open_case_${id}" class="open_case hidden">${cases[id-1]}</div>
                </div>
            </div>`;
            id += 1;
        }
        html += '</div>'
        return html;
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

    setupCases = () =>{
        values_left = POSSIBLE_VALUES;
        cases = Global.shuffleArray(POSSIBLE_VALUES);
        loadCases();
    }

    showValueScreen = (id) => {
        let caseObj = document.getElementById('draggable_case_' + id);
        if(caseObj.parentElement.classList.contains('case_slot')){

        }else{
            caseObj.classList.add('outpulse');
            setTimeout(function(){caseObj.classList.remove('outpulse')},PULSE_TIME);
            setTimeout(function(){caseObj.classList.add('outpulse')},PULSE_TIME * 2);
            setTimeout(function(){caseObj.classList.remove('outpulse')},PULSE_TIME * 3);
            setTimeout(function(){
                document.getElementById('open_case_' + id).classList.remove('hidden');
                document.getElementById('closed_case_' + id).classList.add('hidden');
            },PULSE_TIME * 4);
        }
    }

    /*------------------------------------------------------------------------
     *              PUBLIC METHODS
     */
    return {
        init,
        loadPlayers,
        showValueScreen,
    };
}());
