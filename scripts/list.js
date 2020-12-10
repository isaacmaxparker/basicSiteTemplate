/*property

*/


const List = (function() {
    "use strict";
  
    /*------------------------------------------------------------------------
     *              CONSTANTS
     */
    const RECIPIES_JSON_URL = "https://raw.githubusercontent.com/isaacmcdgl/JSON/main/RecipieProject/Recipies.JSON";
    const LIST_CONTAINER_ID = "RecipieList"
    const LIST_ITEM_DIV_CLASS = ".listGroup"
    const LIST_ID = "RecipieList";
    const LIST_ITEM_CLASS = ".listItem";
    const TIME_RANGE_ID = "timeRange";
    const SORT_BY_ID = "sortby";
    const SEARCH_BOX_ID = "searchbox"
    
    /*------------------------------------------------------------------------
     *              PRIVATE VARIABLES
     */
    let recipies;
    let sortedRecipies;
    let types = ["entree","side","bread","soup","dessert","drink"];
    let meals = ["breakfast","lunch","dinner","snack"];
  
    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    let buildRecipieCard;
    let buildRecipieSection;
    let changeTime;
    let cleanupCategories;
    let determineTime;
    let checkFilter;
    let filterList;
    let groupByKey;
    let getMealFilters;
    let getTypeFilters;
    let init;
    let loadrecipies;
    let pullrecipies;
    let selectAll;
    let sortRecipies;
    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

     buildRecipieCard = function(recipie){
        let time = recipie.total_time;
        if(time > 60){
            let hours = Math.trunc(time/60);
            let h = " hour ";
            if(hours > 1){
                h = " hours "
            }
            let minutes = time % 60;
            time = hours + h + minutes + " minutes";
        }else{
            time = time + " minutes"
        }
        let recipieString;
        recipieString = `<div class='listItem flex-row item-${recipie.color}' data-name="${recipie.name.toLowerCase()}" data-type='${recipie.category}' data-meal='${recipie.meal}' data-submeal='${recipie.submeal}' data-time='${recipie.total_time}'>`
        recipieString += `<div class='listItemDetail listItemName'>${recipie.name}</div>`
        recipieString += "<div class='listItemDetails flex-row'>"
        recipieString += `<div class='listItemDetail listItemIcon'><img src='images/icons/no-border/${recipie.category}.png'></div>`
        recipieString += "<div class='listItemSpacer'></div>"
        recipieString += `<div class='listItemDetail listItemType'>${recipie.category}</div>`
        //recipieString += "<div class='listItemSpacer'></div>"
        recipieString += `<div class='listItemDetail listItemTime'>${time}</div>`
        recipieString += "</div></div>"

        return recipieString;
     }

     buildRecipieSection = function(recipieGroup, groupName){
         let groupString = '<div class="listGroup">'; 
         groupString += `<div class="listSeparator"> 
         <div class="preLine"> 
             <div class="lineContainer flex-column">
                 <div class="listSeparatorLine"></div>
             </div>
         </div> 
           
         <div class="lineSeparatorName"> 
             <div class="lineContainer flex-column">
                 ${groupName}
             </div>
         </div> 
           
         <div class="postLine"> 
             <div class="lineContainer flex-column">
                 <div class="listSeparatorLine"></div>
             </div>
         </div>  
     </div>    `

        if(document.getElementById(SORT_BY_ID).value == "time_range"){
            recipieGroup.sort((a, b) => (a.total_time > b.total_time) ? 1 : -1);
        }else{
            recipieGroup.sort((a, b) => (a.name > b.name) ? 1 : -1); 
        }
         
         recipieGroup.forEach(element => {
            groupString += buildRecipieCard(element);
         });
         groupString+="</div>";
         return groupString;

     }

     changeTime = function(slider, timeDivID){
         let niceTime = determineTime(slider.value)[0];
        document.getElementById(timeDivID).innerHTML = niceTime;
     }

     cleanupCategories = function(){
        let items = document.getElementById(LIST_ID).querySelectorAll(LIST_ITEM_DIV_CLASS);
        items.forEach(element => {
            let x = true;
            for(let i = 0; i < element.children.length; i++){
                if(element.children[i].style.display == 'flex'){
                    x = false; 
                }
            }

            if(x){
                element.style.display = 'none';
            }
            else{
                element.style.display = 'block';
            }
        });
     }

     checkFilter = function(checkboxID){
        let checkbox = document.getElementById(checkboxID);
        checkbox.click();
        filterList();
     }

     determineTime = function(timekey){
        switch(timekey){
            case "1":
                return ["10 minutes",10]
            case "2":
                return ["30 minutes",30]
            case "3": 
                return ["1 hour",60]
            case "4":
                return ["1.5 hours",90]
            case "5":
                return ["2 hours",120]
            case "6":
                return ["2.5 hours",150]
            case "7": 
                return ["3 hours",180]
            case "8":
                return ["4 hours", 240]
            case "9":
                return ["No Max", 1000]
        }
     }

    filterList = function(){
        console.log("Refiltering");
        let items = document.getElementById(LIST_ID).querySelectorAll(LIST_ITEM_CLASS);
        let types = getTypeFilters();
        let meals = getMealFilters();
        let time = determineTime(document.getElementById(TIME_RANGE_ID).value)[1];
        let search = document.getElementById(SEARCH_BOX_ID).value;
        console.log(search);
        if(search != ""){
        for(let i = 0;i<items.length;i++){
           let item = items[i];
           if(item.getAttribute('data-name').includes(search) && types.includes(item.getAttribute('data-type')) && (meals.includes(item.getAttribute('data-meal')) || meals.includes(item.getAttribute('data-submeal')) ) && item.getAttribute('data-time') <= time){
               item.style.display = "flex";
           }
           else{
               item.style.display = "none";
           }
        }
        }
        else{
            for(let i = 0;i<items.length;i++){
                let item = items[i];
                if(types.includes(item.getAttribute('data-type')) && (meals.includes(item.getAttribute('data-meal')) || meals.includes(item.getAttribute('data-submeal')) ) && item.getAttribute('data-time') <= time){
                    item.style.display = "flex";
                }
                else{
                    item.style.display = "none";
                }
             }
        }
        cleanupCategories();
    }

    groupByKey = function (array, key) {

        return array
        .reduce((hash, obj) => {
          if(obj[key] === undefined) return hash; 
          return Object.assign(hash, { [obj[key]]:( hash[obj[key]] || [] ).concat(obj)})
        }, {})
     }
    
    getTypeFilters = function(){
        let returnArray = [];
        types.forEach(element => {
            if(document.getElementById("filter-" + element).checked){
                returnArray.push(element);
            }
        });
        return returnArray;
    }

    getMealFilters = function(){
        let returnArray = [];
        meals.forEach(element => {
            if(document.getElementById("filter-" + element).checked){
                returnArray.push(element);
            }
        });
        return returnArray;
    }
  
    init = function(onInitializedCallback) {
        console.log("Started List init...");
        window.scrollTo(0,0)
        pullrecipies();
    };

    loadrecipies = function(){
        let container = document.getElementById(LIST_CONTAINER_ID);
        let contentString = '';

        sortedRecipies.forEach(element => {
            if(element[0].charAt(1)=="-"){
                contentString += buildRecipieSection(element[1],element[0].substr(2))
            }else{
                contentString += buildRecipieSection(element[1],element[0])
            }
        });

        container.innerHTML = contentString;
    }

    pullrecipies = function(){
        Global.ajax(RECIPIES_JSON_URL, function(data)
        {
            recipies = data;
            sortRecipies();
        });
    }

    selectAll = function(filterID, all=true){
        let inputs = document.getElementById(filterID).querySelectorAll("input")
        for(let i = 0;i<inputs.length;i++){
            if(all){
                inputs[i].checked = true;
            }else{
                inputs[i].checked = false;
            }
        }
        filterList()
    }

    sortRecipies = function(){
        let sortby = document.getElementById(SORT_BY_ID).value
        sortedRecipies = groupByKey(recipies, sortby);
        
        var sortable = [];
        for (var vehicle in sortedRecipies) {
            sortable.push([vehicle, sortedRecipies[vehicle]]);
        }

        console.log(sortable);
        sortable.sort();

        sortedRecipies = sortable;
        loadrecipies();
        filterList();
    }
  
    /*------------------------------------------------------------------------
     *              PUBLIC METHODS
     */
    return {
        init,
        checkFilter,
        changeTime,
        selectAll,
        filterList,
        sortRecipies,
    };
  }());
  