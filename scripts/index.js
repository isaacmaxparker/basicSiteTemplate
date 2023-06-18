/*property

*/


const Index = (function() {
    "use strict";
  
    /*------------------------------------------------------------------------
     *              CONSTANTS
     */
    const ANIMATION_DURATION = 7000;
    const GAMES_URL = 'https://raw.githubusercontent.com/isaacmaxparker/JSON/main/Games/games.json'
    const LOAD_LOOP_VIDEO_ID = 'loopVideo';
    const LOAD_VIDEO_ID = 'loadVideo';
    const LINKS_ID = 'links';
    /*------------------------------------------------------------------------
     *              PRIVATE VARIABLES
     */
    let games;
    let gamesLoaded = false;
  
    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    let init;  
    let loadScreen;
    let showPasswordPrompt;


    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */


    init = function(onInitializedCallback) {
        console.log("Started Index init...");
        window.scrollTo(0,0);
        setTimeout(()=>{
            document.getElementById(LOAD_LOOP_VIDEO_ID).classList.remove('hidden')
            document.getElementById(LOAD_LOOP_VIDEO_ID).play()
        },ANIMATION_DURATION)
        setTimeout(()=>{
            document.getElementById(LOAD_VIDEO_ID).classList.add('hidden')
            document.getElementById(LINKS_ID).classList.remove('hidden')
        },ANIMATION_DURATION + 150)
    };

    loadScreen = function(screentype) {
        let newLocation = null;
        if(screentype == 'Games'){
           if(window.location.href.includes('index.html')){
               newLocation = window.location.href.replace('index.html','html/games.html');
           } else{
               newLocation =  window.location.href + 'html/games.html';
           }
        }else if (screentype == 'AnswersGo'){
                      if(window.location.href.includes('index.html')){
               newLocation = window.location.href.replace('gameAnswers.html','html/games.html');
           } else{
               newLocation =  window.location.href + 'html/gameAnswers.html';
           }
        }else{
            showPasswordPrompt(true)
        }
        if(newLocation){
            window.location = newLocation
        }
    };

    showPasswordPrompt = (type) =>{
        console.log(type)
        if(type){
            document.getElementById('password-prompt').classList.remove('hidden');
        }else{
            document.getElementById('password-prompt').classList.add('hidden');
        }

    }
  
    /*------------------------------------------------------------------------
     *              PUBLIC METHODS
     */
    return {
        init,
        loadScreen,
        showPasswordPrompt,
    };
  }());
  