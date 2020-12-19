/*property

*/


const addForm = (function () {
    "use strict";

    /*------------------------------------------------------------------------
     *              CONSTANTS
     */
    const INGREDIENT_CONTAINER_ID = "ingredientsContainer";
    const STEP_CONTAINER_ID = "stepsContainer";
    const TEMP_ID = "tempy";
    const FORM_ID = "recipieForm";

    const RECIPIE_NAME = "recipieName";
    const RECIPIE_TYPE = "recipieCategory";
    const RECIPIE_SERVINGS = "recipieServings";
    const RECIPIE_MEAL = "recipieMeal";
    const RECIPIE_INFLUENCE = "recipieInfluence";
    const PREP_TIME_HOUR = "prepTimeHour";
    const PREP_TIME_MINUTE = "prepTimeMinute";
    const COOK_TIME_HOUR = "cookTimeHour";
    const COOK_TIME_MINUTE = "cookTimeMinute";
    const RECIPIE_ADD_NAMES = "recipieAddtNames";
    const RECIPIE_ALPHA = "recipieAlpha";
    const RECIPIE_SECOND_MEAL = "recipieSecondMeal";
    const RECIPIE_NOTES = "recipieNotes";


    /*------------------------------------------------------------------------
     *              PRIVATE VARIABLES
     */
    let recipies_to_add = {};
    let recipies_array = [];
    let recipieID = 1;

    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */
    let addNewRecipie;
    let addIngredientRow;
    let addStepRow;
    let clearForm;
    let decodeColor;
    let decodeTime;
    let decodeTimeRange;
    let buildRecipie;
    let downloadJSON;
    let downloadObjectAsJson
    let init;
    let removeRow;
    let reorderSteps;


    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    addIngredientRow = function () {
        let ingredientContainer = document.getElementById(INGREDIENT_CONTAINER_ID);
        let temp = document.getElementById(TEMP_ID);
        temp.innerHTML += `<div class="flex-row ingredientContainer">
                            <div class="ingredientRow flex-row">
                                <div class="title">Name:</div>
                                <input class="formInput col-45 ingName" placeholder="Ingredient Name" TAKEOUTTHISLATER-required>
                                <div class="title">Amount:</div>
                                <input type="number" class="formInput col-10 ingWhole" style="text-align: center;" TAKEOUTTHISLATER-required placeholder=0>
                                    <select class="formInputSelect col-15 ingFrac">
                                        <option value="" disabled selected></option>
                                        <option value="1/8">1/8</option>
                                        <option value="1/4">1/4</option>
                                        <option value="1/3">1/3</option>
                                        <option value="1/2">1/2</option>
                                        <option value="5/8">5/8</option>
                                        <option value="2/3">2/3</option>
                                        <option value="5/6">5/6</option>
                                        <option value="3/4">3/4</option>
                                        <option value="7/8">7/8</option>
                                        <option value="misc">Other</option>
                                    </select>
                                    <select class="formInputSelect col-20 IngMeasurement" TAKEOUTTHISLATER-required>
                                        <option value="Cups">Cups</option>
                                        <option value="Tbsp">Tbsp</option>
                                        <option value="tsp">tsp</option>
                                        <option value="oz">Oz</option>
                                        <option value="Cube">Cube</option>
                                        <option value="Pkg">Pkg</option>
                                        <option value="Quart">Quart</option>
                                        <option value="Pint">Pint</option>
                                        <option value="Gallon">Gallon</option>
                                        <option value=""></option>
                                    </select>
                                <input class="formInput optional col-30 ingNotes" placeholder="Notes">
                            </div>
                            <div class="deleteIcon" style="width:30px;" onclick=removeRow(this.parentElement,false)>(</div>

                        </div>`
        ingredientContainer.appendChild(temp.children[0]);
        temp.innerHTML = "";
                                                                
    }

    addStepRow = function(){
        let stepContainer = document.getElementById(STEP_CONTAINER_ID);
        let temp = document.getElementById(TEMP_ID);
        let stepNum = parseInt(stepContainer.children[stepContainer.children.length - 1].querySelector('.stepNum').innerHTML) + 1;
        temp.innerHTML = `<div class="flex-row ingredientContainer">
        <div class="ingredientRow flex-row">
            <div class="title"><span class="stepNum">${stepNum}</span>)</div>
            <input class="formInput" placeholder="Type step directions here..." required>
        </div>
        <div class="deleteIcon" style="width:30px;" onclick=removeRow(this.parentElement)>(</div>

    </div>`;
        stepContainer.appendChild(temp.children[0]);
        temp.innerHTML = "";

    }

    addNewRecipie = function () {
        let recipie = buildRecipie();
        recipies_array.push(recipie);
        recipies_to_add.recipies = recipies_array;
        localStorage.setItem("recipies", JSON.stringify(recipies_to_add) )
        let x = localStorage.getItem("recipies")
        console.log(localStorage.getItem("recipies"))
        // alert("BEFORE RELOAD");
        // window.location.reload();
    }

    buildRecipie = function(){
        let name = document.getElementById(RECIPIE_NAME).value;
        let type = document.getElementById(RECIPIE_TYPE).value;
        let servings = document.getElementById(RECIPIE_SERVINGS).value;
        let altname = document.getElementById(RECIPIE_ADD_NAMES).value;
        let color = decodeColor(type);
        let alpha = document.getElementById(RECIPIE_ALPHA).value;
        let meal = document.getElementById(RECIPIE_MEAL).value;
        let submeal = document.getElementById(RECIPIE_SECOND_MEAL).value;
        let influence = document.getElementById(RECIPIE_INFLUENCE).value;
        let prep_time = decodeTime(parseInt(document.getElementById(PREP_TIME_HOUR).value), parseInt(document.getElementById(PREP_TIME_MINUTE).value));
        let cook_time = decodeTime(parseInt(document.getElementById(COOK_TIME_HOUR).value), parseInt(document.getElementById(COOK_TIME_MINUTE).value));
        let notes = document.getElementById(RECIPIE_NOTES).value;

        let ingredientsDivs = document.getElementById(INGREDIENT_CONTAINER_ID).children;

        let ingredients = [];
        for(let i = 0; i < ingredientsDivs.length; i++){
            let div = ingredientsDivs[i];
            let amount;
            if(div.querySelector(".ingFrac").value!=""){
                if(div.querySelector(".ingWhole").value != 0){
                    amount = div.querySelector(".ingWhole").value + " " + div.querySelector(".ingFrac").value;
                }
                else{
                    amount = div.querySelector(".ingFrac").value;
                }
            }
            else{
                amount = div.querySelector(".ingWhole").value;
            }
            let ing =  {
                "amount":amount,
                "measurement":div.querySelector(".IngMeasurement").value,
                "name":div.querySelector(".ingName").value,
                "notes":div.querySelector(".ingNotes").value,
                "required":div.querySelector(".ingNotes").value.includes("optional") ? false : true
            }
            ingredients.push(ing);
        }

        let stepsDivs = document.getElementById(STEP_CONTAINER_ID).children;

        let steps = [];

        for(let s = 0; s < stepsDivs.length; s++){
            let div = stepsDivs[s];
            console.log(div);
            let step =  {
                "number":s + 1,
                "text":div.querySelector(".formInput").value,
            }
            steps.push(step);
        }


        let built_recipie = {
            "name":name,
            "alternate_names":altname,
            "color":color,
            "category":type,
            "alpha":alpha,
            "meal":meal,
            "submeal":submeal != "None" ? submeal : null,
            "influence":influence,
            "prep_time":prep_time > 0 ? prep_time : null,
            "cook_time":cook_time > 0 ? cook_time : null,
            "total_time":cook_time + prep_time,
            "time_range":decodeTimeRange(cook_time + prep_time),
            "servings":servings,
            "ingredients":ingredients,
            "steps":steps,
            "notes":notes,
            "status":"A",
            "image":null
        }

        return built_recipie;
    }

    decodeColor = function(type){
        switch(type){
            case "entree":
                return "Blue";
            case "side":
                return "Green";
            case "soup":
                return "Red";
            case "bread":
                return "Orange";
            case "dessert":
                return "LightBlue";
            case "drink":
                return "Pink";
        }
    }
    
    decodeTime = function(hours,minutes){
        return (hours * 60 + minutes);
    }

    decodeTimeRange = function(time){
        if(time <= 30){
            return "0-Less than 30 Minutes";
        }
        else if( 30< time <= 60){
            return "1-30 Minutes to 1 Hour";
        }
        else if( 60< time <= 90){
            return "2-1 to 1.5 hours";
        }
        else if( 90< time < 120){
            return "3-1.5 to 2 hours";
        }
        else if( 120< time <= 180){
            return "4-2 to 3 hours";
        }
        else if( 180< time <= 240){
            return "5-3 to 4 hours";
        }
        else{
            return "6-More than 4 hours";
        }

    }

    init = function (onInitializedCallback) {
        console.log("Started form init...");
        window.scrollTo(0, 0)
        let x = console.log(localStorage.getItem("recipies"));
        if(x){
            recipies_array = x.recipies;
        }
        //addNewRecipie();
    };

    downloadJSON = function () {
        let x = localStorage.getItem("recipies");
        let y = JSON.parse(x);
        downloadObjectAsJson(y.recipies, "Recipie Update - " + Date.now());
    }

    downloadObjectAsJson = function (exportObj, exportName) {
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    removeRow = function(element,isStep = false){
        element.remove()
        if(isStep){
            reorderSteps();
        }
    }

    reorderSteps = function(){
        let stepChildren = document.getElementById(STEP_CONTAINER_ID).children;
        for(let i = 0;i<stepChildren.length;i++){
            console.log(i)
            stepChildren[i].querySelector('.stepNum').innerHTML = i + 1;
        }
    }

    /*------------------------------------------------------------------------
     *              PUBLIC METHODS
     */
    return {
        init,
        addIngredientRow,
        addStepRow,
        addNewRecipie,
        downloadJSON,
        removeRow,
    };
}());
