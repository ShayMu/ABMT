let instructionsDiv = document.getElementById('instructions');

let activityDiv = document.getElementById('activity');
let plusDiv = document.getElementById('plus');
let picturesDiv = document.getElementById('pictures');
let probeDiv = document.getElementById('probes');
let topProbeDiv = document.getElementById('topProbe');
let botProbeDiv = document.getElementById('botProbe');

let midPauseDiv = document.getElementById('midPause');
let midPauseAvgDiv = document.getElementById('pauseAvgResTime');
let midPauseResDiv = document.getElementById('pauseResults');

let finishDiv = document.getElementById('finish');

let mouseClicked = null;
let probeLocation = null;
let pictureIdx = null;
let pictureType = null;

let currentRound = 0;
let sectionCorrectAnswers = 0;
let sectionResponseTimeSum = 0;
let shouldLog = false;

const numberOfImages = 20;
const numOfRepeatsPerPause = 40;
const numOfPauses = 4;
const delay = 500;

const neutralImages = [];
const negativeImages = [];

loadAllImages();
showInstructions();

function start() {
    initSessionLog();
    loopIt();
}

async function loopIt() {
    currentRound = 0;

    for (let i=0; i < numOfPauses; i++) {
        showActivity();
        sectionCorrectAnswers = 0;
        sectionResponseTimeSum = 0;
        for (let j=0 ; j < numOfRepeatsPerPause ; j++) {
            currentRound++;
            await fullCircle();
        }

        showMidPause();
        await waitForResponse();
    }

    finish();
}

async function fullCircle(){
    refreshPhotos();
    showStep(1);
    await sleep(delay);
    showStep(2);
    await sleep(delay);
    setProbe();
    showStep(3);
    await waitForResponse();
    showStep(4);
    await sleep(delay);
    
}

function setProbe() {
    let content = getRndInteger(0, 2) == 0? '>' : '<';

    if (probeLocation == 'top') {
        topProbeDiv.innerHTML = content;
        botProbeDiv.innerHTML = '';
    }

    if (probeLocation == 'bot') {
        botProbeDiv.innerHTML = content;
        topProbeDiv.innerHTML = '';
    }
}

function showStep(step) {
    switch (step) {
        // plus
        case 1: {
            plusDiv.style.display = '';
            picturesDiv.style.display = '';
            picturesDiv.style.opacity = '0';
            probeDiv.style.display = 'none';
        } break;
        // pictures
        case 2: {
            plusDiv.style.display = 'none';
            picturesDiv.style.opacity = '1';
            probeDiv.style.display = 'none';
        } break;
        // probe
        case 3: {
            plusDiv.style.display = 'none';
            picturesDiv.style.display = 'none';
            probeDiv.style.display = '';
        } break;
        // blank
        case 4: {
            plusDiv.style.display = 'none';
            picturesDiv.style.display = 'none';
            probeDiv.style.display = 'none';
        } break;
    }
}

function showInstructions() {
    showMouse();
    activityDiv.style.display = 'none';
    midPauseDiv.style.display = 'none';
    finishDiv.style.display = 'none';
    instructionsDiv.style.display = '';
}

function showActivity() {
    shouldLog = true;
    hideMouse();
    activityDiv.style.display = '';
    midPauseDiv.style.display = 'none';
    finishDiv.style.display = 'none';
    instructionsDiv.style.display = 'none';
}

function showMidPause() {
    shouldLog = false;
    showMouse();
    activityDiv.style.display = 'none';
    midPauseDiv.style.display = '';
    finishDiv.style.display = 'none';
    instructionsDiv.style.display = 'none';

    midPauseAvgDiv.innerText = `${(sectionResponseTimeSum / numOfRepeatsPerPause).toFixed(0)} מילישניות`;
    midPauseResDiv.innerText = `${sectionCorrectAnswers} מתוך ${numOfRepeatsPerPause} (${(sectionCorrectAnswers / numOfRepeatsPerPause * 100).toFixed(0)}%)`;
}

function finish() {
    shouldLog = false;
    showMouse();
    activityDiv.style.display = 'none';
    midPauseDiv.style.display = 'none';
    finishDiv.style.display = '';
    instructionsDiv.style.display = 'none';

    saveSessionInfo();
}

function showMouse() {
    document.body.style.cursor = '';
}

function hideMouse() {
    document.body.style.cursor = 'none';
}

function setMouseClick(btn) {
    mouseClicked = btn;
}

async function waitForResponse() {
    mouseClicked = null;
    let start = new Date().getTime();
    return new Promise(async resolve => {
        while(mouseClicked == null) {
            await sleep(50);
        }

        if (shouldLog) {
            let end = new Date().getTime();

            let currProbLoc = topProbeDiv.innerText != '' ? 'top' : 'bot';
            let currProbeDir = currProbLoc == 'top' ? topProbeDiv.innerText : botProbeDiv.innerText;
            let isCorrect = (currProbeDir == '>' && mouseClicked == 'right') || (currProbeDir == '<' && mouseClicked == 'left');

            if (isCorrect) sectionCorrectAnswers++;
            sectionResponseTimeSum += (end - start);

            logInfo(currentRound, end - start, isCorrect, currProbLoc, currProbeDir, pictureType, pictureIdx);
        }

        resolve(mouseClicked);
    });
}

async function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

function refreshPhotos() {
    let topPicEle = document.getElementById('topPic');
    let botPicEle = document.getElementById('botPic');

    let indexImg = getRndInteger(0, numberOfImages - 1);

    while (!negativeImages[indexImg] || !neutralImages[indexImg]) {
        indexImg = getRndInteger(0, numberOfImages - 1);
    }

    let placeRnd = getRndInteger(0, 2);
    pictureIdx = indexImg + 1;

    if (placeRnd == 0) {
        botPicEle.src = negativeImages[indexImg].src;
        topPicEle.src = neutralImages[indexImg].src;
        probeLocation = 'top';
        pictureType = 'neutral';
    }
    else {
        topPicEle.src = negativeImages[indexImg].src;
        botPicEle.src = neutralImages[indexImg].src;
        probeLocation = 'bot';
        pictureType = 'neutral';
    }
}

async function loadAllImages() {
    document.getElementsByClassName('whiteBlock')[0].style.display = 'none';
    return new Promise(async resolve => {

        let loadedCount = 0;

        for (let i=0; i<numberOfImages; i++) {
            let indexImg = i + 1;
            let url = await getImage(`images/angry/${indexImg}.jpeg`);
            negativeImages[i] = new Image();
            negativeImages[i].onload = () => {
                updateLoader((++loadedCount / (numberOfImages * 2) * 100));
            };
            negativeImages[i].src = url;

            url = await getImage(`images/neutral/${indexImg}.jpeg`);
            neutralImages[i] = new Image();
            neutralImages[i].onload = () => {
                updateLoader((++loadedCount / (numberOfImages * 2) * 100));
            };
            neutralImages[i].src = url;

            await sleep(100);
        }

        resolve();
    });
}

function updateLoader(percent) {
    document.getElementById('loadingValue').innerText = (percent + 40);

    if (percent >= 60) {
        document.getElementById('loadingPopup').style.display = 'none';
        document.getElementsByClassName('whiteBlock')[0].style.display = '';
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}