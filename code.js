let plusDiv = document.getElementById('plus');
let picturesDiv = document.getElementById('pictures');
let probeDiv = document.getElementById('probes');
let topProbe = document.getElementById('topProbe');
let botProbe = document.getElementById('botProbe');
let startButton = document.getElementById('startButton');

let mouseClicked = null;
let probeLocation = null;

let isStarted = false;
const numberOfImages = 20
const numOfRepetInHalf = 10

showStep(0);

function start() {

    document.body.style.cursor = 'none';
    isStarted = true;
    loopIt();
}

async function loopIt() {
    let delay = 500;

    for (let i=0 ; i<numOfRepetInHalf ; i++) {
        await fullCircle(delay);
    }
    startButton.innerText = "Well done.\n You Done half.\n\n Click here when you are ready to continue."
    document.body.style.cursor = 'none';
    showStep(0);
    await waitForResponse();
    startButton.innerText = ''
    for (let i=0 ; i<numOfRepetInHalf ; i++) {
        await fullCircle(delay);
    }
    startButton.innerHTML = "Well done.\n You're done."
    startButton.style.cursor = 'none';
    showStep(0);
    await waitForResponse();
    startButton.disabled = true;
    isStarted = false;
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

    topProbe.innerHTML = '';
    botProbe.innerHTML = '';

    if (probeLocation == 'top') topProbe.innerHTML = content;
    if (probeLocation == 'bot') botProbe.innerHTML = content;
}

function showStep(step) {

    if (step == 0) startButton.style.display = '';
    else startButton.style.display = 'none';

    switch (step) {
        case 0: {
            plusDiv.style.display = 'none';
            picturesDiv.style.display = 'none';
            picturesDiv.style.opacity = '0';
            probeDiv.style.display = 'none';
        } break;
        case 1: {
            plusDiv.style.display = '';
            picturesDiv.style.display = '';
            picturesDiv.style.opacity = '0';
            probeDiv.style.display = 'none';
        } break;
        case 2: {
            plusDiv.style.display = 'none';
            picturesDiv.style.opacity = '1';
            probeDiv.style.display = 'none';
        } break;
        case 3: {
            plusDiv.style.display = 'none';
            picturesDiv.style.display = 'none';
            probeDiv.style.display = '';
        } break;
        case 4: {
            plusDiv.style.display = 'none';
            picturesDiv.style.display = 'none';
            probeDiv.style.display = 'none';
        } break;
    }
}

function setMouseClick(btn) {
    if (!isStarted) start();
    mouseClicked = btn;
}

async function waitForResponse() {
    mouseClicked = null;
    return new Promise(async resolve => {
        while(mouseClicked == null) {
            await sleep(100);
        }
        resolve(mouseClicked);
        topProbe.innerHTML = '';
        botProbe.innerHTML = '';
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