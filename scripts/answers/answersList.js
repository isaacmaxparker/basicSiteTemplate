/*property

*/


const Answers = (function () {
    "use strict";

    /*------------------------------------------------------------------------
     *              CONSTANTS
     */
    const JEOPARDY_URL_PREFIX = 'https://raw.githubusercontent.com/isaacmaxparker/JSON/main/Games/Jeopardy/'
    const FAMFUED_URL_PREFIX = 'https://raw.githubusercontent.com/isaacmaxparker/JSON/main/Games/FamFued/'
    const MILLIONAIRE_URL_PREFIX = 'https://raw.githubusercontent.com/isaacmaxparker/JSON/main/Games/Millionare/'

    const FAM_ASNWERS_LIST_ID = "famGrid";

    const JEP_ANSWERS_LIST_DIV_ID = "jepAnswers";
    const FIRST_JEP_GRID_ID = "firstJepGrid";
    const SECOND_JEP_GRID_ID = "secondJepGrid";
    const THIRD_JEP_GRID_ID = "finalJepGrid"

    /*------------------------------------------------------------------------
     *              PRIVATE VARIABLES
     */
    let game;
    let current_teams = [];
    let game_type = '';

    let fam_questions;
    let fam_final_questions;
    let round_1_questions;
    let round_2_questions;
    let final_question;
    let final_answer;


    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    let addPoints;
    let init;
    let loadGames;
    let loadQuestions;
    let loadJeopardyAnswers;
    let loadFamFuedAnswers;
    let toggleAnswer;
    let showGrid;


    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    init = function (onInitializedCallback) {
        console.log("Started Jeopardy init...");
        window.scrollTo(0, 0)
        loadGames();

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
        game_type = game.type;
        console.log(game)
        loadQuestions();
    }

    loadQuestions = function () {
        console.log(game_type)
        let url_prefix = "";
        switch (game_type) {
            case "jeopardy":
                url_prefix = JEOPARDY_URL_PREFIX;
                break;
            case "famFued":
                url_prefix = FAMFUED_URL_PREFIX;
                break;
            case "millionaire":
                url_prefix = MILLIONAIRE_URL_PREFIX;
                break;
            default:
                return;
        }
        let url = url_prefix + game.json_name + ".json"
        Global.ajax(url, function (data) {
            switch (game_type) {
                case "jeopardy":
                    console.log(data[0])
                    round_1_questions = data[0].round_one;
                    round_2_questions = data[0].round_two;
                    final_question = data[0].final_questions;
                    final_answer = data[0].final_answers;
                    loadJeopardyAnswers();
                    break;
                case "famFued":
                    let array = [];
                    data.forEach(element => {
                        if(element.questions == null){
                            array.push(element)
                        }
                        else{
                            fam_final_questions = element;
                        }
                    });
                    fam_questions = array;
                    loadFamFuedAnswers();
                    break;
                case "millionaire":
                    break;
                default:
                    return;
            }
        });
    }

    loadFamFuedAnswers = function () {
        console.log(fam_questions)
        let html = '';
        fam_questions.forEach(element => {
            html += `
            <div class="answersCategory">
                <div class="listSeparator"> 
                    <div class="preLine" style="width:50px"> 
                        <div class="lineContainer flex-column">
                            <div class="listSeparatorLine"></div>
                        </div>
                    </div> 
                    <div class="lineSeparatorName" style="max-width:80%;"> 
                        <div class="lineContainer flex-column" style="font-size:50%; ">
                            ${element.question_text}
                        </div>
                    </div> 
                    <div class="postLine"> 
                        <div class="lineContainer flex-column">
                            <div class="listSeparatorLine"></div>
                        </div>
                    </div>  
                </div> 
                <div class="answerDiv">
                <div class="famAnswerRow">
                    <div class="question answerBox">
                        ${element.answer_1.replace("\/"," / <br>")}
                    </div>
                    <div class="answer answerBox">
                        ${element.answer_4.replace("\/"," / <br>")}
                    </div>
                </div>
                <div class="famAnswerRow">
                    <div class="answer answerBox">
                        ${element.answer_2.replace("\/"," / <br>")}
                    </div>
                    <div class="question answerBox ">
                        ${element.answer_5.replace("\/"," / <br>")}
                    </div>
                </div>
                <div class="famAnswerRow">
                    <div class="question answerBox"">
                        ${element.answer_3.replace("\/"," / <br>")}
                    </div>
                    <div class="answer answerBox">
                        ${element.answer_6.replace("\/"," / <br>")}
                    </div>
                </div>
            </div>
            </div>`
        });

        document.getElementById(FAM_ASNWERS_LIST_ID).innerHTML = html + `<div class="cat_spacer"></div>`;
    }

    loadJeopardyAnswers = function () {
        console.log(round_1_questions)
        let totalHTML = "";
        let round1HTML = `<div id="firstJepGrid" class="jepGrid hidden">`;
        let round2HTML = `<div id="secondJepGrid" class="jepGrid hidden">`;
        let finalHTML = `<div id="finalJepGrid" class="jepGrid hidden">`;

        round_1_questions.forEach(element => {
            let catHTML =
                `<div class="answersCategory">
                    <div class="listSeparator"> 
                        <div class="preLine"> 
                            <div class="lineContainer flex-column">
                                <div class="listSeparatorLine"></div>
                            </div>
                        </div> 
                        <div class="lineSeparatorName"> 
                            <div class="lineContainer flex-column">
                                ${element.category_name}
                            </div>
                        </div> 
                        <div class="postLine"> 
                            <div class="lineContainer flex-column">
                                <div class="listSeparatorLine"></div>
                            </div>
                        </div>  
                    </div>`
                    element.questions.forEach(question => {

                catHTML += `<div class="answerDiv">
                                <div class="question answerBox" onclick="toggleAnswer(this.parentElement.children[1])"">
                                ${question.points} - ${question.answer}
                                </div>
                                <div class="answer answerBox hidden">
                                    ${question.question}
                                </div>
                            </div>`
            })
            catHTML += `</div>`
            round1HTML += catHTML
        });
        round1HTML += '<div class="cat_spacer"></div></div>';

        round_2_questions.forEach(element => {
            let catHTML =
                `<div class="answersCategory">
                    <div class="listSeparator"> 
                        <div class="preLine"> 
                            <div class="lineContainer flex-column">
                                <div class="listSeparatorLine"></div>
                            </div>
                        </div> 
                        <div class="lineSeparatorName"> 
                            <div class="lineContainer flex-column">
                                ${element.category_name}
                            </div>
                        </div> 
                        <div class="postLine"> 
                            <div class="lineContainer flex-column">
                                <div class="listSeparatorLine"></div>
                            </div>
                        </div>  
                    </div>`
                    element.questions.forEach(question => {

                catHTML += `<div class="answerDiv">
                                <div class="question answerBox" onclick="toggleAnswer(this.parentElement.children[1])"">
                                ${question.points} - ${question.answer}
                                </div>
                                <div class="answer answerBox hidden">
                                    ${question.question}
                                </div>
                            </div>`
            })
            catHTML += `</div>`
            round2HTML += catHTML
        });
        round2HTML += '<div class="cat_spacer"></div></div>';
console.log(final_question)
        finalHTML += `<div class="answersCategory">
                        <div class="listSeparator"> 
                            <div class="preLine"> 
                                <div class="lineContainer flex-column">
                                    <div class="listSeparatorLine"></div>
                                </div>
                            </div> 
                            <div class="lineSeparatorName"> 
                                <div class="lineContainer flex-column">
                                    Final Jeopardy
                                </div>
                            </div> 
                            <div class="postLine"> 
                                <div class="lineContainer flex-column">
                                    <div class="listSeparatorLine"></div>
                                </div>
                            </div>  
                        </div> 
                        <div class="answerDiv">
                            <div class="question answerBox" onclick="toggleAnswer(this.parentElement.children[1])"">
                                ${final_question}
                            </div>
                            <div class="answer answerBox hidden">
                                ${final_answer}
                            </div>
                        </div>
                    </div> 
                </div>`

        totalHTML += round1HTML;
        totalHTML += round2HTML;
        totalHTML += finalHTML;
        document.getElementById(JEP_ANSWERS_LIST_DIV_ID).innerHTML = totalHTML;

        document.getElementById(JEP_ANSWERS_LIST_DIV_ID).style.display = 'block'
        showGrid(1)
    }

    toggleAnswer = function (answer) {
        if (answer.classList.contains("hidden")) {
            answer.classList.remove("hidden")
        } else {
            answer.classList.add("hidden")
        }
    }

    showGrid = function (grid_to_show) {
        switch (parseInt(grid_to_show)) {
            case 1:
                document.getElementById(FIRST_JEP_GRID_ID).classList.remove('hidden')
                document.getElementById(SECOND_JEP_GRID_ID).classList.add('hidden')
                document.getElementById(THIRD_JEP_GRID_ID).classList.add('hidden')
                break;
            case 2:
                document.getElementById(FIRST_JEP_GRID_ID).classList.add('hidden')
                document.getElementById(SECOND_JEP_GRID_ID).classList.remove('hidden')
                document.getElementById(THIRD_JEP_GRID_ID).classList.add('hidden')
                break;
            case 3:
                document.getElementById(FIRST_JEP_GRID_ID).classList.add('hidden')
                document.getElementById(SECOND_JEP_GRID_ID).classList.add('hidden')
                document.getElementById(THIRD_JEP_GRID_ID).classList.remove('hidden')
                break;
        }
    }

    /*------------------------------------------------------------------------
     *              PUBLIC METHODS
     */
    return {
        init,
        toggleAnswer,
        showGrid,
    };
}());
