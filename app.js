window.onload = (event) => {
    resizeContents();
    preloadImages(imageSrcs);
    document.querySelector('#loader').classList.add('done');
    document.querySelector('.container').classList.add('done');
    setTimeout(() => {document.querySelector('#loader').style.display = "none";}, 500);
    if (!scrolled) {
        setTimeout(() => {mouseIcon.classList.add('waiting');}, 5000);
    }
};

let prData;
const plSelect = document.querySelector('.player-selector');

fetch('./23act2.json')
    .then((response) => response.json())
    .then((json) => prData = (json))
    .then((prData) => createImageArray());

function preloadImages(srcs) {
    if (!preloadImages.cache) {
        preloadImages.cache = [];
    }
    let img;
    for (i = 0; i < srcs.length; i++) {
        img = new Image();
        img.src = srcs[i];
        preloadImages.cache.push(img);
    }
}

let imageSrcs = []
function createImageArray() {
    for(i = 0; i < prData.length; i++) {
        imageSrcs[i] = "assets/" + prData[i].tag  + ".gif";
    }
}

//mobile scroll
window.addEventListener("touchstart", startTouch, false);
window.addEventListener("touchmove", moveTouch, false);

let initialY = null;

function startTouch(e) {
  initialY = e.touches[0].clientY;
};

function moveTouch(e) {

  if (initialY === null) {
    return;
  }

  let currentY = e.touches[0].clientY;

  let diffY = initialY - currentY;

    if (diffY > 0  && (!e.target.closest('.blurb-container')) && (mediaQuery.matches)) {
        scrollEvent(120);
    } else if ((!e.target.closest('.blurb-container')) && (mediaQuery.matches)) {
        scrollEvent(-120);
    }  

  initialY = null;

  e.preventDefault();
};

const mediaQuery = window.matchMedia('(min-width: 768px)');
const mouseIcon = document.querySelector('.mouse-icon');

window.addEventListener('wheel', (e) => {
    if ((!e.target.closest('.blurb-container')) && (mediaQuery.matches)) {
        scrollEvent(e.deltaY);
    }
});

let scrolled = false;

function scrollEvent(delta) {
    let rightTop = document.querySelector('.right-top');
    let rightBot = document.querySelector('.right-bottom');
    if (delta > 0) {
        if(!rightTop.classList.contains('scrolled-down')) {
            rightTop.classList.add('scrolled-down');
            rightBot.classList.add('scrolled-down');
            
            if(mouseIcon.classList.contains('waiting')) {
                mouseIcon.classList.remove('waiting');
                setTimeout(() => {mouseIcon.style.display = "none"}, 250);
            }
        }
    } else {
        if(rightTop.classList.contains('scrolled-down')) {
            rightTop.classList.remove('scrolled-down');
            rightBot.classList.remove('scrolled-down');
        }
    }
    scrolled = true;
    if (scrolled) {
        mouseIcon.style.display = "none"
    }
}

window.addEventListener("orientationchange", function() {
    setTimeout(() => {resizeContents();}, 500);
    scrollEvent(-120);
});

let timeout = false;

window.addEventListener('resize', function() {
    clearTimeout(timeout);
    timeout = setTimeout(resizeContents, 250);
});

let plSelectTags = document.querySelectorAll('.player-select-tag');

function resizeContents() {
    plSelectTags.forEach(fitText);
    fitText(plTag, 1, false);
    fitText(plName, 1, false);
}

function fitText(text, index, preview) {
    let textWidth = text.offsetWidth;
    let parentWidth;
    let siblingWidth = 0;
    let sizeProportion;
    if (preview) {
        parentWidth = text.parentElement.offsetWidth;
        siblingWidth = text.previousElementSibling.offsetWidth;
    }
    parentWidth = text.parentElement.parentElement.offsetWidth;
    sizeProportion = ((parentWidth - siblingWidth) / textWidth).toFixed(2);
    if(textWidth > (parentWidth - siblingWidth)) {
        text.style.transform = `scaleX(${sizeProportion})`;
    } else {
        text.style.transform = `unset`;
    }
    // console.log(text.textContent + ": text width = " + textWidth + " | parent width = " + parentWidth + " | sibling width = " + siblingWidth + " | scale = " + sizeProportion);
}

plSelect.addEventListener('click', (e) => {
    let targetCont = e.target.closest('.player-select-container');
    if(!(targetCont.classList.contains("active"))) {
        document.querySelector('.player-select-container.active').classList.remove("active");
        targetCont.classList.toggle("active");
        let plSelectRank = targetCont.querySelector('.player-select-rank').textContent;
        changePlayerPreview(prData[plSelectRank - 1]);
    }
})

let plName = document.querySelector('.player-name'),
    plTag = document.querySelector('.player-tag'),
    plStatue = document.querySelector('.player-statue'),
    plRank = document.querySelector('.player-rank'),
    plTwit = document.querySelector('.player-twitter'),
    twLogo = document.querySelector('#twitter-logo');

let blVtrAvg = document.querySelector('.voter-average').querySelector('.data-value'),
    blWinLoss = document.querySelector('.win-loss').querySelector('.data-value'),
    blPREvents = document.querySelector('.pr-events').querySelector('.data-value'),
    blResults = document.querySelector('.player-results').children,
    blAuthor = document.querySelector('.blurb-author'),
    blSection = document.querySelector('.blurb');

function changePlayerPreview(playerNum) {
    // fix bug when switching too fast
    // probably separate sequences by function, then when switching
    // before sequence is done it may be canceled/overwritten
    let newPlName = plName.cloneNode(true),
        newPlTag = plTag.cloneNode(true),
        newPlStatue = plStatue.cloneNode(true),
        newPlRank = plRank.cloneNode(true), 
        newPlTwit = plTwit.cloneNode(true);

        newPlName.textContent = playerNum.realName;
        newPlTag.textContent = playerNum.tag;
        newPlStatue.querySelector('.player-statue-image').src = `assets/${playerNum.tag}.gif`;
        newPlRank.innerHTML = `<span class="number-sign">#</span>` + playerNum.rank;
        newPlTwit.querySelector('.player-twitter-handle').textContent = playerNum.twitterHandle;
        newPlTwit.querySelector('#twitter-link').href = `https://twitter.com/${playerNum.twitterHandle}`;

        if(playerNum.twitterHandle == "")
        { newPlTwit.querySelector('#twitter-logo').style.visibility = "hidden"; }
        else { newPlTwit.querySelector('#twitter-logo').style.visibility = "unset"; }

    plName.classList.add("fade-out");
    plTag.classList.add("slide-out-left");
    plTwit.classList.add("fade-out");
    plRank.classList.add("slide-out-left");
    plStatue.classList.add("fade-out");
    setTimeout(() => {}, 150);

    newPlName.classList.add("fade-in");
    newPlTag.classList.add("slide-in-left");
    newPlRank.classList.add("slide-in-left");
    newPlTwit.classList.add("fade-in");
    newPlStatue.classList.add("slide-in-bottom");
    setTimeout(() => {}, 150);

    plName.after(newPlName);
    plTag.after(newPlTag);
    plRank.after(newPlRank);
    plStatue.after(newPlStatue);
    plTwit.after(newPlTwit);

    fitText(newPlTag, 1, false);
    fitText(newPlName, 1, false);

setTimeout(() => {
    plTag.remove();
    plName.remove();
    plRank.remove();
    plStatue.remove();
    plTwit.remove();
    plName = document.querySelector('.player-name');
    plTag = document.querySelector('.player-tag');
    plStatue = document.querySelector('.player-statue');
    plRank = document.querySelector('.player-rank');
    plTwit = document.querySelector('.player-twitter');
    plName.classList.remove("fade-in");
    plTag.classList.remove("slide-in-left");
    plTwit.classList.remove("fade-in");
    plRank.classList.remove("slide-in-left");
    plStatue.classList.remove("slide-in-bottom");
    setTimeout(() => {}, 150);
}, 600);

    updateBlurb(playerNum);
}

function updateBlurb(playerNum) {
    blVtrAvg.textContent = playerNum.voterAverage;
    blWinLoss.textContent = playerNum.winLoss;
    blPREvents.textContent = playerNum.prEvents;
    
    playerNum.placements.forEach((element, index) => {
        let result = blResults[index];
        let placement = element.placing.match(/\d+/g);
        let suffix = element.placing.match(/[a-zA-Z]+/g);
        result.querySelector('.event').textContent = element.event;
        result.querySelector('.placement').innerHTML = `${placement}<span class="placement-suffix">${suffix}</span>`;
    });
    
    let authTwit;
    let authText;
    let author = playerNum.blurbAuthor;

    switch(author) {
        case "Dr. Hunk":
            authTwit = "wusstunes";
            authText = 'by Matthew "Dr. Hunk" Koester';
            break;

        case "tenacity":
            authTwit = "tenacityok";
            authText = 'by Kevin "tenacity" Donnelly';
            break;

        case "lovestory4a":
            authTwit = "inalovestory4a";
            authText = 'by "lovestory4a"';
            break;

        case "Dragoid":
            authTwit = "imdragoid";
            authText = 'by John "Dragoid" Sori';
            break;

        case "influenza":
            authTwit = "bearpottedplant";
            authText = 'by Ashley "influenza"';
            break;

        case "Kadence":
            authTwit = "kadenceplays";
            authText = 'by "Kadence"';
            break;
    }

    blAuthor.querySelector('#author-twitter').href = `https://twitter.com/${authTwit}`;
    blAuthor.querySelector('.author-text').textContent = authText;

    blSection.innerHTML = '';
    playerNum.blurb.forEach((element) => {
        let createPara = (element) => {
            let blPara = document.createElement("div");
            blPara.classList.add('blurb-paragraph');
            blPara.textContent = element;
            blSection.append(blPara);
        }
        createPara(element);
    });
}