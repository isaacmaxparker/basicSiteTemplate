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
    let toggleTagButtonPress;
    let loadFilters;
    let loadTags;
    let showHideAll;
    let showHideAllTags;

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

    loadFilters = () =>{
       let activestatuses = Global.getValue('filters');
       if (activestatuses){
           activestatuses = activestatuses.split(",")
           console.log(activestatuses)

           let filter_buttons = document.getElementsByClassName('filter_button');
           var filter_array = Array.prototype.slice.call( filter_buttons )
           filter_array.forEach(element => {
               if(activestatuses.includes(element.getAttribute('data-filter'))){
                 element.classList.add('active_filter');
               }else{
                 element.classList.remove('active_filter');
               }
           });

            let game_cards = document.getElementsByClassName('grid-card')
            var card_array = Array.prototype.slice.call( game_cards )

            if(activestatuses.length == 5){
                filter_array.forEach(element => {
                    element.classList.add('active_filter')
                });
                showHideAll(card_array, true)
            }else if(activestatuses.length == 0){
                filter_array.forEach(element => {
                    element.classList.remove('active_filter')
                });
                showHideAll(card_array, false)
            }else{
                console.log(1)
                document.getElementById('all_switch').classList.add('active_filter')
                document.getElementById('none_switch').classList.add('active_filter')
                activestatuses.forEach(status => {
                    card_array.forEach(element => {
                        if(activestatuses.includes(element.getAttribute('data-status'),status)){
                            element.classList.remove('hidden_card')
                        }else{
                            element.classList.add('hidden_card')
                        }
                    });
                });
            }
        } 
    }

    loadTags = () =>{
        let activestatuses = Global.getValue('tags');
        if (activestatuses){
            activestatuses = activestatuses.split(",")
            console.log(activestatuses)
 
            let filter_buttons = document.getElementsByClassName('tag_button');
            var filter_array = Array.prototype.slice.call( filter_buttons )
            filter_array.forEach(element => {
                if(activestatuses.includes(element.getAttribute('data-tag'))){
                  element.classList.add('active_filter');
                }else{
                  element.classList.remove('active_filter');
                }
            });
 
             let game_cards = document.getElementsByClassName('grid-card')
             var card_array = Array.prototype.slice.call( game_cards )
 
             if(activestatuses.length == 2){
                 filter_array.forEach(element => {
                     element.classList.add('active_filter')
                 });
                 showHideAll(card_array, true)
             }else if(activestatuses.length == 0){
                 filter_array.forEach(element => {
                     element.classList.remove('active_filter')
                 });
                 showHideAll(card_array, false)
             }else{
                 console.log(2)
                 document.getElementById('all_tags_switch').classList.add('active_filter')
                 document.getElementById('none_tags_switch').classList.add('active_filter')
                card_array.forEach(element => {
                let show = false;
                let element_tags = element.getAttribute('data-tags').split(",");
                    activestatuses.forEach(tag => {
                        if(element_tags.includes(tag)){
                            show = true;
                        }
                    });


                if(show){
                    element.classList.remove('hidden_card_tag')
                }else{
                    element.classList.add('hidden_card_tag')
                }
            });
             }
         } 
     }
 

    showGames = function(){
        if(gamesLoaded){
            let grid = document.getElementById('games_grid');
            let gridContent = ''
            games.forEach(element =>{ 
                let image = Global.decodeImage(element.type)
                gridContent += `<div data-status=${element.status} data-tags="${element.tags ? element.tags : ''}" class="grid-card ${element.color}_card header white-text flex-column">
                                    <div class="card_title header xs">${element.name}</div>
                                    <div class="card_image">
                                        <img src="../images/logos/${image}">
                                    </div>
                                    <p class="card_select header xs pointer" onclick="selectGame(${element.id})" style="margin-bottom: 0px;">Select</p>
                                </div>` 
            });
            grid.innerHTML = gridContent;
            loadFilters();
            loadTags();
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

                if(!activestatuses.includes(element.getAttribute('data-filter'))){
                    activestatuses.push(element.getAttribute('data-filter'))
                }

            });
            showHideAll(card_array, true)

        }
        else if(status == 'N'){
            filter_array.forEach(element => {
                element.classList.remove('active_filter')
            });
            showHideAll(card_array, false)
            activestatuses = [];
        } else {
            card_array.forEach(element => {
                if(activestatuses.includes(element.getAttribute('data-status'),status)){
                    element.classList.remove('hidden_card')
                }else{
                    element.classList.add('hidden_card')
                }
            });
        }
        Global.setValue('filters',activestatuses.join(","))
    }

    toggleTagButtonPress = function(element){
        let status = element.getAttribute('data-tag');
        let game_cards = document.getElementsByClassName('grid-card')
        var card_array = Array.prototype.slice.call( game_cards )
        let activeswitch = element.classList.contains('active_filter');

        if(activeswitch){
            element.classList.remove('active_filter')
        }else{
            element.classList.add('active_filter')
        }

        let filter_buttons = document.getElementsByClassName('tag_button');
        var filter_array = Array.prototype.slice.call( filter_buttons )
        let activetags = [];
        filter_array.forEach(element => {
            if(element.classList.contains('active_filter') && element.getAttribute('data-tag') != 'All' && element.getAttribute('data-tag') != 'N'){
                activetags.push(element.getAttribute('data-tag'))
            }
        });
        if(status != 'All' && status != 'N'){
            if(activetags.length == 2){
                status = 'All';
            }else if(activetags.length == 0){
                status = 'N'
            }else{
                document.getElementById('all_tags_switch').classList.add('active_filter')
                document.getElementById('none_tags_switch').classList.add('active_filter')
            }
        }
        Global.setValue('tags',activetags.join(","))

        console.log(status)
        if(status == 'All'){
            filter_array.forEach(element => {
                element.classList.add('active_filter')
            });
            showHideAllTags(card_array, true);

            if(!activetags.includes(element.getAttribute('data-tag'))){
                activetags.push(element.getAttribute('data-tag'))
            }

        }
        else if(status == 'N'){
            filter_array.forEach(element => {
                element.classList.remove('active_filter')
            });
            showHideAllTags(card_array, false)

        } else {
            console.log(activetags)
            card_array.forEach(element => {
                let show = false;
                let element_tags = element.getAttribute('data-tags').split(",");
                    activetags.forEach(tag => {
                        if(element_tags.includes(tag)){
                            show = true;
                        }
                    });


                if(show){
                    element.classList.remove('hidden_card_tag')
                }else{
                    element.classList.add('hidden_card_tag')
                }
            });
        }
    }

    showHideAllTags = (cards, show) => {
        if(show){
            document.getElementById('all_tags_switch').classList.remove('active_filter')
            document.getElementById('none_tags_switch').classList.add('active_filter')
            cards.forEach(element => {
                element.classList.remove('hidden_card_tag')
            });
        }else{
            document.getElementById('all_tags_switch').classList.add('active_filter')
            document.getElementById('none_tags_switch').classList.remove('active_filter')
            cards.forEach(element => {
                element.classList.add('hidden_card_tag')
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
        toggleTagButtonPress,
    };
  }());
  