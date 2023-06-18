/*property

*/


const famFued = (function() {
    "use strict";
  
    /*------------------------------------------------------------------------
     *              CONSTANTS
     */
    const ANIMATION_DURATION = 800;
    const OUTSTANDING_POINTS_ID = "scoreToAdd"
    const TEAM_SCORE_PREFIX = "team_score_"
    const FLIP_DURATION = 200;
    const QUESTIONS_URL_PREFIX = 'https://raw.githubusercontent.com/isaacmaxparker/JSON/main/Games/FamFued/'
    const STARTING_QUESTION =     {
        "question_num":0,
        "question_text":"Press Next to start the game!",
        "answer_1":null,
        "answer_2":null,
        "answer_3":null,
        "answer_4":null,
        "answer_5":null,
        "answer_6":null
    }

    const QUESTION_DIV_ID = "question_div";
    const ANSWER_DIV_PREFIX = "answer_";
    const PREV_BUTTON_ID = "prevButton";
    const NEXT_BUTTON_ID = "nextButton";
    const NUM_OF_QUESTIONS = 6;

    const QUESTIONS_DIV_ID = "normalQuestions";
    const FINALFUED_DIV_ID = "finalFued";

    const FF_QUESTION_DIV = "ff_question_div";
    const FF_ANSWER_DIV = "ff_answer_div";
  
    /*------------------------------------------------------------------------
     *              PRIVATE VARIABLES
     */
    let questions;
    let game;
    let questionsLoaded = false;
    let current_question = 0;
    let ff;
    let pointValues;
    let ff_question = 0;
    let points = [];
    let outstanding_points  = 19;
    

  
    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */



    let addPoints;
    let addFFPoints;
    let calcPoints;
    let createPoints;
    let getRandomInt;
    let init;  
    let loadGames;
    let loadPoints;
    let savePoints;
    let loadQuestions;
    let removeCover;
    let showQuestion;
    let sumFFPoints;
    let showOutstandingPoints;
    let switchQuestion;
    let switchFFQuestion;
    let showFFQuestion;
    let showFinalFued;
    let hideFinalFued;
    let sortNumbers;
    let resetAnswers;
    let toggleFFAnswer;
    let playSound;
    let toggleX;

    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    addPoints = function(team_num){
        document.getElementById(TEAM_SCORE_PREFIX+team_num).value = parseInt(document.getElementById(TEAM_SCORE_PREFIX+team_num).value) + parseInt(outstanding_points);
        outstanding_points = 0;
        showOutstandingPoints();
        savePoints;
    }

    addFFPoints = function(){
        document.getElementById(TEAM_SCORE_PREFIX+1).value = parseInt( document.getElementById(TEAM_SCORE_PREFIX+1).value) + parseInt( document.getElementById("ff_points_" + 1).value)
        document.getElementById(TEAM_SCORE_PREFIX+2).value = parseInt( document.getElementById(TEAM_SCORE_PREFIX+2).value) + parseInt( document.getElementById("ff_points_" + 2).value)

        document.getElementById("ff_points_" + 1).value = 0;
        document.getElementById("ff_points_" + 2).value = 0;
    }

    calcPoints = function(){
        outstanding_points = 0;
        for(let i = 1;i<NUM_OF_QUESTIONS +1;i++){
            let answer = document.getElementById(ANSWER_DIV_PREFIX + i)
            if(answer.querySelector('.answer_cover').classList.contains('coverOff')){
                outstanding_points += parseInt(answer.querySelector('.answer_points').innerHTML);
            }
        }
        showOutstandingPoints();
    }

    createPoints = () => {
        points.length = 0;
        let points_left = 100;
        for(let i = 0;i<NUM_OF_QUESTIONS;i++){
            let x;
            console.log(i)
            if(i == 0){
                x = getRandomInt(40);
                if(x < 25 || x > 45){
                    x = 30 + getRandomInt(17);
                }
                points_left = points_left - x;
            }
            else if(i == 1){
                x = getRandomInt(33);
                points_left = points_left - x;
            }
            else if(i == 2){
                x = getRandomInt(28);
                points_left = points_left - x;
            }
            else if(i == NUM_OF_QUESTIONS){
                x = Math.abs(points_left);
                if(x <= 0){
                    x = 1;
                }
            }
            else{
                x = getRandomInt(points_left - 6)
                points_left = points_left - x;
                if(x < 0){
                    x = 12 - (i + 1);
                }
            }
            console.log(x)
            points.push(x)
            
        }
        points.sort(function(a, b){return b - a});
        if(points[NUM_OF_QUESTIONS - 2] <= points[NUM_OF_QUESTIONS-1] && points[NUM_OF_QUESTIONS-1] > 1){
            points[NUM_OF_QUESTIONS - 2] += 1
            points[NUM_OF_QUESTIONS - 1] -= 1
        }else if (points[NUM_OF_QUESTIONS-1] == 0){
            points[NUM_OF_QUESTIONS - 2] += 1
            points[NUM_OF_QUESTIONS - 1] += 1
            if(points[NUM_OF_QUESTIONS - 3] < points[NUM_OF_QUESTIONS - 2]){
                points[NUM_OF_QUESTIONS - 3] += 1
            }
            if(points[NUM_OF_QUESTIONS - 4] < points[NUM_OF_QUESTIONS - 3]){
                points[NUM_OF_QUESTIONS - 4] += 1
            }
            if(points[NUM_OF_QUESTIONS - 5] < points[NUM_OF_QUESTIONS - 4]){
                points[NUM_OF_QUESTIONS - 5] += 1
            }
            if(points[NUM_OF_QUESTIONS - 6] < points[NUM_OF_QUESTIONS - 5]){
                points[NUM_OF_QUESTIONS - 6] += 1
            }
        }
    }



    getRandomInt = function(max) {
        return Math.floor(Math.random() * Math.floor(max) + 6);
    }
  
    init = function(onInitializedCallback) {
        console.log("Started Games init...");
        window.scrollTo(0,0)
        loadGames();
        loadPoints();
    };

    loadGames = function(){
        game = JSON.parse(localStorage.getItem("currentGame"))
        loadQuestions();
    }

    loadPoints = function(){
        console.log(localStorage.getItem("pointValues"));
        if(localStorage.getItem("pointValues") != null){
            pointValues = JSON.parse(localStorage.getItem("pointValues"));
            document.getElementById('team_score_1').value = parseInt(pointValues.team_1_score)
            document.getElementById('team_1_name').value= pointValues.team_1_name
            document.getElementById('team_score_2').value = parseInt(pointValues.team_2_score)
            document.getElementById('team_2_name').value = pointValues.team_2_name
        }
        else{
            savePoints();
        }
    }

    loadQuestions = function(){
        let url = QUESTIONS_URL_PREFIX + game.json_name + ".json"
        Global.ajax(url, function(data) {
            questions = data;
            questions.unshift(STARTING_QUESTION)
            questionsLoaded = true;
            ff = questions.pop().questions;
            console.log(ff)
            questions = questions.splice(0,questions.length)
            console.log(questions)
            showQuestion();
            })

    }

    playSound = function(sound){
        switch(sound){
            case "right":
                document.getElementById('rightAudio').play()
                break;
            case "wrong":
                document.getElementById('wrongAudio').play()
                break;
        }
    }
    removeCover = function(cover){
        let answer = cover.parentElement.children[1];
        cover.classList.add('coverOff');
        setTimeout(function(){answer.classList.remove('answerOff')},FLIP_DURATION);
        calcPoints();
        playSound("right");
    }

    resetAnswers = function(){
        document.getElementById(QUESTION_DIV_ID).innerHTML = '    &nbsp;'
        for(let i = 1;i<NUM_OF_QUESTIONS +1;i++){
            let answer = document.getElementById(ANSWER_DIV_PREFIX + i);
            answer.querySelector('.answer').classList.add('answerOff');
            setTimeout(function(){answer.querySelector('.answer_cover').classList.remove('coverOff');},FLIP_DURATION)
        }
        toggleX(true);
        outstanding_points = 0;
        showOutstandingPoints();
    }

    showQuestion = function(){
        resetAnswers();
        createPoints();
        let question = questions[current_question];
        document.getElementById(QUESTION_DIV_ID).innerHTML =  question.question_text;
        for(let i = 1;i<NUM_OF_QUESTIONS +1;i++){
            document.getElementById(ANSWER_DIV_PREFIX + i).querySelector('.answer_text').innerHTML = question['answer_'+i]
            document.getElementById(ANSWER_DIV_PREFIX + i).querySelector('.answer_points').innerHTML = points[i-1]
        }
    }

    hideFinalFued = function(){
        console.log("HIDING")
        document.getElementById(QUESTIONS_DIV_ID).classList.remove("noShow");
        document.getElementById(FINALFUED_DIV_ID).classList.add("noShow");
        document.getElementById("mainButtons").classList.remove("noShow")
    }

    savePoints = function(){
        let pointValues = {
            'team_1_score':parseInt(document.getElementById('team_score_1').value),
            'team_1_name':document.getElementById('team_1_name').value,
            'team_2_score':parseInt(document.getElementById('team_score_2').value),
            'team_2_name':document.getElementById('team_2_name').value,
        }
        localStorage.setItem("pointValues",JSON.stringify(pointValues))
    }

    showFinalFued = function(){
        document.getElementById(QUESTIONS_DIV_ID).classList.add("noShow");
        document.getElementById(FINALFUED_DIV_ID).classList.remove("noShow");
        document.getElementById("mainButtons").classList.add("noShow")
    }
    
    showOutstandingPoints = function(){
        document.getElementById(OUTSTANDING_POINTS_ID).innerHTML = outstanding_points
    }

    showFFQuestion = function(){
        console.log(ff);
        document.getElementById(FF_QUESTION_DIV).innerHTML = ff[ff_question].question;
        document.getElementById(FF_ANSWER_DIV).innerHTML = ff[ff_question].answers;
    }

    sumFFPoints = function(team_id){
        let points_to_sum = document.getElementsByClassName('ff_answer_points_' + team_id);
        let sum = 0;
        for(let i = 0;i < points_to_sum.length;i++){
            sum = sum + parseInt(points_to_sum[i].value);
        }
        document.getElementById('ff_points_' + team_id).value = sum;
    }

    switchQuestion = function(isForward){
        
        let prevButton = document.getElementById(PREV_BUTTON_ID);
        let nextButton = document.getElementById(NEXT_BUTTON_ID);      

        if(isForward){
            if(nextButton.classList.contains('inactive')){
                return;
            }
            current_question = current_question + 1;
        }
        else{
            if(prevButton.classList.contains('inactive')){
                return;
            }
            current_question = current_question - 1;
        }

        if(current_question == 0){
            prevButton.classList.add('inactive');
        }
        else{
            if(current_question == questions.length && isForward){
                    showFinalFued();
                    return;
            }
            else if(current_question == questions.length && !isForward){
                hideFinalFued();
                switchQuestion(false);
                return;
            }
            prevButton.classList.remove('inactive');
            if(current_question == questions.length){
                nextButton.classList.add('inactive');
            }else if (current_question == questions.length -1){
                nextButton.classList.remove('icon');
                nextButton.classList.remove('inactive');
                nextButton.innerHTML = "FF";
            }
            else{
                nextButton.classList.add('icon')
                nextButton.innerHTML = "!";
                nextButton.classList.remove('inactive');
            }
        }
        console.log(current_question);
        showQuestion()
    }
  
    switchFFQuestion = function(isForward){
        if(isForward){
            if(ff_question == 4){
                ff_question = 0;
            }
            else{
                ff_question += 1;
            }
        }
        else{
            if(ff_question == 0){
                ff_question = 4;
            }
            else{
                ff_question -= 1;
            }
        }
        console.log(ff_question);
        showFFQuestion()
    }

    toggleFFAnswer = function(){
        let answer_div = document.getElementById(FF_ANSWER_DIV);
        if(answer_div.classList.contains("ffNoShow")){
            answer_div.classList.remove("ffNoShow");
        }else{
            answer_div.classList.add("ffNoShow");
        }
    }

    toggleX = function(clearAll=false){
        let exes = document.getElementById("xDiv").children;

        for (let index = 0; index < exes.length; index++) {
            const element = exes[index];
            if(clearAll){
                element.classList.add("inactiveX");
            }else{
                if(element.classList.contains("inactiveX")){
                    element.classList.remove("inactiveX");
                    playSound("wrong")
                    return;
                }
            }

        }
    }
    /*------------------------------------------------------------------------
     *              PUBLIC METHODS
     */
    return {
        addPoints,
        addFFPoints,
        init,
        removeCover,
        switchQuestion,
        sumFFPoints,
        switchFFQuestion,
        showFFQuestion,
        toggleFFAnswer,
        savePoints,
        toggleX,
        resetAnswers,
    };
  }());
  