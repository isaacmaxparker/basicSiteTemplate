/*property

*/


const Recipie = (function() {
    "use strict";
  
    /*------------------------------------------------------------------------
     *              CONSTANTS
     */
    const RECIPIES_JSON_URL = "https://raw.githubusercontent.com/isaacmcdgl/JSON/main/RecipieProject/Recipies.JSON";
    const SPLIT_CONTAINER_ID = "spliteSite";
    const DIVS_TO_COLOR = ["rightside","mainside","ingredientsTable","ingredientsTableDiv"]
    const INGREDIENTS_DIV_ID = "ingredientsTable"
    const INGREDIENTS_TABLE_DIV_ID = "ingredientsTableDiv"
    const MAINSIDE_DIV_ID = "mainside";
    const STEPS_DIV_ID = "stepsScrollContainer";
    const RECIPIE_IMAGE_DIV = "recipieImage";
    const STEPS_LIST_ID = "stepsList";
    const RECIPIE_INFO_DIV_ID = "recipieInfo";
    const RECIPIE_TITLE = "recipieTitle";
    const RECIPIE_NOTES = "recipieNotes";

    /*------------------------------------------------------------------------
     *              PRIVATE VARIABLES
     */
    let currentRecipie;
    let currentRecipieID;
    let toBold = [];

    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    let boldwords;
    let checkOrientation;
    let goBack;
    let loadImage;
    let loadIngredients;
    let loadRecipie;
    let loadSteps;
    let loadInfo;
    let init;
    let recolor;
    let resize;
    let pullrecipies;

    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    boldwords = function(input){
        console.log(input);
        console.log(toBold);
        return input.replace(new RegExp('(\\b)(' + toBold.join('|') + ')(\\b)','ig'), '$1<b>$2</b>$3');
    }


    checkOrientation = function(){
        if(window.innerWidth > window.innerHeight){
            document.getElementById(SPLIT_CONTAINER_ID).classList.add('flex-column');
            document.getElementById(SPLIT_CONTAINER_ID).classList.remove('flex-row');
        }else{
            document.getElementById(SPLIT_CONTAINER_ID).classList.remove('flex-column');
            document.getElementById(SPLIT_CONTAINER_ID).classList.add('flex-row');
        }
    }
    
    goBack = function(){
            window.history.back();
    }

    loadImage = function(){
        let imageString = `<p class="backArrow" onclick="goBack()">5</p>
                           <img src="../images/foods/${currentRecipie.image}">`
        document.getElementById(RECIPIE_IMAGE_DIV).innerHTML = imageString;
    }

    loadInfo = function(){
        document.getElementById(RECIPIE_TITLE).innerHTML = currentRecipie.name;

        let infoString = `<hr style="margin:10px">
                        <div class="flex-column">
                            <div class="flex-row">
                                <div class="recipieInfoHeader">Type: </div>
                                <div class="recipieType" style="margin-left:10px;">${currentRecipie.category}</div>
                            </div>
                            <div class="flex-row" style="margin-top: 10px;">
                                <div class="flex-column">
                                    <div class="recipieInfoHeader">Total Cooking Time: </div>
                                    <div>${currentRecipie.total_time} minutes</div>
                                </div>
                            </div>
                            <div class="flex-row"></div>
                        </div>
                        <hr style="margin:10px">`;
        document.getElementById(RECIPIE_INFO_DIV_ID).innerHTML = infoString;

        document.getElementById(RECIPIE_NOTES).innerHTML = currentRecipie.notes;
    }
    
    loadIngredients = function(ingredients){
        let ingredientsString = "";
        let i = 0;
        ingredients.forEach(element => {
            console.log(element.required)
            if(i % 2 != 0){
                ingredientsString+=`<div class="ingredient ${element.required ? "" : "ingredient-optional"}" ><b>${element.amount ? element.amount : ""}</b><span style="margin-left:7px;">${element.name}</span> <i>${element.notes ? element.notes : ""} ${element.required ? "" : "(optional)"}</i></div>`
            }else{
                ingredientsString+=`<div class="ingredient ${element.required ? "" : "ingredient-optional"}" style="border-right: 2px solid;" ><b>${element.amount ? element.amount : ""}</b><span style="margin-left:7px;">${element.name}</span> <i>${element.notes ? element.notes : ""} ${element.required ? "" : "(optional)"}</i></div>`
            }
            i = i + 1;
            toBold.push(element.name)
        });
        document.getElementById(INGREDIENTS_TABLE_DIV_ID).innerHTML = ingredientsString;
    }

    loadSteps = function(steps){
        console.log(steps);
        let stepsString = "";
        steps.forEach(element => {
            let newText = boldwords(element.text)
            stepsString += `<div class="stepDiv flex-row">
                                <div class="stepNumber">${element.number}.)</div>
                                <div class="stepText">${newText}</div>
                            </div>`
        });
        document.getElementById(STEPS_LIST_ID).innerHTML = stepsString;
    }

    loadRecipie= function(){
        loadImage();
        loadInfo();
        loadIngredients(currentRecipie.ingredients);
        resize();
        loadSteps(currentRecipie.steps);
        recolor(currentRecipie.color);
    }

    init = function(onInitializedCallback) {
        window.onorientationchange = function(event) { 
            checkOrientation();
        };
        console.log("Started List init...");
        var queryString = decodeURIComponent(window.location.search);
        currentRecipieID = queryString.substring(4);
        window.scrollTo(0,0)
        pullrecipies();
    };

    recolor = function(color){
        DIVS_TO_COLOR.forEach(element => {
            document.getElementById(element).classList.add("item-"+color);
        });
        
    }

    resize = function(){
        let bigDiv = document.getElementById(MAINSIDE_DIV_ID);
        let table = document.getElementById(INGREDIENTS_DIV_ID);
        let remainder = bigDiv.offsetHeight - table.clientHeight;
        console.log("NEW    ")
        console.log(remainder)
        let stepsScroll = document.getElementById(STEPS_DIV_ID);
        stepsScroll.style.maxHeight = remainder -  85 + "px";
        console.log("REMAINDER: "  + document.getElementById(STEPS_DIV_ID).style.maxWidth)
    }

    pullrecipies = function(){
        Global.ajax(RECIPIES_JSON_URL, function(data)
        {
            console.log(data);
            data.forEach(element => {
                console.log(element.id);
                console.log(currentRecipieID);
                if(element.id == currentRecipieID){
                    currentRecipie = element;
                }
            });
            loadRecipie()
        });
    }
  
    /*------------------------------------------------------------------------
     *              PUBLIC METHODS
     */
    return {
        init,
        goBack,
    };
  }());
  