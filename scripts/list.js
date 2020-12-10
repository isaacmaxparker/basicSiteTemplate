/*property

*/


const List = (function() {
    "use strict";
  
    /*------------------------------------------------------------------------
     *              CONSTANTS
     */
    const RECIPIES_JSON_URL = "https://raw.githubusercontent.com/isaacmcdgl/JSON/main/RecipieProject/Recipies.JSON";
    /*------------------------------------------------------------------------
     *              PRIVATE VARIABLES
     */
    let recipies;
  
    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */
    let init;
    let pullrecipies;
    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */
  
    init = function(onInitializedCallback) {
        console.log("Started List init...");
        window.scrollTo(0,0)
        pullrecipies();
    };

    pullrecipies = function(){
        Global.ajax(RECIPIES_JSON_URL, function(data)
        {
            recipies = data
        });
    }
  
    /*------------------------------------------------------------------------
     *              PUBLIC METHODS
     */
    return {
        init,
    };
  }());
  