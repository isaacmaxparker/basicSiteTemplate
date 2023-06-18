/*property

*/


const Games = (function () {
    "use strict";

    /*------------------------------------------------------------------------
     *              CONSTANTS
     */
    const ANIMATION_DURATION = 800;
    const GAMES_URL = 'https://raw.githubusercontent.com/isaacmaxparker/JSON/main/Games/games.json';
    const FILTERS_LENGTH = 5;
    const TAGS_LENGTH = 3;
    const TYPES_LENGTH = 6;
    const RATES_LENGTH = 5;
    const YEARS_LENGTH = 6;
    const RATE_OPTIONS = ['1','2','3','4','5'];

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
    let getRatingTab;
    let init;
    let checkRating;
    let loadGames;
    let showGames;
    let selectGame;
    let toggleFilterButtonPress;
    let toggleTagButtonPress;
    let toggleYearButtonPress;
    let toggleTypeButtonPress;
    let toggleRateButtonPress;
    let loadFilters;
    let loadTags;
    let loadTypes;
    let loadYears;
    let loadRates;
    let showHideAll;
    let showHideAllTags;
    let showHideAllTypes;
    let showHideAllYears;
    let showHideAllRates;

    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    checkRating = (card, rating_to_check) =>{
        if(rating_to_check == 'All'){
            return true;
        }else{
            return rating_to_check.includes(card.getAttribute('data-rate'));
        }
    }

    getRatingTab = (rating) =>{
        let html = "<div>";
        for(let i = 0;i < rating;i++){
            html += "<span class=\"icon-close card_icon\"></span>";
        }
        html += "</div>";
        return html;
    }

    compare = function (a, b) {
        if (Date.parse(a.date_created) > Date.parse(b.date_created)) {
            return -1;
        }
        if (Date.parse(a.date_created) < Date.parse(b.date_created)) {
            return 1;
        }
        return 0;
    }

    groupByKey = function (array, key) {

        return array
            .reduce((hash, obj) => {
                if (obj[key] === undefined) return hash;
                return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) })
            }, {})
    }



    init = function (onInitializedCallback) {
        console.log("Started Games init...");
        window.scrollTo(0, 0)
        loadGames();
    };

    loadGames = function () {
        Global.ajax(GAMES_URL, function (data) {
            games = data;
            games.sort(compare)
            gamesLoaded = true;
            showGames();
        })
    }

    loadFilters = () => {
        let activestatuses = Global.getValue('filters');
        if (activestatuses) {
            activestatuses = activestatuses.split(",")

            let filter_buttons = document.getElementsByClassName('filter_button');
            var filter_array = Array.prototype.slice.call(filter_buttons)
            filter_array.forEach(element => {
                if (activestatuses.includes(element.getAttribute('data-filter'))) {
                    element.classList.add('active_filter');
                } else {
                    element.classList.remove('active_filter');
                }
            });

            let game_cards = document.getElementsByClassName('grid-card')
            var card_array = Array.prototype.slice.call(game_cards)

            if (activestatuses.length == FILTERS_LENGTH) {
                filter_array.forEach(element => {
                    element.classList.add('active_filter')
                });
                showHideAll(card_array, true)
            } else if (activestatuses.length == 0) {
                filter_array.forEach(element => {
                    element.classList.remove('active_filter')
                });
                showHideAll(card_array, false)
            } else {
                document.getElementById('all_switch').classList.add('active_filter')
                document.getElementById('none_switch').classList.add('active_filter')
                activestatuses.forEach(status => {
                    card_array.forEach(element => {
                        if (activestatuses.includes(element.getAttribute('data-status'), status)) {
                            element.classList.remove('hidden_card')
                        } else {
                            element.classList.add('hidden_card')
                        }
                    });
                });
            }
        }
    }

    loadRates = () => {
        let activestatuses = Global.getValue('rates');
        if (activestatuses) {
            activestatuses = activestatuses.split(",")

            let filter_buttons = document.getElementsByClassName('rate_button');
            var filter_array = Array.prototype.slice.call(filter_buttons)
            filter_array.forEach(element => {
                if (activestatuses.includes(element.getAttribute('data-tag'))) {
                    element.classList.add('active_filter');
                } else {
                    element.classList.remove('active_filter');
                }
            });

            let game_cards = document.getElementsByClassName('grid-card')
            var card_array = Array.prototype.slice.call(game_cards)
            if(activestatuses.length != RATES_LENGTH){
                card_array.forEach(element => {
                    if (checkRating(element,activestatuses)) {
                        element.classList.remove('hidden_card_rate')
                    } else {
                        element.classList.add('hidden_card_rate')
                    }
                });
            }
        }
    }

    loadTags = () => {
        let activestatuses = Global.getValue('tags');
        if (activestatuses) {
            activestatuses = activestatuses.split(",")

            let filter_buttons = document.getElementsByClassName('tag_button');
            var filter_array = Array.prototype.slice.call(filter_buttons)
            filter_array.forEach(element => {
                if (activestatuses.includes(element.getAttribute('data-tag'))) {
                    element.classList.add('active_filter');
                } else {
                    element.classList.remove('active_filter');
                }
            });

            let game_cards = document.getElementsByClassName('grid-card')
            var card_array = Array.prototype.slice.call(game_cards)

            if (activestatuses.length == TAGS_LENGTH) {
                filter_array.forEach(element => {
                    element.classList.add('active_filter')
                });
                showHideAll(card_array, true)
            } else if (activestatuses.length == 0) {
                filter_array.forEach(element => {
                    element.classList.remove('active_filter')
                });
                showHideAll(card_array, false)
            } else {
                document.getElementById('all_tags_switch').classList.add('active_filter')
                document.getElementById('none_tags_switch').classList.add('active_filter')
                card_array.forEach(element => {
                    let show = false;
                    let element_tags = element.getAttribute('data-tags').split(",");
                    activestatuses.forEach(tag => {
                        if (element_tags.includes(tag)) {
                            show = true;
                        }
                    });


                    if (show) {
                        element.classList.remove('hidden_card_tag')
                    } else {
                        element.classList.add('hidden_card_tag')
                    }
                });
            }
        }
    }

    loadTypes = () => {
        let activestatuses = Global.getValue('types');
        if (activestatuses) {
            activestatuses = activestatuses.split(",")

            let filter_buttons = document.getElementsByClassName('type_button');
            var filter_array = Array.prototype.slice.call(filter_buttons)
            filter_array.forEach(element => {
                if (activestatuses.includes(element.getAttribute('data-tag'))) {
                    element.classList.add('active_filter');
                } else {
                    element.classList.remove('active_filter');
                }
            });

            let game_cards = document.getElementsByClassName('grid-card')
            var card_array = Array.prototype.slice.call(game_cards)

            if (activestatuses.length == TAGS_LENGTH) {
                filter_array.forEach(element => {
                    element.classList.add('active_filter')
                });
                showHideAll(card_array, true)
            } else if (activestatuses.length == 0) {
                filter_array.forEach(element => {
                    element.classList.remove('active_filter')
                });
                showHideAll(card_array, false)
            } else {
                document.getElementById('all_types_switch').classList.add('active_filter')
                document.getElementById('none_types_switch').classList.add('active_filter')
                card_array.forEach(element => {
                    let show = false;
                    let element_tags = element.getAttribute('data-type');
                    activestatuses.forEach(tag => {
                        if (element_tags.includes(tag)) {
                            show = true;
                        }
                    });


                    if (show) {
                        element.classList.remove('hidden_card_type')
                    } else {
                        element.classList.add('hidden_card_type')
                    }
                });
            }
        }
    }

    loadYears = () => {
        let activestatuses = Global.getValue('year');
        let game_cards = document.getElementsByClassName('grid-card')
        var card_array = Array.prototype.slice.call(game_cards)

        if (activestatuses) {
            document.querySelector('[data-tag="' + activestatuses + '"]').classList.add('active_filter')
            card_array.forEach(card => {
                let show = false;
                const card_year = card.getAttribute('data-year').substring(card.getAttribute('data-year').length - 4, card.getAttribute('data-year').length);
                const card_month = card.getAttribute('data-year').substring(0, card.getAttribute('data-year').indexOf('-'));
                const card_day = card.getAttribute('data-year').substring(card.getAttribute('data-year').indexOf('-') + 1, findNthOccurence(card.getAttribute('data-year'), 2, '-'));
                const card_time = new Date(card_year, card_month - 1, card_day);
                const today = new Date();
                const oneWeekAgo = new Date(today.setDate(today.getDate() - 7));
                const twoWeeksAgo = new Date(today.setDate(today.getDate() - 14));
                const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
                const threeMonthAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
                const sixMonthAgo = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
                const thisYearStart = new Date(today.getFullYear(), 0, 1);
                const thisYearEnd = new Date(today.getFullYear(), 11, 31);

                switch (activestatuses) {
                    case "any":
                        show = true;
                        break;
                    case "1wk":
                        if (card_time >= oneWeekAgo) {
                            show = true;
                        }
                        break;
                    case "2wk":
                        if (card_time >= twoWeeksAgo) {
                            show = true;
                        }
                        break;
                    case "1mo":
                        if (card_time >= oneMonthAgo) {
                            show = true;
                        }
                        break;
                    case "3mo":
                        if (card_time >= threeMonthAgo && card_time <= oneMonthAgo) {
                            show = true;
                        }
                        break;
                    case "6mo":
                        if (card_time >= sixMonthAgo && card_time <= threeMonthAgo) {
                            show = true;
                        }
                        break;
                    case "year":
                        if (card_time >= thisYearStart && card_time <= thisYearEnd) {
                            show = true;
                        }
                        break;
                    case "earlier":
                        if (card_time <= thisYearStart) {
                            show = true;
                        }
                        break;
                }

                if (show) {
                    card.classList.remove('hidden_card_year')
                } else {
                    card.classList.add('hidden_card_year')
                }
            });
        } else {
            document.getElementById('1month').classList.add('active_filter')
        }
    }

    showGames = function () {
        if (gamesLoaded) {
            let grid = document.getElementById('games_grid');
            let gridContent = ''
            games.forEach(element => {
                let image = Global.decodeImage(element.type)
                gridContent += `<div data-status=${element.status} data-tags="${element.tags ? element.tags : ''}" data-type="${element.type}" data-year="${element.date_created}" data-rate="${element.rating ? element.rating : 'unrated'}" class="grid-card ${element.color}_card header white-text flex-column">
                                <div class="card_rating ${element.rating ? '' : 'hidden_card_rate'}">${getRatingTab(element.rating)}</div>                    
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
            loadTypes();
            loadYears();
            loadRates();
        }
        else {
            loadGames()
        }

    }

    selectGame = function (id) {
        games.forEach(element => {
            if (element.id == id) {
                localStorage.setItem("currentGame", JSON.stringify(element))
                switch (element.type) {
                    case "famFued":
                        setTimeout(function () { location.replace("famFued.html") }, 150);
                        break;
                    case "millionare":
                        setTimeout(function () { location.replace("millionare.html") }, 150);
                        break;
                    case "jeopardy":
                        setTimeout(function () { location.replace("jeopardy.html") }, 150);
                        break;
                    case "price":
                        setTimeout(function () { location.replace("price.html") }, 150);
                        break;
                    case "wheel":
                        setTimeout(function () { location.replace("wheel.html") }, 150);
                        break;
                    case "deal":
                        setTimeout(function () { location.replace("deal.html") }, 150);
                        break;
                    case "eyespy":
                        setTimeout(function () { location.replace("eyespy.html") }, 150);
                        break;
                    case "scatter":
                        setTimeout(function () { location.replace("scatter.html") }, 150);
                        break;
                    case "voice":
                        setTimeout(function () { location.replace("voice.html") }, 150);
                        break;
                    case "cards":
                        setTimeout(function () { location.replace("cards.html") }, 150);
                        break;
                    case "throw":
                        setTimeout(function () { location.replace("cards.html") }, 150);
                        break;
                }
            }
        });
    }

    toggleFilterButtonPress = function (element) {
        let status = element.getAttribute('data-filter');
        let game_cards = document.getElementsByClassName('grid-card')
        var card_array = Array.prototype.slice.call(game_cards)
        let activeswitch = element.classList.contains('active_filter');

        if (activeswitch) {
            element.classList.remove('active_filter')
        } else {
            element.classList.add('active_filter')
        }

        let filter_buttons = document.getElementsByClassName('filter_button');
        var filter_array = Array.prototype.slice.call(filter_buttons)
        let activestatuses = [];
        filter_array.forEach(element => {
            if (element.classList.contains('active_filter') && element.getAttribute('data-filter') != 'All' && element.getAttribute('data-filter') != 'N') {
                activestatuses.push(element.getAttribute('data-filter'))
            }
        });

        if (status != 'All' && status != 'N') {
            if (activestatuses.length == FILTERS_LENGTH) {
                status = 'All';
            } else if (activestatuses.length == 0) {
                status = 'N'
            } else {
                document.getElementById('all_switch').classList.add('active_filter')
                document.getElementById('none_switch').classList.add('active_filter')
            }
        }

        if (status == 'All') {
            filter_array.forEach(element => {
                element.classList.add('active_filter')

                if (!activestatuses.includes(element.getAttribute('data-filter'))) {
                    activestatuses.push(element.getAttribute('data-filter'))
                }

            });
            showHideAll(card_array, true)

        }
        else if (status == 'N') {
            filter_array.forEach(element => {
                element.classList.remove('active_filter')
            });
            showHideAll(card_array, false)
            activestatuses = [];
        } else {
            card_array.forEach(element => {
                if (activestatuses.includes(element.getAttribute('data-status'), status)) {
                    element.classList.remove('hidden_card')
                } else {
                    element.classList.add('hidden_card')
                }
            });
        }
        Global.setValue('filters', activestatuses.join(","))
    }

    toggleRateButtonPress = (element) =>{
        let status = element.getAttribute('data-tag');
        let game_cards = document.getElementsByClassName('grid-card')
        var card_array = Array.prototype.slice.call(game_cards)
        let activeswitch = element.classList.contains('active_filter');
        let filter_buttons = document.getElementsByClassName('rate_button');
        var filter_array = Array.prototype.slice.call(filter_buttons)
        let activetags = [];

        if(status != 'All' && status != 'Rated' && status != 'Unrated' && element.classList.contains('active_filter')){
            element.classList.remove('active_filter');
        }else{
            element.classList.add('active_filter');
        }
        
        filter_array.forEach(element => {
            if (element.classList.contains('active_filter') && element.getAttribute('data-tag') != 'All' && element.getAttribute('data-tag') != 'N') {
                activetags.push(element.getAttribute('data-tag'))
            }
        });
        if (status != 'All' && status != 'Rated' && status != 'Unrated') {
            if (activetags.length == RATES_LENGTH) {
                status = 'All';
            }
        }
        Global.setValue('rates', activetags.join(","))


        activetags.forEach(tag => {
            if (checkRating(element,tag)) {
                show = true;
            }
        });

        if (status == 'All') {
            filter_array.forEach(element => {
                element.classList.add('active_filter')
                if (!activetags.includes(element.getAttribute('data-tag'))) {
                    activetags.push(element.getAttribute('data-tag'))
                }
            });
            card_array.forEach(element => {
                let show = checkRating(element,status)
                
                if (show) {
                    element.classList.remove('hidden_card_rate')
                } else {
                    element.classList.add('hidden_card_rate')
                }
            });

        }
        else if (status == 'Rated') {
            filter_array.forEach(element => {
                element.classList.add('active_filter')
                if (!activetags.includes(element.getAttribute('data-tag'))) {
                    activetags.push(element.getAttribute('data-tag'))
                }
            });
            card_array.forEach(card => {
                let show = checkRating(card,RATE_OPTIONS)
                
                if (show) {
                    card.classList.remove('hidden_card_rate')
                } else {
                    card.classList.add('hidden_card_rate')
                }
            });

        }
        else if (status == 'Unrated') {
            filter_array.forEach(element => {
                element.classList.remove('active_filter')
            });
            activetags = [];
            Global.setValue('rates',[]);
            card_array.forEach(card => {
                let show = checkRating(card,['unrated'])
                if (show) {
                    card.classList.remove('hidden_card_rate')
                } else {
                    card.classList.add('hidden_card_rate')
                }
            });

        } else {
            filter_array.forEach(element => {
                if(activetags.includes(element.getAttribute('data-tag'))){
                    element.classList.add('active_filter');
                }else{
                    element.classList.remove('active_filter');
                }
            });
            card_array.forEach(card => {
                let show = checkRating(card,activetags)
                if (show) {
                    card.classList.remove('hidden_card_rate')
                } else {
                    card.classList.add('hidden_card_rate')
                }
            });
        }
    }

    toggleTagButtonPress = function (element) {
        let status = element.getAttribute('data-tag');
        let game_cards = document.getElementsByClassName('grid-card')
        var card_array = Array.prototype.slice.call(game_cards)
        let activeswitch = element.classList.contains('active_filter');

        if (activeswitch) {
            element.classList.remove('active_filter')
        } else {
            element.classList.add('active_filter')
        }

        let filter_buttons = document.getElementsByClassName('tag_button');
        var filter_array = Array.prototype.slice.call(filter_buttons)
        let activetags = [];
        filter_array.forEach(element => {
            if (element.classList.contains('active_filter') && element.getAttribute('data-tag') != 'All' && element.getAttribute('data-tag') != 'N') {
                activetags.push(element.getAttribute('data-tag'))
            }
        });
        if (status != 'All' && status != 'N') {
            if (activetags.length == TAGS_LENGTH) {
                status = 'All';
            } else if (activetags.length == 0) {
                status = 'N'
            } else {
                document.getElementById('all_tags_switch').classList.add('active_filter')
                document.getElementById('none_tags_switch').classList.add('active_filter')
            }
        }
        Global.setValue('tags', activetags.join(","))
        if (status == 'All') {
            filter_array.forEach(element => {
                element.classList.add('active_filter')
            });
            showHideAllTags(card_array, true);

            if (!activetags.includes(element.getAttribute('data-tag'))) {
                activetags.push(element.getAttribute('data-tag'))
            }

        }
        else if (status == 'N') {
            filter_array.forEach(element => {
                element.classList.remove('active_filter')
            });
            showHideAllTags(card_array, false)

        } else {
            card_array.forEach(element => {
                let show = false;
                let element_tags = element.getAttribute('data-tags').split(",");
                activetags.forEach(tag => {
                    if (element_tags.includes(tag)) {
                        show = true;
                    }
                });


                if (show) {
                    element.classList.remove('hidden_card_tag')
                } else {
                    element.classList.add('hidden_card_tag')
                }
            });
        }
    }

    toggleTypeButtonPress = function (element) {
        let status = element.getAttribute('data-tag');
        let game_cards = document.getElementsByClassName('grid-card')
        var card_array = Array.prototype.slice.call(game_cards)
        let activeswitch = element.classList.contains('active_filter');

        if (activeswitch) {
            element.classList.remove('active_filter')
        } else {
            element.classList.add('active_filter')
        }

        let filter_buttons = document.getElementsByClassName('type_button');
        var filter_array = Array.prototype.slice.call(filter_buttons)
        let activetags = [];
        filter_array.forEach(element => {
            if (element.classList.contains('active_filter') && element.getAttribute('data-tag') != 'All' && element.getAttribute('data-tag') != 'N') {
                activetags.push(element.getAttribute('data-tag'))
            }
        });
        if (status != 'All' && status != 'N') {
            if (activetags.length == TYPES_LENGTH) {
                status = 'All';
            } else if (activetags.length == 0) {
                status = 'N'
            } else {
                document.getElementById('all_types_switch').classList.add('active_filter')
                document.getElementById('none_types_switch').classList.add('active_filter')
            }
        }
        Global.setValue('types', activetags.join(","))
        if (status == 'All') {
            filter_array.forEach(element => {
                element.classList.add('active_filter')
            });
            showHideAllTypes(card_array, true);

            if (!activetags.includes(element.getAttribute('data-tag'))) {
                activetags.push(element.getAttribute('data-tag'))
            }

        }
        else if (status == 'N') {
            filter_array.forEach(element => {
                element.classList.remove('active_filter')
            });
            showHideAllTypes(card_array, false)

        } else {
            card_array.forEach(element => {
                let show = false;
                let element_tags = element.getAttribute('data-type');
                activetags.forEach(tag => {
                    if (element_tags.includes(tag)) {
                        show = true;
                    }
                });


                if (show) {
                    element.classList.remove('hidden_card_type')
                } else {
                    element.classList.add('hidden_card_type')
                }
            });
        }
    }

    toggleYearButtonPress = function (element) {
        let game_cards = document.getElementsByClassName('grid-card')
        var card_array = Array.prototype.slice.call(game_cards)
        let activeswitch = element.classList.contains('active_filter');

        if (activeswitch) {
            element.classList.remove('active_filter')
        } else {
            element.classList.add('active_filter')
        }

        let filter_buttons = document.getElementsByClassName('year_button');
        var filter_array = Array.prototype.slice.call(filter_buttons)
        let activetags = [];
        filter_array.forEach(subelement => {
            if (subelement.classList.contains('active_filter')) {
                if (subelement.getAttribute('data-tag') != element.getAttribute('data-tag')) {
                    subelement.classList.remove('active_filter')
                }
                activetags.push(element.getAttribute('data-tag'))
            }
        });
        card_array.forEach(card => {
            let show = false;
            const card_year = card.getAttribute('data-year').substring(card.getAttribute('data-year').length - 4, card.getAttribute('data-year').length);
            const card_month = card.getAttribute('data-year').substring(0, card.getAttribute('data-year').indexOf('-'));
            const card_day = card.getAttribute('data-year').substring(card.getAttribute('data-year').indexOf('-') + 1, findNthOccurence(card.getAttribute('data-year'), 2, '-'));
            const card_time = new Date(card_year, card_month - 1, card_day);
            const today = new Date();
            const oneWeekAgo = new Date(today.setDate(today.getDate() - 7));
            const twoWeeksAgo = new Date(today.setDate(today.getDate() - 14));
            const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
            const threeMonthAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
            const sixMonthAgo = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
            const thisYearStart = new Date(today.getFullYear(), 0, 1);
            const thisYearEnd = new Date(today.getFullYear(), 11, 31);

            Global.setValue('year', element.getAttribute('data-tag'));
            switch (element.getAttribute('data-tag')) {
                case "any":
                    show = true;
                    break;
                case "1wk":
                    if (card_time >= oneWeekAgo) {
                        show = true;
                    }
                    break;
                case "2wk":
                    if (card_time >= twoWeeksAgo) {
                        show = true;
                    }
                    break;
                case "1mo":
                    if (card_time >= oneMonthAgo) {
                        show = true;
                    }
                    break;
                case "3mo":
                    if (card_time >= threeMonthAgo && card_time <= oneMonthAgo) {
                        show = true;
                    }
                    break;
                case "6mo":
                    if (card_time >= sixMonthAgo && card_time <= threeMonthAgo) {
                        show = true;
                    }
                    break;
                case "year":
                    if (card_time >= thisYearStart && card_time <= thisYearEnd) {
                        show = true;
                    }
                    break;
                case "earlier":
                    if (card_time <= thisYearStart) {
                        show = true;
                    }
                    break;
            }

            if (show) {
                card.classList.remove('hidden_card_year')
            } else {
                card.classList.add('hidden_card_year')
            }
        });
    }

    const findNthOccurence = (string, nth, char) => {
        let index = 0
        for (let i = 0; i < nth; i += 1) {
            if (index !== -1) index = string.indexOf(char, index + 1)
        }
        return index
    }

    showHideAllYears = (cards, show) => {
        if (show) {
            document.getElementById('all_years_switch').classList.remove('active_filter')
            document.getElementById('none_years_switch').classList.add('active_filter')
            cards.forEach(element => {
                element.classList.remove('hidden_card_year')
            });
        } else {
            document.getElementById('all_years_switch').classList.add('active_filter')
            document.getElementById('none_years_switch').classList.remove('active_filter')
            cards.forEach(element => {
                element.classList.add('hidden_card_year')
            });
        }
    }


    showHideAllTypes = (cards, show) => {
        if (show) {
            document.getElementById('all_types_switch').classList.remove('active_filter')
            document.getElementById('none_types_switch').classList.add('active_filter')
            cards.forEach(element => {
                element.classList.remove('hidden_card_type')
            });
        } else {
            document.getElementById('all_types_switch').classList.add('active_filter')
            document.getElementById('none_types_switch').classList.remove('active_filter')
            cards.forEach(element => {
                element.classList.add('hidden_card_ype')
            });
        }
    }

    showHideAllTags = (cards, show) => {
        if (show) {
            document.getElementById('all_tags_switch').classList.remove('active_filter')
            document.getElementById('none_tags_switch').classList.add('active_filter')
            cards.forEach(element => {
                element.classList.remove('hidden_card_tag')
            });
        } else {
            document.getElementById('all_tags_switch').classList.add('active_filter')
            document.getElementById('none_tags_switch').classList.remove('active_filter')
            cards.forEach(element => {
                element.classList.add('hidden_card_tag')
            });
        }
    }

    showHideAll = (cards, show) => {
        if (show) {
            document.getElementById('all_switch').classList.remove('active_filter')
            document.getElementById('none_switch').classList.add('active_filter')
            cards.forEach(element => {
                element.classList.remove('hidden_card')
            });
        } else {
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
        toggleTypeButtonPress,
        toggleYearButtonPress,
        showHideAllYears,
        toggleRateButtonPress,
    };
}());
