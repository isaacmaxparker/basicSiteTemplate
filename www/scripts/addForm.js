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
    const DOWNLOAD_BUTTON_ID = "downloadRecipieButton";
    const RECIPIES_JSON_URL = "https://raw.githubusercontent.com/isaacmcdgl/JSON/main/RecipieProject/Recipies.JSON";

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
    const RECIPIES_TO_ADD = "recipiesToAdd";
    const MESSSAGE_DIV = "messageContainer"
    const OK_BUTTON = "btn_ok";
    const CANCEL_BUTTON = "btn_cancel"
    const CLEAR_QUEUE = "clearQueue";
    const DEFUALT_NUM_OF_INGREDIENTS = 5;
    const DEFUALT_NUM_OF_STEPS = 5;

    /*------------------------------------------------------------------------
     *              PRIVATE VARIABLES
     */
    let recipies_to_add = {};
    let lastRecipieID;
    let recipie_to_remove_id;
    let recipies_array = [];

    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */
    let addNewRecipie;
    let addIngredientRow;
    let addStepRow;
    let buildRecipie;
    let clearForm;
    let cacheRecipies;
    let closePrompt;
    let decodeID;
    let decodeImage;
    let decodeColor;
    let decodeTime;
    let decodeTimeRange;
    let defaultValue;
    let defaultValueRemove;
    let downloadJSON;
    let downloadObjectAsJson
    let expandRecipie;
    let loadRecipies;
    let init;
    let pullrecipies;
    let removeRow;
    let reorderSteps;
    let removeRecipie;
    let removeAllRecipies;
    let showPrompt;


    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    addIngredientRow = function () {
        let ingredientContainer = document.getElementById(INGREDIENT_CONTAINER_ID);
        let temp = document.getElementById(TEMP_ID);
        temp.innerHTML += `<div class="flex-row ingredientContainer">
                            <div class="ingredientRow flex-row">
                                <div class="title">Name:</div>
                                <input class="formInput col-45 ingName" placeholder="Ingredient Name" required>
                                <div class="title">Amount:</div>
                                <input type="number" class="formInput col-10 ingWhole" style="text-align: center;" required placeholder=0 onblur=addForm.defaultValue(this,0) onfocus="addForm.defaultValueRemove(this,0)">
                                    <select class="formInputSelect col-15 ingFrac">
                                        <option value="" selected></option>
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
                                    <select class="formInputSelect col-20 IngMeasurement" required>
                                        <option value="Cups">Cups</option>
                                        <option value="Tbsp">Tbsp</option>
                                        <option value="tsp">tsp</option>
                                        <option value="oz">Oz</option>
                                        <option value="Cube">Cube</option>
                                        <option value="Can">Can</option>
                                        <option value="Container">Container</option>
                                        <option value="Pkg">Pkg</option>
                                        <option value="Quart">Quart</option>
                                        <option value="Pint">Pint</option>
                                        <option value="Gallon">Gallon</option>
                                        <option value="Drop">Drop</option>
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
        console.log(recipies_array)
        recipies_array.push(recipie);
        console.log(recipies_array)
        recipies_to_add.recipies = recipies_array;
        cacheRecipies();
        loadRecipies();
        // alert("BEFORE RELOAD");
        window.location.reload();
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
            "id":decodeID(),
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
            "image":decodeImage(name)
        }

        return built_recipie;
    }

    cacheRecipies = function(){
        console.log("CACHING...");
        console.log(recipies_to_add);
        localStorage.setItem("recipies", JSON.stringify(recipies_to_add) )
    }

    closePrompt = function(){
        let messageDiv = document.getElementById(MESSSAGE_DIV);
        messageDiv.classList.add("noshow")
    }

    defaultValue = function(element, value){
        if(element.value){
            return
        }

        element.value = value;
    }

    defaultValueRemove = function(element,value){
        if(element.value == value){
            element.value = null;
        }
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

    decodeID = function(){
        let id;
        console.log(recipies_to_add.recipies)
        if(recipies_to_add.recipies.length > 0){
            console.log(1)
            id = parseInt(recipies_to_add.recipies[recipies_to_add.recipies.length - 1].id) + 1;
        }
        else if(lastRecipieID){
            console.log(2)
            id = lastRecipieID + 1;
        }
        else{
            showPrompt({
                "title":"Oops!",
                "message":"There was a problem saving this recipie please refresh and try again!",
                "okFunction":closePrompt
            })
        }

        return id;

    }

    decodeImage = function(name){
        let array = name.split(" ");
        let string = "";
        for(let i = 0; i < array.length;i++){
            if(i == 0){
                string += array[i].toLowerCase()
            }
            else{
                let x = array[i].toLowerCase()
                string += x.substr(0,1).toUpperCase() + x.substr(1,x.length);
            }
            
        }
        string +=".jpg"
        return string;
    }
    
    decodeTime = function(hours,minutes){
        return (hours * 60 + minutes);
    }

    decodeTimeRange = function(time){
        if(time <= 30){
            return "0-Less than 30 minutes";
        }
        else if( 30< time <= 60){
            return "1-30 minutes to 1 hour";
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

    expandRecipie = function(recipieCard){
        if(recipieCard.classList.contains('expanded')){
            recipieCard.classList.remove('expanded');
            recipieCard.querySelector(".expandIcon").innerHTML = '8'
        }
        else{
            recipieCard.classList.add('expanded');
            recipieCard.querySelector(".expandIcon").innerHTML = '\"'
        }
        
    }

    init = function (onInitializedCallback) {
        console.log("Started form init...");
        window.scrollTo(0, 0)
        let x = JSON.parse(localStorage.getItem("recipies"));
        console.log(x.recipies);

        for(let i=0;i<DEFUALT_NUM_OF_INGREDIENTS;i++){
            addIngredientRow();
        }

        for(let s=0;s<DEFUALT_NUM_OF_STEPS;s++){
            addStepRow();
        }

        if(x.recipies.length > 0){
            recipies_array = x.recipies;
        }
        else{
            pullrecipies();
        }

        loadRecipies();
    };

    downloadJSON = function () {
        let x = localStorage.getItem("recipies");
        let y = JSON.parse(x);
        downloadObjectAsJson(y.recipies, "Recipie Update - " + Date.now());

        let prompt = {
            "title":"Clear Queue?",
            "message":"Do you want to clear the recipies from your queue?",
            "okFunction":removeAllRecipies,
            "okText":"Yes",
            "cancelText":"No"
        }
        showPrompt(prompt)
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

    loadRecipies = function(){
        recipies_to_add = JSON.parse(localStorage.getItem("recipies"));
        let recipieDiv = document.getElementById(RECIPIES_TO_ADD);
        let r = recipies_to_add.recipies;
        let string = "";
        if(r){
            r.forEach(element => {
                string +=
                `<div class="recipieCard item-${element.color}">
                    <div class="flex-row">
                        <div class="recipieCardTitle flex-column">
                            <span>${element.name}</span>
                        </div>
                        <div class="recipeCardButtons flex-row" style="margin-left: auto;">
                            <div class="cardIcon expandIcon" style="font-size: 110%;" onclick=expandRecipie(this.parentElement.parentElement.parentElement,false)>8</div>
                            <div class="cardIcon"  onclick=removeRecipie(${element.id},false)>(</div>
                        </div>
                    </div>
                    <hr style="width: 85%;margin-top:0px;">
                    <div class="RecipieCardDetails flex-column">
                        <div class="RecipeCardDetail flex-row">
                            <div style="border-right:solid 1px">${element.category}</div>
                            <div>${element.meal}</div>
                        </div>
                        <hr style="width: 85%;margin-top:0px;">
                        <div class="RecipeCardDetail flex-row">
                            <div style="border-right:solid 1px">${element.servings} Servings</div>
                            <div>${element.influence}</div>
                        </div>
                        <hr style="width: 85%;margin-top:0px;">
                        <div class="RecipeCardDetail flex-row">
                            <div style="border-right:solid 1px">${element.ingredients.length} Ingredients</div>
                            <div>${element.steps.length} Steps</div>
                        </div>
                    </div>
                </div>`
            });

            recipieDiv.innerHTML = string;
            if(r.length > 0){
                document.getElementById(DOWNLOAD_BUTTON_ID).classList.remove('inactive');
                document.getElementById(CLEAR_QUEUE).classList.remove('inactive');
            }
            else{
                document.getElementById(DOWNLOAD_BUTTON_ID).classList.add('inactive');
                document.getElementById(CLEAR_QUEUE).classList.add('inactive');
            }

        }


    }
    
    pullrecipies = function(){
        console.log("PULL CALLED")
        Global.ajax(RECIPIES_JSON_URL, function(data)
        {
            console.log("%^^^^^^^^^^^^^^^")
            lastRecipieID = parseInt(data[data.length - 1].id)
            console.log("<><><><><><><")
        });
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

    removeRecipie = function(recipieId, prompted=true){
        if(prompted){
            closePrompt();
            let new_array = [];
            recipies_to_add.recipies.forEach(element => {
                if(element.id != recipie_to_remove_id){
                    new_array.push(element);
                }
            });
            recipies_to_add.recipies = new_array;
            cacheRecipies();
            loadRecipies();
        }
        else{
            recipie_to_remove_id = recipieId;
            let prompt = {
                "title":"Are You Sure?",
                "message":"Are you sure you want to delete this recipie permanently from the queue?",
                "okFunction":removeRecipie
            }
            showPrompt(prompt)
        }
    }

    removeAllRecipies = function(prompted=true){
        console.log(prompted)
        if(prompted){
            closePrompt();
            recipies_to_add.recipies.length = 0;
            cacheRecipies();
            loadRecipies();
        }
        else{
            let prompt = {
                "title":"Are You Sure?",
                "message":"Are you sure you want to delete all recipies from the queue?",
                "okFunction":removeAllRecipies
            }
            showPrompt(prompt)
        }
    }

    showPrompt = function(prompt){
        let messageDiv = document.getElementById(MESSSAGE_DIV);
        messageDiv.querySelector(".messageTitle").innerHTML = prompt.title;
        messageDiv.querySelector(".messageText").innerHTML = prompt.message;
        messageDiv.querySelector("."+OK_BUTTON).onclick = prompt.okFunction;
        messageDiv.querySelector("."+OK_BUTTON).innerHTML = prompt.okText ? prompt.okText :"OK";
        messageDiv.querySelector("."+CANCEL_BUTTON).innerHTML = prompt.cancelText ? prompt.cancelText :"Cancel";
        messageDiv.classList.remove("noshow")
    }

    /*------------------------------------------------------------------------
     *              PUBLIC METHODS
     */
    return {
        init,

        addIngredientRow,
        addStepRow,
        addNewRecipie,
        closePrompt,
        defaultValue,
        defaultValueRemove,
        downloadJSON,
        expandRecipie,
        removeRow,
        removeRecipie,
        removeAllRecipies,

    };
}());
