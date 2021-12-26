/*property

*/


const Wheel = (function() {
    "use strict";
  
    /*------------------------------------------------------------------------
     *              CONSTANTS
     */
    const QUESTIONS_URL_PREFIX = 'https://raw.githubusercontent.com/isaacmcdgl/JSON/main/Games/Wheel/'
    const VOWEL_CODES = ['KeyA','KeyE','KeyI','KeyU','KeyO','KeyY']
    /*------------------------------------------------------------------------
     *              PRIVATE VARIABLES
     */

    let current_phrase_id = 0;
    let spinning = false;
    let degree = 0;
    let current_points;
    let current_phrase;

    let game;
    let phrases;
    let questionsLoaded;
  
    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */
    let getBlockHTML;
    let getWheelValue;

    let bankrupt;
    let buyVowel;

    let onKeyPressed;
    let revealLetter;
    let assignPoints;

    let toggleLetter;

    let init;  

    let hideMessage;

    let finalscore;

    let loadQuestions;
    let loadPhraseBoard;

    let nextPhrase;
    let previousPhrase;

    let showLetter;
    let showLetterCover;
    let showAllLetter;

    let sortIntoRows;
    let sortRows;
    let sortRowLetters;

    let solvePuzzle;

    let playSound;
    let stopSound;

    let wheelClick;
    let wheelStart;
    let wheelStop;
    let wheelDecode;

    let loadTeams;

    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */
    assignPoints = (team) => {
        playSound('money')
         console.log("Assigning " + current_points + " to " + team)
         document.getElementById('points').value = "SPIN THE WHEEL";
         document.getElementById('points').value = phrases[current_phrase_id].category;
         document.getElementById('team_' + team).children[1].value = parseInt(document.getElementById('team_' + team).children[1].value) + current_points;
    }

    bankrupt = (button) =>{
       button.parentElement.parentElement.children[0].children[1].value = 0;
       playSound('wrong')
    }

    buyVowel = (button) => {
        button.parentElement.parentElement.children[0].children[1].value =  button.parentElement.parentElement.children[0].children[1].value - 500;
    }

    finalscore = (button, correct) =>{
        let valueDiv = button.parentElement.parentElement.children[0].children[1];
        if(correct){
            valueDiv.value = parseInt(valueDiv.value) * 2
        }else{
            valueDiv.value = parseInt(valueDiv.value) / 2
        }
    }

    getBlockHTML= (letter) =>{
        if(!letter){
            return `<div class="board_block blank_board_block"></div>`
        }else{
            if(letter == '-' || letter == '\''){
                return `<div class="board_block board_block_letter" data-letter=${letter}>
                            <div class="board_block_value">${letter}</div>
                        </div>`
            }
            return `<div class="board_block board_block_letter letter_${letter}" data-letter=${letter}>
                        <div class="board_block_cover" onclick="showLetter(this)"></div>
                        <div class="board_block_value">${letter}</div>
                    </div>`
        }
    }

    getWheelValue = (rotation) =>{
        console.log("ROTATION: " + rotation)
        if(rotation > 0 && rotation <= 180){
            if(rotation <= 90){
                if(rotation <= 45 ){
                    if(rotation <= 15){
                        return 700
                    }else if(rotation <= 30 ){
                        return 300
                    } else{
                        return 650
                    }
                }else{
                    if(rotation <= 60){
                        return 'SKIP'
                    }else if(rotation <= 75 ){
                        return 550
                    } else{
                        return 400
                    }
                }
            }else{
                if(rotation <= 135 ){
                    if(rotation <= 105){
                        return 'BANKRUPT'
                    }else if(rotation <= 120 ){
                        return 350
                    } else{
                        return 700
                    }
                }else{
                    if(rotation <= 140){
                        return 'BANKRUPT'
                    }else if(rotation <= 145 ){
                        return 15000
                    }else if(rotation <= 150 ){
                        return 'BANKRUPT'
                    }else if(rotation <= 165 ){
                        return 500
                    } else{
                        return 650
                    }
                }
            }
        } else {
            if(rotation <= 270){
                if(rotation <= 225 ){
                    if(rotation <= 195){
                        return 400
                    }else if(rotation <= 210 ){
                        return 300
                    } else{
                        return 900
                    }
                }else{
                    if(rotation <= 240){
                        return 'LOSE A TURN'
                    }else if(rotation <= 255 ){
                        return 500
                    } else{
                        return 350
                    }
                }
            }else{
                if(rotation <= 315 ){
                    if(rotation <= 285){
                        return  200
                    }else if(rotation <= 300 ){
                        return 450
                    } else{
                        return 800
                    }
                }else{
                    if(rotation <= 320){
                        return 'BANKRUPT'

                    }else if(rotation <= 325 ){
                        return 15000
                    }else if(rotation <= 330 ){
                        return 'BANKRUPT'
                    }else if(rotation <= 345 ){
                        return 900
                    } else{
                        return 'LOSE A TURN'
                    }
                }
            }
        }
    }
    hideMessage = () =>{
        console.log(current_phrase_id)
        console.log(phrases)
        console.log(phrases[current_phrase_id])
        loadPhraseBoard(phrases[current_phrase_id].text.toLowerCase());
        document.getElementById('messageDiv').classList.add('hidden')
    }

    init = function(onInitializedCallback) {
        document.addEventListener('keypress', onKeyPressed);
        console.log("Started wheel init...");
        loadPhraseBoard("clearBoard")
        game = JSON.parse(localStorage.getItem("currentGame"));
        loadQuestions()
        console.log(game);
        phrases = [];
        phrases = phrases.unshift('clearBoard');
    };

    loadQuestions = function () {
        let url = QUESTIONS_URL_PREFIX + game.json_name + ".json"
        Global.ajax(url, function (data) {
            console.log(data);
            phrases = data;
            questionsLoaded = true;
        })

    }

    loadTeams = function(num_of_teams){
        document.getElementById('loadScreen').classList.add('hidden');
        let html = '';
        for(let i = 1; i<= num_of_teams; i++){
            html +=`<div class="team_tools">
                        <div id="team_${i}" class="team">
                            <input class="team_name"  placeholder="Team ${i}"/>
                            <input class="team_points" value="0" type="number" min="0"/>
                        </div>
                        <div class="team_toolbar toolbox">
                            <img src="../images/logos/vowel.png" onclick="buyVowel(this)" style="margin-left: auto;">
                            <img src="../images/logos/reset.png" onclick="bankrupt(this)" style="margin-left: auto;">
                            <img src="../images/logos/check.png" onclick="finalscore(this, true)" style="margin-left: auto;">
                            <img src="../images/logos/xicon.png" onclick="finalscore(this,false)" style="margin-left: auto;">
                        </div>
                    </div>
            `
        }
        document.getElementById('teams_list').innerHTML = html
    }
  
    loadPhraseBoard = (phrase) =>{
        current_phrase = phrase;
        if(phrase == "clearBoard"){
            let num_blocks;
            for(let i = 1; i <= 4; i++){

                let row_blocks = '';
                if(i == 1 || i == 4){
                    num_blocks = 12
                }else{
                    num_blocks = 14
                };

                for(let j = 0; j < num_blocks; j++){
                    row_blocks += (getBlockHTML())
                }
                document.getElementById('phrase_board_row_' + i).innerHTML = row_blocks;

            }
        } else {
            let rows = sortIntoRows(phrase);
            console.log("ALL ROWS")
            console.log(rows);

            let new_rows = sortRows(rows)

            console.log(new_rows)

            let sorted_rows = sortRowLetters(new_rows)
            console.log(sorted_rows)
            for(let i = 1; i <= 4; i++){

                let row = sorted_rows[i-1];

                let row_blocks = '';
                for(let j = 0; j < row.length; j++){
                    row_blocks += (getBlockHTML(row[j]))
                }
                document.getElementById('phrase_board_row_' + i).innerHTML = row_blocks;

            }
        }
    }

    previousPhrase = () => {
        document.getElementById('points').value = "SPIN THE WHEEL";
        current_phrase_id = current_phrase_id - 1;
        loadPhraseBoard(phrases[current_phrase_id].text.toLowerCase());
        document.getElementById('points').value = phrases[current_phrase_id].category;
    }

    nextPhrase = () =>{
        document.getElementById('points').value = "SPIN THE WHEEL";
        current_phrase_id = current_phrase_id + 1;
        if(current_phrase_id == phrases.length - 1){
            loadPhraseBoard("clearBoard");
            document.getElementById('messageDiv').classList.remove('hidden')
        }else{
            document.getElementById('points').value = phrases[current_phrase_id].category;
            loadPhraseBoard(phrases[current_phrase_id].text.toLowerCase());
        }

    }

    onKeyPressed = (e) =>{
        console.log(e)
        if(e.code == 'Space'){
            wheelClick(document.getElementById('wheel'));
        } else if (e.code == 'Enter'){
            solvePuzzle()
        } else if (e.code.substr(0,5) == 'Digit'){
            assignPoints(e.key); 
        } else if (e.code == 'Backslash'){
            playSound('wrong')
        }
         else if (VOWEL_CODES.includes(e.key)){
            showAllLetter(e.key, true)
        } else if(e.code.includes('Key')){
            showAllLetter(e.key, false)
        }
    }

    playSound = function (sound) {
        switch (sound) {
            case "right":
                document.getElementById('rightAudio').play()
                setTimeout(() => {
                    document.getElementById('rightAudio').pause() 
                    document.getElementById('rightAudio').currentTime = 0
                }, 2000);
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
            case "click":
                document.getElementById('clickAudio').play()
                break;
        }
    }

    stopSound = (sound) => {
        switch (sound) {
            case "click":
                document.getElementById('clickAudio').pause() 
                document.getElementById('clickAudio').currentTime = 0
                break;
        }
    }


    showAllLetter = (letter, isVowel) =>{
        toggleLetter(letter)
        if(current_phrase.includes(letter)){
            playSound('right')
            let letters = document.getElementsByClassName('letter_' + letter);
            var letters_array = Array.prototype.slice.call( letters )
            let i = 0;
            letters_array.forEach(element => {
                i = i + 1000;
                setTimeout(function(){showLetterCover(element.children[0])},i)
            });
            current_points = current_points * letters_array.length;
        }else{
            playSound('wrong')
        }

    }

    showLetterCover = (letter_div_cover) =>{
        letter_div_cover.classList.add('board_block_cover_colored')
    }

    showLetter = (letter_div_cover) =>{
        letter_div_cover.classList.remove('board_block_cover_colored')
        letter_div_cover.classList.add('board_block_cover_hidden')
        if(document.getElementsByClassName('board_block_cover_colored').length == 0){
            if(Number.isInteger(current_points)){
                document.getElementById('points').value = '$' + current_points;
            }
        }
    }

    solvePuzzle = () =>{
        let letters = document.getElementsByClassName('board_block_cover');
        var letters_array = Array.prototype.slice.call( letters );
        letters_array.forEach(element => {
            element.classList.add('board_block_cover_hidden')
        });
    }

    sortRows = (rows) =>{
        let new_rows = [];
        console.log(rows.length)
        if(rows.length == 1){
            new_rows.push([undefined]);
            new_rows.push(rows[0]);
            new_rows.push([undefined]);
            new_rows.push([undefined]);
        } else if(rows.length == 2){
            new_rows.push([undefined]);
            new_rows.push(rows[0]);
            new_rows.push(rows[1]);
            new_rows.push([undefined]);
        } else if(rows.length == 3){
            new_rows.push(rows[0]);
            new_rows.push(rows[1]);
            new_rows.push(rows[2]);
            new_rows.push([undefined]);
        }else{
            new_rows.push(rows[0]);
            new_rows.push(rows[1]);
            new_rows.push(rows[2]);
            new_rows.push(rows[3]);
        }

        return new_rows;
    }

    sortIntoRows = (phrase) =>{
        console.log(phrase)
        let words = phrase.split(" ");
        console.log(words)
        let i = 1;
        let rows = [];
        let rowMax;
        let current_row = [];
        let current_chars = 0;
        words.forEach(word => {
            if(i == 1 || i == 4){
                rowMax = 12;
            }else{
                rowMax = 14;
            }
            console.log(current_chars)
            if(current_chars + 1 + word.length  < rowMax){
                current_row.push(word);
                if(current_chars > 0){
                    current_chars = current_chars + 1 + word.length;
                }else{
                    current_chars = current_chars + word.length;
                }

            }else{
                rows.push(current_row);
                i++;
                current_row = [];
                current_chars = 0;
                current_row.push(word);
                current_chars = current_chars + 1 + word.length;
            }
            console.log("CURRENT ROW");
            console.log(current_row);

        });

        rows.push(current_row);

        return rows;
    }

    sortRowLetters = (rows) =>{
        let i = 1;
        let rowMax = 0;
        let rows_sorted = [];
        console.log(rows)
        rows.forEach(row => {
            console.log('*************************************************************** ROW ' + i)
            if(i == 1 || i == 4){
                rowMax = 12;
            }else{
                rowMax = 14;
            }


            let total_length = 0;
            let row_letters = [];
            console.log(row[0])
            if(row[0] == undefined){
                console.log(rowMax)
                for(let n = 0; n< rowMax; n++){
                    row_letters.push(undefined)
                }
                rows_sorted.push(row_letters)
            }
            else{
                let j = 0;
                row.forEach(word => {
                    if(total_length != 0){
                        total_length = total_length + 1 + word.length
                    }else{
                        total_length = total_length + word.length
                    }
    
                    let letters = word.split('');
                    letters.forEach(letter => {
                        row_letters.push(letter)
                    });
                    if(j != row.length){
                        row_letters.push(undefined)
                    }
                    j++;
                });
       
                let blank_spaces = rowMax - total_length;
                let before = Math.floor(blank_spaces/2);               
                let after = blank_spaces - before;
                
                for(let k = 0; k < before; k++){
                    row_letters.unshift(undefined)
                }
                for(let l = 1; l < after; l++){
                    row_letters.push(undefined)
                }

                rows_sorted.push(row_letters)
            }
            i++;
        });

        return rows_sorted
    }

    toggleLetter = (letter, overhaul=false) =>{
        let letterdiv;
        if(typeof(letter) == "string"){
            letterdiv = document.getElementById(letter.toUpperCase() + "_letter");
        }else{
            letterdiv = letter;
        }

        console.log(letterdiv)

        if(overhaul || letterdiv.classList.contains('used_letter_inactive')){
            letterdiv.classList.remove('used_letter_inactive')
        }else{
            letterdiv.classList.add('used_letter_inactive')
        }
    }

    wheelClick = (wheel) => {
        if(spinning){
            wheel.classList.remove('spinning');
            setTimeout(function(){wheelStop(wheel,2);},345)
        }else{
            spinning = true;
            wheel.classList.add('spinning')
            wheelStart(wheel);
        }
        
    }

    wheelStart = (wheel) => {
        document.getElementById('points').value = 'Spinning...'
        let id = null;
        clearInterval(id);
        id = setInterval(spin, 1)
        function spin(){
            if(degree % 5 == 0){
                //stopSound("click");
                setTimeout(playSound("click"),75)
            }
            if(spinning){
                degree = degree + 1; 
                wheel.style = `transform: rotate(${degree}deg)`
            }else{
                clearInterval(id)
            }

        }
        setTimeout(function(){if(spinning){wheelStop(wheel,1)}}, 15000 )
    }

    wheelStop = (wheel, speed) => {
        spinning = false;
        let slowspinning = true;
        let id = null;
        console.log(speed);
        id = setInterval(spin, speed)
        function spin(){
            if(slowspinning){
                if(degree % 15 == 0){
                    //stopSound("click");
                    setTimeout(playSound("click"),100)
                }
                degree = degree + 1;
                wheel.style = `transform: rotate(${degree}deg)`
            }else{
                clearInterval(id);
            }
        }
        setTimeout(function(){
            slowspinning = false;
            if(speed < 20){
                wheelStop(wheel, speed +1)
            }else{
                wheelDecode(wheel)
            }

        },145)
    }

    wheelDecode = (wheel) => {
        let rotation = wheel.style.transform;
        rotation = rotation.substr(7, rotation.length)
        rotation = rotation.slice(0,rotation.length - 4)
        
        console.log(rotation)
        while(rotation > 360){
            rotation = rotation - 360;   
        }

        console.log(rotation)

        wheel.style.transform = `rotate(${rotation}deg)`

        let wheel_value = getWheelValue(rotation);
        console.log(wheel_value);
        if(Number.isInteger(wheel_value)){
            current_points = wheel_value;
            document.getElementById('points').value = '$' + wheel_value;
        } else {
            document.getElementById('points').value = wheel_value;
        }

    }


    /*------------------------------------------------------------------------
     *              PUBLIC METHODS
     */
    return {
        init,
        showLetter,
        wheelClick,
        nextPhrase,
        previousPhrase,
        hideMessage,
        bankrupt,
        buyVowel,
        toggleLetter,
        finalscore,
        solvePuzzle,
        loadTeams,
    };
  }());
  