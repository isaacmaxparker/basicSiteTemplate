/*property

*/


const Global = (function () {
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
    let decodeImage;
    let htmlDiv;
    let htmlp;
    let init;
    let goHome;
    let hideLoader;
    let playGame;
    let getCookie;
    let setCookie;
    let shuffleArray;
    let hideElementFade;
    let showElementFade;
    let playSound;
    let playNote;
    let getValue;
    let setValue;
    let toggleAside;
    let toggleClass;
    /*------------------------------------------------------------------------
     *              PRIVATE METHOD DECLARATIONS
     */
    ajax = function (url, successCallback, failureCallback, skipJsonParse) {

        let request = new XMLHttpRequest();
        request.open(REQUEST_GET, url, true);

        request.onload = function () {
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

    decodeImage = function (type) {
        switch (type) {
            case "famFued":
                return "famfued_logo.png"
            case "millionare":
                return "millionare_logo.png"
            case "jeopardy":
                return "jeoparty_logo.png"
            case "price":
                return "price_logo.png";
            case "wheel":
                return "wheel_logo.png";
            case "eyespy":
                return "eyespy_logo.png";
            case "scatter":
                return "scatter_logo.png";
            case "voice":
                return "voice_logo.png";
        }
    }

    goHome = function () {
        window.location = "games.html"
    }

    htmlDiv = function (id, classes, styles, attr, content) {
        let div = `<div ${id ? 'id=' + id : ''} ${classes ? 'class="' + classes + '"' : ''} ${styles ? 'style="' + styles + '"' : ''} ${attr ? attr : ''}>${content ? content : ''}</div>`
        return div
    }

    hideLoader = function (loader) {
        loader.style.display = "none";
    }

    hideElementFade = (element, timer = 500) => {
        if (element.classList.contains('visible-animate')) {
            element.classList = 'invisible-animate';
        } else {
            element.classList.add('invisible-animate');
        }

        setTimeout(() => { element.classList.add('hidden'); }, timer);
    }

    showElementFade = (element, timer = 500) => {
        element.classList.remove('hidden');
        element.classList.add('visible-animate');
        setTimeout(() => {
            if (element.classList.contains('invisible-animate')) {
                element.classList = 'visible-animate';
            } else {
                element.classList.remove('invisible-animate');
            }
        }, timer)

    }


    htmlp = function (id, classes, styles, attr, content) {
        let div = `<p ${id ? 'id=' + id : ''} ${classes ? 'class="' + classes + '"' : ''} ${styles ? 'style="' + styles + '"' : ''} ${attr ? attr : ''}>${content ? content : ''}</p>`
        return div
    }

    init = function (onInitializedCallback) {
        console.log("Started global init...");
        window.scrollTo(0, 0)
    };

    playGame = function () {
        if (getCookie(CURRENT_GAME_COOKIE)) {
            setTimeout(function () { location.replace("html/scores.html") }, 750);
        }
        else {
            setTimeout(function () { location.replace("html/games.html") }, 750);
        }
    }

    getValue = function (name) {
        let val = getCookie(name);
        if (!val) {
            val = localStorage.getItem(name)
        }
        return val
    },

        setValue = function (name, value) {
            setCookie(name, value)
            if (value == "") {
                localStorage.removeItem(name)
            } else {
                localStorage.setItem(name, value)
            }
        },

        getCookie = function (cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for (var i = 0; i < ca.length; i++) {
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

    setCookie = function (name, value) {
        var expires = '',
            date = new Date();
        let days = 6
        if (days) {
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toGMTString();
        }
        document.cookie = name + '=' + value + expires + '; path=/';
    }

    toggleAside = function (aside) {
        if (aside.classList.contains('left-aside')) {
            if (aside.classList.contains('hidden-left-aside')) {
                aside.classList.remove('hidden-left-aside')
                aside.children[0].children[0].children[0].innerHTML = '9';
            }
            else {
                aside.classList.add('hidden-left-aside')
                aside.children[0].children[0].children[0].innerHTML = '!';
            }
        }
        else {
            if (aside.classList.contains('hidden-right-aside')) {
                aside.classList.remove('hidden-right-aside')
            }
            else {
                aside.classList.add('hidden-right-aside')
            }
        }
    }

    toggleClass = (div, className) => {
        if (div.classList.contains(className)) {
            div.classList.remove(className)
        } else {
            div.classList.add(className)
        }
    }

    shuffleArray = (array) => {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    playSound = function (sound) {
        console.log(sound)
        let soundElement;
        switch (sound) {
            case "right":
                soundElement = document.getElementById('rightAudio')
                break;
            case "wrong":
                soundElement = document.getElementById('wrongAudio')
                break;
            case "winner":
                soundElement = document.getElementById('winnerAudio')
                break;
            case "money":
                soundElement = document.getElementById('moneyAudio')
                break;
            case "click":
                soundElement = document.getElementById('clickAudio')
                break;
        }
        soundElement.pause();
        soundElement.currentTime = 0;
        soundElement.play();
    }

    playNote = function (sound) {
        console.log(sound)
        let soundElement;
        switch (sound) {
            case "c":
                soundElement = document.getElementById('cNote')
                break;
            case "d":
                soundElement = document.getElementById('dNote')
                break;
            case "e":
                soundElement = document.getElementById('eNote')
                break;
            case "f":
                soundElement = document.getElementById('fNote')
                break
            case "g":
                soundElement = document.getElementById('gNote')
                break;
            case "a":
                soundElement = document.getElementById('aNote')
                break;
        }
        soundElement.pause();
        soundElement.currentTime = 0;
        soundElement.play();
    }

    /*------------------------------------------------------------------------
     *              PUBLIC METHODS
     */
    return {
        ajax,
        decodeImage,
        htmlDiv,
        htmlp,
        init,
        goHome,
        playGame,
        getCookie,
        setCookie,
        toggleAside,
        hideLoader,
        getValue,
        setValue,
        toggleClass,
        shuffleArray,
        hideElementFade,
        showElementFade,
        playSound,
        playNote,
    };
}());
