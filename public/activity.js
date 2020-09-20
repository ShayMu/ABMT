let instructionsDiv = document.getElementById('instructions');

let activityDiv = document.getElementById('activity');
let plusDiv = document.getElementById('plus');
let picturesDiv = document.getElementById('pictures');
let probeDiv = document.getElementById('probes');
let topProbeDiv = document.getElementById('topProbe');
let botProbeDiv = document.getElementById('botProbe');

let midPauseDiv = document.getElementById('midPause');
let finishDiv = document.getElementById('finish');

let mouseClicked = null;
let probeLocation = null;
let pictureIdx = null;
let pictureType = null;

let currentRound = 0;
let shouldLog = false;

const numberOfImages = 20;
const numOfRepeats = 480;
const delay = 500;

const storage = firebase.app().storage('gs://abmt-7c76e.appspot.com').ref();

showInstructions();

function start() {
    initSessionLog();
    loopIt();
}

async function loopIt() {
    showActivity();
    refreshPhotos();
    currentRound = 0;

    for (let i=0 ; i < numOfRepeats / 2 ; i++) {
        currentRound++;
        await fullCircle();
    }

    showMidPause();
    await waitForResponse();
    showActivity();

    for (let i=0 ; i < numOfRepeats / 2 ; i++) {
        currentRound++;
        await fullCircle();
    }

    finish();
}

async function fullCircle(){
    showStep(1);
    await sleep(delay);
    showStep(2);
    await sleep(delay);
    setProbe();
    showStep(3);
    refreshPhotos();
    await waitForResponse();
    showStep(4);
    await sleep(delay);
    
}

function setProbe() {
    let content = getRndInteger(0, 2) == 0? '>' : '<';

    topProbeDiv.innerHTML = '';
    botProbeDiv.innerHTML = '';

    if (probeLocation == 'top') topProbeDiv.innerHTML = content;
    if (probeLocation == 'bot') botProbeDiv.innerHTML = content;
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

            let currProbeDir = probeLocation == 'top'? topProbeDiv.innerText : botProbeDiv.innerText;
            let isCorrect = (currProbeDir == '>' && mouseClicked == 'right') || (currProbeDir == '<' && mouseClicked == 'left');

            logInfo(currentRound, end - start, isCorrect, probeLocation, currProbeDir, pictureType, pictureIdx);
        }

        resolve(mouseClicked);
        topProbeDiv.innerHTML = '';
        botProbeDiv.innerHTML = '';
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

    let indexImg = getRndInteger(1, numberOfImages + 1);
    let placeRnd = getRndInteger(0, 2);
    pictureIdx = indexImg;

    storage.child(`images/angry/${indexImg}.jpeg`).getDownloadURL().then(url => {
        if (placeRnd == 0) botPicEle.style.backgroundImage = `url('${url}')`;
        else topPicEle.style.backgroundImage = `url('${url}')`;
    });

    storage.child(`images/neutral/${indexImg}.jpeg`).getDownloadURL().then(url => {
        if (placeRnd == 0) topPicEle.style.backgroundImage = `url('${url}')`;
        else botPicEle.style.backgroundImage = `url('${url}')`;
    });

    if (placeRnd == 0) {
        probeLocation = 'top';
        pictureType = 'neutral';
    }
    else {
        probeLocation = 'bot';
        pictureType = 'neutral';
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}