/*property

*/


const Games = (function() {
    "use strict";
  
    /*------------------------------------------------------------------------
     *              CONSTANTS
     */
    const ANIMATION_DURATION = 800;
    const CURRENT_GAME_COOKIE = 'current-game';
    const GAMES_URL = 'https://raw.githubusercontent.com/isaacmcdgl/JSON/main/Misc/FamilyFued/games.json'
    const QUESTIONS_URL_PREFIX = 'https://raw.githubusercontent.com/isaacmcdgl/JSON/main/Misc/FamilyFued/games/'
  
    /*------------------------------------------------------------------------
     *              PRIVATE VARIABLES
     */
    let questions;
    let game;
    let gameloaded;
    let current_question = 0;
    let questionsLoaded = false;
    let current_game;
  
    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    let init;  
    let loadGames;
    let loadQuestions;
    let removeLoader;
    let showQuestion;


    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */
    
  
    init = function(onInitializedCallback) {
        console.log("Started Games init...");
        window.scrollTo(0,0)
        loadGames();
    };

    loadGames = function(){
        Global.ajax(GAMES_URL, function(data) {
            games = data;
            games.forEach(element => {
                if(element.id == current_game){
                    game = element
                }
            });
            gamesLoaded = true;
            loadQuestions;
            })
    }

    loadQuestions = function(){
        if(gameloaded){
            let url = QUESTIONS_URL_PREFIX + game
            Global.ajax(url, function(data) {
                questions = data;
                console.log(questions);
                quesitonsLoaded = true;
                removeLoader()
                })
        }
        else{
            loadGames;
        }

    }

    removeLoader = function(){

    }
    showQuestion = function(question_id){
        current_question = question_id;

    }
  
    /*------------------------------------------------------------------------
     *              PUBLIC METHODS
     */
    return {
        init,
    };
  }());
  