/*property

*/


const Global = (function() {
    "use strict";
  
    /*------------------------------------------------------------------------
     *              CONSTANTS
     */
    const ANIMATION_DURATION = 800;
  
    /*------------------------------------------------------------------------
     *              PRIVATE VARIABLES
     */
  
    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */

    let init;  
    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */
  
    init = function(onInitializedCallback) {
        console.log("Started global init...");
        window.scrollTo(0,0)
    };
  
    /*------------------------------------------------------------------------
     *              PUBLIC METHODS
     */
    return {
        init,
    };
  }());
  