/*property

*/


const Price = (function () {
    "use strict";

    /*------------------------------------------------------------------------
     *              CONSTANTS
     */

    const PRICE_JSON_PREFIX = "https://raw.githubusercontent.com/isaacmaxparker/JSON/main/Games/Price/";

    const ROW_CAP = 4;
    const TEAMS_TO_REMOVE = [
        [4, 3],
        [4],
    ]

    const BID_ITEM_IMAGE_ID = "bid_item_image";
    const BID_ITEM_PRICE_ID = "bid_item_price";
    const BID_ITEM_NAME_ID = "bid_item_name";
    
    const GIFT_SCREEN_DIV = "items_round";

    const QUESTION_TEXT_ID = "question_text";
    const MATCHING_ANSWER_DIV = "matching_content";
    const SORTING_ANSWER_DIV = "sorting_content";
    const IMAGEMC_ANSWER_DIV = "imagemc_content";
    const AUDIOMC_ANSWER_DIV = "audiomc_content";

    /*--------------------------------x----------------------------------------
     *              PRIVATE VARIABLES
     */
    let num_of_teams;
    let bid_item_price = 50;

    let winnning_id;
    let game;
    let order;

    let month;

    let current_question;

    let opened_boxes = [];

    let items = [];


    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    let playSound;
    let playSoundEffect;
    let stopSound;
    
    let clearSavedData;
    let checkAnswer;
    let decodeBoxColor;
    let cleanScreens;
    let init;
    let loadGiftsScreen;
    let loadPlayers;
    let loadQuestion;
    let loadInfo;
    let showScreen;
    let showPrice;
    let shuffle;
    let setUpTheme;
    let respawnImages;

    let loadSavedData;
    let saveData;


    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    checkAnswer = (sender) => {
        if (document.getElementById(QUESTION_TEXT_ID).classList.contains('wrong-answer') || document.getElementById(QUESTION_TEXT_ID).classList.contains('right-answer')) {
            showScreen('items')
            return;
        }

        let correct = true;
        if (current_question.question_type == 'matching') {
            let answers = document.getElementsByClassName('matching_answer');
            for (let i = 0; i < answers.length; i++) {
                let answer = answers[i];
                console.log("ANSWER: " + answer.getAttribute('data-iscorrect') + " - VALUE: " + !answer.classList.contains('off_answer'))
                console.log((answer.getAttribute('data-iscorrect') && answer.classList.contains('off_answer')))
                console.log((!answer.getAttribute('data-iscorrect') && !answer.classList.contains('off_answer')))

                let bool = answer.getAttribute('data-iscorrect') == 'true';

                if ((bool && answer.classList.contains('off_answer')) || (!bool && !answer.classList.contains('off_answer'))) {
                    if (answer.classList.contains('off_answer')) {
                        answer.classList.add("wrong-answer-answer")
                    } else {
                        answer.classList.add("wrong-answer-answer-on")
                    }

                    correct = false;
                }
            }
        }else if (current_question.question_type == 'sorting'){
            let boxes = document.getElementsByClassName('check_sort_box');
            for(let i = 0; i < boxes.length; i++){
                if(boxes[i].getAttribute('data-name') != boxes[i].children[0].getAttribute('data-name')){
                    correct = false;
                    boxes[i].classList.add("wrong-sort-answer");
                }
            }
        }else if (current_question.question_type == 'imagemc'){
            if(sender.getAttribute('data-iscorrect') == 'true'){
                correct = true;
                sender.classList.add('right-answer')
            }else{
               correct = false;
               let divs =  document.getElementsByClassName("image_mc_answer");
               for(let i = 0; i < divs.length; i++){
                   if(divs[i].getAttribute('data-iscorrect') == 'true'){
                        divs[i].classList.add('right-answer-answer-on');
                   }else{
                        divs[i].classList.add("wrong-answer-answer-on")
                   }
               }
            }
        }else if (current_question.question_type == 'audiomc'){
            if(sender.getAttribute('data-iscorrect') == 'true'){
                correct = true;
                sender.classList.add('right-answer')
            }else{
               correct = false;
               let divs =  document.getElementsByClassName("audio_mc_answer");
               for(let i = 0; i < divs.length; i++){
                   if(divs[i].getAttribute('data-iscorrect') == 'true'){
                        divs[i].classList.add('right-answer-answer-on');
                   }else{
                        divs[i].classList.add("wrong-answer-answer-on")
                   }
               }
            }
        }

        if (correct) {
            document.getElementById(QUESTION_TEXT_ID).classList.add("right-answer");
            playSoundEffect("right");
        } else {
            document.getElementById(QUESTION_TEXT_ID).classList.add("wrong-answer");
            playSoundEffect("wrong")
        }

        let bid = parseInt(document.getElementById(`team_${winnning_id}_q_bid`).value)

        let current_val = parseInt(document.getElementById('team_' + winnning_id + "_price_points").value);
        if (document.getElementById('team_' + winnning_id + "_price_points").parentElement.classList.contains('negative')) {
            current_val = current_val * -1;
        }

        let newval = 0;
        if (correct) {
            newval = current_val + bid;
        } else {
            newval = current_val - bid;
        }

        if (newval < 0) {
            document.getElementById('team_' + winnning_id + "_price_points").parentElement.classList.add('negative')
            newval = newval * -1;
        }
        else {
            document.getElementById('team_' + winnning_id + "_price_points").parentElement.classList.remove('negative');
        }

        document.getElementById('team_' + winnning_id + "_price_points").value = newval;

    }

    cleanScreens = (screenName) => {
        document.getElementById(BID_ITEM_PRICE_ID).classList.add('invisible')
        let bids = document.getElementsByClassName('team_bid_input')
        document.getElementById(QUESTION_TEXT_ID).classList.remove("wrong-answer")
        document.getElementById(QUESTION_TEXT_ID).classList.remove("right-answer")

        for (let i = 1; i <= bids.length; i++) {
            bids[i - 1].parentElement.parentElement.classList.remove('wrong-bid')
            bids[i - 1].parentElement.parentElement.classList.remove('wrong-bid')
            bids[i - 1].parentElement.parentElement.classList.remove('right-bid')
            bids[i - 1].parentElement.parentElement.classList.remove('warning-bid')
        }

        let boxes = document.getElementsByClassName('items_image');

        for (let i = 0; i < boxes.length; i++) {
            if (opened_boxes.includes(i + 1)) {
                boxes[i].parentElement.classList.add('off_gift')
            }
        }

        let bbids = document.getElementsByClassName('team_bid_input');

        for (let i = 0; i < bbids.length; i++) {
            bbids[i].value = '';
        }

        let qbids = document.getElementsByClassName('team_qbid_input');

        for (let i = 0; i < qbids.length; i++) {
            qbids[i].value = 10;
        }

        if (screenName == 'question') {
            let bids = document.getElementsByClassName('question_bid');
            for (let i = 1; i <= bids.length; i++) {
                let max = 50;
                if(parseInt(document.getElementById('team_' + i + "_price_points").value) > 0){
                    max = parseInt(document.getElementById('team_' + i + "_price_points").value) + 10;
                }
               
                bids[i - 1].children[0].children[0].setAttribute('max', max)
                if (i == winnning_id) {
                    bids[i - 1].classList.remove('invisible');
                } else {
                    bids[i - 1].classList.add('invisible');
                }
            }
        }else{
            document.getElementById('question_cover').classList.remove('turnedCover')
        }
    }

    clearSavedData = () => {
        document.getElementById('loadDataScreen').classList.add('hidden');
        document.getElementById('loadScreen').classList.remove('hidden');
    }

    decodeBoxColor = (number, month) => {

        switch (number % 6) {
            case 0:
                if (month == 10)
                    return 'orange'
                return "teal";
            case 1:
                if (month == 10)
                    return 'yellow'
                return "red";
            case 2:
                if (month == 10)
                    return 'red'
                return "yellow";
            case 3:
                if (month == 10)
                    return 'orange'
                return "green";
            case 4:
                if (month == 10)
                     return 'green'
                return "orange";        
            default:
                if (month == 10)
                     return 'red'
                return "pink";
        }
    }

    init = function (onInitializedCallback) {

        setUpTheme();
        let savedData = Global.getValue('savedPriceData');;
        if(savedData == 'true'){
            document.getElementById('loadDataScreen').classList.remove('hidden');
        }
        else{
            document.getElementById('loadScreen').classList.remove('hidden');
        }
        game = JSON.parse(localStorage.getItem("currentGame"))
        console.log("Started global init...");
        window.scrollTo(0, 0)
        loadInfo()
    };

    loadInfo = function () {
        let url = PRICE_JSON_PREFIX + game.json_name + ".json"
        console.log(url)
        Global.ajax(url, function (data) {
            console.log(data)
            items = data;
            loadGiftsScreen();
        })

    }

    loadGiftsScreen = () => {

        let row1HTML = '<div class="items_row">';
        let row2HTML = '<div class="items_row offset">';
        let row3HTML = '<div class="items_row">';
        let i = 1;


        items.forEach(element => {

            if (i <= ROW_CAP) {
                row1HTML += `<div class="items_image_div">
                                <div class="items_image_num">${i}</div>
                                <img class="items_image" src="../images/logos/price/${decodeBoxColor(i, month)}_box.png" onclick="loadQuestion(${i})">
                            </div>`;
            } else if (i <= ROW_CAP * 2) {
                row2HTML += `<div class="items_image_div">
                                <div class="items_image_num">${i}</div>
                                <img class="items_image" src="../images/logos/price/${decodeBoxColor(i, month)}_box.png" onclick="loadQuestion(${i})">
                            </div>`;
            } else {
                row3HTML += `<div class="items_image_div">
                                <div class="items_image_num">${i}</div>
                                <img class="items_image" src="../images/logos/price/${decodeBoxColor(i, month)}_box.png" onclick="loadQuestion(${i})">
                            </div>`;
            }

            i++;
        });
        row1HTML += '</div>';
        row2HTML += '</div>';
        row3HTML += '</div>';


        document.getElementById(GIFT_SCREEN_DIV).innerHTML = row1HTML + row2HTML + row3HTML;
    }

    loadPlayers = function (num_of_players) {

        saveData('price_num_of_teams', num_of_players);
        num_of_teams = num_of_players;
        setUpTheme();
        document.getElementById('loadScreen').classList.add('hidden');
        document.getElementById('loadDataScreen').classList.add('hidden');
        if (num_of_players == 4) {
            document.getElementById('loadScreen').style.display = "none";
        } else {

            let players_to_remove = TEAMS_TO_REMOVE[num_of_players - 2];
            console.log(num_of_players)
            console.log(players_to_remove)
            console.log(players_to_remove);

            players_to_remove.forEach(element => {
                document.getElementById('team_' + element).remove();
                document.getElementById('team_' + element + '_bid').remove();
                document.getElementById('team_' + element + '_bid_q').remove();
            });

            document.getElementById('loadScreen').style.display = "none";
        }

        setTimeout(function () {
            document.getElementById('teams_list').classList.remove('invisible')
            document.getElementById('instructions_round').classList.remove('invisible')
        }, 250)
    }

    loadQuestion = (question_id) => {

        current_question = items[question_id - 1];
        console.log(typeof(opened_boxes))

        console.log(opened_boxes);
        opened_boxes.push(question_id);
        Global.setValue('price_opened_boxes',JSON.stringify(opened_boxes));
        //LOAD BIDS
        let element = items[question_id - 1]
        document.getElementById(BID_ITEM_IMAGE_ID).setAttribute('src', element.bid_image_url);
        document.getElementById(BID_ITEM_PRICE_ID).innerHTML = '$' + element.bid_item_price;
        document.getElementById(BID_ITEM_NAME_ID).innerHTML = element.bid_item_name ? element.bid_item_name : '' ;

        bid_item_price = element.bid_item_price;

        //LOAD QUESTIONS
        document.getElementById(QUESTION_TEXT_ID).innerHTML = element.question.text;


        document.getElementById(MATCHING_ANSWER_DIV).classList.add('hidden');
        document.getElementById(SORTING_ANSWER_DIV).classList.add('hidden');
        document.getElementById(IMAGEMC_ANSWER_DIV).classList.add('hidden');
        document.getElementById(AUDIOMC_ANSWER_DIV).classList.add('hidden');

        if (element.question_type == 'matching') {
            document.getElementById(MATCHING_ANSWER_DIV).classList.remove('hidden');
            let i = 0;
            let html = `<div class="matching_row">`;

            element.question.options.forEach(el => {
                if (i % element.question.options_split == 0) {
                    html += '</div><div class="matching_row">'
                }

                html += `<div class="matching_answer" onclick="toggleClass(this,'off_answer')" data-iscorrect="${el.is_correct}" >${el.option_text}</div>`

                i++;
            });
            html += '</div>';

            document.getElementById(MATCHING_ANSWER_DIV).innerHTML = html;
        } else if (element.question_type == 'sorting') {
            document.getElementById(SORTING_ANSWER_DIV).classList.remove('hidden');

            order = shuffle([0,1,2,3]);
            let html = `
                <div id="origin" class="origin">
                    <div class="origin_row">
                        <div class="origin_box" ondrop="drop(event)" ondragover="allowDrop(event)"><img id="dragimage1" data-name="${element.question.options[order[0]].option_label}" src="${element.question.options[order[0]].option_image}" draggable="true" ondragstart="drag(event)"  ondrop="imgdrop(event)"></div>
                        <div class="origin_box" ondrop="drop(event)" ondragover="allowDrop(event)"><img id="dragimage2" data-name="${element.question.options[order[1]].option_label}"src="${element.question.options[order[1]].option_image}" draggable="true" ondragstart="drag(event)"  ondrop="imgdrop(event)"></div>
                    </div>
                    <div class="origin_row">
                        <div class="origin_box" ondrop="drop(event)" ondragover="allowDrop(event)"><img id="dragimage3" data-name="${element.question.options[order[2]].option_label}"src="${element.question.options[order[2]].option_image}" draggable="true" ondragstart="drag(event)"  ondrop="imgdrop(event)"></div>
                        <div class="origin_box" ondrop="drop(event)" ondragover="allowDrop(event)"><img id="dragimage4" data-name="${element.question.options[order[3]].option_label}"src="${element.question.options[order[3]].option_image}" draggable="true" ondragstart="drag(event)"  ondrop="imgdrop(event)"></div>
                    </div>
                </div>
                <div>
                <img src="../images/logos/price/arrow.png" style="height:40vh"/>
                </div>
                <div class="destination">
                    <div class="origin">
                        <div class="origin_row">
                            <div class="destination_box"><div class="origin_box check_sort_box" data-name="${element.question.options[0].option_label}" ondrop="drop(event)" ondragover="allowDrop(event)" ondragstart='this.innerHTML=""'></div><p class="destination_label">${element.question.options[0].option_label}</p></div>
                            <div class="destination_box"><div class="origin_box check_sort_box" data-name="${element.question.options[1].option_label}" ondrop="drop(event)" ondragover="allowDrop(event)" ondragstart='this.innerHTML=""'></div><p class="destination_label">${element.question.options[1].option_label}</p></div>
                        </div>
                        <div class="origin_row">
                            <div class="destination_box"><div class="origin_box check_sort_box" data-name="${element.question.options[2].option_label}" ondrop="drop(event)" ondragover="allowDrop(event)" ondragstart='this.innerHTML=""'></div><p class="destination_label">${element.question.options[2].option_label}</p></div>
                            <div class="destination_box"><div class="origin_box check_sort_box" data-name="${element.question.options[3].option_label}" ondrop="drop(event)" ondragover="allowDrop(event)" ondragstart='this.innerHTML=""'></div><p class="destination_label">${element.question.options[3].option_label}</p></div>
                        </div>

                    </div>
                </div>`

        document.getElementById(SORTING_ANSWER_DIV).innerHTML = html;
        } else if (element.question_type == 'imagemc') {
            document.getElementById(IMAGEMC_ANSWER_DIV).classList.remove('hidden');
            document.getElementById(IMAGEMC_ANSWER_DIV).innerHTML = 
            `<div class="leftImg">
                <img src="${element.question.image}">
            </div>
            <div class="image_mc_answers">
                <div class="image_mc_answer" data-iscorrect="${element.question.options[0].is_correct}" onclick="checkAnswer(this)">${element.question.options[0].answer_label}</div>
                <div class="image_mc_answer" data-iscorrect="${element.question.options[1].is_correct}" onclick="checkAnswer(this)">${element.question.options[1].answer_label}</div>
                <div class="image_mc_answer" data-iscorrect="${element.question.options[2].is_correct}"  onclick="checkAnswer(this)">${element.question.options[2].answer_label}</div>
                <div class="image_mc_answer" data-iscorrect="${element.question.options[3].is_correct}" onclick="checkAnswer(this)">${element.question.options[3].answer_label}</div>
            </div>`
        } else if (element.question_type == 'audiomc') {
            document.getElementById(AUDIOMC_ANSWER_DIV).classList.remove('hidden');
            document.getElementById(AUDIOMC_ANSWER_DIV).innerHTML = 
            `<div class="leftImg">
                <img src="${element.question.image}" onclick="playSound(${element.question.audio})">
                <div style="display:none">
                    <audio id="${element.question.audio}" controls>
                        <source src="../audios/price/${element.question.audio}.mp3" type="audio/mpeg">
                    </audio>
                </div>
            </div>
            <div class="image_mc_answers">
                <div class="audio_mc_answer" data-iscorrect="${element.question.options[0].is_correct}" onclick="checkAnswer(this)">${element.question.options[0].answer_label}</div>
                <div class="audio_mc_answer" data-iscorrect="${element.question.options[1].is_correct}" onclick="checkAnswer(this)">${element.question.options[1].answer_label}</div>
                <div class="audio_mc_answer" data-iscorrect="${element.question.options[2].is_correct}"  onclick="checkAnswer(this)">${element.question.options[2].answer_label}</div>
                <div class="audio_mc_answer" data-iscorrect="${element.question.options[3].is_correct}" onclick="checkAnswer(this)">${element.question.options[3].answer_label}</div>
            </div>`
        }
        showScreen('bid');
    }

    loadSavedData = () => {
        let num_of_players =  Global.getValue('price_num_of_teams');
        loadPlayers(num_of_players);
        //GET TEAM INFO
        for(let i = 1; i <= num_of_players; i++){
            document.getElementById('team_' + i + '_price_name').value = Global.getValue('team_' + i + '_price_name');
            document.getElementById('team_' + i + '_price_points').value = Global.getValue('team_' + i + '_price_points') ? Global.getValue('team_' + i + '_price_points') : 0;
        }

        opened_boxes = Global.getValue('price_opened_boxes') ? JSON.parse(Global.getValue('price_opened_boxes'))  : [] ;
    }

    respawnImages = function(){
        let html = `  <div class="origin_row">
        <div class="origin_box" ondrop="drop(event)" ondragover="allowDrop(event)"><img id="dragimage1" data-name="${current_question.question.options[order[0]].option_label}" src="${current_question.question.options[order[0]].option_image}" draggable="true" ondragstart="drag(event)"></div>
        <div class="origin_box" ondrop="drop(event)" ondragover="allowDrop(event)"><img id="dragimage2" data-name="${current_question.question.options[order[1]].option_label}"src="${current_question.question.options[order[1]].option_image}" draggable="true" ondragstart="drag(event)"></div>
    </div>
    <div class="origin_row">
        <div class="origin_box" ondrop="drop(event)" ondragover="allowDrop(event)"><img id="dragimage3" data-name="${current_question.question.options[order[2]].option_label}"src="${current_question.question.options[order[2]].option_image}" draggable="true" ondragstart="drag(event)"></div>
        <div class="origin_box" ondrop="drop(event)" ondragover="allowDrop(event)"><img id="dragimage4" data-name="${current_question.question.options[order[3]].option_label}"src="${current_question.question.options[order[3]].option_image}" draggable="true" ondragstart="drag(event)"></div>
    </div>`

    document.getElementById('origin').innerHTML = html;
    }

    playSound = (sound) => {
        sound.play()
    }

    playSoundEffect = function (sound) {
        switch (sound) {
            case "right":
                document.getElementById('rightAudio').play()
                setTimeout(function(){stopSound(document.getElementById('rightAudio'))},2000)
                break;
            case "wrong":
                document.getElementById('wrongAudio').play()
                setTimeout(function(){stopSound(document.getElementById('wrongAudio'))},2000)
                break;
            case "winner":
                document.getElementById('winnerAudio').play()
                setTimeout(function(){stopSound(document.getElementById('winnerAudio'))},2000)
                break;
            case "reset":
                document.getElementById('wrongAudio').play()
                setTimeout(function(){stopSound(document.getElementById('wrongAudio'))},2000)
                break;
            case "money":
                document.getElementById('moneyAudio').play()
                setTimeout(function(){stopSound(document.getElementById('moneyAudio'))},2000)
                break;
        }
    }

    setUpTheme = function(){
        
        let d = new Date(Date.now());
        month = d.getMonth() + 1;
        console.log(month);

        console.log(document.getElementById('team_' + 1));

        if(month == 10){
            document.getElementById('rainbowback').classList.add('hidden');
            document.getElementById('halloweenback').classList.remove('hidden');
            document.getElementById('loadScreen').classList.add('october_5');
            document.getElementById('loadDataScreen').classList.add('october_5');
            document.getElementById('instructions_round').classList.add('october_2');
            document.getElementById('question_div').classList.add('october_6');
            document.getElementById('items_round').classList.add('october_6');
            document.getElementById('question_cover').classList.add('october_7');
            document.getElementById('question_text').classList.add('october_7');

            for(let i = 1; i <= num_of_teams; i++){
                console.log( document.getElementById('team_' + i));
                    document.getElementById('team_' + i).classList.add('october_' + i);
                    console.log(document.getElementById('team_' + i + '_bid'))
                    document.getElementById('team_' + i + '_bid').classList.add('october_' + i);
                    document.getElementById('team_' + i + '_bid_q').classList.add('october_' + i);

            }
        }
    }

    stopSound = function(sound){
        sound.pause();
        sound.currentTime = 0;
    }

    shuffle = function(array) {
        var currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
      }

    showPrice = () => {


        let winner = '';
        let current_diff = bid_item_price;
        let bids = document.getElementsByClassName('team_bid_input')

        if (bids[0].parentElement.parentElement.classList.contains('right-bid') || bids[0].parentElement.parentElement.classList.contains('wrong-bid')) {
            showScreen('question')
            return
        }

        for (let i = 1; i <= bids.length; i++) {
            let diff = bid_item_price - parseInt(bids[i - 1].value);
            console.log("i: " + i + " | diff: " + diff)
            if (diff >= 0 && diff < current_diff) {
                winner = i;
                current_diff = diff;
            }
        }

        if (winner != '') {
            winnning_id = winner;
            for (let i = 1; i <= bids.length; i++) {
                bids[i - 1].parentElement.parentElement.classList.remove('warning-bid')
                if (winner == i) {
                    bids[i - 1].parentElement.parentElement.classList.add('right-bid')
                    if (bids[i - 1].value == bid_item_price) {
                        if (document.getElementById('team_' + i + "_price_points").parentElement.classList.contains('negative')) {
                            document.getElementById('team_' + i + "_price_points").value = Math.abs(parseInt(document.getElementById('team_' + i + "_price_points").value) - bid_item_price);
                            if (parseInt(document.getElementById('team_' + i + "_price_points").value) - bid_item_price < 0) {
                                document.getElementById('team_' + i + "_price_points").parentElement.classList.remove('negative')
                            }
                        } else {
                            document.getElementById('team_' + i + "_price_points").value = parseInt(document.getElementById('team_' + i + "_price_points").value) + bid_item_price;
                        }
                    }
                } else {
                    bids[i - 1].parentElement.parentElement.classList.add('wrong-bid')
                }
            }
            playSoundEffect("money")
            document.getElementById(BID_ITEM_PRICE_ID).classList.remove('invisible')
        }
        else {
            playSoundEffect("wrong")
            for (let i = 1; i <= bids.length; i++) {
                bids[i - 1].parentElement.parentElement.classList.add('warning-bid')
                setTimeout(function () { bids[i - 1].parentElement.parentElement.classList.remove('warning-bid') }, 500)
            }
        }


    }

    saveData = (key, value) =>{
        Global.setValue(key,value);
        Global.setValue('savedPriceData',true)
    }

    showScreen = (screenName) => {

        cleanScreens(screenName)


        let screens = document.getElementsByClassName('round_screen');
        for (let i = 0; i < screens.length; i++) {
            let screen = screens[i];
            if (screen.getAttribute('data-screenname') == screenName) {
                screen.classList.remove('hidden')
                setTimeout(function () { screen.classList.remove('invisible') }, 500)
            }
            else {
                screen.classList.add('invisible')
                setTimeout(function () { screen.classList.add('hidden') }, 500)
            }
        }
    }

    /*------------------------------------------------------------------------
     *              PUBLIC METHODS
     */
    return {
        checkAnswer,
        init,
        loadPlayers,
        showScreen,
        showPrice,
        loadQuestion,
        respawnImages,
        playSound,
        clearSavedData,
        loadSavedData,
    };
}());
