/*property

*/


const Milli = (function() {
    "use strict";
  
    /*------------------------------------------------------------------------
     *              CONSTANTS
     */
    const QUESTIONS_URL_PREFIX = 'https://raw.githubusercontent.com/isaacmcdgl/JSON/main/Games/Millionare/'
    const FIRST_QUESTION = {
        "question_text":"Press Next to start the game",
        "answers":{
            "answer_1":"",
            "answer_2":"",
            "answer_3":"",
            "answer_4":"",
            "right_answer":null
        }
    }
    const LAST_QUESTION = {
        "question_text":"All out of questions for this game",
        "answers":{
            "answer_1":"",
            "answer_2":"",
            "answer_3":"",
            "answer_4":"",
            "right_answer":null
        }
    }

    const QUESTION_DIV_ID = "questions_div";
    const ANSWER_TEXT_ID = "answerText";
    /*------------------------------------------------------------------------
     *              PRIVATE VARIABLES
     */
    let questionsLoaded = false;
    let currentQuestionID = 0;
    let game;
    let questions;
    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */
    let init;  
    let loadGames;
    let loadQuestions;
    let switchQuestion;
    let showQuestion;

    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */
  
    init = function(onInitializedCallback) {
        console.log("Started Milli init...");
        window.scrollTo(0,0)
        loadGames();
    };

    loadGames = function(){
        game = JSON.parse(localStorage.getItem("currentGame"))
        loadQuestions();
    }

    loadQuestions = function(){
        let url = QUESTIONS_URL_PREFIX + game.json_name + ".json"
        Global.ajax(url, function(data) {
            questions = data;
            questions.unshift(FIRST_QUESTION)
            questions.push(LAST_QUESTION)
            questionsLoaded = true;
            console.log(questions)
            showQuestion();
        })

    }

    switchQuestion = function(isForward){
        if(isForward){
            if(currentQuestionID == questions.length - 1){
                return;
            }
            currentQuestionID += 1; 
        }
        else{        
            if(currentQuestionID == 0){
                return
            }    
            currentQuestionID -= 1;
        }

        if(currentQuestionID == 0){
            document.getElementById("prevButton").classList.add('inactive');
            document.getElementById("nextButton").classList.remove('inactive');
        }
        else if(currentQuestionID == questions.length - 1){
            document.getElementById("prevButton").classList.remove('inactive');
            document.getElementById("nextButton").classList.add('inactive');
        }
        else{
            document.getElementById("nextButton").classList.remove('inactive');
            document.getElementById("prevButton").classList.remove('inactive')
        }
        
       
        showQuestion();
    }
    
    showQuestion = function(){
        let question = questions[currentQuestionID];
        document.getElementById(QUESTION_DIV_ID).innerHTML = question.question_text;
        let answerDivs = document.getElementsByClassName(ANSWER_TEXT_ID);
        console.log(question.answers);
        for(let i = 0;i<4;i++){
            console.log(answerDivs);
            answerDivs[i].innerHTML = question.answers['answer_'+(i+1)]
            if(i + 1 == question.answers.right_answer){
                answerDivs[i].parentElement.setAttribute('data-correct',true)
            }
            else{
                answerDivs[i].parentElement.setAttribute('data-correct',false)
            }
            
        }
    }

    /*------------------------------------------------------------------------
     *              PUBLIC METHODS
     */
    return {
        init,
        switchQuestion,
    };
  }());
  