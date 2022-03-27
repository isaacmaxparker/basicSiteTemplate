/*property

*/


const Milli = (function () {
    "use strict";

    /*------------------------------------------------------------------------
     *              CONSTANTS
     */
    const QUESTIONS_URL_PREFIX = 'https://raw.githubusercontent.com/isaacmcdgl/JSON/main/Games/Millionare/'
    const FIRST_QUESTION = {
        "question_text": "Press Next to start the game",
        "answers": {
            "answer_1": "",
            "answer_2": "",
            "answer_3": "",
            "answer_4": "",
            "right_answer": null
        }
    }
    const DEMO_QUESTION = {
        "question_text":"This is a demo question",
        "answers":{
            "answer_1":"First Answer",
            "answer_2":"Second Answer",
            "answer_3":"Third Answer",
            "answer_4":"Fourth Answer",
            "right_answer":1
        }
    };
    const LAST_QUESTION = {
        "question_text": "All out of questions for this game",
        "answers": {
            "answer_1": "",
            "answer_2": "",
            "answer_3": "",
            "answer_4": "",
            "right_answer": null
        }
    }

    const ANSWER_DIV_CLASS = "answerDiv";
    const QUESTION_DIV_ID = "questions_div";
    const ANSWER_TEXT_CLASS = "answerText";
    const SCORE_CLASS = "playerScore";
    const MAX_VAL = 5;

    const PLAYERS_TO_REMOVE = [
        [10,9,8,7,5,4,3,2],
        [10,9,8,7,5,4,3],
        [10,9,8,5,4,3],
        [10,9,8,4,3],
        [10,9,4,3],
        [10,9,3],
        [10,3],
        [10],
    ]

    const LEFT_SLIDE = "leftSliderContainer";
    const RIGHT_SLIDE = "rightSliderContainer";
    const TIME_COUNT = 15;
    /*------------------------------------------------------------------------
     *              PRIVATE VARIABLES
     */
    let questionsLoaded = false;
    let currentQuestionID = 0;
    let game;
    let questions;
    let timerRunning = false;
    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */
    
    let clearAnswers;
    let loadPlayers;
    let init;
    let loadGames;
    let loadQuestions;
    let playSound;
    let movePlayer;
    let switchQuestion;
    let showQuestion;
    let showCorrectAnswer;
    let updateScore;
    let startTimer;
    let shuffle;

    let runTimer;
    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    clearAnswers = function () {
        document.getElementById(QUESTION_DIV_ID).innerHTML = "";
        let answerDivs = document.getElementsByClassName(ANSWER_DIV_CLASS);
        for (let i = 0; i < answerDivs.length; i++) {
            answerDivs[i].querySelector("." + ANSWER_TEXT_CLASS).innerHTML = "";
            console.log(answerDivs[i])
            answerDivs[i].classList.remove("wrongAnswer");
            answerDivs[i].classList.remove("rightAnswer");
        }

    }

    init = function (onInitializedCallback) {
        console.log("Started Milli init...");
        window.scrollTo(0, 0)
        loadGames();
       // loadPlayers(9);
    };

    loadGames = function () {
        game = JSON.parse(localStorage.getItem("currentGame"))
        loadQuestions();
    }

    loadQuestions = function () {
        let url = QUESTIONS_URL_PREFIX + game.json_name + ".json"
        Global.ajax(url, function (data) {
            questions = shuffle(data);
            questions.unshift(DEMO_QUESTION)
            questions.unshift(FIRST_QUESTION)

            questions.push(LAST_QUESTION)
            questionsLoaded = true;
            console.log(questions)
            showQuestion();
        })

    }

    shuffle = function(array) {
        let currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
      }
      

    loadPlayers = function(num_of_players){
        document.getElementById('loadScreen').classList.add('hidden');
        if(num_of_players == 10){
            return;
        }
        let players_to_remove = PLAYERS_TO_REMOVE[num_of_players - 2];
        console.log(num_of_players)
        console.log(players_to_remove)
        console.log(players_to_remove);

        players_to_remove.forEach(element => {
            document.getElementById('player_'+element).remove();
        });

        /* Resizing */ 
        let left = document.getElementById(LEFT_SLIDE);
        let left_class = "col-" + left.children.length;
        for(let i = 0;i<left.children.length;i++){
            left.children[i].classList.add(left_class)
        }

        let right = document.getElementById(RIGHT_SLIDE);
        let right_class = "col-" + right.children.length;
        for(let i = 0;i<right.children.length;i++){
            right.children[i].classList.add(right_class)
        }
        left.classList.remove('hidden');
        right.classList.remove('hidden');
    }

    movePlayer = function(type, player){
        let slider = player.querySelector(".mySlider");
        if(type == "up"){
            slider.value = slider.value - 1
        }
        else if(type == "reset"){
            slider.value = MAX_VAL;
        }
        updateScore(player);
    }

    playSound = function (sound) {
        switch (sound) {
            case "right":
                document.getElementById('rightAudio').play()
                break;
            case "wrong":
                document.getElementById('wrongAudio').play()
                break;
            case "winner":
                document.getElementById('winnerAudio').play()
                break;
            case "reset":
                document.getElementById('wrongAudio').play()
                break;
            case "money":
                document.getElementById('moneyAudio').play()
                break;
        }
    }

    switchQuestion = function (isForward) {
        if (isForward) {
            if (currentQuestionID == questions.length - 1) {
                return;
            }
            currentQuestionID += 1;
        }
        else {
            if (currentQuestionID == 0) {
                return
            }
            currentQuestionID -= 1;
        }

        if (currentQuestionID == 0) {
            document.getElementById('answers').classList.add('invisible');
            document.getElementById('timerDiv').classList.add('invisible');
            startTimer(false)
            document.getElementById("prevButton").classList.add('inactive');
            document.getElementById("nextButton").classList.remove('inactive');
        }
        else if (currentQuestionID == questions.length - 1) {
            document.getElementById('answers').classList.add('invisible');
            document.getElementById('timerDiv').classList.add('invisible');
            startTimer(false)
            document.getElementById("prevButton").classList.remove('inactive');
            document.getElementById("nextButton").classList.add('inactive');
        }
        else {
            document.getElementById('answers').classList.remove('invisible');
            document.getElementById('timerDiv').classList.remove('invisible');
            document.getElementById("nextButton").classList.remove('inactive');
            document.getElementById("prevButton").classList.remove('inactive')
        }


        showQuestion();
    }

    showQuestion = function () {
        clearAnswers()
        let question = questions[currentQuestionID];
        document.getElementById(QUESTION_DIV_ID).innerHTML = question.question_text;
        let answerDivs = document.getElementsByClassName(ANSWER_TEXT_CLASS);
        for (let i = 0; i < 4; i++) {
            answerDivs[i].innerHTML = question.answers['answer_' + (i + 1)]
            if (i + 1 == question.answers.right_answer) {
                answerDivs[i].parentElement.setAttribute('data-correct', true)
            }
            else {
                answerDivs[i].parentElement.setAttribute('data-correct', false)
            }

        }
    }

    showCorrectAnswer = function (sender_id) {
        startTimer(false)
        let question = questions[currentQuestionID];
        let answerDivs = document.getElementsByClassName(ANSWER_DIV_CLASS);
        if (sender_id == question.answers.right_answer) {
            playSound("right")
        }
        else {
            playSound("wrong")
        }

        for (let i = 0; i < answerDivs.length; i++) {
            if ((parseInt(question.answers.right_answer) - 1) == i) {
                answerDivs[i].classList.add("rightAnswer")
            }
            else {
                answerDivs[i].classList.add("wrongAnswer")
            }
        }
    }

    startTimer = function(direction){
        let timer = document.getElementById('timer');
        timer.innerHTML = TIME_COUNT;
        timerRunning = false;
        if(direction){
            setTimeout(function(){timerRunning = true;},999);
            setTimeout(function(){runTimer(timer)},1000);
        }
        else{
            timerRunning = false;
            setTimeout(function(){timer.innerHTML = TIME_COUNT;},1000)
        }
        
    }

    runTimer = function(timer){
        if(timerRunning){
            if(timer.innerHTML == 1){
                timer.innerHTML = parseInt(timer.innerHTML) - 1;
                playSound('wrong')
                return
            }
            timer.innerHTML = parseInt(timer.innerHTML) - 1
            setTimeout(function(){runTimer(timer)},1000)
        }
    }

    updateScore = function (slider) {
        let newVal;
        let sliderVal = slider.querySelector(".mySlider").value;
        let message = document.getElementById('Message Board')
        switch (parseInt(sliderVal)) {
            case 5:
                playSound("reset")
                newVal = "$0";
                break;
            case 4:
                playSound("money");
                newVal = "$100";
                break;
            case 3:
                playSound("money");
                newVal = "$1000";
                break;
            case 2:
                playSound("money");
                newVal = "$10,000";
                break;
            case 1:
                playSound("money");
                newVal = "$100,000";
                break;
            case 0:
                newVal = "$1M";
                playSound("winner");
                let msg = document.getElementById('messageDiv');
                msg.querySelector('.messageTitle').innerHTML = slider.querySelector('.playerName').value
                setTimeout(function(){msg.classList.remove('hidden');},200);
                break;
        }
        slider.querySelector("." + SCORE_CLASS).innerHTML = newVal;
    }

    /*------------------------------------------------------------------------
     *              PUBLIC METHODS
     */
    return {
        init,
        switchQuestion,
        clearAnswers,
        showCorrectAnswer,
        updateScore,
        movePlayer,
        startTimer,
        loadPlayers,
    };
}());
