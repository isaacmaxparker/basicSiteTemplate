/*property

*/


const FILE = (function() {
    "use strict";
  
    /*------------------------------------------------------------------------
     *              CONSTANTS
     */

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
  