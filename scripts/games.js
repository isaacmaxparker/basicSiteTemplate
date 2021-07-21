/*property

*/


const Games = (function() {
    "use strict";
  
    /*------------------------------------------------------------------------
     *              CONSTANTS
     */
    const ANIMATION_DURATION = 800;
    const GAMES_URL = 'https://raw.githubusercontent.com/isaacmcdgl/JSON/main/Games/games.json'
  
    /*------------------------------------------------------------------------
     *              PRIVATE VARIABLES
     */
    let games;
    let gamesLoaded = false;
  
    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */
    let compare;
    let groupByKey;
    let decodeIamge;
    let init;  
    let loadGames;
    let showGames;
    let selectGame;

    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    compare = function( a, b ) {
        if ( Date.parse(a.date_created) > Date.parse(b.date_created) ){
            return -1;
          }
          if ( Date.parse(a.date_created) < Date.parse(b.date_created) ){
            return 1;
          }
            return 0;
          }

    groupByKey = function (array, key) {

        return array
        .reduce((hash, obj) => {
          if(obj[key] === undefined) return hash; 
          return Object.assign(hash, { [obj[key]]:( hash[obj[key]] || [] ).concat(obj)})
        }, {})
     }
    


    init = function(onInitializedCallback) {
        console.log("Started Games init...");
        window.scrollTo(0,0)
        loadGames();
    };

    loadGames = function(){
        Global.ajax(GAMES_URL, function(data) {
            games = data;
            games.sort(compare)
            console.log(games)
            gamesLoaded = true;
            showGames();
            })
    }
    showGames = function(){
        if(gamesLoaded){
            let grid = document.getElementById('games_grid');
            let gridContent = ''
            games.forEach(element =>{ 
                let image = Global.decodeImage(element.type)
                gridContent += `<div class="grid-card ${element.color}_card header white-text flex-column">
                                    <div class="card_title header xs">${element.name}</div>
                                    <div class="card_image">
                                        <img src="../images/logos/${image}">
                                    </div>
                                    <p class="card_select header xs pointer" onclick="selectGame(${element.id})" style="margin-bottom: 0px;">Select</p>
                                </div>` 
            });
            grid.innerHTML = gridContent;
        }
        else{
            loadGames()
        }

    }
    
    selectGame = function(id){
        games.forEach(element => {
            if(element.id == id){
                localStorage.setItem("currentGame", JSON.stringify(element))
                switch(element.type){
                    case "famFued":
                        setTimeout(function(){location.replace("famFued.html")},150);
                        break;
                    case "millionare":
                        setTimeout(function(){location.replace("millionare.html")},150);
                        break;
                    case "jeopardy":
                        setTimeout(function(){location.replace("jeopardy.html")},150);
                        break;
                    case "price":
                        setTimeout(function(){location.replace("price.html")},150);
                        break;
                }
            }
        });
    }
  
    /*------------------------------------------------------------------------
     *              PUBLIC METHODS
     */
    return {
        init,
        selectGame,
    };
  }());
  