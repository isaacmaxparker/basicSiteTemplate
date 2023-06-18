/*property

*/


const Scatter = (function() {
    "use strict";
  
    /*------------------------------------------------------------------------
     *              CONSTANTS
     */
    const QUESTIONS_URL_PREFIX = 'https://raw.githubusercontent.com/isaacmaxparker/JSON/main/Games/Scatter/'
    const DEFAULT_ADJECTIVES = [
        'SEXY',
        'DADDY',
        'AGGRESSIVE',
        'CHODELIKE',
        'GARGANTUAN',
        'PICKLED',
        'HAWT',
        'ROTUND',
        'INDESCRIBABLE',
        'INFATUATED',
        'LOVESTRUCK',
        'PANIC-STRICKEN',
        'BUBBLY',
        'NOT SHY',
        'NEPTUNIAN',
        'UPSIDE-DOWN'
    ]
    
    const DEFAULT_NOUNS = [
        'TIGER',
        'BOTTOM',
        'TWINK',
        'BEAR',
        'CHICKEN',
        'FRENCH FRY',
        'HOT DOG BUN',
        'PICKLE',
        'UNICORN',
        'WHISKEY',
        'ISAAC',
        'BULL NOSE RING'
    ]

    const DEFAULT_LETTERS = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','H','Y','Z','A','A','A','S','S','S','S','E','E','E','T','R','M','I']
    

    const DEFAULT_CATEG_HTML = `<div class="category">
    <div id="category_1_loader" data-index="1" onclick="this.classList.remove('category-animate');showTimer()">
        <p></p>
    </div>
    <p id="category_1_text"></p>
</div>
<div class="category">
    <div id="category_2_loader" data-index="2" onclick="this.classList.remove('category-animate');showTimer()">
        <p></p>
    </div>
    <p id="category_2_text"></p>
</div>
<div class="category">
    <div id="category_3_loader" data-index="3" onclick="this.classList.remove('category-animate');showTimer()">
        <p></p>
    </div>
    <p id="category_3_text"></p>
</div>
<div class="category">
    <div id="category_4_loader" data-index="4" onclick="this.classList.remove('category-animate');showTimer()">
        <p></p>
    </div>
    <p id="category_4_text"></p>
</div>
<div class="category">
    <div id="category_5_loader" data-index="5" onclick="this.classList.remove('category-animate');showTimer()">
        <p></p>
    </div>
    <p id="category_5_text"></p>
</div>`;

    /*------------------------------------------------------------------------
     *              PRIVATE VARIABLES
     */
    let categories;
    let questionsLoaded;
    let game;
    let num_of_players;
    let picked_names = [];
    let random_names = [];
    let shuffled_letters;
    let picked_categories = []; 
    let ordered_teams = [];
    let rounds_left;
  
    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    let adjustScore;
    let buildScoresArray;
    let randomArrayElement;
    let chooseCategory; 
    let chooseLetter;
    let chooseBonusLetter;
    let init;  
    let loadTeams;
    let hideScores;
    let loadCategories;
    let loadPlayers;
    let loadPlayerNames;
    let decodePlayerName;
    let reorderPlayers;
    let loadRound;
    let categoryLoad;
    let showScores;
    let updateScores;
    let startTimer;
    let runTimer;


    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    adjustScore = (element, val) =>{
        let currentScore = parseInt(element.value);
        element.value = currentScore + parseInt(val);
        element.parentElement.setAttribute('data-score',element.value)
    }

    buildScoresArray = ()=> {
        ordered_teams = [];
        for(let i = 1; i <= num_of_players; i++){
            console.log(i);
            let obj = {};
             obj.name = Global.getValue(`scatter_${i}_name`);
             obj.points = Global.getValue(`scatter_${i}_points`) ? Global.getValue(`scatter_${i}_points`) : 0;
             obj.index = i;
             ordered_teams.push(obj);
        }

        ordered_teams.sort(compare);
    }

    function compare( a, b ) {
        if ( a.points > b.points ){
            return -1;
        }
        if ( a.points < b.points ){
            return 1;
        }
        return 0;
    }

    categoryLoad = (element) =>{
        let r = (Math.random() + 1).toString(36).substring(2) + (Math.random() + 1).toString(36).substring(2) + (Math.random() + 1).toString(36).substring(2);
        
        let l = document.getElementById(`category_${element.getAttribute('data-index')}_text`).innerHTML.length;

        r = r.substring(0,l);
        
        if(element.classList.contains('category-animate')){
            element.innerHTML = `<p>${r}</p>`;
            setTimeout(function(){categoryLoad(element)},75)
        }else{
            element.classList.add('hidden')
        }
    }

    chooseLetter = (i) =>{
        document.getElementById('main_letter').innerHTML = `<p></p>`
        document.getElementById('bonus_letter').innerHTML = `<p></p>`
        let letter = shuffled_letters[i];
        document.getElementById('main_letter').innerHTML = `<p>${letter}</p>`
        if(i == 30){
            Global.playSound('right');
            shuffled_letters = Global.shuffleArray(DEFAULT_LETTERS);
            chooseBonusLetter(0);
        }else{
            setTimeout(function(){chooseLetter(i+1);},50);
        }

    }

    chooseBonusLetter = (j) =>{
        let letter = shuffled_letters[j];
        document.getElementById('bonus_letter').innerHTML = `<p>${letter}</p>`
        if(j == 30){
            Global.playSound('right');
            let html = '';
            for(let i = 1; i < 6; i++){
                html += `<div class="category">
                            <div id="category_${i}_loader" data-index="${i}" onclick="showTimer(this);" class="category-animate">
                                <p>asdfdfhsafjgfsd</p>
                            </div>
                            <p id="category_${i}_text"></p>
                        </div>`
            }
            document.getElementById('categoryGrid').innerHTML = html;
            chooseCategory(0,true);
        }else{
            setTimeout(function(){chooseBonusLetter(j+1);},50);
        }

    }

    chooseCategory = (i, first) =>{
        let category = randomArrayElement(categories);
        if (i < 5){
            if(first){
                categoryLoad(document.getElementById(`category_${i+1}_loader`));
            }
            if(picked_categories.includes(category)){
                chooseCategory(i, false);
            }else{
                picked_categories.push(category);
                document.getElementById(`category_${i+1}_text`).innerHTML =  category.category;
                chooseCategory(i + 1, true);
            }
        }     
        rounds_left = Math.round((categories.length/5) - (picked_categories.length/5));
    }
    
    decodePlayerName = (k) =>{
        let adjective = randomArrayElement(DEFAULT_ADJECTIVES);
        let noun = randomArrayElement(DEFAULT_NOUNS);
        let name = adjective + ' ' + noun;

        if(name && (picked_names.includes(noun) || picked_names.includes(adjective))){
            decodePlayerName(k);
        }else{
            picked_names.push(adjective);
            picked_names.push(noun);
            random_names.push(name.toLowerCase())
        }
    }


    init = function(onInitializedCallback) {
        console.log("Started Scatter init...");
        game = JSON.parse(localStorage.getItem("currentGame"))
        loadCategories();
    };

    loadCategories = function () {
        let url = QUESTIONS_URL_PREFIX + game.json_name + ".json"
        Global.ajax(url, function (data) {
            categories = data;
            questionsLoaded = true;
        })

    }

    loadPlayers = function(playernum, redo=false) {
        num_of_players = playernum;
        Global.hideElementFade(document.getElementById('initial_content'));
        console.log(Global.getValue('saved_scatter_players'));
        if(!redo && Global.getValue('saved_scatter_players') == playernum){
        
            let html = `<div class="saved_players">You have saved player names from a previous game do you want to use those?</div>
            <div class="flex-row">
                <div class="playNum" onclick="loadPlayerNames(true)">Yes</div>
                <div class="playNum" onclick="loadPlayers(${playernum}, true)">No</div>
            </div>`
            
            setTimeout(()=>{document.getElementById('initial_content').innerHTML = html;Global.showElementFade(document.getElementById('initial_content'));},1000)
        }else {
            Global.setValue('saved_scatter_players',playernum);

            let html = '';

            for(let i = 1; i <= playernum; i++){
                decodePlayerName(i);
            }

            for(let i = 1; i <= playernum; i++){
                html += `<input id="player_name_input_${i}" type="text" class="player_name_input" placeholder="${random_names[i-1]}"/>`
            }
            console.log(html)
            document.getElementById('player_name_inputs').innerHTML = html;
            setTimeout(()=>{Global.showElementFade(document.getElementById('player_names'));},750);
        }
        
    }

    loadPlayerNames = (saved = false) => {
        let cover_html = '';
        let side_html = '';
        document.getElementById('letterGrid').style ='';
        Global.hideElementFade(document.getElementById('scores_info'),250)
        document.getElementById('loser_divs').classList.add(`grid-column-${num_of_players - 3}`);
        for(let i = 1; i <= num_of_players; i++){
            Global.setValue(`scatter_${i}_points`, 0);
            let name;
            if(saved){
                name = Global.getValue(`scatter_${i}_name`);
            }
            else{
                name = document.getElementById(`player_name_input_${i}`).value;
                if(!name){
                    name = document.getElementById(`player_name_input_${i}`).getAttribute('placeholder')
                }
                Global.setValue(`scatter_${i}_name`,name);
            }
            side_html += `<div id="team_score_${i}" class="team_score" data-score="0" style="filter:hue-rotate(${i * (360 / num_of_players)}deg)">
                            <p>${name}</p>
                            <input id="team_score_${i}_input" type="number" max=1500 value="0"/>
                            <div class="score_buttons">
                                <div class="score_button" onclick="adjustScore(this.parentElement.parentElement.children[1],100)"><p>+1</p></div>
                                <div class="score_button" onclick="adjustScore(this.parentElement.parentElement.children[1],200)"><p>+2</p></div>
                                <div class="score_button" onclick="adjustScore(this.parentElement.parentElement.children[1],300)"><p>+3</p></div>
                                <div class="score_button" onclick="adjustScore(this.parentElement.parentElement.children[1],-50)"><p>-</p></div>
                            </div>
                        </div>`
        }

        document.getElementById('scoreInputs').innerHTML = side_html;

        Global.hideElementFade(document.getElementById('loadScreen'));
        Global.showElementFade(document.getElementsByClassName('splitContent')[0]);
    }

    loadRound = () => {
        document.getElementById('timer').classList.add('hidden');
        document.getElementById('categoryGrid').innerHTML = DEFAULT_CATEG_HTML;
        shuffled_letters = Global.shuffleArray(DEFAULT_LETTERS);
        chooseLetter(0);
        chooseCategory();
    }

    reorderPlayers = () =>  {
        let html= '';
        for(let i = 0; i < ordered_teams.length; i++){
            let obj = ordered_teams[i];
            if(i == 0){
                let elm = document.getElementById('first_place');
                elm.querySelector('.champ_name').innerHTML = obj.name;
                elm.querySelector('.champ_points').innerHTML = obj.points;
                let stylestring = `filter:hue-rotate(${(360/num_of_players) * obj.index}deg);`;
                elm.setAttribute('style',stylestring);
            }else if(i == 1){
                let elm = document.getElementById('second_place');
                elm.querySelector('.champ_name').innerHTML = obj.name;
                elm.querySelector('.champ_points').innerHTML = obj.points;
                let stylestring = `filter:hue-rotate(${(360/num_of_players) * obj.index}deg);`;
                stylestring = stylestring + `height:${(obj.points / ordered_teams[0].points).toString().substring(2,4)}%;`
                elm.setAttribute('style',stylestring);
            }else if(i == 2){
                let elm = document.getElementById('third_place');
                elm.querySelector('.champ_name').innerHTML = obj.name;
                elm.querySelector('.champ_points').innerHTML = obj.points;
                let stylestring = `filter:hue-rotate(${(360/num_of_players) * obj.index}deg);`;
                stylestring = stylestring + `height:${(obj.points / ordered_teams[0].points).toString().substring(2,4)}%;`
                elm.setAttribute('style',stylestring);
            }else{
                html += `<div class="loser_team" style="filter:hue-rotate(${(360/num_of_players) * obj.index}deg)">${obj.name} - ${obj.points}</div>`
            }
        }

        document.getElementById('loser_divs').innerHTML = html;
    }

    randomArrayElement = (arr) =>{
        return arr[Math.floor(Math.random()*arr.length)];
    }

    startTimer = () =>{
        let timer = document.getElementById('timer');
        let timerinput = document.getElementById('timer_input');
        timer.classList.remove('hidden');
        for(let i = 5;i > 0; i--){
            setTimeout(()=>{
                Global.playSound('click');
                timerinput.innerHTML = i;
            }, ((5-i) * 1000))
        }
        setTimeout(()=>{
            runTimer(60,timerinput)
        }, (6000))
    }

    runTimer = (number, timer) =>{
        timer.innerHTML = number;
        if(number == 0){
            Global.playSound('right');
            document.getElementById('timer').classList.add('hidden')
        }else{
            if (number <= 10){
            Global.playSound('click');
            }
            setTimeout(()=>{runTimer(number - 1,timer)},1000)
        }
    }

    hideScores = () =>{
        Global.hideElementFade(document.getElementById('scores_info'),250)
        setTimeout(function(){document.getElementById('scores_overlay').classList.add('hidden_score_overlay');},750);
    }

    showScores = () => {
        document.getElementById('scores_overlay').classList.remove('hidden_score_overlay');
        setTimeout(function(){Global.showElementFade(document.getElementById('scores_info'),250)},750);
    }

    updateScores = () =>{
        for(let i = 1; i <= num_of_players; i++){
            let current_points =  parseInt(Global.getValue(`scatter_${i}_points`));
            current_points = Number.isInteger(current_points) ? current_points : 0;
            let new_points = parseInt(document.getElementById(`team_score_${i}_input`).value);
            console.log("CURRENT: " + current_points);
            console.log("NEW: " + new_points);
            Global.setValue(`scatter_${i}_points`, current_points + new_points);
            document.getElementById(`team_score_${i}_input`).value = 0;
        }
        if(rounds_left == 0){
            document.getElementById('scores_title').innerHTML = 'FINAL SCORES'
        }else if (rounds_left == 1){
            document.getElementById('scores_title').innerHTML = 'FINAL ROUND'
        }else{
            document.getElementById('scores_title').innerHTML = rounds_left + ' Rounds Left';
        }
        
        buildScoresArray();
        reorderPlayers();
        showScores();
    }
  
    /*------------------------------------------------------------------------
     *              PUBLIC METHODS
     */
    return {
        init,
        loadPlayers,
        loadPlayerNames,
        loadRound,
        adjustScore,
        updateScores,
        showScores,
        hideScores,
        startTimer,
    };
  }());
  