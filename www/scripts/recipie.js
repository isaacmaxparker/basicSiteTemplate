/*property

*/


const Recipie = (function() {
    "use strict";
  
    /*------------------------------------------------------------------------
     *              CONSTANTS
     */
    const RECIPIES_JSON_URL = "https://raw.githubusercontent.com/isaacmcdgl/JSON/main/RecipieProject/Recipies.JSON";
    const SPLIT_CONTAINER_ID = "spliteSite";
    const DIVS_TO_COLOR = ["rightside","mainside","ingredientsTable","ingredientsTableDiv", "thirdsButton", "halvesButton", "regularButton", "doubleButton", "tripleButton","backArrow"]
    const INGREDIENTS_DIV_ID = "ingredientsTable"
    const INGREDIENTS_TABLE_DIV_ID = "ingredientsTableDiv"
    const MAINSIDE_DIV_ID = "mainside";
    const STEPS_DIV_ID = "stepsScrollContainer";
    const RECIPIE_IMAGE_DIV = "recipieImage";
    const STEPS_LIST_ID = "stepsList";
    const RECIPIE_INFO_DIV_ID = "recipieInfo";
    const RECIPIE_TITLE = "recipieTitle";
    const RECIPIE_NOTES = "recipieNotes";
    const NON_PLURAL_MEASUREMENTS = ["Tbsp","tsp","Oz"];
    const UPGRADEABLE_MEASUREMENTS = ["Tbsp","tsp"];
    const ACCEPTABLE_FRACTIONS = [1/16, 1/8, 1/6, 1/4, 1/3, 1/2, 2/3, 3/4, 3/8, 5/8, 7/8, 5/6];
    const NOTES_SCOLL_ID = 'notesScroll';
    const RECIPIE_SERVINGS = 'recipieServings';

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
    let closestTo;
    let changeMultiplier;
    let checkUpgrade;
    let decodeAmount;
    let decodeMeasurement;
    let encodeAmount;
    let formatTime;
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
        return input.replace(new RegExp('(\\b)(' + toBold.join('|') + ')(\\b)','ig'), '$1<b>$2</b>$3');
    }

    changeMultiplier = function(amount=null,direction=null){
        let deepClone = JSON.parse(JSON.stringify(currentRecipie.ingredients));
            switch(direction){
                case 'divide': 
                    currentRecipie.ingredients.forEach(element => {
                        let x = decodeAmount(element.amount);
                        x = x / amount;
                        let u = checkUpgrade(x, element.measurement);
                        element.amount = encodeAmount(u[0]);
                        element.measurement = decodeMeasurement(u[0], u[1])

                        if(element.secondaryAmount && element.secondaryMeasurement){
                            let x = decodeAmount(element.secondaryAmount);
                            x = x / amount;
                            let u = checkUpgrade(x, element.secondaryMeasurement);
                            element.secondaryAmount = encodeAmount(u[0]);
                            element.sescondaryMeasurement = decodeMeasurement(u[0], u[1])
                        }

                    });
                    if(document.getElementById(RECIPIE_SERVINGS)){
                        document.getElementById(RECIPIE_SERVINGS).innerHTML = Math.floor(currentRecipie.servings / amount);
                    }
                    break;
                case 'multiply':
                    currentRecipie.ingredients.forEach(element => {
                        let x = decodeAmount(element.amount);
                        x = x * amount;
                        let u = checkUpgrade(x, element.measurement);
                        element.amount = encodeAmount(u[0]);
                        element.measurement = decodeMeasurement(u[0], u[1])

                        if(element.secondaryAmount && element.secondaryMeasurement){
                            let x = decodeAmount(element.secondaryAmount);
                            x = x * amount;
                            let u = checkUpgrade(x, element.secondaryMeasurement);
                            element.secondaryAmount = encodeAmount(u[0]);
                            element.secondaryMeasurement = decodeMeasurement(u[0], u[1])
                        }
                        if(document.getElementById(RECIPIE_SERVINGS)){
                            document.getElementById(RECIPIE_SERVINGS).innerHTML = Math.floor(currentRecipie.servings * amount);
                        }
                    });
                    
                    break;
                default:
                    currentRecipie.ingredients.forEach(element => {
                        let x = decodeAmount(element.amount);             
                        element.measurement = decodeMeasurement(x, element.measurement)

                        if(element.secondaryAmount && element.secondaryMeasurement){
                            let x = decodeAmount(element.secondaryAmount);
                            element.secondaryMeasurement = decodeMeasurement(x, element.secondaryMeasurement)
                        }
                    });
    
        }
    
        loadIngredients(currentRecipie.ingredients);
        currentRecipie.ingredients = deepClone;
    }

    checkUpgrade = function(amount, measurement){
        if(UPGRADEABLE_MEASUREMENTS.includes(measurement)){
            switch(measurement){
                case "tsp":
                    if(amount >= 3){
                        let wholeNumber = Math.floor(amount/3);
                        let remainder = amount % 3;
                        switch(remainder){
                            case 0:
                                amount = wholeNumber;
                                measurement = "Tbsp";
                                break;
                            case 1.5:
                                amount = wholeNumber + .5;
                                measurement = "Tbsp";
                                break;
                        }
                    }
                    break;
                case "Tbsp":
                    if(Number.isInteger(amount * 3) && (amount * 3) < 5){
                        amount = amount * 3;
                        measurement = "tsp"
                    }
                    else if(amount > 4){
                        let wholeNumber = Math.floor(amount/16);
                        let remainder = amount % 16;
                        switch(remainder){
                            case 0: 
                                amount = wholeNumber;
                                measurement = "Cup";
                            break;
                            case 2: 
                                amount = wholeNumber + 1/8;
                                measurement = "Cup";
                            break;
                            case 4: 
                                amount = wholeNumber + .25;
                                measurement = "Cup";
                            break;
                            case 16/3: 
                                amount = wholeNumber + 1/3;
                                measurement = "Cup";
                            break;
                            case 8: 
                                amount = wholeNumber + .5;
                                measurement = "Cup";
                            break;
                            case 12: 
                                amount = wholeNumber + .75;
                                measurement = "Cup";
                            break;
                            case 14: 
                                amount = wholeNumber + .85;
                                measurement = "Cup";
                            break;
                        }
                    }
                    break;
            }
        }
        return [amount,measurement];
    }

    checkOrientation = function(){
        resize()
    }
    
    closestTo = function(number){
        let distances=[];
        ACCEPTABLE_FRACTIONS.forEach(fraction => {
            distances.push(Math.abs(fraction-number));
        });

        let index = 0;
        let i;
        for( i = 1; i < distances.length; i++)
        {
                if(distances[i] < distances[index])
                        index = i;
        }

        return ACCEPTABLE_FRACTIONS[index]

    }

    decodeAmount = function(amount){
        if(amount == null){
            return null;
        }
        amount = String(amount)
        if(amount.includes(" ")){
            let wholeNumber = parseInt(amount.substr(0, amount.indexOf(' ')));
            let fraction = amount.substr(amount.indexOf(' ')+1,amount.length);
            let newFrac = decodeAmount(fraction);
            return(wholeNumber + newFrac);
        }
        switch(amount){
            case "1/2":
                return .5;
            case "1/3":
                return 1/3;
            case "1/4":
                return .25;
            case "1/6":
                return 1/6;
            case "1/8":
                return 1/8;
            case "2/3":
                return 2/3;
            case "3/4":
                return .75
            case "5/8":
                return 3/8
            default:
                return amount;
        }
    }

    decodeMeasurement = function(newAmount, measurement){
        if(newAmount == null || measurement == null){
            return null;
        }
        if(NON_PLURAL_MEASUREMENTS.includes(measurement)){
            return measurement;
        }
        else {
            if(measurement.charAt(measurement.length - 1) == 's'){
                measurement = measurement.slice(0,-1);
            }

            if(newAmount > 1 && measurement != ""){

                return measurement + "s";
            }else{
                return measurement;
            }
        } 
    }

    encodeAmount = function(newAmount){
        if(Number.isInteger(newAmount)){
            return newAmount;
        }
        if(newAmount > 1){
            let wholeNumber = Math.floor(newAmount)
            let fraction = newAmount - Math.floor(newAmount)
            let newFrac = encodeAmount(fraction);
            return String(wholeNumber) + " " + newFrac;
        }
        switch(newAmount){
            case .5:
                return "1/2";
            case 1/3:
                return "1/3";
            case .25:
                return "1/4";
            case 1/6:
                return "1/6";
            case 1/8:
                return "1/8";
            case 2/3:
                return "2/3";
            case 3/4:
                return "3/4";
            case 3/8:
                return "3/8";
            case 5/6:
                return "3/4";
            case 5/8:
                return "5/8";
            case 7/8:
                return "7/8";
            case 1/16:
                return "1/16";
            default:
                return encodeAmount(closestTo(newAmount))
        }
    }

    formatTime = function(timeMinutes){
        console.log(timeMinutes)
        let endTime = timeMinutes;
        let endString = "";
        if(timeMinutes > 60){
            let hours = Math.floor(timeMinutes / 60);
            let minutes = timeMinutes % 60;
            let hoursString = " hours"
            let minutesString = " minutes"
            if(hours == 1){
                hoursString = " hour"
            }
            if(minutes == 1){
                minutesString = " minute"
            }
            if(minutes != 0)
                endTime = hours + hoursString + " " + minutes + minutesString;
            else
                endTime = hours + hoursString;
        }
        else{
            if(endTime == 1){
                endString = " minute"
            }
            else{
                endString = " minutes"
            }
        }
        console.log(endTime)
        return endTime + endString ;
    }
    
    goBack = function(){
            window.history.back();
    }

    loadImage = function(){
        let imageString = `<p id="backArrow" class="backArrow flex-column" onclick="goBack()">5</p>
                           <img src="https://raw.githubusercontent.com/isaacmcdgl/basicSiteTemplate/Recipe/images/foods/${currentRecipie.image}">`
        document.getElementById(RECIPIE_IMAGE_DIV).innerHTML = imageString;
    }

    loadInfo = function(){
        document.getElementById(RECIPIE_TITLE).innerHTML = currentRecipie.name;


        let infoString;
        if(currentRecipie.servings){
            infoString = `<hr style="margin:10px">
            <div class="flex-column">
                <div class="flex-row">
                    <div class="recipieInfoHeader">Servings: </div>
                    <div id="recipieServings" class="recipieType" style="margin-left:10px;">${currentRecipie.servings}</div>
                </div>
                <div class="flex-row" style="margin-top: 10px;">
                    <div class="flex-column">
                        <div class="recipieInfoHeader">Total Cooking Time: </div>
                        <div>${formatTime(currentRecipie.total_time)}</div>
                    </div>
                </div>
                <div class="flex-row"></div>
            </div>
            <hr style="margin:10px">`;
        }
        else{
            infoString = `<hr style="margin:10px">
            <div class="flex-column">
                <div class="flex-row">
                    <div class="recipieInfoHeader">Type: </div>
                    <div class="recipieType" style="margin-left:10px;">${currentRecipie.category}</div>
                </div>
                <div class="flex-row" style="margin-top: 10px;">
                    <div class="flex-column">
                        <div class="recipieInfoHeader">Total Cooking Time: </div>
                        <div>${formatTime(currentRecipie.total_time)}</div>
                    </div>
                </div>
                <div class="flex-row"></div>
            </div>
            <hr style="margin:10px">`;
        }

        document.getElementById(RECIPIE_INFO_DIV_ID).innerHTML = infoString;
        if(currentRecipie.notes)
            document.getElementById(RECIPIE_NOTES).innerHTML = currentRecipie.notes;
        else{
            document.getElementById(RECIPIE_NOTES).innerHTML = "No Notes";
            document.getElementById(NOTES_SCOLL_ID).style.opacity= '0';
        }
            
    }
    
    loadIngredients = function(ingredients){
        let ingredientsString = "";
        let i = 0;
        ingredients.forEach(element => {
            if(i % 2 != 0){
                ingredientsString+=`<div class="ingredient ${element.required ? "" : "ingredient-optional"}" ><b>${element.amount && element.amount != 0 ? element.amount : ""}${element.measurement ? " " + element.measurement : ""}</b><span style="margin-left:7px;">${element.name}</span>${element.secondaryAmount ? "<i> (" + element.secondaryAmount + " " + element.secondaryMeasurement + ")</i>" : ""} <i>${element.notes ? "(" + element.notes + ")": ""} ${element.required ? "" : "(optional)"}</i></div>`
            }else{
                ingredientsString+=`<div class="ingredient ${element.required ? "" : "ingredient-optional"}" style="border-right: 2px solid;" ><b>${element.amount && element.amount != 0 ? element.amount : ""}${element.measurement ? " " + element.measurement : ""}</b><span style="margin-left:7px;">${element.name}</span>${element.secondaryAmount ? "<i> (" + element.secondaryAmount + " " + element.secondaryMeasurement + ")</i>" : ""} <i>${element.notes ? "(" + element.notes + ")" : ""} ${element.required ? "" : "(optional)"}</i></div>`
            }
            i = i + 1;
            toBold.push(element.name)
        });
        document.getElementById(INGREDIENTS_TABLE_DIV_ID).innerHTML = ingredientsString;
    }

    loadSteps = function(steps){
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
        changeMultiplier();
        resize();
        loadSteps(currentRecipie.steps);
        recolor(currentRecipie.color);
    }

    init = function(onInitializedCallback) {
        window.onorientationchange = function(event) { 
            checkOrientation();
        };
        console.log("Started Recipie init...");
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
        let stepsScroll = document.getElementById(STEPS_DIV_ID);
        stepsScroll.style.maxHeight = remainder -  85 + "px";
    }

    pullrecipies = function(){
        Global.ajax(RECIPIES_JSON_URL, function(data)
        {
            data.forEach(element => {
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
        changeMultiplier,
    };
  }());
  