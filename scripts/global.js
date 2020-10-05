/*property

*/


const Global = (function() {
    "use strict";
  
    /*------------------------------------------------------------------------
     *              CONSTANTS
     */
    const ANIMATION_DURATION = 800;
    const CURRENT_GAME_COOKIE = 'current-game';
    const REQUEST_GET = "GET";
    const REQUEST_STATUS_OK = 200;
    const REQUEST_STATUS_ERROR = 400;
    /*------------------------------------------------------------------------
     *              PRIVATE VARIABLES
     */
  
    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */
    let ajax;
    let htmlDiv;
    let htmlp;
    let init;  
    let playGame;
    let getCookie;
    let setCookie;
    let toggleAside;
    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */
    ajax = function(url, successCallback, failureCallback, skipJsonParse) {

        let request = new XMLHttpRequest();
        request.open(REQUEST_GET, url, true);

        request.onload = function() {
            if (this.status >= REQUEST_STATUS_OK && this.status < REQUEST_STATUS_ERROR) {
               
                let data = (
                    skipJsonParse 
                    ? request.response 
                    : JSON.parse(request.response)
                );

                if (typeof successCallback === 'function') {
                    successCallback(data);
                }
            } else {
                if (typeof failureCallback === 'function') {
                    failureCallback(request);
                }
            }
        };

        request.onerror = failureCallback;
        request.send();
   };

   htmlDiv = function(id, classes, styles, attr, content){
    let div = `<div ${id ? 'id=' + id : ''} ${classes ? 'class="' + classes +'"' : ''} ${styles ? 'style="' + styles + '"': ''} ${attr ? attr : ''}>${content ? content : ''}</div>`
    return div
}

   htmlp = function(id, classes, styles, attr, content){
    let div = `<p ${id ? 'id=' + id : ''} ${classes ? 'class="' + classes +'"' : ''} ${styles ? 'style="' + styles + '"': ''} ${attr ? attr : ''}>${content ? content : ''}</p>`
    return div
   }
  
    init = function(onInitializedCallback) {
        console.log("Started global init...");
        window.scrollTo(0,0)
    };
  
    playGame = function(){
        if(getCookie(CURRENT_GAME_COOKIE)){
            setTimeout(function(){location.replace("html/scores.html")},750);
        }
        else{
            setTimeout(function(){location.replace("html/games.html")},750);
        }
    }

    getCookie = function(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
      }

      setCookie = function(name,value) {
        var expires = '',
        date = new Date();
        let days = 6 
        if (days) {
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toGMTString();
        }
        document.cookie = name + '=' + value + expires + '; path=/';
      }

      toggleAside = function(aside){
          if(aside.classList.contains('left-aside')){
            if(aside.classList.contains('hidden-left-aside')){
                aside.classList.remove('hidden-left-aside')
                aside.children[0].children[0].children[0].innerHTML = '9';
            }
            else{
                aside.classList.add('hidden-left-aside')
                aside.children[0].children[0].children[0].innerHTML = '!';
            }
          }
          else{
            if(aside.classList.contains('hidden-right-aside')){
                aside.classList.remove('hidden-right-aside')
            }
            else{
                aside.classList.add('hidden-right-aside')
            }
          }
      }


    /*------------------------------------------------------------------------
     *              PUBLIC METHODS
     */
    return {
        ajax,
        htmlDiv,
        htmlp,
        init,
        playGame,
        getCookie,
        setCookie,
        toggleAside,
    };
  }());
  