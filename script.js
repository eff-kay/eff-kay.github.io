function timedscrolltoggle() {
    setTimeout(function () {
        document.body.classList.toggle('noscroll');
    }, 1000);
}

function toggles() {
    document.getElementById("card").classList.toggle('moveout');
    document.getElementById("overlay").classList.toggle('transp');
}




function toggleout() {
    timedscrolltoggle();
    toggles();
    document.getElementById("overlay").classList.remove('earlytransition');
}

function togglein() {
    document.body.classList.toggle('noscroll');
    toggles();
    document.getElementById("overlay").classList.toggle('earlytransition');
}

function insertCss(code) {
    let style = document.createElement('style');
    style.type = 'text/css';

    if (style.styleSheet) {
        // IE
        style.styleSheet.cssText = code;
    } else {
        // Other browsers
        style.innerHTML = code;
    }

    document.getElementsByTagName("head")[0].appendChild(style);
}

let scrollCSS = "::-webkit-scrollbar { width: .8em;}"
    + "::-webkit-scrollbar-track {background: lightgray; border: .35em solid #f0f0f0; border-radius: 10px; }"
    + "::-webkit-scrollbar-track { background: lightgray; border: .35em solid #f0f0f0; border-radius: 10px; }"
    + "::-webkit-scrollbar-thumb { background: #f0b1b1; border: .3em solid #f0f0f0; }"
    + "::-webkit-scrollbar-thumb:hover { background: #e05c5c; }"

function toggleHeight(clicked) {
    if (clicked.style.maxHeight) {
        clicked.style.maxHeight = null;
    } else {
        clicked.style.maxHeight = clicked.scrollHeight + "px";
    }

}

function setFullWidthHeader() {
    let wrapper = document.getElementsByClassName("collapsible-wrapper")[0];
    let width = wrapper.getBoundingClientRect().width;
    // remove padding width of sectionHead (3px, 5px)
    width -= 8; 
    let sectionHead = document.getElementsByClassName("sectionhead")[0];
    sectionHead.style.width = width.toString()+'px';
}

window.addEventListener('load', () => {
    if (window.navigator.platform != 'MacIntel') {
        insertCss(scrollCSS);
    }

    console.log('inside')

    // fetch the url in the browser window
    let url = window.location.href;
    let urlSplit = url.split("/")[3].split(".")[0];
    console.log('urlSplit:', urlSplit, window.location.href); 

    let coll = document.getElementsByClassName("collapsible");
    for (let i = 0; i < coll.length; i++) {

        coll[i].addEventListener("click", function () {
            let contentList = document.getElementsByClassName("collapsible-content");
            let clicked = contentList[i];
            let actives = [];
            for (let j = 0; j < coll.length; j++) {
                if (coll[j].classList.contains("active")) {
                    actives.push(j);
                }
            }
            if (actives.length == 0 || actives[0] == i) {
                // none are open or the clicked one is open
                toggleHeight(clicked);
                coll[i].classList.toggle("active");
            }
            else {
                // one is open but not the one clicked now 
                toggleHeight(contentList[actives[0]]);
                coll[actives[0]].classList.toggle("active");
                setTimeout(() => {
                    toggleHeight(clicked);
                    coll[i].classList.toggle("active");
                }, 150);
            }
        });
    }


    // start with one open
    coll[0].click();
    setFullWidthHeader();
})

window.addEventListener('resize', setFullWidthHeader);