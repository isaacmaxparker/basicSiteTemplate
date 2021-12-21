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
    let toggleFilterButtonPress;
    let showHideAll;

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
                gridContent += `<div data-status=${element.status} class="grid-card ${element.color}_card header white-text flex-column">
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

    toggleFilterButtonPress = function(element){
        let status = element.getAttribute('data-filter');
        let game_cards = document.getElementsByClassName('grid-card')
        var card_array = Array.prototype.slice.call( game_cards )
        let activeswitch = element.classList.contains('active_filter');

        if(activeswitch){
            element.classList.remove('active_filter')
        }else{
            element.classList.add('active_filter')
        }

        let filter_buttons = document.getElementsByClassName('filter_button');
        var filter_array = Array.prototype.slice.call( filter_buttons )
        let activestatuses = [];
        filter_array.forEach(element => {
            if(element.classList.contains('active_filter') && element.getAttribute('data-filter') != 'All' && element.getAttribute('data-filter') != 'N'){
                activestatuses.push(element.getAttribute('data-filter'))
            }
        });
        if(status != 'All' && status != 'N'){
            if(activestatuses.length == 5){
                status = 'All';
            }else if(activestatuses.length == 0){
                status = 'N'
            }else{
                document.getElementById('all_switch').classList.add('active_filter')
                document.getElementById('none_switch').classList.add('active_filter')
            }
        }

        console.log(status)
        if(status == 'All'){
            filter_array.forEach(element => {
                element.classList.add('active_filter')
            });
            showHideAll(card_array, true)

        }
        else if(status == 'N'){
            filter_array.forEach(element => {
                element.classList.remove('active_filter')
            });
            showHideAll(card_array, false)

        } else {
            card_array.forEach(element => {
                if(activestatuses.includes(element.getAttribute('data-status'),status)){
                    element.classList.remove('hidden_card')
                }else{
                    element.classList.add('hidden_card')
                }
            });
        }
    }

    showHideAll = (cards, show) => {
        if(show){
            document.getElementById('all_switch').classList.remove('active_filter')
            document.getElementById('none_switch').classList.add('active_filter')
            cards.forEach(element => {
                element.classList.remove('hidden_card')
            });
        }else{
            document.getElementById('all_switch').classList.add('active_filter')
            document.getElementById('none_switch').classList.remove('active_filter')
            cards.forEach(element => {
                element.classList.add('hidden_card')
            });
        }
    }
  
    /*------------------------------------------------------------------------
     *              PUBLIC METHODS
     */
    return {
        init,
        selectGame,
        toggleFilterButtonPress,
    };
  }());
  