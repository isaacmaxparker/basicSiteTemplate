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
  
    /*------------------------------------------------------------------------
     *              PRIVATE VARIABLES
     */
    let games;
    let gamesLoaded = false;
  
    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    let init;  
    let loadGames;
    let showGames;
    let selectGame;

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
            gamesLoaded = true;
            showGames();
            })
    }
    showGames = function(){
        if(gamesLoaded){
            let grid = document.getElementById('games_grid');
            let gridContent = ''
            games.forEach(element =>{  
                let divcontent = Global.htmlDiv(null,'header md',null,null,element.name)
                divcontent += Global.htmlp(null,'header xs pointer','maring-bottom:0px;',`onclick="selectGame(${element.id})"`,"Select")
                let div = Global.htmlDiv(null,`grid-card ${element.color ? element.color : 'white'}_card header white-text flex-column`,null,null,divcontent)

                gridContent+=div
                console.log(gridContent)
            });
            grid.innerHTML = gridContent;
        }
        else{
            loadGames()
        }

    }
    selectGame = function(id){
        Global.setCookie(CURRENT_GAME_COOKIE,id)
        setTimeout(function(){location.replace("scores.html")},750);
    }
  
    /*------------------------------------------------------------------------
     *              PUBLIC METHODS
     */
    return {
        init,
        selectGame,
    };
  }());
  