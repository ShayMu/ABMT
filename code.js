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

const numberOfImages = 20;
const numOfRepeats = 4;

showInstructions();

function start() {
    loopIt();
}

async function loopIt() {
    let delay = 500;
    showActivity();

    for (let i=0 ; i < numOfRepeats / 2 ; i++) {
        await fullCircle(delay);
    }

    showMidPause();
    await waitForResponse();
    showActivity();

    for (let i=0 ; i < numOfRepeats / 2 ; i++) {
        await fullCircle(delay);
    }

    finish();
}

async function fullCircle(delay){
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
    hideMouse();
    activityDiv.style.display = '';
    midPauseDiv.style.display = 'none';
    finishDiv.style.display = 'none';
    instructionsDiv.style.display = 'none';
}

function showMidPause() {
    showMouse();
    activityDiv.style.display = 'none';
    midPauseDiv.style.display = '';
    finishDiv.style.display = 'none';
    instructionsDiv.style.display = 'none';
}

function finish() {
    showMouse();
    activityDiv.style.display = 'none';
    midPauseDiv.style.display = 'none';
    finishDiv.style.display = '';
    instructionsDiv.style.display = 'none';
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
    return new Promise(async resolve => {
        while(mouseClicked == null) {
            await sleep(100);
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

    if (placeRnd == 0) {
        topPicEle.style.backgroundImage = `url('images/neutral/${indexImg}.jpeg')`;
        botPicEle.style.backgroundImage = `url('images/angry/${indexImg}.jpeg')`;
        probeLocation = 'top';
    }
    else {
        botPicEle.style.backgroundImage = `url('images/neutral/${indexImg}.jpeg')`;
        topPicEle.style.backgroundImage = `url('images/angry/${indexImg}.jpeg')`;
        probeLocation = 'bot';
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}