let statsPopupDiv = document.getElementById('statsPopup');
let statsPopupContentDiv = document.getElementById('statsPopupContent');

let avgResTimeDiv = document.getElementById('avgResTime');
let correctCountDiv = document.getElementById('correctCount');
let totalCountDiv = document.getElementById('totalCount');
let sessionBreakdownDiv = document.getElementById('sessionBreakdown');
let correctPercentDiv = document.getElementById('correctPercent');

let statsStorageKey = 'cool';
let sessionInfo = getLastSessionInfo();


function initSessionLog() {
    sessionInfo = [];
}

function updateStatsDisplay() {
    let avgResTime = (sessionInfo.reduce((total, curr) => total + curr.responseTime, 0) / sessionInfo.length) / 1000;
    let total = sessionInfo.length;
    let correct = sessionInfo.filter(x=>x.isCorrect).length;

    avgResTimeDiv.innerText = avgResTime;
    totalCountDiv.innerText = total;
    correctCountDiv.innerText = correct;
    correctPercentDiv.innerText = correct / total * 100;

    let html = '';

    for (let i of sessionInfo) {
        html += `<div class="sessionBreakdownItem"><div>${i.roundNum}</div><div>${i.isCorrect}</div><div>${i.responseTime / 1000}</div></div>`;
    }


    sessionBreakdownDiv.innerHTML = html;
}

function logInfo(roundNum, responseTime, isCorrect) {
    sessionInfo.push({ roundNum, responseTime, isCorrect });
}

function saveSessionInfo() {
    window.localStorage.setItem(statsStorageKey, JSON.stringify(sessionInfo));
}

function getLastSessionInfo() {
    try {
        return JSON.parse(window.localStorage.getItem(statsStorageKey));
    }
    catch(e) {
        return null;
    }
}



function KeyPress(e) {
    var evtobj = window.event? window.event : e;
    if (evtobj.keyCode == 83 && evtobj.altKey) {
        if(statsPopupContentDiv.classList.contains('popupShow')) {
            // hiding popup
            statsPopupContentDiv.classList.remove('popupShow');
            statsPopupContentDiv.classList.add('popupHide');

            setTimeout(()=>{
                statsPopupDiv.style.display = 'none';
            }, 1100);
        }
        else {
            // showing popup
            updateStatsDisplay();
            statsPopupDiv.style.display = '';
            setTimeout(()=>{
                statsPopupContentDiv.classList.remove('popupHide');
                statsPopupContentDiv.classList.add('popupShow');
            }, 50);

        }
    }
}

document.onkeydown = KeyPress;

//KeyPress({keyCode: 83, altKey: true});